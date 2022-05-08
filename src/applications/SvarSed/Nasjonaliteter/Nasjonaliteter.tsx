import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Label } from '@navikt/ds-react'
import Flag from '@navikt/flagg-ikoner'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  FlexCenterDiv,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PaddedHorizontallyDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import CountryData, { Country, CountryFilter } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel2 from 'components/AddRemovePanel/AddRemovePanel2'
import DateInput from 'components/Forms/DateInput'
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
import { isUSed } from 'utils/sed'
import {
  validateNasjonalitet,
  validateNasjonaliteter,
  ValidationNasjonaliteterProps,
  ValidationNasjonalitetProps
} from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Nasjonaliteter: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const countryData = CountryData.getCountryInstance('nb')
  const namespace = `${parentNamespace}-${personID}-nasjonaliteter`
  const target = `${personID}.personInfo.statsborgerskap`
  const statsborgerskaper: Array<Statsborgerskap> | undefined = _.get(replySed, target)

  const [_newStatsborgerskap, _setNewStatsborgerskap] = useState<Statsborgerskap | undefined>(undefined)
  const [_editStatsborgerskap, _setEditStatsborgerskap] = useState<Statsborgerskap | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_seeNewForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationNasjonalitetProps>(validateNasjonalitet, namespace)

  useUnmount(() => {
    const [, newValidation] = performValidation<ValidationNasjonaliteterProps>(validation, namespace, validateNasjonaliteter, {
      statsborgerskaper,
      personName
    })
    dispatch(setValidation(newValidation))
  })

  const onLandSelected = (land: string, index: number) => {
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

  const onFradatoChanged = (fraDato: string, index: number) => {
    if (index < 0) {
      _setNewStatsborgerskap({
        ..._newStatsborgerskap,
        fraDato: fraDato.trim()
      } as Statsborgerskap)
      _resetValidation(namespace + '-fraDato')
      return
    }
    _setEditStatsborgerskap({
      ..._editStatsborgerskap,
      fraDato: fraDato.trim()
    } as Statsborgerskap)
    if (validation[namespace + getIdx(index) + '-fraDato']) {
      dispatch(resetValidation(namespace + getIdx(index) + '-fraDato'))
    }
  }

  const onCloseEdit = () => {
    _setEditStatsborgerskap(undefined)
    _setEditIndex(undefined)
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
    const [valid, newValidation] = performValidation<ValidationNasjonalitetProps>(
      validation, namespace, validateNasjonalitet, {
        statsborgerskap: _editStatsborgerskap,
        statsborgerskaper,
        index: _editIndex,
        personName
      })
    if (valid) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editStatsborgerskap))
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
      onCloseEdit()
    } else {
      dispatch(setValidation(newValidation))
    }
  }

  const onRemove = (removedStatsborgerskap: Statsborgerskap) => {
    const newStatsborgerskaper: Array<Statsborgerskap> = _.reject(statsborgerskaper,
      (s: Statsborgerskap) => _.isEqual(removedStatsborgerskap, s))
    dispatch(updateReplySed(target, newStatsborgerskaper))
    standardLogger('svarsed.editor.nasjonaliteter.remove')
  }

  const onAddNew = () => {
    const valid = _performValidation({
      statsborgerskap: _newStatsborgerskap,
      statsborgerskaper,
      personName
    })
    if (!!_newStatsborgerskap && valid) {
      let newStatsborgerskaper = _.cloneDeep(statsborgerskaper)
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
    const idx = getIdx(index)
    const _namespace = namespace + idx
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _statsborgerskap = index < 0 ? _newStatsborgerskap : (inEditMode ? _editStatsborgerskap : statsborgerskap)
    return (
      <RepeatableRow
        className={classNames({
          new: index < 0,
          error: _v[_namespace + '-land'] || _v[_namespace + '-fraDato']
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow>
          <Column>
            {inEditMode
              ? (
                <CountrySelect
                  ariaLabel={t('label:land')}
                  label={t('label:land')}
                  hideLabel={false}
                  closeMenuOnSelect
                  data-testid={_namespace + '-land'}
                  error={_v[_namespace + '-land']?.feilmelding}
                  flagWave
                  key={_namespace + '-land' + _statsborgerskap?.land}
                  id={_namespace + '-land'}
                  includeList={CountryFilter.STANDARD({})}
                  menuPortalTarget={document.body}
                  onOptionSelected={(e: Country) => onLandSelected(e.value, index)}
                  required
                  values={_statsborgerskap?.land}
                />
                )
              : (
                <FormText error={_v[_namespace + '-land']}>
                  <FlexCenterDiv>
                    <Flag size='S' country={_statsborgerskap?.land!} />
                    <HorizontalSeparatorDiv />
                    {countryData.findByValue(_statsborgerskap?.land)?.label ?? _statsborgerskap?.land}
                  </FlexCenterDiv>
                </FormText>
                )}
          </Column>
          {isUSed(replySed!) && (
            <Column>
              <DateInput
                ariaLabel={t('label:fra-dato')}
                error={_v[_namespace + 'fraDato']?.feilmelding}
                id='fraDato'
                key={_statsborgerskap?.fraDato}
                label={t('label:fra-dato')}
                hideLabel={false}
                namespace={namespace + idx}
                onChanged={(date: string) => onFradatoChanged(date, index)}
                required
                value={_statsborgerskap?.fraDato}
              />
            </Column>
          )}
          <AlignEndColumn>
            <AddRemovePanel2<Statsborgerskap>
              item={statsborgerskap}
              marginTop={inEditMode}
              index={index}
              inEditMode={inEditMode}
              onRemove={onRemove}
              onAddNew={onAddNew}
              onCancelNew={onCloseNew}
              onStartEdit={onStartEdit}
              onConfirmEdit={onSaveEdit}
              onCancelEdit={onCloseEdit}
            />
          </AlignEndColumn>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <>
      <VerticalSeparatorDiv size='2' />
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
                {isUSed(replySed!)
                  ? (
                    <Column>
                      <Label>
                        {t('label:fra-dato')}
                      </Label>
                    </Column>
                    )
                  : <Column />}
                <Column />
              </AlignStartRow>
            </PaddedHorizontallyDiv>
            <VerticalSeparatorDiv size='0.8' />
            {statsborgerskaper?.map(renderRow)}
          </>
          )}
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <PaddedDiv>
            <Button
              variant='tertiary'
              onClick={() => _setNewForm(true)}
            >
              <AddCircle />
              {t('el:button-add-new-x', { x: t('label:nasjonalitet').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
    </>
  )
}

export default Nasjonaliteter
