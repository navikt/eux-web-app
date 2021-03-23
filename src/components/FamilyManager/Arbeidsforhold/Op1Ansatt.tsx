import Add from 'assets/icons/Add'
import Arbeidsforhold from 'components/Arbeidsforhold/Arbeidsforhold'
import { ReplySed } from 'declarations/sed'
import { Arbeidsforholdet, Period, Validation } from 'declarations/types'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HighContrastKnapp,
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

  const [_addedArbeidsforholdList, setAddedArbeidsforholdList] = useState<Array<Arbeidsforholdet>>([])
  const [_existingArbeidsforholdList, setExistingArbeidsforholdList] = useState<Array<Arbeidsforholdet> | undefined>(undefined)

  const [_currentArbeidsperiodeStartDato, setCurrentArbeidsperiodeStartDato] = useState<string>('')
  const [_currentArbeidsperiodeSluttDato, setCurrentArbeidsperiodeSluttDato] = useState<string>('')
  const [_currentArbeidsperiodeOrgnr, setCurrentArbeidsperiodeOrgnr] = useState<string>('')
  const [_currentArbeidsperiodeNavn, setCurrentArbeidsperiodeNavn] = useState<string>('')

  const [_seeNewArbeidsperiode, setSeeNewArbeidsperiode] = useState<boolean>(false)
  const [_valgteArbeidsforhold, setValgtArbeidsforhold] = useState<Array<Arbeidsforholdet>>([])

  const fnr: string | undefined = _.find(_.get(replySed, `${personID}.personInfo.pin`), p => p.land === 'NO')?.identifikator

  const onArbeidsforholdSelect = (item: any, checked: boolean) => {
    let newValgtArbeidsforhold: Array<Arbeidsforholdet>
    if (checked) {
      newValgtArbeidsforhold = _valgteArbeidsforhold.concat(item)
    } else {
      newValgtArbeidsforhold = _.filter(_valgteArbeidsforhold, v => v !== item)
    }
    setValgtArbeidsforhold(newValgtArbeidsforhold)
  }

  const onExistingArbeidsforholdEdit = (a: Arbeidsforholdet, index: number) => {
    let newArbeidsforholdList = _.cloneDeep(_existingArbeidsforholdList)
    if (newArbeidsforholdList) {
      newArbeidsforholdList[index] = a
      setExistingArbeidsforholdList(newArbeidsforholdList)
    }
  }

  const onAddedArbeidsforholdEdit = (a: Arbeidsforholdet, index: number) => {
    let newAddedArbeidsforholdList = _.cloneDeep(_addedArbeidsforholdList)
    if (newAddedArbeidsforholdList) {
      newAddedArbeidsforholdList[index] = a
      setAddedArbeidsforholdList(newAddedArbeidsforholdList)
    }
  }

  const onExistingArbeidsforholdDelete = (index: number) => {
    let newArbeidsforholdList: Array<Arbeidsforholdet> | undefined = _.cloneDeep(_existingArbeidsforholdList)
    let deletedArbeidsforhold: Array<Arbeidsforholdet> | undefined = newArbeidsforholdList?.splice(index, 1)
    setExistingArbeidsforholdList(newArbeidsforholdList)

    if (deletedArbeidsforhold && deletedArbeidsforhold.length > 0) {
      let newValgtArbeidsforhold: Array<Arbeidsforholdet> = _.filter(_valgteArbeidsforhold, v => v.orgnr !== deletedArbeidsforhold![0].orgnr)
      if (newValgtArbeidsforhold.length !== _valgteArbeidsforhold.length) {
        setValgtArbeidsforhold(newValgtArbeidsforhold)
      }
    }
  }

  const onAddedArbeidsforholdDelete = (index: number) => {
    let newAddedArbeidsforholdList: Array<Arbeidsforholdet> | undefined = _.cloneDeep(_addedArbeidsforholdList)
    let deletedArbeidsforhold: Array<Arbeidsforholdet> | undefined = newAddedArbeidsforholdList?.splice(index, 1)
    setAddedArbeidsforholdList(newAddedArbeidsforholdList)

    if (deletedArbeidsforhold && deletedArbeidsforhold.length > 0) {
      let newValgtArbeidsforhold: Array<Arbeidsforholdet> = _.filter(_valgteArbeidsforhold, v => v.orgnr !== deletedArbeidsforhold![0].orgnr)
      if (newValgtArbeidsforhold.length !== _valgteArbeidsforhold.length) {
        setValgtArbeidsforhold(newValgtArbeidsforhold)
      }
    }
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
    if (_existingArbeidsforholdList === undefined && arbeidsforholdList !== undefined) {
      setExistingArbeidsforholdList(arbeidsforholdList)
    }
  }, [_existingArbeidsforholdList, arbeidsforholdList, setExistingArbeidsforholdList])

  return (
    <>
      <Undertittel>
        {t('ui:title-aaRegistered')}
      </Undertittel>
      <VerticalSeparatorDiv/>
      <Arbeidsforhold
        editable
        searchable
        personID={personID}
        getArbeidsforholdList={() => getArbeidsforholdList(fnr)}
        valgteArbeidsforhold={_valgteArbeidsforhold}
        arbeidsforholdList={_existingArbeidsforholdList}
        onArbeidsforholdSelect={onArbeidsforholdSelect}
        gettingArbeidsforholdList={gettingArbeidsforholdList}
        onArbeidsforholdEdit={onExistingArbeidsforholdEdit}
        onArbeidsforholdDelete={onExistingArbeidsforholdDelete}
      />
      <VerticalSeparatorDiv/>
      {!_.isEmpty(_addedArbeidsforholdList) && (
        <>
          <Undertittel>
            {t('ui:title-added-arbeidsforhold')}
          </Undertittel>
          <VerticalSeparatorDiv/>
          <Arbeidsforhold
            editable
            searchable={false}
            personID={personID}
            valgteArbeidsforhold={_valgteArbeidsforhold}
            arbeidsforholdList={_addedArbeidsforholdList}
            onArbeidsforholdSelect={onArbeidsforholdSelect}
            onArbeidsforholdEdit={onAddedArbeidsforholdEdit}
            onArbeidsforholdDelete={onAddedArbeidsforholdDelete}
          />
        </>
      )}
      <VerticalSeparatorDiv/>
      {!_seeNewArbeidsperiode
        ? (
          <HighContrastFlatknapp
            mini
            kompakt
            onClick={() => setSeeNewArbeidsperiode(true)}
          >
            <Add />
            <HorizontalSeparatorDiv data-size='0.5' />
            {t('elements:button-add-new-arbeidsperiode')}
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
                  <Add />
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
