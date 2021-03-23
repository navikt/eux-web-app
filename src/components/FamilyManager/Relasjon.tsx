import Select from 'components/Select/Select'
import { ReplySed } from 'declarations/sed'
import { Kodeverk, Validation } from 'declarations/types'
import { Normaltekst, UndertekstBold, Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastInput, HighContrastRadioPanelGroup, Row, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface RelasjonProps {
  familierelasjonKodeverk: Array<Kodeverk>
  highContrast: boolean
  onValueChanged: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation
}
const RelasjonDiv = styled.div`
  padding: 1rem;
  fieldset {
    width: 100%;
  }
`
const CenterRow = styled(Row)`
  align-items: center;
`
const Relasjon: React.FC<RelasjonProps> = ({
  highContrast,
  // onValueChanged,
  personID,
  // replySed,
  validation
}:RelasjonProps): JSX.Element => {
  const [_currentRelasjon, setCurrentRelasjon] = useState<string>('')
  const [_currentRelasjonType, setCurrentRelasjonType] = useState<string>('')
  const [_currentSluttDato, setCurrentSluttDato] = useState<string>('')
  const [_currentStartDato, setCurrentStartDato] = useState<string>('')
  const [_currentForeldreansvar, setCurrentForeldreansvar] = useState<string>('')

  const [_currentQuestion1, setCurrentQuestion1] = useState<string>('')
  const [_currentQuestion2, setCurrentQuestion2] = useState<string>('')
  const [_currentQuestion3, setCurrentQuestion3] = useState<string>('')
  const [_currentQuestion4, setCurrentQuestion4] = useState<string>('')

  const [_isDirty, setIsDirty] = useState<boolean>(false)
  const { t } = useTranslation()

  const relasjonTypeOptions = [
    { label: t('elements:option-relasjon-1'), value: 'option-relasjon-1' },
    { label: t('elements:option-relasjon-2'), value: 'option-relasjon-2' },
    { label: t('elements:option-relasjon-3'), value: 'option-relasjon-3' },
    { label: t('elements:option-relasjon-4'), value: 'option-relasjon-4' },
    { label: t('elements:option-relasjon-5'), value: 'option-relasjon-5' },
    { label: t('elements:option-relasjon-6'), value: 'option-relasjon-6' },
    { label: t('elements:option-relasjon-7'), value: 'option-relasjon-7' },
    { label: t('elements:option-relasjon-8'), value: 'option-relasjon-8' }
  ]

  const setRelasjon = (e: string) => {
    setCurrentRelasjon(e)
    setIsDirty(true)
  }

  const setRelasjonType = (e: string) => {
    setCurrentRelasjonType(e)
    setIsDirty(true)
  }

  const setSluttDato = (e: string) => {
    setCurrentSluttDato(e)
    setIsDirty(true)
  }

  const setStartDato = (e: string) => {
    setCurrentStartDato(e)
    setIsDirty(true)
  }

  const setForeldreansvar = (e: string) => {
    setCurrentForeldreansvar(e)
    setIsDirty(true)
  }

  const setQuestion1 = (e: string) => {
    setCurrentQuestion1(e)
    setIsDirty(true)
  }

  const setQuestion2 = (e: string) => {
    setCurrentQuestion2(e)
    setIsDirty(true)
  }

  const setQuestion3 = (e: string) => {
    setCurrentQuestion3(e)
    setIsDirty(true)
  }

  const setQuestion4 = (e: string) => {
    setCurrentQuestion4(e)
    setIsDirty(true)
  }

  return (
    <RelasjonDiv>
      <Undertittel>
        {t('label:relasjon-title')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <HighContrastRadioPanelGroup
        checked={_currentRelasjon}
        data-test-id={'c-familymanager-' + personID + '-relasjon-radiogroup'}
        id={'c-familymanager-' + personID + '-relasjon-radiogroup'}
        feil={validation['person-' + personID + '-relasjon-radiogroup']
          ? validation['person-' + personID + '-relasjon']!.feilmelding
          : undefined}
        legend={t('label:relation-with')}
        name={'c-familymanager-' + personID + '-relasjon-radiogroup'}
        radios={[
          { label: t('label:searcher'), value: 'søker' },
          { label: t('label:deceased'), value: 'avdød' }
        ]}
        onChange={(e: any) => setRelasjon(e.target.value)}
      />
      <HighContrastRadioPanelGroup
        checked={_currentRelasjon}
        data-test-id={'c-familymanager-' + personID + '-relasjon-radiogroup'}
        id={'c-familymanager-' + personID + '-relasjon-radiogroup'}
        feil={validation['person-' + personID + '-relasjon-radiogroup']
          ? validation['person-' + personID + '-relasjon']!.feilmelding
          : undefined}
        name={'c-familymanager-' + personID + '-relasjon-radiogroup'}
        radios={[
          { label: t('label:partner'), value: 'ektefell/partner' },
          { label: t('label:other-person'), value: 'annen person' }
        ]}
        onChange={(e: any) => setRelasjon(e.target.value)}
      />
      <Row>
        <Column>
          <Select
            data-test-id={'c-familymanager-' + personID + '-relasjon-relasjontype-select'}
            feil={validation['person-' + personID + '-relasjon-relasjontype']
              ? validation['person-' + personID + '-relasjon-relasjontype']!.feilmelding
              : undefined}
            highContrast={highContrast}
            id={'c-familymanager-' + personID + '-relasjon-relasjontype-select'}
            label={t('label:type')}
            onChange={(e) => setRelasjonType(e.value)}
            options={relasjonTypeOptions}
            placeholder={t('elements:placeholder-select-default')}
            selectedValue={_currentRelasjonType}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      <UndertekstBold>
        {t('label:relation-duration')}
      </UndertekstBold>
      <Row>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-relasjon-startdato-input'}
            feil={validation['person-' + personID + '-relasjon-startdato']
              ? validation['person-' + personID + '-relasjon-startdato']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-relasjon-startdato-input'}
            onChange={(e: any) => setStartDato(e.target.value)}
            value={_currentStartDato}
            label={t('label:startDate')}
            placeholder={t('elements:placeholder-date-default')}
          />
        </Column>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-relasjon-sluttdato-input'}
            feil={validation['person-' + personID + '-relasjon-sluttdato']
              ? validation['person-' + personID + '-relasjon-sluttdato']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-relasjon-sluttdato-input'}
            onChange={(e: any) => setSluttDato(e.target.value)}
            value={_currentSluttDato}
            label={t('label:endDate')}
            placeholder={t('elements:placeholder-date-default')}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      <HighContrastRadioPanelGroup
        checked={_currentForeldreansvar}
        data-test-id={'c-familymanager-' + personID + '-foreldreansvar-radiogroup'}
        id={'c-familymanager-' + personID + '-foreldreansvar-radiogroup'}
        feil={validation['person-' + personID + '-foreldreansvar-radiogroup']
          ? validation['person-' + personID + '-foreldreansvar']!.feilmelding
          : undefined}
        legend={t('label:shared-custody')}
        name={'c-familymanager-' + personID + '-foreldreansvar-radiogroup'}
        radios={[
          { label: t('label:yes'), value: 'ja' },
          { label: t('label:no'), value: 'nei' }
        ]}
        onChange={(e: any) => setForeldreansvar(e.target.value)}
      />
      <VerticalSeparatorDiv />
      <UndertekstBold>
        {t('label:children-in-household')}
      </UndertekstBold>
      <CenterRow>
        <Column data-flex='2'>
          <Normaltekst>
            {t('label:children-in-household-question-1')}
          </Normaltekst>
        </Column>
        <Column>
          <HighContrastRadioPanelGroup
            checked={_currentQuestion1}
            data-test-id={'c-familymanager-' + personID + '-question1-radiogroup'}
            id={'c-familymanager-' + personID + '-question1-radiogroup'}
            feil={validation['person-' + personID + '-question1-radiogroup']
              ? validation['person-' + personID + '-question1']!.feilmelding
              : undefined}
            name={'c-familymanager-' + personID + '-question1-radiogroup'}
            radios={[
              { label: t('label:yes'), value: 'ja' },
              { label: t('label:no'), value: 'nei' }
            ]}
            onChange={(e: any) => setQuestion1(e.target.value)}
          />
        </Column>
      </CenterRow>

      <CenterRow>
        <Column data-flex='2'>
          <Normaltekst>
            {t('label:children-in-household-question-2')}
          </Normaltekst>
        </Column>
        <Column>
          <HighContrastRadioPanelGroup
            checked={_currentQuestion2}
            data-test-id={'c-familymanager-' + personID + '-question2-radiogroup'}
            id={'c-familymanager-' + personID + '-question2-radiogroup'}
            feil={validation['person-' + personID + '-question2-radiogroup']
              ? validation['person-' + personID + '-question2']!.feilmelding
              : undefined}
            name={'c-familymanager-' + personID + '-question2-radiogroup'}
            radios={[
              { label: t('label:yes'), value: 'ja' },
              { label: t('label:no'), value: 'nei' }
            ]}
            onChange={(e: any) => setQuestion2(e.target.value)}
          />
        </Column>
      </CenterRow>

      <CenterRow>
        <Column data-flex='2'>
          <Normaltekst>
            {t('label:children-in-household-question-3')}
          </Normaltekst>
        </Column>
        <Column>
          <HighContrastRadioPanelGroup
            checked={_currentQuestion3}
            data-test-id={'c-familymanager-' + personID + '-question3-radiogroup'}
            id={'c-familymanager-' + personID + '-question3-radiogroup'}
            feil={validation['person-' + personID + '-question3-radiogroup']
              ? validation['person-' + personID + '-question3']!.feilmelding
              : undefined}
            name={'c-familymanager-' + personID + '-question3-radiogroup'}
            radios={[
              { label: t('label:yes'), value: 'ja' },
              { label: t('label:no'), value: 'nei' }
            ]}
            onChange={(e: any) => setQuestion3(e.target.value)}
          />
        </Column>
      </CenterRow>

      <CenterRow>
        <Column data-flex='2'>
          <Normaltekst>
            {t('label:children-in-household-question-4')}
          </Normaltekst>
        </Column>
        <Column>
          <HighContrastRadioPanelGroup
            checked={_currentQuestion4}
            data-test-id={'c-familymanager-' + personID + '-question4-radiogroup'}
            id={'c-familymanager-' + personID + '-question4-radiogroup'}
            feil={validation['person-' + personID + '-question4-radiogroup']
              ? validation['person-' + personID + '-question4']!.feilmelding
              : undefined}
            name={'c-familymanager-' + personID + '-question4-radiogroup'}
            radios={[
              { label: t('label:yes'), value: 'ja' },
              { label: t('label:no'), value: 'nei' }
            ]}
            onChange={(e: any) => setQuestion4(e.target.value)}
          />
        </Column>
      </CenterRow>

      {_isDirty && '*'}
    </RelasjonDiv>
  )
}

export default Relasjon
