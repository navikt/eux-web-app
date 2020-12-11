import { OptionTypeBase } from 'react-select'

export interface Option extends OptionTypeBase {
  label: string
  navn?: string
  value: string
}

export type Options = Array<Option>
export type Loading = {[key: string]: boolean}
export type Params = {[k: string] : string}
export interface ParamPayload {
  key: string,
  value?: any
}
