<template>
  <div>
    <input type="text" v-model="searchTerm" />
    <p v-if="loading">Loading...</p>
    <p v-else-if="error">Something went wrong! Please try again</p>
    <template v-else>
      <p v-if="activeBook">
        Update {{ activeBook.title }} rating:
        <EditRating
          :initial-rating="activeBook.rating"
          :book-id="activeBook.id"
          @closeForm="activeBook = null"
        />
      </p>
      <p v-for="book in books" :key="book.id">
        {{ book.title }} = {{ book.rating }}
        <button @click="activeBook = book">Edit rating</button>
      </p>
    </template>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import ALL_BOOKS_QUERY from "../graphql/allBooks.query.gql";
import EditRating from "./components/EditRating.vue";

export default {
  name: "App",
  components: {
    EditRating,
  },
  setup() {
    const searchTerm = ref("");
    const activeBook = ref(null);
    const { result, loading, error } = useQuery(
      ALL_BOOKS_QUERY,
      () => ({
        search: searchTerm.value,
      }),
      () => ({
        debounce: 400,
        enabled: searchTerm.value.length > 2,
      })
    );

    const books = computed(() => result.value?.allBooks ?? []);

    return { result, searchTerm, loading, error, books, activeBook };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.list-wrapper {
  display: flex;
  margin: 0 auto;
  max-width: 960px;
}

.list {
  width: 50%;
}
</style>
