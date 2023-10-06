import knexConfig from "../../knexfile.js";
import knexLibrary from "knex";

const knex = knexLibrary(knexConfig);

const newWarehouse = async (req, res) => {
  //SELECT * FROM users WHERE email = 'email param'
  let existingUser = await knex
    .select("*")
    .from("users")
    .where({ email: email });
  
  //Insert user into database
  //TRY, if not return error in catch
  try {
    //INSERT INTO users (email, password, verification_code) 
    //values ('my email', 'my password', 'verification code')
    await knex("warehouses").insert({
        warehouse_name: "Brooklyn",
        address: "918 Morris Lane",
        city: "Brooklyn",
        country: "USA",
        contact_name: "Parmin Aujla",
        contact_position: "Warehouse Manager",
        contact_phone: "+1 (646) 123-1234",
        contact_email: "paujla@instock.com"
    });
    return res.status(201).json({
      message: `User created, please check your email: ${email} for verification instructions.`,
    });
  } catch (e) {
    return res.status(500).json({ message: e });
  }
};

export default { newWarehouse };