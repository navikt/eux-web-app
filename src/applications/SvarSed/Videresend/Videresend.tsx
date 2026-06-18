import { Box, Heading, Loader, RadioGroup, Select, Textarea, VStack } from '@navikt/ds-react'
import { Country } from '@navikt/land-verktoy'
import { getInstitusjoner } from 'actions/sak'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps } from 'applications/SvarSed/MainForm'
import CountryDropdown from 'components/CountryDropdown/CountryDropdown'
import RadioPanel from 'components/RadioPanel/RadioPanel'
import { State } from 'declarations/reducers'
import { Institusjon, Motpart } from 'declarations/types'
import { X007Sed } from 'declarations/x007'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { useState, JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateVideresend, ValidationVideresendProps } from './validation'

interface VideresendSelector {
  validation: State['validation']['status']
  institusjonList: State['sak']['institusjonList']
  gettingInstitusjoner: State['loading']['gettingInstitusjoner']
}

const mapState = (state: State): VideresendSelector => ({
  validation: state.validation.status,
  institusjonList: state.sak.institusjonList,
  gettingInstitusjoner: state.loading.gettingInstitusjoner
})

const Videresend: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-videresend`
  const sed = replySed as X007Sed
  const bucType = sed.sak?.sakType
  const motparter: Array<Motpart> = sed.sak?.motparter ?? []
  const [landkode, setLandkode] = useState<string | undefined>(undefined)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationVideresendProps>(
      clonedValidation, namespace, validateVideresend, {
        replySed: sed,
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const onLandkodeChange = (country: Country): void => {
    setLandkode(country.value)
    if (bucType && country.value) {
      dispatch(getInstitusjoner(bucType, country.value))
    }
    dispatch(updateReplySed('videresend.leggTilInstitusjonId', ''))
    dispatch(updateReplySed('videresend.leggTilInstitusjonNavn', ''))
  }

  const onLeggTilInstitusjonChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedIndex = event.target.selectedIndex
    const navn = event.target.options[selectedIndex].text
    const id = event.target.value
    dispatch(updateReplySed('videresend.leggTilInstitusjonId', id))
    dispatch(updateReplySed('videresend.leggTilInstitusjonNavn', id ? navn : ''))
    if (validation[namespace + '-leggTilInstitusjon']) {
      dispatch(resetValidation(namespace + '-leggTilInstitusjon'))
    }
  }

  const onFjernInstitusjonChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const id = event.target.value
    const motpart = _.find(motparter, (m: Motpart) => m.motpartId === id)
    dispatch(updateReplySed('videresend.fjernInstitusjonId', id))
    dispatch(updateReplySed('videresend.fjernInstitusjonNavn', motpart?.motpartNavn ?? ''))
    if (validation[namespace + '-fjernInstitusjon']) {
      dispatch(resetValidation(namespace + '-fjernInstitusjon'))
    }
  }

  const setGrunnType = (grunnType: string) => {
    dispatch(updateReplySed('videresend.grunnType', grunnType.trim()))
    if (grunnType !== 'annet') {
      dispatch(updateReplySed('videresend.grunnAnnet', ''))
    }
    if (validation[namespace + '-grunnType']) {
      dispatch(resetValidation(namespace + '-grunnType'))
    }
  }

  const setGrunnAnnet = (grunnAnnet: string) => {
    dispatch(updateReplySed('videresend.grunnAnnet', grunnAnnet))
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

        <Heading size='xsmall'>
          {t('label:videresend-leggtilinstitusjon')}
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
          data-testid={namespace + '-leggTilInstitusjon'}
          disabled={(!!_.isEmpty(landkode) && _.isEmpty(sed.videresend?.leggTilInstitusjonId)) || gettingInstitusjoner}
          error={validation[namespace + '-leggTilInstitusjon']?.feilmelding}
          id={namespace + '-leggTilInstitusjon'}
          label={t('label:institusjon')}
          onChange={onLeggTilInstitusjonChange}
          value={sed.videresend?.leggTilInstitusjonId ?? ''}
        >
          <option value=''>{t('label:velg')}</option>
          {sed.videresend?.leggTilInstitusjonId &&
            !_.find(institusjonList, (i: Institusjon) => i.institusjonsID === sed.videresend?.leggTilInstitusjonId) && (
              <option value={sed.videresend.leggTilInstitusjonId}>
                {sed.videresend.leggTilInstitusjonNavn ?? sed.videresend.leggTilInstitusjonId}
              </option>
          )}
          {institusjonList && _.orderBy(institusjonList, 'navn').map((i: Institusjon) => (
            <option value={i.institusjonsID} key={i.institusjonsID}>
              {i.navn}
            </option>
          ))}
        </Select>
        {gettingInstitusjoner && <Loader />}

        <Heading size='xsmall'>
          {t('label:videresend-fjerninstitusjon')}
        </Heading>

        <Select
          data-testid={namespace + '-fjernInstitusjon'}
          error={validation[namespace + '-fjernInstitusjon']?.feilmelding}
          id={namespace + '-fjernInstitusjon'}
          label={t('label:institusjon')}
          onChange={onFjernInstitusjonChange}
          value={sed.videresend?.fjernInstitusjonId ?? ''}
        >
          <option value=''>{t('label:velg')}</option>
          {_.orderBy(motparter, 'motpartNavn').map((m: Motpart) => (
            <option value={m.motpartId} key={m.motpartId}>
              {m.formatertNavn ?? m.motpartNavn}
            </option>
          ))}
        </Select>

        <RadioGroup
          value={sed.videresend?.grunnType ?? ''}
          data-testid={namespace + '-grunnType'}
          error={validation[namespace + '-grunnType']?.feilmelding}
          id={namespace + '-grunnType'}
          legend={t('label:videresend-grunn')}
          onChange={setGrunnType}
        >
          <VStack gap="space-4">
            <RadioPanel value='institusjonen_er_ikke_kompetent_institusjon_i_saken'>{t('el:option-videresend-grunn-01')}</RadioPanel>
            <RadioPanel value='institusjonen_er_ikke_lenger_kompetent_institusjon_i_saken'>{t('el:option-videresend-grunn-02')}</RadioPanel>
            <RadioPanel value='annet'>{t('el:option-videresend-grunn-99')}</RadioPanel>
          </VStack>
        </RadioGroup>

        {sed.videresend?.grunnType === 'annet' && (
          <Textarea
            error={validation[namespace + '-grunnAnnet']?.feilmelding}
            id={namespace + '-grunnAnnet'}
            label={t('label:videresend-grunn-annet')}
            maxLength={255}
            resize
            value={sed.videresend?.grunnAnnet ?? ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setGrunnAnnet(e.target.value)}
          />
        )}
      </VStack>
    </Box>
  )
}

export default Videresend
