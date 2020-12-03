import _ from 'lodash'
import EKV from 'eessi-kodeverk'

export default ({ buctype }: any) => {
  const institusjoner = require('eux-schema/mock_data/institusjoner/institusjoner-' + buctype.toUpperCase() + '.json')
  const landMedInstitusjoner = _.uniq(institusjoner.map((item: any) => item.landkode)).sort()
  const { landkoder } = EKV.KTObjects
  return landkoder.filter((landkode: any) => landMedInstitusjoner.includes(landkode.kode))
}
