import { AlertState } from 'reducers/alert'
import { AppState } from 'reducers/app'
import { FormState } from 'reducers/form'
import { LoadingState } from 'reducers/loading'
import { SakState } from 'reducers/sak'
import { SvarpasedState } from 'reducers/svarpased'
import { UiState } from 'reducers/ui'
import { VedleggState } from 'reducers/vedlegg'

export interface State {
  alert: AlertState,
  app: AppState,
  form: FormState,
  loading: LoadingState,
  sak: SakState,
  ui: UiState,
  vedlegg: VedleggState,
  svarpased: SvarpasedState
}
