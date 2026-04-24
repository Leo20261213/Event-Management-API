const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const filePath = path.join(process.cwd(), "openapi.yaml");

console.log("Looking for OpenAPI file at:", filePath);

const swaggerDocument = YAML.load(filePath);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};