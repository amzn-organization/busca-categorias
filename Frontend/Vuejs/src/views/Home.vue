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
      <div class="loading" v-if="isLoading">
        <svg
          version="1.1"
          id="loader-1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          width="40px"
          height="40px"
          viewBox="0 0 40 40"
          enable-background="new 0 0 40 40"
          xml:space="preserve"
        >
          <path
            opacity="0.2"
            fill="#000"
            d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
    s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
    c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
          />
          <path
            fill="#000"
            d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
    C22.32,8.481,24.301,9.057,26.013,10.047z"
          >
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="rotate"
              from="0 20 20"
              to="360 20 20"
              dur="0.5s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
      <div class="breadcrumb">
        <div v-for="(breadcrumb, index) in breadcrumb" :key="index">
          <template v-if="!breadcrumb.isFirstIndex">
            <a
              :href="`/categorias?pathById=${breadcrumb.path}&token=${token}`"
              >{{ breadcrumb.name }}</a
            >
          </template>

          <template v-else>
            <a :href="`/categorias?token=${token}`">{{ breadcrumb.name }}</a>
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
              {{ category.pathByName.replace(/,/g, " / ") }}
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
    token: "",
    requestedCategoryPathByName: "",
    isLoading: true,
  }),

  async mounted() {
    this.token = window.localStorage.getItem("inputToken");
    if (!this.token) {
      return this.$router.push("/");
    }
    this.isLoading = true;
    const pathById = this.$route.query.pathById;

    if (pathById) {
      await this.request([], true);
      this.updateBreadcrumb(pathById, this.requestedCategoryPathByName);
      return;
    }

    const { data } = await axios.get(
      `https://qk2nbyt8ed.execute-api.sa-east-1.amazonaws.com/dev/categories?token=${this.token}`
    );

    this.categories = data;
    this.isLoading = false;
  },

  methods: {
    async request(documents, currentCategoryHasChildren) {
      this.isLoading = true;
      if (!currentCategoryHasChildren) {
        window.open(documents[0]);
        return;
      }

      const pathById = this.$route.query.pathById;
      const { data } = await axios.get(
        `https://qk2nbyt8ed.execute-api.sa-east-1.amazonaws.com/dev/categories/search-by-path/${pathById}?token=${this.token}`
      );

      const oldCategoriesLength = this.categories.length;

      this.categories = data[0].children;
      this.isLoading = false;

      this.requestedCategoryPathByName = data[0].pathByName;

      if (!oldCategoriesLength) {
        return;
      }

      // this.updateBreadcrumb(data[0]);
    },
    redirectTo(pathById, pathByName, documents = [], hasChildren) {
      //this.$route.query.pathById
      const lastPathById = this.$route.query.pathById || pathById;
      this.$router.push(
        `?pathById=${pathById}&last=${lastPathById}&token=${this.token}`
      );
      this.request(documents, hasChildren);
      this.updateBreadcrumb(pathById, pathByName);
    },
    async search(event) {
      if (event.code !== "Enter") {
        return;
      }

      event.preventDefault();

      const { data } = await axios.get(
        `https://qk2nbyt8ed.execute-api.sa-east-1.amazonaws.com/dev/categories/search/${this.searchInputValue}?token=${this.token}`
      );

      this.updateBreadcrumb("", "");

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
