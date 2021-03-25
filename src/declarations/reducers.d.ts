import { AlertState } from 'reducers/alert'
import { AppState } from 'reducers/app'
import { AttachmentsState } from 'reducers/attachments'
import { LoadingState } from 'reducers/loading'
import { SakState } from 'reducers/sak'
import { SvarpasedState } from 'reducers/svarpased'
import { UiState } from 'reducers/ui'
import { VedleggState } from 'reducers/vedlegg'

export interface State {
  alert: AlertState,
  app: AppState,
  attachments: AttachmentsState,
  loading: LoadingState,
  sak: SakState,
  ui: UiState,
  vedlegg: VedleggState,
  svarpased: SvarpasedState
}
