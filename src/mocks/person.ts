export default ({ fnr }: any) => {
  const person = require('eux-schema/mock_data/personer/fnr-' + fnr + '.json')
  return person
}
