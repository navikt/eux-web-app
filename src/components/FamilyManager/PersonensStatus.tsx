import Tilsette from 'assets/icons/Tilsette'
import Op1Ansatt from 'components/FamilyManager/Arbeidsforhold/Op1Ansatt'
import LesMer from 'components/LesMer/LesMer'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { UndertekstBold, Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HighContrastRadioPanelGroup,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface PersonensStatusProps {
  gettingArbeidsforholdList: boolean
  highContrast: boolean
  onValueChanged: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation,

  getArbeidsforholdList: (fnr: string | undefined) => void,
  arbeidsforholdList: any
}
const PersonensStatusDiv = styled.div`
  padding: 1rem;
  fieldset {
    width: 100%;
  }
`

const PersonensStatus: React.FC<PersonensStatusProps> = ({
  // highContrast,
  // onValueChanged,
  validation,
  gettingArbeidsforholdList,
  personID,
  replySed,
  getArbeidsforholdList,
  arbeidsforholdList
}:PersonensStatusProps): JSX.Element => {
  const [_arbeidsforhold, setArbeidsforhold] = useState<string>('')
  const [_isDirty, setIsDirty] = useState<boolean>(false)

  const [_seeNewPeriodeInSender, setSeeNewPeriodeInSender] = useState<boolean>(false)
  const [_seeNewReasonToComing, setSeeNewReasonToComing] = useState<boolean>(false)

  const [_currentMedlemsperiodeStartDato, setCurrentMedlemsperiodeStartDato] = useState<string>('')
  const [_currentMedlemsperiodeSluttDato, setCurrentMedlemsperiodeSluttDato] = useState<string>('')
  const [_currentDurationStayStartDato, setCurrentDurationStayStartDato] = useState<string>('')
  const [_currentDurationStaySluttDato, setCurrentDurationStaySluttDato] = useState<string>('')
  const [_currentDurationStaySender, setCurrentDurationStaySender] = useState<string>('')
  const [_currentDurationStayReceiver, setCurrentDurationStayReceiver] = useState<string>('')

  const { t } = useTranslation()

  const onArbeidsforholdChanged = (e: string) => {
    setIsDirty(true)
    setArbeidsforhold(e)
  }

  return (
    <PersonensStatusDiv>
      <Row>
        <Column>
          <Undertittel>
            {t('ui:label-arbeidsforhold-type')}
          </Undertittel>
          <VerticalSeparatorDiv />
          <HighContrastRadioPanelGroup
            data-multiple-line='true'
            data-no-border='true'
            checked={_arbeidsforhold}
            data-test-id='c-familymanager-personenstatus-arbeidsforhold-radiogroup'
            id='c-familymanager-personenstatus-arbeidsforhold-radiogroup'
            feil={undefined}
            name='c-familymanager-personenstatus-arbeidsforhold-radiogroup'
            radios={[
              { label: t('ui:option-personensstatus-1'), value: 'arbeidsforhold-1' },
              { label: t('ui:option-personensstatus-2'), value: 'arbeidsforhold-2' },
              {
                label: (
                  <LesMer
                    visibleText={t('ui:option-personensstatus-3')}
                    invisibleText={t('ui:option-personensstatus-3-more')}
                    moreText={t('ui:label-see-more')}
                    lessText={t('ui:label-see-less')}
                  />),
                value: 'arbeidsforhold-3'
              },
              { label: t('ui:option-personensstatus-4'), value: 'arbeidsforhold-4' },
              {
                label: (
                  <LesMer
                    visibleText={t('ui:option-personensstatus-5')}
                    invisibleText={t('ui:option-personensstatus-5-more')}
                    moreText={t('ui:label-see-more')}
                    lessText={t('ui:label-see-less')}
                  />),
                value: 'arbeidsforhold-5'
              }
            ]}
            onChange={(e: any) => onArbeidsforholdChanged(e.target.value)}
          />
        </Column>
      </Row>
      {_arbeidsforhold === 'arbeidsforhold-1' && (
        <Op1Ansatt
          arbeidsforholdList={arbeidsforholdList}
          getArbeidsforholdList={getArbeidsforholdList}
          gettingArbeidsforholdList={gettingArbeidsforholdList}
          replySed={replySed}
          personID={personID}
          validation={validation}
        />
      )}

      {(_arbeidsforhold === 'arbeidsforhold-1' || _arbeidsforhold === 'arbeidsforhold-2') && (
        <>
          <VerticalSeparatorDiv data-size='2' />
          <Undertittel>
            {t('ui:label-periode-in-sender')}
          </Undertittel>
          <VerticalSeparatorDiv />
          {!_seeNewPeriodeInSender
            ? (
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => setSeeNewPeriodeInSender(true)}
              >
                <Tilsette />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('ui:label-add-new-periode-in-sender')}
              </HighContrastFlatknapp>
              )
            : (
              <div>
                <UndertekstBold>
                  {t('ui:label-medlemperiode')}
                </UndertekstBold>
                <VerticalSeparatorDiv />
                <Row>
                  <Column>
                    <HighContrastInput
                      data-test-id={'c-familymanager-' + personID + '-personensstatus-medlemsperiode-startdato-input'}
                      feil={validation['person-' + personID + '-personensstatus-medlemsperiode-startdato']
                        ? validation['person-' + personID + '-personensstatus-medlemsperiode-startdato']!.feilmelding
                        : undefined}
                      id={'c-familymanager-' + personID + '-personensstatus-medlemsperiode-startdato-input'}
                      onChange={(e: any) => setCurrentMedlemsperiodeStartDato(e.target.value)}
                      value={_currentMedlemsperiodeStartDato}
                      label={t('ui:label-startDate')}
                      placeholder={t('ui:placeholder-date-default')}
                    />
                  </Column>
                  <Column>
                    <HighContrastInput
                      data-test-id={'c-familymanager-' + personID + '-personensstatus-medlemsperiode-sluttdato-input'}
                      feil={validation['person-' + personID + '-personensstatus-medlemsperiode-sluttdato']
                        ? validation['person-' + personID + '-personensstatus-medlemsperiode-sluttdato']!.feilmelding
                        : undefined}
                      id={'c-familymanager-' + personID + '-personensstatus-medlemsperiode-sluttdato-input'}
                      onChange={(e: any) => setCurrentMedlemsperiodeSluttDato(e.target.value)}
                      value={_currentMedlemsperiodeSluttDato}
                      label={t('ui:label-endDate')}
                      placeholder={t('ui:placeholder-date-default')}
                    />
                  </Column>
                </Row>
              </div>
              )}

          <VerticalSeparatorDiv data-size='2' />
          <Undertittel>
            {t('ui:label-reason-for-coming')}
          </Undertittel>
          <VerticalSeparatorDiv />

          {!_seeNewReasonToComing
            ? (
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => setSeeNewReasonToComing(true)}
              >
                <Tilsette />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('ui:label-add-new-reason-to-coming')}
              </HighContrastFlatknapp>
              )
            : (
              <div>
                <UndertekstBold>
                  {t('ui:label-duration-stay')}
                </UndertekstBold>
                <VerticalSeparatorDiv />
                <Row>
                  <Column>
                    <HighContrastInput
                      data-test-id={'c-familymanager-' + personID + '-personensstatus-durationstay-startdato-input'}
                      feil={validation['person-' + personID + '-personensstatus-durationstay-startdato']
                        ? validation['person-' + personID + '-personensstatus-durationstay-startdato']!.feilmelding
                        : undefined}
                      id={'c-familymanager-' + personID + '-personensstatus-durationstay-startdato-input'}
                      onChange={(e: any) => setCurrentDurationStayStartDato(e.target.value)}
                      value={_currentDurationStayStartDato}
                      label={t('ui:label-startDate')}
                      placeholder={t('ui:placeholder-date-default')}
                    />
                  </Column>
                  <Column>
                    <HighContrastInput
                      data-test-id={'c-familymanager-' + personID + '-personensstatus-durationStay-sluttdato-input'}
                      feil={validation['person-' + personID + '-personensstatus-durationStay-sluttdato']
                        ? validation['person-' + personID + '-personensstatus-durationStay-sluttdato']!.feilmelding
                        : undefined}
                      id={'c-familymanager-' + personID + '-personensstatus-durationStay-sluttdato-input'}
                      onChange={(e: any) => setCurrentDurationStaySluttDato(e.target.value)}
                      value={_currentDurationStaySluttDato}
                      label={t('ui:label-endDate')}
                      placeholder={t('ui:placeholder-date-default')}
                    />
                  </Column>
                </Row>
                <VerticalSeparatorDiv />
                <Row>
                  <Column>
                    <HighContrastInput
                      data-test-id={'c-familymanager-' + personID + '-personensstatus-durationStay-startdato-input'}
                      feil={validation['person-' + personID + '-personensstatus-durationStay-startdato']
                        ? validation['person-' + personID + '-personensstatus-durationStay-startdato']!.feilmelding
                        : undefined}
                      id={'c-familymanager-' + personID + '-personensstatus-durationStay-startdato-input'}
                      onChange={(e: any) => setCurrentDurationStaySender(e.target.value)}
                      value={_currentDurationStaySender}
                      label={t('ui:label-moving-date-sender')}
                      placeholder={t('ui:placeholder-date-default')}
                    />
                  </Column>
                  <Column>
                    <HighContrastInput
                      data-test-id={'c-familymanager-' + personID + '-personensstatus-durationStay-sluttdato-input'}
                      feil={validation['person-' + personID + '-personensstatus-durationStay-sluttdato']
                        ? validation['person-' + personID + '-personensstatus-durationStay-sluttdato']!.feilmelding
                        : undefined}
                      id={'c-familymanager-' + personID + '-personensstatus-durationStay-sluttdato-input'}
                      onChange={(e: any) => setCurrentDurationStayReceiver(e.target.value)}
                      value={_currentDurationStayReceiver}
                      label={t('ui:label-moving-date-receiver')}
                      placeholder={t('ui:placeholder-date-default')}
                    />
                  </Column>
                </Row>
              </div>
              )}
        </>
      )}
      {_isDirty && '*'}
    </PersonensStatusDiv>
  )
}

export default PersonensStatus
