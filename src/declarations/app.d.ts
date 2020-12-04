import { OptionTypeBase } from 'react-select'

export interface Option extends OptionTypeBase {
  label: string
  navn?: string
  value: string
}

export type Options = Array<Option>
