import express from "express";
import "dotenv/config";
import ip from "ip";
import logger from "./src/config/morganConfig.js";

const PORT = process.env.PORT || 3030;
const HOSTNAME = `http://${ip.address()}:${PORT}`;

//Modules
import CORS from "./src/middleware/allowCors.js";


//Routers
import warehouse from "./src/routes/warehouse.js"
import inventoriesRoutes from './src/routes/inventoriesRoutes.mjs';
const app = express();

//CORS
app.use(CORS);

//Static folder
// app.use(express.static("public"));

app.use(express.json());
app.use("/", logger);

//Routes
app.use("/api", warehouse);
app.use('/api', inventoriesRoutes);


//404 Handling
app.use((req, res) => {
  return res.status(404).json({
    message:
      "404: Not Found (the resource you are requesting could not be found on the server) ",
  });
});

//Start server
app.listen(PORT, () => {
  console.log(`Server running on: ${HOSTNAME}`);
});
