import { Box, Heading, HGrid, Radio, RadioGroup, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import AdresseForm from 'applications/SvarSed/Adresser/AdresseForm'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Input from 'components/Forms/Input'
import { State } from 'declarations/reducers'
import { Adresse } from 'declarations/sed'
import { InstitusjonDagpenger as IInstitusjonDagpenger, U007Sed } from 'declarations/u007'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateInstitusjonDagpenger, ValidationInstitusjonDagpengerProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

type FinnesIIR = 'ja' | 'nei'

const InstitusjonDagpenger: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-bruker-institusjondagpenger`
  const sed = replySed as U007Sed
  const institusjonDagpenger: IInstitusjonDagpenger | undefined = sed.institusjonDagpenger
  const finnesIIR: FinnesIIR | undefined = institusjonDagpenger?.institusjon
    ? 'ja'
    : institusjonDagpenger?.ukjentInstitusjon
      ? 'nei'
      : undefined

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationInstitusjonDagpengerProps>(
      clonedValidation, namespace, validateInstitusjonDagpenger, { replySed: sed }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const resetFeil = (id: string) => {
    if (validation[`${namespace}-${id}`]) {
      dispatch(resetValidation(`${namespace}-${id}`))
    }
  }

  const setFinnesIIR = (value: FinnesIIR) => {
    if (value === 'ja') {
      dispatch(updateReplySed('institusjonDagpenger', { institusjon: institusjonDagpenger?.institusjon ?? {} }))
    } else {
      dispatch(updateReplySed('institusjonDagpenger', { ukjentInstitusjon: institusjonDagpenger?.ukjentInstitusjon ?? {} }))
    }
    dispatch(resetValidation(namespace))
  }

  const setFelt = (path: string, value: string) => {
    dispatch(updateReplySed(`institusjonDagpenger.${path}`, value.trim() || undefined))
    resetFeil(path.replace('.', '-'))
  }

  const setUkjentInstitusjonAdresse = (adresse: Adresse, whatChanged: string | undefined) => {
    dispatch(updateReplySed('institusjonDagpenger.ukjentInstitusjon.adresse', adresse))
    if (whatChanged) {
      resetFeil(`ukjentInstitusjon-adresse-${whatChanged}`)
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size="small">{label}</Heading>
        <RadioGroup
          value={finnesIIR ?? ''}
          id={`${namespace}-finnesIIR`}
          legend={t('label:u007-institusjon-finnes-i-ir')}
          error={validation[`${namespace}-finnesIIR`]?.feilmelding}
          onChange={(value: string) => setFinnesIIR(value as FinnesIIR)}
        >
          <Radio value="ja">{t('label:u007-institusjon-finnes-i-ir-ja')}</Radio>
          <Radio value="nei">{t('label:u007-institusjon-finnes-i-ir-nei')}</Radio>
        </RadioGroup>
        {finnesIIR === 'ja' && (
          <HGrid columns={2} gap="space-16" align="start">
            <Input
              error={validation[`${namespace}-institusjon-id`]?.feilmelding}
              namespace={namespace}
              id="institusjon-id"
              label={t('label:institusjonens-id')}
              required
              onChanged={(value: string) => setFelt('institusjon.id', value)}
              value={institusjonDagpenger?.institusjon?.id}
            />
            <Input
              error={validation[`${namespace}-institusjon-navn`]?.feilmelding}
              namespace={namespace}
              id="institusjon-navn"
              label={t('label:institusjonens-navn')}
              required
              onChanged={(value: string) => setFelt('institusjon.navn', value)}
              value={institusjonDagpenger?.institusjon?.navn}
            />
          </HGrid>
        )}
        {finnesIIR === 'nei' && (
          <VStack gap="space-16">
            <Input
              error={validation[`${namespace}-ukjentInstitusjon-navn`]?.feilmelding}
              namespace={namespace}
              id="ukjentInstitusjon-navn"
              label={t('label:institusjonens-navn')}
              required
              onChanged={(value: string) => setFelt('ukjentInstitusjon.navn', value)}
              value={institusjonDagpenger?.ukjentInstitusjon?.navn}
            />
            <Heading size="xsmall">{t('label:institusjonens-adresse')}</Heading>
            <AdresseForm
              type={false}
              options={{ bygning: true, region: true }}
              required={['by', 'land']}
              namespace={`${namespace}-ukjentInstitusjon-adresse`}
              adresse={institusjonDagpenger?.ukjentInstitusjon?.adresse}
              onAdressChanged={setUkjentInstitusjonAdresse}
              validation={validation}
            />
          </VStack>
        )}
      </VStack>
    </Box>
  )
}

export default InstitusjonDagpenger
