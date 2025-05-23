import moment from 'moment';
import dotenv from 'dotenv-save';
import { readPackageSync } from 'read-pkg';
// Read package.json into js map.
const pkg = readPackageSync({cwd: '.'})
import simpleGit from 'simple-git';

moment.locale('nb');

const git = simpleGit({
  baseDir: process.cwd()
});

const version = `${process.env.npm_package_version}`;
let branchName = process.env.BRANCH_NAME || 'unknown';
if (branchName === 'unknown') {
  branchName = await git.branch();
}
const describe = await git.raw('describe', '--always', '--dirty', '--abbrev=8');

const {
  dependencies: {
    '@navikt/eessi-kodeverk': kodeverk_versjon,
    react: react_lib_versjon,
  },
} = pkg;
dotenv.set('VITE_APP_VERSION', version);
dotenv.set('VITE_APP_BUILD_DATETIME', moment().format('DD/MM/YYYY HH:mm'));
dotenv.set('VITE_APP_BUILD_VERSION', describe);
dotenv.set('VITE_APP_BRANCH_NAME', branchName.current);
dotenv.set('VITE_APP_EESSI_KODEVERK', kodeverk_versjon);
dotenv.set('VITE_APP_REACT_LIB', react_lib_versjon.slice(1));
dotenv.set('GENERATE_SOURCEMAP', false);
