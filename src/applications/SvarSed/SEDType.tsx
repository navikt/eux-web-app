import { ActionWithPayload } from '@navikt/fetch'
import { resetValidation } from 'actions/validation'
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
import { standardLogger } from 'metrics/loggers'
import { Button } from '@navikt/ds-react'
import { Column, FlexCenterDiv, HorizontalSeparatorDiv, Row } from '@navikt/hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Option } from 'declarations/app.d'
import { Edit } from '@navikt/ds-icons'
import { useAppDispatch, useAppSelector } from 'store'

interface SEDTypeProps {
  replySed: ReplySed | null | undefined
  setReplySed: (replySed: ReplySed) => ActionWithPayload<ReplySed>
}

interface SEDTypeSelector {
  validation: Validation
}

const mapState = (state: State): SEDTypeSelector => ({
  validation: state.validation.status
})

const SEDType: React.FC<SEDTypeProps> = ({
  replySed,
  setReplySed
}: SEDTypeProps) => {
  const { t } = useTranslation()
  const { validation }: any = useAppSelector(mapState)
  const dispatch = useAppDispatch()
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
      const newReplySed: ReplySed = _.cloneDeep(replySed) as ReplySed
      newReplySed.sedType = newSedType
      dispatch(setReplySed(newReplySed))
    } else {
      if (window.confirm(message)) {
        const newReplySed: ReplySed = _.cloneDeep(replySed) as ReplySed
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
          delete (newReplySed as U002Sed).sisteAnsettelseInfo
          delete (newReplySed as U002Sed).grunntilopphor
        }
        if (newSedType !== 'U017' && oldSedType === 'U017') {
          delete (newReplySed as U017Sed).rettTilYtelse
        }
        if (newSedType !== 'U004' && oldSedType === 'U004') {
          delete (newReplySed as U004Sed).loennsopplysninger
        }
        dispatch(setReplySed(newReplySed))
        standardLogger('svarsed.editor.sedtype.change', { type: newSedType })
      } else {
        setSedType(oldSedType)
      }
    }
    setEditMode(false)
  }

  const onSedTypeChanged = (o: unknown) => {
    if (validation[namespace]) {
      dispatch(resetValidation(namespace))
    }
    setSedType((o as Option).value)
  }

  const onCancelChangesClicked = () => setEditMode(false)

  const onEditModeClicked = () => setEditMode(true)

  return (
    <Row>
      <Column>
        <FlexCenterDiv>
          <label
            htmlFor={namespace}
            className='navds-text-field__label navds-label'
            style={{ margin: '0px' }}
          >
            {t('label:svar-sed-type')}:
          </label>
          <HorizontalSeparatorDiv size='0.35' />
          <FlexCenterDiv className={namespace}>
            {!editMode
              ? _sedType
                  ? t('buc:' + replySed?.sedType)
                  : t('label:ukjent')
              : (
                <>
                  <Select
                    defaultValue={_.find(sedTypeOptions, s => s.value === _sedType)}
                    error={validation[namespace]?.feilmelding}
                    key={namespace + '-' + _sedType + '-select'}
                    id={namespace + '-select'}
                    onChange={onSedTypeChanged}
                    options={sedTypeOptions}
                    value={_.find(sedTypeOptions, s => s.value === _sedType)}
                    style={{ minWidth: '300px' }}
                  />
                  <HorizontalSeparatorDiv size='0.5' />
                  <Button
                    variant='tertiary'
                    onClick={onSaveChangesClicked}
                  >
                    {t('el:button-save')}
                  </Button>
                  <HorizontalSeparatorDiv size='0.5' />
                  <Button
                    variant='tertiary'
                    onClick={onCancelChangesClicked}
                  >
                    {t('el:button-cancel')}
                  </Button>
                </>
                )}
            {!editMode && validation[namespace]?.feilmelding && (
              <>
                <HorizontalSeparatorDiv />
                <label className='navds-error-message navds-error-message--medium navds-label' style={{ marginTop: '0px' }}>
                  {validation[namespace].feilmelding}
                </label>
              </>
            )}
          </FlexCenterDiv>
          <HorizontalSeparatorDiv />
          {!editMode && (
            <Button
              variant='tertiary'
              onClick={onEditModeClicked}
            >
              <Edit />
              <HorizontalSeparatorDiv size='0.5' />
              {t('el:button-edit')}
            </Button>
          )}
        </FlexCenterDiv>
      </Column>
    </Row>
  )
}

export default SEDType
