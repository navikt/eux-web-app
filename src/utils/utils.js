import moment from 'moment';

const versjon = (import.meta.env.VITE_APP_VERSION ? `v${import.meta.env.VITE_APP_VERSION}` : '(ukjent)');
const byggTidspunkt = import.meta.env.VITE_APP_BUILD_DATETIME || '(ukjent)';
const byggVersjon = import.meta.env.VITE_APP_BUILD_VERSION || '(ukjent)';
const branchVersjon = import.meta.env.VITE_APP_BRANCH_NAME || '(lokal)';

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
