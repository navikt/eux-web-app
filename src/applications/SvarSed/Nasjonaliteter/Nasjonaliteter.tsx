import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Label } from '@navikt/ds-react'
import Flag from '@navikt/flagg-ikoner'
import {
  AlignEndColumn,
  AlignStartRow,
  Column, FlexCenterDiv, HorizontalSeparatorDiv,
  PaddedDiv,
  PaddedHorizontallyDiv,
  PileDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import CountryData, { Country, CountryFilter } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel2 from 'components/AddRemovePanel/AddRemovePanel2'
import DateInput from 'components/Forms/DateInput'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Statsborgerskap } from 'declarations/sed'
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
  const target = `${personID}.personInfo.statsborgerskap`
  const statsborgerskaper: Array<Statsborgerskap> | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-nasjonaliteter`
  const getId = (s: Statsborgerskap): string => s.land

  const [_newLand, _setNewLand] = useState<string | undefined>(undefined)
  const [_newFradato, _setNewFradato] = useState<string>('')

  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_editing, _setEditing] = useState<Array<number>>([])
  const [_seeEditButton, _setSeeEditButton] = useState<number | undefined>(undefined)
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
      _setNewLand(land.trim())
      _resetValidation(namespace + '-land')
    } else {
      dispatch(updateReplySed(`${target}[${index}].land`, land.trim()))
      if (validation[namespace + getIdx(index) + '-land']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-land'))
      }
    }
  }

  const onFradatoChanged = (fraDato: string, index: number) => {
    if (index < 0) {
      _setNewFradato(fraDato.trim())
      _resetValidation(namespace + '-fraDato')
    } else {
      dispatch(updateReplySed(`${target}[${index}].fraDato`, fraDato.trim()))
      if (validation[namespace + getIdx(index) + '-fraDato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-fraDato'))
      }
    }
  }

  const resetForm = () => {
    _setNewLand(undefined)
    _setNewFradato('')
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (removedStatsborgerskap: Statsborgerskap) => {
    const newStatsborgerskaper: Array<Statsborgerskap> = _.reject(statsborgerskaper,
      (s: Statsborgerskap) => _.isEqual(removedStatsborgerskap, s))
    dispatch(updateReplySed(target, newStatsborgerskaper))
    standardLogger('svarsed.editor.nasjonaliteter.remove')
  }

  const onAdd = () => {
    const statsborgerskap: Statsborgerskap = {
      land: _newLand,
      fraDato: _newFradato
    } as Statsborgerskap
    const valid = _performValidation({
      statsborgerskap,
      statsborgerskaper,
      personName
    })
    if (valid) {
      let newStatsborgerskaper = _.cloneDeep(statsborgerskaper)
      if (_.isNil(newStatsborgerskaper)) {
        newStatsborgerskaper = []
      }
      newStatsborgerskaper.push(statsborgerskap)
      dispatch(updateReplySed(target, newStatsborgerskaper))
      standardLogger('svarsed.editor.nasjonaliteter.add')
      onCancel()
    }
  }

  const renderRow = (statsborgerskap: Statsborgerskap | null, index: number) => {

    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
    const editing: boolean = statsborgerskap === null || _.find(_editing, i => i === index) !== undefined
    const _land: string | undefined = index < 0 ? _newLand : statsborgerskap?.land
    return (
      <RepeatableRow
        onMouseEnter={() => _setSeeEditButton(index)}
        onMouseLeave={() => _setSeeEditButton(undefined)}
        className={classNames({ new: index < 0 })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow>
          <Column>
            {editing
              ? (
                <CountrySelect
                  ariaLabel={t('label:land')}
                  label={t('label:land')}
                  hideLabel={index >= 0}
                  closeMenuOnSelect
                  data-testid={namespace + idx + '-land'}
                  error={getErrorFor(index, 'land')}
                  flagWave
                  key={namespace + idx + '-land' + _land}
                  id={namespace + idx + '-land'}
                  includeList={CountryFilter.STANDARD({})}
                  menuPortalTarget={document.body}
                  onOptionSelected={(e: Country) => onLandSelected(e.value, index)}
                  required
                  values={_land}
                />
              )
              : (
                <PileDiv>
                  <FlexCenterDiv>
                    {!!_land && <Flag size='S' country={_land} />}
                    <HorizontalSeparatorDiv />
                    {countryData.findByValue(_land)?.label ?? _land}
                  </FlexCenterDiv>
                  {getErrorFor(index, 'land') && (
                    <div role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium navds-label'>
                      {getErrorFor(index, 'land')}
                    </div>
                  )}
                </PileDiv>
              )}
          </Column>
          {isUSed(replySed!) && (
            <Column>
              <DateInput
                ariaLabel={t('label:fra-dato')}
                error={getErrorFor(index, 'fraDato')}
                id='fraDato'
                key={index < 0 ? _newFradato : statsborgerskap?.fraDato}
                label={t('label:fra-dato')}
                hideLabel={index >= 0}
                namespace={namespace + idx}
                onChanged={(date: string) => onFradatoChanged(date, index)}
                required
                value={index < 0 ? _newFradato : statsborgerskap?.fraDato}
              />
            </Column>
          )}
          <AlignEndColumn>
            <AddRemovePanel2<Statsborgerskap>
              getId={getId}
              item={statsborgerskap}
              marginTop={index < 0}
              index={index}
              editing={editing}
              namespace={namespace}
              onRemove={onRemove}
              onAddNew={onAdd}
              onCancelNew={onCancel}
              seeEditButton={_seeEditButton === index}
              onEditing={(s, index) => _setEditing(_editing.concat(index))}
              onCancelEditing={(s, index) => _setEditing(_.filter(_editing, i => i !== index))}
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
              onClick={() => _setSeeNewForm(true)}
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
