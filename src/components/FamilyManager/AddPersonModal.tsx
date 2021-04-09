

import { setReplySed } from 'actions/svarpased'
import Add from 'assets/icons/Add'
import Barn from 'assets/icons/Child'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Select from 'components/Select/Select'
import { AlignStartRow, FlexCenterDiv, FlexDiv, PaddedDiv } from 'components/StyledComponents'
import { Option } from 'declarations/app'
import { F002Sed, PersonInfo, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { Hovedknapp, Knapp } from 'nav-frontend-knapper'
import Lukknapp from 'nav-frontend-lukknapp'
import NavModal from 'nav-frontend-modal'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastInput, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

const ModalDiv = styled(NavModal)`
  width: auto !important;
  height: auto !important;
`
const CloseButton = styled(Lukknapp)`
  position: absolute !important;
  right: 0.5rem;
  top: 0.5rem;
  z-index: 999;
`
const Title = styled(Undertittel)`
  text-align: center;
`
const ModalButtons = styled.div`
  text-align: center;
`
const MainButton = styled(Hovedknapp)`
  margin-right: 1rem;
  margin-bottom: 1rem;
`
const OtherButton = styled(Knapp)`
  margin-right: 1rem;
  margin-bottom: 1rem;
`
const CheckboxDiv = styled.div`
  display: flex;
  justify-content: space-between;
  .skjemaelement {
     display: flex;
  }
  width: 100%;
`
interface MyOption extends Option {
  isDisabled: boolean
}

interface AddPersonModalProps {
  appElement?: any
  highContrast: boolean
  onModalClose?: () => void
  closeButton?: boolean
  replySed: ReplySed
}

const AddPersonModal: React.FC<AddPersonModalProps> = ({
  appElement = document.body,
  highContrast,
  closeButton,
  onModalClose,
  replySed
}: AddPersonModalProps) => {
  const { t } = useTranslation()
  const [_confirmDelete, setConfirmDelete] = useState<Array<string>>([])
  const [_newPersonFnr, setNewPersonFnr] = useState<string>('')
  const [_newPersonName, setNewPersonName] = useState<string>('')
  const [_newPersonRelation, setNewPersonRelation] = useState<string | undefined>(undefined)
  const [_replySed, _setReplySed] = useState<ReplySed>(replySed)
  const componentRef = useRef(null)
  const [_validation, setValidation] = useState<Validation>({})
  const dispatch = useDispatch()
  const namespace = 'familymanager-addpersonmodal'

  const brukerNr = 0
  const ektefelleNr = brukerNr + ((_replySed as F002Sed).ektefelle ? 1 : 0)
  const annenPersonNr = ektefelleNr + ((_replySed as F002Sed).annenPerson ? 1 : 0)
  const barnNr = annenPersonNr + ((_replySed as F002Sed).barn ? 1 : 0)

  const resetValidation = (key: string): void => {
    setValidation({
      ..._validation,
      [key]: undefined
    })
  }

  const hasNoValidationErrors = (validation: Validation): boolean => _.find(validation, (it) => (it !== undefined)) === undefined

  const performValidation = (): boolean => {
    const newValidation: Validation = {}
    if (!_newPersonFnr) {
      newValidation[namespace + '-fnr'] = {
        feilmelding: t('message:validation-noFnr'),
        skjemaelementId: 'c-' + namespace + '-fnr-text'
      }
    }
    if (_newPersonFnr && !_newPersonFnr.match(/^\d{11}$/)) {
      newValidation[namespace + '-fnr'] = {
        feilmelding: t('message:validation-invalidFnr'),
        skjemaelementId: 'c-' + namespace + '-fnr-text'
      }
    }
    if (!_newPersonName) {
      newValidation[namespace + '-navn'] = {
        feilmelding: t('message:validation-noName'),
        skjemaelementId: 'c-' + namespace + '-navn-text'
      }
    }
    if (!_newPersonName) {
      newValidation[namespace + '-relasjon'] = {
        feilmelding: t('message:validation-noRelation'),
        skjemaelementId: 'c-' + namespace + '-relasjon-text'
      }
    }
    setValidation(newValidation)
    return hasNoValidationErrors(newValidation)
  }

  const addCandidateForDeletion = (key: string) => {
    setConfirmDelete(_confirmDelete.concat(key))
  }

  const removeCandidateForDeletion = (key: string) => {
    setConfirmDelete(_.filter(_confirmDelete, it => it !== key))
  }

  const closeModal = (): void => {
    if (_.isFunction(onModalClose)) {
      onModalClose()
    }
  }

  const onCloseButtonClicked = (e: React.MouseEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    if (_.isFunction(onModalClose)) {
      onModalClose()
    }
  }

  NavModal.setAppElement(appElement)

  const onRemovePerson = (personID: string) => {
    const newReplySed = _.cloneDeep(_replySed)
    _.unset(newReplySed, personID)
    if ((newReplySed as F002Sed).barn && personID.startsWith('barn[')) {
      // _unset leaves null values on array, trim them
      (newReplySed as F002Sed).barn = _.filter((newReplySed as F002Sed).barn, (b: any) => !_.isNil(b))
    }
    _setReplySed(newReplySed)
  }

  const onNewPersonFnrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetValidation(namespace + '-fnr')
    setNewPersonFnr(e.target.value)
  }

  const onNewPersonNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetValidation(namespace + '-navn')
    setNewPersonName(e.target.value)
  }

  const onNewPersonRelationChange = (e: any) => {
    resetValidation(namespace + '-relasjon')
    setNewPersonRelation(e.value)
  }

  const resetForm = () => {
    setNewPersonFnr('')
    setNewPersonName('')
    setNewPersonRelation('')
    setValidation({})
  }

  const onNewPersonAdd = () => {
    if (performValidation()) {
      const newReplySed = _.cloneDeep(_replySed)
      const personInfo: PersonInfo = {
        fornavn: _newPersonName,
        etternavn: '',
        foedselsdato: '',
        kjoenn: 'U',
        statsborgerskap: [],
        pin: [{
          identifikator: _newPersonFnr
        }]
      }
      if (_newPersonRelation === 'barn') {
        if (!Object.prototype.hasOwnProperty.call(newReplySed, 'barn')) {
          (newReplySed as F002Sed).barn = [{
            personInfo: personInfo
          }]
        } else {
          (newReplySed as F002Sed).barn.push({
            personInfo: personInfo
          })
        }
      }
      if (_newPersonRelation === 'bruker') {
        newReplySed.bruker = {
          personInfo: personInfo
        }
      }
      if (_newPersonRelation === 'ektefelle') {
        (newReplySed as F002Sed).ektefelle = {
          personInfo: personInfo
        }
      }
      if (_newPersonRelation === 'annenPerson') {
        (newReplySed as F002Sed).annenPerson = {
          personInfo: personInfo
        }
      }
      _setReplySed(newReplySed)
      resetForm()
    }
  }

  const onSavePersons = () => {
    dispatch(setReplySed(_replySed))
  }

  const relationOptions: Array<MyOption> = []

  relationOptions.push({
    label: t('el:option-relationship-bruker') + (_replySed.bruker ? '(' + t('label:not-available') + ')' : ''),
    value: 'bruker',
    isDisabled: !!_replySed.bruker
  })

  relationOptions.push({
    label: t('el:option-relationship-ektefelle') + ((_replySed as F002Sed).ektefelle ? '(' + t('label:not-available') + ')' : ''),
    value: 'ektefelle',
    isDisabled: !!(_replySed as F002Sed).ektefelle
  })

  relationOptions.push({
    label: t('el:option-relationship-annenPerson') + ((_replySed as F002Sed).annenPerson ? '(' + t('label:not-available') + ')' : ''),
    value: 'annenPerson',
    isDisabled: !!(_replySed as F002Sed).annenPerson
  })

  relationOptions.push({
    label: t('el:option-relationship-barn'),
    value: 'barn',
    isDisabled: false
  })

  const getPersonLabel = (personId: string): string => {
    const id = personId.startsWith('barn[') ? 'barn' : personId
    return t('el:option-relationship-' + id)
  }

  const renderPerson = (personId: string, i: number) => {
    const p = _.get(_replySed, `${personId}.personInfo`)
    const candidateForDeletion = _confirmDelete.indexOf(personId) >= 0

    return (
      <FlexDiv className='slideInFromLeft' style={{ animationDelay: i * 0.1 + 's' }} key={personId}>
        <CheckboxDiv>
          <FlexCenterDiv>
            <Normaltekst>
              {p?.fornavn + ' ' + p?.etternavn + ' (' + getPersonLabel(personId) + ')'}
            </Normaltekst>
            {personId.startsWith('barn[') && (
              <>
                <HorizontalSeparatorDiv data-size='0.5' />
                <Barn />
              </>
            )}
          </FlexCenterDiv>
          <AddRemovePanel
            existingItem={true}
            candidateForDeletion={candidateForDeletion}
            onBeginRemove={() => addCandidateForDeletion(personId)}
            onConfirmRemove={() => onRemovePerson(personId)}
            onCancelRemove={() => removeCandidateForDeletion(personId!)}
          />
        </CheckboxDiv>
      </FlexDiv>
    )
  }

  return (
    <ModalDiv
      ref={componentRef}
      isOpen
      onRequestClose={closeModal}
      closeButton
      contentLabel='contentLabel'
    >
      <PaddedDiv>
        {closeButton && (
          <CloseButton
            onClick={onCloseButtonClicked}
          >
            {t('el:button-close')}
          </CloseButton>
        )}
        <Title>
          {t('el:title-add-remove-persons')}
        </Title>
        <VerticalSeparatorDiv data-size='2'/>
        <>
          {_replySed.bruker && renderPerson('bruker', brukerNr)}
          {(_replySed as F002Sed).ektefelle && renderPerson('ektefelle', ektefelleNr)}
          {(_replySed as F002Sed).annenPerson && renderPerson('annenPerson', annenPersonNr)}
          {(_replySed as F002Sed).barn && (_replySed as F002Sed).barn.map((b: any, i: number) => renderPerson(`barn[${i}]`, barnNr + i))}
          <VerticalSeparatorDiv/>
          <hr />
          <VerticalSeparatorDiv data-size='2' />
          <Undertittel>
            {t('el:button-add-new-x', { x: t('label:person').toLowerCase() })}
          </Undertittel>
          <VerticalSeparatorDiv />
          <AlignStartRow className='slideInFromLeft'>
            <Column>
              <HighContrastInput
                data-test-id={'c-' + namespace + '-fnr-text'}
                feil={_validation[namespace + '-fnr']?.feilmelding}
                id={'c-' + namespace + '-fnr-text'}
                label={t('label:fnr-dnr')}
                onChange={onNewPersonFnrChange}
                placeholder={t('el:placeholder-input-default')}
                value={_newPersonFnr}
              />
              <HorizontalSeparatorDiv />
            </Column>
            <Column>
              <HighContrastInput
                data-test-id={'c-' + namespace + '-navn-text'}
                feil={_validation[namespace + '-navn']?.feilmelding}
                id={'c-' + namespace + '-navn-text'}
                label={t('label:name')}
                onChange={onNewPersonNameChange}
                placeholder={t('el:placeholder-input-default')}
                value={_newPersonName}
              />
              <HorizontalSeparatorDiv />
            </Column>
            <Column>
              <Select
                data-test-id={'c-' + namespace + '-relasjon-text'}
                feil={_validation[namespace + '-relasjon']?.feilmelding}
                id={'c-' + namespace + '-relasjon-text'}
                highContrast={highContrast}
                label={t('label:family-relationship')}
                menuPlacement='top'
                menuPortalTarget={document.body}
                onChange={onNewPersonRelationChange}
                options={relationOptions}
                placeholder={t('el:placeholder-select-default')}
                selectedValue={_.find(relationOptions, o => o.value === _newPersonRelation)}
                defaultValue={_.find(relationOptions, o => o.value === _newPersonRelation)}
              />
              <HorizontalSeparatorDiv />
            </Column>
            <Column>
              <div className='nolabel'>
                <Knapp
                  mini
                  kompakt
                  onClick={onNewPersonAdd}
                >
                  <Add width={20} />
                  <HorizontalSeparatorDiv />
                  {t('el:button-add')}
                </Knapp>
              </div>
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
        </>
        <ModalButtons>
          <MainButton
            id='c-modal__main-button-id'
            onClick={() => {
              onSavePersons()
              closeModal()
            }}
          >
            {t('el:button-save')}
          </MainButton>
          <HorizontalSeparatorDiv />
          <OtherButton
            id='c-modal__other-button-id'
            onClick={closeModal}
          >
            {t('el:button-cancel')}
          </OtherButton>
        </ModalButtons>
      </PaddedDiv>
    </ModalDiv>
  )
}

export default AddPersonModal
