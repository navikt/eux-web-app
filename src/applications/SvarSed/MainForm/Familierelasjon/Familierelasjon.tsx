import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Heading } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  FlexRadioPanels,
  PaddedDiv,
  RadioPanel,
  RadioPanelGroup,
  Row,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetValidation } from 'actions/validation'
import { TwoLevelFormProps, TwoLevelFormSelector } from 'applications/SvarSed/TwoLevelForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import DateInput from 'components/Forms/DateInput'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import Select from 'components/Forms/Select'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { Option, Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { FamilieRelasjon, JaNei, Periode, RelasjonType } from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getIdx } from 'utils/namespace'
import { validateFamilierelasjon, ValidationFamilierelasjonProps } from './validation'

const mapState = (state: State): TwoLevelFormSelector => ({
  validation: state.validation.status
})

const Familierelasjon: React.FC<TwoLevelFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:TwoLevelFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useSelector<State, TwoLevelFormSelector>(mapState)
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

  const relasjonTypeOptions: Options = [
    { label: t('el:option-familierelasjon-gift'), value: 'gift' },
    { label: t('el:option-familierelasjon-samboer'), value: 'samboer' },
    { label: t('el:option-familierelasjon-registrert_partnerskap'), value: 'registrert_partnerskap' },
    { label: t('el:option-familierelasjon-skilt'), value: 'skilt' },
    { label: t('el:option-familierelasjon-aleneforelder'), value: 'aleneforelder' },
    { label: t('el:option-familierelasjon-annet'), value: 'annet' }
  ]

  const setRelasjonType = (relasjonType: RelasjonType, index: number) => {
    if (index < 0) {
      _setNewRelasjonType(relasjonType.trim() as RelasjonType)
      _resetValidation(namespace + '-relasjonType')
    } else {
      dispatch(updateReplySed(`${target}[${index}].relasjonType`, relasjonType.trim()))
      if (validation[namespace + getIdx(index) + '-relasjonType']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-relasjonType'))
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

    if (_newRelasjonType === 'annet' as RelasjonType) {
      newFamilierelasjon.borSammen = _newBorSammen?.trim() as JaNei
      newFamilierelasjon.annenRelasjonType = _newAnnenRelasjonType?.trim()
      newFamilierelasjon.annenRelasjonPersonNavn = _newAnnenRelasjonPersonNavn?.trim()
      newFamilierelasjon.annenRelasjonDato = _newAnnenRelasjonDato?.trim()
    }

    const valid: boolean = performValidation({
      familierelasjon: newFamilierelasjon,
      namespace,
      personName
    })

    if (valid) {
      let newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      if (_.isNil(newFamilieRelasjoner)) {
        newFamilieRelasjoner = []
      }
      newFamilieRelasjoner.push(newFamilierelasjon)
      dispatch(updateReplySed(target, newFamilieRelasjoner))
      onCancel()
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
    const _relasjonType = index < 0 ? _newRelasjonType : familierelasjon!.relasjonType
    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow>
          <Column flex='2'>
            <Select
              data-testid={namespace + idx + '-relasjonType'}
              error={getErrorFor(index, 'relasjonType')}
              key={namespace + idx + '-relasjonType-' + _relasjonType}
              id={namespace + idx + '-relasjonType'}
              label={t('label:type') + ' *'}
              menuPortalTarget={document.body}
              onChange={(e: unknown) => setRelasjonType((e as Option).value as RelasjonType, index)}
              options={relasjonTypeOptions}
              defaultValue={_.find(relasjonTypeOptions, r => r.value === _relasjonType)}
              value={_.find(relasjonTypeOptions, r => r.value === _relasjonType)}
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
        {_relasjonType === 'annet' && (
          <div style={{ marginLeft: '1.5rem' }}>
            <AlignStartRow>
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
            <AlignStartRow>
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
            <AlignStartRow>
              <Column flex='3'>
                <RadioPanelGroup
                  value={index < 0 ? _newBorSammen : familierelasjon?.borSammen}
                  data-testid={namespace + idx + '-borSammen'}
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
                <AddCircle />
                {t('el:button-add-new-x', { x: t('label:familierelasjon').toLowerCase() })}
              </Button>
            </Column>
          </Row>
          )}
    </PaddedDiv>
  )
}

export default Familierelasjon