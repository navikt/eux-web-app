import Tilsette from 'assets/icons/Tilsette'
import Arbeidsforhold from 'components/Arbeidsforhold/Arbeidsforhold'
import ArbeidsforholdetFC from 'components/Arbeidsforhold/Arbeidsforholdet'
import { ReplySed } from 'declarations/sed'
import { Arbeidsforholdet, Period, Validation } from 'declarations/types'
import _ from 'lodash'
import { Undertittel, UndertekstBold, Systemtittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp, HighContrastInput, HighContrastKnapp,
  HighContrastRadioPanelGroup,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import LesMer from 'components/LesMer/LesMer'
import ArbeidsforholdetFC from 'components/Arbeidsforhold/Arbeidsforholdet'

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
  //highContrast,
  //onValueChanged,
  validation,
  gettingArbeidsforholdList,
  personID,
  replySed,
  getArbeidsforholdList,
  arbeidsforholdList
}:PersonensStatusProps): JSX.Element => {
  const [_arbeidsforhold, setArbeidsforhold] = useState<string>('')
  const [_isDirty, setIsDirty] = useState<boolean>(false)
  const [_arbeidsforholdList, setArbeidsforholdList] = useState<Array<Arbeidsforholdet> | undefined>(undefined)
  const [_addedArbeidsforholdList, setAddedArbeidsforholdList] = useState<Array<Arbeidsforholdet>>([])

  const [_valgteArbeidsforhold, setValgtArbeidsforhold] = useState<Array<Arbeidsforholdet>>([])
  const [_seeNewPeriodeInSender, setSeeNewPeriodeInSender] = useState<boolean>(false)
  const [_seeNewReasonToComing, setSeeNewReasonToComing] = useState<boolean>(false)
  const [_seeNewArbeidsperiode, setSeeNewArbeidsperiode] = useState<boolean>(false)

  const [_currentArbeidsperiodeStartDato, setCurrentArbeidsperiodeStartDato] = useState<string>('')
  const [_currentArbeidsperiodeSluttDato, setCurrentArbeidsperiodeSluttDato] = useState<string>('')
  const [_currentArbeidsperiodeOrgnr, setCurrentArbeidsperiodeOrgnr] = useState<string>('')
  const [_currentArbeidsperiodeNavn, setCurrentArbeidsperiodeNavn] = useState<string>('')

  const [_currentMedlemsperiodeStartDato, setCurrentMedlemsperiodeStartDato] = useState<string>('')
  const [_currentMedlemsperiodeSluttDato, setCurrentMedlemsperiodeSluttDato] = useState<string>('')
  const [_currentDurationStayStartDato, setCurrentDurationStayStartDato] = useState<string>('')
  const [_currentDurationStaySluttDato, setCurrentDurationStaySluttDato] = useState<string>('')
  const [_currentDurationStaySender, setCurrentDurationStaySender] = useState<string>('')
  const [_currentDurationStayReceiver, setCurrentDurationStayReceiver] = useState<string>('')

  const { t } = useTranslation()
  const fnr: string | undefined = _.find(_.get(replySed, `${personID}.personInfo.pin`), p => p.land === 'NO')?.identifikator

  const onArbeidsforholdClick = (item: any, checked: boolean) => {
    let newValgtArbeidsforhold: Array<Arbeidsforholdet>
    if (checked) {
      newValgtArbeidsforhold = _valgteArbeidsforhold.concat(item)
    } else {
      newValgtArbeidsforhold = _.filter(_valgteArbeidsforhold, v => v !== item)
    }
    setValgtArbeidsforhold(newValgtArbeidsforhold)
  }

  const onArbeidsforholdChanged = (e: string) => {
    setIsDirty(true)
    setArbeidsforhold(e)
  }

  const onAddArbeidsPeriode = () => {
    let newArbeidsforholdList = _.cloneDeep(_arbeidsforholdList)
    if (!newArbeidsforholdList) {
      newArbeidsforholdList = []
    }
    let periode = {
      fom: _currentArbeidsperiodeStartDato
    } as Period
    if (_currentArbeidsperiodeSluttDato) {
      periode.tom = _currentArbeidsperiodeSluttDato
    }

    newArbeidsforholdList = newArbeidsforholdList.concat({
      ansettelsesPeriode: periode,
      orgnr: _currentArbeidsperiodeOrgnr,
      navn: _currentArbeidsperiodeNavn
    } as Arbeidsforholdet)
    setArbeidsforholdList(newArbeidsforholdList)
  }

  useEffect(() => {
    if (_arbeidsforholdList === undefined && arbeidsforholdList !== undefined) {
      setArbeidsforholdList(arbeidsforholdList)
    }
  },[_arbeidsforholdList, arbeidsforholdList, setArbeidsforholdList])

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
        <>
          <Systemtittel>
            {t('ui:label-aaRegistered')}
          </Systemtittel>

          <Arbeidsforhold
            editable
            personID={personID}
            getArbeidsforholdList={() => getArbeidsforholdList(fnr)}
            valgteArbeidsforhold={_valgteArbeidsforhold}
            arbeidsforholdList={_arbeidsforholdList}
            onArbeidsforholdClick={onArbeidsforholdClick}
            gettingArbeidsforholdList={gettingArbeidsforholdList}
            onArbeidsforholdEdited={() => {}}
            onArbeidsforholdDelete={(a: Arbeidsforholdet) =>
              setArbeidsforholdList(_.filter(_arbeidsforholdList, _a => _a.orgnr === a.orgnr))
            }
          />

          {!_.isEmpty(_addedArbeidsforholdList) && (
            <>
              <Undertittel>
                {t('ui:label-arbeidsforhold-type')}
              </Undertittel>
              {_addedArbeidsforholdList?.map((a, i) => (
                <ArbeidsforholdetFC
                  arbeidsforholdet={a}
                  editable={true}
                  index={i}
                  onArbeidsforholdClick={onArbeidsforholdClick}
                  onArbeidsforholdDelete={(a: Arbeidsforholdet) =>
                    setAddedArbeidsforholdList(_.filter(_addedArbeidsforholdList, _a => _a.orgnr === a.orgnr))
                  }
                  onArbeidsforholdEdited={() => {}}
                  personID={personID}
                />
              ))

              }
            </>
          )}

          {!_seeNewArbeidsperiode ? (
            <HighContrastFlatknapp
              mini
              kompakt
              onClick={() => setSeeNewArbeidsperiode(true)}
            >
              <Tilsette />
              <HorizontalSeparatorDiv data-size='0.5' />
              {t('ui:label-add-new-arbeidsperiode')}
            </HighContrastFlatknapp>
            ) : (
              <>
                <Row>
                  <Column>
                    <HighContrastInput
                      data-test-id={'c-familymanager-' + personID + '-personensstatus-arbeidsperiode-startdato-input'}
                      feil={validation['person-' + personID + '-personensstatus-arbeidsperiode-startdato']
                        ? validation['person-' + personID + '-personensstatus-arbeidsperiode-startdato']!.feilmelding
                        : undefined}
                      id={'c-familymanager-' + personID + '-personensstatus-arbeidsperiode-startdato-input'}
                      onChange={(e: any) => setCurrentArbeidsperiodeStartDato(e.target.value)}
                      value={_currentArbeidsperiodeStartDato}
                      label={t('ui:label-startDate')}
                      placeholder={t('ui:placeholder-date-default')}
                    />
                  </Column>
                  <Column>
                    <HighContrastInput
                    data-test-id={'c-familymanager-' + personID + '-personensstatus-arbeidsperiode-sluttdato-input'}
                    feil={validation['person-' + personID + '-personensstatus-arbeidsperiode-sluttdato']
                    ? validation['person-' + personID + '-personensstatus-arbeidsperiode-sluttdato']!.feilmelding
                    : undefined}
                    id={'c-familymanager-' + personID + '-personensstatus-arbeidsperiode-sluttdato-input'}
                    onChange={(e: any) => setCurrentArbeidsperiodeSluttDato(e.target.value)}
                    value={_currentArbeidsperiodeSluttDato}
                    label={t('ui:label-endDate')}
                    placeholder={t('ui:placeholder-date-default')}
                    />
                  </Column>
              </Row>
              <VerticalSeparatorDiv data-size='0.5'/>
              <Row>
                <Column>
                  <HighContrastInput
                    data-test-id={'c-familymanager-' + personID + '-personensstatus-arbeidsperiode-orgnr-input'}
                    feil={validation['person-' + personID + '-personensstatus-arbeidsperiode-orgnr']
                      ? validation['person-' + personID + '-personensstatus-arbeidsperiode-orgnr']!.feilmelding
                      : undefined}
                    id={'c-familymanager-' + personID + '-personensstatus-arbeidsperiode-orgnr-input'}
                    onChange={(e: any) => setCurrentArbeidsperiodeOrgnr(e.target.value)}
                    value={_currentArbeidsperiodeOrgnr}
                    label={t('ui:label-orgnr')}
                    placeholder={t('ui:placeholder-input-default')}
                  />
                </Column>
                <Column>
                  <HighContrastInput
                    data-test-id={'c-familymanager-' + personID + '-personensstatus-arbeidsperiode-navn-input'}
                    feil={validation['person-' + personID + '-personensstatus-arbeidsperiode-navn']
                      ? validation['person-' + personID + '-personensstatus-arbeidsperiode-navn']!.feilmelding
                      : undefined}
                    id={'c-familymanager-' + personID + '-personensstatus-arbeidsperiode-navn-input'}
                    onChange={(e: any) => setCurrentArbeidsperiodeNavn(e.target.value)}
                    value={_currentArbeidsperiodeNavn}
                    label={t('ui:label-navn')}
                    placeholder={t('ui:placeholder-input-default')}
                  />
                </Column>
              </Row>
              <VerticalSeparatorDiv/>
              <Row>
                <Column>
                  <HighContrastKnapp
                    mini
                    kompakt
                    onClick={onAddArbeidsPeriode}
                  >
                    <Tilsette />
                    <HorizontalSeparatorDiv data-size='0.5' />
                    {t('ui:label-add')}
                  </HighContrastKnapp>
                  <HorizontalSeparatorDiv data-size='0.5' />
                  <HighContrastFlatknapp
                    mini
                    kompakt
                    onClick={() => setSeeNewArbeidsperiode(!_seeNewArbeidsperiode)}
                  >
                    {t('ui:label-cancel')}
                  </HighContrastFlatknapp>
                </Column>
              </Row>
            </>
          )}

          <VerticalSeparatorDiv data-size='2'/>
          <Undertittel>
            {t('ui:label-periode-in-sender')}
          </Undertittel>
          <VerticalSeparatorDiv/>

          {!_seeNewPeriodeInSender ? (
            <HighContrastFlatknapp
              mini
              kompakt
              onClick={() => setSeeNewPeriodeInSender(true)}
            >
              <Tilsette />
              <HorizontalSeparatorDiv data-size='0.5' />
              {t('ui:label-add-new-periode-in-sender')}
            </HighContrastFlatknapp>
          ) : (
            <div>
              <UndertekstBold>
                {t('ui:label-medlemperiode')}
              </UndertekstBold>
              <VerticalSeparatorDiv/>
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

          <VerticalSeparatorDiv data-size='2'/>
          <Undertittel>
            {t('ui:label-reason-for-coming')}
          </Undertittel>
          <VerticalSeparatorDiv/>

          {!_seeNewReasonToComing ? (
            <HighContrastFlatknapp
              mini
              kompakt
              onClick={() => setSeeNewReasonToComing(true)}
            >
              <Tilsette />
              <HorizontalSeparatorDiv data-size='0.5' />
              {t('ui:label-add-new-reason-to-coming')}
            </HighContrastFlatknapp>
          ) : (
            <div>
              <UndertekstBold>
                {t('ui:label-duration-stay')}
              </UndertekstBold>
              <VerticalSeparatorDiv/>
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
              <VerticalSeparatorDiv/>
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
