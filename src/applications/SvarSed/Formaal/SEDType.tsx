import { updateReplySed } from 'actions/svarpased'
import Edit from 'assets/icons/Edit'
import Select from 'components/Forms/Select'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { Column, FlexCenterDiv, HighContrastFlatknapp, HorizontalSeparatorDiv, Row } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { OptionTypeBase } from 'react-select'

interface SEDTypeSelector {
  highContrast: boolean
  replySed: ReplySed | undefined
  validation: Validation
}

const mapState = (state: State): SEDTypeSelector => ({
  highContrast: state.ui.highContrast,
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const SEDType: React.FC = () => {
  const { t } = useTranslation()
  const {
    highContrast,
    replySed,
    validation,
    resetValidation
  }: any = useSelector<State, SEDTypeSelector>(mapState)
  const dispatch = useDispatch()
  const namespace: string = 'sedtype'
  const [sedType, setSedType] = useState<string>(() => replySed.sedType)
  const [editMode, setEditMode] = useState<boolean>(() => false)

  const sedTypeOptions: Options = [
    { label: t('buc:U002'), value: 'U002' },
    { label: t('buc:U004'), value: 'U004' },
    { label: t('buc:U017'), value: 'U017' }
  ]

  const onSaveChangesClicked = () => {
    dispatch(updateReplySed('sedType', sedType))
    setEditMode(false)
  }

  const onSedTypeChanged = (o: OptionTypeBase) => {
    if (validation[namespace]) {
      resetValidation(namespace)
    }
    setSedType(o.value)
  }

  const onCancelChangesClicked = () => setEditMode(false)

  const onEditModeClicked = () => setEditMode(true)

  return (
    <Row>
      <Column>
        <FlexCenterDiv>
          <label
            htmlFor={namespace}
            className='skjemaelement__label'
            style={{ margin: '0px' }}
          >
            {t('label:svar-sed-type')}:
          </label>
          <HorizontalSeparatorDiv size='0.35' />
          {!editMode && (<>{t('buc:' + replySed.sedType)}</>)}
          {editMode && (
            <>
              <Select
                defaultValue={_.find(sedTypeOptions, s => s.value === sedType)}
                feil={validation[namespace]?.feilmelding}
                highContrast={highContrast}
                key={namespace + '-' + sedType}
                id={namespace}
                onChange={onSedTypeChanged}
                options={sedTypeOptions}
                selectedValue={_.find(sedTypeOptions, s => s.value === sedType)}
                style={{ minWidth: '300px' }}
              />
              <HorizontalSeparatorDiv size='0.5' />
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={onSaveChangesClicked}
              >
                {t('el:button-save')}
              </HighContrastFlatknapp>
              <HorizontalSeparatorDiv size='0.5' />
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={onCancelChangesClicked}
              >
                {t('el:button-cancel')}
              </HighContrastFlatknapp>
            </>
          )}
          <HorizontalSeparatorDiv />
          {!editMode && (
            <HighContrastFlatknapp
              mini
              kompakt
              onClick={onEditModeClicked}
            >
              <Edit />
              <HorizontalSeparatorDiv size='0.5' />
              {t('el:button-edit')}
            </HighContrastFlatknapp>
          )}
        </FlexCenterDiv>
      </Column>
    </Row>
  )
}

export default SEDType
