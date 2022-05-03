import { Eye, EyeScreened, Search } from '@navikt/ds-icons'
import { Button, Checkbox, Ingress, Label, Loader, Panel, Tag } from '@navikt/ds-react'
import { AlignStartRow, Column, HorizontalSeparatorDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { searchAdresse } from 'actions/adresse'
import AdresseBox from 'components/AdresseBox/AdresseBox'
import { SpacedHr } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Adresse, AdresseType } from 'declarations/sed'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'

export interface AdresseFromPDLSelector {
  adresser: Array<Adresse> | null | undefined
  gettingAdresser: boolean
}

export interface AdresseFromPDLProps {
  personName?: string
  fnr: string
  selectedAdresser: Array<Adresse>
  onAdresserChanged: (selectedAdresser: Array<Adresse>) => void
}

const mapState = (state: State): AdresseFromPDLSelector => ({
  adresser: state.adresse.adresser,
  gettingAdresser: state.loading.gettingAdresser
})

export type AdresseMap = {[k in AdresseType]?: Array<Adresse>}

const AdresseFromPDL: React.FC<AdresseFromPDLProps> = ({
  personName, fnr, selectedAdresser, onAdresserChanged
}: AdresseFromPDLProps) => {
  const { t } = useTranslation()
  const { adresser, gettingAdresser } = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const [_open, _setOpen] = useState<boolean>(false)
  const [adresseMap, setAdresseMap] = useState<AdresseMap>({})

  const hasAddress = (a: Adresse) : boolean => _.some(selectedAdresser, a)

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

  const renderAdresses = (key: AdresseType, label: string, adresser: Array<Adresse>) => (
    <>
      {adresser?.map(adresse => (
        <Checkbox
          key={key + '-adresser-checkbox-' + adresse.gate}
          name={key + '-adresser'}
          checked={hasAddress(adresse)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCheckboxChanged(adresse, e.target.checked)}
        >
          <Tag size='small' variant='info'>{label}</Tag>
          <HorizontalSeparatorDiv size='0.5' />
          <AdresseBox border={false} adresse={adresse} padding='0' oneLine />
        </Checkbox>
      ))}
    </>
  )

  useEffect(() => {
    if (gettingAdresser === false && !_.isNil(adresser)) {
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
    <>
      <AlignStartRow>
        <Column>
          <Button
            variant='primary'
            disabled={gettingAdresser || _.isNil(fnr)}
            onClick={getAdresse}
          >
            <Search />
            {gettingAdresser
              ? t('message:loading-searching')
              : t('label:søk-pdl-adresse-til', { person: personName })}
            {gettingAdresser && <Loader />}
          </Button>
          <HorizontalSeparatorDiv />
          {adresser && !_open && (
            <Button variant='secondary' onClick={() => _setOpen(true)}>
              <Eye />
              {t('el:button-show')}
            </Button>
          )}
          {adresser && _open && (
            <Button variant='secondary' onClick={() => _setOpen(false)}>
              <EyeScreened />
              {t('el:button-hide')}
            </Button>
          )}
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      {_open && (
        <Panel border>
          <Label>
            {t('label:pdl-adresse-til', { person: personName })}
          </Label>
          <SpacedHr />
          <VerticalSeparatorDiv />
          <Ingress>
            {t('label:hvilke-adresser-skal-registreres')}
          </Ingress>
          {adresseMap.bosted && renderAdresses('bosted', t('label:bostedsadresse'), adresseMap.bosted)}
          {adresseMap.opphold && renderAdresses('opphold', t('label:oppholdsadresse'), adresseMap.opphold)}
          {adresseMap.kontakt && renderAdresses('kontakt', t('label:kontaktadresse'), adresseMap.kontakt)}
          {adresseMap.annet && renderAdresses('annet', t('label:annet'), adresseMap.annet)}
        </Panel>
      )}
    </>
  )
}

export default AdresseFromPDL
