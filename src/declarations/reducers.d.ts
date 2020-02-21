import { AlertState } from 'reducers/alert'
import { FormState } from 'reducers/form'
import { LoadingState } from 'reducers/loading'
import { SakState } from 'reducers/sak'
import { UiState } from 'reducers/ui'
import { VedleggState } from 'reducers/vedlegg'

export interface State {
  alert: AlertState,
  form: FormState,
  loading: LoadingState,
  sak: SakState,
  ui: UiState,
  vedlegg: VedleggState
}
