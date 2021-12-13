import { Add } from '@navikt/ds-icons'
import { BodyLong, Button, Heading, Label } from '@navikt/ds-react'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import { Country, CountryFilter } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import {
  AlignStartRow,
  Column,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PaddedHorizontallyDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getIdx } from 'utils/namespace'
import { validateStatsborgerskap, ValidationStatsborgerskapProps } from './validation'

const mapState = (state: State): PersonManagerFormSelector => ({
  validation: state.validation.status
})

const StatsborgerskapFC: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    validation
  } = useSelector<State, PersonManagerFormSelector>(mapState)
  const dispatch = useDispatch()
  const target = `${personID}.statsborgerskap`
  const statsborgerskaper: Array<string> | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-statsborgerskap`

  const [newStatsborgerskap, setNewStatsborgerskap] = useState<string | undefined>(undefined)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<string>((s: string): string => s)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationStatsborgerskapProps>({}, validateStatsborgerskap)

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
      statsborgerskaper: statsborgerskaper,
      namespace: namespace
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
        <AlignStartRow className={classNames('slideInFromLeft')}>
          <Column>
            <CountrySelect
              ariaLabel={t('label:statsborgerskap')}
              closeMenuOnSelect
              data-test-id={namespace + idx + '-statsborgerskap'}
              error={getErrorFor(index, 'statsborgerskap')}
              flagWave
              key={namespace + idx + '-statsborgerskap' + (index < 0 ? newStatsborgerskap : statsborgerskap)}
              id={namespace + idx + '-statsborgerskap'}
              label={t('label:land')}
              hideLabel={index >= 0}
              includeList={CountryFilter.STANDARD}
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
      <PaddedDiv>
        <Heading size='medium'>
          {t('label:statsborgerskap')}
        </Heading>
      </PaddedDiv>
      <VerticalSeparatorDiv />
      {_.isEmpty(statsborgerskaper)
        ? (
          <PaddedDiv>
            <AlignStartRow>
              <Column>
                <BodyLong>
                  {t('message:warning-no-satsborgerskap')}
                </BodyLong>
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv />
          </PaddedDiv>
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
          <PaddedDiv>
            <Row>
              <Column>
                <Button
                  variant='tertiary'
                  onClick={() => _setSeeNewForm(true)}
                >
                  <Add />
                  <HorizontalSeparatorDiv size='0.5' />
                  {t('el:button-add-new-x', { x: t('label:statsborgerskap').toLowerCase() })}
                </Button>

              </Column>
            </Row>
          </PaddedDiv>
          )}
    </div>
  )
}

export default StatsborgerskapFC
