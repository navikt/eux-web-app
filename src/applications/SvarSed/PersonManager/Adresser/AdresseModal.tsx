import AdresseBox from 'components/AdresseBox/AdresseBox'
import Modal from 'components/Modal/Modal'
import { Adresse as IAdresse, AdresseType } from 'declarations/sed'
import _ from 'lodash'
import { Detail, Checkbox } from '@navikt/ds-react'
import { AlignStartRow, Column, RadioPanelBorder, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export interface AdresseModalProps {
  open: boolean
  personName: string
  adresser: Array<IAdresse> | null | undefined
  onAcceptAdresser: (selectedAdresses: Array<IAdresse>) => void
  onRejectAdresser: () => void
}

const Radio = styled(RadioPanelBorder)`
  max-width: 300px;
  .panel {
    padding: 0px !important;
    background-color: transparent !important;
  }
`

export type AdresseMap = {[k in AdresseType]?: Array<IAdresse>}
export type AdresseKey = {[k in AdresseType]?: boolean}

const AdresseModal: React.FC<AdresseModalProps> = ({
  open, personName, adresser, onAcceptAdresser, onRejectAdresser
}: AdresseModalProps) => {
  const { t } = useTranslation()
  const [selectedAdresser, setSelectedAdresser] = useState<{[k in AdresseType]?: Array<IAdresse>}>({})
  const [adresseMap, setAdresseMap] = useState<AdresseMap>({})
  const [adresseKeys, setAdresseKeys] = useState<AdresseKey>({})

  const onCheckboxClicked = (key: AdresseType, checked: boolean) => {
    setAdresseKeys({
      ...adresseKeys,
      [key]: checked
    })
  }

  const hasAddress = (adresser: Array<IAdresse> | undefined, a: IAdresse) : boolean =>
    _.find(adresser, _a => _a.type === a.type && _a.gate === a.gate) !== undefined

  const onRadioSelected = (key: string, a: IAdresse) => {
    setSelectedAdresser({
      ...selectedAdresser,
      [key]: [a]
    })
    setAdresseKeys({
      ...adresseKeys,
      [key]: true
    })
  }

  const returnAdresse = () => {
    const res: Array<IAdresse> = []
    selectedAdresser.bosted?.forEach(a => res.push(a))
    selectedAdresser.opphold?.forEach(a => res.push(a))
    selectedAdresser.kontakt?.forEach(a => res.push(a))
    selectedAdresser.annet?.forEach(a => res.push(a))
    return res
  }

  const renderAdresses = (key: AdresseType, label: string, adresser: Array<IAdresse>) => {
    return (
      <>
        <Checkbox
          checked={adresseKeys[key]}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCheckboxClicked(key, e.target.checked)}
        >
          <Detail>
            {label}
          </Detail>
        </Checkbox>
        <VerticalSeparatorDiv />

        <AlignStartRow>
          {adresser?.map(a => (
            <Column key={key + '-adresser-' + a.gate}>
              <Radio
                key={key + '-adresser-radio-' + a.gate}
                name={key + '-adresser'}
                checked={hasAddress(selectedAdresser[key], a)}
                label={(<AdresseBox border={false} adresse={a} />)}
                onChange={() => onRadioSelected(key, a)}
              />
            </Column>
          ))}
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </>
    )
  }

  useEffect(() => {
    const newAdresseMap: AdresseMap = {}
    const newAdresseKeys: AdresseKey = {}
    adresser?.forEach((a: IAdresse) => {
      if (!Object.prototype.hasOwnProperty.call(newAdresseMap, (a.type as AdresseType))) {
        newAdresseMap[(a.type as AdresseType)] = []
        newAdresseKeys[(a.type as AdresseType)] = false
      }
      newAdresseMap[(a.type as AdresseType)]?.push(a)
    })
    setAdresseMap(newAdresseMap)
    setAdresseKeys(newAdresseKeys)
  }, [adresser])

  return (
    <Modal
      open={open}
      modal={{
        modalTitle: t('label:pdl-adresse-til', { person: personName }),
        modalContent: (
          <div style={{ padding: '1rem' }}>
            {adresseMap.bosted && renderAdresses('bosted', t('label:bostedsland'), adresseMap.bosted)}
            {adresseMap.opphold && renderAdresses('opphold', t('label:oppholdsland'), adresseMap.opphold)}
            {adresseMap.kontakt && renderAdresses('kontakt', t('label:kontaktadresse'), adresseMap.kontakt)}
            {adresseMap.annet && renderAdresses('annet', t('label:annet'), adresseMap.annet)}
          </div>
        ),
        modalButtons: [{
          main: true,
          text: t('label:fyll-inn-adresse'),
          onClick: () => onAcceptAdresser(returnAdresse())
        }, {
          text: t('el:button-cancel'),
          onClick: onRejectAdresser
        }]
      }}
    />
  )
}

export default AdresseModal
