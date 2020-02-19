import { AlertState } from 'reducers/alert'
import { UiState } from 'reducers/ui'

export interface State {
  alert: AlertState,
  ui: UiState
}
