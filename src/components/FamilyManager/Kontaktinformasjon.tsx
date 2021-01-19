import Select from 'components/Select/Select'
import { Person } from 'declarations/types'
import { Column, HighContrastInput, Row, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface KontaktinformasjonProps {
  person: Person,
  highContrast: boolean
}
const KontaktinformasjonDiv = styled.div`
  padding: 1rem;
  fieldset {
    width: 100%;
  }
`
const Kontaktinformasjon: React.FC<KontaktinformasjonProps> = ({
  // person,
  highContrast
}:KontaktinformasjonProps): JSX.Element => {
  const [_telefonnummer, setTelefonnummer] = useState<string>('')
  const [_type, setType] = useState<string>('')
  const [_epost, setEpost] = useState<string>('')
  const [_isDirty, setIsDirty] = useState<boolean>(false)
  const { t } = useTranslation()

  const onTelefonnummerChanged = (e: string) => {
    setIsDirty(true)
    setTelefonnummer(e)
  }

  const onTypeChanged = (e: string) => {
    setIsDirty(true)
    setType(e)
  }

  const onEpostChanged = (e: string) => {
    setIsDirty(true)
    setEpost(e)
  }

  return (
    <KontaktinformasjonDiv>
      <Row>
        <Column data-flex='2'>
          <HighContrastInput
            data-test-id={'c-familymanager-kontaktinformasjonr-telefonnummer-input'}
            id={'c-familymanager-kontaktinformasjonr-telefonnummer-input'}
            onChange={(e: any) => onTelefonnummerChanged(e.target.value)}
            value={_telefonnummer}
            label={t('ui:label-telefonnummer')}
            placeholder={t('ui:placeholder-input-default')}
          />
        </Column>
        <Column>
          <Select
            data-test-id='c-familymanager-kontaktinformasjonr-type-select'
            id='c-familymanager-kontaktinformasjonr-type-select'
            highContrast={highContrast}
            label={t('ui:label-type')}
            onChange={(e) => onTypeChanged(e.value)}
            options={[{
               label: t('ui:option-work'), value: 'Arbeid'
              }, {
                label: t('ui:option-home'), value: 'Hjem'
              }, {
               label: t('ui:option-mobile'), value: 'Mobil'
            }]}
            placeholder={t('ui:placeholder-select-default')}
            value={_type}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv/>
      <Row>
        <Column data-flex='2'>
          <HighContrastInput
            data-test-id={'c-familymanager-Kontaktinformasjonr-epost-input'}
            id={'c-familymanager-Kontaktinformasjonr-epost-input'}
            onChange={(e: any) => onEpostChanged(e.target.value)}
            value={_epost}
            label={t('ui:label-epost')}
            placeholder={t('ui:placeholder-input-default')}
          />
        </Column>
        <Column/>
      </Row>
      {_isDirty && '*'}
    </KontaktinformasjonDiv>
  )
}

export default Kontaktinformasjon
