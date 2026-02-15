import { createClient } from '@/lib/supabase/client'

export async function isCurrentUserAdmin() {
  const supabase = createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { isAdmin: false, user: null }
  }

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (error) {
    return { isAdmin: false, user }
  }

  return { isAdmin: data?.role === 'admin', user }
}

export async function signOutAdminSession() {
  const supabase = createClient()
  await supabase.auth.signOut()
}
