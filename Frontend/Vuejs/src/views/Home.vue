<template>
  <main>
    <header class="top-nav">
      <figure
        @click="
          $router.push('/');
          request([], true);
        "
        style="cursor: pointer"
      >
        <img
          :src="require('@/assets/aws-branco.png')"
          alt="Categorias amazon"
        />Amazon - Listagem de Categorias
      </figure>

      <input
        v-model="searchInputValue"
        id="search"
        type="text"
        placeholder="Pesquisar"
        @focus="searchInputIsFocused = true"
        @blur="searchInputIsFocused = false"
        @keyup="search($event)"
      />

      <div class="text-center mt font-sm" style="height: 24px">
        <template v-if="searchInputIsFocused"
          >Pressione ENTER para pesquisar</template
        >
      </div>
    </header>
    <div class="container">
      <div class="mb pa d-flex">
        <div v-for="(breadcrumb, index) in breadcrumb" :key="index">
          <template v-if="!breadcrumb.isFirstIndex">
            <a :href="`/?pathById=${breadcrumb.path}`">{{ breadcrumb.name }}</a>
          </template>

          <template v-else>
            <a href="/">{{ breadcrumb.name }}</a>
          </template>
          <span style="margin: 0 10px">/</span>
        </div>
      </div>

      <ul>
        <li
          class="list-items"
          v-for="(category, index) in categories"
          :key="index"
          @click="
            redirectTo(
              category.pathById,
              category.pathByName,
              category.documents,
              Boolean(category.children.length)
            )
          "
        >
          <div>
            <h5 class="category-name">{{ category.name }}</h5>
            <small class="category-info">
              <strong>Browse Node ID:</strong>
              {{ category.id }}
            </small>

            <template v-if="category.productType">
              <br />
              <small class="category-info">
                <strong>Product Type:</strong>
                {{ category.productType }}
              </small>
            </template>

            <p class="category-info">
              <strong>Path By Name:</strong>
              {{ category.pathByName.replace(/,/g, ", ") }}
            </p>
          </div>

          <div>
            <ChevronRightIcon
              class="icon text-warning"
              v-if="category.children.length"
            />

            <DownloadIcon class="icon" v-else />
          </div>
        </li>
      </ul>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import ChevronRightIcon from "vue-material-design-icons/ChevronRight.vue";
import DownloadIcon from "vue-material-design-icons/Download.vue";

export default {
  name: "Home",

  components: {
    ChevronRightIcon,
    DownloadIcon,
  },

  data: () => ({
    searchInputValue: "",
    searchInputIsFocused: false,
    categories: [],
    breadcrumb: [],
    requestedCategoryPathByName: "",
  }),

  async mounted() {
    const pathById = this.$route.query.pathById;

    if (pathById) {
      await this.request([], true);
      this.updateBreadcrumb(pathById, this.requestedCategoryPathByName);
      return;
    }

    const { data } = await axios.get("http://localhost:3333/categories");
    console.log("data (first request)", data);

    this.categories = data;
  },

  methods: {
    async request(documents, currentCategoryHasChildren) {
      if (!currentCategoryHasChildren) {
        window.open(documents[0]);
        return;
      }

      const pathById = this.$route.query.pathById;
      const { data } = await axios.get(
        `http://localhost:3333/categories/search-by-path/${pathById}`
      );

      const oldCategoriesLength = this.categories.length;

      this.categories = data[0].children;
      console.log("data", this.categories);

      this.requestedCategoryPathByName = data[0].pathByName;

      if (!oldCategoriesLength) {
        return;
      }

      // this.updateBreadcrumb(data[0]);
    },
    redirectTo(pathById, pathByName, documents = [], hasChildren) {
      //this.$route.query.pathById
      const lastPathById = this.$route.query.pathById || pathById;
      this.$router.push(`?pathById=${pathById}&last=${lastPathById}`);
      this.request(documents, hasChildren);
      this.updateBreadcrumb(pathById, pathByName);
    },
    async search(event) {
      if (event.code !== "Enter") {
        return;
      }

      event.preventDefault();

      const { data } = await axios.get(
        `http://localhost:3333/categories/search/${this.searchInputValue}`
      );

      if (!data.length) {
        alert("Nenhum resultado encontrado");
        return;
      }

      this.categories = data;
    },
    updateBreadcrumb(pathById, pathByName) {
      let mountedPath = "";
      pathByName = pathByName.replace(/, /g, "/");
      pathById = pathById.split(",");
      pathByName = pathByName.split(",");

      const basePathId = pathById[0];
      pathById.splice(0, 1);

      this.breadcrumb = [];

      for (const index in pathById) {
        const isFirstIndex = index === "0";

        mountedPath += isFirstIndex
          ? `${basePathId},${pathById[index]}`
          : `,${pathById[index]}`;

        this.breadcrumb.push({
          path: mountedPath,
          name: pathByName[index].replace(/\//g, ", "),
          isFirstIndex,
        });
      }
    },
  },
};
</script>
