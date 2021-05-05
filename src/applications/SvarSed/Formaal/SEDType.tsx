import { setReplySed } from 'actions/svarpased'
import Edit from 'assets/icons/Edit'
import Select from 'components/Forms/Select'
import { FlexCenterDiv } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { ReplySed } from 'declarations/sed'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema/lib/feiloppsummering'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Column, HighContrastFlatknapp, HorizontalSeparatorDiv, Row } from 'nav-hoykontrast'
import { OptionTypeBase } from 'react-select'

interface SEDTypeProps {
  feil: FeiloppsummeringFeil | undefined
  highContrast: boolean
  replySed: ReplySed
}

const SEDType: React.FC<SEDTypeProps> = ({
  highContrast,
  replySed
}: SEDTypeProps) => {
  const { t } = useTranslation()

  const [sedType, setSedType] = useState<string>(() => replySed.sedType)
  const [editMode, setEditMode] = useState<boolean>(false)

  const dispatch = useDispatch()

  const sedTypeOptions: Options = [
    { label: t('buc:U002'), value: 'U002' },
    { label: t('buc:U004'), value: 'U004' },
    { label: t('buc:U017'), value: 'U017' }
  ]

  const saveChanges = () => {
    if (sedType) {
      dispatch(setReplySed({
        ...replySed,
        sedType: sedType
      }))
    }
    setEditMode(false)
  }

  const cancelChanges = () => setEditMode(false)

  return (
    <Row>
      <Column>
        <FlexCenterDiv>
          <label className='skjemaelement__label' style={{ margin: '0px' }}>{t('label:svar-sed-type')}: </label>
          <HorizontalSeparatorDiv data-size='0.35' />
          {!editMode && (<>{t('buc:' + replySed.sedType)}</>)}
          {editMode && (
            <>
              <Select
                id='sedtype'
                style={{ minWidth: '300px' }}
                onChange={(o: OptionTypeBase) => setSedType(o.value)}
                highContrast={highContrast}
                options={sedTypeOptions}
                defaultValue={_.find(sedTypeOptions, s => s.value === sedType)}
                selectedValue={_.find(sedTypeOptions, s => s.value === sedType)}
              />
              <HorizontalSeparatorDiv data-size='0.5' />
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={saveChanges}
              >
                {t('el:button-save')}
              </HighContrastFlatknapp>
              <HorizontalSeparatorDiv data-size='0.5' />
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={cancelChanges}
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
              onClick={() => setEditMode(true)}
            >
              <Edit />
              <HorizontalSeparatorDiv data-size='0.5' />
              {t('el:button-edit')}
            </HighContrastFlatknapp>
          )}
        </FlexCenterDiv>
      </Column>
    </Row>
  )
}

export default SEDType
