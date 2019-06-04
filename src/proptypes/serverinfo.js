/* eslint import/prefer-default-export:"off" */
import PT from 'prop-types';

const ServerInfoPropType = PT.shape({
  namespace: PT.string,
  cluster: PT.string,
  branchName: PT.string,
  longVersionHash: PT.string,
  gosysURL: PT.string,
  veraURL: PT.string,
});

export { ServerInfoPropType as ServerInfo };
