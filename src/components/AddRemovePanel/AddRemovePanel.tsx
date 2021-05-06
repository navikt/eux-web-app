import Add from 'assets/icons/Add'
import Trashcan from 'assets/icons/Trashcan'
import classNames from 'classnames'
import { FlexCenterSpacedDiv } from 'components/StyledComponents'
import { Normaltekst } from 'nav-frontend-typografi'
import { HighContrastFlatknapp, HorizontalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'

export interface AddRemovePanelProps {
  candidateForDeletion: boolean
  existingItem: boolean
  marginTop?: boolean,
  onAddNew?: () => void
  onCancelNew?: () => void
  onBeginRemove: () => void
  onCancelRemove: () => void
  onConfirmRemove: () => void
}

const AddRemovePanel: React.FC<AddRemovePanelProps> = ({
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
          {t('label:er-du-sikker')}
        </Normaltekst>
        <HorizontalSeparatorDiv size='0.5' />
        <HighContrastFlatknapp
          mini
          kompakt
          onClick={onConfirmRemove}
        >
          {t('label:ja')}
        </HighContrastFlatknapp>
        <HorizontalSeparatorDiv size='0.5' />
        <HighContrastFlatknapp
          mini
          kompakt
          onClick={onCancelRemove}
        >
          {t('label:nei')}
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
          {!existingItem ? t('el:button-add') : t('el:button-remove')}
        </HighContrastFlatknapp>
        {!existingItem && (
          <>
            <HorizontalSeparatorDiv />
            <HighContrastFlatknapp
              mini
              kompakt
              onClick={onCancelNew}
            >
              {t('el:button-cancel')}
            </HighContrastFlatknapp>
          </>
        )}
      </div>
      )
}

export default AddRemovePanel
