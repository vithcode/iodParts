<template>
    <div class="listing-container">
      <h1>Dynamic Listing with Pagination, Sorting, and Filtering</h1>
  
      <!-- Sorting and Filtering Controls -->
      <div class="controls">
        <div class="filter">
          <label for="category">Filter by Category:</label>
          <select id="category" v-model="selectedCategory" @change="filterItems">
            <option value="">All Categories</option>
            <option v-for="category in uniqueCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
  
        <div class="sort">
          <label for="sort">Sort by:</label>
          <select id="sort" v-model="selectedSort" @change="sortItems">
            <option value="name">Name</option>
            <option value="price">Price</option>
          </select>
        </div>
      </div>
  
      <!-- Display the current items -->
      <div class="items-grid">
        <div v-for="item in paginatedItems" :key="item.id" class="item-card">
          <img :src="item.image" :alt="item.name" />
          <h2>{{ item.name }}</h2>
          <p>{{ item.description }}</p>
          <p>Price: ${{ item.price }}</p>
          <p>Category: {{ item.category }}</p>
        </div>
      </div>
  
      <!-- Pagination Controls -->
      <div class="pagination-controls">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
  </template>
  
  
  <script setup>
import { ref, computed, onMounted, onBeforeMount} from 'vue';

import { useRouter } from 'vue-router';

const isAuthenticated = ref(false);
const itemss = ref([]);
const router = useRouter();

const items = ref([]); // All items
const filteredItems = ref([]); // Items after filtering and sorting
const currentPage = ref(1); // Current page
const itemsPerPage = 3; // Number of items per page

const selectedCategory = ref(''); // Selected category for filtering
const selectedSort = ref('name'); // Selected sorting option

onBeforeMount(async () => {
  if (process.client) {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redirect to login if token is missing
    } else {
      isAuthenticated.value = true; // Allow rendering
      // Fetch items for the listing page
      itemss.value = await $fetch('/api/listing');
    }
  }
});

// Fetch items from the API
onMounted(async () => {
  try {
    items.value = await $fetch('/api/items');
    filteredItems.value = items.value; // Initialize filtered items
  } catch (error) {
    console.error('Failed to fetch items:', error);
  }
});

// Get unique categories for filtering
const uniqueCategories = computed(() => {
  return [...new Set(items.value.map((item) => item.category))];
});

// Filter items based on the selected category
const filterItems = () => {
  if (selectedCategory.value) {
    filteredItems.value = items.value.filter((item) => item.category === selectedCategory.value);
  } else {
    filteredItems.value = items.value;
  }
  sortItems(); // Reapply sorting after filtering
  currentPage.value = 1; // Reset to the first page
};

// Sort items based on the selected sort option
const sortItems = () => {
  filteredItems.value.sort((a, b) => {
    if (selectedSort.value === 'name') {
      return a.name.localeCompare(b.name);
    } else if (selectedSort.value === 'price') {
      return a.price - b.price;
    }
    return 0;
  });
  currentPage.value = 1; // Reset to the first page
};

// Calculate total pages based on filtered items
const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage));

// Calculate items to display on the current page
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredItems.value.slice(start, end);
});

// Navigate to the previous page
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value -= 1;
};

// Navigate to the next page
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value += 1;
};

definePageMeta({
  middleware: 'auth',
});
</script>

  
<style lang="scss" scoped>
@import "@/assets/styles/login.scss";

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .filter,
  .sort {
    display: flex;
    flex-direction: column;
    label {
      font-weight: bold;
      margin-bottom: 5px;
    }
    select {
      padding: 8px;
      font-size: 1rem;
      border-radius: 4px;
      border: 1px solid #ddd;
    }
  }
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;

  .item-card {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    text-align: center;
    transition: box-shadow 0.3s;

    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin-bottom: 12px;
    }

    h2 {
      font-size: 1.2rem;
      margin-bottom: 8px;
    }

    p {
      font-size: 0.9rem;
      color: #555;
    }

    &:hover {
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
  }
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;

  button {
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: #0056b3;
    }

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }

  span {
    font-size: 1rem;
    font-weight: bold;
  }
}
</style>
