
import { setReplySed } from 'actions/svarpased'
import Edit from 'assets/icons/Edit'
import Select from 'components/Forms/Select'
import { FlexCenterDiv } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { HSed, ReplySed } from 'declarations/sed'
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

  const [tema, setTema] = useState<string>(() => (replySed as HSed).tema)
  const [editMode, setEditMode] = useState<boolean>(false)

  const dispatch = useDispatch()

  const temaOptions: Options = [
    { label: t('tema:GEN'), value: 'GEN' },
    { label: t('tema:AAP'), value: 'AAP' },
    { label: t('tema:BAR'), value: 'BAR' },
    { label: t('tema:DAG'), value: 'DAG' },
    { label: t('tema:FEI'), value: 'FEI' },
    { label: t('tema:FOR'), value: 'FOR' },
    { label: t('tema:GRA'), value: 'GRA' },
    { label: t('tema:KON'), value: 'KON' },
    { label: t('tema:MED'), value: 'MED' },
    { label: t('tema:OMS'), value: 'OMS' },
    { label: t('tema:PEN'), value: 'PEN' },
    { label: t('tema:SYK'), value: 'SYK' },
    { label: t('tema:YRK'), value: 'YRK' },
    { label: t('tema:UFO'), value: 'UFO' },
    { label: t('tema:GRU'), value: 'GRU' },
    { label: t('tema:KTR'), value: 'KTR' },
    { label: t('tema:TRY'), value: 'TRY' },
    { label: t('tema:SUP'), value: 'SUP' },
    { label: t('tema:UFM'), value: 'UFM' }
  ]

  const saveChanges = () => {
    if (tema) {
      dispatch(setReplySed({
        ...replySed,
        tema: tema
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
          {!editMode && (<>{t('tema:' + (replySed as HSed).tema)}</>)}
          {editMode && (
            <>
              <Select
                id='sedtype'
                style={{ minWidth: '300px' }}
                onChange={(o: OptionTypeBase) => setTema(o.value)}
                highContrast={highContrast}
                options={temaOptions}
                defaultValue={_.find(temaOptions, s => s.value === tema)}
                selectedValue={_.find(temaOptions, s => s.value === tema)}
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
