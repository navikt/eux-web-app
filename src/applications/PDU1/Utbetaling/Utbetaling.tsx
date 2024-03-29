import { Checkbox, Heading } from '@navikt/ds-react'
import { AlignStartRow, Column, FlexDiv, PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import { validateUtbetaling, ValidationUtbetalingProps } from 'applications/PDU1/Utbetaling/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Input from 'components/Forms/Input'
import { AndreMottatteUtbetalinger } from 'declarations/pd'
import { State } from 'declarations/reducers'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const UtbetalingFC: React.FC<MainFormProps> = ({
  parentNamespace,
  replySed,
  updateReplySed
} :MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target = 'andreMottatteUtbetalinger'
  const andreMottatteUtbetalinger: AndreMottatteUtbetalinger | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-utbetaling`

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationUtbetalingProps>(
      clonedvalidation, namespace, validateUtbetaling, {
        utbetaling: andreMottatteUtbetalinger
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  useEffect(() => {
    let newAndreMottatteUtbetalinger: AndreMottatteUtbetalinger | undefined = _.cloneDeep(andreMottatteUtbetalinger)
    if (_.isUndefined(newAndreMottatteUtbetalinger)) {
      newAndreMottatteUtbetalinger = {} as AndreMottatteUtbetalinger
    }
    if (!_.isEmpty(newAndreMottatteUtbetalinger)) {
      if (newAndreMottatteUtbetalinger?._utbetalingEtterEndtArbeidsforholdCheckbox === undefined) {
        newAndreMottatteUtbetalinger._utbetalingEtterEndtArbeidsforholdCheckbox = !_.isEmpty(newAndreMottatteUtbetalinger?.utbetalingEtterEndtArbeidsforhold)
      }
      if (newAndreMottatteUtbetalinger?._kompensasjonForEndtArbeidsforholdCheckbox === undefined) {
        newAndreMottatteUtbetalinger._kompensasjonForEndtArbeidsforholdCheckbox = !_.isEmpty(newAndreMottatteUtbetalinger?.kompensasjonForEndtArbeidsforhold)
      }
      if (newAndreMottatteUtbetalinger?._kompensasjonForFeriedagerCheckbox === undefined) {
        newAndreMottatteUtbetalinger._kompensasjonForFeriedagerCheckbox = (!_.isEmpty(newAndreMottatteUtbetalinger?.kompensasjonForFeriedager?.antallDager) || !_.isEmpty(newAndreMottatteUtbetalinger?.kompensasjonForFeriedager?.beloep))
      }
      if (newAndreMottatteUtbetalinger?._avkallKompensasjonBegrunnelseCheckbox === undefined) {
        newAndreMottatteUtbetalinger._avkallKompensasjonBegrunnelseCheckbox = !_.isEmpty(newAndreMottatteUtbetalinger?.avkallKompensasjonBegrunnelse)
      }
      if (newAndreMottatteUtbetalinger?._andreYtelserSomMottasForTidenCheckbox === undefined) {
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
      <AlignStartRow>
        <Column>
          <Checkbox
            checked={andreMottatteUtbetalinger?._utbetalingEtterEndtArbeidsforholdCheckbox}
            data-testid={namespace + '-utbetalingEtterEndtArbeidsforholdCheckbox'}
            id={namespace + '-utbetalingEtterEndtArbeidsforholdCheckbox'}
            error={!!validation[namespace + '-utbetalingEtterEndtArbeidsforhold']?.feilmelding}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUtbetalingEtterEndtArbeidsforholdCheckbox(e.target.checked)}
          >
            <FlexDiv>
              {t('el:checkbox-pdu1-4.1')}
              <Input
                error={validation[namespace + '-utbetalingEtterEndtArbeidsforhold']?.feilmelding}
                namespace={namespace}
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

      <AlignStartRow>
        <Column>
          <Checkbox
            checked={andreMottatteUtbetalinger?._kompensasjonForEndtArbeidsforholdCheckbox}
            data-testid={namespace + '-kompensasjonForEndtArbeidsforholdCheckbox'}
            error={!!validation[namespace + '-kompensasjonForEndtArbeidsforhold']?.feilmelding}
            id={namespace + '-kompensasjonForEndtArbeidsforholdCheckbox'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKompensasjonForEndtArbeidsforholdCheckbox(e.target.checked)}
          >
            <FlexDiv>
              {t('el:checkbox-pdu1-4.2')}
              <Input
                error={validation[namespace + '-kompensasjonForEndtArbeidsforhold']?.feilmelding}
                namespace={namespace}
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

      <AlignStartRow>
        <Column>
          <Checkbox
            checked={andreMottatteUtbetalinger?._kompensasjonForFeriedagerCheckbox}
            data-testid={namespace + '-kompensasjonForFeriedagerCheckbox'}
            error={!!validation[namespace + '-kompensasjonForFeriedager']?.feilmelding}
            id={namespace + '-kompensasjonForFeriedagerCheckbox'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKompensasjonForFeriedagerCheckbox(e.target.checked)}
          >
            <FlexDiv>
              {t('el:checkbox-pdu1-4.3')}
              <Input
                error={validation[namespace + '-kompensasjonForFeriedager-beloep']?.feilmelding}
                namespace={namespace}
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

      <AlignStartRow>
        <Column>
          <Checkbox
            checked={andreMottatteUtbetalinger?._avkallKompensasjonBegrunnelseCheckbox}
            data-testid={namespace + '-avkallKompensasjonBegrunnelseCheckbox'}
            error={!!validation[namespace + '-avkallKompensasjonBegrunnelseCheckbox']?.feilmelding}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAvkallKompensasjonBegrunnelseCheckbox(e.target.checked)}
          >
            <FlexDiv>
              {t('el:checkbox-pdu1-4.4')}
              <Input
                error={validation[namespace + '-avkallKompensasjonBegrunnelse']?.feilmelding}
                namespace={namespace}
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

      <AlignStartRow>
        <Column>
          <Checkbox
            checked={andreMottatteUtbetalinger?._andreYtelserSomMottasForTidenCheckbox}
            data-testid={namespace + '-andreYtelserSomMottasForTidenCheckbox'}
            error={!!validation[namespace + '-andreYtelserSomMottasForTidenCheckbox']?.feilmelding}
            id={namespace + '-andreYtelserSomMottasForTidenCheckbox'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAndreYtelserSomMottasForTidenCheckbox(e.target.checked)}
          >
            <FlexDiv>
              {t('el:checkbox-pdu1-4.5')}&nbsp;&nbsp;
              <Input
                error={validation[namespace + '-andreYtelserSomMottasForTiden']?.feilmelding}
                namespace={namespace}
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
