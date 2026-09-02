import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons'
import { resetValidation, setValidation } from 'actions/validation'
import { Box, Button, Heading, HGrid, HStack, VStack } from '@navikt/ds-react'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import CountryDropdown from 'components/CountryDropdown/CountryDropdown'
import Input from 'components/Forms/Input'
import { Country } from 'components/land-verktoy'
import { State } from 'declarations/reducers'
import { LokaltSaksnummer, U013Sed } from 'declarations/u013'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateLokaleSaksnumre, ValidationLokaleSaksnumreProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const LokaleSaksnumre: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-bruker-lokalesaksnumre`
  const lokaleSaksnumre = (replySed as U013Sed).lokaleSaksnumre ?? []

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
        {lokaleSaksnumre.map((lokaltSaksnummer, index) => (
          <Box key={index} borderWidth="1" padding="space-16">
            <VStack gap="space-16">
              <HGrid columns={{ xs: 1, md: 2 }} gap="space-16">
                <CountryDropdown
                  closeMenuOnSelect
                  countryCodeListName="euEftaLand"
                  error={validation[`${namespace}-${index}-landkode`]?.feilmelding}
                  id={`${namespace}-${index}-landkode`}
                  label={t('label:land')}
                  menuPortalTarget={document.body}
                  onOptionSelected={(country: Country) => updateSaksnummer(index, 'landkode', country.value3)}
                  values={lokaltSaksnummer.landkode}
                />
                <Input
                  namespace={`${namespace}-${index}`}
                  id="saksnummer"
                  label={t('label:saksnummer')}
                  error={validation[`${namespace}-${index}-saksnummer`]?.feilmelding}
                  required
                  onChanged={(value: string) => updateSaksnummer(index, 'saksnummer', value.trim() || undefined)}
                  value={lokaltSaksnummer.saksnummer}
                />
                <Input
                  namespace={`${namespace}-${index}`}
                  id="institusjonsid"
                  label={t('label:institusjonens-id')}
                  error={validation[`${namespace}-${index}-institusjonsid`]?.feilmelding}
                  required
                  onChanged={(value: string) => updateSaksnummer(index, 'institusjonsid', value.trim() || undefined)}
                  value={lokaltSaksnummer.institusjonsid}
                />
                <Input
                  namespace={`${namespace}-${index}`}
                  id="institusjonsnavn"
                  label={t('label:institusjonens-navn')}
                  error={validation[`${namespace}-${index}-institusjonsnavn`]?.feilmelding}
                  required
                  onChanged={(value: string) => updateSaksnummer(index, 'institusjonsnavn', value.trim() || undefined)}
                  value={lokaltSaksnummer.institusjonsnavn}
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
