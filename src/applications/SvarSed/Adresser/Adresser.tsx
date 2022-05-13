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
import { Validation } from 'declarations/types'
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
import { hasNamespace } from 'utils/validation'
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
  const adresser: Array<Adresse> | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-adresser`

  const checkAdresseType: boolean = true
  const fnr = getFnr(replySed, personID)
  const getId = (a: Adresse | null | undefined): string => a ? (a?.type ?? '') + '-' + (a?.by ?? '') + '-' + (a?.land ?? '') : 'new'

  const [_newAdresse, _setNewAdresse] = useState<Adresse | undefined>(undefined)
  const [_editAdresse, _setEditAdresse] = useState<Adresse | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_seeNewForm, _setNewForm] = useState<boolean>(false)
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

  const onAdressChanged = (adresse: Adresse, whatChanged: string | undefined, index: number) => {
    if (index < 0) {
      _setNewAdresse(adresse)
      _resetValidation(namespace + '-' + whatChanged)
      return
    }
    _setEditAdresse(adresse)
    dispatch(resetValidation(namespace + getIdx(index)))
  }

  const onCloseEdit = (namespace: string) => {
    _setEditAdresse(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewAdresse(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (a: Adresse, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditAdresse(a)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const [valid, newValidation] = performValidation<ValidationAdresseProps>(
      validation, namespace, validateAdresse, {
        adresse: _editAdresse,
        checkAdresseType,
        index: _editIndex,
        personName
      })
    if (valid) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editAdresse))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(newValidation))
    }
  }

  const onRemove = (removedAdresse: Adresse) => {
    const newAdresser: Array<Adresse> = _.reject(adresser, (a: Adresse) => _.isEqual(removedAdresse, a))
    dispatch(updateReplySed(target, newAdresser))
    standardLogger('svarsed.editor.adresse.remove')
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      adresse: _newAdresse,
      checkAdresseType,
      personName
    })
    if (!!_newAdresse && valid) {
      let newAdresser: Array<Adresse> | undefined = _.cloneDeep(adresser)
      if (_.isNil(newAdresser)) {
        newAdresser = []
      }
      newAdresser.push(_newAdresse!)
      dispatch(updateReplySed(target, newAdresser))
      standardLogger('svarsed.editor.adresse.add')
      onCloseNew()
    }
  }

  const onPDLAdresserChanged = (selectedAdresser: Array<Adresse>) => {
    dispatch(updateReplySed(target, selectedAdresser))
  }

  const renderRow = (adresse: Adresse | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _adresse = index < 0 ? _newAdresse : (inEditMode ? _editAdresse : adresse)
    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getId(adresse)}
        className={classNames({
          new: index < 0,
          error: hasNamespace(_v, _namespace)
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        {inEditMode
          ? (
            <AdresseForm
              key={_namespace + getId(_adresse)}
              namespace={_namespace}
              adresse={_adresse}
              onAdressChanged={(a: Adresse, whatChanged: string | undefined) => onAdressChanged(a, whatChanged, index)}
              validation={_v}
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
              marginTop={false}
              index={index}
              inEditMode={inEditMode}
              onRemove={onRemove}
              onAddNew={onAddNew}
              onCancelNew={onCloseNew}
              onStartEdit={onStartEdit}
              onConfirmEdit={onSaveEdit}
              onCancelEdit={() => onCloseEdit(_namespace)}
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
          selectedAdresser={adresser ?? []}
          personName={personName}
          onAdresserChanged={onPDLAdresserChanged}
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
              onClick={() => _setNewForm(true)}
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
