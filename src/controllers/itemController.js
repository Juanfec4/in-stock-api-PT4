import knexConfig from "../../knexfile.js";
import knexLibrary from "knex";
import { validateRequestBody } from "../utils/helpers/validators.js";

const knex = knexLibrary(knexConfig);

//GET
const getItem = async (req, res) => {
  //Check for id param
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Missing id param." });
  }
  //Extract specific query
  let query = { id: req.params.id };

  try {
    //Get Warehouse
    const items = await knex
      .select(
        "id",
        "warehouse_id",
        "item_name",
        "description",
        "category",
        "status",
        "quantity"
      )
      .from("inventories")
      .where(query)
      .first();

    const warehouse = await knex
      .select("warehouse_name")
      .from("warehouses")
      .where({ id: items.warehouse_id })
      .first();

    //Check if results are 0 (no warehouse found)
    if (items?.length === 0) {
      return res
        .status(403)
        .json({ message: `Item with id ${req.params.id} not found.` });
    }

    //Convert result (Row packet into JSON object)
    // let result = rowDataToJson(items);

    //Return result
    return res
      .status(200)
      .json({ ...items, warehouse_name: warehouse.warehouse_name });
  } catch (e) {
    return res.status(500).json({ message: e });
  }
};

export default {
  getItem,
};
