import knexConfig from "../../knexfile.js";
import knexLibrary from "knex";

const knex = knexLibrary(knexConfig);

//GET categories
const getCategories = async (req, res) => {
  try {
    //Get categories
    const uniqueCategories = await knex
      .distinct("category")
      .from("inventories")
      .pluck("category");

    //Convert result (Row packet into JSON object)
    // let result = rowDataToJson(items);

    //Return result
    return res.status(200).json({ categories: uniqueCategories });
  } catch (e) {
    return res.status(500).json({ message: e });
  }
};

export default {
  getCategories,
};
