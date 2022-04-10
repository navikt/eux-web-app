import { Checkbox, Heading } from '@navikt/ds-react'
import { resetValidation } from 'actions/validation'
import { TwoLevelFormProps, TwoLevelFormSelector } from 'applications/SvarSed/TwoLevelForm'
import Input from 'components/Forms/Input'
import { AndreMottatteUtbetalinger } from 'declarations/pd'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { AlignStartRow, Column, FlexDiv, PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

const mapState = (state: State): TwoLevelFormSelector => ({
  validation: state.validation.status
})

const UtbetalingFC: React.FC<TwoLevelFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
} :TwoLevelFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useSelector<State, TwoLevelFormSelector>(mapState)
  const dispatch = useDispatch()
  const target = 'andreMottatteUtbetalinger'
  const andreMottatteUtbetalinger: AndreMottatteUtbetalinger = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-utbetaling`

  useEffect(() => {
    const newAndreMottatteUtbetalinger: AndreMottatteUtbetalinger | undefined = _.cloneDeep(andreMottatteUtbetalinger)
    if (!_.isEmpty(newAndreMottatteUtbetalinger)) {
      if (newAndreMottatteUtbetalinger._utbetalingEtterEndtArbeidsforholdCheckbox === undefined) {
        newAndreMottatteUtbetalinger._utbetalingEtterEndtArbeidsforholdCheckbox = !_.isEmpty(newAndreMottatteUtbetalinger?.utbetalingEtterEndtArbeidsforhold)
      }
      if (newAndreMottatteUtbetalinger._kompensasjonForEndtArbeidsforholdCheckbox === undefined) {
        newAndreMottatteUtbetalinger._kompensasjonForEndtArbeidsforholdCheckbox = !_.isEmpty(newAndreMottatteUtbetalinger?.kompensasjonForEndtArbeidsforhold)
      }
      if (newAndreMottatteUtbetalinger._kompensasjonForFeriedagerCheckbox === undefined) {
        newAndreMottatteUtbetalinger._kompensasjonForFeriedagerCheckbox = (!_.isEmpty(newAndreMottatteUtbetalinger?.kompensasjonForFeriedager?.antallDager) || !_.isEmpty(newAndreMottatteUtbetalinger?.kompensasjonForFeriedager?.beloep))
      }
      if (newAndreMottatteUtbetalinger._avkallKompensasjonBegrunnelseCheckbox === undefined) {
        newAndreMottatteUtbetalinger._avkallKompensasjonBegrunnelseCheckbox = !_.isEmpty(newAndreMottatteUtbetalinger?.avkallKompensasjonBegrunnelse)
      }
      if (newAndreMottatteUtbetalinger._andreYtelserSomMottasForTidenCheckbox === undefined) {
        newAndreMottatteUtbetalinger._andreYtelserSomMottasForTidenCheckbox = !_.isEmpty(newAndreMottatteUtbetalinger?.andreYtelserSomMottasForTiden)
      }
      dispatch(updateReplySed(`${target}`, newAndreMottatteUtbetalinger))
    }
  }, [])

  const setUtbetalingEtterEndtArbeidsforholdCheckbox = (checked: boolean) => {
    if (!checked) {
      setUtbetalingEtterEndtArbeidsforhold('')
    }
    dispatch(updateReplySed(`${target}._utbetalingEtterEndtArbeidsforholdCheckbox`, checked))
    if (validation[namespace + '-utbetalingEtterEndtArbeidsforholdCheckbox']) {
      dispatch(resetValidation(namespace + '-utbetalingEtterEndtArbeidsforholdCheckbox'))
    }
  }

  const setUtbetalingEtterEndtArbeidsforhold = (utbetalingEtterEndtArbeidsforhold: string) => {
    if (!andreMottatteUtbetalinger?._utbetalingEtterEndtArbeidsforholdCheckbox) {
      setUtbetalingEtterEndtArbeidsforholdCheckbox(true)
    }
    dispatch(updateReplySed(`${target}.utbetalingEtterEndtArbeidsforhold`, utbetalingEtterEndtArbeidsforhold.trim()))
    if (validation[namespace + '-utbetalingEtterEndtArbeidsforhold']) {
      dispatch(resetValidation(namespace + '-utbetalingEtterEndtArbeidsforhold'))
    }
  }

  const setKompensasjonForEndtArbeidsforholdCheckbox = (checked: boolean) => {
    if (!checked) {
      setKompensasjonForEndtArbeidsforhold('')
    }
    dispatch(updateReplySed(`${target}._kompensasjonForEndtArbeidsforholdCheckbox`, checked))
    if (validation[namespace + '-kompensasjonForEndtArbeidsforholdCheckbox']) {
      dispatch(resetValidation(namespace + '-kompensasjonForEndtArbeidsforholdCheckbox'))
    }
  }

  const setKompensasjonForEndtArbeidsforhold = (kompensasjonForEndtArbeidsforhold: string) => {
    if (!andreMottatteUtbetalinger?._kompensasjonForEndtArbeidsforholdCheckbox) {
      setKompensasjonForEndtArbeidsforholdCheckbox(true)
    }
    dispatch(updateReplySed(`${target}.kompensasjonForEndtArbeidsforhold`, kompensasjonForEndtArbeidsforhold.trim()))
    if (validation[namespace + '-kompensasjonForEndtArbeidsforhold']) {
      dispatch(resetValidation(namespace + '-kompensasjonForEndtArbeidsforhold'))
    }
  }

  const setKompensasjonForFeriedagerCheckbox = (checked: boolean) => {
    if (!checked) {
      setKompensasjonForFeriedagerBeloep('')
      setKompensasjonForFeriedagerAntallDager('')
    }
    dispatch(updateReplySed(`${target}._kompensasjonForFeriedagerCheckbox`, checked))
    if (validation[namespace + '-kompensasjonForFeriedagerCheckbox']) {
      dispatch(resetValidation(namespace + '-kompensasjonForFeriedagerCheckbox'))
    }
  }

  const setKompensasjonForFeriedagerAntallDager = (antallDager: string) => {
    if (!andreMottatteUtbetalinger?._kompensasjonForFeriedagerCheckbox) {
      setKompensasjonForFeriedagerCheckbox(true)
    }
    dispatch(updateReplySed(`${target}.kompensasjonForFeriedager.antallDager`, antallDager.trim()))
    if (validation[namespace + '-kompensasjonForFeriedager-antallDager']) {
      dispatch(resetValidation(namespace + '-kompensasjonForFeriedager-antallDager'))
    }
  }

  const setKompensasjonForFeriedagerBeloep = (beloep: string) => {
    if (!andreMottatteUtbetalinger?._kompensasjonForFeriedagerCheckbox) {
      setKompensasjonForFeriedagerCheckbox(true)
    }
    dispatch(updateReplySed(`${target}.kompensasjonForFeriedager.beloep`, beloep.trim()))
    if (validation[namespace + '-kompensasjonForFeriedager-beloep']) {
      dispatch(resetValidation(namespace + '-kompensasjonForFeriedager-beloep'))
    }
  }

  const setAvkallKompensasjonBegrunnelseCheckbox = (checked: boolean) => {
    if (!checked) {
      setAvkallKompensasjonBegrunnelse('')
    }
    dispatch(updateReplySed(`${target}._avkallKompensasjonBegrunnelseCheckbox`, checked))
    if (validation[namespace + '-avkallKompensasjonBegrunnelseCheckbox']) {
      dispatch(resetValidation(namespace + '-avkallKompensasjonBegrunnelseCheckbox'))
    }
  }

  const setAvkallKompensasjonBegrunnelse = (avkallKompensasjonBegrunnelse: string) => {
    if (!andreMottatteUtbetalinger?._avkallKompensasjonBegrunnelseCheckbox) {
      setAvkallKompensasjonBegrunnelseCheckbox(true)
    }
    dispatch(updateReplySed(`${target}.avkallKompensasjonBegrunnelse`, avkallKompensasjonBegrunnelse.trim()))
    if (validation[namespace + '-avkallKompensasjonBegrunnelse']) {
      dispatch(resetValidation(namespace + '-avkallKompensasjonBegrunnelse'))
    }
  }

  const setAndreYtelserSomMottasForTidenCheckbox = (checked: boolean) => {
    if (!checked) {
      setAndreYtelserSomMottasForTiden('')
    }
    dispatch(updateReplySed(`${target}._andreYtelserSomMottasForTidenCheckbox`, checked))
    if (validation[namespace + '-andreYtelserSomMottasForTidenCheckbox']) {
      dispatch(resetValidation(namespace + '-andreYtelserSomMottasForTidenCheckbox'))
    }
  }

  const setAndreYtelserSomMottasForTiden = (andreYtelserSomMottasForTiden: string) => {
    if (!andreMottatteUtbetalinger?._andreYtelserSomMottasForTidenCheckbox) {
      setAndreYtelserSomMottasForTidenCheckbox(true)
    }
    dispatch(updateReplySed(`${target}.andreYtelserSomMottasForTiden`, andreYtelserSomMottasForTiden.trim()))
    if (validation[namespace + '-andreYtelserSomMottasForTiden']) {
      dispatch(resetValidation(namespace + '-andreYtelserSomMottasForTiden'))
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
            checked={andreMottatteUtbetalinger?._utbetalingEtterEndtArbeidsforholdCheckbox}
            data-testid={namespace + '-utbetalingEtterEndtArbeidsforholdCheckbox'}
            id={namespace + '-utbetalingEtterEndtArbeidsforholdCheckbox'}
            key={namespace + '-utbetalingEtterEndtArbeidsforholdCheckbox' + andreMottatteUtbetalinger?._utbetalingEtterEndtArbeidsforholdCheckbox}
            error={!!validation[namespace + '-utbetalingEtterEndtArbeidsforhold']?.feilmelding}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUtbetalingEtterEndtArbeidsforholdCheckbox(e.target.checked)}
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
                onChanged={setUtbetalingEtterEndtArbeidsforhold}
                value={andreMottatteUtbetalinger?.utbetalingEtterEndtArbeidsforhold}
              />
            </FlexDiv>
          </Checkbox>
        </Column>
      </AlignStartRow>

      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column>
          <Checkbox
            checked={andreMottatteUtbetalinger?._kompensasjonForEndtArbeidsforholdCheckbox}
            data-testid={namespace + '-kompensasjonForEndtArbeidsforholdCheckbox'}
            error={!!validation[namespace + '-kompensasjonForEndtArbeidsforhold']?.feilmelding}
            id={namespace + '-kompensasjonForEndtArbeidsforholdCheckbox'}
            key={namespace + '-kompensasjonForEndtArbeidsforholdCheckbox' + andreMottatteUtbetalinger?._kompensasjonForEndtArbeidsforholdCheckbox}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKompensasjonForEndtArbeidsforholdCheckbox(e.target.checked)}
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
                onChanged={setKompensasjonForEndtArbeidsforhold}
                value={andreMottatteUtbetalinger?.kompensasjonForEndtArbeidsforhold}
              />
            </FlexDiv>
          </Checkbox>
        </Column>
      </AlignStartRow>

      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.15s' }}>
        <Column>
          <Checkbox
            checked={andreMottatteUtbetalinger?._kompensasjonForFeriedagerCheckbox}
            data-testid={namespace + '-kompensasjonForFeriedagerCheckbox'}
            error={!!validation[namespace + '-kompensasjonForFeriedager']?.feilmelding}
            id={namespace + '-kompensasjonForFeriedagerCheckbox'}
            key={namespace + '-kompensasjonForFeriedagerCheckbox' + andreMottatteUtbetalinger?._kompensasjonForFeriedagerCheckbox}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKompensasjonForFeriedagerCheckbox(e.target.checked)}
          >
            <FlexDiv>
              {t('el:checkbox-pdu1-4.3')}
              <Input
                error={validation[namespace + '-kompensasjonForFeriedager-beloep']?.feilmelding}
                namespace={namespace}
                key={namespace + '-kompensasjonForFeriedager-beloep-' + andreMottatteUtbetalinger?.kompensasjonForFeriedager?.beloep}
                id='kompensasjonForFeriedager-beloep'
                label=''
                hideLabel
                onChanged={setKompensasjonForFeriedagerBeloep}
                value={andreMottatteUtbetalinger?.kompensasjonForFeriedager?.beloep}
              />
              <PaddedDiv size='0.5'>
                for
              </PaddedDiv>
              <Input
                error={validation[namespace + '-kompensasjonForFeriedager-antallDager']?.feilmelding}
                namespace={namespace}
                key={namespace + '-kompensasjonForFeriedager-antallDager-' + andreMottatteUtbetalinger?.kompensasjonForFeriedager?.antallDager}
                id='kompensasjonForFeriedager-antallDager'
                label=''
                hideLabel
                onChanged={setKompensasjonForFeriedagerAntallDager}
                value={andreMottatteUtbetalinger?.kompensasjonForFeriedager?.antallDager}
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
            checked={andreMottatteUtbetalinger?._avkallKompensasjonBegrunnelseCheckbox}
            data-testid={namespace + '-avkallKompensasjonBegrunnelseCheckbox'}
            error={!!validation[namespace + '-avkallKompensasjonBegrunnelseCheckbox']?.feilmelding}
            id={namespace + '-avkallKompensasjonBegrunnelseCheckbox'}
            key={namespace + '-avkallKompensasjonBegrunnelseCheckbox' + andreMottatteUtbetalinger?._avkallKompensasjonBegrunnelseCheckbox}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAvkallKompensasjonBegrunnelseCheckbox(e.target.checked)}
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
                onChanged={setAvkallKompensasjonBegrunnelse}
                value={andreMottatteUtbetalinger?.avkallKompensasjonBegrunnelse}
              />
            </FlexDiv>
          </Checkbox>
        </Column>
      </AlignStartRow>

      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.25s' }}>
        <Column>
          <Checkbox
            checked={andreMottatteUtbetalinger?._andreYtelserSomMottasForTidenCheckbox}
            data-testid={namespace + '-andreYtelserSomMottasForTidenCheckbox'}
            error={!!validation[namespace + '-andreYtelserSomMottasForTidenCheckbox']?.feilmelding}
            id={namespace + '-andreYtelserSomMottasForTidenCheckbox'}
            key={namespace + '-andreYtelserSomMottasForTidenCheckbox' + andreMottatteUtbetalinger?._andreYtelserSomMottasForTidenCheckbox}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAndreYtelserSomMottasForTidenCheckbox(e.target.checked)}
          >
            <FlexDiv>
              {t('el:checkbox-pdu1-4.5')}&nbsp;&nbsp;
              <Input
                error={validation[namespace + '-andreYtelserSomMottasForTiden']?.feilmelding}
                namespace={namespace}
                key={namespace + '-andreYtelserSomMottasForTiden-' + andreMottatteUtbetalinger?.andreYtelserSomMottasForTiden}
                id='andreYtelserSomMottasForTiden'
                label=''
                hideLabel
                onChanged={setAndreYtelserSomMottasForTiden}
                value={andreMottatteUtbetalinger?.andreYtelserSomMottasForTiden}
              />
            </FlexDiv>
          </Checkbox>
        </Column>
      </AlignStartRow>

    </PaddedDiv>
  )
}

export default UtbetalingFC
