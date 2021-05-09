import { AlertState } from 'reducers/alert'
import { AppState } from 'reducers/app'
import { ArbeidsgiverState } from 'reducers/arbeidsgiver'
import { AttachmentsState } from 'reducers/attachments'
import { InntektState } from 'reducers/inttekt'
import { LoadingState } from 'reducers/loading'
import { PersonState } from 'reducers/person'
import { SakState } from 'reducers/sak'
import { SvarpasedState } from 'reducers/svarpased'
import { UiState } from 'reducers/ui'
import { ValidationState } from 'reducers/validation'
import { VedleggState } from 'reducers/vedlegg'

export interface State {
  alert: AlertState,
  app: AppState,
  arbeidsgiver: ArbeidsgiverState,
  attachments: AttachmentsState,
  inntekt: InntektState,
  loading: LoadingState,
  person: PersonState,
  sak: SakState,
  svarpased: SvarpasedState,
  ui: UiState,
  validation: ValidationState,
  vedlegg: VedleggState
}
