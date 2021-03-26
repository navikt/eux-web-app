import classNames from 'classnames'
import { AlignStartRow, TextAreaDiv } from 'components/StyledComponents'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastInput, HighContrastTextArea, VerticalSeparatorDiv } from 'nav-hoykontrast'
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
  const [_newSluttDato, setNewSluttDato] = useState<string>('')
  const [_newStartDato, setNewStartDato] = useState<string>('')
  const [_newSenderDato, setNewSenderDato] = useState<string>('')
  const [_newReceiverDato, setNewReceiverDato] = useState<string>('')
  const [_newElementsOfPersonalSituation, setNewElementsOfPersonalSituation] = useState<string>('')
  const { t } = useTranslation()
  const namespace = `familymanager-${personID}-grunnlagforbosetting`

  const setAvsenderDato = (e: string) => {
    setNewSenderDato(e)
  }

  const setMottakerDato = (e: string) => {
    setNewReceiverDato(e)
  }

  const setSluttDato = (e: string) => {
    setNewSluttDato(e)
  }

  const setStartDato = (e: string) => {
    setNewStartDato(e)
  }

  const setElementsOfPersonalSituation = (e: string) => {
    setNewElementsOfPersonalSituation(e)
  }

  return (
    <RelasjonDiv>
      <Undertittel>
        {t('el:title-duration-stay')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.0s' }}>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-startdato-date'}
            feil={validation[namespace + '-startdato']?.feilmelding}
            id={'c-' + namespace + '-startdato-date'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDato(e.target.value)}
            value={_newStartDato}
            label={t('label:start-date')}
            placeholder={t('el:placeholder-date-default')}
          />
        </Column>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-startdato-date'}
            feil={validation[namespace + '-sluttdato']?.feilmelding}
            id={'c-' + namespace + '-startdato-sluttdato-date'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSluttDato(e.target.value)}
            value={_newSluttDato}
            label={t('label:end-date')}
            placeholder={t('el:placeholder-date-default')}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-avsenderdato-text'}
            feil={validation[namespace + '-avsenderdato']?.feilmelding}
            id={'c-' + namespace + '-avsenderdato-text'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAvsenderDato(e.target.value)}
            value={_newSenderDato}
            label={t('label:moving-date-sender')}
            placeholder={t('el:placeholder-date-default')}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-mottakerdato-text'}
            feil={validation[namespace + '-mottakerdato']?.feilmelding}
            id={'c-' + namespace + '-mottakerdato-text'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMottakerDato(e.target.value)}
            value={_newReceiverDato}
            label={t('label:moving-date-receiver')}
            placeholder={t('el:placeholder-date-default')}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.3s' }}>
        <Column>
          <TextAreaDiv>
            <HighContrastTextArea
              className={classNames({ 'skjemaelement__input--harFeil': validation[+namespace + '-elementer'] })}
              data-test-id={'c-' + namespace + '-elementer-text'}
              feil={validation[+namespace + '-elementer']}
              id={'c-' + namespace + '-elementer-text'}
              label={t('label:elements-of-personal-situation')}
              placeholder={t('el:placeholder-input-default')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setElementsOfPersonalSituation(e.target.value)}
              value={_newElementsOfPersonalSituation}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
    </RelasjonDiv>
  )
}

export default Relasjon
