import mockSaksbehandler from 'eux-schema/mock_data/saksbehandler.json'
import _ from 'lodash'

export default () => {
  const sb: any = _.sample(mockSaksbehandler)
  sb.featureSvarsed = true
  return sb
}