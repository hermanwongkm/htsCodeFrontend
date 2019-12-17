import axios from "./index.js";

export const getTable = async search => {
  const res = await axios.get(`/search/${search}`);
  console.log(res.data);
  return {
    extractedTable: res.data
  };
};

export const updateDatabase = async search => {
  const res = await axios.get(`/fetch`);
  console.log(res);
  return {
    res
  };
};
