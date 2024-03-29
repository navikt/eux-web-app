import fs from 'fs';
import dotenv from 'dotenv-save';

const createDotEnvFileIfnotExists = (dir = `${process.cwd()}/.env`) => !fs.existsSync(dir) && fs.writeFileSync(dir, '');
createDotEnvFileIfnotExists();
dotenv.set('REACT_APP_NAME', 'nEESSI');
dotenv.set('REACT_APP_API_BASE_URL', '/api/');
dotenv.set('REACT_APP_JAVA_LOCAL_HOST', '');
dotenv.set('REACT_APP_LOCAL_CONTEXT', '');
