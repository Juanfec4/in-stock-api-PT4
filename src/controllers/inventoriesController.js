import knexConfig from "../../knexfile.js";
import knexLibrary from "knex";

const knex = knexLibrary(knexConfig);

const index = async (req, res) => {
    console.log("Entering index function");
    
    try {
        let allInventories = await knex('inventories')
            .join('warehouses', 'inventories.warehouse_id', '=', 'warehouses.id')
            .select(
                'inventories.id',
                'warehouses.warehouse_name as warehouse_name',
                'inventories.item_name',
                'inventories.description',
                'inventories.category',
                'inventories.status',
                'inventories.quantity'
            );


        res.status(200).json(allInventories);
    } catch (err) {
        console.error(err);
        res.status(400).send(`Error retrieving Inventories: ${err}`);
    }
};

const getSingleItem = async (req, res) => {
    //Check for id param
    if (!req?.params?.id) {
      return res.status(400).json({ message: "Missing id param." });
    }
  
    //Extract specific query
    let query = { 'inventories.id': req.params.id };
  
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
        .where(query);
  
      //Check if results are 0 (no inventory found)
      if (inventory?.length === 0) {
        return res.status(404).json({ message: `No inventory found with id ${req.params.id}` });
      }
  
      //Convert result (Row packet into JSON object)
      let result = rowDataToJson(inventory[0]); 
  
      //Return result
      return res.status(200).json(result);
    } catch (e) {
      return res.status(500).json({ message: e });
    }
  };
  

export default { 
    index,
    getSingleItem,
}; 
