import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Heading, Label } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  PaddedDiv,
  PaddedHorizontallyDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { Country } from '@navikt/land-verktoy'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import FormText from 'components/Forms/FormText'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Statsborgerskap } from 'declarations/sed'
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
  validateNasjonalitet,
  validateNasjonaliteter,
  ValidationNasjonaliteterProps,
  ValidationNasjonalitetProps
} from './validation'
import CountryDropdown from "components/CountryDropdown/CountryDropdown";
import FlagPanel from "../../../components/FlagPanel/FlagPanel";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Nasjonaliteter: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-nasjonaliteter`
  const target = `${personID}.personInfo.statsborgerskap`
  const statsborgerskaper: Array<Statsborgerskap> | undefined = _.get(replySed, target)
  const getId = (s: Statsborgerskap | null): string => s ? s.land : 'new'

  const [_newStatsborgerskap, _setNewStatsborgerskap] = useState<Statsborgerskap | undefined>(undefined)
  const [_editStatsborgerskap, _setEditStatsborgerskap] = useState<Statsborgerskap | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationNasjonalitetProps>(validateNasjonalitet, namespace)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationNasjonaliteterProps>(
      clonedValidation, namespace, validateNasjonaliteter, {
        statsborgerskaper,
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const setLand = (land: string, index: number) => {
    if (index < 0) {
      _setNewStatsborgerskap({
        ..._newStatsborgerskap,
        land: land.trim()
      })
      _resetValidation(namespace + '-land')
      return
    }
    _setEditStatsborgerskap({
      ..._editStatsborgerskap,
      land: land.trim()
    })
    if (validation[namespace + getIdx(index) + '-land']) {
      dispatch(resetValidation(namespace + getIdx(index) + '-land'))
    }
  }

  const onCloseEdit = (namespace: string) => {
    _setEditStatsborgerskap(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewStatsborgerskap(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (s: Statsborgerskap, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditStatsborgerskap(s)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationNasjonalitetProps>(
      clonedValidation, namespace, validateNasjonalitet, {
        statsborgerskap: _editStatsborgerskap,
        statsborgerskaper,
        index: _editIndex,
        personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editStatsborgerskap))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removedStatsborgerskap: Statsborgerskap) => {
    const newStatsborgerskaper: Array<Statsborgerskap> = _.reject(statsborgerskaper,
      (s: Statsborgerskap) => _.isEqual(removedStatsborgerskap, s))
    dispatch(updateReplySed(target, newStatsborgerskaper))
    standardLogger('svarsed.editor.nasjonaliteter.remove')
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      statsborgerskap: _newStatsborgerskap,
      statsborgerskaper,
      personName
    })
    if (!!_newStatsborgerskap && valid) {
      let newStatsborgerskaper: Array<Statsborgerskap> | undefined = _.cloneDeep(statsborgerskaper)
      if (_.isNil(newStatsborgerskaper)) {
        newStatsborgerskaper = []
      }
      newStatsborgerskaper.push(_newStatsborgerskap)
      dispatch(updateReplySed(target, newStatsborgerskaper))
      standardLogger('svarsed.editor.nasjonaliteter.add')
      onCloseNew()
    }
  }

  const renderRow = (statsborgerskap: Statsborgerskap | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _statsborgerskap = index < 0 ? _newStatsborgerskap : (inEditMode ? _editStatsborgerskap : statsborgerskap)
    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getId(statsborgerskap)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow>
          <Column>
            {inEditMode
              ? (
                <CountryDropdown
                  ariaLabel={t('label:land')}
                  label={t('label:land')}
                  hideLabel={index >= 0}
                  closeMenuOnSelect
                  data-testid={_namespace + '-land'}
                  error={_v[_namespace + '-land']?.feilmelding}
                  flagWave
                  id={_namespace + '-land'}
                  countryCodeListName="statsborgerskap"
                  onOptionSelected={(e: Country) => setLand(e.value, index)}
                  required
                  values={_statsborgerskap?.land}
                />
                )
              : (
                <FormText
                  error={_v[_namespace + '-land']?.feilmelding}
                  id={_namespace + '-land'}
                >
                  <FlagPanel land={_statsborgerskap?.land}/>
                </FormText>
                )}
          </Column>
          <AlignEndColumn>
            <AddRemovePanel<Statsborgerskap>
              item={statsborgerskap}
              marginTop={index < 0}
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
        </AlignStartRow>
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
      {_.isEmpty(statsborgerskaper)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-satsborgerskap')}
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
                    {t('label:land') + ' *'}
                  </Label>
                </Column>
                <Column />
              </AlignStartRow>
            </PaddedHorizontallyDiv>
            <VerticalSeparatorDiv size='0.8' />
            {statsborgerskaper?.map(renderRow)}
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
              {t('el:button-add-new-x', { x: t('label:nasjonalitet').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
    </>
  )
}

export default Nasjonaliteter
