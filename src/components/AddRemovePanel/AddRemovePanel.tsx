import Add from 'assets/icons/Add'
import Trashcan from 'assets/icons/Trashcan'
import classNames from 'classnames'
import { Labels } from 'declarations/app'
import { Normaltekst } from 'nav-frontend-typografi'
import { HighContrastFlatknapp, FlexCenterSpacedDiv, HorizontalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'

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
      <FlexCenterSpacedDiv className={classNames('slideInFromRight', { nolabel: marginTop })}>
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
      </FlexCenterSpacedDiv>
      )
    : (
      <div className={classNames({ nolabel: marginTop })}>
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
      </div>
      )
}

export default AddRemovePanel
