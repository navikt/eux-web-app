import _ from 'lodash'

export const getIdx = (index: number | undefined): string => (!_.isNil(index) && index >= 0 ? '[' + index + ']' : '')
