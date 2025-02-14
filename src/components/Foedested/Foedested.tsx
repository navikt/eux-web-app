import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Label } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  PaddedDiv,
  PaddedHorizontallyDiv,
  PaddedRow,
  Row,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import {Country} from '@navikt/land-verktoy'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { Foedested } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useLocalValidation from "../../hooks/useLocalValidation";
import performValidation from "../../utils/performValidation";
import {resetValidation, setValidation} from "../../actions/validation";
import {validateFoedested, ValidationFoedestedProps} from "./validation";
import {useAppDispatch} from "../../store";
import CountryDropdown from "../CountryDropdown/CountryDropdown";
import FlagPanel from "../FlagPanel/FlagPanel";

export interface FoedestedProps {
  foedested: Foedested | undefined
  onFoedestedChanged: (newFoedested: Foedested) => void
  namespace: string,
  personName?: string
  loggingNamespace: string,
  validation: Validation
}

const FoedestedFC: React.FC<FoedestedProps> = ({
  loggingNamespace,
  foedested,
  onFoedestedChanged,
  namespace,
  personName,
  validation
}: FoedestedProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const [_newFoedested, _setNewFoedested] = useState<Foedested | undefined>(undefined)
  const [_editFoedested, _setEditFoedested] = useState<Foedested | undefined>(undefined)

  const [_editMode, _setEditMode] = useState<boolean>(false)
  const [_newForm, _setNewForm] = useState<boolean>(false)

  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationFoedestedProps>(validateFoedested, namespace)

  const emptyFoedsted: boolean = (
    _.isEmpty(foedested?.by?.trim()) &&
    _.isEmpty(foedested?.region?.trim()) &&
    _.isEmpty(foedested?.landkode?.trim())
  )

  const setBy = (by: string, index: number) => {
    if (index < 0) {
      _setNewFoedested({
        ..._newFoedested,
        by: by.trim()
      })
      return
    }
    _setEditFoedested({
      ..._editFoedested,
      by: by.trim()
    })
  }

  const setRegion = (region: string, index: number) => {
    if (index < 0) {
      _setNewFoedested({
        ..._newFoedested,
        region: region.trim()
      })
      return
    }
    _setEditFoedested({
      ..._editFoedested,
      region: region.trim()
    })
  }

  const setLand = (land: string, index: number) => {
    if (index < 0) {
      _setNewFoedested({
        ..._newFoedested,
        landkode: land.trim()
      })
      _resetValidation(namespace + '-land')
      return
    }
    _setEditFoedested({
      ..._editFoedested,
      landkode: land.trim()
    })
    dispatch(resetValidation(namespace + '-land'))
  }

  const onCloseEdit = () => {
    _setEditFoedested(undefined)
    _setEditMode(false)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewFoedested(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (f: Foedested) => {
    _setEditFoedested(f)
    _setEditMode(true)
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationFoedestedProps>(
      clonedValidation, namespace, validateFoedested, {
        foedested: _editFoedested,
        personName
      })
    if(!hasErrors){
      onFoedestedChanged(_editFoedested ?? {} as Foedested)
      onCloseEdit()
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = () => {
    standardLogger(loggingNamespace + '.foedested.remove')
    onFoedestedChanged({})
  }

  const onAddNew = () => {
    // this one does not have validation.
    const valid: boolean = _performValidation({
      foedested: _newFoedested,
      personName
    })
    if (!!_newFoedested && valid){
      standardLogger(loggingNamespace + '.foedested.add')
      onFoedestedChanged(_newFoedested ?? {} as Foedested)
      onCloseNew()
    }
  }

  const renderRow = (foedested: Foedested | null, index: number) => {
    const inEditMode = index < 0 || _editMode
    const _foedested = index < 0 ? _newFoedested : (inEditMode ? _editFoedested : foedested)
    const _v: Validation = index < 0 ? _validation : validation

    return (
      <RepeatableRow
        id={'repeatablerow-' + namespace}
        className={classNames({
          new: index < 0
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <Row>
          <Column>
            {inEditMode
              ? (
                <Input
                  error={_v[namespace + '-by']?.feilmelding}
                  id='by'
                  label={t('label:by')}
                  hideLabel={index >= 0}
                  namespace={namespace}
                  onChanged={(newBy: string) => setBy(newBy, index)}
                  value={_foedested?.by}
                />
                )
              : (
                <BodyLong id={namespace + '-by'}>
                  {_foedested?.by}
                </BodyLong>
                )}
          </Column>
          <Column>
            {inEditMode
              ? (
                <Input
                  error={_v[namespace + '-region']?.feilmelding}
                  id='region'
                  label={t('label:region')}
                  hideLabel={index >= 0}
                  namespace={namespace}
                  onChanged={(newRegion: string) => setRegion(newRegion, index)}
                  value={_foedested?.region}
                />
                )
              : (
                <BodyLong id={namespace + '-region'}>{_foedested?.region}</BodyLong>
                )}
          </Column>
          <Column>
            {inEditMode
              ? (
                <CountryDropdown
                  dataTestId={namespace + '-land'}
                  error={_v[namespace + '-land']?.feilmelding}
                  id={namespace + '-land'}
                  label={t('label:land')}
                  hideLabel={index >= 0}
                  onOptionSelected={(e: Country) => setLand(e.value3, index)}
                  values={_foedested?.landkode}
                  countryCodeListName="verdensLandHistorisk"
                />
                )
              :
                <FlagPanel land={_foedested?.landkode} id={namespace + '-land'}/>
            }
          </Column>
        </Row>
        <PaddedRow size='0.5'>
          <Column style={{ minHeight: '2.5rem' }} />
          <AlignEndColumn>
            <AddRemovePanel<Foedested>
              item={foedested}
              inEditMode={inEditMode}
              index={index}
              onRemove={onRemove}
              onAddNew={onAddNew}
              onCancelNew={onCloseNew}
              onStartEdit={onStartEdit}
              onConfirmEdit={onSaveEdit}
              onCancelEdit={onCloseEdit}
            />
          </AlignEndColumn>
        </PaddedRow>
      </RepeatableRow>
    )
  }

  return (
    <>
      {
        emptyFoedsted
          ? (
            <PaddedHorizontallyDiv>
              <SpacedHr />
              <BodyLong>
                {t('message:warning-no-foedested')}
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
                      {t('label:by')}
                    </Label>
                  </Column>
                  <Column>
                    <Label>
                      {t('label:region')}
                    </Label>
                  </Column>
                  <Column>
                    <Label>
                      {t('label:land')}
                    </Label>
                  </Column>
                </AlignStartRow>
              </PaddedHorizontallyDiv>
              <VerticalSeparatorDiv size='0.8' />
              {renderRow(foedested!, 0)}
            </>
            )
      }
      <VerticalSeparatorDiv />
      {_newForm
        ? renderRow(null, -1)
        : (
          <>
            {emptyFoedsted && (
              <PaddedDiv>
                <Button
                  variant='tertiary'
                  onClick={() => _setNewForm(true)}
                  icon={<PlusCircleIcon />}
                >
                  {t('el:button-add-x', { x: t('label:fødested')?.toLowerCase() })}
                </Button>
              </PaddedDiv>
            )}
          </>
          )}
    </>
  )
}

export default FoedestedFC
