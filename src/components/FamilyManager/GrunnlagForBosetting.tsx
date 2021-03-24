import classNames from 'classnames'
import { TextAreaDiv } from 'components/StyledComponents'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastInput, HighContrastTextArea, Row, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface GrunnlagForBosettingProps {
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
const Relasjon: React.FC<GrunnlagForBosettingProps> = ({
  // highContrast,
  // onValueChanged,
  personID,
  // replySed,
  validation
}:GrunnlagForBosettingProps): JSX.Element => {
  const [_currentSluttDato, setCurrentSluttDato] = useState<string>('')
  const [_currentStartDato, setCurrentStartDato] = useState<string>('')
  const [_currentSenderDato, setCurrentSenderDato] = useState<string>('')
  const [_currentReceiverDato, setCurrentReceiverDato] = useState<string>('')

  const [_currentElementsOfPersonalSituation, setCurrentElementsOfPersonalSituation] = useState<string>('')

  const [_isDirty, setIsDirty] = useState<boolean>(false)
  const { t } = useTranslation()

  const setAvsenderDato = (e: string) => {
    setCurrentSenderDato(e)
    setIsDirty(true)
  }

  const setMottakerDato = (e: string) => {
    setCurrentReceiverDato(e)
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

  const setElementsOfPersonalSituation = (e: string) => {
    setCurrentElementsOfPersonalSituation(e)
    setIsDirty(true)
  }

  return (
    <RelasjonDiv>
      <Undertittel>
        {t('label:duration-stay')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <Row>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-grunnlag-startdato-input'}
            feil={validation['person-' + personID + '-grunnlag-startdato']
              ? validation['person-' + personID + '-grunnlag-startdato']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-grunnlag-startdato-input'}
            onChange={(e: any) => setStartDato(e.target.value)}
            value={_currentStartDato}
            label={t('label:start-date')}
            placeholder={t('el:placeholder-date-default')}
          />
        </Column>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-grunnlag-startdato-input'}
            feil={validation['person-' + personID + '-grunnlag-startdato-sluttdato']
              ? validation['person-' + personID + '-grunnlag-startdato-sluttdato']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-grunnlag-startdato-sluttdato-input'}
            onChange={(e: any) => setSluttDato(e.target.value)}
            value={_currentSluttDato}
            label={t('label:end-date')}
            placeholder={t('el:placeholder-date-default')}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      <Row>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-grunnlag-avsenderdato-input'}
            feil={validation['person-' + personID + '-grunnlag-avsenderdato']
              ? validation['person-' + personID + '-grunnlag-avsenderdato']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-grunnlag-avsenderdato-input'}
            onChange={(e: any) => setAvsenderDato(e.target.value)}
            value={_currentSenderDato}
            label={t('label:moving-date-sender')}
            placeholder={t('el:placeholder-date-default')}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-grunnlag-mottakerdato-input'}
            feil={validation['person-' + personID + '-grunnlag-mottakerdato']
              ? validation['person-' + personID + '-grunnlag-mottakerdato']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-grunnlag-mottakerdato-input'}
            onChange={(e: any) => setMottakerDato(e.target.value)}
            value={_currentReceiverDato}
            label={t('label:moving-date-receiver')}
            placeholder={t('el:placeholder-date-default')}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <TextAreaDiv>
            <HighContrastTextArea
              data-test-id={'c-familymanager-' + personID + '-personensstatus-selvstendig-info-textarea'}
              id={'c-familymanager-' + personID + '-personensstatus-selvstendig-info-textarea'}
              className={classNames({
                'skjemaelement__input--harFeil':
                  validation['c-familymanager-' + personID + '-personensstatus-selvstendig-info-textarea']
              })}
              placeholder={t('el:placeholder-input-default')}
              label={t('label:elements-of-personal-situation')}
              onChange={(e: any) => setElementsOfPersonalSituation(e.target.value)}
              value={_currentElementsOfPersonalSituation}
              feil={undefined}
            />
          </TextAreaDiv>
        </Column>
      </Row>
      {_isDirty && '*'}
    </RelasjonDiv>
  )
}

export default Relasjon
