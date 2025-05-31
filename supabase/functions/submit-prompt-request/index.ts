
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not authenticated' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { requestText } = await req.json()

    // Get user's quota
    const { data: profileData } = await supabaseClient
      .from('profiles')
      .select('request_prompt_quota')
      .eq('id', user.id)
      .single()

    if (!profileData || profileData.request_prompt_quota <= 0) {
      return new Response(
        JSON.stringify({ error: 'No request quota remaining' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Count existing requests this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count } = await supabaseClient
      .from('user_requests')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('requested_at', startOfMonth.toISOString())

    if (count >= profileData.request_prompt_quota) {
      return new Response(
        JSON.stringify({ error: 'Monthly request quota exceeded' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Insert request
    const { error: insertError } = await supabaseClient
      .from('user_requests')
      .insert({
        user_id: user.id,
        request_text: requestText
      })

    if (insertError) {
      throw insertError
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Request submitted successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
