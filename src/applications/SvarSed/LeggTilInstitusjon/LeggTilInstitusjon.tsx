import { Box, Heading, Loader, RadioGroup, Select, Textarea, VStack } from '@navikt/ds-react'
import { Country } from '@navikt/land-verktoy'
import { getInstitusjoner } from 'actions/sak'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps } from 'applications/SvarSed/MainForm'
import CountryDropdown from 'components/CountryDropdown/CountryDropdown'
import RadioPanel from 'components/RadioPanel/RadioPanel'
import { State } from 'declarations/reducers'
import { Institusjon } from 'declarations/types'
import { X005Sed } from 'declarations/x005'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { useEffect, useState, JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateLeggTilInstitusjon, ValidationLeggTilInstitusjonProps } from './validation'

interface LeggTilInstitusjonSelector {
  validation: State['validation']['status']
  institusjonList: State['sak']['institusjonList']
  gettingInstitusjoner: State['loading']['gettingInstitusjoner']
}

const mapState = (state: State): LeggTilInstitusjonSelector => ({
  validation: state.validation.status,
  institusjonList: state.sak.institusjonList,
  gettingInstitusjoner: state.loading.gettingInstitusjoner
})

const LeggTilInstitusjon: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { validation, institusjonList, gettingInstitusjoner } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-leggtilinstitusjon`
  const sed = replySed as X005Sed
  const bucType = sed.sak?.sakType
  const [landkode, setLandkode] = useState<string | undefined>(sed.leggTilInstitusjon?.__landkode)

  useEffect(() => {
    if (bucType && landkode && _.isEmpty(institusjonList)) {
      dispatch(getInstitusjoner(bucType, landkode))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationLeggTilInstitusjonProps>(
      clonedValidation, namespace, validateLeggTilInstitusjon, {
        replySed: sed,
        personName
      }
    )
    dispatch(setValidation(clonedValidation))
  })

  const onLandkodeChange = (country: Country): void => {
    setLandkode(country.value)
    dispatch(updateReplySed('leggTilInstitusjon.__landkode', country.value))
    if (bucType && country.value) {
      dispatch(getInstitusjoner(bucType, country.value))
    }
    dispatch(updateReplySed('leggTilInstitusjon.institusjonId', ''))
    dispatch(updateReplySed('leggTilInstitusjon.institusjonNavn', ''))
  }

  const onInstitusjonChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedIndex = event.target.selectedIndex
    const navn = event.target.options[selectedIndex].text
    const id = event.target.value
    dispatch(updateReplySed('leggTilInstitusjon.institusjonId', id))
    dispatch(updateReplySed('leggTilInstitusjon.institusjonNavn', id ? navn : ''))
    if (validation[namespace + '-institusjon']) {
      dispatch(resetValidation(namespace + '-institusjon'))
    }
  }

  const setGrunnType = (grunnType: string) => {
    dispatch(updateReplySed('leggTilInstitusjon.grunnType', grunnType.trim()))
    if (grunnType !== 'annet') {
      dispatch(updateReplySed('leggTilInstitusjon.grunnAnnet', ''))
    }
    if (validation[namespace + '-grunnType']) {
      dispatch(resetValidation(namespace + '-grunnType'))
    }
  }

  const setGrunnAnnet = (grunnAnnet: string) => {
    dispatch(updateReplySed('leggTilInstitusjon.grunnAnnet', grunnAnnet))
    if (validation[namespace + '-grunnAnnet']) {
      dispatch(resetValidation(namespace + '-grunnAnnet'))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <CountryDropdown
          closeMenuOnSelect
          data-testid={namespace + '-landkode'}
          id={namespace + '-landkode'}
          countryCodeListName="euEftaLand"
          label={t('label:land')}
          onOptionSelected={onLandkodeChange}
          flagWave
          values={landkode ?? null}
          menuPortalTarget={null}
        />

        <Select
          data-testid={namespace + '-institusjon'}
          disabled={!!_.isEmpty(landkode) || gettingInstitusjoner}
          error={validation[namespace + '-institusjon']?.feilmelding}
          id={namespace + '-institusjon'}
          label={t('label:institusjon')}
          onChange={onInstitusjonChange}
          value={sed.leggTilInstitusjon?.institusjonId ?? ''}
        >
          <option value=''>{t('label:velg')}</option>
          {institusjonList && _.orderBy(institusjonList, 'navn').map((i: Institusjon) => (
            <option value={i.institusjonsID} key={i.institusjonsID}>
              {i.navn}
            </option>
          ))}
        </Select>
        {gettingInstitusjoner && <Loader />}

        <RadioGroup
          value={sed.leggTilInstitusjon?.grunnType ?? ''}
          data-testid={namespace + '-grunnType'}
          error={validation[namespace + '-grunnType']?.feilmelding}
          id={namespace + '-grunnType'}
          legend={t('label:leggtilinstitusjon-grunn')}
          onChange={setGrunnType}
        >
          <VStack gap="space-4">
            <RadioPanel value='personen_arbeider_eller_har_arbeidet_i_dette_landet'>{t('el:option-leggtilinstitusjon-grunn-01')}</RadioPanel>
            <RadioPanel value='en_annen_institusjon_er_kompetent_institusjon_i_saken'>{t('el:option-leggtilinstitusjon-grunn-02')}</RadioPanel>
            <RadioPanel value='annet'>{t('el:option-leggtilinstitusjon-grunn-99')}</RadioPanel>
          </VStack>
        </RadioGroup>

        {sed.leggTilInstitusjon?.grunnType === 'annet' && (
          <Textarea
            error={validation[namespace + '-grunnAnnet']?.feilmelding}
            id={namespace + '-grunnAnnet'}
            label={t('label:leggtilinstitusjon-grunn-annet')}
            maxLength={255}
            resize
            value={sed.leggTilInstitusjon?.grunnAnnet ?? ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setGrunnAnnet(e.target.value)}
          />
        )}
      </VStack>
    </Box>
  )
}

export default LeggTilInstitusjon
