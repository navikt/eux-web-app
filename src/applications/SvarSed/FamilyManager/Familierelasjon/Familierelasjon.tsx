import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import useAddRemove from 'components/AddRemovePanel/useAddRemove'
import DateInput from 'components/Forms/DateInput'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import Period from 'components/Period/Period'
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
  updateReplySed: (needle: string, value: any) => void
  personID: string
  personName: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  validation: Validation
}

const Familierelasjon: React.FC<FamilierelasjonProps> = ({
  familierelasjonKodeverk,
  highContrast,
  updateReplySed,
  personID,
  personName,
  replySed,
  resetValidation,
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

  const [addCandidateForDeletion, removeCandidateForDeletion, hasKey] = useAddRemove()
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationFamilierelasjonProps>({}, validateFamilierelasjon)

  const relasjonTypeOptions: Options = familierelasjonKodeverk.map((f: Kodeverk) => ({
    label: f.term, value: f.kode
  }))

  const setRelasjonType = (relasjonType: RelasjonType, index: number) => {
    if (index < 0) {
      _setNewRelasjonType(relasjonType)
      _resetValidation(namespace + '-relasjontype')
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[index].relasjonType = relasjonType
      updateReplySed(target, newFamilieRelasjoner)
      if (validation[namespace + '-relasjontype']) {
        resetValidation(namespace + '-relasjontype')
      }
    }
  }

  const setStartDato = (dato: string, index: number) => {
    if (index < 0) {
      _setNewStartDato(dato)
      _resetValidation(namespace + '-startdato')
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[index].periode.startdato = dato
      updateReplySed(target, newFamilieRelasjoner)
      if (validation[namespace + '-startdato']) {
        resetValidation(namespace + '-startdato')
      }
    }
  }

  const setSluttDato = (dato: string, index: number) => {
    if (index < 0) {
      _setNewSluttDato(dato)
      _resetValidation(namespace + '-sluttdato')
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      if (dato === '') {
        delete newFamilieRelasjoner[index].periode.sluttdato
        newFamilieRelasjoner[index].periode.aapenPeriodeType = 'åpen_sluttdato'
      } else {
        delete newFamilieRelasjoner[index].periode.aapenPeriodeType
        newFamilieRelasjoner[index].periode.sluttdato = dato
      }
      updateReplySed(target, newFamilieRelasjoner)
      if (validation[namespace + '-sluttdato']) {
        resetValidation(namespace + '-sluttdato')
      }
    }
  }

  const setAnnenRelasjonType = (annenRelasjonType: string, index: number) => {
    if (index < 0) {
      _setNewAnnenRelasjonType(annenRelasjonType)
      _resetValidation(namespace + '-annenrelasjontype')
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[index].annenRelasjonType = annenRelasjonType
      updateReplySed(target, newFamilieRelasjoner)
      if (validation[namespace + '-annenrelasjontype']) {
        resetValidation(namespace + '-annenrelasjontype')
      }
    }
  }

  const setAnnenRelasjonPersonNavn = (navn: string, index: number) => {
    if (index < 0) {
      _setNewAnnenRelasjonPersonNavn(navn)
      _resetValidation(namespace + '-annenrelasjonpersonnavn')
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[index].annenRelasjonPersonNavn = navn
      updateReplySed(target, newFamilieRelasjoner)
      if (validation[namespace + '-annenrelasjonpersonnavn']) {
        resetValidation(namespace + '-annenrelasjonpersonnavn')
      }
    }
  }

  const setAnnenRelasjonDato = (dato: string, index: number) => {
    if (index < 0) {
      _setNewAnnenRelasjonDato(dato)
      _resetValidation(namespace + '-annenrelasjondato')
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[index].annenRelasjonDato = dato
      updateReplySed(target, newFamilieRelasjoner)
      if (validation[namespace + '-annenrelasjondato']) {
        resetValidation(namespace + '-annenrelasjondato')
      }
    }
  }

  const setBorSammen = (borSammen: JaNei, index: number) => {
    if (index < 0) {
      _setNewBorSammen(borSammen)
      _resetValidation(namespace + '-borsammen')
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[index].borSammen = borSammen
      updateReplySed(target, newFamilieRelasjoner)
      if (validation[namespace + '-borsammen']) {
        resetValidation(namespace + '-borsammen')
      }
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
    _resetValidation()
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
    updateReplySed(target, newFamilieRelasjoner)
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
      newFamilierelasjon.borSammen = _newBorSammen
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
      updateReplySed(target, newFamilieRelasjoner)
    }
  }

  const getErrorFor = (index: number, el: string): string | undefined => {
    return index < 0
      ? _validation[namespace + '-' + el]?.feilmelding
      : validation[namespace + '[' + index + ']-' + el]?.feilmelding
  }

  const renderRow = (familierelasjon: FamilieRelasjon | null, index: number) => {
    const key = familierelasjon ? getKey(familierelasjon) : 'new'
    const candidateForDeletion = index < 0 ? false : !!key && hasKey(key)
    const idx = (index >= 0 ? '[' + index + ']' : '')
    const startdato = index < 0 ? _newStartDato : familierelasjon?.periode.startdato
    const sluttdato = index < 0 ? _newSluttDato : familierelasjon?.periode.sluttdato
    return (
      <>
        <AlignStartRow className={classNames('slideInFromLeft')}>
          <Column data-flex='2'>
            <Select
              data-test-id={'c-' + namespace + idx + '-relasjontype-text'}
              feil={getErrorFor(index, 'relasjonType')}
              highContrast={highContrast}
              id={'c-' + namespace + idx + '-relasjontype-text'}
              label={t('label:type') + ' *'}
              menuPortalTarget={document.body}
              onChange={(e) => setRelasjonType(e.value as RelasjonType, index)}
              options={relasjonTypeOptions}
              placeholder={t('el:placeholder-select-default')}
              defaultValue={_.find(relasjonTypeOptions, r => r.value === (index < 0 ? _newRelasjonType : familierelasjon!.relasjonType))}
              selectedValue={_.find(relasjonTypeOptions, r => r.value === (index < 0 ? _newRelasjonType : familierelasjon!.relasjonType))}
            />
          </Column>
          <Period
            key={'' + startdato + sluttdato}
            namespace={namespace + idx}
            errorStartDato={getErrorFor(index, 'startdato')}
            errorSluttDato={getErrorFor(index, 'sluttdato')}
            setStartDato={(dato: string) => setStartDato(dato, index)}
            setSluttDato={(dato: string) => setSluttDato(dato, index)}
            valueStartDato={startdato}
            valueSluttDato={sluttdato}
          />
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addCandidateForDeletion(key!)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeCandidateForDeletion(key!)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        {(index < 0 ? _newRelasjonType === 'ANNEN' : familierelasjon?.relasjonType === 'ANNEN') && (
          <>
            <AlignStartRow className={classNames('slideInFromLeft')}>
              <Column data-flex='2'>
                <Input
                  feil={getErrorFor(index, 'annenrelasjontype')}
                  namespace={namespace + idx}
                  id='annenrelasjontype-text'
                  label={t('label:annen-relasjon') + ' *'}
                  onChanged={(value: string) => setAnnenRelasjonType(value, index)}
                  value={index < 0 ? _newAnnenRelasjonType : familierelasjon?.annenRelasjonType}
                />
              </Column>
              <Column data-flex='2' />
            </AlignStartRow>
            <VerticalSeparatorDiv />
            <AlignStartRow className={classNames('slideInFromLeft')} style={{ animationDelay: '0.1s' }}>
              <Column data-flex='2'>
                <Input
                  feil={getErrorFor(index, 'annenrelasjonpersonnavn')}
                  namespace={namespace + idx}
                  id='annenrelasjonpersonnavn-text'
                  label={t('label:person-navn') + ' *'}
                  onChanged={(value: string) => setAnnenRelasjonPersonNavn(value, index)}
                  value={index < 0 ? _newAnnenRelasjonPersonNavn : familierelasjon?.annenRelasjonPersonNavn}
                />
              </Column>
              <Column>
                <DateInput
                  error={getErrorFor(index, 'annenrelasjondato')}
                  namespace={namespace + idx + '-annenrelasjondato'}
                  index={index}
                  key={index < 0 ? _newAnnenRelasjonDato : familierelasjon?.annenRelasjonDato}
                  label={t('label:dato-for-relasjon') + ' *'}
                  setDato={setAnnenRelasjonDato}
                  value={index < 0 ? _newAnnenRelasjonDato : familierelasjon?.annenRelasjonDato}
                />
              </Column>
              <Column />
            </AlignStartRow>
            <VerticalSeparatorDiv />
            <AlignStartRow className={classNames('slideInFromLeft')} style={{ animationDelay: '0.2s' }}>
              <Column data-flex='2'>
                <HighContrastRadioPanelGroup
                  checked={index < 0 ? _newBorSammen : familierelasjon?.borSammen}
                  data-test-id={'c-' + namespace + idx + '-borsammen-text'}
                  data-no-border
                  id={'c-' + namespace + idx + '-borsammen-text'}
                  feil={getErrorFor(index, 'borsammen')}
                  legend={t('label:bor-sammen') + ' *'}
                  name={namespace + idx + '-borsammen'}
                  radios={[
                    { label: t('label:ja'), value: 'ja' },
                    { label: t('label:nei'), value: 'nei' }
                  ]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBorSammen(e.target.value as JaNei, index)}
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
                onClick={() => _setSeeNewForm(true)}
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
