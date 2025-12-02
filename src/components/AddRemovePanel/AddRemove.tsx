import { PlusCircleIcon, ArrowUndoIcon, TrashIcon, PencilIcon, CheckmarkIcon, FilesIcon } from '@navikt/aksel-icons';
import classNames from 'classnames'
import { Labels } from 'declarations/app'
import {Button, BodyLong, HStack, Alert} from '@navikt/ds-react'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface AddRemovePanelProps<T> {
  item: T | null
  index: number
  labels?: Labels
  marginTop?: boolean
  allowEdit?: boolean
  allowDelete?: boolean
  onAddNew?: () => void
  onCopy?: (item: T, index: number) => void
  inEditMode?: boolean
  onStartEdit?: (item: T, index: number) => void
  onConfirmEdit?: () => void
  onCancelEdit?: () => void
  onCancelNew?: () => void
  onRemove: (item: T) => void
  alertOnDelete?: string
}

const AddRemove = <T extends any>({
  labels = {},
  item,
  index,
  allowEdit = true,
  allowDelete = true,
  inEditMode = false,
  onStartEdit,
  onConfirmEdit,
  onCancelEdit,
  onRemove,
  onAddNew,
  onCopy,
  onCancelNew,
  alertOnDelete
}: AddRemovePanelProps<T>): JSX.Element | null => {
  const { t } = useTranslation()

  const [inDeleteMode, setInDeleteMode] = useState<boolean>(false)

  const isNew = item === null
  const candidateForDeletion = isNew ? false : inDeleteMode
  const candidateForEdition = isNew ? false : inEditMode

  if (candidateForDeletion) {
    return (
      <HStack gap="1" align="center" className={classNames('slideInFromRight')}>
        <BodyLong style={{ whiteSpace: 'nowrap' }}>
          {labels?.areYouSure ?? t('label:er-du-sikker')}
        </BodyLong>
        <Button
          size='xsmall'
          variant='tertiary'
          onClick={() => {
            onRemove(item!)
            setInDeleteMode(false)
          }}
        >
          {labels?.yes ?? t('label:ja')}
        </Button>
        <Button
          size='xsmall'
          variant='tertiary'
          onClick={() => setInDeleteMode(false)}
        >
          {labels?.no ?? t('label:nei')}
        </Button>
        {alertOnDelete &&
          <Alert  variant="info" size="small">
            {alertOnDelete}
          </Alert>
        }
      </HStack>
    )
  }

  if (candidateForEdition) {
    return (
      <HStack gap="1" align="center" wrap={false}>
        <Button
          size="xsmall"
          variant='tertiary'
          onClick={() => {
            onConfirmEdit!()
          }}
          icon={<CheckmarkIcon/>}
        >
          {labels?.ok ?? t('el:button-save')}
        </Button>
        <Button
          size='xsmall'
          variant='tertiary'
          onClick={() => {
            if (onCancelEdit) {
              onCancelEdit()
            }
          }}
          icon={<ArrowUndoIcon/>}
        >
          {labels?.cancel ?? t('el:button-cancel')}
        </Button>
      </HStack>
    )
  }

  if (isNew) {
    return (
      <HStack gap="1" align="center" wrap={false}>
        <Button
          size='xsmall'
          variant='tertiary'
          onClick={() => {
            if (_.isFunction(onAddNew)) {
              onAddNew()
            }
          }}
          icon={<PlusCircleIcon/>}
        >
          <span style={{ whiteSpace: 'nowrap' }}>{labels?.add ?? t('el:button-add')}</span>
        </Button>
        <Button
          size='xsmall'
          variant='tertiary'
          onClick={() => {
            if (_.isFunction(onCancelNew)) {
              onCancelNew()
            }
          }}
          icon={<ArrowUndoIcon/>}
        >
          {labels?.cancel ?? t('el:button-cancel')}
        </Button>
      </HStack>
    )
  }

  return (
    <HStack gap="1" align="center" className={classNames('control-buttons')}>
      {allowEdit && (
        <Button
          size='xsmall'
          variant='tertiary'
          onClick={() => {
            if (onStartEdit) {
              onStartEdit(item!, index)
            }
          }}
          icon={<PencilIcon/>}
        >
          {labels?.edit ?? t('el:button-edit')}
        </Button>
      )}
      {onCopy &&
        <Button
          size='xsmall'
          variant='tertiary'
          onClick={() => {
            onCopy(item!, index)
          }}
          icon={<FilesIcon/>}
        >
          {labels?.copy ?? t('el:button-copy')}
        </Button>
      }
      {allowDelete && (
        <Button
          size='xsmall'
          variant='tertiary'
          onClick={() => setInDeleteMode(true)}
          icon={<TrashIcon/>}
        >
          {labels?.remove ?? t('el:button-remove')}
        </Button>
      )}
    </HStack>
  )
}

export default AddRemove
