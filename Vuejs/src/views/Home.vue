<template>
  <div class="w100">
    <div
      class="d-flex justify-center align-center"
      @click="
        $router.push('/');
        request([], true);
      "
      style="cursor: pointer"
    >
      <img
        class="mr"
        width="64"
        :src="require('@/assets/aws-branco.png')"
        alt="Logo AWS"
      />
      <h1>Amazon - Listagem de categorias</h1>
    </div>

    <hr />

    <div class="d-flex" style="margin: 0 90px">
      <input
        v-model="searchInputValue"
        id="search"
        type="text"
        class="w100"
        placeholder="Pesquisar"
        style="margin-top: 40px"
        @focus="searchInputIsFocused = true"
        @blur="searchInputIsFocused = false"
        @keyup="search($event)"
        :disabled="disableSearchInput"
      />
    </div>

    <div class="text-center mt font-sm" style="height: 24px">
      <template v-if="searchInputIsFocused"
        >Pressione ENTER para pesquisar</template
      >
    </div>

    <hr />

    <div class="text-center mb pa d-flex justify-center">
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

    <div class="d-flex justify-center">
      <div class="card" style="width: 680px">
        <div
          class="category-item"
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
            <h3 class="category-name">{{ category.name }}</h3>
            <br />
            <p class="category-info">BrowseNodeID: {{ category.id }}</p>
          </div>

          <div>
            <ChevronRightIcon
              class="icon text-warning"
              v-if="category.children.length"
            />

            <DownloadIcon class="icon text-warning" v-else />
          </div>
        </div>
      </div>
    </div>
  </div>
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
    disableSearchInput: false,
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

    this.disableSearchInput = true;
    const { data } = await axios.get("http://localhost:3000/categories");
    console.log("data (first request)", data);

    this.categories = data;
    this.disableSearchInput = false;
  },

  methods: {
    async request(documents, currentCategoryHasChildren) {
      this.disableSearchInput = true;

      if (!currentCategoryHasChildren) {
        window.open(documents[0]);
        return;
      }

      const pathById = this.$route.query.pathById;
      const { data } = await axios.get(
        `http://localhost:3000/categories/search-by-path/${pathById}`
      );

      const oldCategoriesLength = this.categories.length;

      this.categories = data[0].children;
      console.log("data", this.categories);
      this.disableSearchInput = false;

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
      this.disableSearchInput = true;

      const { data } = await axios.get(
        `http://localhost:3000/categories/search/${this.searchInputValue}`
      );

      this.disableSearchInput = false;

      if (!data.length) {
        alert("Nenhum resultado encontrado");
        return;
      }

      this.categories = data;
    },
    updateBreadcrumb(pathById, pathByName) {
      let mountedPath = "";
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
          name: pathByName[index],
          isFirstIndex,
        });
      }
    },
  },
};
</script>
