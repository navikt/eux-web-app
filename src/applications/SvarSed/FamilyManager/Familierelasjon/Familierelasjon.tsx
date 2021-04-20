import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import DateInput from 'components/DateInput/DateInput'
import Period from 'components/Period/Period'
import Select from 'components/Select/Select'
import { AlignStartRow, PaddedDiv } from 'components/StyledComponents'
import useValidation from 'components/Validation/useValidation'
import { Options } from 'declarations/app'
import { FamilieRelasjon, JaNei, Periode, RelasjonType, ReplySed } from 'declarations/sed'
import { Kodeverk, Validation } from 'declarations/types'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
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
import { validateFamilierelasjon, ValidationFamilierelasjonProps } from './validation'

interface FamilierelasjonProps {
  familierelasjonKodeverk: Array<Kodeverk>
  highContrast: boolean
  onValueChanged: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation
}

const Familierelasjon: React.FC<FamilierelasjonProps> = ({
  familierelasjonKodeverk,
  highContrast,
  onValueChanged,
  personID,
  replySed,
  validation
}:FamilierelasjonProps): JSX.Element => {
  const { t } = useTranslation()
  const target = `${personID}.familierelasjoner`
  const familierelasjoner: Array<FamilieRelasjon> = _.get(replySed, target)
  const namespace = `familymanager-${personID}-familierelasjon`

  const [_newRelasjonType, _setNewRelasjonType] = useState<RelasjonType | undefined>(undefined)
  const [_newSluttDato, _setNewSluttDato] = useState<string>('')
  const [_newStartDato, _setNewStartDato] = useState<string>('')
  const [_newAnnenRelasjonType, _setNewAnnenRelasjonType] = useState<string>('')
  const [_newAnnenRelasjonPersonNavn, _setNewAnnenRelasjonPersonNavn] = useState<string>('')
  const [_newAnnenRelasjonDato, _setNewAnnenRelasjonDato] = useState<string>('')
  const [_newBorSammen, _setNewBorSammen] = useState<JaNei | undefined>(undefined)

  const [_confirmDelete, _setConfirmDelete] = useState<Array<string>>([])
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, resetValidation, performValidation] = useValidation<ValidationFamilierelasjonProps>({}, validateFamilierelasjon)

  const p = _.get(replySed, personID)
  const personName = p.personInfo.fornavn + ' ' + p.personInfo.etternavn

  const relasjonTypeOptions: Options = familierelasjonKodeverk.map((f: Kodeverk) => ({
    label: f.term, value: f.kode
  }))

  const onAddNewClicked = () => _setSeeNewForm(true)

  const addCandidateForDeletion = (key: string) => {
    _setConfirmDelete(_confirmDelete.concat(key))
  }

  const removeCandidateForDeletion = (key: string | null) => {
    if (!key) { return null }
    _setConfirmDelete(_.filter(_confirmDelete, it => it !== key))
  }

  const setRelasjonType = (relasjonType: RelasjonType, i: number) => {
    if (i < 0) {
      _setNewRelasjonType(relasjonType)
      resetValidation(namespace + '-relasjontype')
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].relasjonType = relasjonType
      onValueChanged(target, newFamilieRelasjoner)
    }
  }

  const setStartDato = (dato: string, i: number) => {
    if (i < 0) {
      _setNewStartDato(dato)
      resetValidation(namespace + '-startdato')
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].periode.startdato = dato
      onValueChanged(target, newFamilieRelasjoner)
    }
  }

  const setSluttDato = (dato: string, i: number) => {
    if (i < 0) {
      _setNewSluttDato(dato)
      resetValidation(namespace + '-sluttdato')
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      if (dato === '') {
        delete newFamilieRelasjoner[i].periode.sluttdato
        newFamilieRelasjoner[i].periode.aapenPeriodeType = 'åpen_sluttdato'
      } else {
        delete newFamilieRelasjoner[i].periode.aapenPeriodeType
        newFamilieRelasjoner[i].periode.sluttdato = dato
      }
      onValueChanged(target, newFamilieRelasjoner)
    }
  }

  const setAnnenRelasjonType = (annenRelasjonType: string, i: number) => {
    if (i < 0) {
      _setNewAnnenRelasjonType(annenRelasjonType)
      resetValidation(namespace + '-annenrelasjontype')
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].annenRelasjonType = annenRelasjonType
      onValueChanged(target, newFamilieRelasjoner)
    }
  }

  const setAnnenRelasjonPersonNavn = (navn: string, i: number) => {
    if (i < 0) {
      _setNewAnnenRelasjonPersonNavn(navn)
      resetValidation(namespace + '-annenrelasjonpersonnavn')
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].annenRelasjonPersonNavn = navn
      onValueChanged(target, newFamilieRelasjoner)
    }
  }

  const setAnnenRelasjonDato = (dato: string, i: number) => {
    if (i < 0) {
      _setNewAnnenRelasjonDato(dato)
      resetValidation(namespace + '-annenrelasjondato')
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].annenRelasjonDato = dato
      onValueChanged(target, newFamilieRelasjoner)
    }
  }

  const setBorSammen = (borSammen: JaNei, i: number) => {
    if (i < 0) {
      _setNewBorSammen(borSammen)
      resetValidation(namespace + '-borsammen')
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].borSammen = borSammen
      onValueChanged(target, newFamilieRelasjoner)
    }
  }

  const resetForm = () => {
    _setNewRelasjonType(undefined)
    _setNewSluttDato('')
    _setNewStartDato('')
    _setNewAnnenRelasjonType('')
    _setNewAnnenRelasjonPersonNavn('')
    _setNewAnnenRelasjonDato('')
    _setNewBorSammen(undefined)
    resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const getKey = (f: FamilieRelasjon): string => {
    return f.relasjonType + '-' + f.periode.startdato
  }

  const onRemove = (i: number) => {
    const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
    const deletedFamilierelasjoner: Array<FamilieRelasjon> = newFamilieRelasjoner.splice(i, 1)
    if (deletedFamilierelasjoner && deletedFamilierelasjoner.length > 0) {
      removeCandidateForDeletion(getKey(deletedFamilierelasjoner[0]))
    }
    onValueChanged(target, newFamilieRelasjoner)
  }

  const onAdd = () => {
    const newPeriode: Periode = {
      startdato: _newStartDato
    }
    if (_newSluttDato) {
      newPeriode.sluttdato = _newSluttDato
    } else {
      newPeriode.aapenPeriodeType = 'åpen_sluttdato'
    }

    const newFamilierelasjon: FamilieRelasjon = {
      relasjonType: _newRelasjonType,
      relasjonInfo: '',
      periode: newPeriode
    }

    if (_newRelasjonType === 'ANNEN' as RelasjonType) {
      newFamilierelasjon.borSammen = _newBorSammen as JaNei,
      newFamilierelasjon.annenRelasjonType = _newAnnenRelasjonType
      newFamilierelasjon.annenRelasjonPersonNavn = _newAnnenRelasjonPersonNavn
      newFamilierelasjon.annenRelasjonDato = _newAnnenRelasjonDato
    }

    const valid: boolean = performValidation({
      familierelasjon: newFamilierelasjon,
      index: -1,
      namespace,
      personName: personName
    })

    if (valid) {
      let newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      if (_.isNil(newFamilieRelasjoner)) {
        newFamilieRelasjoner = []
      }

      newFamilieRelasjoner.push(newFamilierelasjon)
      resetForm()
      onValueChanged(target, newFamilieRelasjoner)
    }
  }

  const getErrorFor = (index: number, el: string): string | undefined => {
    return index < 0 ? _validation[namespace + '-' + el]?.feilmelding : validation[namespace + '[' + index + ']-' + el]?.feilmelding
  }

  const renderRow = (familierelasjon: FamilieRelasjon | null, i: number) => {
    const key = familierelasjon ? getKey(familierelasjon) : 'new'
    const candidateForDeletion = i < 0 ? false : !!key && _confirmDelete.indexOf(key) >= 0
    const idx = (i >= 0 ? '[' + i + ']' : '')
    return (
      <>
        <AlignStartRow className={classNames('slideInFromLeft')}>
          <Column data-flex='2'>
            <Select
              data-test-id={'c-' + namespace + idx + '-relasjontype-text'}
              feil={getErrorFor(i, 'relasjonType')}
              highContrast={highContrast}
              id={'c-' + namespace + idx + '-relasjontype-text'}
              label={t('label:type')}
              menuPortalTarget={document.body}
              onChange={(e) => setRelasjonType(e.value as RelasjonType, i)}
              options={relasjonTypeOptions}
              placeholder={t('el:placeholder-select-default')}
              defaultValue={_.find(relasjonTypeOptions, r => r.value === (i < 0 ? _newRelasjonType : familierelasjon!.relasjonType))}
              selectedValue={_.find(relasjonTypeOptions, r => r.value ===  (i < 0 ? _newRelasjonType : familierelasjon!.relasjonType))}
            />
          </Column>
          <Period
            index={i}
            key={_newStartDato + _newSluttDato}
            namespace={namespace}
            errorStartDato={getErrorFor(i, 'startdato')}
            errorSluttDato={getErrorFor(i, 'sluttdato')}
            setStartDato={setStartDato}
            setSluttDato={setSluttDato}
            valueStartDato={i < 0 ? _newStartDato : familierelasjon?.periode.startdato}
            valueSluttDato={i < 0 ? _newSluttDato : familierelasjon?.periode.sluttdato}
          />
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(i >= 0)}
              marginTop
              onBeginRemove={() => addCandidateForDeletion(key!)}
              onConfirmRemove={() => onRemove(i)}
              onCancelRemove={() => removeCandidateForDeletion(key!)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        {(i < 0 ? _newRelasjonType === 'ANNEN' : familierelasjon?.relasjonType === 'ANNEN') && (
          <>
            <AlignStartRow className={classNames('slideInFromLeft')}>
              <Column data-flex='2'>
                <HighContrastInput
                  data-test-id={'c-' + namespace + idx + '-annenrelasjontype-text'}
                  feil={getErrorFor(i, 'annenrelasjontype')}
                  id={'c-' + namespace + idx + '-annenrelasjontype-text'}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnnenRelasjonType(e.target.value, i)}
                  value={i < 0 ? _newAnnenRelasjonType : familierelasjon?.annenRelasjonType}
                  label={t('label:annen-relasjon')}
                  placeholder={t('el:placeholder-input-default')}
                />
              </Column>
              <Column data-flex='2' />
            </AlignStartRow>
            <VerticalSeparatorDiv />
            <AlignStartRow className={classNames('slideInFromLeft')} style={{ animationDelay: '0.1s' }}>
              <Column data-flex='2'>
                <HighContrastInput
                  data-test-id={'c-' + namespace + idx + '-annenrelasjonpersonnavn-text'}
                  feil={getErrorFor(i, 'annenrelasjonpersonnavn')}
                  id={'c-' + namespace + idx + '-annenrelasjonpersonnavn-text'}
                  label={t('label:person-navn')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnnenRelasjonPersonNavn(e.target.value, i)}
                  placeholder={t('el:placeholder-input-default')}
                  value={i < 0 ? _newAnnenRelasjonPersonNavn : familierelasjon?.annenRelasjonPersonNavn}
                />
              </Column>
              <Column>
                <DateInput
                  error={getErrorFor(i, 'annenrelasjondato')}
                  namespace={namespace + idx + '-annenrelasjondato'}
                  index={i}
                  key={i < 0 ? _newAnnenRelasjonDato : familierelasjon?.annenRelasjonDato}
                  label={t('label:dato-for-relasjon')}
                  setDato={setAnnenRelasjonDato}
                  value={i < 0 ? _newAnnenRelasjonDato : familierelasjon?.annenRelasjonDato}
                />
              </Column>
              <Column />
            </AlignStartRow>
            <VerticalSeparatorDiv />
            <AlignStartRow className={classNames('slideInFromLeft')} style={{ animationDelay: '0.2s' }}>
              <Column data-flex='2'>
                <HighContrastRadioPanelGroup
                  checked={i < 0 ? _newBorSammen : familierelasjon?.borSammen}
                  data-test-id={'c-' + namespace + idx + '-borsammen-text'}
                  data-no-border
                  id={'c-' + namespace + idx  + '-borsammen-text'}
                  feil={getErrorFor(i, 'borsammen')}
                  legend={t('label:bor-sammen')}
                  name={namespace + idx + '-borsammen'}
                  radios={[
                    { label: t('label:ja'), value: 'ja' },
                    { label: t('label:nei'), value: 'nei' }
                  ]}
                  onChange={(e: any) => setBorSammen(e.target.value, i)}
                />
              </Column>
              <Column data-flex='2' />
            </AlignStartRow>
          </>
        )}
        <VerticalSeparatorDiv />
      </>
    )
  }

  return (
    <PaddedDiv>
      <Undertittel>
        {t('el:title-familierelasjon')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {familierelasjoner?.map(renderRow)}
      <hr />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <Row>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={onAddNewClicked}
              >
                <Add />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('el:button-add-new-x', { x: t('label:familierelasjon').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
    </PaddedDiv>
  )
}

export default Familierelasjon
