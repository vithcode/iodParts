<template>
  <div class="listing-container">
    <a href="/">
    <img src="/images/iodparts_logo_text_white.png" alt="iodParts">
  </a>
  
    <h1>Product listing page</h1>

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

    <div v-if="isLoading" class="loading-spinner">
      <p>Loading...</p>
      <!-- Add an actual spinner here if you'd like -->
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
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';

definePageMeta({
  middleware: 'auth', // Apply the 'auth' middleware to this page
});

const items = ref([]);
const filteredItems = ref([]);
const currentPage = ref(1);
const itemsPerPage = 3;

const selectedCategory = ref('');
const selectedSort = ref('name');
const isLoading = ref(true);

const pageTitle = ref('Dynamic Listing Page');
const pageDescription = ref(
  'Explore our dynamic listings with filtering, sorting, and pagination features. Find what you need easily!'
);

// Function to update meta tags
const updateMetaTags = () => {
  const category = selectedCategory.value ? selectedCategory.value : 'All Categories';
  pageTitle.value = `Listings - ${category} (Sorted by ${selectedSort.value})`;
  pageDescription.value = `Explore listings in the ${category} category, sorted by ${selectedSort.value}. Browse now!`;

  document.title = pageTitle.value; // Update the document title
  const metaDescription = document.querySelector("meta[name='description']");
  if (metaDescription) {
    metaDescription.setAttribute("content", pageDescription.value); // Update the meta description
  } else {
    const newMetaDescription = document.createElement("meta");
    newMetaDescription.name = "description";
    newMetaDescription.content = pageDescription.value;
    document.head.appendChild(newMetaDescription);
  }
};

// Fetch mock data on mount
onMounted(async () => {
  try {
    console.log("ghsghsgd")
    isLoading.value = true;
    // Fetch mock data from the Nuxt API
    const response = await axios.get('/api/listing/listingApi');
    console.log("response123",response)
    items.value = response.data; // Populate items with API data
    filteredItems.value = items.value; // Initialize filtered items
  } catch (error) {
    console.error('Failed to fetch data:', error.message);
  } finally {
    // Set loading to false once the API request is completed
    isLoading.value = false;
  }


  updateMetaTags();
});


// Watch for changes and update meta tags dynamically
watch([selectedCategory, selectedSort], () => {
  filterItems();
  updateMetaTags();
});

const uniqueCategories = computed(() => [...new Set(items.value.map((item) => item.category))]);

const filterItems = () => {
  if (selectedCategory.value) {
    filteredItems.value = items.value.filter((item) => item.category === selectedCategory.value);
  } else {
    filteredItems.value = items.value;
  }
  sortItems();
  currentPage.value = 1;
};

const sortItems = () => {
  filteredItems.value.sort((a, b) => {
    if (selectedSort.value === 'name') {
      return a.name.localeCompare(b.name);
    } else if (selectedSort.value === 'price') {
      return a.price - b.price;
    }
    return 0;
  });
  currentPage.value = 1;
};

const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage));

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredItems.value.slice(start, start + itemsPerPage);
});

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value -= 1;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value += 1;
};


</script>

<style>
/* General container styling */

img {
  background-color: #555;
} 

.listing-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
  color: #333;
}

/* Controls section styling */
.controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 10px;
}

.filter,
.sort {
  display: flex;
  flex-direction: column;
  font-size: 14px;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease;
}

select:focus {
  border-color: #007bff;
  outline: none;
}

/* Items grid styling */
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.item-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.item-card img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 10px;
}

.item-card h2 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #007bff;
  text-transform: capitalize;
}

.item-card p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

/* Pagination controls styling */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination-controls button {
  padding: 10px 20px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  transition: background-color 0.3s ease;
}

.pagination-controls button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.pagination-controls button:hover:not(:disabled) {
  background-color: #0056b3;
}

.pagination-controls span {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

/* Responsive design */
@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    gap: 15px;
  }

  .items-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .pagination-controls button {
    padding: 8px 15px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .controls {
    flex-direction: column;
  }

  .item-card h2 {
    font-size: 16px;
  }

  .item-card p {
    font-size: 12px;
  }

  .pagination-controls button {
    padding: 6px 10px;
    font-size: 12px;
  }
}
</style>
