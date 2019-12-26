import axios from "./index.js";

export const getTable = async search => {
  let regexp = /^(\d{4}|\d{3})(\.\d{2}(\.\d{2}(\.\d{2})?)?)?$/g  // This is to match the hts / codes
  search = search.toString().toLowerCase();
  // search by hts_code
  if (search.match(regexp) != null) {
    try {
      console.log(search);
      const res = await axios.get(`/search/searchc/${search}`);
      return {
        extractedTable: res.data[0],
        hit_list: res.data[1]
      };
    } catch (err) {
      return {
        extractedTable: [],
        hit_list: [],
        hit_keylist:[]
      };
    }
    
  }else{ // search by keyword string
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
