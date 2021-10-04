import { setReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import Edit from 'assets/icons/Edit'
import Select from 'components/Forms/Select'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import {
  ReplySed,
  U002Sed,
  U004Sed,
  U017Sed,
  USed
} from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { Column, FlexCenterDiv, HighContrastFlatknapp, HorizontalSeparatorDiv, Row } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Option } from 'declarations/app.d'

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
    const oldSedType = (replySed as USed).sedType
    const newSedType = _sedType

    // leaving U002 to U004 makes it lose forsikring, siste ansettelsesforhold, ghrunntilopphor, periodedagpenger
    // leaving U002 to U017 makes it lose nothing
    // leaving U004 to U002 or U017 makes it lose inntekt
    // leaving U017 to U004 makes it lose rettTilYtelse, forsikring, siste ansettelsesforhold, ghrunntilopphor, periodedagpenger
    // leaving U017 to U002 makes it lose rettTilYtelse
    const x = []
    if (newSedType === 'U004' && oldSedType !== 'U004') {
      x.push(t('label:forsikringsperiode').toLowerCase())
      x.push(t('label:siste-ansettelsesforhold').toLowerCase())
      x.push(t('label:grunn-til-opphør').toLowerCase())
      x.push(t('label:periode-for-dagpenger').toLowerCase())
    }
    if (newSedType !== 'U017' && oldSedType === 'U017') {
      x.push(t('label:rett-til-ytelser').toLowerCase())
    }
    if (newSedType !== 'U004' && oldSedType === 'U004') {
      x.push(t('label:inntekt').toLowerCase())
    }

    const message = t('label:all-data-regarding-x-will-be-lost', { x: x.join(', ') })

    if (_.isEmpty(x)) {
      const newReplySed: ReplySed = _.cloneDeep(replySed)
      newReplySed.sedType = newSedType
      dispatch(setReplySed(newReplySed))
    } else {
      if (window.confirm(message)) {
        const newReplySed: ReplySed = _.cloneDeep(replySed)
        newReplySed.sedType = newSedType

        if (newSedType === 'U004' && oldSedType !== 'U004') {
          delete (newReplySed as U002Sed).perioderAnsattMedForsikring
          delete (newReplySed as U002Sed).perioderAnsattUtenForsikring
          delete (newReplySed as U002Sed).perioderSelvstendigMedForsikring
          delete (newReplySed as U002Sed).perioderSelvstendigUtenForsikring
          delete (newReplySed as U002Sed).perioderFrihetsberoevet
          delete (newReplySed as U002Sed).perioderSyk
          delete (newReplySed as U002Sed).perioderSvangerskapBarn
          delete (newReplySed as U002Sed).perioderUtdanning
          delete (newReplySed as U002Sed).perioderMilitaertjeneste
          delete (newReplySed as U002Sed).perioderAnnenForsikring
          delete (newReplySed as U002Sed).perioderDagpenger
          delete (newReplySed as U002Sed).sisteAnsettelsesForhold
          delete (newReplySed as U002Sed).grunntilopphor
        }
        if (newSedType !== 'U017' && oldSedType === 'U017') {
          delete (newReplySed as U017Sed).rettTilYtelse
        }
        if (newSedType !== 'U004' && oldSedType === 'U004') {
          delete (newReplySed as U004Sed).loennsopplysninger
        }
        dispatch(setReplySed(newReplySed))
      } else {
        setSedType(oldSedType)
      }
    }
    setEditMode(false)
  }

  const onSedTypeChanged = (o: Option) => {
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
                    value={_.find(sedTypeOptions, s => s.value === _sedType)}
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
                <HorizontalSeparatorDiv />
                <div className='skjemaelement__feilmelding' style={{ marginTop: '0px' }}>
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
