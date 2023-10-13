import knexConfig from "../../knexfile.js";
import knexLibrary from "knex";
import {
  formatPhoneNumber,
  rowDataToJson,
} from "../utils/helpers/formatters.js";
import {
  isValidEmail,
  isValidPhoneNumber,
  validateRequestBody,
} from "../utils/helpers/validators.js";

const knex = knexLibrary(knexConfig);

//GET ALL
const getWarehouses = async (req, res) => {
  //Get all warehouses --> SELECT id, warehouse_name, address, etc... FROM warehouses

  try {
    const warehouses = await knex
      .select(
        "id",
        "warehouse_name",
        "address",
        "city",
        "country",
        "contact_name",
        "contact_position",
        "contact_phone",
        "contact_email"
      )
      .from("warehouses");
    //Convert result (Row packet into JSON object)
    let result = rowDataToJson(warehouses);

    //Return result
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ message: e });
  }
};

//GET 1
const getWarehouse = async (req, res) => {
  //Check for id param
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Missing id param." });
  }

  //Extract specific query
  let query = { id: req.params.id };

  try {
    //Get Warehouse
    const warehouse = await knex
      .select(
        "id",
        "warehouse_name",
        "address",
        "city",
        "country",
        "contact_name",
        "contact_position",
        "contact_phone",
        "contact_email"
      )
      .from("warehouses")
      .where(query);

    //Check if results are 0 (no warehouse found)
    if (warehouse?.length === 0) {
      return res
        .status(403)
        .json({ message: `Warehouse with id ${req.params.id} not found.` });
    }

    //Convert result (Row packet into JSON object)
    let result = rowDataToJson(warehouse);

    //Return result
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ message: e });
  }
};

//Get inventory @ Warehouse
const getInventoryAtWarehouse = async (req, res) => {
  const warehouseId = req.params.id;


  //Validate warehouseId
  if (!warehouseId) {
    return res.status(400).json({ message: 'Warehouse ID is required.' });
  }

  try {
    //Check if the warehouse exists
    const warehouseExists = await knex('warehouses').where('id', warehouseId).first();
    if (!warehouseExists) {
        return res.status(404).json({ message: 'Warehouse not found.' });
    }

    //Fetch Inventory items associated with the given warehouse
    const inventories = await knex('inventories').where('warehouse_id', warehouseId).select(
      'id',
      'item_name',
      'category',
      'status',
      'quantity'
    );
    return res.status(200).json(inventories)

    //Error Logging
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: `Internal Server Error. Message ${e.message}`});
  } 
};






//CREATE
const createWarehouse = async (req, res) => {
  //Required params
  const keys = [
    "contact_email",
    "contact_phone",
    "contact_position",
    "contact_name",
    "country",
    "city",
    "address",
    "warehouse_name",
  ];
  //Convert phone number string to phone number
  let phoneNumber = formatPhoneNumber(req.body.contact_phone);

  //Check for missing params
  let isComplete = validateRequestBody(keys, req);
  if (!isComplete) {
    return res.status(400).json({ message: "Missing properties." });
  }
  //Check for valid email address and phone number
  if (!isValidEmail(req.body.contact_email)) {
    return res
      .status(400)
      .json({ message: "Invalid email address, format: abcd@abcd.com" });
  }
  if (!isValidPhoneNumber(phoneNumber)) {
    return res.status(400).json({
      message:
        "Invalid phone number format, please provide a string containing countryCode, areaCode, centralOfficeCode, lineNumber",
      example_format: "Input:19197972875 -->  Output: +1 (919) 797-2875",
    });
  }
  //Extract values
  const {
    contact_email,
    contact_position,
    contact_name,
    country,
    city,
    address,
    warehouse_name,
  } = req.body;

  //Create record in DB
  try {
    let createdID = await knex("warehouses").insert({
      contact_email,
      contact_phone: phoneNumber,
      contact_position,
      contact_name,
      country,
      city,
      address,
      warehouse_name,
    });

    //Get added record
    let createdRecord = await knex
      .select(
        "id",
        "warehouse_name",
        "address",
        "city",
        "country",
        "contact_name",
        "contact_position",
        "contact_phone",
        "contact_email"
      )
      .from("warehouses")
      .where({ id: createdID[0] });

    //Convert result (Row packet into JSON object)
    let result = rowDataToJson(createdRecord);

    //Return created record
    return res.status(201).json(result);
  } catch (e) {
    return res.status(500).json({ message: e });
  }
};

//TODO

//EDIT
const editWarehouse = async (req, res) => {
  // Step 1: Log the incoming data
  console.log('Request Body:', req.body);
  console.log('Request Params:', req.params);
  

  // Step 2: Extract and Validate Data
  const {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email
  } = req.body;

  const warehouseId = req.params.id;

  const warehouseData = {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email
  };
  console.log('Warehouse Data:', warehouseData);

  // Check that the structured data is not empty
  if (!Object.values(warehouseData).every(value => value)) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // TODO: Validate phone and email format

  // Update Data
  try {
    const updatedRows = await knex('warehouses')
      .where('id', warehouseId)
      .update(warehouseData);

    if (!updatedRows) {
      return res.status(404).json({ message: 'Warehouse not found.' });
    }

    const updatedWarehouse = await knex('warehouses')
      .where('id', warehouseId)
      .first();

    // Respond
    return res.status(200).json(updatedWarehouse);

  } catch (e) {
    // Error Handling
    console.error(e);
    return res.status(500).json({ message: `Internal server error. ${e.message}` });
  }
}


//DELETE
const deleteWarehouse = async (req, res) => {
  //Check if id param exists
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Missing id param." });
  }

  let query = {id: req.params.id };

  try {
    //Check if warehouse exists
    let warehouse = await knex.select("*")
    .from("warehouses")
    .where(query);
    
    if (warehouse.length === 0) {
      return res
      .status(404)
      .json({ message: `Warehouse not found for id ${req.params.id}.` });
    }

    //Delete Iventory Items first
    await knex("inventories")
    .where({ warehouse_id: req.params.id })
    .del();

    //Delete Warehouse
    await knex("warehouses")
    .where(query)
    .del();

    return res
      .status(204)
      .json({ message: `Successfully deleted warehouse ${req.params.id}.` });
  } catch (e) {
    return res.status(500).json({ message: e });
  }
};

export default {
  getWarehouses,
  getWarehouse,
  createWarehouse,
  editWarehouse,
  getInventoryAtWarehouse,
  deleteWarehouse
};
