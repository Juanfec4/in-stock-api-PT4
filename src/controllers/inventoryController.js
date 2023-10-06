import knexConfig from "../../knexfile.js";
import knexLibrary from "knex";
import { validateRequestBody } from "../utils/helpers/validators.js";

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

//CREATE
const handleCreateInventoryItem = async (req, res) => {
  //Required params
  const keys = [
    "warehouse_id",
    "item_name",
    "description",
    "category",
    "status",
    "quantity",
  ];
  //Check for missing params
  let isComplete = validateRequestBody(keys, req);
  if (!isComplete) {
    return res.status(400).json({ message: "Missing properties." });
  }
  //Check if quantity is not a number
  if (Number.isNaN(Number(req.body.quantity))) {
    return res.status(400).json({ message: "Quantity is not a number." });
  }
  let query1 = { id: req.body.warehouse_id };

  //Extract values
  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body;
  try {
    //Check if warehouse id exists
    let warehouses = await knex.select("*").from("warehouses").where(query1);
    if (warehouses.length === 0) {
      return res.status(400).json({
        message: `Warehouse with id ${warehouse_id} does not exist.`,
      });
    }

    //Create item
    let createdID = await knex("inventories").insert({
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity,
    });

    //Get added record
    let createdRecord = await knex
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
      .where({ id: createdID[0] });
    return res.status(201).json(createdRecord);
  } catch (e) {
    return res.status(500).json({ message: e });
  }
};

//EDIT
const handleEditInventoryItem = async (req, res) => {
  //Check if id param is present
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Missing id param." });
  }
  //Required params
  const keys = [
    "warehouse_id",
    "item_name",
    "description",
    "category",
    "status",
    "quantity",
  ];
  //Check for missing params
  let isComplete = validateRequestBody(keys, req);
  if (!isComplete) {
    return res.status(400).json({ message: "Missing properties." });
  }
  //Check if quantity is not a number
  if (Number.isNaN(Number(req.body.quantity))) {
    return res.status(400).json({ message: "Quantity is not a number." });
  }

  let query1 = { id: req.body.warehouse_id };
  let query2 = { id: req.params.id };

  //Extract values
  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body;
  try {
    //Check if warehouse id exists
    let warehouses = await knex.select("*").from("warehouses").where(query1);
    if (warehouses.length === 0) {
      return res.status(400).json({
        message: `Warehouse with id ${warehouse_id} does not exist.`,
      });
    }
    //Update item
    await knex("inventories").where(query2).update({
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity,
    });

    //Get updated item
    let responseItem = await knex
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
      .where(query2);
    return res.status(200).json(responseItem);
  } catch (e) {
    return res.status(500).json({ message: e });
  }
};

export default {
  handleDeleteInventoryItem,
  handleEditInventoryItem,
  handleCreateInventoryItem,
};
