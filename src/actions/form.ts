import * as types from 'constants/actionTypes'

export const set = (key: any, value: any) => ({
  type: types.FORM_VALUE_SET,
  payload: {
    key: key,
    value: value
  }
})
