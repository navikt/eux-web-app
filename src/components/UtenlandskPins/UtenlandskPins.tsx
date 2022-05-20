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
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import FormText from 'components/Forms/FormText'
import Input from 'components/Forms/Input'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { Pin } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { hasNamespaceWithErrors } from 'utils/validation'
import { validateUtenlandskPin, ValidationUtenlandskPinProps } from './validation'

export interface UtenlandskPinProps {
  pins: Array<Pin> | undefined
  onPinsChanged: (newPins: Array<Pin>) => void
  namespace: string
  personName?: string
  loggingNamespace: string
  limit?: number
  validation: Validation
}

const UtenlandskPins: React.FC<UtenlandskPinProps> = ({
  pins,
  onPinsChanged,
  namespace,
  loggingNamespace,
  personName,
  limit = 99,
  validation
}: UtenlandskPinProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const countryData = CountryData.getCountryInstance('nb')
  const landUtenNorge = CountryFilter.STANDARD({ useUK: true })?.filter((it: string) => it !== 'NO')
  const getId = (p: Pin | null): string => p ? p.land + '-' + p.identifikator : 'new'

  const [_newPin, _setNewPin] = useState<Pin | undefined>(undefined)
  const [_editPin, _setEditPin] = useState<Pin | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationUtenlandskPinProps>(validateUtenlandskPin, namespace)

  const setUtenlandskeIdentifikator = (newIdentifikator: string, index: number) => {
    if (index < 0) {
      _setNewPin({
        ..._newPin,
        identifikator: newIdentifikator.trim()
      })
      _resetValidation(namespace + '-identifikator')
      return
    }
    _setEditPin({
      ..._editPin,
      identifikator: newIdentifikator.trim()
    })
    dispatch(resetValidation(namespace + getIdx(index) + '-identifikator'))
  }

  const setUtenlandskeLand = (newLand: string, index: number) => {
    if (index < 0) {
      _setNewPin({
        ..._newPin,
        land: newLand.trim()
      })
      _resetValidation(namespace + '-land')
      return
    }
    _setEditPin({
      ..._editPin,
      land: newLand.trim()
    })
    dispatch(resetValidation(namespace + getIdx(index) + '-land'))
  }

  const onCloseEdit = (namespace: string) => {
    _setEditPin(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewPin(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (pin: Pin, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditPin(pin)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const [valid, newValidation] = performValidation<ValidationUtenlandskPinProps>(
      validation, namespace, validateUtenlandskPin, {
        pin: _editPin,
        utenlandskePins: pins,
        index: _editIndex,
        personName
      })
    if (_editIndex !== undefined && !!_editPin && valid) {
      const newPins: Array<Pin> = _.cloneDeep(pins) as Array<Pin>
      newPins[_editIndex] = _editPin
      onPinsChanged(newPins)
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(newValidation))
    }
  }

  const onRemove = (removedPin: Pin) => {
    const newUtenlandskePins: Array<Pin> = _.reject(pins, (pin: Pin) => _.isEqual(removedPin, pin))
    onPinsChanged(newUtenlandskePins)
    standardLogger(loggingNamespace + '.utenlandskpin.remove')
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      pin: _newPin,
      utenlandskePins: pins,
      personName
    })
    if (!!_newPin && valid) {
      let newUtenlandskePins: Array<Pin> = _.cloneDeep(pins) as Array<Pin>
      if (_.isNil(newUtenlandskePins)) {
        newUtenlandskePins = []
      }
      newUtenlandskePins.push(_newPin)
      onPinsChanged(newUtenlandskePins)
      standardLogger(loggingNamespace + '.utenlandskpin.add')
      onCloseNew()
    }
  }

  const renderRow = (pin: Pin | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _pin = index < 0 ? _newPin : (inEditMode ? _editPin : pin)
    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getId(pin)}
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
                <CountrySelect
                  closeMenuOnSelect
                  data-testid={_namespace + '-land'}
                  error={_v[_namespace + '-land']?.feilmelding}
                  flagWave
                  id={_namespace + '-land'}
                  includeList={landUtenNorge}
                  hideLabel={false}
                  label={t('label:land')}
                  menuPortalTarget={document.body}
                  onOptionSelected={(e: Country) => setUtenlandskeLand(e.value, index)}
                  values={_pin?.land}
                />
                )
              : (
                <FormText
                  error={_validation[_namespace + '-land']?.feilmelding}
                  id={_namespace + '-land'}
                >
                  <FlexCenterDiv>
                    <Flag size='S' country={_pin?.land!} />
                    <HorizontalSeparatorDiv />
                    {countryData.findByValue(_pin?.land)?.label ?? _pin?.land}
                  </FlexCenterDiv>
                </FormText>
                )}
          </Column>
          <Column>
            {inEditMode
              ? (
                <Input
                  error={_v[_namespace + '-identifikator']?.feilmelding}
                  id='identifikator'
                  label={t('label:utenlandsk-pin')}
                  hideLabel={false}
                  namespace={_namespace}
                  onChanged={(id: string) => setUtenlandskeIdentifikator(id, index)}
                  value={_pin?.identifikator}
                />
                )
              : (
                <FormText
                  id={_namespace + '-identifikator'}
                  error={_v[_namespace + '-identifikator']?.feilmelding}
                >
                  <BodyLong>{_pin?.identifikator}</BodyLong>
                </FormText>
                )}
          </Column>
          <AlignEndColumn>
            <AddRemovePanel<Pin>
              item={pin}
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
                    {t('label:land')}
                  </Label>
                </Column>
                <Column>
                  <Label>
                    {t('label:pin')}
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
      {_newForm
        ? renderRow(null, -1)
        : (
          <>
            {(pins?.length ?? 0) < limit && (
              <PaddedDiv>
                <Button
                  variant='tertiary'
                  onClick={() => _setNewForm(true)}
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
