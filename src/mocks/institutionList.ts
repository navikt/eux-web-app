
export default ({ buctype, landkode }: any) => {
  let institutions = require('eux-schema/mock_data/institusjoner/institusjoner-' + buctype.toUpperCase() + '.json')
  institutions = institutions.filter((item: any) => item.landkode === landkode)
  return institutions
}
