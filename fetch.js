import axios from "axios";

const fetchData = async () => {
  try {
    const response = await axios.get("https://dummyjson.com/products/1");
    return response.data;
  } catch (error) {
    console.error("Error occurred while fetching data:", error);
    throw error;
  }
};

export default fetchData;
