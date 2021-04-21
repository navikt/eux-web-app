import Add from 'assets/icons/Add'
import Arbeidsforhold from 'components/Arbeidsforhold/Arbeidsforhold'
import { toFinalDateFormat } from 'components/Period/Period'
import useValidation from 'components/Validation/useValidation'
import { Periode, ReplySed } from 'declarations/sed'
import { Arbeidsforholdet, Arbeidsperioder } from 'declarations/types'
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
import { validateArbeidsforhold, ValidationArbeidsforholdProps } from './ansattValidation'

export interface AnsattProps {
  arbeidsforholdList: Arbeidsperioder
  gettingArbeidsforholdList: boolean
  getArbeidsforholdList: (fnr: string | undefined) => void
  updateReplySed: (needle: string, value: any) => void
  replySed: ReplySed
  personID: string
}

const Ansatt: React.FC<AnsattProps> = ({
  arbeidsforholdList,
  getArbeidsforholdList,
  gettingArbeidsforholdList,
  updateReplySed,
  personID,
  replySed
}: AnsattProps) => {
  const { t } = useTranslation()
  const fnr: string | undefined = _.find(_.get(replySed, `${personID}.personInfo.pin`), p => p.land === 'NO')?.identifikator
  const namespace = `familymanager-${personID}-personensstatus-ansatt`
  const target = `${personID}.perioderSomAnsatt`

  const [_addedArbeidsforholdList, setAddedArbeidsforholdList] = useState<Arbeidsperioder>(() => ({
    arbeidsperioder: [],
    uriArbeidsgiverRegister: '',
    uriInntektRegister: ''
  }))
  const [_existingArbeidsforholdList, setExistingArbeidsforholdList] = useState<Arbeidsperioder | undefined>(undefined)

  const [_newStartDato, setNewStartDato] = useState<string>('')
  const [_newSluttDato, setNewSluttDato] = useState<string>('')
  const [_newOrgnr, setNewOrgnr] = useState<string>('')
  const [_newNavn, setNewNavn] = useState<string>('')

  const [_seeNewArbeidsperiode, setSeeNewArbeidsperiode] = useState<boolean>(false)
  const [_valgteArbeidsforhold, _setValgtArbeidsforhold] = useState<Array<Arbeidsforholdet>>([])
  const [_validation, resetValidation, performValidation] = useValidation<ValidationArbeidsforholdProps>({}, validateArbeidsforhold)

  const onArbeidsforholdSelectionChange = (selectedArbeidsforhold: Array<Arbeidsforholdet>) => {
    const perioder: Array<Periode> = selectedArbeidsforhold.map(a => {
      const periode = {
        startdato: toFinalDateFormat(a.fraDato)
      } as Periode
      if (a.tilDato) {
        periode.sluttdato = toFinalDateFormat(a.tilDato)
      } else {
        periode.aapenPeriodeType = 'åpen_sluttdato'
      }
      return periode
    })
    updateReplySed(target, perioder)
  }

  const setValgtArbeidsforhold = (a: Array<Arbeidsforholdet>) => {
    _setValgtArbeidsforhold(a)
    onArbeidsforholdSelectionChange(a)
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
      newArbeidsforholdList.arbeidsperioder[index] = a
      setExistingArbeidsforholdList(newArbeidsforholdList)
    }
  }

  const onAddedArbeidsforholdEdit = (a: Arbeidsforholdet, index: number) => {
    const newAddedArbeidsforholdList = _.cloneDeep(_addedArbeidsforholdList)
    if (newAddedArbeidsforholdList) {
      newAddedArbeidsforholdList.arbeidsperioder[index] = a
      setAddedArbeidsforholdList(newAddedArbeidsforholdList)
    }
  }

  const onExistingArbeidsforholdDelete = (index: number) => {
    const newArbeidsforholdList: Arbeidsperioder | undefined = _.cloneDeep(_existingArbeidsforholdList)
    const deletedArbeidsforholdperioder: Array<Arbeidsforholdet> | undefined = newArbeidsforholdList?.arbeidsperioder.splice(index, 1)
    setExistingArbeidsforholdList(newArbeidsforholdList)

    if (deletedArbeidsforholdperioder && deletedArbeidsforholdperioder.length > 0) {
      const newValgtArbeidsforhold: Array<Arbeidsforholdet> = _.filter(_valgteArbeidsforhold, v =>
        v.arbeidsgiverOrgnr !== deletedArbeidsforholdperioder![0].arbeidsgiverOrgnr)
      if (newValgtArbeidsforhold.length !== _valgteArbeidsforhold.length) {
        setValgtArbeidsforhold(newValgtArbeidsforhold)
      }
    }
  }

  const onAddedArbeidsforholdDelete = (index: number) => {
    const newArbeidsforholdList: Arbeidsperioder | undefined = _.cloneDeep(_addedArbeidsforholdList)
    const deletedArbeidsforholdperioder: Array<Arbeidsforholdet> | undefined = newArbeidsforholdList?.arbeidsperioder.splice(index, 1)
    setAddedArbeidsforholdList(newArbeidsforholdList)

    if (deletedArbeidsforholdperioder && deletedArbeidsforholdperioder.length > 0) {
      const newValgtArbeidsforhold: Array<Arbeidsforholdet> = _.filter(_valgteArbeidsforhold, v =>
        v.arbeidsgiverOrgnr !== deletedArbeidsforholdperioder![0].arbeidsgiverOrgnr)
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
    resetValidation()
  }

  const onAddClicked = () => {
    const newArbeidsforhold: Arbeidsforholdet = {
      arbeidsgiverNavn: _newNavn,
      arbeidsgiverOrgnr: _newOrgnr,
      fraDato: toFinalDateFormat(_newStartDato),
      tilDato: toFinalDateFormat(_newSluttDato)
    }
    const valid: boolean = performValidation({
      arbeidsforhold: newArbeidsforhold,
      namespace: namespace
    })
    if (valid) {
      const newAddedArbeidsforholdList: Arbeidsperioder = _.cloneDeep(_addedArbeidsforholdList)
      newAddedArbeidsforholdList.arbeidsperioder = newAddedArbeidsforholdList.arbeidsperioder.concat(newArbeidsforhold)
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
        personFnr={fnr!}
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
            personFnr={fnr!}
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
                  data-test-id={'c-' + namespace + '-startdato-date'}
                  feil={_validation[namespace + '-startdato']?.feilmelding}
                  id={namespace + '-startdato-date'}
                  label={t('label:startdato')}
                  onChange={onStartDatoChanged}
                  placeholder={t('el:placeholder-date-default')}
                  value={_newStartDato}
                />
              </Column>
              <Column>
                <HighContrastInput
                  data-test-id={'c-' + namespace + '-sluttdato-date'}
                  feil={_validation[namespace + '-sluttdato']?.feilmelding}
                  id={'c-' + namespace + '-sluttdato-date'}
                  label={t('label:sluttdato')}
                  onChange={onSluttDatoChanged}
                  placeholder={t('el:placeholder-date-default')}
                  value={_newSluttDato}
                />
              </Column>
              <Column />
            </Row>
            <VerticalSeparatorDiv data-size='0.5' />
            <Row>
              <Column>
                <HighContrastInput
                  data-test-id={'c-' + namespace + '-orgnr-text'}
                  feil={_validation[namespace + '-orgnr']?.feilmelding}
                  id={'c-' + namespace + '-orgnr-text'}
                  label={t('label:orgnr')}
                  onChange={onOrgnrChanged}
                  placeholder={t('el:placeholder-input-default')}
                  value={_newOrgnr}
                />
              </Column>
              <Column>
                <HighContrastInput
                  data-test-id={'c-' + namespace + '-navn-text'}
                  feil={_validation[namespace + '-navn']?.feilmelding}
                  id={'c-' + namespace + '-navn-text'}
                  label={t('label:navn')}
                  onChange={onNameChanged}
                  placeholder={t('el:placeholder-input-default')}
                  value={_newNavn}
                />
              </Column>
              <Column />
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
