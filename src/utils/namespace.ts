import _ from 'lodash'

export const getIdx = (index: number | undefined): string => (!_.isNil(index) && index >= 0 ? '[' + index + ']' : '')
export const getNSIdx = (type: string | undefined, index: number | undefined): string => (!_.isNil(type) && !_.isNil(index) && index >= 0 ? '[' + type + '][' + index + ']' : '')
export const readNSIdx = (key: string): [string, number] => {
  const re = key.match(/\[(.+)\]\[(.+)\]$/)
  return [re![1], parseInt(re![2])]
}
