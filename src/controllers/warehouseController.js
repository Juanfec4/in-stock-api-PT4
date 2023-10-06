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
      .column(
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
      .select()
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
      .column(
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
      .select()
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
  validateRequestBody(keys, req, (isComplete, message) => {
    if (!isComplete) {
      return res.status(400).json({ message });
    }
  });
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
      .column(
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
      .select()
      .from("warehouses")
      .where({ id: createdID[0] });

    //Convert result (Row packet into JSON object)
    let result = rowDataToJson(createdRecord);

    //Return created record
    return res.status(201).json(result);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e });
  }
};

//TODO

//EDIT

//DELETE

export default {
  getWarehouses,
  getWarehouse,
  createWarehouse,
};