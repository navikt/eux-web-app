import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import DateInput from 'components/Forms/DateInput'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import Period from 'components/Period/Period'
import { Options } from 'declarations/app'
import { FamilieRelasjon, JaNei, Periode, RelasjonType, ReplySed } from 'declarations/sed'
import { Kodeverk, Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  AlignStartRow, PaddedDiv,
  HighContrastFlatknapp,
  HighContrastRadioPanelGroup,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getIdx } from 'utils/namespace'
import { validateFamilierelasjon, ValidationFamilierelasjonProps } from './validation'

interface FamilierelasjonProps {
  familierelasjonKodeverk: Array<Kodeverk>
  highContrast: boolean
  parentNamespace: string
  personID: string
  personName: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const Familierelasjon: React.FC<FamilierelasjonProps> = ({
  familierelasjonKodeverk,
  highContrast,
  parentNamespace,
  personID,
  personName,
  replySed,
  resetValidation,
  updateReplySed,
  validation
}:FamilierelasjonProps): JSX.Element => {
  const { t } = useTranslation()
  const target = `${personID}.familierelasjoner`
  const familierelasjoner: Array<FamilieRelasjon> = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-familierelasjon`

  const [_newRelasjonType, _setNewRelasjonType] = useState<RelasjonType | undefined>(undefined)
  const [_newSluttDato, _setNewSluttDato] = useState<string>('')
  const [_newStartDato, _setNewStartDato] = useState<string>('')
  const [_newAnnenRelasjonType, _setNewAnnenRelasjonType] = useState<string>('')
  const [_newAnnenRelasjonPersonNavn, _setNewAnnenRelasjonPersonNavn] = useState<string>('')
  const [_newAnnenRelasjonDato, _setNewAnnenRelasjonDato] = useState<string>('')
  const [_newBorSammen, _setNewBorSammen] = useState<JaNei | undefined>(undefined)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<FamilieRelasjon>((f: FamilieRelasjon): string => {
    return f.relasjonType + '-' + f.periode.startdato
  })
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationFamilierelasjonProps>({}, validateFamilierelasjon)

  const relasjonTypeOptions: Options = familierelasjonKodeverk.map((f: Kodeverk) => ({
    label: f.term, value: f.kode
  }))

  const setRelasjonType = (relasjonType: RelasjonType, index: number) => {
    if (index < 0) {
      _setNewRelasjonType(relasjonType.trim() as RelasjonType)
      _resetValidation(namespace + '-RelasjonType')
    } else {
      updateReplySed(`${target}[${index}].relasjonType`, relasjonType.trim())
      if (validation[namespace + getIdx(index) + '-RelasjonType']) {
        resetValidation(namespace + getIdx(index) + '-RelasjonType')
      }
    }
  }

  const setStartDato = (startdato: string, index: number) => {
    if (index < 0) {
      _setNewStartDato(startdato.trim())
      _resetValidation(namespace + '-periode-startdato')
    } else {
      updateReplySed(`${target}[${index}].periode.startdato`, startdato.trim())
      if (validation[namespace + getIdx(index) + '-periode-startdato']) {
        resetValidation(namespace + getIdx(index) + '-periode-startdato')
      }
    }
  }

  const setSluttDato = (sluttdato: string, index: number) => {
    if (index < 0) {
      _setNewSluttDato(sluttdato.trim())
      _resetValidation(namespace + '-periode-sluttdato')
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      if (sluttdato === '') {
        delete newFamilieRelasjoner[index].periode.sluttdato
        newFamilieRelasjoner[index].periode.aapenPeriodeType = 'åpen_sluttdato'
      } else {
        delete newFamilieRelasjoner[index].periode.aapenPeriodeType
        newFamilieRelasjoner[index].periode.sluttdato = sluttdato.trim()
      }
      updateReplySed(target, newFamilieRelasjoner)
      if (validation[namespace + getIdx(index) + '-periode-sluttdato']) {
        resetValidation(namespace + getIdx(index) + '-periode-sluttdato')
      }
    }
  }

  const setAnnenRelasjonType = (annenRelasjonType: string, index: number) => {
    if (index < 0) {
      _setNewAnnenRelasjonType(annenRelasjonType.trim())
      _resetValidation(namespace + '-annenRelasjonType')
    } else {
      updateReplySed(`${target}[${index}].annenRelasjonType`, annenRelasjonType.trim())
      if (validation[namespace + getIdx(index) + '-annenRelasjonType']) {
        resetValidation(namespace + getIdx(index) + '-annenRelasjonType')
      }
    }
  }

  const setAnnenRelasjonPersonNavn = (annenRelasjonPersonNavn: string, index: number) => {
    if (index < 0) {
      _setNewAnnenRelasjonPersonNavn(annenRelasjonPersonNavn.trim())
      _resetValidation(namespace + '-annenRelasjonPersonNavn')
    } else {
      updateReplySed(`${target}[${index}].annenRelasjonPersonNavn`, annenRelasjonPersonNavn.trim())
      if (validation[namespace + getIdx(index) + '-annenRelasjonPersonNavn']) {
        resetValidation(namespace + getIdx(index) + '-annenRelasjonPersonNavn')
      }
    }
  }

  const setAnnenRelasjonDato = (annenRelasjonDato: string, index: number) => {
    if (index < 0) {
      _setNewAnnenRelasjonDato(annenRelasjonDato.trim())
      _resetValidation(namespace + '-annenRelasjonDato')
    } else {
      updateReplySed(`${target}[${index}].annenRelasjonDato`, annenRelasjonDato.trim())
      if (validation[namespace + getIdx(index) + '-annenRelasjonDato']) {
        resetValidation(namespace + getIdx(index) + '-annenRelasjonDato')
      }
    }
  }

  const setBorSammen = (borSammen: JaNei, index: number) => {
    if (index < 0) {
      _setNewBorSammen(borSammen.trim() as JaNei)
      _resetValidation(namespace + '-borSammen')
    } else {
      updateReplySed(`${target}[${index}].borSammen`, borSammen.trim())
      if (validation[namespace + getIdx(index) + '-borSammen']) {
        resetValidation(namespace + getIdx(index) + '-borSammen')
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

  const onRemove = (i: number) => {
    const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
    const deletedFamilierelasjoner: Array<FamilieRelasjon> = newFamilieRelasjoner.splice(i, 1)
    if (deletedFamilierelasjoner && deletedFamilierelasjoner.length > 0) {
      removeFromDeletion(deletedFamilierelasjoner[0])
    }
    updateReplySed(target, newFamilieRelasjoner)
  }

  const onAdd = () => {
    const newPeriode: Periode = {
      startdato: _newStartDato.trim()
    }
    if (_newSluttDato) {
      newPeriode.sluttdato = _newSluttDato.trim()
    } else {
      newPeriode.aapenPeriodeType = 'åpen_sluttdato'
    }

    const newFamilierelasjon: FamilieRelasjon = {
      relasjonType: _newRelasjonType?.trim() as RelasjonType,
      relasjonInfo: '',
      periode: newPeriode
    }

    if (_newRelasjonType === 'ANNEN' as RelasjonType) {
      newFamilierelasjon.borSammen = _newBorSammen?.trim() as JaNei
      newFamilierelasjon.annenRelasjonType = _newAnnenRelasjonType?.trim()
      newFamilierelasjon.annenRelasjonPersonNavn = _newAnnenRelasjonPersonNavn?.trim()
      newFamilierelasjon.annenRelasjonDato = _newAnnenRelasjonDato?.trim()
    }

    const valid: boolean = performValidation({
      familierelasjon: newFamilierelasjon,
      namespace,
      personName: personName
    })

    if (valid) {
      let newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      if (_.isNil(newFamilieRelasjoner)) {
        newFamilieRelasjoner = []
      }
      newFamilieRelasjoner.push(newFamilierelasjon)
      updateReplySed(target, newFamilieRelasjoner)
      resetForm()
    }
  }

  const renderRow = (familierelasjon: FamilieRelasjon | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(familierelasjon)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
    const startdato = index < 0 ? _newStartDato : familierelasjon?.periode.startdato
    const sluttdato = index < 0 ? _newSluttDato : familierelasjon?.periode.sluttdato
    return (
      <>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.3) + 's' }}
        >
          <Column flex='2'>
            <Select
              data-test-id={namespace + idx + '-relasjonType'}
              feil={getErrorFor(index, 'relasjonType')}
              highContrast={highContrast}
              id={namespace + idx + '-relasjonType'}
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
            namespace={namespace + idx + '-periode'}
            errorStartDato={getErrorFor(index, 'periode-startdato')}
            errorSluttDato={getErrorFor(index, 'periode-sluttdato')}
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
              onBeginRemove={() => addToDeletion(familierelasjon)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(familierelasjon)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        {(index < 0 ? _newRelasjonType === 'ANNEN' : familierelasjon?.relasjonType === 'ANNEN') && (
          <>
            <AlignStartRow className={classNames('slideInFromLeft')} style={{ animationDelay: index < 0 ? '0.1s' : (index * 0.3 + 0.1) + 's' }}>
              <Column flex='2'>
                <Input
                  feil={getErrorFor(index, 'annenRelasjonType')}
                  namespace={namespace + idx}
                  id='annenRelasjonType'
                  label={t('label:annen-relasjon') + ' *'}
                  onChanged={(value: string) => setAnnenRelasjonType(value, index)}
                  value={index < 0 ? _newAnnenRelasjonType : familierelasjon?.annenRelasjonType}
                />
              </Column>
              <Column flex='2' />
            </AlignStartRow>
            <VerticalSeparatorDiv />
            <AlignStartRow className={classNames('slideInFromLeft')} style={{ animationDelay: index < 0 ? '0.1s' : (index * 0.3 + 0.1) + 's' }}>
              <Column flex='2'>
                <Input
                  feil={getErrorFor(index, 'annenRelasjonPersonNavn')}
                  namespace={namespace + idx}
                  id='annenRelasjonPersonNavn'
                  label={t('label:person-navn') + ' *'}
                  onChanged={(value: string) => setAnnenRelasjonPersonNavn(value, index)}
                  value={index < 0 ? _newAnnenRelasjonPersonNavn : familierelasjon?.annenRelasjonPersonNavn}
                />
              </Column>
              <Column>
                <DateInput
                  feil={getErrorFor(index, 'annenRelasjonDato')}
                  namespace={namespace + idx}
                  id='annenRelasjonDato'
                  key={index < 0 ? _newAnnenRelasjonDato : familierelasjon?.annenRelasjonDato}
                  label={t('label:dato-for-relasjon') + ' *'}
                  onChanged={(dato: string) => setAnnenRelasjonDato(dato, index)}
                  value={index < 0 ? _newAnnenRelasjonDato : familierelasjon?.annenRelasjonDato}
                />
              </Column>
              <Column />
            </AlignStartRow>
            <VerticalSeparatorDiv />
            <AlignStartRow className={classNames('slideInFromLeft')} style={{ animationDelay: index < 0 ? '0.2s' : (index * 0.3 + 0.2) + 's' }}>
              <Column flex='2'>
                <HighContrastRadioPanelGroup
                  checked={index < 0 ? _newBorSammen : familierelasjon?.borSammen}
                  data-test-id={namespace + idx + '-borSammen'}
                  data-no-border
                  id={namespace + idx + '-borSammen'}
                  feil={getErrorFor(index, 'borSammen')}
                  legend={t('label:bor-sammen') + ' *'}
                  name={namespace + idx + '-borSammen'}
                  radios={[
                    { label: t('label:ja'), value: 'ja' },
                    { label: t('label:nei'), value: 'nei' }
                  ]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBorSammen(e.target.value as JaNei, index)}
                />
              </Column>
              <Column flex='2' />
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
        {t('label:familierelasjon')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {familierelasjoner?.map(renderRow)}
      <HorizontalLineSeparator />
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
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:familierelasjon').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
    </PaddedDiv>
  )
}

export default Familierelasjon
