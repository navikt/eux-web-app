import { AddCircle, Cancel, Delete, Edit, SuccessStroke } from '@navikt/ds-icons'
import classNames from 'classnames'
import { Labels } from 'declarations/app'
import { Button, BodyLong } from '@navikt/ds-react'
import { HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import useAddRemove from 'hooks/useAddRemove'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export interface AddRemovePanelProps<T> {

  getId: (item: T) => string
  item: T | null
  index: number
  labels?: Labels
  marginTop?: boolean
  namespace?: string
  onAddNew: () => void
  editing: boolean
  onEditing: (item: T, index: number) => void
  onCancelEditing: (item: T, index: number) => void
  onCancelNew: () => void
  onRemove: (item: T) => void
}

const InlineFlexDiv = styled.div`
  display: inline-flex;
  align-items: center;
  margin-top: 0.5rem;
`

const AddRemovePanel2 = <T extends any>({
  labels = {},
  getId,
  item,
  index,
  marginTop = undefined,
  namespace = '',
  editing,
  onEditing,
  onCancelEditing,
  onRemove,
  onAddNew,
  onCancelNew

}: AddRemovePanelProps<T>): JSX.Element => {
  const { t } = useTranslation()

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<T>(getId)

  const isNew = index < 0
  const candidateForDeletion = isNew ? false : isInDeletion(item)
  const candidateForEdition = isNew ? false : editing

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
          data-testid={namespace + '-addremove-delete-yes'}
          onClick={() => onRemove(item!)}
        >
          {labels?.yes ?? t('label:ja')}
        </Button>
        <HorizontalSeparatorDiv size='0.5' />
        <Button
          size='small'
          variant='tertiary'
          data-testid={namespace + '-addremove-delete-no'}
          onClick={() => removeFromDeletion(item)}
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
          data-testid={namespace + '-addremove-edit-ok'}
          onClick={() => {
            onCancelEditing(item!, index)
          }}
        >
          <SuccessStroke />
          {labels?.ok ?? t('el:button-ok')}
        </Button>
        <HorizontalSeparatorDiv />
        <Button
          size='small'
          variant='tertiary'
          data-testid={namespace + '-addremove-edit-remove'}
          onClick={() => addToDeletion(item)}
        >
          <Delete />
          {labels?.remove ?? t('el:button-remove')}
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
          data-testid={namespace + '-addremove-add'}
          onClick={onAddNew}
        >
          <AddCircle />
          {labels?.add ?? t('el:button-add')}
        </Button>
        <HorizontalSeparatorDiv />
        <Button
          size='small'
          variant='tertiary'
          data-testid={namespace + '-addremove-cancel'}
          onClick={() => onCancelNew()}
        >
          <Cancel />
          {labels?.cancel ?? t('el:button-cancel')}
        </Button>
      </InlineFlexDiv>
    )
  }

  return (
    <InlineFlexDiv className={classNames({ nolabel: marginTop })}>
      <Button
        size='small'
        variant='tertiary'
        data-testid={namespace + '-addremove-edit'}
        onClick={() => {
          onEditing(item!, index)
        }}
      >
        <Edit />
        {labels?.edit ?? t('el:button-edit')}
      </Button>
    </InlineFlexDiv>
  )
}

export default AddRemovePanel2
