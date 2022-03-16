import { AdresseState } from 'reducers/adresse'
import { AlertState } from 'reducers/alert'
import { AppState } from 'reducers/app'
import { ArbeidsperioderState } from 'reducers/arbeidsperioder'
import { AttachmentsState } from 'reducers/attachments'
import { InntektState } from 'reducers/inttekt'
import { LoadingState } from 'reducers/loading'
import { LocalStorageState } from 'reducers/localStorage'
import { Pdu1State } from 'reducers/pdu1'
import { PersonState } from 'reducers/person'
import { SakState } from 'reducers/sak'
import { SvarsedState } from 'reducers/svarsed'
import { UiState } from 'reducers/ui'
import { ValidationState } from 'reducers/validation'
import { VedleggState } from 'reducers/vedlegg'

export interface State {
  adresse: AdresseState,
  alert: AlertState,
  app: AppState,
  arbeidsperioder: ArbeidsperioderState,
  attachments: AttachmentsState,
  inntekt: InntektState,
  loading: LoadingState,
  localStorage: LocalStorageState,
  pdu1: Pdu1State,
  person: PersonState,
  sak: SakState,
  svarsed: SvarsedState,
  ui: UiState,
  validation: ValidationState,
  vedlegg: VedleggState
}
