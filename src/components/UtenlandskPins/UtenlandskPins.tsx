import { PlusCircleIcon } from '@navikt/aksel-icons';
import {BodyLong, Box, Button, HGrid, Label} from '@navikt/ds-react'
import { Country } from '@navikt/land-verktoy'
import { resetValidation, setValidation } from 'actions/validation'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import FormText from 'components/Forms/FormText'
import Input from 'components/Forms/Input'
import {RepeatableBox, SpacedHr} from 'components/StyledComponents'
import { Pin } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { hasNamespaceWithErrors } from 'utils/validation'
import { validateUtenlandskPin, ValidationUtenlandskPinProps } from './validation'
import CountryDropdown from "../CountryDropdown/CountryDropdown";
import FlagPanel from "../FlagPanel/FlagPanel";

export interface UtenlandskPinProps {
  pins: Array<Pin> | undefined
  onPinsChanged: (newPins: Array<Pin>) => void
  namespace: string
  personName?: string
  loggingNamespace?: string
  limit?: number
  validation: Validation
}

const UtenlandskPins: React.FC<UtenlandskPinProps> = ({
  pins,
  onPinsChanged,
  namespace,
  personName,
  limit = 99,
  validation
}: UtenlandskPinProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const getId = (p: Pin | null): string => p ? p.landkode + '-' + p.identifikator : 'new'

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
        landkode: newLand.trim()
      })
      _resetValidation(namespace + '-land')
      return
    }
    _setEditPin({
      ..._editPin,
      landkode: newLand.trim()
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
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationUtenlandskPinProps>(
      clonedValidation, namespace, validateUtenlandskPin, {
        pin: _editPin,
        utenlandskePins: pins,
        index: _editIndex,
        personName
      })
    if (_editIndex !== undefined && !!_editPin && !hasErrors) {
      const newPins: Array<Pin> = _.cloneDeep(pins) as Array<Pin>
      newPins[_editIndex] = _editPin
      onPinsChanged(newPins)
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removedPin: Pin) => {
    const newUtenlandskePins: Array<Pin> = _.reject(pins, (pin: Pin) => _.isEqual(removedPin, pin))
    onPinsChanged(newUtenlandskePins)
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
      onCloseNew()
    }
  }

  const renderRow = (pin: Pin | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _pin = index < 0 ? _newPin : (inEditMode ? _editPin : pin)
    return (
      <RepeatableBox
        id={'repeatablerow-' + _namespace}
        key={getId(pin)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
        padding="4"
      >
        <HGrid columns={3} gap="4" align="start">
          <>
            {inEditMode
              ? (
                <CountryDropdown
                  closeMenuOnSelect
                  data-testid={_namespace + '-land'}
                  error={_v[_namespace + '-land']?.feilmelding}
                  flagWave
                  id={_namespace + '-land'}
                  countryCodeListName="euEftaLand"
                  excludeNorway={true}
                  hideLabel={index >= 0}
                  label={t('label:land')}
                  menuPortalTarget={document.body}
                  onOptionSelected={(e: Country) => setUtenlandskeLand(e.value3, index)}
                  values={_pin?.landkode}
                />
                )
              : (
                <FormText
                  error={_validation[_namespace + '-land']?.feilmelding}
                  id={_namespace + '-land'}
                >
                  {_pin?.landkode
                    ? <FlagPanel land={_pin?.landkode}/>
                    : (
                      <></>
                      )
                  }

                </FormText>
                )}
          </>
          <>
            {inEditMode
              ? (
                <Input
                  error={_v[_namespace + '-identifikator']?.feilmelding}
                  id='identifikator'
                  label={t('label:utenlandsk-pin')}
                  hideLabel={index >= 0}
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
          </>
          <>
            <AddRemovePanel<Pin>
              item={pin}
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
          </>
        </HGrid>
      </RepeatableBox>
    )
  }

  return (
    <>
      {_.isEmpty(pins)
        ? (
          <Box>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-utenlandskepin')}
            </BodyLong>
            <SpacedHr />
          </Box>
          )
        : (
          <>
            <Box
              marginInline="4"
            >
              <HGrid columns={3} gap="4">
                <Label>
                  {t('label:land')}
                </Label>
                <Label>
                  {t('label:pin')}
                </Label>
              </HGrid>
            </Box>
            {pins?.map(renderRow)}
          </>
          )}
      {_newForm
        ? renderRow(null, -1)
        : (
          <>
            {(pins?.length ?? 0) < limit && (
              <Box>
                <Button
                  variant='tertiary'
                  onClick={() => _setNewForm(true)}
                  icon={<PlusCircleIcon/>}
                >
                  {t('el:button-add-new-x', { x: t('label:utenlandsk-pin')?.toLowerCase() })}
                </Button>
              </Box>
            )}
          </>
          )}
    </>
  )
}

export default UtenlandskPins
