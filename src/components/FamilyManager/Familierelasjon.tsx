import Select from 'components/Select/Select'
import { ReplySed } from 'declarations/sed'
import { Kodeverk } from 'declarations/types'
import { Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastInput,
  HighContrastRadioPanelGroup,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface FamilierelasjonProps {
  familierelasjonKodeverk: Array<Kodeverk>
  highContrast: boolean
  personID: string
  replySed: ReplySed
}
const FamilierelasjonDiv = styled.div`
  padding: 1rem;
  fieldset {
    width: 100%;
  }
`
const Familierelasjon: React.FC<FamilierelasjonProps> = ({
  familierelasjonKodeverk,
  // person,
  highContrast
}:FamilierelasjonProps): JSX.Element => {
  const [_relasjon, setRelasjon] = useState<string>('')
  const [_sluttDato, setSluttDato] = useState<string>('')
  const [_startDato, setStartDato] = useState<string>('')
  const [_otherRelasjon, setOtherRelasjon] = useState<string>('')
  const [_name, setName] = useState<string>('')
  const [_date, setDate] = useState<string>('')
  const [_livesTogether, setLivesTogether] = useState<string>('')
  const [_isDirty, setIsDirty] = useState<boolean>(false)
  const { t } = useTranslation()

  const onRelasjonChanged = (e: string) => {
    setIsDirty(true)
    setRelasjon(e)
  }

  const onSluttDatoChanged = (e: string) => {
    setIsDirty(true)
    setSluttDato(e)
  }

  const onStartDatoChanged = (e: string) => {
    setIsDirty(true)
    setStartDato(e)
  }

  const onOtherRelasjonChanged = (e: string) => {
    setIsDirty(true)
    setOtherRelasjon(e)
  }

  const onNameChanged = (e: string) => {
    setIsDirty(true)
    setName(e)
  }

  const onDateChanged = (e: string) => {
    setIsDirty(true)
    setDate(e)
  }

  const onLivesTogetherChanged = (e: string) => {
    setIsDirty(true)
    setLivesTogether(e)
  }

  return (
    <FamilierelasjonDiv>
      <Undertittel>
        {t('ui:label-familierelasjon-title')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <Row>
        <Column data-flex='2'>
          <Select
            data-test-id='c-familymanager-familierelasjon-select'
            id='c-familymanager-familierelasjon-select'
            highContrast={highContrast}
            label={t('ui:label-type')}
            onChange={(e) => onRelasjonChanged(e.value)}
            options={familierelasjonKodeverk.map((f: Kodeverk) => ({
              label: f.term, value: f.kode
            })).concat({
              label: `${t('ui:label-other')} (${t('ui:label-freetext')})`,
              value: 'other'
            })}
            placeholder={t('ui:placeholder-select-default')}
            value={_relasjon}
          />
        </Column>
        <Column>
          <HighContrastInput
            data-test-id='c-familymanager-familierelasjonr-startdato-input'
            id='c-familymanager-familierelasjonr-startdato-input'
            onChange={(e: any) => onStartDatoChanged(e.target.value)}
            value={_startDato}
            label={t('ui:label-startDate')}
            placeholder={t('ui:placeholder-date-default')}
          />
        </Column>
        <Column>
          <HighContrastInput
            data-test-id='c-familymanager-familierelasjonr-sluttdato-input'
            id='c-familymanager-familierelasjonr-sluttdato-input'
            onChange={(e: any) => onSluttDatoChanged(e.target.value)}
            value={_sluttDato}
            label={t('ui:label-endDate')}
            placeholder={t('ui:placeholder-date-default')}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      {_relasjon === 'other' && (
        <>
          <Row>
            <Column>
              <HighContrastInput
                data-test-id='c-familymanager-familierelasjonr-other-input'
                id='c-familymanager-familierelasjonr-other-input'
                onChange={(e: any) => onOtherRelasjonChanged(e.target.value)}
                value={_otherRelasjon}
                label={t('ui:label-other-relation')}
                placeholder={t('ui:placeholder-input-default')}
              />
            </Column>
            <Column />
          </Row>
          <HorizontalSeparatorDiv />
          <Row>
            <Column data-flex='2'>
              <HighContrastInput
                data-test-id='c-familymanager-familierelasjonr-navn-input'
                id='c-familymanager-familierelasjonr-navn-input'
                onChange={(e: any) => onNameChanged(e.target.value)}
                value={_name}
                label={t('ui:label-person-name')}
                placeholder={t('ui:placeholder-input-default')}
              />
            </Column>
            <Column>
              <HighContrastInput
                data-test-id='c-familymanager-familierelasjonr-date-input'
                id='c-familymanager-familierelasjonr-date-input'
                onChange={(e: any) => onDateChanged(e.target.value)}
                value={_date}
                label={t('ui:label-date-relation')}
                placeholder={t('ui:placeholder-date-default')}
              />
            </Column>
          </Row>
          <HorizontalSeparatorDiv />
          <Row>
            <Column data-flex='2'>
              <HighContrastRadioPanelGroup
                checked={_livesTogether}
                data-test-id='c-familymanager-familierelasjonr-livetogether-radiogroup'
                id='c-familymanager-familierelasjonr-livetogether-radiogroup'
                feil={undefined}
                legend={t('ui:label-live-together')}
                name='c-familymanager-familierelasjonr-livetogether-radiogroup'
                radios={[
                  { label: t('ui:label-yes'), value: 'ja' },
                  { label: t('ui:label-no'), value: 'nei' }
                ]}
                onChange={(e: any) => onLivesTogetherChanged(e.target.value)}
              />
            </Column>
            <Column />
          </Row>
        </>
      )}
      {_isDirty && '*'}
    </FamilierelasjonDiv>
  )
}

export default Familierelasjon
