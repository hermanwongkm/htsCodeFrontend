import axios from "./index.js";

export const getTable = async search => {
  search = search.toString().toLowerCase();
  try {
    const res = await axios.get(`/search/${search}`);
    return {
      extractedTable: res.data[0],
      hit_list: res.data[1]
    };
  } catch (err) {
    return {
      extractedTable: [],
      hit_list: []
    };
  }
};

export const updateDatabase = async () => {
  const res = await axios.get(`/fetch/getLatest`);
  return res;
};

export const updateFromLocal = async () => {
  const res = await axios.get(`/fetch/getLocal`);
  return res;
};

export const uploadFromLocal = async data => {
  const res = await axios.post("/upload", data, {});
  return res;
};
