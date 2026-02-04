import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyLong, Box, Button, HStack, Label, Spacer, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import FormText from 'components/Forms/FormText'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { RepeatableBox, SpacedHr } from 'components/StyledComponents'
import { Option } from 'declarations/app'
import { ArbeidsgiverIdentifikator, ArbeidsgiverIdentifikatorType } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { hasNamespaceWithErrors } from 'utils/validation'
import { validateIdentifikator, ValidationIdentifikatorProps } from './validation'

export interface IdentifikatorProps {
  identifikatorer: Array<ArbeidsgiverIdentifikator> | undefined
  onIdentifikatorerChanged: (newIdentifikatorer: Array<ArbeidsgiverIdentifikator>) => void
  namespace: string
  personName?: string
  validation: Validation
}

const IdentifikatorFC: React.FC<IdentifikatorProps> = ({
  identifikatorer,
  onIdentifikatorerChanged,
  namespace,
  personName,
  validation
}: IdentifikatorProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const getId = (it: ArbeidsgiverIdentifikator | null | undefined): string => it?.type + '-' + it?.id

  const [_newIdentifikator, _setNewIdentifikator] = useState<ArbeidsgiverIdentifikator | undefined>(undefined)
  const [_editIdentifikator, _setEditIdentifikator] = useState<ArbeidsgiverIdentifikator | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationIdentifikatorProps>(validateIdentifikator, namespace)

  const allTypeOptions: Array<Option> = [
    { label: t('el:option-identifikator-organisasjonsnummer'), value: 'organisasjonsnummer' },
    { label: t('el:option-identifikator-trygd'), value: 'trygd' },
    { label: t('el:option-identifikator-skattemessig'), value: 'skattemessig' },
    { label: t('el:option-identifikator-ukjent'), value: 'ukjent' }
  ]

  const setId = (newId: string, index: number) => {
    if (index < 0) {
      _setNewIdentifikator({
        ..._newIdentifikator,
        id: newId.trim()
      } as ArbeidsgiverIdentifikator)
      _resetValidation(namespace + '-id')
      return
    }
    _setEditIdentifikator({
      ..._editIdentifikator,
      id: newId.trim()
    } as ArbeidsgiverIdentifikator)
    dispatch(resetValidation(namespace + getIdx(index) + '-id'))
  }

  const setType = (newType: ArbeidsgiverIdentifikatorType, index: number) => {
    if (index < 0) {
      _setNewIdentifikator({
        ..._newIdentifikator,
        type: newType.trim() as ArbeidsgiverIdentifikatorType
      } as ArbeidsgiverIdentifikator)
      _resetValidation(namespace + '-type')
      return
    }
    _setEditIdentifikator({
      ..._editIdentifikator,
      type: newType.trim() as ArbeidsgiverIdentifikatorType
    } as ArbeidsgiverIdentifikator)
    dispatch(resetValidation(namespace + getIdx(index) + '-type'))
  }
  const onCloseEdit = (namespace: string) => {
    _setEditIdentifikator(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewIdentifikator(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (ai: ArbeidsgiverIdentifikator, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditIdentifikator(ai)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationIdentifikatorProps>(
      clonedValidation, namespace, validateIdentifikator, {
        identifikator: _editIdentifikator,
        identifikatorer,
        index: _editIndex,
        personName
      })
    if (!!_editIdentifikator && !hasErrors) {
      const newIdentifikatorer: Array<ArbeidsgiverIdentifikator> = _.cloneDeep(identifikatorer) as Array<ArbeidsgiverIdentifikator>
      newIdentifikatorer[_editIndex!] = _editIdentifikator
      onIdentifikatorerChanged(newIdentifikatorer)
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removed: ArbeidsgiverIdentifikator) => {
    const newIdentifikatorer: Array<ArbeidsgiverIdentifikator> = _.reject(identifikatorer, (ai: ArbeidsgiverIdentifikator) => _.isEqual(removed, ai))
    onIdentifikatorerChanged(newIdentifikatorer)
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      identifikatorer,
      identifikator: _newIdentifikator,
      personName
    })
    if (!!_newIdentifikator && valid) {
      let newIdentifikatorer: Array<ArbeidsgiverIdentifikator> | undefined = _.cloneDeep(identifikatorer)
      if (_.isNil(newIdentifikatorer)) {
        newIdentifikatorer = []
      }
      newIdentifikatorer.push(_newIdentifikator)
      onIdentifikatorerChanged(newIdentifikatorer)
      onCloseNew()
    }
  }

  const renderRow = (identifikator: ArbeidsgiverIdentifikator | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _identifikator = index < 0 ? _newIdentifikator : (inEditMode ? _editIdentifikator : identifikator)
    return (
      <RepeatableBox
        id={'repeatablerow-' + _namespace}
        key={getId(identifikator)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
        padding="4"
      >
        <HStack  gap="4" align={inEditMode ? "start" : "center"}>
          {inEditMode
            ? (
              <Box width="30%">
                <Select
                  closeMenuOnSelect
                  data-testid={_namespace + '-type'}
                  error={_v[_namespace + '-type']?.feilmelding}
                  id={_namespace + '-type'}
                  label={t('label:type')}
                  menuPortalTarget={document.body}
                  onChange={(e: any) => setType(e.value, index)}
                  options={allTypeOptions}
                  required
                  value={_.find(allTypeOptions, b => b.value === _identifikator?.type)}
                  defaultValue={_.find(allTypeOptions, b => b.value === _identifikator?.type)}
                />
              </Box>
              )
            : (
              <FormText
                error={_v[_namespace + '-type']?.feilmelding}
                id={_namespace + '-type'}
              >
                <HStack gap="2" align="start">
                  <Label>{t('label:type') + ':'}</Label>
                  {_identifikator?.type}
                </HStack>
              </FormText>
              )}
          {inEditMode
            ? (
              <Box width="30%">
                <Input
                  error={_v[_namespace + '-id']?.feilmelding}
                  id='id'
                  label={t('label:inst-id')}
                  namespace={_namespace}
                  onChanged={(value: string) => setId(value, index)}
                  required
                  value={_identifikator?.id}
                />
              </Box>
              )
            : (
              <FormText
                error={_v[_namespace + '-id']?.feilmelding}
                id={_namespace + '-id'}
              >
                <HStack gap="2" align="start">
                  <Label>{t('label:inst-id') + ':'}</Label>
                  {_identifikator?.id}
                </HStack>
              </FormText>
              )
          }
          <Spacer/>
          <AddRemovePanel<ArbeidsgiverIdentifikator>
            item={identifikator}
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
        </HStack>
      </RepeatableBox>
    )
  }

  const hasError = validation[namespace]?.feilmelding

  return (
    <VStack>
      {_.isEmpty(identifikatorer)
        ? (
          <Box>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-ids')}
            </BodyLong>
            <SpacedHr />
          </Box>
          )
        : identifikatorer?.map(renderRow)}
      {hasError && (
        <div role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium navds-label'>
          {hasError}
        </div>
      )}
      {_newForm
        ? renderRow(null, -1)
        : (
          <Box>
            <Button
              variant='tertiary'
              data-testid={namespace + '-new'}
              onClick={() => _setNewForm(true)}
              icon={<PlusCircleIcon/>}
            >
              {t('el:button-add-new-x', { x: t('label:identifikator').toLowerCase() })}
            </Button>
          </Box>
          )}
    </VStack>
  )
}

export default IdentifikatorFC
