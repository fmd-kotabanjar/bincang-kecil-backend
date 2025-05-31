
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

    const { accessCode } = await req.json()

    // Validate access code
    const { data: codeData, error: codeError } = await supabaseClient
      .from('generic_codes')
      .select('*')
      .eq('code_string', accessCode.toUpperCase())
      .eq('is_active', true)
      .single()

    if (codeError || !codeData) {
      return new Response(
        JSON.stringify({ error: 'Invalid or inactive access code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const permissions = codeData.permissions_granted_json as string[]
    let quotaToAdd = 0

    // Process each permission
    for (const permission of permissions) {
      if (permission.startsWith('request_quota_')) {
        const quota = parseInt(permission.replace('request_quota_', ''))
        quotaToAdd = Math.max(quotaToAdd, quota) // Take highest quota
      } else {
        // Insert permission (ignore if already exists)
        await supabaseClient
          .from('user_permissions')
          .insert({
            user_id: user.id,
            permission_key: permission,
            granted_by_code: accessCode.toUpperCase()
          })
          .select()
      }
    }

    // Update quota if applicable
    if (quotaToAdd > 0) {
      const { data: profileData } = await supabaseClient
        .from('profiles')
        .select('request_prompt_quota')
        .eq('id', user.id)
        .single()

      const newQuota = Math.max(profileData?.request_prompt_quota || 0, quotaToAdd)
      
      await supabaseClient
        .from('profiles')
        .update({ request_prompt_quota: newQuota })
        .eq('id', user.id)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Access code redeemed successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
