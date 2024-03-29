export interface Option {
  label: string
  navn?: string
  value: string
  isDisabled?: boolean
}

export type Options = Array<Option>
export type Loading = {[key: string]: boolean}
export type Params = {[k: string] : any}
export interface ParamPayload {
  key: string,
  value?: any
}
export type FeatureToggles = {[key in string]: boolean | number}
export type Labels = {[k in string]: string}
export interface ErrorElement {
  feilmelding: string
  skjemaelementId: string
}
