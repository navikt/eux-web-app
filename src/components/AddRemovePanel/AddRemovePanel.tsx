import { Add, Delete } from '@navikt/ds-icons'
import classNames from 'classnames'
import { Labels } from 'declarations/app'
import { Button, BodyLong } from '@navikt/ds-react'
import { HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export interface AddRemovePanelProps {
  candidateForDeletion: boolean
  existingItem: boolean
  labels?: Labels
  marginTop?: boolean,
  namespace?: string
  onAddNew?: () => void
  onCancelNew?: () => void
  onBeginRemove: () => void
  onCancelRemove: () => void
  onConfirmRemove: () => void
}

const InlineFlexDiv = styled.div`
  display: inline-flex;
  align-items: center;
`

const AddRemovePanel: React.FC<AddRemovePanelProps> = ({
  labels = {},
  candidateForDeletion,
  existingItem,
  marginTop = undefined,
  namespace = '',
  onAddNew,
  onCancelNew,
  onBeginRemove,
  onCancelRemove,
  onConfirmRemove
}: AddRemovePanelProps): JSX.Element => {
  const { t } = useTranslation()

  return candidateForDeletion
    ? (
      <InlineFlexDiv className={classNames('slideInFromRight', { nolabel: marginTop })}>
        <BodyLong style={{ whiteSpace: 'nowrap' }}>
          {labels?.areYouSure ?? t('label:er-du-sikker')}
        </BodyLong>
        <HorizontalSeparatorDiv size='0.5' />
        <Button
          variant='tertiary'
          data-test-id={namespace + '-addremove-yes'}
          onClick={onConfirmRemove}
        >
          {labels?.yes ?? t('label:ja')}
        </Button>
        <HorizontalSeparatorDiv size='0.5' />
        <Button
          variant='tertiary'
          data-test-id={namespace + '-addremove-no'}
          onClick={onCancelRemove}
        >
          {labels?.no ?? t('label:nei')}
        </Button>
      </InlineFlexDiv>
      )
    : (
      <InlineFlexDiv className={classNames({ nolabel: marginTop })}>
        <Button
          variant='tertiary'
          data-test-id={namespace + '-addremove-' + (existingItem ? 'remove' : 'add')}
          onClick={existingItem ? onBeginRemove : onAddNew}
        >
          {!existingItem ? <Add /> : <Delete />}
          <HorizontalSeparatorDiv size='0.5' />
          {!existingItem ? labels?.add ?? t('el:button-add') : labels?.remove ?? t('el:button-remove')}
        </Button>
        {!existingItem && (
          <>
            <HorizontalSeparatorDiv />
            <Button
              variant='tertiary'
              data-test-id={namespace + '-addremove-cancel'}
              onClick={onCancelNew}
            >
              {labels?.cancel ?? t('el:button-cancel')}
            </Button>
          </>
        )}
      </InlineFlexDiv>
      )
}

export default AddRemovePanel
