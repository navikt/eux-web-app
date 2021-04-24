import Add from 'assets/icons/Add'
import Arbeidsforhold from 'components/Arbeidsforhold/Arbeidsforhold'
import Input from 'components/Forms/Input'
import Period, { toFinalDateFormat } from 'components/Period/Period'
import { AlignStartRow } from 'components/StyledComponents'
import useValidation from 'hooks/useValidation'
import { Periode, ReplySed } from 'declarations/sed'
import { Arbeidsforholdet, Arbeidsperioder } from 'declarations/types'
import _ from 'lodash'
import { Systemtittel, Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastKnapp,
  HorizontalSeparatorDiv,
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

  const onStartDatoChanged = (dato: string) => {
    resetValidation(namespace + '-startdato')
    setNewStartDato(dato)
  }

  const onSluttDatoChanged = (dato: string) => {
    resetValidation(namespace + '-sluttdato')
    setNewSluttDato(dato)
  }

  const onOrgnrChanged = (newOrg: string) => {
    resetValidation(namespace + '-orgnr')
    setNewOrgnr(newOrg)
  }

  const onNameChanged = (newName: string) => {
    resetValidation(namespace + '-navn')
    setNewNavn(newName)
  }

  useEffect(() => {
    if (_existingArbeidsforholdList === undefined && arbeidsforholdList !== undefined) {
      setExistingArbeidsforholdList(arbeidsforholdList)
    }
  }, [_existingArbeidsforholdList, arbeidsforholdList, setExistingArbeidsforholdList])

  return (
    <>
      <Systemtittel>
        {t('el:title-aa-registeret')}
      </Systemtittel>
      <VerticalSeparatorDiv />
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
      {!_.isEmpty(_addedArbeidsforholdList.arbeidsperioder) && (
        <>
          <VerticalSeparatorDiv data-size='2' />
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
            <AlignStartRow className='slideInFromLeft'>
              <Period
                key={'' + _newStartDato + _newSluttDato}
                namespace={namespace}
                errorStartDato={_validation[namespace + '-startdato']?.feilmelding}
                errorSluttDato={_validation[namespace + '-sluttdato']?.feilmelding}
                setStartDato={onStartDatoChanged}
                setSluttDato={onSluttDatoChanged}
                valueStartDato={_newStartDato}
                valueSluttDato={_newSluttDato}
              />
              <Column />
            </AlignStartRow>
            <VerticalSeparatorDiv data-size='0.5' />
            <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
              <Column>
                <Input
                  feil={_validation[namespace + '-orgnr']?.feilmelding}
                  namespace={namespace}
                  id='orgnr-text'
                  label={t('label:orgnr')}
                  onChanged={onOrgnrChanged}
                  value={_newOrgnr}
                />
              </Column>
              <Column>
                <Input
                  feil={_validation[namespace + '-navn']?.feilmelding}
                  namespace={namespace}
                  id='navn-text'
                  label={t('label:navn')}
                  onChanged={onNameChanged}
                  value={_newNavn}
                />
              </Column>
              <Column />
            </AlignStartRow>
            <VerticalSeparatorDiv />
            <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
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
            </AlignStartRow>
          </>
          )}
    </>
  )
}

export default Ansatt
