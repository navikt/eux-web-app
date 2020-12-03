
export default () => ({
  namespace: 'MOCK SERVER',
  cluster: `NodeJS ${process.version}`,
  branchName: process.env.BRANCH_NAME || 'unknown',
  longVersionHash: 'MOCK HASH',
  gosysURL: 'https://wasapp-t8.adeo.no/gosys/',
  veraURL: 'https://vera.adeo.no/#/log?application=eux'
})
