import { Add } from '@navikt/ds-icons'
import Trashcan from 'assets/icons/Trashcan'
import classNames from 'classnames'
import { Labels } from 'declarations/app'
import { Normaltekst } from 'nav-frontend-typografi'
import { HighContrastFlatknapp, HorizontalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export interface AddRemovePanelProps {
  candidateForDeletion: boolean
  existingItem: boolean
  labels?: Labels
  marginTop?: boolean,
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
        <Normaltekst>
          {labels?.areYouSure ?? t('label:er-du-sikker')}
        </Normaltekst>
        <HorizontalSeparatorDiv size='0.5' />
        <HighContrastFlatknapp
          mini
          kompakt
          onClick={onConfirmRemove}
        >
          {labels?.yes ?? t('label:ja')}
        </HighContrastFlatknapp>
        <HorizontalSeparatorDiv size='0.5' />
        <HighContrastFlatknapp
          mini
          kompakt
          onClick={onCancelRemove}
        >
          {labels?.no ?? t('label:nei')}
        </HighContrastFlatknapp>
      </InlineFlexDiv>
      )
    : (
      <InlineFlexDiv className={classNames({ nolabel: marginTop })}>
        <HighContrastFlatknapp
          mini
          kompakt
          onClick={existingItem ? onBeginRemove : onAddNew}
        >
          {!existingItem ? <Add /> : <Trashcan />}
          <HorizontalSeparatorDiv size='0.5' />
          {!existingItem ? labels?.add ?? t('el:button-add') : labels?.remove ?? t('el:button-remove')}
        </HighContrastFlatknapp>
        {!existingItem && (
          <>
            <HorizontalSeparatorDiv />
            <HighContrastFlatknapp
              mini
              kompakt
              onClick={onCancelNew}
            >
              {labels?.cancel ?? t('el:button-cancel')}
            </HighContrastFlatknapp>
          </>
        )}
      </InlineFlexDiv>
      )
}

export default AddRemovePanel
