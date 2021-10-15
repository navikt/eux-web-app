import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
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
import { BarnaNameKeyMap, Index } from './Motregning'
import { validateKeyAndYtelseNavn, ValidationKeyAndYtelseNavnProps } from './validationKeyAndYtelseNavn'

const MyPaddedDiv = styled.div`
  padding: 0.5rem 0.5rem 0.5rem 2rem;
`

export interface IKeyAndYtelseNavn {
  key: string
  ytelseNavn: string
}

interface KeyAndYtelseNavnProps {
  highContrast: boolean
  keyAndYtelseNavns: Array<IKeyAndYtelseNavn>
  onKeyAndYtelseNavnChanged: (a: Array<IKeyAndYtelseNavn>) => void
  allBarnaNameKeys: BarnaNameKeyMap
  selectedBarnaNames: Array<Index>
  parentNamespace: string
  validation: Validation
}

const KeyAndYtelseNavn: React.FC<KeyAndYtelseNavnProps> = ({
  highContrast,
  keyAndYtelseNavns,
  onKeyAndYtelseNavnChanged,
  allBarnaNameKeys,
  selectedBarnaNames,
  parentNamespace,
  validation
}: KeyAndYtelseNavnProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const namespace = `${parentNamespace}-keyandytelsenavn`

  const [_newKey, _setNewKey] = useState<string | undefined>(undefined)
  const [_newYtelseNavn, _setNewYtelseNavn] = useState<string | undefined>(undefined)

  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<IKeyAndYtelseNavn>((it: IKeyAndYtelseNavn): string => it.key)
  const [_validation, resetValidation, performValidation] = useValidation<ValidationKeyAndYtelseNavnProps>({}, validateKeyAndYtelseNavn)

  const setKey = (newKey: string, index: number) => {
    if (index < 0) {
      _setNewKey(newKey.trim())
      resetValidation(namespace + '-key')
    } else {
      const newKeyAndYtelseNavns: Array<IKeyAndYtelseNavn> = _.cloneDeep(keyAndYtelseNavns)
      newKeyAndYtelseNavns[index].key = newKey.trim()
      onKeyAndYtelseNavnChanged(newKeyAndYtelseNavns)
      if (validation[namespace + getIdx(index) + '-key']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-key'))
      }
    }
  }

  const setYtelseNavn = (newYtelseNavn: string, index: number) => {
    if (index < 0) {
      _setNewYtelseNavn(newYtelseNavn.trim())
      resetValidation(namespace + '-ytelseNavn')
    } else {
      const newKeyAndYtelseNavns: Array<IKeyAndYtelseNavn> = _.cloneDeep(keyAndYtelseNavns)
      newKeyAndYtelseNavns[index].ytelseNavn = newYtelseNavn.trim()
      onKeyAndYtelseNavnChanged(newKeyAndYtelseNavns)
      if (validation[namespace + getIdx(index) + '-ytelseNavn']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-ytelseNavn'))
      }
    }
  }

  const resetForm = () => {
    _setNewKey(undefined)
    _setNewYtelseNavn(undefined)
    resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemoved = (index: number) => {
    const newKeyAndYtelseNavns: Array<IKeyAndYtelseNavn> = _.cloneDeep(keyAndYtelseNavns)
    const deletedKeyAndYtelseNavns: Array<IKeyAndYtelseNavn> = newKeyAndYtelseNavns.splice(index, 1)
    if (deletedKeyAndYtelseNavns && deletedKeyAndYtelseNavns.length > 0) {
      removeFromDeletion(deletedKeyAndYtelseNavns[0])
    }
    onKeyAndYtelseNavnChanged(deletedKeyAndYtelseNavns)
  }

  const onAdd = () => {
    const newKeyAndYtelseNavn: IKeyAndYtelseNavn = {
      key: _newKey?.trim() as string,
      ytelseNavn: _newYtelseNavn?.trim() as string
    }

    const valid: boolean = performValidation({
      keyAndYtelseNavn: newKeyAndYtelseNavn,
      namespace: namespace
    })

    if (valid) {
      let newKeyAndYtelseNavns: Array<IKeyAndYtelseNavn> = _.cloneDeep(keyAndYtelseNavns)
      if (_.isNil(newKeyAndYtelseNavns)) {
        newKeyAndYtelseNavns = []
      }
      newKeyAndYtelseNavns.push(newKeyAndYtelseNavn)
      onKeyAndYtelseNavnChanged(newKeyAndYtelseNavns)
      resetForm()
    }
  }

  const renderRow = (keyAndYtelseNavn: IKeyAndYtelseNavn | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(keyAndYtelseNavn)
    const idx = getIdx(index)
    const getErrorFor = (el: string): string | undefined => {
      return index < 0
        ? _validation[namespace + '-keyandytelsenavn' + idx + '-' + el]?.feilmelding
        : validation[namespace + '-keyandytelsenavn' + idx + '-' + el]?.feilmelding
    }
    const selectedBarnaKeys: Array<string> = selectedBarnaNames?.map(k => k.barnaKey!) ?? []
    const allBarnaNameOptions = Object.keys(allBarnaNameKeys)
      .map(key => ({
        label: allBarnaNameKeys[key],
        value: key,
        isDisabled: selectedBarnaKeys.indexOf(key) >= 0
      }))

    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow>
          <Column>
            <Select
              closeMenuOnSelect
              data-test-id={namespace + idx + '-key'}
              feil={getErrorFor('key')}
              highContrast={highContrast}
              id={namespace + idx + '-key'}
              key={namespace + idx + '-navn-' + (index < 0 ? _newKey : keyAndYtelseNavn?.key)}
              label={t('label:barnets-navn') + ' *'}
              menuPortalTarget={document.body}
              onChange={(e: any) => setKey(e.value, index)}
              options={allBarnaNameOptions}
              placeholder={t('el:placeholder-select-default')}
              value={_.find(allBarnaNameOptions, b => b.value === (index < 0 ? _newKey : keyAndYtelseNavn?.key))}
              defaultValue={_.find(allBarnaNameOptions, b => b.value === (index < 0 ? _newKey : keyAndYtelseNavn?.key))}
            />
          </Column>
          <Column>
            <Input
              feil={getErrorFor('ytelseNavn')}
              id='ytelseNavn'
              key={namespace + idx + '-ytelseNavn-' + (index < 0 ? _newYtelseNavn : keyAndYtelseNavn?.ytelseNavn)}
              label={t('label:betegnelse-på-ytelse') + ' *'}
              namespace={namespace + idx}
              onChanged={(value: string) => setYtelseNavn(value, index)}
              value={index < 0 ? _newYtelseNavn : keyAndYtelseNavn?.ytelseNavn}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(keyAndYtelseNavn)}
              onConfirmRemove={() => onRemoved(index)}
              onCancelRemove={() => removeFromDeletion(keyAndYtelseNavn)}
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
        {t('label:barna-og-betegnelse-på-ytelse')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {_.isEmpty(keyAndYtelseNavns)
        ? (
          <Normaltekst>
            {t('message:warning-no-barn')}
          </Normaltekst>
          )
        : keyAndYtelseNavns?.map(renderRow)}
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
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:betegnelse-på-ytelse').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
    </MyPaddedDiv>
  )
}

export default KeyAndYtelseNavn
