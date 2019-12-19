import axios from "./index.js";

export const getTable = async search => {
  const res = await axios.get(`/search/${search}`);
  console.log(res.data);
  return {
    extractedTable: res.data[0],
    hit_list: res.data[1],
  };
};

export const updateDatabase = async () => {
  const res = await axios.get(`/fetch/getLatest`);
  return {
    res
  };
};


export const updateFromLocal = async () => {
  const res = await axios.get(`/fetch/getLocal`);
  return {
    res
  };
};
