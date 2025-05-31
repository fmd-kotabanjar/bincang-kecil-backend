
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

    // Check if user is admin
    const { data: profileData } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profileData || profileData.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { action, data } = await req.json()

    switch (action) {
      case 'add':
        const { error: insertError } = await supabaseClient
          .from('generic_codes')
          .insert({
            code_string: data.code_string.toUpperCase(),
            description: data.description,
            permissions_granted_json: data.permissions_json,
            is_active: data.is_active
          })

        if (insertError) {
          throw insertError
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Code added successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'list':
        const { data: codes, error: listError } = await supabaseClient
          .from('generic_codes')
          .select('*')
          .order('created_at', { ascending: false })

        if (listError) {
          throw listError
        }

        return new Response(
          JSON.stringify({ success: true, data: codes }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'update_status':
        const { error: updateError } = await supabaseClient
          .from('generic_codes')
          .update({ is_active: data.is_active })
          .eq('id', data.id)

        if (updateError) {
          throw updateError
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Status updated successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
