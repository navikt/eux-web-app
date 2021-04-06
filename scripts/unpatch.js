import fs from 'fs';
import dotenv from 'dotenv-save';
import writePkg from 'write-pkg';
import { readPackageSync } from 'read-pkg';

// Read package.json into js map.
const pkg = readPackageSync();
if (pkg.homepage) {
  delete pkg.homepage;
  delete pkg._id;
  writePkg.sync(pkg);
}

const createDotEnvFileIfnotExists = (dir = `${process.cwd()}/.env`) => !fs.existsSync(dir) && fs.writeFileSync(dir, '');
createDotEnvFileIfnotExists();
dotenv.set('REACT_APP_NAME', 'nEESSI');
dotenv.set('REACT_APP_API_BASE_URL', '/api/');
dotenv.set('REACT_APP_JAVA_LOCAL_HOST', '');
dotenv.set('REACT_APP_LOCAL_CONTEXT', '');
