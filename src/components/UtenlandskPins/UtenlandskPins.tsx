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
  PileDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import CountryData, { Country, CountryFilter } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import classNames from 'classnames'
import AddRemovePanel2 from 'components/AddRemovePanel/AddRemovePanel2'
import Input from 'components/Forms/Input'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { Pin } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getIdx } from 'utils/namespace'
import { validateUtenlandskPin, ValidationUtenlandskPinProps } from './validation'

export interface UtenlandskPinProps {
  pins: Array<Pin> | undefined
  onPinsChanged: (newPins: Array<Pin>, whatChanged: string | undefined) => void
  namespace: string,
  loggingNamespace: string,
  limit?: number
  validation: Validation
}

const UtenlandskPins: React.FC<UtenlandskPinProps> = ({
  pins,
  onPinsChanged,
  namespace,
  loggingNamespace,
  limit = 99,
  validation
}: UtenlandskPinProps): JSX.Element => {
  const { t } = useTranslation()
  const countryData = CountryData.getCountryInstance('nb')
  const landUtenNorge = CountryFilter.STANDARD({ useUK: true })?.filter((it: string) => it !== 'NO')
  const [_newIdentifikator, _setNewIdentifikator] = useState<string>('')
  const [_newLand, _setNewLand] = useState<string>('')

  const [_editing, _setEditing] = useState<Array<number>>([])
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useLocalValidation<ValidationUtenlandskPinProps>({}, validateUtenlandskPin)

  const onUtenlandskeIdentifikatorChange = (newIdentifikator: string, index: number) => {
    if (index < 0) {
      _setNewIdentifikator(newIdentifikator.trim())
      _resetValidation(namespace + '-identifikator')
    } else {
      const newPins: Array<Pin> = _.cloneDeep(pins) as Array<Pin>
      newPins[index].identifikator = newIdentifikator.trim()
      onPinsChanged(newPins, namespace + '[' + index + ']-identifikator')
    }
  }

  const onUtenlandskeLandChange = (newLand: string, index: number) => {
    if (index < 0) {
      _setNewLand(newLand.trim())
      _resetValidation(namespace + '-land')
    } else {
      const newPins: Array<Pin> = _.cloneDeep(pins) as Array<Pin>
      newPins[index].land = newLand.trim()
      onPinsChanged(newPins, namespace + '[' + index + ']-land')
    }
  }

  const onRemove = (removedPin: Pin) => {
    const newUtenlandskePins: Array<Pin> = _.reject(pins, (pin: Pin) => _.isEqual(removedPin, pin))
    standardLogger(loggingNamespace + '.utenlandskpin.remove')
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
    const newPin: Pin = {
      land: _newLand,
      identifikator: _newIdentifikator
    }

    const valid: boolean = performValidation({
      pin: newPin,
      utenlandskePins: pins,
      namespace
    })
    if (valid) {
      let newUtenlandskePins: Array<Pin> = _.cloneDeep(pins) as Array<Pin>
      if (_.isNil(newUtenlandskePins)) {
        newUtenlandskePins = []
      }
      newUtenlandskePins = newUtenlandskePins.concat(newPin)
      onPinsChanged(newUtenlandskePins, undefined)
      standardLogger(loggingNamespace + '.utenlandskpin.add')
      onCancel()
    }
  }

  const renderRow = (utenlandskePin: Pin | null, index: number) => {
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )

    const editing: boolean = utenlandskePin === null || _.find(_editing, i => i === index) !== undefined

    return (
      <RepeatableRow className={classNames({
        new: index < 0,
        error: getErrorFor(index, 'identifikator') || getErrorFor(index, 'land')
      })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow>
          <Column>
            {editing
              ? (
                <CountrySelect
                  closeMenuOnSelect
                  data-testid={namespace + idx + '-land'}
                  error={getErrorFor(index, 'land')}
                  flagWave
                  id={namespace + idx + '-land'}
                  includeList={landUtenNorge}
                  hideLabel={index >= 0}
                  key={namespace + idx + '-land-' + (index < 0 ? _newLand : utenlandskePin?.land)}
                  label={t('label:land')}
                  menuPortalTarget={document.body}
                  onOptionSelected={(e: Country) => onUtenlandskeLandChange(e.value, index)}
                  values={index < 0 ? _newLand : utenlandskePin?.land}
                />
                )
              : (
                <FlexCenterDiv>
                  <Flag size='S' country={utenlandskePin?.land!} />
                  <HorizontalSeparatorDiv />
                  {countryData.findByValue(utenlandskePin?.land)?.label ?? utenlandskePin?.land}
                </FlexCenterDiv>
                )}
          </Column>
          <Column>
            {editing
              ? (
                <Input
                  error={getErrorFor(index, 'identifikator')}
                  id='identifikator'
                  key={namespace + idx + '-identifikator-' + (index < 0 ? _newIdentifikator : utenlandskePin?.identifikator)}
                  label={t('label:utenlandsk-pin')}
                  hideLabel={index >= 0}
                  namespace={namespace}
                  onChanged={(id: string) => onUtenlandskeIdentifikatorChange(id, index)}
                  value={index < 0 ? _newIdentifikator : utenlandskePin?.identifikator}
                />
                )
              : (
                <PileDiv id={namespace + idx + '-identifikator'}>
                  <BodyLong>{utenlandskePin?.identifikator}</BodyLong>
                  {getErrorFor(index, 'identifikator') && (
                    <div role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium navds-label'>
                      {getErrorFor(index, 'identifikator')}
                    </div>
                  )}
                </PileDiv>
                )}
          </Column>
          <AlignEndColumn>
            <AddRemovePanel2<Pin>
              getId={(p): string => p.land + '-' + p.identifikator}
              item={utenlandskePin}
              marginTop={index < 0}
              index={index}
              editing={editing}
              namespace={namespace}
              onRemove={onRemove}
              onAddNew={onAdd}
              onCancelNew={onCancel}
              onEditing={(p, index) => _setEditing(_editing.concat(index))}
              onCancelEditing={(p, index) => _setEditing(_.filter(_editing, i => i !== index))}
            />
          </AlignEndColumn>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <>
      {_.isEmpty(pins)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-utenlandskepin')}
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
                    {t('label:pin')}
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
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <>
            {(pins?.length ?? 0) <= limit && (
              <PaddedDiv>
                <Button
                  variant='tertiary'
                  onClick={() => _setSeeNewForm(true)}
                >
                  <AddCircle />
                  {t('el:button-add-new-x', { x: t('label:utenlandsk-pin')?.toLowerCase() })}
                </Button>
              </PaddedDiv>
            )}
          </>
          )}
    </>
  )
}

export default UtenlandskPins
