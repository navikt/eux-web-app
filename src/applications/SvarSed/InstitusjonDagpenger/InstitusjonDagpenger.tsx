import { Box, Heading, Radio, RadioGroup, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import AdresseForm from 'applications/SvarSed/Adresser/AdresseForm'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Input from 'components/Forms/Input'
import InstitutionSelector from 'components/InstitutionSelector/InstitutionSelector'
import { State } from 'declarations/reducers'
import { Adresse } from 'declarations/sed'
import { CountryCodes, Institusjon as IRInstitusjon } from 'declarations/types'
import { KompetentLand, U007Sed } from 'declarations/u007'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { getInstitusjonLandkode, validateInstitusjonDagpenger, ValidationInstitusjonDagpengerProps } from './validation'

interface InstitusjonDagpengerSelector extends MainFormSelector {
  countryCodes: CountryCodes | null | undefined
  cdmVersjonApp: string | undefined
}

const mapState = (state: State): InstitusjonDagpengerSelector => ({
  validation: state.validation.status,
  countryCodes: state.app.countryCodes,
  cdmVersjonApp: state.app.cdmVersjon
})

type FinnesIIR = 'ja' | 'nei'

const InstitusjonDagpenger: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { validation, countryCodes, cdmVersjonApp } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-bruker-institusjondagpenger`
  const sed = replySed as U007Sed
  const cdmVersjon: string | undefined = sed.sak?.cdmVersjon ?? cdmVersjonApp
  const kompetentLand: KompetentLand | undefined = sed.kompetentLand
  // Country picked here before an institution is chosen; kept locally so the address country applies again next time
  const [_valgtLandkode, _setValgtLandkode] = useState<string | undefined>(undefined)
  const institusjonLandkode: string | undefined = kompetentLand?.institusjon?.id
    ? getInstitusjonLandkode(kompetentLand, countryCodes, cdmVersjon)
    : _valgtLandkode ?? getInstitusjonLandkode(kompetentLand, countryCodes, cdmVersjon)
  const finnesIIR: FinnesIIR | undefined = kompetentLand?.institusjon
    ? 'ja'
    : kompetentLand?.uregistrertInstitusjon
      ? 'nei'
      : undefined

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationInstitusjonDagpengerProps>(
      clonedValidation, namespace, validateInstitusjonDagpenger, { replySed: sed, countryCodes, cdmVersjon }, true
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
      dispatch(updateReplySed('kompetentLand.institusjon', kompetentLand?.institusjon ?? {}))
      dispatch(updateReplySed('kompetentLand.uregistrertInstitusjon', undefined))
    } else {
      dispatch(updateReplySed('kompetentLand.uregistrertInstitusjon', kompetentLand?.uregistrertInstitusjon ?? {}))
      dispatch(updateReplySed('kompetentLand.institusjon', undefined))
    }
    dispatch(resetValidation(namespace))
  }

  const setFelt = (path: string, value: string) => {
    dispatch(updateReplySed(`kompetentLand.${path}`, value.trim() || undefined))
    resetFeil(path.replace('.', '-'))
  }

  const setInstitusjonLandkode = (landkode: string) => {
    _setValgtLandkode(landkode)
    dispatch(updateReplySed('kompetentLand.institusjon', {}))
    resetFeil('institusjon-landkode')
    resetFeil('institusjon-id')
  }

  const setInstitusjon = (institusjon: IRInstitusjon | undefined) => {
    if (institusjon) {
      dispatch(updateReplySed('kompetentLand.institusjon', {
        __landkode: institusjonLandkode,
        id: institusjon.institusjonsID,
        navn: institusjon.navn
      }))
    } else {
      _setValgtLandkode(institusjonLandkode)
      dispatch(updateReplySed('kompetentLand.institusjon', {}))
    }
    resetFeil('institusjon-id')
  }

  const setUregistrertInstitusjonAdresse = (adresse: Adresse, whatChanged: string | undefined) => {
    dispatch(updateReplySed('kompetentLand.uregistrertInstitusjon.adresse', adresse))
    if (whatChanged) {
      resetFeil(`uregistrertInstitusjon-adresse-${whatChanged}`)
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
          <InstitutionSelector
            namespace={namespace}
            id="institusjon"
            bucType={sed.sak?.sakType}
            landkode={institusjonLandkode}
            value={kompetentLand?.institusjon?.id}
            valueNavn={kompetentLand?.institusjon?.navn}
            landkodeError={validation[`${namespace}-institusjon-landkode`]?.feilmelding}
            error={validation[`${namespace}-institusjon-id`]?.feilmelding}
            required
            onLandkodeChanged={setInstitusjonLandkode}
            onInstitutionSelected={setInstitusjon}
          />
        )}
        {finnesIIR === 'nei' && (
          <VStack gap="space-16">
            <Input
              error={validation[`${namespace}-uregistrertInstitusjon-navn`]?.feilmelding}
              namespace={namespace}
              id="uregistrertInstitusjon-navn"
              label={t('label:institusjonens-navn')}
              required
              onChanged={(value: string) => setFelt('uregistrertInstitusjon.navn', value)}
              value={kompetentLand?.uregistrertInstitusjon?.navn}
            />
            <Heading size="xsmall">{t('label:institusjonens-adresse')}</Heading>
            <AdresseForm
              type={false}
              options={{ bygning: true, region: true }}
              required={['by', 'land']}
              namespace={`${namespace}-uregistrertInstitusjon-adresse`}
              adresse={kompetentLand?.uregistrertInstitusjon?.adresse}
              onAdressChanged={setUregistrertInstitusjonAdresse}
              validation={validation}
            />
          </VStack>
        )}
      </VStack>
    </Box>
  )
}

export default InstitusjonDagpenger
