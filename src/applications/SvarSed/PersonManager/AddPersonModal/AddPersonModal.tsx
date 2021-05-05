import { setReplySed } from 'actions/svarpased'
import {
  validateAddPersonModal,
  ValidationAddPersonModalProps
} from 'applications/SvarSed/PersonManager/AddPersonModal/validation'
import Add from 'assets/icons/Add'
import Barn from 'assets/icons/Child'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { AlignStartRow, FlexBaseSpacedDiv, FlexCenterSpacedDiv, FlexDiv, PaddedDiv } from 'components/StyledComponents'
import { Option } from 'declarations/app'
import { F002Sed, PersonInfo, ReplySed } from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { Hovedknapp, Knapp } from 'nav-frontend-knapper'
import Lukknapp from 'nav-frontend-lukknapp'
import NavModal from 'nav-frontend-modal'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import { Column, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { OptionTypeBase } from 'react-select'
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
const GreySpan = styled.span`
  color: grey;
  white-space: nowrap;
`

interface MyOption extends Option {
  isDisabled: boolean
}

interface AddPersonModalProps {
  appElement?: any
  highContrast: boolean
  onModalClose?: () => void
  closeButton?: boolean
  parentNamespace: string
  replySed: ReplySed
}

const AddPersonModal: React.FC<AddPersonModalProps> = ({
  appElement = document.body,
  highContrast,
  closeButton,
  onModalClose,
  parentNamespace,
  replySed
}: AddPersonModalProps) => {
  const { t } = useTranslation()
  const namespace = `${parentNamespace}-addpersonmodal`
  const dispatch = useDispatch()

  const [_newPersonFnr, _setNewPersonFnr] = useState<string>('')
  const [_newPersonName, _setNewPersonName] = useState<string>('')
  const [_newPersonRelation, _setNewPersonRelation] = useState<string | undefined>(undefined)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<PersonInfo>((p: PersonInfo) => {
    return p?.fornavn + ' ' + p?.etternavn
  })
  const [_replySed, _setReplySed] = useState<ReplySed>(replySed)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationAddPersonModalProps>({}, validateAddPersonModal)

  const brukerNr = 0
  const ektefelleNr = brukerNr + ((_replySed as F002Sed).ektefelle ? 1 : 0)
  const annenPersonNr = ektefelleNr + ((_replySed as F002Sed).annenPerson ? 1 : 0)
  const barnNr = annenPersonNr + ((_replySed as F002Sed).barn ? 1 : 0)

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

  const onNewPersonFnrChange = (fnr: string) => {
    _resetValidation(namespace + '-fnr')
    _setNewPersonFnr(fnr.trim())
  }

  const onNewPersonNameChange = (navn: string) => {
    _resetValidation(namespace + '-navn')
    _setNewPersonName(navn.trim())
  }

  const onNewPersonRelationChange = (o: OptionTypeBase) => {
    _resetValidation(namespace + '-relasjon')
    _setNewPersonRelation(o.value.trim())
  }

  const resetForm = () => {
    _setNewPersonFnr('')
    _setNewPersonName('')
    _setNewPersonRelation('')
    _resetValidation()
  }

  const onAdd = () => {
    const valid: boolean = performValidation({
      fnr: _newPersonFnr,
      navn: _newPersonName,
      relasjon: _newPersonRelation,
      namespace
    })
    if (valid) {
      const newReplySed = _.cloneDeep(_replySed)
      const personInfo: PersonInfo = {
        fornavn: _newPersonName.trim(),
        etternavn: '',
        foedselsdato: '',
        kjoenn: 'U',
        statsborgerskap: [],
        pin: [{
          identifikator: _newPersonFnr.trim()
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

  const getRelationOptions = (): Array<MyOption> => {
    const relationOptions: Array<MyOption> = []
    relationOptions.push({
      label: t('el:option-familierelasjon-bruker') + (_replySed.bruker ? '(' + t('label:ikke-tilgjengelig') + ')' : ''),
      value: 'bruker',
      isDisabled: !!_replySed.bruker
    })

    relationOptions.push({
      label: t('el:option-familierelasjon-ektefelle') + ((_replySed as F002Sed).ektefelle ? '(' + t('label:ikke-tilgjengelig') + ')' : ''),
      value: 'ektefelle',
      isDisabled: !!(_replySed as F002Sed).ektefelle
    })

    relationOptions.push({
      label: t('el:option-familierelasjon-annenPerson') + ((_replySed as F002Sed).annenPerson ? '(' + t('label:ikke-tilgjengelig') + ')' : ''),
      value: 'annenPerson',
      isDisabled: !!(_replySed as F002Sed).annenPerson
    })

    relationOptions.push({
      label: t('el:option-familierelasjon-barn'),
      value: 'barn',
      isDisabled: false
    })
    return relationOptions
  }

  const relationOptions = getRelationOptions()

  const getPersonLabel = (personId: string): string => {
    const id = personId.startsWith('barn[') ? 'barn' : personId
    return t('el:option-familierelasjon-' + id)
  }

  const renderPerson = (personId: string, i: number) => {
    const p: PersonInfo = _.get(_replySed, `${personId}.personInfo`)
    const candidateForDeletion = isInDeletion(p)

    return (
      <FlexDiv className='slideInFromLeft' style={{ animationDelay: i * 0.1 + 's' }} key={personId}>
        <CheckboxDiv>
          <FlexCenterSpacedDiv>
            <FlexBaseSpacedDiv>
              <Normaltekst>
                {p?.fornavn + ' ' + p?.etternavn}
              </Normaltekst>
              <HorizontalSeparatorDiv data-size='0.5' />
              <GreySpan>
                {'(' + getPersonLabel(personId) + ')'}
              </GreySpan>
            </FlexBaseSpacedDiv>
            {personId.startsWith('barn[') && (
              <>
                <HorizontalSeparatorDiv data-size='0.5' />
                <Barn />
              </>
            )}
          </FlexCenterSpacedDiv>
          <AddRemovePanel
            existingItem
            candidateForDeletion={candidateForDeletion}
            onBeginRemove={() => addToDeletion(p)}
            onConfirmRemove={() => onRemovePerson(personId)}
            onCancelRemove={() => removeFromDeletion(p)}
          />
        </CheckboxDiv>
      </FlexDiv>
    )
  }

  return (
    <ModalDiv
      isOpen
      onRequestClose={closeModal}
      closeButton
      contentLabel='contentLabel'
    >
      <PaddedDiv id='add-person-modal-id'>
        {closeButton && (
          <CloseButton
            onClick={onCloseButtonClicked}
          >
            {t('el:button-close')}
          </CloseButton>
        )}
        <Title>
          {t('label:legg-til-fjern-personer')}
        </Title>
        <VerticalSeparatorDiv data-size='2' />
        <>
          {_replySed.bruker && renderPerson('bruker', brukerNr)}
          {(_replySed as F002Sed).ektefelle && renderPerson('ektefelle', ektefelleNr)}
          {(_replySed as F002Sed).annenPerson && renderPerson('annenPerson', annenPersonNr)}
          {(_replySed as F002Sed).barn && (_replySed as F002Sed).barn.map((b: any, i: number) => renderPerson(`barn[${i}]`, barnNr + i))}
          <VerticalSeparatorDiv />
          <hr />
          <VerticalSeparatorDiv data-size='2' />
          <Undertittel>
            {t('el:button-add-new-x', { x: t('label:person').toLowerCase() })}
          </Undertittel>
          <VerticalSeparatorDiv />
          <AlignStartRow className='slideInFromLeft'>
            <Column>
              <Input
                feil={_validation[namespace + '-fnr']?.feilmelding}
                namespace={namespace}
                id='fnr'
                label={t('label:fnr-dnr')}
                onChanged={onNewPersonFnrChange}
                value={_newPersonFnr}
              />
              <HorizontalSeparatorDiv />
            </Column>
            <Column>
              <Input
                feil={_validation[namespace + '-navn']?.feilmelding}
                namespace={namespace}
                id='navn'
                label={t('label:navn')}
                onChanged={onNewPersonNameChange}
                value={_newPersonName}
              />
              <HorizontalSeparatorDiv />
            </Column>
            <Column>
              <Select
                data-test-id={namespace + '-relasjon'}
                feil={_validation[namespace + '-relasjon']?.feilmelding}
                id={namespace + '-relasjon'}
                highContrast={highContrast}
                label={t('label:familierelasjon')}
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
                  onClick={onAdd}
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
            id='modal__main-button-id'
            onClick={() => {
              onSavePersons()
              closeModal()
            }}
          >
            {t('el:button-save')}
          </MainButton>
          <HorizontalSeparatorDiv />
          <OtherButton
            id='modal__other-button-id'
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
