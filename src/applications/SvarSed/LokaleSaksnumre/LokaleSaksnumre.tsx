import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons'
import { resetValidation, setValidation } from 'actions/validation'
import { BodyLong, Box, Button, Heading, HGrid, HStack, VStack } from '@navikt/ds-react'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Input from 'components/Forms/Input'
import InstitutionSelector from 'components/InstitutionSelector/InstitutionSelector'
import { State } from 'declarations/reducers'
import { CountryCodes, Institusjon } from 'declarations/types'
import { U007Sed } from 'declarations/u007'
import { U009Sed } from 'declarations/u009'
import { U010Sed } from 'declarations/u010'
import { LokaltSaksnummer } from 'declarations/u'
import { U013Sed } from 'declarations/u013'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getLandkodeFromInstitusjonsId } from 'utils/institusjon'
import performValidation from 'utils/performValidation'
import { validateLokaleSaksnumre, ValidationLokaleSaksnumreProps } from './validation'

interface LokaleSaksnumreSelector extends MainFormSelector {
  countryCodes: CountryCodes | null | undefined
  cdmVersjonApp: string | undefined
}

const mapState = (state: State): LokaleSaksnumreSelector => ({
  validation: state.validation.status,
  countryCodes: state.app.countryCodes,
  cdmVersjonApp: state.app.cdmVersjon
})

const LokaleSaksnumre: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { validation, countryCodes, cdmVersjonApp } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-bruker-lokalesaksnumre`
  const sed = replySed as U007Sed | U009Sed | U010Sed | U013Sed
  const lokaleSaksnumre = sed.lokaleSaksnumre ?? []
  const cdmVersjon: string | undefined = sed.sak?.cdmVersjon ?? cdmVersjonApp

  const getLandkode = (lokaltSaksnummer: LokaltSaksnummer): string | undefined =>
    lokaltSaksnummer.landkode ?? getLandkodeFromInstitusjonsId(lokaltSaksnummer.institusjonsid, countryCodes, cdmVersjon)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationLokaleSaksnumreProps>(
      clonedValidation, namespace, validateLokaleSaksnumre, { lokaleSaksnumre }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const updateSaksnummer = (
    index: number,
    field: keyof LokaltSaksnummer,
    value?: string
  ) => {
    dispatch(updateReplySed(`lokaleSaksnumre[${index}].${field}`, value))
    dispatch(resetValidation(`${namespace}-${index}-${field}`))
  }

  const updateInstitusjon = (index: number, landkode: string | undefined, institusjon: Institusjon | undefined) => {
    dispatch(updateReplySed(`lokaleSaksnumre[${index}]`, {
      ...lokaleSaksnumre[index],
      landkode,
      institusjonsid: institusjon?.institusjonsID,
      institusjonsnavn: institusjon?.navn
    }))
    dispatch(resetValidation(`${namespace}-${index}-institusjon`))
    dispatch(resetValidation(`${namespace}-${index}-institusjonsnavn`))
  }

  const leggTilSaksnummer = () => {
    dispatch(updateReplySed('lokaleSaksnumre', [...lokaleSaksnumre, {}]))
  }

  const fjernSaksnummer = (index: number) => {
    dispatch(updateReplySed('lokaleSaksnumre', lokaleSaksnumre.filter((_, currentIndex) => currentIndex !== index)))
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size="small">{label}</Heading>
        {_.isEmpty(lokaleSaksnumre) && (
          <Box borderWidth="1 0" paddingBlock="space-8">
            <BodyLong>
              {t('message:warning-no-lokale-saksnumre')}
            </BodyLong>
          </Box>
        )}
        {lokaleSaksnumre.map((lokaltSaksnummer, index) => (
          <Box key={index} borderWidth="1" padding="space-16">
            <VStack gap="space-16">
              <InstitutionSelector
                namespace={`${namespace}-${index}`}
                id="institusjon"
                bucType={sed.sak?.sakType}
                landkode={getLandkode(lokaltSaksnummer)}
                value={lokaltSaksnummer.institusjonsid}
                valueNavn={lokaltSaksnummer.institusjonsnavn}
                landkodeError={validation[`${namespace}-${index}-institusjon-landkode`]?.feilmelding}
                error={
                  validation[`${namespace}-${index}-institusjon-id`]?.feilmelding ??
                  validation[`${namespace}-${index}-institusjonsnavn`]?.feilmelding
                }
                required
                onLandkodeChanged={(landkode: string) => updateInstitusjon(index, landkode, undefined)}
                onInstitutionSelected={(institusjon: Institusjon | undefined) =>
                  updateInstitusjon(index, getLandkode(lokaltSaksnummer), institusjon)}
              />
              <HGrid columns={{ xs: 1, md: 2 }} gap="space-16">
                <Input
                  namespace={`${namespace}-${index}`}
                  id="saksnummer"
                  label={t('label:saksnummer')}
                  error={validation[`${namespace}-${index}-saksnummer`]?.feilmelding}
                  required
                  onChanged={(value: string) => updateSaksnummer(index, 'saksnummer', value.trim() || undefined)}
                  value={lokaltSaksnummer.saksnummer}
                />
              </HGrid>
              <HStack justify="end">
                <Button variant="tertiary" onClick={() => fjernSaksnummer(index)} icon={<TrashIcon />}>
                  {t('el:button-remove')}
                </Button>
              </HStack>
            </VStack>
          </Box>
        ))}
        <HStack>
          <Button variant="tertiary" onClick={leggTilSaksnummer} icon={<PlusCircleIcon />}>
            {t('el:button-add-new-x', { x: t('label:lokalt-saksnummer').toLowerCase() })}
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}

export default LokaleSaksnumre
