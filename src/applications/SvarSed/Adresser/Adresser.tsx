import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  PaddedDiv,
  PaddedHorizontallyDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetValidation } from 'actions/validation'
import AdresseFromPDL from 'applications/SvarSed/Adresser/AdresseFromPDL'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Adresse } from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getFnr } from 'utils/fnr'
import { getIdx } from 'utils/namespace'
import AdresseForm from './AdresseForm'
import { validateAdresse, ValidationAddressProps } from './validation'

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
  const fnr = getFnr(replySed, personID)
  const getId = (a: Adresse | null | undefined): string => (a?.type ?? '') + '-' + (a?.by ?? '') + '-' + (a?.land ?? '')

  const [_newAdresse, _setNewAdresse] = useState<Adresse | undefined>(undefined)
  const [_newAdresseMessage, _setNewAdresseMessage] = useState<string | undefined>(undefined)

  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useLocalValidation<ValidationAddressProps>({}, validateAdresse)
  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Adresse>(getId)

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
    _setNewAdresseMessage(undefined)
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (index: number) => {
    const newAdresser: Array<Adresse> = _.cloneDeep(adresser)
    const deletedAddresses: Array<Adresse> = newAdresser.splice(index, 1)
    if (deletedAddresses && deletedAddresses.length > 0) {
      removeFromDeletion(deletedAddresses[0])
    }
    dispatch(updateReplySed(target, newAdresser))
    standardLogger('svarsed.editor.adresse.remove')
  }

  const onAdd = () => {
    const valid: boolean = performValidation({
      adresse: _newAdresse,
      namespace,
      checkAdresseType: true,
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

  const renderRow = (_adresse: Adresse | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(_adresse)
    const idx = getIdx(index)
    return (
      <>
        <RepeatableRow className={classNames({ new: index < 0 })}>
          {index < 0 && _newAdresseMessage && (
            <div>
              <BodyLong>{_newAdresseMessage}</BodyLong>
              <VerticalSeparatorDiv />
            </div>
          )}
          <AdresseForm
            key={namespace + idx + getId(index < 0 ? _newAdresse : _adresse)}
            namespace={namespace + idx}
            adresse={index < 0 ? _newAdresse : _adresse}
            onAdressChanged={(a: Adresse, type: string | undefined) => setAdresse(a, type, index)}
            validation={index < 0 ? _validation : validation}
          />
          <AlignStartRow>
            <AlignEndColumn>
              <AddRemovePanel
                candidateForDeletion={candidateForDeletion}
                existingItem={(index >= 0)}
                onBeginRemove={() => addToDeletion(_adresse)}
                onConfirmRemove={() => onRemove(index)}
                onCancelRemove={() => removeFromDeletion(_adresse)}
                onAddNew={onAdd}
                onCancelNew={onCancel}
              />
            </AlignEndColumn>
          </AlignStartRow>
          <VerticalSeparatorDiv size='2' />
        </RepeatableRow>
      </>
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
      <VerticalSeparatorDiv size='2' />
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
