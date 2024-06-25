import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Heading, Label } from '@navikt/ds-react'
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
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import FormText from 'components/Forms/FormText'
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
import { hasNamespaceWithErrors } from 'utils/validation'
import {
  validateFamilierelasjon,
  validateFamilierelasjoner,
  ValidationFamilierelasjonerProps,
  ValidationFamilierelasjonProps
} from './validation'
import {isF003Sed} from "../../../utils/sed";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Familierelasjon: React.FC<MainFormProps> = ({
  label,
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

  const relasjonTypeOptionsF003: Options = [
    { label: t('el:option-familierelasjon-gift'), value: 'gift' },
    { label: t('el:option-familierelasjon-aleneforelder'), value: 'aleneforelder' },
    { label: t('el:option-familierelasjon-annet'), value: 'annet' }
  ]


  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationFamilierelasjonerProps>(
      clonedValidation, namespace, validateFamilierelasjoner, {
        familierelasjoner,
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const cleanUp = (f: FamilieRelasjon): FamilieRelasjon => {
    const _f = _.cloneDeep(f)
    if (_f.relasjonType !== 'annet') {
      delete _f.annenRelasjonType
    }
    return _f
  }

  const setRelasjonType = (relasjonType: RelasjonType, index: number) => {
    if (index < 0) {
      _setNewFamilierelasjon({
        ..._newFamilierelasjon,
        relasjonType: relasjonType.trim()
      } as FamilieRelasjon)
      _resetValidation(namespace + '-relasjonType')
      return
    }
    _setEditFamilierelasjon({
      ..._editFamilierelasjon,
      relasjonType: relasjonType.trim()
    } as FamilieRelasjon)
    if (validation[namespace + getIdx(index) + '-relasjonType']) {
      dispatch(resetValidation(namespace + getIdx(index) + '-relasjonType'))
    }
  }

  const setPeriode = (periode: Periode, index: number) => {
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
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationFamilierelasjonProps>(
      clonedValidation, namespace, validateFamilierelasjon, {
        familierelasjon: _editFamilierelasjon,
        familierelasjoner,
        index: _editIndex,
        personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, cleanUp(_editFamilierelasjon!)))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
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
        <AddRemovePanel<FamilieRelasjon>
          item={familierelasjon}
          marginTop={false}
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
          error: hasNamespaceWithErrors(_v, _namespace)
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
                    startdato: _v[_namespace + '-periode-startdato']?.feilmelding,
                    sluttdato: _v[_namespace + '-periode-sluttdato']?.feilmelding
                  }}
                  hideLabel={false}
                  requiredStartDato={false}
                  setPeriode={(p: Periode) => setPeriode(p, index)}
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
                    id={_namespace + '-relasjonType'}
                    label={t('label:type')}
                    menuPortalTarget={document.body}
                    onChange={(e: unknown) => setRelasjonType((e as Option).value as RelasjonType, index)}
                    options={isF003Sed(replySed) ? relasjonTypeOptionsF003 : relasjonTypeOptions}
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
              <AlignStartRow>
                <Column>
                  <Input
                    error={_v[_namespace + '-annenRelasjonPersonNavn']?.feilmelding}
                    namespace={_namespace}
                    id='annenRelasjonPersonNavn'
                    label={t('label:person-navn')}
                    onChanged={(value: string) => setAnnenRelasjonPersonNavn(value, index)}
                    value={_familierelasjon?.annenRelasjonPersonNavn}
                  />
                </Column>
              </AlignStartRow>
              <VerticalSeparatorDiv />
              <AlignStartRow>
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
            )
          : (
            <>
              <AlignStartRow>
                <Column>
                  {t('el:option-familierelasjon-' + _familierelasjon?.relasjonType)}
                </Column>
                <Column>
                  <PeriodeText
                    error={{
                      startdato: _v[_namespace + '-periode-startdato']?.feilmelding,
                      sluttdato: _v[_namespace + '-periode-sluttdato']?.feilmelding
                    }}
                    namespace={_namespace + '-periode'}
                    periode={_familierelasjon?.periode}
                  />
                </Column>
                {addremovepanel}
              </AlignStartRow>
                <AlignStartRow>
                  <Column>
                    {_familierelasjon?.relasjonType === 'annet' && (
                      <FormText
                        error={_v[_namespace + '-annenRelasjonType']?.feilmelding}
                        id={_namespace + '-annenRelasjonType'}
                      >
                        <FlexDiv>
                          <Label>{t('label:annenRelasjonType')}:</Label>
                          <HorizontalSeparatorDiv size='0.5' />
                          {_familierelasjon?.annenRelasjonType}
                        </FlexDiv>
                      </FormText>
                    )}
                    <FormText
                      error={_v[_namespace + '-annenRelasjonPersonNavn']?.feilmelding}
                      id={_namespace + '-annenRelasjonPersonNavn'}
                    >
                      <FlexDiv>
                        <Label>{t('label:annenRelasjonPersonNavn')}:</Label>
                        <HorizontalSeparatorDiv size='0.5' />
                        {_familierelasjon?.annenRelasjonPersonNavn}
                      </FlexDiv>
                    </FormText>
                    <FormText
                      error={_v[_namespace + '-borSammen']?.feilmelding}
                      id={_namespace + '-borSammen'}
                    >
                      <FlexDiv>
                        <Label>{t('label:borSammen')}:</Label>
                        <HorizontalSeparatorDiv size='0.5' />
                        {_familierelasjon?.borSammen}
                      </FlexDiv>
                    </FormText>
                  </Column>
                </AlignStartRow>
            </>
            )}
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <>
      <PaddedDiv>
        <Heading size='small'>
          {label}
        </Heading>
      </PaddedDiv>
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
              icon={<PlusCircleIcon/>}
            >
              {t('el:button-add-new-x', { x: t('label:familierelasjon').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
    </>
  )
}

export default Familierelasjon
