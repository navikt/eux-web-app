import { PlusCircleIcon, ArrowUndoIcon, TrashIcon, PencilIcon, CheckmarkIcon, FilesIcon } from '@navikt/aksel-icons';
import classNames from 'classnames'
import { Labels } from 'declarations/app'
import {Button, BodyLong, HStack, Box} from '@navikt/ds-react'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './AddRemovePanel.module.css'

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
}

const AddRemovePanel = <T extends any>({
  labels = {},
  item,
  index,
  allowEdit = true,
  allowDelete = true,
  marginTop = undefined,
  inEditMode = false,
  onStartEdit,
  onConfirmEdit,
  onCancelEdit,
  onRemove,
  onAddNew,
  onCopy,
  onCancelNew
}: AddRemovePanelProps<T>): JSX.Element | null => {
  const { t } = useTranslation()

  const [inDeleteMode, setInDeleteMode] = useState<boolean>(false)

  const isNew = item === null
  const candidateForDeletion = isNew ? false : inDeleteMode
  const candidateForEdition = isNew ? false : inEditMode

  if (candidateForDeletion) {
    return (
      <Box className={classNames('slideInFromRight', { marginTop }, styles.inlineFlex)}>
        <HStack gap="4" align="center">
          <BodyLong style={{ whiteSpace: 'nowrap' }}>
            {labels?.areYouSure ?? t('label:er-du-sikker')}
          </BodyLong>
          <Button
            size='small'
            variant='tertiary'
            onClick={() => onRemove(item!)}
          >
            {labels?.yes ?? t('label:ja')}
          </Button>
          <Button
            size='small'
            variant='tertiary'
            onClick={() => setInDeleteMode(false)}
          >
            {labels?.no ?? t('label:nei')}
          </Button>
        </HStack>
      </Box>
    )
  }

  if (candidateForEdition) {
    return (
      <Box className={classNames({ marginTop }, styles.inlineFlex)}>
        <HStack gap="4" align="center">
          <Button
            size='small'
            variant='tertiary'
            onClick={() => {
              onConfirmEdit!()
            }}
            icon={<CheckmarkIcon/>}
          >
            {labels?.ok ?? t('el:button-save')}
          </Button>
          <Button
            size='small'
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
      </Box>
    )
  }

  if (isNew) {
    return (
      <Box className={classNames({ marginTop }, styles.inlineFlex)}>
        <HStack gap="4" align="center">
          <Button
            size='small'
            variant='tertiary'
            onClick={() => {
              if (_.isFunction(onAddNew)) {
                onAddNew()
              }
            }}
            icon={<PlusCircleIcon/>}
          >
            {labels?.add ?? t('el:button-add')}
          </Button>
          <Button
            size='small'
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
      </Box>
    )
  }

  return (
    <Box className={classNames('control-buttons', 'noMargin', styles.inlineFlex)}>
      <HStack gap="4" align="center">
        {allowEdit && (
          <Button
            size='small'
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
            size='small'
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
            size='small'
            variant='tertiary'
            onClick={() => setInDeleteMode(true)}
            icon={<TrashIcon/>}
          >
            {labels?.remove ?? t('el:button-remove')}
          </Button>
        )}
      </HStack>
    </Box>
  )
}

export default AddRemovePanel
