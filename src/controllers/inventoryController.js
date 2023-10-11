import knexConfig from "../../knexfile.js";
import knexLibrary from "knex";
import { validateRequestBody } from "../utils/helpers/validators.js";

const knex = knexLibrary(knexConfig);

//GET
const handleGetInventories = async (req, res) => {
  console.log("Entering index function");

  try {
    let allInventories = await knex("inventories")
      .join("warehouses", "inventories.warehouse_id", "=", "warehouses.id")
      .select(
        "inventories.id",
        "warehouses.warehouse_name as warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      );

    res.status(200).json(allInventories);
  } catch (err) {
    console.error(err);
    res.status(400).send(`Error retrieving Inventories: ${err}`);
  }
};

//GET single Invetnroy Item
const getSingleItem = async (req, res) => {
  //Check for id param
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Missing id param." });
  }

  //Extract specific query

  try {
    //Get Inventory item details
    const inventory = await knex('inventories')
      .join('warehouses', 'inventories.warehouse_id', '=', 'warehouses.id')
      .select(
        'inventories.id',
        'warehouses.warehouse_name',
        'inventories.item_name',
        'inventories.description',
        'inventories.category',
        'inventories.status',
        'inventories.quantity'
      )
      .where('inventories.id', "=", req.params.id )
      .first();

    //Check if results are 0 (no inventory found)
    if (!inventory) {
      return res.status(404).json({ message: `No inventory found with id ${req.params.id}` });
    }

    //Convert result (Row packet into JSON object)
    let result = rowDataToJson(inventory); 
    
    //Return result
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ message: `error loading data ${e.message}` });
  }
};


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
  handleGetInventories,
  getSingleItem,
};
