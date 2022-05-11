import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Label } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  FlexDiv,
  FlexRadioPanels,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PaddedHorizontallyDiv,
  RadioPanel,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel2 from 'components/AddRemovePanel/AddRemovePanel2'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import Select from 'components/Forms/Select'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { Option, Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { FamilieRelasjon, JaNei, Periode, RelasjonType } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { hasNamespace } from 'utils/validation'
import {
  validateFamilierelasjon,
  validateFamilierelasjoner,
  ValidationFamilierelasjonerProps,
  ValidationFamilierelasjonProps
} from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Familierelasjon: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-familierelasjon`
  const target = `${personID}.familierelasjoner`
  const familierelasjoner: Array<FamilieRelasjon> | undefined = _.get(replySed, target)
  const getId = (f: FamilieRelasjon | null): string => f ? (f.relasjonType + '-' + (f.periode?.startdato ?? '')) : 'new'

  const [_newFamilierelasjon, _setNewFamilierelasjon] = useState<FamilieRelasjon | undefined>(undefined)
  const [_editFamilierelasjon, _setEditFamilierelasjon] = useState<FamilieRelasjon | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationFamilierelasjonProps>(validateFamilierelasjon, namespace)

  const relasjonTypeOptions: Options = [
    { label: t('el:option-familierelasjon-gift'), value: 'gift' },
    { label: t('el:option-familierelasjon-samboer'), value: 'samboer' },
    { label: t('el:option-familierelasjon-registrert_partnerskap'), value: 'registrert_partnerskap' },
    { label: t('el:option-familierelasjon-skilt'), value: 'skilt' },
    { label: t('el:option-familierelasjon-aleneforelder'), value: 'aleneforelder' },
    { label: t('el:option-familierelasjon-annet'), value: 'annet' }
  ]

  useUnmount(() => {
    const [, newValidation] = performValidation<ValidationFamilierelasjonerProps>(
      validation, namespace, validateFamilierelasjoner, {
        familierelasjoner,
        personName
      }
    )
    dispatch(setValidation(newValidation))
  })

  const cleanUp = (f: FamilieRelasjon): FamilieRelasjon => {
    const _f = _.cloneDeep(f)
    if (_f.relasjonType !== 'annet') {
      delete _f.annenRelasjonPersonNavn
      delete _f.annenRelasjonType
      delete _f.borSammen
    }
    return _f
  }

  const setRelasjonType = (relasjonType: RelasjonType, index: number) => {
    if (index < 0) {
      _setNewFamilierelasjon({
        ..._newFamilierelasjon,
        relasjonType
      } as FamilieRelasjon)
      _resetValidation(namespace + '-relasjonType')
      return
    }
    _setEditFamilierelasjon({
      ..._editFamilierelasjon,
      relasjonType
    } as FamilieRelasjon)
    if (validation[namespace + getIdx(index) + '-relasjonType']) {
      dispatch(resetValidation(namespace + getIdx(index) + '-relasjonType'))
    }
  }

  const setPeriode = (periode: Periode, whatChanged: string, index: number) => {
    if (index < 0) {
      _setNewFamilierelasjon({
        ..._newFamilierelasjon,
        periode
      } as FamilieRelasjon)
      _resetValidation(namespace + '-periode')
      return
    }
    _setEditFamilierelasjon({
      ..._editFamilierelasjon,
      periode
    } as FamilieRelasjon)
    dispatch(resetValidation(namespace + getIdx(index) + '-periode'))
  }

  const setAnnenRelasjonType = (annenRelasjonType: string, index: number) => {
    if (index < 0) {
      _setNewFamilierelasjon({
        ..._newFamilierelasjon,
        annenRelasjonType: annenRelasjonType.trim()
      } as FamilieRelasjon)
      _resetValidation(namespace + '-annenRelasjonType')
      return
    }
    _setEditFamilierelasjon({
      ..._editFamilierelasjon,
      annenRelasjonType: annenRelasjonType.trim()
    } as FamilieRelasjon)
    if (validation[namespace + getIdx(index) + '-annenRelasjonType']) {
      dispatch(resetValidation(namespace + getIdx(index) + '-annenRelasjonType'))
    }
  }

  const setAnnenRelasjonPersonNavn = (annenRelasjonPersonNavn: string, index: number) => {
    if (index < 0) {
      _setNewFamilierelasjon({
        ..._newFamilierelasjon,
        annenRelasjonPersonNavn: annenRelasjonPersonNavn.trim()
      } as FamilieRelasjon)
      _resetValidation(namespace + '-annenRelasjonPersonNavn')
      return
    }
    _setEditFamilierelasjon({
      ..._editFamilierelasjon,
      annenRelasjonPersonNavn: annenRelasjonPersonNavn.trim()
    } as FamilieRelasjon)
    if (validation[namespace + getIdx(index) + '-annenRelasjonPersonNavn']) {
      dispatch(resetValidation(namespace + getIdx(index) + '-annenRelasjonPersonNavn'))
    }
  }

  const setBorSammen = (borSammen: JaNei, index: number) => {
    if (index < 0) {
      _setNewFamilierelasjon({
        ..._newFamilierelasjon,
        borSammen: borSammen.trim()
      } as FamilieRelasjon)
      _resetValidation(namespace + '-borSammen')
      return
    }
    _setEditFamilierelasjon({
      ..._editFamilierelasjon,
      borSammen: borSammen.trim()
    } as FamilieRelasjon)
    if (validation[namespace + getIdx(index) + '-borSammen']) {
      dispatch(resetValidation(namespace + getIdx(index) + '-borSammen'))
    }
  }

  const onCloseEdit = (namespace: string) => {
    _setEditFamilierelasjon(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewFamilierelasjon(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (f: FamilieRelasjon, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditFamilierelasjon(f)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const [valid, newValidation] = performValidation<ValidationFamilierelasjonProps>(
      validation, namespace, validateFamilierelasjon, {
        familierelasjon: _editFamilierelasjon,
        familierelasjoner,
        index: _editIndex,
        personName
      })
    if (valid) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, cleanUp(_editFamilierelasjon!)))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(newValidation))
    }
  }

  const onRemove = (removedFamilierelasjon: FamilieRelasjon) => {
    const newFamilierelasjon: Array<FamilieRelasjon> = _.reject(familierelasjoner,
      (f: FamilieRelasjon) => _.isEqual(removedFamilierelasjon, f))
    dispatch(updateReplySed(target, newFamilierelasjon))
    standardLogger('svarsed.editor.familierelasjon.remove')
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      familierelasjon: _newFamilierelasjon,
      familierelasjoner,
      personName
    })

    if (!!_newFamilierelasjon && valid) {
      let newFamilieRelasjoner : Array<FamilieRelasjon> | undefined = _.cloneDeep(familierelasjoner)
      if (_.isNil(newFamilieRelasjoner)) {
        newFamilieRelasjoner = []
      }
      newFamilieRelasjoner.push(cleanUp(_newFamilierelasjon))
      dispatch(updateReplySed(target, newFamilieRelasjoner))
      standardLogger('svarsed.editor.familierelasjon.add')
      onCloseNew()
    }
  }

  const renderRow = (familierelasjon: FamilieRelasjon | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _familierelasjon = index < 0 ? _newFamilierelasjon : (inEditMode ? _editFamilierelasjon : familierelasjon)

    const addremovepanel = (
      <AlignEndColumn>
        <AddRemovePanel2<FamilieRelasjon>
          item={familierelasjon}
          marginTop={inEditMode}
          index={index}
          inEditMode={inEditMode}
          onRemove={onRemove}
          onAddNew={onAddNew}
          onCancelNew={onCloseNew}
          onStartEdit={onStartEdit}
          onConfirmEdit={onSaveEdit}
          onCancelEdit={() => onCloseEdit(_namespace)}
        />
      </AlignEndColumn>
    )
    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getId(familierelasjon)}
        className={classNames({
          new: index < 0,
          error: hasNamespace(_v, _namespace)
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        {inEditMode
          ? (
            <>
              <AlignStartRow>
                <PeriodeInput
                  namespace={_namespace + '-periode'}
                  error={{
                    startdato: _v[_namespace + '-periode--startdato']?.feilmelding,
                    sluttdato: _v[_namespace + '-periode--sluttdato']?.feilmelding
                  }}
                  hideLabel={false}
                  requiredStartDato={false}
                  setPeriode={(p: Periode, id: string) => setPeriode(p, id, index)}
                  value={_familierelasjon?.periode}
                />
                {addremovepanel}
              </AlignStartRow>
              <VerticalSeparatorDiv />
              <AlignStartRow>
                <Column>
                  <Select
                    data-testid={_namespace + '-relasjonType'}
                    error={_v[_namespace + '-relasjonType']?.feilmelding}
                    key={_namespace + '-relasjonType-' + _familierelasjon?.relasjonType}
                    id={_namespace + '-relasjonType'}
                    label={t('label:type')}
                    menuPortalTarget={document.body}
                    onChange={(e: unknown) => setRelasjonType((e as Option).value as RelasjonType, index)}
                    options={relasjonTypeOptions}
                    required
                    defaultValue={_.find(relasjonTypeOptions, r => r.value === _familierelasjon?.relasjonType)}
                    value={_.find(relasjonTypeOptions, r => r.value === _familierelasjon?.relasjonType)}
                  />
                </Column>
                {_familierelasjon?.relasjonType === 'annet'
                  ? (
                    <Column>
                      <Input
                        error={_v[_namespace + '-annenRelasjonType']?.feilmelding}
                        namespace={_namespace}
                        key={_namespace + '-annenRelasjonType-' + _familierelasjon?.annenRelasjonType}
                        id='annenRelasjonType'
                        label={t('label:annen-relasjon')}
                        onChanged={(value: string) => setAnnenRelasjonType(value, index)}
                        value={_familierelasjon?.annenRelasjonType}
                      />
                    </Column>
                    )
                  : (<Column />)}
              </AlignStartRow>
              <VerticalSeparatorDiv />
              {_familierelasjon?.relasjonType === 'annet' && (
                <>
                  <AlignStartRow>
                    <Column>
                      <Input
                        error={_v[_namespace + '-annenRelasjonPersonNavn']?.feilmelding}
                        namespace={_namespace}
                        key={_namespace + '-annenRelasjonPersonNavn-' + _familierelasjon?.annenRelasjonPersonNavn}
                        id='annenRelasjonPersonNavn'
                        label={t('label:person-navn')}
                        onChanged={(value: string) => setAnnenRelasjonPersonNavn(value, index)}
                        value={_familierelasjon?.annenRelasjonPersonNavn}
                      />
                    </Column>
                    <Column>
                      <RadioPanelGroup
                        value={_familierelasjon?.borSammen}
                        data-testid={_namespace + '-borSammen'}
                        data-no-border
                        id={_namespace + '-borSammen'}
                        error={_v[_namespace + '-borSammen']?.feilmelding}
                        legend={t('label:bor-sammen')}
                        name={_namespace + '-borSammen'}
                        onChange={(e: string) => setBorSammen(e as JaNei, index)}
                      >
                        <FlexRadioPanels>
                          <RadioPanel value='ja'>{t('label:ja')}</RadioPanel>
                          <RadioPanel value='nei'>{t('label:nei')}</RadioPanel>
                        </FlexRadioPanels>
                      </RadioPanelGroup>
                    </Column>
                  </AlignStartRow>
                </>
              )}
            </>
            )
          : (
            <>
              <AlignStartRow>
                <Column>
                  {t('el:option-familierelasjon-' + _familierelasjon?.relasjonType)}
                </Column>
                <PeriodeText
                  error={{
                    startdato: _v[_namespace + '-periode-startdato'],
                    sluttdato: _v[_namespace + '-periode-sluttdato']
                  }}
                  periode={_familierelasjon?.periode}
                />
                {addremovepanel}
              </AlignStartRow>
              {_familierelasjon?.relasjonType === 'annet' && (

                <AlignStartRow>
                  <Column>
                    {_familierelasjon?.annenRelasjonType && (
                      <FlexDiv>
                        <Label>{t('label:annenRelasjonType')}:</Label>
                        <HorizontalSeparatorDiv size='0.5' />
                        {_familierelasjon?.annenRelasjonType}
                      </FlexDiv>
                    )}
                    {_familierelasjon?.annenRelasjonPersonNavn && (
                      <FlexDiv>
                        <Label>{t('label:annenRelasjonPersonNavn')}:</Label>
                        <HorizontalSeparatorDiv size='0.5' />
                        {_familierelasjon?.annenRelasjonPersonNavn}
                      </FlexDiv>
                    )}
                    {_familierelasjon?.borSammen && (
                      <FlexDiv>
                        <Label>{t('label:borSammen')}:</Label>
                        <HorizontalSeparatorDiv size='0.5' />
                        {_familierelasjon?.borSammen}
                      </FlexDiv>
                    )}
                  </Column>
                </AlignStartRow>

              )}
            </>
            )}
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <>
      <VerticalSeparatorDiv />
      {_.isEmpty(familierelasjoner)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-familierelasjon')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : (
          <>
            <PaddedHorizontallyDiv>
              <AlignStartRow>
                <Column>
                  <Label>
                    {t('label:relasjon')}
                  </Label>
                </Column>
                <Column>
                  <Label>
                    {t('label:periode')}
                  </Label>
                </Column>
                <Column />
              </AlignStartRow>
            </PaddedHorizontallyDiv>
            <VerticalSeparatorDiv size='0.8' />
            {familierelasjoner?.map(renderRow)}
          </>
          )}
      <VerticalSeparatorDiv />
      {_newForm
        ? renderRow(null, -1)
        : (
          <PaddedDiv>
            <Button
              variant='tertiary'
              onClick={() => _setNewForm(true)}
            >
              <AddCircle />
              {t('el:button-add-new-x', { x: t('label:familierelasjon').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
    </>
  )
}

export default Familierelasjon
