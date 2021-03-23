import Tilsette from 'assets/icons/Tilsette'
import Arbeidsforhold from 'components/Arbeidsforhold/Arbeidsforhold'
import ArbeidsforholdetFC from 'components/Arbeidsforhold/Arbeidsforholdet'
import { ReplySed } from 'declarations/sed'
import { Arbeidsforholdet, Period, Validation } from 'declarations/types'
import _ from 'lodash'
import { Systemtittel, Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput, HighContrastKnapp,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface Op1AnsattProps {
  arbeidsforholdList: Array<Arbeidsforholdet>
  gettingArbeidsforholdList: boolean
  getArbeidsforholdList: (fnr: string | undefined) => void,
  replySed: ReplySed,
  personID: string
  validation: Validation
}

const Op1Ansatt: React.FC<Op1AnsattProps> = ({
  arbeidsforholdList, replySed, personID, gettingArbeidsforholdList, getArbeidsforholdList, validation
}: Op1AnsattProps) => {
  const { t } = useTranslation()

  const [_arbeidsforholdList, setArbeidsforholdList] = useState<Array<Arbeidsforholdet> | undefined>(undefined)

  const [_addedArbeidsforholdList, setAddedArbeidsforholdList] = useState<Array<Arbeidsforholdet>>([])
  const [_currentArbeidsperiodeStartDato, setCurrentArbeidsperiodeStartDato] = useState<string>('')
  const [_currentArbeidsperiodeSluttDato, setCurrentArbeidsperiodeSluttDato] = useState<string>('')
  const [_currentArbeidsperiodeOrgnr, setCurrentArbeidsperiodeOrgnr] = useState<string>('')
  const [_currentArbeidsperiodeNavn, setCurrentArbeidsperiodeNavn] = useState<string>('')
  const [_seeNewArbeidsperiode, setSeeNewArbeidsperiode] = useState<boolean>(false)
  const [_valgteArbeidsforhold, setValgtArbeidsforhold] = useState<Array<Arbeidsforholdet>>([])

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

  const onAddArbeidsPeriode = () => {
    let newAddedArbeidsforholdList = _.cloneDeep(_addedArbeidsforholdList)
    const periode = {
      fom: _currentArbeidsperiodeStartDato
    } as Period
    if (_currentArbeidsperiodeSluttDato) {
      periode.tom = _currentArbeidsperiodeSluttDato
    }

    newAddedArbeidsforholdList = newAddedArbeidsforholdList.concat({
      ansettelsesPeriode: periode,
      orgnr: _currentArbeidsperiodeOrgnr,
      navn: _currentArbeidsperiodeNavn
    } as Arbeidsforholdet)
    setAddedArbeidsforholdList(newAddedArbeidsforholdList)
  }

  useEffect(() => {
    if (_arbeidsforholdList === undefined && arbeidsforholdList !== undefined) {
      setArbeidsforholdList(arbeidsforholdList)
    }
  }, [_arbeidsforholdList, arbeidsforholdList, setArbeidsforholdList])

  return (
    <>
      <Systemtittel>
        {t('label:aaRegistered')}
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
          setArbeidsforholdList(_.filter(_arbeidsforholdList, _a => _a.orgnr === a.orgnr))}
      />

      {!_.isEmpty(_addedArbeidsforholdList) && (
        <>
          <Undertittel>
            {t('label:added-arbeidsforhold')}
          </Undertittel>
          {_addedArbeidsforholdList?.map((a, i) => (
            <ArbeidsforholdetFC
              arbeidsforholdet={a}
              editable
              key={i}
              index={i}
              onArbeidsforholdClick={() => {}}
              onArbeidsforholdDelete={(a: Arbeidsforholdet) =>
                setAddedArbeidsforholdList(_.filter(_addedArbeidsforholdList, _a => _a.orgnr === a.orgnr))}
              onArbeidsforholdEdited={() => {}}
              personID={personID}
            />
          ))}
        </>
      )}

      {!_seeNewArbeidsperiode
        ? (
          <HighContrastFlatknapp
            mini
            kompakt
            onClick={() => setSeeNewArbeidsperiode(true)}
          >
            <Tilsette />
            <HorizontalSeparatorDiv data-size='0.5' />
            {t('label:add-new-arbeidsperiode')}
          </HighContrastFlatknapp>
          )
        : (
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
                  label={t('label:startDate')}
                  placeholder={t('elements:placeholder-date-default')}
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
                  label={t('label:endDate')}
                  placeholder={t('elements:placeholder-date-default')}
                />
              </Column>
            </Row>
            <VerticalSeparatorDiv data-size='0.5' />
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
                  label={t('label:orgnr')}
                  placeholder={t('elements:placeholder-input-default')}
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
                  label={t('label:navn')}
                  placeholder={t('elements:placeholder-input-default')}
                />
              </Column>
            </Row>
            <VerticalSeparatorDiv />
            <Row>
              <Column>
                <HighContrastKnapp
                  mini
                  kompakt
                  onClick={onAddArbeidsPeriode}
                >
                  <Tilsette />
                  <HorizontalSeparatorDiv data-size='0.5' />
                  {t('label:add')}
                </HighContrastKnapp>
                <HorizontalSeparatorDiv data-size='0.5' />
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={() => setSeeNewArbeidsperiode(!_seeNewArbeidsperiode)}
                >
                  {t('label:cancel')}
                </HighContrastFlatknapp>
              </Column>
            </Row>
          </>
          )}
    </>
  )
}

export default Op1Ansatt
