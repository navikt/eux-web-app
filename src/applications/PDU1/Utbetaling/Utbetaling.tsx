import { Checkbox, Heading } from '@navikt/ds-react'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Input from 'components/Forms/Input'
import { AndreMottatteUtbetalinger } from 'declarations/pd'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { AlignStartRow, Column, FlexDiv, PaddedDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

const mapState = (state: State): PersonManagerFormSelector => ({
  validation: state.validation.status
})

const UtbetalingFC: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
} :PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useSelector<State, PersonManagerFormSelector>(mapState)
  const dispatch = useDispatch()
  const target = 'andreMottatteUtbetalinger'
  const andreMottatteUtbetalinger: AndreMottatteUtbetalinger = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-andreMottatteUtbetalinger`

  const [utbetalingEtterEndtArbeidsforholdCheckbox, setUtbetalingEtterEndtArbeidsforholdCheckbox] = useState<boolean | undefined>(() => !_.isEmpty(andreMottatteUtbetalinger?.utbetalingEtterEndtArbeidsforhold))
  const [kompensasjonForEndtArbeidsforholdCheckbox, setKompensasjonForEndtArbeidsforholdCheckbox] = useState<boolean | undefined>(() => !_.isEmpty(andreMottatteUtbetalinger?.kompensasjonForEndtArbeidsforhold))
  const [kompensasjonForFeriedagerCheckbox, setKompensasjonForFeriedagerCheckbox] = useState<boolean>(() => !_.isEmpty(andreMottatteUtbetalinger?.kompensasjonForFeriedager?.antallDager) || !_.isEmpty(andreMottatteUtbetalinger?.kompensasjonForFeriedager?.beloep))
  const [avkallKompensasjonBegrunnelseCheckbox, setAvkallKompensasjonBegrunnelseCheckbox] = useState<boolean>(() => !_.isEmpty(andreMottatteUtbetalinger?.avkallKompensasjonBegrunnelse))
  const [andreYtelserSomMottaForTidenCheckbox, setAndreYtelserSomMottaForTidenCheckbox] = useState<boolean>(() => !_.isEmpty(andreMottatteUtbetalinger?.andreYtelserSomMottaForTiden))

  const setUtbetalingEtterEndtArbeidsforhold = (utbetalingEtterEndtArbeidsforhold: string) => {
    dispatch(updateReplySed(`${target}.utbetalingEtterEndtArbeidsforhold`, utbetalingEtterEndtArbeidsforhold.trim()))
    if (validation[namespace + '-utbetalingEtterEndtArbeidsforhold']) {
      dispatch(resetValidation(namespace + '-utbetalingEtterEndtArbeidsforhold'))
    }
  }

  const setKompensasjonForEndtArbeidsforhold = (kompensasjonForEndtArbeidsforhold: string) => {
    dispatch(updateReplySed(`${target}.kompensasjonForEndtArbeidsforhold`, kompensasjonForEndtArbeidsforhold.trim()))
    if (validation[namespace + '-kompensasjonForEndtArbeidsforhold']) {
      dispatch(resetValidation(namespace + '-kompensasjonForEndtArbeidsforhold'))
    }
  }

  const setKompensasjonForFeriedagerAntallDager = (antallDager: string) => {
    dispatch(updateReplySed(`${target}.kompensasjonForFeriedager.antallDager`, antallDager.trim()))
    if (validation[namespace + '-kompensasjonForFeriedager-antallDager']) {
      dispatch(resetValidation(namespace + '-kompensasjonForFeriedager-antallDager'))
    }
  }

  const setKompensasjonForFeriedagerBeloep = (beloep: string) => {
    dispatch(updateReplySed(`${target}.kompensasjonForFeriedager.beloep`, beloep.trim()))
    if (validation[namespace + '-kompensasjonForFeriedager-beloep']) {
      dispatch(resetValidation(namespace + '-kompensasjonForFeriedager-beloep'))
    }
  }

  const setAvkallKompensasjonBegrunnelse = (avkallKompensasjonBegrunnelse: string) => {
    dispatch(updateReplySed(`${target}.avkallKompensasjonBegrunnelse`, avkallKompensasjonBegrunnelse.trim()))
    if (validation[namespace + '-avkallKompensasjonBegrunnelse']) {
      dispatch(resetValidation(namespace + '-avkallKompensasjonBegrunnelse'))
    }
  }

  const setAndreYtelserSomMottaForTiden = (andreYtelserSomMottaForTiden: string) => {
    dispatch(updateReplySed(`${target}.andreYtelserSomMottaForTiden`, andreYtelserSomMottaForTiden.trim()))
    if (validation[namespace + '-andreYtelserSomMottaForTiden']) {
      dispatch(resetValidation(namespace + '-andreYtelserSomMottaForTiden'))
    }
  }

  return (
    <PaddedDiv key={namespace + '-div'}>
      <Heading size='medium'>
        {t('label:andre-mottatte-utbetalinger')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.05s' }}>
        <Column>
          <Checkbox
            checked={utbetalingEtterEndtArbeidsforholdCheckbox}
            data-test-id={namespace + '-utbetalingEtterEndtArbeidsforholdCheckbox'}
            error={!!validation[namespace + '-utbetalingEtterEndtArbeidsforhold']?.feilmelding}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (!e.target.checked) {
                setUtbetalingEtterEndtArbeidsforhold('')
              }
              console.log('setting to ' + e.target.checked)
              setUtbetalingEtterEndtArbeidsforholdCheckbox(e.target.checked)
            }}
          >
            <FlexDiv>
              {t('el:checkbox-pdu1-4.1')}
              <Input
                error={validation[namespace + '-utbetalingEtterEndtArbeidsforhold']?.feilmelding}
                namespace={namespace}
                key={namespace + '-utbetalingEtterEndtArbeidsforhold-' + andreMottatteUtbetalinger?.utbetalingEtterEndtArbeidsforhold}
                id='utbetalingEtterEndtArbeidsforhold'
                label=''
                hideLabel
                onChanged={(e) => {
                  setUtbetalingEtterEndtArbeidsforhold(e)
                  if (!utbetalingEtterEndtArbeidsforholdCheckbox) {
                    setUtbetalingEtterEndtArbeidsforholdCheckbox(true)
                  }
                }}
                value={andreMottatteUtbetalinger?.utbetalingEtterEndtArbeidsforhold}
              />
            </FlexDiv>
          </Checkbox>
        </Column>
      </AlignStartRow>

      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column>
          <Checkbox
            checked={kompensasjonForEndtArbeidsforholdCheckbox}
            data-test-id={namespace + '-kompensasjonForEndtArbeidsforholdCheckbox'}
            error={!!validation[namespace + '-kompensasjonForEndtArbeidsforhold']?.feilmelding}
            // id={namespace + '-kompensasjonForEndtArbeidsforholdCheckbox'}
            // key={namespace + '-kompensasjonForEndtArbeidsforholdCheckbox' + kompensasjonForEndtArbeidsforholdCheckbox}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (!e.target.checked) {
                setKompensasjonForEndtArbeidsforhold('')
              }
              setKompensasjonForEndtArbeidsforholdCheckbox(e.target.checked)
            }}
          >
            <FlexDiv>
              {t('el:checkbox-pdu1-4.2')}
              <Input
                error={validation[namespace + '-kompensasjonForEndtArbeidsforhold']?.feilmelding}
                namespace={namespace}
                key={namespace + '-kompensasjonForEndtArbeidsforhold-' + andreMottatteUtbetalinger?.kompensasjonForEndtArbeidsforhold}
                id='kompensasjonForEndtArbeidsforhold'
                label=''
                hideLabel
                onChanged={(e) => {
                  setKompensasjonForEndtArbeidsforhold(e)
                  if (!kompensasjonForEndtArbeidsforholdCheckbox) {
                    setKompensasjonForEndtArbeidsforholdCheckbox(true)
                  }
                }}
                value={andreMottatteUtbetalinger?.kompensasjonForEndtArbeidsforhold}
              />
            </FlexDiv>
          </Checkbox>
        </Column>
      </AlignStartRow>

      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.15s' }}>
        <Column>
          <Checkbox
            checked={kompensasjonForFeriedagerCheckbox}
            data-test-id={namespace + '-kompensasjonForFeriedagerCheckbox'}
            error={!!validation[namespace + '-kompensasjonForFeriedager']?.feilmelding}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (!e.target.checked) {
                setKompensasjonForFeriedagerAntallDager('')
                setKompensasjonForFeriedagerBeloep('')
              }
              setKompensasjonForFeriedagerCheckbox(e.target.checked)
            }}
          >
            <FlexDiv>
              {t('el:checkbox-pdu1-4.3')}
              <Input
                error={validation[namespace + '-kompensasjonForFeriedager-antallDager']?.feilmelding}
                namespace={namespace}
                key={namespace + '-kompensasjonForFeriedager-antallDager-' + andreMottatteUtbetalinger?.kompensasjonForFeriedager?.antallDager}
                id='kompensasjonForFeriedager-antallDager'
                label=''
                hideLabel
                onChanged={(e) => {
                  setKompensasjonForFeriedagerAntallDager(e)
                  if (!kompensasjonForFeriedagerCheckbox) {
                    setKompensasjonForFeriedagerCheckbox(true)
                  }
                }}
                value={andreMottatteUtbetalinger?.kompensasjonForFeriedager?.antallDager}
              />
              <PaddedDiv size='0.5'>
                for
              </PaddedDiv>
              <Input
                error={validation[namespace + '-kompensasjonForFeriedager-beloep']?.feilmelding}
                namespace={namespace}
                key={namespace + '-kompensasjonForFeriedager-beloep-' + andreMottatteUtbetalinger?.kompensasjonForFeriedager?.beloep}
                id='kompensasjonForFeriedager-beloep'
                label=''
                hideLabel
                onChanged={(e) => {
                  setKompensasjonForFeriedagerBeloep(e)
                  if (!kompensasjonForFeriedagerCheckbox) {
                    setKompensasjonForFeriedagerCheckbox(true)
                  }
                }}
                value={andreMottatteUtbetalinger?.kompensasjonForFeriedager?.beloep}
              />
              <PaddedDiv size='0.5'>
                dager
              </PaddedDiv>
            </FlexDiv>
          </Checkbox>
        </Column>
      </AlignStartRow>

      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
        <Column>
          <Checkbox
            checked={avkallKompensasjonBegrunnelseCheckbox}
            data-test-id={namespace + '-avkallKompensasjonBegrunnelseCheckbox'}
            error={!!validation[namespace + '-avkallKompensasjonBegrunnelseCheckbox']?.feilmelding}
            // id={namespace + '-kompensasjonForEndtArbeidsforholdCheckbox'}
            // key={namespace + '-kompensasjonForEndtArbeidsforholdCheckbox' + kompensasjonForEndtArbeidsforholdCheckbox}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (!e.target.checked) {
                setAvkallKompensasjonBegrunnelse('')
              }
              setAvkallKompensasjonBegrunnelseCheckbox(e.target.checked)
            }}
          >
            <FlexDiv>
              {t('el:checkbox-pdu1-4.4')}
              <Input
                error={validation[namespace + '-avkallKompensasjonBegrunnelse']?.feilmelding}
                namespace={namespace}
                key={namespace + '-avkallKompensasjonBegrunnelse-' + andreMottatteUtbetalinger?.avkallKompensasjonBegrunnelse}
                id='avkallKompensasjonBegrunnelse'
                label=''
                hideLabel
                onChanged={(e) => {
                  setAvkallKompensasjonBegrunnelse(e)
                  if (!avkallKompensasjonBegrunnelseCheckbox) {
                    setAvkallKompensasjonBegrunnelseCheckbox(true)
                  }
                }}
                value={andreMottatteUtbetalinger?.avkallKompensasjonBegrunnelse}
              />
            </FlexDiv>
          </Checkbox>
        </Column>
      </AlignStartRow>

      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.25s' }}>
        <Column>
          <Checkbox
            checked={andreYtelserSomMottaForTidenCheckbox}
            data-test-id={namespace + '-andreYtelserSomMottaForTidenCheckbox'}
            error={!!validation[namespace + '-andreYtelserSomMottaForTidenCheckbox']?.feilmelding}
            // id={namespace + '-kompensasjonForEndtArbeidsforholdCheckbox'}
            // key={namespace + '-kompensasjonForEndtArbeidsforholdCheckbox' + kompensasjonForEndtArbeidsforholdCheckbox}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (!e.target.checked) {
                setAndreYtelserSomMottaForTiden('')
              }
              setAndreYtelserSomMottaForTidenCheckbox(e.target.checked)
            }}
          >
            <FlexDiv>
              {t('el:checkbox-pdu1-4.5')}&nbsp;&nbsp;
              <Input
                error={validation[namespace + '-andreYtelserSomMottaForTiden']?.feilmelding}
                namespace={namespace}
                key={namespace + '-andreYtelserSomMottaForTiden-' + andreMottatteUtbetalinger?.andreYtelserSomMottaForTiden}
                id='andreYtelserSomMottaForTiden'
                label=''
                hideLabel
                onChanged={(e) => {
                  setAndreYtelserSomMottaForTiden(e)
                  if (!andreYtelserSomMottaForTidenCheckbox) {
                    setAndreYtelserSomMottaForTidenCheckbox(true)
                  }
                }}
                value={andreMottatteUtbetalinger?.andreYtelserSomMottaForTiden}
              />
            </FlexDiv>
          </Checkbox>
        </Column>
      </AlignStartRow>

    </PaddedDiv>
  )
}

export default UtbetalingFC
