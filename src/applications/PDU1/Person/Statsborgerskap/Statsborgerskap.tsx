import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Label } from '@navikt/ds-react'
import { resetValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import useAddRemove from 'hooks/useAddRemove'
import useLocalValidation from 'hooks/useLocalValidation'
import { Country, CountryFilter } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import {
  AlignStartRow,
  Column,
  PaddedHorizontallyDiv,
  Row,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import { validateStatsborgerskap, ValidationStatsborgerskapProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const StatsborgerskapFC: React.FC<MainFormProps> = ({
  parentNamespace,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target = 'bruker.statsborgerskap'
  const statsborgerskaper: Array<string> | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-statsborgerskap`

  const [newStatsborgerskap, setNewStatsborgerskap] = useState<string | undefined>(undefined)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<string>((s: string): string => s)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useLocalValidation<ValidationStatsborgerskapProps>(validateStatsborgerskap, namespace)

  const onStatsborgerskapSelected = (newStatsborgerskap: string, index: number) => {
    if (index < 0) {
      setNewStatsborgerskap(newStatsborgerskap.trim())
      _resetValidation(namespace + '-statsborgerskap')
    } else {
      dispatch(updateReplySed(`${target}[${index}]`, newStatsborgerskap.trim()))
      if (validation[namespace + getIdx(index) + '-statsborgerskap']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-statsborgerskap'))
      }
    }
  }

  const resetForm = () => {
    setNewStatsborgerskap(undefined)
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (i: number) => {
    const newStatsborgerskaper = _.cloneDeep(statsborgerskaper)
    const deletedStatsborgerskaper: Array<string> = newStatsborgerskaper!.splice(i, 1)
    if (deletedStatsborgerskaper && deletedStatsborgerskaper.length > 0) {
      removeFromDeletion(deletedStatsborgerskaper[0])
    }
    dispatch(updateReplySed(target, newStatsborgerskaper))
    standardLogger('pdu1.editor.statsborgerskap.remove')
  }

  const onAdd = () => {
    const valid = performValidation({
      statsborgerskap: newStatsborgerskap!,
      statsborgerskaper
    })
    if (valid) {
      let newStatsborgerskaper : Array<string> | undefined = _.cloneDeep(statsborgerskaper)
      if (_.isNil(newStatsborgerskaper)) {
        newStatsborgerskaper = []
      }
      newStatsborgerskaper.push(newStatsborgerskap!)
      dispatch(updateReplySed(target, newStatsborgerskaper))
      standardLogger('pdu1.editor.statsborgerskap.add')
      onCancel()
    }
  }

  const renderRow = (statsborgerskap: string | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(statsborgerskap)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )

    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow>
          <Column>
            <CountrySelect
              ariaLabel={t('label:statsborgerskap')}
              closeMenuOnSelect
              data-testid={namespace + idx + '-statsborgerskap'}
              error={getErrorFor(index, 'statsborgerskap')}
              flagWave
              key={namespace + idx + '-statsborgerskap' + (index < 0 ? newStatsborgerskap : statsborgerskap)}
              id={namespace + idx + '-statsborgerskap'}
              label={t('label:land')}
              hideLabel={index >= 0}
              includeList={CountryFilter.STANDARD({ useUK: true })}
              menuPortalTarget={document.body}
              onOptionSelected={(e: Country) => onStatsborgerskapSelected(e.value, index)}
              required
              values={(index < 0 ? newStatsborgerskap : statsborgerskap)}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop={index < 0}
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
    <div key={namespace + '-div'}>
      {_.isEmpty(statsborgerskaper)
        ? (
          <PaddedHorizontallyDiv>
            <AlignStartRow>
              <Column>
                <BodyLong>
                  {t('message:warning-no-satsborgerskap')}
                </BodyLong>
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv />
          </PaddedHorizontallyDiv>
          )
        : (
          <>
            <PaddedHorizontallyDiv>
              <AlignStartRow>
                <Column>
                  <Label>
                    {t('label:land')}
                  </Label>
                </Column>
              </AlignStartRow>
            </PaddedHorizontallyDiv>
            <VerticalSeparatorDiv size='0.8' />
            {statsborgerskaper?.map(renderRow)}
          </>
          )}
      <VerticalSeparatorDiv />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <PaddedHorizontallyDiv>
            <Row>
              <Column>
                <Button
                  variant='tertiary'
                  onClick={() => _setSeeNewForm(true)}
                >
                  <AddCircle />
                  {t('el:button-add-new-x2', { x: t('label:statsborgerskap').toLowerCase() })}
                </Button>

              </Column>
            </Row>
          </PaddedHorizontallyDiv>
          )}
    </div>
  )
}

export default StatsborgerskapFC
