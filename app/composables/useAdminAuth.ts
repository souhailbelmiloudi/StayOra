import type { User } from '@supabase/supabase-js'

export function useAdminAuth() {
  const supabase = useSupabaseClient()
  const user = useState<User | null>('admin-user', () => null)
  const loading = ref(true)

  async function getSession() {
    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user ?? null
    loading.value = false
    return user.value
  }

  async function login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    user.value = data.user
    return data.user
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
    navigateTo('/admin/login')
  }

  async function init() {
    if (!user.value) {
      await getSession()
    }
    return user.value
  }

  return {
    user,
    loading,
    login,
    logout,
    getSession,
    init,
  }
}
