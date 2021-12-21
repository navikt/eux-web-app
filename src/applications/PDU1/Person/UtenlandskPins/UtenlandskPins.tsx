import { Add } from '@navikt/ds-icons'
import { BodyLong, Button, Label } from '@navikt/ds-react'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { Validation } from 'declarations/types'
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
import { getIdx } from 'utils/namespace'
import { validateUtenlandskPin, ValidationUtenlandskPinProps } from './validation'

export interface UtenlandskPinProps {
  pins: Array<string> | undefined
  onPinsChanged: (newPins: Array<string>, whatChanged: string | undefined) => void
  namespace: string,
  validation: Validation
}

const UtenlandskPins: React.FC<UtenlandskPinProps> = ({
  pins,
  onPinsChanged,
  namespace,
  validation
}: UtenlandskPinProps): JSX.Element => {
  const { t } = useTranslation()
  const landUtenNorge = CountryFilter.STANDARD({ useUK: true })?.filter((it: string) => it !== 'NO')
  const [_newIdentifikator, _setNewIdentifikator] = useState<string>('')
  const [_newLand, _setNewLand] = useState<string>('')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<string>((p: string): string => p)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationUtenlandskPinProps>({}, validateUtenlandskPin)

  const onUtenlandskeIdentifikatorChange = (newIdentifikator: string, index: number) => {
    if (index < 0) {
      _setNewIdentifikator(newIdentifikator.trim())
      _resetValidation(namespace + '-identifikator')
    } else {
      const newPins: Array<string> = _.cloneDeep(pins) as Array<string>
      const els = newPins[index].split(/\s+/)
      els[1] = newIdentifikator.trim()
      newPins[index] = els.join(' ')
      onPinsChanged(newPins, namespace + '[' + index + ']-identifikator')
    }
  }

  const onUtenlandskeLandChange = (newLand: string, index: number) => {
    if (index < 0) {
      _setNewLand(newLand.trim())
      _resetValidation(namespace + '-land')
    } else {
      const newPins: Array<string> = _.cloneDeep(pins) as Array<string>
      const els = newPins[index].split(/\s+/)
      els[0] = newLand.trim()
      newPins[index] = els.join(' ')
      onPinsChanged(newPins, namespace + '[' + index + ']-land')
    }
  }

  const onRemove = (index: number) => {
    const newUtenlandskePins: Array<string> = _.cloneDeep(pins) as Array<string>
    const deletedUtenlandskePin: Array<string> = newUtenlandskePins.splice(index, 1)
    if (deletedUtenlandskePin && deletedUtenlandskePin.length > 0) {
      removeFromDeletion(deletedUtenlandskePin[0])
    }
    standardLogger('pdu1.editor.person.utenlandskpin.remove')
    onPinsChanged(newUtenlandskePins, undefined)
  }

  const resetForm = () => {
    _setNewIdentifikator('')
    _setNewLand('')
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onAdd = () => {
    const valid: boolean = performValidation({
      land: _newLand,
      identifikator: _newIdentifikator,
      utenlandskePins: pins,
      namespace: namespace
    })
    if (valid) {
      let newUtenlandskePins: Array<string> = _.cloneDeep(pins) as Array<string>
      if (_.isNil(newUtenlandskePins)) {
        newUtenlandskePins = []
      }
      newUtenlandskePins = newUtenlandskePins.concat(_newLand + ' ' + _newIdentifikator)
      onPinsChanged(newUtenlandskePins, undefined)
      standardLogger('pdu1.editor.person.utenlandskpin.add')
      onCancel()
    }
  }

  const renderRow = (utenlandskePin: string | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(utenlandskePin)
    const els = utenlandskePin?.split(/\s+/)
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
        >
          <Column>
            <Input
              error={getErrorFor(index, 'identifikator')}
              id='identifikator'
              key={namespace + idx + '-identifikator-' + (index < 0 ? _newIdentifikator : els?.[1])}
              label={t('label:utenlandsk-pin')}
              hideLabel={index >= 0}
              namespace={namespace}
              onChanged={(id: string) => onUtenlandskeIdentifikatorChange(id, index)}
              value={index < 0 ? _newIdentifikator : els?.[1]}
            />
          </Column>
          <Column>
            <CountrySelect
              closeMenuOnSelect
              data-test-id={namespace + idx + '-land'}
              error={getErrorFor(index, 'land')}
              flagWave
              id={namespace + idx + '-land'}
              includeList={landUtenNorge}
              hideLabel={index >= 0}
              key={namespace + idx + '-land-' + (index < 0 ? _newLand : els?.[0])}
              label={t('label:land')}
              menuPortalTarget={document.body}
              onOptionSelected={(e: Country) => onUtenlandskeLandChange(e.value, index)}
              values={index < 0 ? _newLand : els?.[0]}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop={index < 0}
              onBeginRemove={() => addToDeletion(utenlandskePin)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(utenlandskePin)}
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
    <>
      {_.isEmpty(pins)
        ? (
          <PaddedDiv>
            <BodyLong>
              {t('message:warning-no-utenlandskepin')}
            </BodyLong>
          </PaddedDiv>
          )
        : (
          <>
            <PaddedHorizontallyDiv>
              <AlignStartRow>
                <Column>
                  <Label>
                    {t('label:utenlandsk-pin')}
                  </Label>
                </Column>
                <Column>
                  <Label>
                    {t('label:land')}
                  </Label>
                </Column>
                <Column />
              </AlignStartRow>
            </PaddedHorizontallyDiv>
            <VerticalSeparatorDiv size='0.8' />
            {pins?.map(renderRow)}
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
                  {t('el:button-add-new-x', { x: t('label:utenlandsk-pin').toLowerCase() })}
                </Button>
              </Column>
            </Row>
          </PaddedDiv>
          )}
    </>
  )
}

export default UtenlandskPins
