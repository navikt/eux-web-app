const dotenv = require('dotenv-save');
const writePkg = require('write-pkg');
const readPkg = require('read-pkg');

// Read package.json into js map.
const pkg = readPkg.sync();
// get value of 'disabled-hompage'
const homepage = pkg['disabled-homepage'];
if (homepage) {
  // apply value to new key 'homepage'
  pkg.homepage = homepage;
  // remove key 'disabled-homepage'
  // delete pkg['disabled-homepage'];
  // write new content to package.json
  writePkg.sync(pkg);
}
const { proxy } = pkg;
const DEFAULT_JAVA_SERVER = 'http://localhost:8080';

// update .env with custom version
dotenv.set('REACT_APP_BUILD_VERSION', 'java_local');
dotenv.set('REACT_APP_LOCAL_CONTEXT', '/eux');
dotenv.set('REACT_APP_API_BASE_URL', '/api/');
dotenv.set('REACT_APP_JAVA_LOCAL_HOST', DEFAULT_JAVA_SERVER);

proxy['/api'].target = DEFAULT_JAVA_SERVER;
proxy['/frontendlogger'].target = DEFAULT_JAVA_SERVER;
if (proxy) {
  pkg.proxy = proxy;
  writePkg.sync(pkg);
}

