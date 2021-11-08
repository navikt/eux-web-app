
import { Add } from '@navikt/ds-icons'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import {
  ArbeidsgiverIdentifikator,
  ArbeidsgiverIdentifikatorType
} from 'declarations/sed'
import { Option } from 'declarations/app'
import { Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column,
  HighContrastFlatknapp,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { getIdx } from 'utils/namespace'
import { validateIdentifikator, ValidationIdentifikatorProps } from './validation'

const MyPaddedDiv = styled.div`
  padding: 0.5rem 0.5rem 0.5rem 2rem;
`

export interface IdentifikatorProps {
  highContrast: boolean
  identifikatorer: Array<ArbeidsgiverIdentifikator> | undefined
  onIdentifikatorerChanged: (newIdentifikatorer: Array<ArbeidsgiverIdentifikator>, whatChanged: string) => void
  namespace: string
  personName: string
  validation: Validation
  resetValidation: (fullnamespace: string) => void
}

const IdentifikatorFC: React.FC<IdentifikatorProps> = ({
  highContrast,
  identifikatorer,
  onIdentifikatorerChanged,
  namespace,
  personName,
  validation,
  resetValidation
}: IdentifikatorProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [_newType, _setNewType] = useState<ArbeidsgiverIdentifikatorType | undefined>(undefined)
  const [_newId, _setNewId] = useState<string | undefined>(undefined)

  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const getId = (it: ArbeidsgiverIdentifikator | null): string => it?.type + '-' + it?.id
  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<ArbeidsgiverIdentifikator>(getId)
  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationIdentifikatorProps>({}, validateIdentifikator)

  const allTypeOptions: Array<Option> = [
    { label: t('el:option-identifikator-registrering'), value: 'registrering' },
    { label: t('el:option-identifikator-trygd'), value: 'trygd' },
    { label: t('el:option-identifikator-skatt'), value: 'skatt' },
    { label: t('el:option-identifikator-ukjent'), value: 'ukjent' }
  ]

  const setId = (newId: string, index: number) => {
    if (index < 0) {
      _setNewId(newId.trim())
      _resetValidation(namespace + '-id')
    } else {
      const newIdentifikatorer: Array<ArbeidsgiverIdentifikator> = _.cloneDeep(identifikatorer) as Array<ArbeidsgiverIdentifikator>
      newIdentifikatorer[index].id = newId.trim()
      onIdentifikatorerChanged(newIdentifikatorer, 'id')
      if (validation[namespace + getIdx(index) + '-id']) {
        (resetValidation(namespace + getIdx(index) + '-id'))
      }
    }
  }

  const setType = (newType: ArbeidsgiverIdentifikatorType, index: number) => {
    if (index < 0) {
      _setNewType(newType.trim() as ArbeidsgiverIdentifikatorType)
      _resetValidation(namespace + '-type')
    } else {
      const newIdentifikatorer: Array<ArbeidsgiverIdentifikator> = _.cloneDeep(identifikatorer) as Array<ArbeidsgiverIdentifikator>
      newIdentifikatorer[index].type = newType
      onIdentifikatorerChanged(newIdentifikatorer, 'type')
      if (validation[namespace + getIdx(index) + '-type']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-type'))
      }
    }
  }

  const resetForm = () => {
    _setNewId(undefined)
    _setNewType(undefined)
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (index: number) => {
    const newIdentifikatorer: Array<ArbeidsgiverIdentifikator> = _.cloneDeep(identifikatorer) as Array<ArbeidsgiverIdentifikator>
    const deletedIdentifikatorer: Array<ArbeidsgiverIdentifikator> = newIdentifikatorer.splice(index, 1)
    if (deletedIdentifikatorer && deletedIdentifikatorer.length > 0) {
      removeFromDeletion(deletedIdentifikatorer[0])
    }
    onIdentifikatorerChanged(newIdentifikatorer, 'remove')
  }

  const onAdd = () => {
    const newIdentifikator: ArbeidsgiverIdentifikator = {
      id: _newId?.trim(),
      type: _newType
    } as ArbeidsgiverIdentifikator

    const valid: boolean = _performValidation({
      identifikatorer,
      identifikator: newIdentifikator,
      namespace: namespace,
      personName
    })
    if (valid) {
      let newIdentifikatorer: Array<ArbeidsgiverIdentifikator> | undefined = _.cloneDeep(identifikatorer)
      if (_.isNil(newIdentifikatorer)) {
        newIdentifikatorer = []
      }
      newIdentifikatorer.push(newIdentifikator)
      onIdentifikatorerChanged(newIdentifikatorer, 'add')
      resetForm()
    }
  }

  const renderRow = (identifikator: ArbeidsgiverIdentifikator | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(identifikator)
    const idx = getIdx(index)
    const getErrorFor = (el: string): string | undefined => {
      return index < 0
        ? _validation[namespace + idx + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    }

    const _type = index < 0 ? _newType : identifikator?.type
    return (
      <RepeatableRow
        className={classNames('slideInFromLeft', { new: index < 0 })}
        key={getId(identifikator)}
      >
        <AlignStartRow>
          <Column>
            <Select
              closeMenuOnSelect
              data-test-id={namespace + idx + '-type'}
              feil={getErrorFor('type')}
              highContrast={highContrast}
              id={namespace + idx + '-type'}
              key={namespace + idx + '-type-' + _type}
              label={t('label:type') + ' *'}
              menuPortalTarget={document.body}
              onChange={(e: any) => setType(e.value, index)}
              options={allTypeOptions}
              placeholder={t('el:placeholder-select-default')}
              value={_.find(allTypeOptions, b => b.value === _type)}
              defaultValue={_.find(allTypeOptions, b => b.value === _type)}
            />
          </Column>
          <Column>
            <Input
              feil={getErrorFor('id')}
              id='id'
              key={namespace + idx + '-id-' + (index < 0 ? _newId : identifikator?.id)}
              label={t('label:institusjonens-id') + ' *'}
              namespace={namespace + idx}
              onChanged={(value: string) => setId(value, index)}
              value={index < 0 ? _newId : identifikator?.id}
            />
          </Column>

          <Column>
            <AddRemovePanel
              namespace={namespace + idx}
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(identifikator)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(identifikator)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <MyPaddedDiv>
      <Undertittel>
        {t('label:institusjonens-id')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {_.isEmpty(identifikatorer)
        ? (
          <Normaltekst>
            {t('message:warning-no-ids')}
          </Normaltekst>
          )
        : identifikatorer?.map(renderRow)}
      <VerticalSeparatorDiv />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <Row className='slideInFromLeft'>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                data-test-id={namespace + '-new'}
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:identifikator').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
    </MyPaddedDiv>
  )
}

export default IdentifikatorFC
