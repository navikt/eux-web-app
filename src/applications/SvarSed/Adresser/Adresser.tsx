import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Heading } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  PaddedDiv,
  PaddedHorizontallyDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetAdresse } from 'actions/adresse'
import { resetValidation, setValidation } from 'actions/validation'
import AdresseFromPDL from 'applications/SvarSed/Adresser/AdresseFromPDL'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
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
import { hasNamespaceWithErrors } from 'utils/validation'
import AdresseForm from './AdresseForm'
import { validateAdresse, validateAdresser, ValidationAdresseProps, ValidationAdresserProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Adresser: React.FC<MainFormProps> = ({
  label,
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

  const setAdresse = (adresse: Adresse, index: number) => {
    if (index < 0) {
      _setNewAdresse(adresse)
      _resetValidation(namespace)
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

  const setPDLAdresser = (selectedAdresser: Array<Adresse>) => {
    dispatch(updateReplySed(target, selectedAdresser))
  }

  const renderRow = (adresse: Adresse | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _adresse = index < 0 ? _newAdresse : (inEditMode ? _editAdresse : adresse)

    const addremovepanel = (
      <AddRemovePanel<Adresse>
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
    )

    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getId(adresse)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        {inEditMode
          ? (
            <AdresseForm
              namespace={_namespace}
              adresse={_adresse}
              onAdressChanged={(a: Adresse) => setAdresse(a, index)}
              validation={_v}
            />
            )
          : (
            <AlignStartRow>
              <Column flex='2'>
                <AdresseBox adresse={_adresse} seeType />
              </Column>
              <AlignEndColumn>
                {addremovepanel}
              </AlignEndColumn>
            </AlignStartRow>
            )}
        {inEditMode && (
          <>
            <VerticalSeparatorDiv size='0.5' />
            <AlignStartRow>
              <AlignEndColumn>
                {addremovepanel}
              </AlignEndColumn>
            </AlignStartRow>
          </>
        )}
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <>
      <PaddedDiv>
        <Heading size='small'>
          {label}
        </Heading>
        <VerticalSeparatorDiv />
        <AdresseFromPDL
          fnr={fnr!}
          selectedAdresser={adresser ?? []}
          personName={personName}
          onAdresserChanged={setPDLAdresser}
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
