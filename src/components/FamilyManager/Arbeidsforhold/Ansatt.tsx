import Add from 'assets/icons/Add'
import Arbeidsforhold from 'components/Arbeidsforhold/Arbeidsforhold'
import { ReplySed } from 'declarations/sed'
import { Arbeidsforholdet, Period, Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
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

export interface AnsattProps {
  arbeidsforholdList: Array<Arbeidsforholdet>
  gettingArbeidsforholdList: boolean
  getArbeidsforholdList: (fnr: string | undefined) => void,
  replySed: ReplySed,
  personID: string
}

const Ansatt: React.FC<AnsattProps> = ({
  arbeidsforholdList,
  getArbeidsforholdList,
  gettingArbeidsforholdList,
  personID,
  replySed,
}: AnsattProps) => {
  const { t } = useTranslation()

  const [_addedArbeidsforholdList, setAddedArbeidsforholdList] = useState<Array<Arbeidsforholdet>>([])
  const [_existingArbeidsforholdList, setExistingArbeidsforholdList] = useState<Array<Arbeidsforholdet> | undefined>(undefined)

  const [_newStartDato, setNewStartDato] = useState<string>('')
  const [_newSluttDato, setNewSluttDato] = useState<string>('')
  const [_newOrgnr, setNewOrgnr] = useState<string>('')
  const [_newNavn, setNewNavn] = useState<string>('')

  const [_seeNewArbeidsperiode, setSeeNewArbeidsperiode] = useState<boolean>(false)
  const [_valgteArbeidsforhold, setValgtArbeidsforhold] = useState<Array<Arbeidsforholdet>>([])
  const [_validation, setValidation] = useState<Validation>({})

  const fnr: string | undefined = _.find(_.get(replySed, `${personID}.personInfo.pin`), p => p.land === 'NO')?.identifikator
  const namespace = 'c-familymanager-' + personID + '-personensstatus-ansatt'

  const resetValidation = (key: string): void => {
    setValidation({
      ..._validation,
      [key]: undefined
    })
  }

  const hasNoValidationErrors = (validation: Validation): boolean => _.find(validation, (it) => (it !== undefined)) === undefined

  const performValidation = (): boolean => {
    const validation: Validation = {}
    if (!_newNavn) {
      validation[namespace + '-navn'] = {
        skjemaelementId: 'c-' + namespace + '-navn-input',
        feilmelding: t('message:validation-noName')
      } as FeiloppsummeringFeil
    }
    if (!_newOrgnr) {
      validation[namespace + '-orgnr'] = {
        skjemaelementId: 'c-' + namespace + '-orgnr-input',
        feilmelding: t('message:validation-noOrgnr')
      } as FeiloppsummeringFeil
    }
    if (!_newStartDato) {
      validation[namespace + '-startdato'] = {
        skjemaelementId: 'c-' + namespace + '-startdato-input',
        feilmelding: t('message:validation-noDate')
      } as FeiloppsummeringFeil
    }
    if (_newStartDato && !_newStartDato.match(/\d{2}\.\d{2}\.\d{4}/)) {
      validation[namespace + '-startdato'] = {
        skjemaelementId: 'c-' + namespace + '-startdato-input',
        feilmelding: t('message:validation-invalidDate')
      } as FeiloppsummeringFeil
    }
    if (_newSluttDato && !_newSluttDato.match(/\d{2}\.\d{2}\.\d{4}/)) {
      validation[namespace + '-sluttdato'] = {
        skjemaelementId: 'c-' + namespace + '-sluttdato-input',
        feilmelding: t('message:validation-invalidDate')
      } as FeiloppsummeringFeil
    }
    setValidation(validation)
    return hasNoValidationErrors(validation)
  }

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
    const newArbeidsforholdList = _.cloneDeep(_existingArbeidsforholdList)
    if (newArbeidsforholdList) {
      newArbeidsforholdList[index] = a
      setExistingArbeidsforholdList(newArbeidsforholdList)
    }
  }

  const onAddedArbeidsforholdEdit = (a: Arbeidsforholdet, index: number) => {
    const newAddedArbeidsforholdList = _.cloneDeep(_addedArbeidsforholdList)
    if (newAddedArbeidsforholdList) {
      newAddedArbeidsforholdList[index] = a
      setAddedArbeidsforholdList(newAddedArbeidsforholdList)
    }
  }

  const onExistingArbeidsforholdDelete = (index: number) => {
    const newArbeidsforholdList: Array<Arbeidsforholdet> | undefined = _.cloneDeep(_existingArbeidsforholdList)
    const deletedArbeidsforhold: Array<Arbeidsforholdet> | undefined = newArbeidsforholdList?.splice(index, 1)
    setExistingArbeidsforholdList(newArbeidsforholdList)

    if (deletedArbeidsforhold && deletedArbeidsforhold.length > 0) {
      const newValgtArbeidsforhold: Array<Arbeidsforholdet> = _.filter(_valgteArbeidsforhold, v => v.orgnr !== deletedArbeidsforhold![0].orgnr)
      if (newValgtArbeidsforhold.length !== _valgteArbeidsforhold.length) {
        setValgtArbeidsforhold(newValgtArbeidsforhold)
      }
    }
  }

  const onAddedArbeidsforholdDelete = (index: number) => {
    const newAddedArbeidsforholdList: Array<Arbeidsforholdet> | undefined = _.cloneDeep(_addedArbeidsforholdList)
    const deletedArbeidsforhold: Array<Arbeidsforholdet> | undefined = newAddedArbeidsforholdList?.splice(index, 1)
    setAddedArbeidsforholdList(newAddedArbeidsforholdList)

    if (deletedArbeidsforhold && deletedArbeidsforhold.length > 0) {
      const newValgtArbeidsforhold: Array<Arbeidsforholdet> = _.filter(_valgteArbeidsforhold, v => v.orgnr !== deletedArbeidsforhold![0].orgnr)
      if (newValgtArbeidsforhold.length !== _valgteArbeidsforhold.length) {
        setValgtArbeidsforhold(newValgtArbeidsforhold)
      }
    }
  }

  const resetForm = () => {
    setNewNavn('')
    setNewOrgnr('')
    setNewSluttDato('')
    setNewStartDato('')
    setValidation({})
  }

  const onAddClicked = () => {
    if (performValidation()) {
      let newAddedArbeidsforholdList = _.cloneDeep(_addedArbeidsforholdList)
      const periode = {
        fom: _newStartDato
      } as Period
      if (_newSluttDato) {
        periode.tom = _newSluttDato
      }
      newAddedArbeidsforholdList = newAddedArbeidsforholdList.concat({
        ansettelsesPeriode: periode,
        orgnr: _newOrgnr,
        navn: _newNavn
      } as Arbeidsforholdet)
      setAddedArbeidsforholdList(newAddedArbeidsforholdList)
      resetForm()
    }
  }

  const onCancelClicked = () => {
    resetForm()
    setSeeNewArbeidsperiode(!_seeNewArbeidsperiode)
  }

  const onStartDatoChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetValidation(namespace + '-startdato')
    setNewStartDato(e.target.value)
  }

  const onSluttDatoChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetValidation(namespace + '-sluttdato')
    setNewSluttDato(e.target.value)
  }

  const onOrgnrChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetValidation(namespace + '-orgnr')
    setNewOrgnr(e.target.value)
  }

  const onNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetValidation(namespace + '-navn')
    setNewNavn(e.target.value)
  }

  useEffect(() => {
    if (_existingArbeidsforholdList === undefined && arbeidsforholdList !== undefined) {
      setExistingArbeidsforholdList(arbeidsforholdList)
    }
  }, [_existingArbeidsforholdList, arbeidsforholdList, setExistingArbeidsforholdList])

  return (
    <>
      <Undertittel>
        {t('el:title-registered-arbeidsperiode')}
      </Undertittel>
      <VerticalSeparatorDiv />
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
      <VerticalSeparatorDiv />
      {!_.isEmpty(_addedArbeidsforholdList) && (
        <>
          <Undertittel>
            {t('el:title-added-arbeidsperiode')}
          </Undertittel>
          <VerticalSeparatorDiv />
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
      <VerticalSeparatorDiv />
      {!_seeNewArbeidsperiode
        ? (
          <HighContrastFlatknapp
            mini
            kompakt
            onClick={() => setSeeNewArbeidsperiode(true)}
          >
            <Add />
            <HorizontalSeparatorDiv data-size='0.5' />
            {t('el:button-add-new-x', {
              x: t('label:arbeidsperiode').toLowerCase()
            })}
          </HighContrastFlatknapp>
          )
        : (
          <>
            <Undertittel>
              {t('el:title-add-arbeidsperiode')}
            </Undertittel>
            <VerticalSeparatorDiv />
            <Row>
              <Column>
                <HighContrastInput
                  data-test-id={'c-' + namespace + '-startdato-input'}
                  feil={_validation[namespace + '-startdato']?.feilmelding}
                  id={namespace + '-startdato-input'}
                  label={t('label:start-date')}
                  onChange={onStartDatoChanged}
                  placeholder={t('el:placeholder-date-default')}
                  value={_newStartDato}
                />
              </Column>
              <Column>
                <HighContrastInput
                  data-test-id={'c-' + namespace + '-sluttdato-input'}
                  feil={_validation[namespace + '-sluttdato']?.feilmelding}
                  id={'c-' + namespace + '-sluttdato-input'}
                  label={t('label:end-date')}
                  onChange={onSluttDatoChanged}
                  placeholder={t('el:placeholder-date-default')}
                  value={_newSluttDato}
                />
              </Column>
              <Column/>
            </Row>
            <VerticalSeparatorDiv data-size='0.5' />
            <Row>
              <Column>
                <HighContrastInput
                  data-test-id={'c-' + namespace + '-orgnr-input'}
                  feil={_validation[namespace + '-orgnr']?.feilmelding}
                  id={'c-' + namespace + '-orgnr-input'}
                  label={t('label:orgnr')}
                  onChange={onOrgnrChanged}
                  placeholder={t('el:placeholder-input-default')}
                  value={_newOrgnr}
                />
              </Column>
              <Column>
                <HighContrastInput
                  data-test-id={'c-' + namespace + '-navn-input'}
                  feil={_validation[namespace + '-navn']?.feilmelding}
                  id={'c-' + namespace + '-navn-input'}
                  label={t('label:name')}
                  onChange={onNameChanged}
                  placeholder={t('el:placeholder-input-default')}
                  value={_newNavn}
                />
              </Column>
              <Column/>
            </Row>
            <VerticalSeparatorDiv />
            <Row>
              <Column>
                <HighContrastKnapp
                  mini
                  kompakt
                  onClick={onAddClicked}
                >
                  <Add />
                  <HorizontalSeparatorDiv data-size='0.5' />
                  {t('el:button-add')}
                </HighContrastKnapp>
                <HorizontalSeparatorDiv data-size='0.5' />
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={onCancelClicked}
                >
                  {t('el:button-cancel')}
                </HighContrastFlatknapp>
              </Column>
            </Row>
          </>
          )}
    </>
  )
}

export default Ansatt
