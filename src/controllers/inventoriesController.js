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

export default { index }; 
