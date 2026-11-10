import { EyeIcon, EyeSlashIcon, MagnifyingGlassIcon } from '@navikt/aksel-icons'
import {Alert, BodyLong, Box, Button, Checkbox, HStack, Label, Loader, Radio, RadioGroup, VStack} from '@navikt/ds-react'
import { searchAdresse } from 'actions/adresse'
import AdresseBox from 'components/AdresseBox/AdresseBox'
import { State } from 'declarations/reducers'
import { Adresse, AdresseType, ReplySed } from 'declarations/sed'
import { CountryCodeLists, CountryCodes, SimpleCountry } from 'declarations/types'
import _ from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'

export interface AdresseFromPDLSelector {
  adresser: Array<Adresse> | null | undefined
  gettingAdresser: boolean
  replySed: ReplySed | null | undefined
  countryCodes: CountryCodes | null | undefined
  cdmVersjonApp: string | undefined
}

export interface AdresseFromPDLProps {
  personName?: string
  fnr: string
  selectedAdresser: Array<Adresse>
  onAdresserChanged: (selectedAdresser: Array<Adresse>) => void
  singleAdress?: boolean
  allowReSearch?: boolean
  // Only addresses with a country in this list (for the SED's CDM version) are shown, e.g. 'euEftaLand'
  countryCodeListName?: string
}

const mapState = (state: State): AdresseFromPDLSelector => ({
  adresser: state.adresse.adresser,
  gettingAdresser: state.loading.gettingAdresser,
  replySed: state.svarsed.replySed,
  countryCodes: state.app.countryCodes,
  cdmVersjonApp: state.app.cdmVersjon
})

export type AdresseMap = {[k in AdresseType]?: Array<Adresse>}

const AdresseFromPDL: React.FC<AdresseFromPDLProps> = ({
  personName, fnr, selectedAdresser, onAdresserChanged, singleAdress, allowReSearch, countryCodeListName
}: AdresseFromPDLProps) => {
  const { t } = useTranslation()
  const { adresser: pdlAdresser, gettingAdresser, replySed, countryCodes, cdmVersjonApp } = useAppSelector(mapState)
  const cdmVersjon: string | undefined = replySed?.sak?.cdmVersjon ?? cdmVersjonApp

  const adresser: Array<Adresse> | null | undefined = useMemo(() => {
    if (!countryCodeListName || !pdlAdresser) {
      return pdlAdresser
    }
    const allowedCountries: Array<SimpleCountry> | undefined = cdmVersjon
      ? countryCodes?.[`v${cdmVersjon}` as keyof CountryCodes]?.[countryCodeListName as keyof CountryCodeLists]
      : undefined
    return pdlAdresser.filter((a: Adresse) => !!allowedCountries?.some((c: SimpleCountry) => c.landkode === a.landkode))
  }, [pdlAdresser, countryCodeListName, countryCodes, cdmVersjon])
  const dispatch = useAppDispatch()

  const [_open, _setOpen] = useState<boolean>(false)
  const [adresseMap, setAdresseMap] = useState<AdresseMap>({})

  const FORM_EDITABLE_FIELDS: Array<keyof Adresse> = ['gate', 'bygning', 'postnummer', 'by', 'region', 'landkode']
  const getAdresseId = (a: Adresse | undefined): string =>
    a ? FORM_EDITABLE_FIELDS.map(field => a[field] ?? '').join('|') : ''
  const hasAddress = (a: Adresse): boolean => _.some(selectedAdresser, a)

  const onCheckboxChanged = (adresse: Adresse, checked: boolean) => {
    let newSelectedAdresser: Array<Adresse> | undefined = _.cloneDeep(selectedAdresser) as Array<Adresse> | undefined
    if (_.isNil(newSelectedAdresser)) {
      newSelectedAdresser = []
    }
    if (checked) {
      newSelectedAdresser.push(adresse)
    } else {
      newSelectedAdresser = _.reject(newSelectedAdresser, (a: Adresse) => _.isEqual(a, adresse))
    }
    onAdresserChanged(newSelectedAdresser)
  }

  const getAdresse = () => {
    if (fnr) {
      _setOpen(false)
      dispatch(searchAdresse(fnr))
    }
  }

  const renderAdresses = (key: AdresseType, adresser: Array<Adresse>) => (
    <>
      {adresser?.map(adresse => (
        <Checkbox
          key={key + '-adresser-checkbox-' + adresse.gate}
          name={key + '-adresser'}
          checked={hasAddress(adresse)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCheckboxChanged(adresse, e.target.checked)}
        >
          <AdresseBox
            border={false}
            seeType
            adresse={{
              ...adresse,
              type: key
            }}
            padding='0'
            oneLine
          />
        </Checkbox>
      ))}
    </>
  )

  const renderAdressesRadio = (key: AdresseType, adresser: Array<Adresse>) => (
    <>
      {adresser?.map(adresse => (
        <Radio
          key={key + '-adresser-checkbox-' + adresse.gate}
          name={key + '-adresser'}
          onChange={() => onAdresserChanged([adresse])}
          value={getAdresseId(adresse)}
        >
          <AdresseBox
            border={false}
            seeType
            adresse={{
              ...adresse,
              type: key
            }}
            padding='0'
            oneLine
          />
        </Radio>
      ))}
    </>
  )

  useEffect(() => {
    if (gettingAdresser === false && !_.isEmpty(adresser)) {
      _setOpen(true)
    }
  }, [adresser, gettingAdresser])

  useEffect(() => {
    const newAdresseMap: AdresseMap = {}
    adresser?.forEach((a: Adresse) => {
      if (!Object.prototype.hasOwnProperty.call(newAdresseMap, (a.type as AdresseType))) {
        newAdresseMap[(a.type as AdresseType)] = []
      }
      newAdresseMap[(a.type as AdresseType)]?.push(a)
    })
    setAdresseMap(newAdresseMap)
  }, [adresser])

  return (
    <VStack gap="space-16">
      <HStack gap="space-16">
        <Button
          variant='primary'
          disabled={gettingAdresser || _.isNil(fnr) || (singleAdress && !allowReSearch && selectedAdresser ? selectedAdresser.length > 0 : false)}
          onClick={getAdresse}
          icon={<MagnifyingGlassIcon/>}
        >
          {gettingAdresser
            ? t('message:loading-searching')
            : t('label:søk-pdl-adresse-til', { person: personName })}
          {gettingAdresser && <Loader />}
        </Button>
        {!_.isNil(adresser) && adresser.length === 0 && (
          <Alert variant='warning'>
            {t('message:warning-no-pdl-address')}
          </Alert>
        )}
        {!_.isEmpty(adresser) && !_open && (
          <Button variant='secondary' onClick={() => _setOpen(true)} icon={<EyeIcon/>}>
            {t('el:button-show')}
          </Button>
        )}
        {!_.isEmpty(adresser) && _open && (
          <Button variant='secondary' onClick={() => _setOpen(false)} icon={<EyeSlashIcon/>}>
            {t('el:button-hide')}
          </Button>
        )}
      </HStack>
      {_open && (
        <Box padding="space-16" borderWidth="1" background="neutral-soft">
          <VStack gap="space-4">
            <Label>
              {t('label:pdl-adresse-til', { person: personName })}
            </Label>
            <Box borderWidth={"1 0 0 0"} paddingBlock="space-8"/>
            <BodyLong size="large">
              {t('label:hvilke-adresser-skal-registreres')}
            </BodyLong>
            {!singleAdress &&
              <>
                {adresseMap.bosted && renderAdresses('bosted', adresseMap.bosted)}
                {adresseMap.opphold && renderAdresses('opphold', adresseMap.opphold)}
                {adresseMap.kontakt && renderAdresses('kontakt', adresseMap.kontakt)}
                {adresseMap.annet && renderAdresses('annet', adresseMap.annet)}
              </>
            }
            {singleAdress &&
              <RadioGroup value={selectedAdresser[0] ? getAdresseId(selectedAdresser[0]) : null} legend="Adresser" hideLegend={true}>
                {adresseMap.bosted && renderAdressesRadio('bosted', adresseMap.bosted)}
                {adresseMap.opphold && renderAdressesRadio('opphold', adresseMap.opphold)}
                {adresseMap.kontakt && renderAdressesRadio('kontakt', adresseMap.kontakt)}
                {adresseMap.annet && renderAdressesRadio('annet', adresseMap.annet)}
              </RadioGroup>
            }
          </VStack>
        </Box>
      )}
    </VStack>
  );
}

export default AdresseFromPDL
