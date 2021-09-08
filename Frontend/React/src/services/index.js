import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333/",
});

export async function getCategories() {
  try {
    const { data } = await api.get("categories");
    return data;
  } catch (error) {
    throw error;
  }
}

export async function searchCategories(value) {
  try {
    const { data } = await api.get(`categories/search/${value}`);

    return data;
  } catch (error) {
    throw error;
  }
}

export async function searchByPath(pathById) {
  try {
    const { data } = await api.get(`categories/search-by-path/${pathById}`);

    return data;
  } catch (error) {
    throw error;
  }
}
