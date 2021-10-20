import { Add } from '@navikt/ds-icons'
import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { mapState } from 'applications/SvarSed/Formaal/FormålManager'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Adresse as IAdresse } from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  HighContrastFlatknapp,
  HorizontalSeparatorDiv,
  PaddedDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getIdx } from 'utils/namespace'
import Adresse from './Adresse'
import { validateAdresse, ValidationAddressProps } from './validation'

const Adresser: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  personName
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    replySed,
    validation
  } = useSelector<State, PersonManagerFormSelector>(mapState)
  const dispatch = useDispatch()
  const target = `${personID}.adresser`
  const adresses: Array<IAdresse> = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-adresser`

  const [_newAdresse, _setNewAdresse] = useState<IAdresse | undefined>(undefined)
  const getId = (a: IAdresse | null | undefined): string => (a?.type ?? '') + '-' + (a?.postnummer ?? '')
  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<IAdresse>(getId)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationAddressProps>({}, validateAdresse)

  const setAdresse = (adresse: IAdresse, index: number) => {
    if (index < 0) {
      _setNewAdresse(adresse)
    } else {
      dispatch(updateReplySed(`${target}[${index}]`, adresse))
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

  const onRemove = (index: number) => {
    const newAdresses: Array<IAdresse> = _.cloneDeep(adresses)
    const deletedAddresses: Array<IAdresse> = newAdresses.splice(index, 1)
    if (deletedAddresses && deletedAddresses.length > 0) {
      removeFromDeletion(deletedAddresses[0])
    }
    dispatch(updateReplySed(target, newAdresses))
    standardLogger('svarsed.editor.adresse.remove')
  }

  const onValidationReset = (fullnamespace: string, index: number) => {
    if (index < 0) {
      _resetValidation(fullnamespace)
    } else {
      if (validation[fullnamespace]) {
        dispatch(resetValidation(fullnamespace))
      }
    }
  }

  const onAdd = () => {
    const valid: boolean = performValidation({
      adresse: _newAdresse,
      namespace: namespace,
      personName: personName
    })
    if (valid) {
      let newAdresses: Array<IAdresse> = _.cloneDeep(adresses)
      if (_.isNil(newAdresses)) {
        newAdresses = []
      }
      newAdresses = newAdresses.concat(_newAdresse!)
      dispatch(updateReplySed(target, newAdresses))
      standardLogger('svarsed.editor.adresse.add')
      resetForm()
    }
  }

  const renderRow = (adresse: IAdresse | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(adresse)
    const idx = getIdx(index)
    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <Adresse
          key={namespace + idx + getId(index < 0 ? _newAdresse : adresse)}
          namespace={namespace + idx}
          adresse={index < 0 ? _newAdresse : adresse}
          onAdressChanged={(a: IAdresse) => setAdresse(a, index)}
          validation={index < 0 ? _validation : validation}
          resetValidation={(n: string) => onValidationReset(n, index)}
        />
        <AlignStartRow>
          <AlignEndColumn>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(adresse)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(adresse)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </AlignEndColumn>
        </AlignStartRow>
        <VerticalSeparatorDiv size='2' />
      </RepeatableRow>
    )
  }

  return (
    <PaddedDiv key={namespace + '-div'}>
      <Undertittel>
        {t('label:adresser')}
      </Undertittel>
      <VerticalSeparatorDiv size='2' />
      {_.isEmpty(adresses)
        ? (
          <Normaltekst>
            {t('message:warning-no-address')}
          </Normaltekst>
          )
        : adresses?.map(renderRow)}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <Row>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:adresse').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
    </PaddedDiv>
  )
}

export default Adresser
