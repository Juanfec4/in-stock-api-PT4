import knexConfig from "../../knexfile.js";
import knexLibrary from "knex";

const knex = knexLibrary(knexConfig);

//DELETE
const handleDeleteInventoryItem = async (req, res) => {
  //Check if id param exists
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Missing id param." });
  }

  //Assign query
  let query = { id: req.params.id };

  try {
    //Check if item exists
    let items = await knex.select("*").from("inventories").where(query);
    if (items.length === 0) {
      return res
        .status(404)
        .json({ message: `Inventory item not found for id ${req.params.id}.` });
    }
    //Delete item
    await knex("inventories").where(query).del();
    return res
      .status(204)
      .json({ message: `Successfully deleted item ${req.params.id}.` });
  } catch (e) {
    return res.status(500).json({ message: e });
  }
};

export default {
  handleDeleteInventoryItem,
};
