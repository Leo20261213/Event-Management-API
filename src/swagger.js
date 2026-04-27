import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ Resolve absolute path for openapi.yaml
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../openapi.yaml');

console.log('Looking for OpenAPI file at:', filePath);

const swaggerDocument = YAML.load(filePath);

// ✅ Export as default for ES module import
export default function swaggerSetup(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}