import _ from 'lodash'

export const getIdx = (index: any | undefined): string => (
  !_.isNil(index) && ((_.isNumber(index) && index >= 0) || (_.isString(index) && !_.isEmpty(index)))
    ? '[' + index + ']'
    : ''
)

export const getNSIdx = (type: string | undefined, index: any | undefined): string => (
  !_.isNil(type)
    ? '[' + type + ']' + getIdx(index)
    : ''
)

export const readNSIdx = (key: string): [string, number] => {
  const re = key.match(/\[(.+)\]\[(.+)\]$/)
  return [re![1], parseInt(re![2])]
}
