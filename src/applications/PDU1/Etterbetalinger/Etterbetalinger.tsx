import {Box, Checkbox, Heading, HStack, VStack} from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { validateEtterbetalinger, ValidationUtbetalingProps } from 'applications/PDU1/Etterbetalinger/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Input from 'components/Forms/Input'
import { Etterbetalinger } from 'declarations/pd'
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

const EtterbetalingerFC: React.FC<MainFormProps> = ({
  parentNamespace,
  replySed,
  updateReplySed
} :MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target = 'etterbetalinger'
  const etterbetalinger: Etterbetalinger | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-etterbetalinger`

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationUtbetalingProps>(
      clonedvalidation, namespace, validateEtterbetalinger, {
        etterbetalinger: etterbetalinger
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  useEffect(() => {
    let newAndreMottatteUtbetalinger: Etterbetalinger | undefined = _.cloneDeep(etterbetalinger)
    if (_.isUndefined(newAndreMottatteUtbetalinger)) {
      newAndreMottatteUtbetalinger = {} as Etterbetalinger
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
    if (!etterbetalinger?._utbetalingEtterEndtArbeidsforholdCheckbox) {
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
    if (!etterbetalinger?._kompensasjonForEndtArbeidsforholdCheckbox) {
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
    if (!etterbetalinger?._kompensasjonForFeriedagerCheckbox) {
      setKompensasjonForFeriedagerCheckbox(true)
    }
    dispatch(updateReplySed(`${target}.kompensasjonForFeriedager.antallDager`, antallDager.trim()))
    if (validation[namespace + '-kompensasjonForFeriedager-antallDager']) {
      dispatch(resetValidation(namespace + '-kompensasjonForFeriedager-antallDager'))
    }
  }

  const setKompensasjonForFeriedagerBeloep = (beloep: string) => {
    if (!etterbetalinger?._kompensasjonForFeriedagerCheckbox) {
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
    if (!etterbetalinger?._avkallKompensasjonBegrunnelseCheckbox) {
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
    if (!etterbetalinger?._andreYtelserSomMottasForTidenCheckbox) {
      setAndreYtelserSomMottasForTidenCheckbox(true)
    }
    dispatch(updateReplySed(`${target}.andreYtelserSomMottasForTiden`, andreYtelserSomMottasForTiden.trim()))
    if (validation[namespace + '-andreYtelserSomMottasForTiden']) {
      dispatch(resetValidation(namespace + '-andreYtelserSomMottasForTiden'))
    }
  }

  return (
    <Box padding="4" key={namespace + '-div'}>
      <VStack gap="4">
        <Heading size='medium'>
          {t('label:andre-mottatte-utbetalinger')}
        </Heading>
        <Checkbox
          checked={etterbetalinger?._utbetalingEtterEndtArbeidsforholdCheckbox}
          data-testid={namespace + '-utbetalingEtterEndtArbeidsforholdCheckbox'}
          id={namespace + '-utbetalingEtterEndtArbeidsforholdCheckbox'}
          error={!!validation[namespace + '-utbetalingEtterEndtArbeidsforhold']?.feilmelding}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUtbetalingEtterEndtArbeidsforholdCheckbox(e.target.checked)}
        >
          <HStack gap="2" align="start" wrap={false}>
            {t('el:checkbox-pdu1-4.1')}
            <Input
              error={validation[namespace + '-utbetalingEtterEndtArbeidsforhold']?.feilmelding}
              namespace={namespace}
              id='utbetalingEtterEndtArbeidsforhold'
              label=''
              hideLabel
              onChanged={setUtbetalingEtterEndtArbeidsforhold}
              value={etterbetalinger?.utbetalingEtterEndtArbeidsforhold}
            />
          </HStack>
        </Checkbox>

        <Checkbox
          checked={etterbetalinger?._kompensasjonForEndtArbeidsforholdCheckbox}
          data-testid={namespace + '-kompensasjonForEndtArbeidsforholdCheckbox'}
          error={!!validation[namespace + '-kompensasjonForEndtArbeidsforhold']?.feilmelding}
          id={namespace + '-kompensasjonForEndtArbeidsforholdCheckbox'}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKompensasjonForEndtArbeidsforholdCheckbox(e.target.checked)}
        >
          <HStack gap="2" align="start" wrap={false}>
            {t('el:checkbox-pdu1-4.2')}
            <Input
              error={validation[namespace + '-kompensasjonForEndtArbeidsforhold']?.feilmelding}
              namespace={namespace}
              id='kompensasjonForEndtArbeidsforhold'
              label=''
              hideLabel
              onChanged={setKompensasjonForEndtArbeidsforhold}
              value={etterbetalinger?.kompensasjonForEndtArbeidsforhold}
            />
          </HStack>
        </Checkbox>

        <Checkbox
          checked={etterbetalinger?._kompensasjonForFeriedagerCheckbox}
          data-testid={namespace + '-kompensasjonForFeriedagerCheckbox'}
          error={!!validation[namespace + '-kompensasjonForFeriedager']?.feilmelding}
          id={namespace + '-kompensasjonForFeriedagerCheckbox'}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKompensasjonForFeriedagerCheckbox(e.target.checked)}
        >
          <HStack gap="2" align="start" wrap={false}>
            {t('el:checkbox-pdu1-4.3')}
            <Input
              error={validation[namespace + '-kompensasjonForFeriedager-beloep']?.feilmelding}
              namespace={namespace}
              id='kompensasjonForFeriedager-beloep'
              label=''
              hideLabel
              onChanged={setKompensasjonForFeriedagerBeloep}
              value={etterbetalinger?.kompensasjonForFeriedager?.beloep}
            />
            <Box paddingInline="2">
              for
            </Box>
            <Input
              error={validation[namespace + '-kompensasjonForFeriedager-antallDager']?.feilmelding}
              namespace={namespace}
              id='kompensasjonForFeriedager-antallDager'
              label=''
              hideLabel
              onChanged={setKompensasjonForFeriedagerAntallDager}
              value={etterbetalinger?.kompensasjonForFeriedager?.antallDager}
            />
            <Box paddingInline="2">
              dager
            </Box>
          </HStack>
        </Checkbox>

        <Checkbox
          checked={etterbetalinger?._avkallKompensasjonBegrunnelseCheckbox}
          data-testid={namespace + '-avkallKompensasjonBegrunnelseCheckbox'}
          error={!!validation[namespace + '-avkallKompensasjonBegrunnelseCheckbox']?.feilmelding}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAvkallKompensasjonBegrunnelseCheckbox(e.target.checked)}
        >
          <HStack gap="2" align="start" wrap={false}>
            {t('el:checkbox-pdu1-4.4')}
            <Input
              error={validation[namespace + '-avkallKompensasjonBegrunnelse']?.feilmelding}
              namespace={namespace}
              id='avkallKompensasjonBegrunnelse'
              label=''
              hideLabel
              onChanged={setAvkallKompensasjonBegrunnelse}
              value={etterbetalinger?.avkallKompensasjonBegrunnelse}
            />
          </HStack>
        </Checkbox>

        <Checkbox
          checked={etterbetalinger?._andreYtelserSomMottasForTidenCheckbox}
          data-testid={namespace + '-andreYtelserSomMottasForTidenCheckbox'}
          error={!!validation[namespace + '-andreYtelserSomMottasForTidenCheckbox']?.feilmelding}
          id={namespace + '-andreYtelserSomMottasForTidenCheckbox'}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAndreYtelserSomMottasForTidenCheckbox(e.target.checked)}
        >
          <HStack gap="2" align="start" wrap={false}>
            {t('el:checkbox-pdu1-4.5')}
            <Input
              error={validation[namespace + '-andreYtelserSomMottasForTiden']?.feilmelding}
              namespace={namespace}
              id='andreYtelserSomMottasForTiden'
              label=''
              hideLabel
              onChanged={setAndreYtelserSomMottasForTiden}
              value={etterbetalinger?.andreYtelserSomMottasForTiden}
            />
          </HStack>
        </Checkbox>
      </VStack>
    </Box>
  )
}

export default EtterbetalingerFC
