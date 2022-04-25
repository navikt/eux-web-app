import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Heading } from '@navikt/ds-react'
import { AlignStartRow, Column, Row, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { resetValidation } from 'actions/validation'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { getIdx } from 'utils/namespace'
import { BarnaNameKeyMap } from '../Motregning'
import { validateKeyAndYtelse, ValidationKeyAndYtelseProps } from './validation'

const MyPaddedDiv = styled.div`
  padding: 0.5rem 0.5rem 0.5rem 2rem;
`

export interface KeyAndYtelse {
  // points to a full motregninger, like barn[1].motregninger[2] or familie.motregninger[0], if we are in an existing motregninger,
  // but if we are in a new-motregniger (draft), points to a barnaKey (fullKeys exist only when motregning is saved on replySed)
  fullKey: string
  ytelseNavn?: string // ytelseNavn, for barna
}

export interface KeyAndYtelseProps {
  keyAndYtelses: Array<KeyAndYtelse>
  onAdded: (barnKey: string, ytelseNavn: string) => void
  onRemoved: (fullKey: string) => void
  onYtelseChanged: (fullKey: string, ytelseNavn: string) => void
  onKeyChanged: (fullKey: string, barnKey: string) => void
  allBarnaNameKeys: BarnaNameKeyMap
  parentNamespace: string
  validation: Validation
}

const KeyAndYtelseFC: React.FC<KeyAndYtelseProps> = ({
  keyAndYtelses,
  onAdded,
  onRemoved,
  onYtelseChanged,
  onKeyChanged,
  allBarnaNameKeys,
  parentNamespace,
  validation
}: KeyAndYtelseProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const namespace = `${parentNamespace}-keyandytelse`

  const [_newBarnaKey, _setNewBarnaKey] = useState<string | undefined>(undefined)
  const [_newYtelseNavn, _setNewYtelseNavn] = useState<string | undefined>(undefined)

  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const getId = (it: KeyAndYtelse | null): string => it ? it.fullKey : 'new-keyandyelse'
  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<KeyAndYtelse>(getId)
  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationKeyAndYtelseProps>({}, validateKeyAndYtelse)

  const setKey = (newBarnaKey: string, index: number) => {
    if (index < 0) {
      _setNewBarnaKey(newBarnaKey.trim())
      _resetValidation(namespace + '-key')
    } else {
      onKeyChanged(keyAndYtelses[index].fullKey, newBarnaKey)
      if (validation[namespace + getIdx(index) + '-key']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-key'))
      }
    }
  }

  const setYtelseNavn = (newYtelseNavn: string, index: number) => {
    if (index < 0) {
      _setNewYtelseNavn(newYtelseNavn.trim())
      _resetValidation(namespace + '-ytelseNavn')
    } else {
      onYtelseChanged(keyAndYtelses[index].fullKey, newYtelseNavn.trim())
      if (validation[namespace + getIdx(index) + '-ytelseNavn']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-ytelseNavn'))
      }
    }
  }

  const resetForm = () => {
    _setNewBarnaKey(undefined)
    _setNewYtelseNavn(undefined)
    resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (index: number) => {
    removeFromDeletion(keyAndYtelses[index])
    onRemoved(keyAndYtelses[index].fullKey)
  }

  const onAdd = () => {
    const newKeyAndYtelse: KeyAndYtelse = {
      fullKey: _newBarnaKey?.trim() as string, // not really a full key, but it is only for isEmpty() validation
      ytelseNavn: _newYtelseNavn?.trim() as string
    }
    const valid: boolean = _performValidation({
      keyAndYtelse: newKeyAndYtelse,
      namespace
    })
    if (valid) {
      onAdded(_newBarnaKey!.trim(), _newYtelseNavn!.trim())
      onCancel()
    }
  }

  const fullKeyToBarnaKey = (fullKey: string): string => fullKey.match(/^barn\[\d+\]/)![0]

  const renderRow = (keyAndYtelse: KeyAndYtelse | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(keyAndYtelse)
    const idx = getIdx(index)
    const getErrorFor = (el: string): string | undefined => {
      return index < 0
        ? _validation[namespace + idx + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    }
    const allBarnaNameOptions = Object.keys(allBarnaNameKeys).map(key => ({
      label: allBarnaNameKeys[key],
      value: key,
      isDisabled: _.find(keyAndYtelses, it => it.fullKey.startsWith(key)) !== undefined
    }))

    const barnaKey = index < 0 ? _newBarnaKey : fullKeyToBarnaKey(keyAndYtelse!.fullKey)
    const ytelseNavn = (index < 0 ? _newYtelseNavn : keyAndYtelse?.ytelseNavn)
    return (
      <RepeatableRow
        className={classNames({ new: index < 0 })}
        key={getId(keyAndYtelse)}
      >
        <AlignStartRow>
          <Column>
            <Select
              closeMenuOnSelect
              data-testid={namespace + idx + '-key'}
              error={getErrorFor('key')}
              id={namespace + idx + '-key'}
              key={namespace + idx + '-key-' + barnaKey}
              label={t('label:barnets-navn') + ' *'}
              menuPortalTarget={document.body}
              onChange={(e: any) => setKey(e.value, index)}
              options={allBarnaNameOptions}
              value={_.find(allBarnaNameOptions, b => b.value === barnaKey)}
              defaultValue={_.find(allBarnaNameOptions, b => b.value === barnaKey)}
            />
          </Column>
          <Column>
            <Input
              error={getErrorFor('ytelseNavn')}
              id='ytelseNavn'
              key={namespace + idx + '-ytelseNavn-' + ytelseNavn}
              label={t('label:betegnelse-på-ytelse') + ' *'}
              namespace={namespace + idx}
              onChanged={(value: string) => setYtelseNavn(value, index)}
              value={ytelseNavn}
            />
          </Column>
          <Column>
            <AddRemovePanel
              namespace={namespace + idx}
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(keyAndYtelse)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(keyAndYtelse)}
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
      <Heading size='medium'>
        {t('label:barna-og-betegnelse-på-ytelse')}
      </Heading>
      <VerticalSeparatorDiv />
      {_.isEmpty(keyAndYtelses)
        ? (
          <BodyLong>
            {t('message:warning-no-barn')}
          </BodyLong>
          )
        : keyAndYtelses?.map(renderRow)}
      <VerticalSeparatorDiv />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <Row>
            <Column>
              <Button
                variant='tertiary'
                data-testid={namespace + '-new'}
                onClick={() => _setSeeNewForm(true)}
              >
                <AddCircle />
                {t('el:button-add-new-x', { x: t('label:betegnelse-på-ytelse').toLowerCase() })}
              </Button>
            </Column>
          </Row>
          )}
    </MyPaddedDiv>
  )
}

export default KeyAndYtelseFC
