import axios from "./index.js";

export const getTable = async search => {
  const res = await axios.get(`/test/${search}`);
  return {
    extractedTable: res.data[0],
    extractedCSV: res.data[1],
    flag: res.data[2]
  };
};
