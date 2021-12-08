import { Add } from '@navikt/ds-icons'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import DateInput from 'components/Forms/DateInput'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { Option, Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { FamilieRelasjon, JaNei, Periode, RelasjonType } from 'declarations/sed'
import { Kodeverk } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { BodyLong, Heading, Button } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column, FlexRadioPanels,
  HorizontalSeparatorDiv,
  PaddedDiv, RadioPanel,
  RadioPanelGroup,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getIdx } from 'utils/namespace'
import { validateFamilierelasjon, ValidationFamilierelasjonProps } from './validation'

interface FamilierelasjonSelector extends PersonManagerFormSelector {
  familierelasjonKodeverk: Array<Kodeverk> | undefined
}

const mapState = (state: State): FamilierelasjonSelector => ({
  familierelasjonKodeverk: state.app.familierelasjoner,
  validation: state.validation.status
})

const Familierelasjon: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    familierelasjonKodeverk,
    validation
  } = useSelector<State, FamilierelasjonSelector>(mapState)
  const dispatch = useDispatch()
  const target = `${personID}.familierelasjoner`
  const familierelasjoner: Array<FamilieRelasjon> = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-familierelasjon`

  const [_newRelasjonType, _setNewRelasjonType] = useState<RelasjonType | undefined>(undefined)
  const [_newPeriode, _setNewPeriode] = useState<Periode>({ startdato: '' })
  const [_newAnnenRelasjonType, _setNewAnnenRelasjonType] = useState<string>('')
  const [_newAnnenRelasjonPersonNavn, _setNewAnnenRelasjonPersonNavn] = useState<string>('')
  const [_newAnnenRelasjonDato, _setNewAnnenRelasjonDato] = useState<string>('')
  const [_newBorSammen, _setNewBorSammen] = useState<JaNei | undefined>(undefined)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<FamilieRelasjon>((f: FamilieRelasjon): string => f.relasjonType + '-' + f.periode?.startdato ?? '')
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationFamilierelasjonProps>({}, validateFamilierelasjon)

  const relasjonTypeOptions: Options = familierelasjonKodeverk?.map((f: Kodeverk) => ({
    label: f.term, value: f.kode
  })) ?? []

  const setRelasjonType = (relasjonType: RelasjonType, index: number) => {
    if (index < 0) {
      _setNewRelasjonType(relasjonType.trim() as RelasjonType)
      _resetValidation(namespace + '-RelasjonType')
    } else {
      dispatch(updateReplySed(`${target}[${index}].relasjonType`, relasjonType.trim()))
      if (validation[namespace + getIdx(index) + '-RelasjonType']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-RelasjonType'))
      }
    }
  }

  const setPeriode = (periode: Periode, id: string, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      if (id === 'startdato') {
        _resetValidation(namespace + '-periode-startdato')
      }
      if (id === 'sluttdato') {
        _resetValidation(namespace + '-periode-sluttdato')
      }
    } else {
      dispatch(updateReplySed(`${target}[${index}].periode`, periode))
      if (id === 'startdato' && validation[namespace + getIdx(index) + '-periode-startdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-periode-startdato'))
      }
      if (id === 'sluttdato' && validation[namespace + getIdx(index) + '-periode-sluttdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-periode-sluttdato'))
      }
    }
  }

  const setAnnenRelasjonType = (annenRelasjonType: string, index: number) => {
    if (index < 0) {
      _setNewAnnenRelasjonType(annenRelasjonType.trim())
      _resetValidation(namespace + '-annenRelasjonType')
    } else {
      dispatch(updateReplySed(`${target}[${index}].annenRelasjonType`, annenRelasjonType.trim()))
      if (validation[namespace + getIdx(index) + '-annenRelasjonType']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-annenRelasjonType'))
      }
    }
  }

  const setAnnenRelasjonPersonNavn = (annenRelasjonPersonNavn: string, index: number) => {
    if (index < 0) {
      _setNewAnnenRelasjonPersonNavn(annenRelasjonPersonNavn.trim())
      _resetValidation(namespace + '-annenRelasjonPersonNavn')
    } else {
      dispatch(updateReplySed(`${target}[${index}].annenRelasjonPersonNavn`, annenRelasjonPersonNavn.trim()))
      if (validation[namespace + getIdx(index) + '-annenRelasjonPersonNavn']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-annenRelasjonPersonNavn'))
      }
    }
  }

  const setAnnenRelasjonDato = (annenRelasjonDato: string, index: number) => {
    if (index < 0) {
      _setNewAnnenRelasjonDato(annenRelasjonDato.trim())
      _resetValidation(namespace + '-annenRelasjonDato')
    } else {
      dispatch(updateReplySed(`${target}[${index}].annenRelasjonDato`, annenRelasjonDato.trim()))
      if (validation[namespace + getIdx(index) + '-annenRelasjonDato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-annenRelasjonDato'))
      }
    }
  }

  const setBorSammen = (borSammen: JaNei, index: number) => {
    if (index < 0) {
      _setNewBorSammen(borSammen.trim() as JaNei)
      _resetValidation(namespace + '-borSammen')
    } else {
      dispatch(updateReplySed(`${target}[${index}].borSammen`, borSammen.trim()))
      if (validation[namespace + getIdx(index) + '-borSammen']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-borSammen'))
      }
    }
  }

  const resetForm = () => {
    _setNewRelasjonType(undefined)
    _setNewPeriode({ startdato: '' })
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
    dispatch(updateReplySed(target, newFamilieRelasjoner))
    standardLogger('svarsed.editor.familierelasjon.add')
  }

  const onAdd = () => {
    const newFamilierelasjon: FamilieRelasjon = {
      relasjonType: _newRelasjonType?.trim() as RelasjonType,
      relasjonInfo: '',
      periode: _newPeriode
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
      dispatch(updateReplySed(target, newFamilieRelasjoner))
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
    const _periode = index < 0 ? _newPeriode : familierelasjon?.periode

    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.3) + 's' }}
        >
          <Column flex='2'>
            <Select
              data-test-id={namespace + idx + '-relasjonType'}
              error={getErrorFor(index, 'relasjonType')}
              key={namespace + idx + '-relasjonType-' + (index < 0 ? _newRelasjonType : familierelasjon!.relasjonType)}
              id={namespace + idx + '-relasjonType'}
              label={t('label:type') + ' *'}
              menuPortalTarget={document.body}
              onChange={(e: unknown) => setRelasjonType((e as Option).value as RelasjonType, index)}
              options={relasjonTypeOptions}
              placeholder={t('el:placeholder-select-default')}
              defaultValue={_.find(relasjonTypeOptions, r => r.value === (index < 0 ? _newRelasjonType : familierelasjon!.relasjonType))}
              value={_.find(relasjonTypeOptions, r => r.value === (index < 0 ? _newRelasjonType : familierelasjon!.relasjonType))}
            />
          </Column>
          <PeriodeInput
            namespace={namespace + idx + '-periode'}
            error={{
              startdato: getErrorFor(index, 'periode-startdato'),
              sluttdato: getErrorFor(index, 'periode-sluttdato')
            }}
            setPeriode={(p: Periode, id: string) => setPeriode(p, id, index)}
            value={_periode}
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
          <div style={{ marginLeft: '1.5rem' }}>
            <AlignStartRow className={classNames('slideInFromLeft')} style={{ animationDelay: index < 0 ? '0.1s' : (index * 0.3 + 0.1) + 's' }}>
              <Column flex='2'>
                <Input
                  error={getErrorFor(index, 'annenRelasjonType')}
                  namespace={namespace + idx}
                  key={namespace + idx + '-annenRelasjonType-' + (index < 0 ? _newAnnenRelasjonType : familierelasjon?.annenRelasjonType)}
                  id='annenRelasjonType'
                  label={t('label:annen-relasjon') + ' *'}
                  onChanged={(value: string) => setAnnenRelasjonType(value, index)}
                  required
                  value={index < 0 ? _newAnnenRelasjonType : familierelasjon?.annenRelasjonType}
                />
              </Column>
              <Column flex='2' />
            </AlignStartRow>
            <VerticalSeparatorDiv />
            <AlignStartRow className={classNames('slideInFromLeft')} style={{ animationDelay: index < 0 ? '0.1s' : (index * 0.3 + 0.1) + 's' }}>
              <Column flex='2'>
                <Input
                  error={getErrorFor(index, 'annenRelasjonPersonNavn')}
                  namespace={namespace + idx}
                  key={namespace + idx + '-annenRelasjonPersonNavn-' + (index < 0 ? _newAnnenRelasjonPersonNavn : familierelasjon?.annenRelasjonPersonNavn)}
                  id='annenRelasjonPersonNavn'
                  label={t('label:person-navn') + ' *'}
                  onChanged={(value: string) => setAnnenRelasjonPersonNavn(value, index)}
                  required
                  value={index < 0 ? _newAnnenRelasjonPersonNavn : familierelasjon?.annenRelasjonPersonNavn}
                />
              </Column>
              <Column>
                <DateInput
                  error={getErrorFor(index, 'annenRelasjonDato')}
                  namespace={namespace + idx}
                  id='annenRelasjonDato'
                  key={namespace + idx + '-annenRelasjonDato-' + (index < 0 ? _newAnnenRelasjonDato : familierelasjon?.annenRelasjonDato)}
                  label={t('label:dato-for-relasjon') + ' *'}
                  onChanged={(dato: string) => setAnnenRelasjonDato(dato, index)}
                  required
                  value={index < 0 ? _newAnnenRelasjonDato : familierelasjon?.annenRelasjonDato}
                />
              </Column>
              <Column />
            </AlignStartRow>
            <VerticalSeparatorDiv />
            <AlignStartRow className={classNames('slideInFromLeft')} style={{ animationDelay: index < 0 ? '0.2s' : (index * 0.3 + 0.2) + 's' }}>
              <Column flex='3'>
                <RadioPanelGroup
                  value={index < 0 ? _newBorSammen : familierelasjon?.borSammen}
                  data-test-id={namespace + idx + '-borSammen'}
                  data-no-border
                  id={namespace + idx + '-borSammen'}
                  error={getErrorFor(index, 'borSammen')}
                  legend={t('label:bor-sammen') + ' *'}
                  name={namespace + idx + '-borSammen'}
                  onChange={(e: string) => setBorSammen(e as JaNei, index)}
                >
                  <FlexRadioPanels>
                    <RadioPanel value='ja'>{t('label:ja')}</RadioPanel>
                    <RadioPanel value='nei'>{t('label:nei')}</RadioPanel>
                  </FlexRadioPanels>
                </RadioPanelGroup>
              </Column>
              <Column />
            </AlignStartRow>
          </div>
        )}
        <VerticalSeparatorDiv size='2' />
      </RepeatableRow>
    )
  }

  return (
    <PaddedDiv>
      <Heading size='small'>
        {t('label:familierelasjon')}
      </Heading>
      <VerticalSeparatorDiv />
      {_.isEmpty(familierelasjoner)
        ? (
          <BodyLong>
            {t('message:warning-no-familierelasjon')}
          </BodyLong>
          )
        : familierelasjoner?.map(renderRow)}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <Row>
            <Column>
              <Button
                variant='tertiary'
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:familierelasjon').toLowerCase() })}
              </Button>
            </Column>
          </Row>
          )}
    </PaddedDiv>
  )
}

export default Familierelasjon
