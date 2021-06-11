import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import Edit from 'assets/icons/Edit'
import Select from 'components/Forms/Select'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { ReplySed, USed } from 'declarations/sed'
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
    validation
  }: any = useSelector<State, SEDTypeSelector>(mapState)
  const dispatch = useDispatch()
  const namespace: string = 'editor-sedtype'
  const [_sedType, setSedType] = useState<string>(() => (replySed as USed).sedType)
  const [editMode, setEditMode] = useState<boolean>(() => false)

  const sedTypeOptions: Options = [
    { label: t('buc:U002'), value: 'U002' },
    { label: t('buc:U004'), value: 'U004' },
    { label: t('buc:U017'), value: 'U017' }
  ]

  const onSaveChangesClicked = () => {
    dispatch(updateReplySed('sedType', _sedType))
    setEditMode(false)
  }

  const onSedTypeChanged = (o: OptionTypeBase) => {
    if (validation[namespace]) {
      dispatch(resetValidation(namespace))
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
          <FlexCenterDiv className={namespace}>
            {!editMode
              ? _sedType
                ? t('buc:' + replySed.sedType)
                : t('label:ukjent')
              : (
                <>
                  <Select
                    defaultValue={_.find(sedTypeOptions, s => s.value === _sedType)}
                    feil={validation[namespace]?.feilmelding}
                    highContrast={highContrast}
                    key={namespace + '-' + _sedType + '-select'}
                    id={namespace + '-select'}
                    onChange={onSedTypeChanged}
                    options={sedTypeOptions}
                    selectedValue={_.find(sedTypeOptions, s => s.value === _sedType)}
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
              {!editMode && validation[namespace]?.feilmelding && (
                <>
                  <HorizontalSeparatorDiv/>
                  <div className='skjemaelement__feilmelding' style={{marginTop: '0px'}}>
                    <p className='typo-feilmelding'>
                      {validation[namespace].feilmelding}
                    </p>
                  </div>
                </>
            )}
          </FlexCenterDiv>
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
