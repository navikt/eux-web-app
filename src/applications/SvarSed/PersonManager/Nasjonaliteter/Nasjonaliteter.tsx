import { Add } from '@navikt/ds-icons'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import DateInput from 'components/Forms/DateInput'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Statsborgerskap } from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import { Country, CountryFilter } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { Button, BodyLong, Detail, Heading } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  HorizontalSeparatorDiv,
  PaddedDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getIdx } from 'utils/namespace'
import { isUSed } from 'utils/sed'
import { validateNasjonalitet, ValidationNasjonalitetProps } from './validation'

const mapState = (state: State): PersonManagerFormSelector => ({
  validation: state.validation.status
})

const Nasjonaliteter: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    validation
  } = useSelector<State, PersonManagerFormSelector>(mapState)
  const dispatch = useDispatch()
  const target = `${personID}.personInfo.statsborgerskap`
  const statsborgerskaper: Array<Statsborgerskap> = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-nasjonaliteter`

  const [_newLand, _setNewLand] = useState<string | undefined>(undefined)
  const [_newFradato, _setNewFradato] = useState<string>('')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Statsborgerskap>((s: Statsborgerskap): string => s.land)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationNasjonalitetProps>({}, validateNasjonalitet)

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

  const resetForm = () => {
    _setNewLand(undefined)
    _setNewFradato('')
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (i: number) => {
    const newStatsborgerskaper = _.cloneDeep(statsborgerskaper)
    const deletedStatsborgerskaper: Array<Statsborgerskap> = newStatsborgerskaper.splice(i, 1)
    if (deletedStatsborgerskaper && deletedStatsborgerskaper.length > 0) {
      removeFromDeletion(deletedStatsborgerskaper[0])
    }
    dispatch(updateReplySed(target, newStatsborgerskaper))
    standardLogger('svarsed.editor.nasjonaliteter.remove')
  }

  const onAdd = () => {
    const newStatsborgerskap: Statsborgerskap = {
      land: _newLand || '',
      fraDato: _newFradato
    }
    const valid = performValidation({
      statsborgerskap: newStatsborgerskap,
      statsborgerskaper: statsborgerskaper,
      namespace: namespace,
      personName: personName
    })
    if (valid) {
      let newStatsborgerskaper = _.cloneDeep(statsborgerskaper)
      if (_.isNil(newStatsborgerskaper)) {
        newStatsborgerskaper = []
      }
      newStatsborgerskaper.push(newStatsborgerskap)
      dispatch(updateReplySed(target, newStatsborgerskaper))
      standardLogger('svarsed.editor.nasjonaliteter.add')
      onCancel()
    }
  }

  const renderRow = (statsborgerskap: Statsborgerskap | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(statsborgerskap)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )

    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.05) + 's' }}
        >
          <Column>
            <CountrySelect
              ariaLabel={t('label:nasjonalitet')}
              closeMenuOnSelect
              data-test-id={namespace + idx + '-land'}
              error={getErrorFor(index, 'land')}
              flagWave
              key={namespace + idx + '-land' + (index < 0 ? _newLand : statsborgerskap?.land)}
              id={namespace + idx + '-land'}
              includeList={CountryFilter.STANDARD({})}
              menuPortalTarget={document.body}
              onOptionSelected={(e: Country) => onLandSelected(e.value, index)}
              required
              values={index < 0 ? _newLand : statsborgerskap?.land}
            />
          </Column>
          {isUSed(replySed!) && (
            <Column>
              <DateInput
                ariaLabel={t('label:fra-dato')}
                error={getErrorFor(index, 'fraDato')}
                id='fraDato'
                key={index < 0 ? _newFradato : statsborgerskap?.fraDato}
                label=''
                namespace={namespace + idx}
                onChanged={(date: string) => onFradatoChanged(date, index)}
                required
                value={index < 0 ? _newFradato : statsborgerskap?.fraDato}
              />
            </Column>
          )}
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop={false}
              onBeginRemove={() => addToDeletion(statsborgerskap)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(statsborgerskap)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </RepeatableRow>
    )
  }

  return (
    <PaddedDiv key={namespace + '-div'}>
      <Heading size='small'>
        {t('label:nasjonalitet')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column>
          {!_.isEmpty(statsborgerskaper)
            ? (
              <Detail>
                {t('label:nasjonalitet') + ' *'}
              </Detail>
              )
            : (
              <BodyLong>
                {t('message:warning-no-satsborgerskap')}
              </BodyLong>
              )}
        </Column>
        {isUSed(replySed!)
          ? (
            <Column>
              <Detail>
                {t('label:fra-dato')}
              </Detail>
            </Column>
            )
          : <Column />}
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      {statsborgerskaper?.map(renderRow)}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <AlignStartRow>
            <Column>
              <Button
                variant='tertiary'
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:nasjonalitet').toLowerCase() })}
              </Button>

            </Column>
          </AlignStartRow>
          )}
    </PaddedDiv>
  )
}

export default Nasjonaliteter
