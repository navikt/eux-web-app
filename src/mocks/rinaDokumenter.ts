export default ({ rinasaksnummer } : any) => {
  const module = require('eux-schema/mock_data/rina-dokumenter/snr-' + rinasaksnummer + '.json')
  return module
}
