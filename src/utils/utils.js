import moment from 'moment';

const versjon = (process.env.REACT_APP_VERSION ? `v${process.env.REACT_APP_VERSION}` : '(ukjent)');
const byggTidspunkt = process.env.REACT_APP_BUILD_DATETIME || '(ukjent)';
const byggVersjon = process.env.REACT_APP_BUILD_VERSION || '(ukjent)';
const branchVersjon = process.env.REACT_APP_BRANCH_NAME || '(lokal)';

export function buildinfo() {
  if (byggVersjon === 'local') {
    return {
      versjon,
      byggTidspunkt: moment(),
      byggVersjon,
      branchVersjon,
    };
  }
  return {
    versjon,
    byggTidspunkt,
    byggVersjon,
    branchVersjon,
  };
}
