import { AddCircle, Cancel, Delete, Edit, SuccessStroke } from '@navikt/ds-icons'
import classNames from 'classnames'
import { Labels } from 'declarations/app'
import { Button, BodyLong } from '@navikt/ds-react'
import { HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export interface AddRemovePanelProps<T> {
  item: T | null
  index: number
  labels?: Labels
  marginTop?: boolean
  onAddNew: () => void
  inEditMode?: boolean
  onStartEdit: (item: T, index: number) => void
  onConfirmEdit?: (item: T, index: number) => void
  onCancelEdit: (item: T, index: number) => void
  onCancelNew: () => void
  onRemove: (item: T) => void
}

const InlineFlexDiv = styled.div`
  display: inline-flex;
  align-items: flex-end;
`

const AddRemovePanel2 = <T extends any>({
  labels = {},
  item,
  index,
  marginTop = undefined,
  inEditMode = false,
  onStartEdit,
  onConfirmEdit,
  onCancelEdit,
  onRemove,
  onAddNew,
  onCancelNew
}: AddRemovePanelProps<T>): JSX.Element | null => {
  const { t } = useTranslation()

  const [inDeleteMode, setInDeleteMode] = useState<boolean>(false)

  const isNew = item === null
  const candidateForDeletion = isNew ? false : inDeleteMode
  const candidateForEdition = isNew ? false : inEditMode

  if (candidateForDeletion) {
    return (
      <InlineFlexDiv className={classNames('slideInFromRight', { nolabel: marginTop })}>
        <BodyLong style={{ whiteSpace: 'nowrap' }}>
          {labels?.areYouSure ?? t('label:er-du-sikker')}
        </BodyLong>
        <HorizontalSeparatorDiv size='0.5' />
        <Button
          size='small'
          variant='tertiary'
          onClick={() => onRemove(item!)}
        >
          {labels?.yes ?? t('label:ja')}
        </Button>
        <HorizontalSeparatorDiv size='0.5' />
        <Button
          size='small'
          variant='tertiary'
          onClick={() => setInDeleteMode(false)}
        >
          {labels?.no ?? t('label:nei')}
        </Button>
      </InlineFlexDiv>
    )
  }

  if (candidateForEdition) {
    return (
      <InlineFlexDiv className={classNames({ nolabel: marginTop })}>
        <HorizontalSeparatorDiv />
        <Button
          size='small'
          variant='tertiary'
          onClick={() => {
            onConfirmEdit!(item!, index)
          }}
        >
          <SuccessStroke />
          {labels?.ok ?? t('el:button-save')}
        </Button>
        <HorizontalSeparatorDiv />
        <Button
          size='small'
          variant='tertiary'
          onClick={() => {
            onCancelEdit(item!, index)
          }}
        >
          <Cancel />
          {labels?.cancel ?? t('el:button-cancel')}
        </Button>
      </InlineFlexDiv>
    )
  }

  if (isNew) {
    return (
      <InlineFlexDiv className={classNames({ nolabel: marginTop })}>
        <Button
          size='small'
          variant='tertiary'
          onClick={onAddNew}
        >
          <AddCircle />
          {labels?.add ?? t('el:button-add')}
        </Button>
        <HorizontalSeparatorDiv />
        <Button
          size='small'
          variant='tertiary'
          onClick={() => onCancelNew()}
        >
          <Cancel />
          {labels?.cancel ?? t('el:button-cancel')}
        </Button>
      </InlineFlexDiv>
    )
  }

  return (
    <InlineFlexDiv className={classNames('addremovepanel-buttons', { nolabel: marginTop })}>
      <Button
        size='small'
        variant='tertiary'
        onClick={() => {
          onStartEdit(item!, index)
        }}
      >
        <Edit />
        {labels?.edit ?? t('el:button-edit')}
      </Button>
      <HorizontalSeparatorDiv />
      <Button
        size='small'
        variant='tertiary'
        onClick={() => setInDeleteMode(true)}
      >
        <Delete />
        {labels?.remove ?? t('el:button-remove')}
      </Button>
    </InlineFlexDiv>
  )
}

export default AddRemovePanel2
