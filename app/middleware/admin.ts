export default defineNuxtRouteMiddleware(async () => {
  const supabase = useSupabaseClient()
  const localePath = useLocalePath()
  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    return navigateTo(localePath('/admin/login'))
  }
})
