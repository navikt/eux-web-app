import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  PaddedDiv,
  PaddedHorizontallyDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetAdresse } from 'actions/adresse'
import { resetValidation, setValidation } from 'actions/validation'
import AdresseFromPDL from 'applications/SvarSed/Adresser/AdresseFromPDL'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel2 from 'components/AddRemovePanel/AddRemovePanel2'
import AdresseBox from 'components/AdresseBox/AdresseBox'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Adresse } from 'declarations/sed'
import useLocalValidation from 'hooks/useLocalValidation'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getFnr } from 'utils/fnr'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import AdresseForm from './AdresseForm'
import { validateAdresse, validateAdresser, ValidationAdresseProps, ValidationAdresserProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Adresser: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target = `${personID}.adresser`
  const adresser: Array<Adresse> = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-adresser`
  const checkAdresseType: boolean = true
  const fnr = getFnr(replySed, personID)
  const getId = (a: Adresse | null | undefined): string => (a?.type ?? '') + '-' + (a?.by ?? '') + '-' + (a?.land ?? '')

  const [_newAdresse, _setNewAdresse] = useState<Adresse | undefined>(undefined)

  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_editing, _setEditing] = useState<Array<number>>([])
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationAdresseProps>(validateAdresse, namespace)

  useUnmount(() => {
    const [, newValidation] = performValidation<ValidationAdresserProps>(
      validation, namespace, validateAdresser, {
        adresser,
        checkAdresseType,
        personName
      }
    )
    dispatch(setValidation(newValidation))
    dispatch(resetAdresse())
  })

  const setAdresse = (adresse: Adresse, id: string | undefined, index: number) => {
    if (index < 0) {
      _setNewAdresse(adresse)
      if (id) {
        _resetValidation(namespace + '-' + id)
      }
      return
    }
    dispatch(updateReplySed(`${target}[${index}]`, adresse))
    if (id && validation[namespace + getIdx(index) + '-' + id]) {
      dispatch(resetValidation(namespace + getIdx(index) + '-' + id))
    }
  }

  const resetForm = () => {
    _setNewAdresse(undefined)
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (removedAdresse: Adresse) => {
    const newAdresser: Array<Adresse> = _.reject(adresser, (a: Adresse) => _.isEqual(removedAdresse, a))
    dispatch(updateReplySed(target, newAdresser))
    standardLogger('svarsed.editor.adresse.remove')
  }

  const onAdd = () => {
    const valid: boolean = _performValidation({
      adresse: _newAdresse,
      checkAdresseType,
      personName
    })
    if (valid) {
      let newAdresser: Array<Adresse> = _.cloneDeep(adresser)
      if (_.isNil(newAdresser)) {
        newAdresser = []
      }
      newAdresser = newAdresser.concat(_newAdresse!)
      dispatch(updateReplySed(target, newAdresser))
      standardLogger('svarsed.editor.adresse.add')
      onCancel()
    }
  }

  const onAdresserChanged = (selectedAdresser: Array<Adresse>) => {
    dispatch(updateReplySed(target, selectedAdresser))
  }

  const renderRow = (adresse: Adresse | null, index: number) => {
    const idx = getIdx(index)
    const editing: boolean = adresse === null || _.find(_editing, i => i === index) !== undefined
    const _adresse = index < 0 ? _newAdresse : adresse
    return (
      <RepeatableRow
        className={classNames({ new: index < 0 })}
      >
        <VerticalSeparatorDiv size='0.5' />
        {editing
          ? (
            <AdresseForm
              key={namespace + idx + getId(_adresse)}
              namespace={namespace + idx}
              adresse={_adresse}
              onAdressChanged={(a: Adresse, type: string | undefined) => setAdresse(a, type, index)}
              validation={index < 0 ? _validation : validation}
            />
            )
          : (
            <AdresseBox adresse={_adresse} seeType />
            )}
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow>
          <AlignEndColumn>
            <AddRemovePanel2<Adresse>
              item={adresse}
              index={index}
              onRemove={onRemove}
              onAddNew={onAdd}
              onCancelNew={onCancel}
              onStartEdit={(s, index) => _setEditing(_editing.concat(index))}
              onCancelEdit={(s, index) => _setEditing(_.filter(_editing, i => i !== index))}
            />
          </AlignEndColumn>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <>
      <PaddedDiv key={namespace + '-div'}>
        <AdresseFromPDL
          fnr={fnr!}
          selectedAdresser={adresser}
          personName={personName}
          onAdresserChanged={onAdresserChanged}
        />
      </PaddedDiv>
      <VerticalSeparatorDiv />
      {_.isEmpty(adresser)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-address')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : adresser?.map(renderRow)}
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <PaddedDiv>
            <Button
              variant='tertiary'
              onClick={() => _setSeeNewForm(true)}
            >
              <AddCircle />
              {t('el:button-add-new-x', { x: t('label:adresse').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
    </>
  )
}

export default Adresser
