<template>
  <div class="login-container">
    <div class="login-box">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" v-model="email" required  placeholder="Enter Email"/>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" type="password" v-model="password" required placeholder="Enter Password"/>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    localStorage.setItem('token', response.token);
    router.push('/');
  } catch (error) {
    alert('Invalid email or password.');
  }
};

// Import the SCSS file

</script>
<style lang="scss" scoped>

@import "@/assets/styles/login.scss";

</style>
