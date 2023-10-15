
# In-Stock REST API

This is the back-end portion of the In-Stock project.

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file

`PORT` = <server port>

`CLIENT_URL` = <front-end url>

`DB_HOST` = <mysql host>

`DB_LOCAL_DBNAME` = <mysql db name>

`DB_LOCAL_USER` = <mysql user>

`DB_LOCAL_PASSWORD` = <mysql password>


## API Reference

## Warehouses
 
### GET /
→ Returns an array with all warehouses.

### GET /:id
→ Returns warehouse info for id.

### POST /
→ Creates a new warehouse

#### REQUIRED BODY PARAMS:
warehouse_name
address
city
country
contact_name
contact_position
contact_phone
contact_email

### PUT /:id

→ WORK IN PROGRESS (lester will merge once finished)

### DELETE /:id
→ WORK IN PROGRESS (lester will merge once finished)

## Inventories

### GET /
→ Returns an array with all inventories

### GET /:id
→ Returns inventory with info for id.


### POST /
→ Creates a new inventory

#### REQUIRED BODY PARAMS:
warehouse_id
item_name
description
category
status
quantity

### PUT /:id
→ Edit inventory with id.

#### REQUIRED BODY PARAMS:
warehouse_id
item_name
description
category
status
Quantity

### DELETE /:id
→ Remove inventory with id.
