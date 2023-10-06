import "dotenv/config";

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

export default {
  client: "mysql",
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_LOCAL_DBNAME,
    user: process.env.DB_LOCAL_USER,
    password: process.env.DB_LOCAL_PASSWORD,
  },

  migrations: {
    tableName: "knex_migrations",
    directory: "./src/db/migrations",
  },

  seeds: {
    directory: "./src/db/seeds",
  },
};
