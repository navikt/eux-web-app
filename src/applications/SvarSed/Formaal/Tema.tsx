import { updateReplySed } from 'actions/svarpased'
import Edit from 'assets/icons/Edit'
import Select from 'components/Forms/Select'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { HSed, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { Column, FlexCenterDiv, HighContrastFlatknapp, HorizontalSeparatorDiv, Row } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { OptionTypeBase } from 'react-select'

interface TemaSelector {
  highContrast: boolean
  replySed: ReplySed | undefined
  resetValidation: ((key?: string | undefined) => void)
  validation: Validation
}

const mapState = (state: State): TemaSelector => ({
  highContrast: state.ui.highContrast,
  replySed: state.svarpased.replySed,
  resetValidation: state.validation.resetValidation,
  validation: state.validation.status
})

const Tema: React.FC = () => {
  const { t } = useTranslation()
  const {
    highContrast,
    replySed,
    validation,
    resetValidation
  }: any = useSelector<State, TemaSelector>(mapState)
  const dispatch = useDispatch()
  const namespace: string = 'tema'
  const [tema, setTema] = useState<string>(() => (replySed as HSed).tema)
  const [editMode, setEditMode] = useState<boolean>(false)

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

  const onSaveChangesClicked = () => {
    dispatch(updateReplySed('tema', tema))
    setEditMode(false)
  }

  const onTemaChanged = (o: OptionTypeBase) => {
    if (validation[namespace]) {
      resetValidation(namespace)
    }
    setTema(o.value)
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
            {t('label:tema')}:
          </label>
          <HorizontalSeparatorDiv size='0.35' />
          {!editMode && (<>{t('tema:' + (replySed as HSed).tema)}</>)}
          {editMode && (
            <>
              <Select
                defaultValue={_.find(temaOptions, s => s.value === tema)}
                feil={validation[namespace]?.feilmelding}
                highContrast={highContrast}
                key={namespace + '-' + tema}
                id={namespace}
                onChange={onTemaChanged}
                options={temaOptions}
                selectedValue={_.find(temaOptions, s => s.value === tema)}
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

export default Tema