<template>
  <div class="login-container">
    <div class="login-box">
    <img src="/images/iodparts_logo_text_white.png" alt="iodParts">
   
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group" :class="{ 'has-error': emailError }">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            v-model="email"
            required
            placeholder="Enter Email"
            @blur="validateEmail"
          />
          <span v-if="emailError" class="error-message">{{ emailError }}</span>
        </div>
        <div class="form-group" :class="{ 'has-error': passwordError }">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            v-model="password"
            required
            placeholder="Enter Password"
            @blur="validatePassword"
          />
          <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
        </div>
        <button type="submit" :disabled="!isFormValid">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const reloadKey = ref(0);

const email = ref('');
const password = ref('');
const emailError = ref('');
const passwordError = ref('');
const router = useRouter();

const validateEmail = () => {
  if (!email.value) {
    emailError.value = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Please enter a valid email address.';
  } else {
    emailError.value = '';
  }
};

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = 'Password is required.';
  } else if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters long.';
  } else {
    passwordError.value = '';
  }
};

// Form validation state
const isFormValid = computed(() => !emailError.value && !passwordError.value && email.value && password.value);

const handleLogin = async () => {
  validateEmail();
  validatePassword();

  if (!isFormValid.value) {
    return;
  }

  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    });
    console.log({response})
    const userToken = useCookie('jwt-token'); // Create a cookie named 'user-token'

// // Set the cookie value
userToken.value = response.token;

   
   await router.push('/listing');
  } catch (error) {
    console.log("error",error)
    alert('Invalid email or password.');
  }
};


// Import SCSS
</script>

<style lang="scss" scoped>
@import "@/assets/styles/login.scss";

img{
  background-color: #555;
  background-position: center;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.has-error input {
  border-color: red;
}
</style>
