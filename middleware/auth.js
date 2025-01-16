export default defineNuxtRouteMiddleware((to, from) => {
  const authToken = useCookie('jwt-token');

  if (!authToken.value) {
    // Redirect to login page if the user is not authenticated
    return navigateTo('/login');
  }
});
