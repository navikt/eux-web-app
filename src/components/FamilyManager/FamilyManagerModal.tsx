import { setReplySed } from 'actions/svarpased'
import Barn from 'assets/icons/icon-barn'
import Tilsette from 'assets/icons/Tilsette'
import Trashcan from 'assets/icons/Trashcan'
import Select from 'components/Select/Select'
import { F002Sed, PersonInfo, ReplySed } from 'declarations/sed'
import _ from 'lodash'
import { Hovedknapp, Knapp } from 'nav-frontend-knapper'
import Lukknapp from 'nav-frontend-lukknapp'
import NavModal from 'nav-frontend-modal'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
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
const AlignCenterRow = styled(Row)`
   align-items: center;
`
const CheckboxDiv = styled.div`
  display: flex;
  justify-content: space-between;
  .skjemaelement {
     display: flex;
  }
  width: 100%;
  padding: 1rem 0.5rem;
`
const FlexDiv = styled.div`
  display: flex;
  align-items: center;
`

interface FamilyManagerModalProps {
  appElement?: any
  highContrast: boolean
  onModalClose?: () => void
  closeButton?: boolean
  replySed: ReplySed
}

const FamilyManagerModal: React.FC<FamilyManagerModalProps> = ({
  appElement = document.body,
  highContrast,
  closeButton,
  onModalClose,
  replySed
}: FamilyManagerModalProps) => {
  const { t } = useTranslation()
  const [_newPersonFnr, setNewPersonFnr] = useState<string>('')
  const [_newPersonName, setNewPersonName] = useState<string>('')
  const [_newPersonRelation, setNewPersonRelation] = useState<string | undefined>(undefined)
  const [_replySed, _setReplySed] = useState<ReplySed>(replySed)
  const componentRef = useRef(null)

  const dispatch = useDispatch()

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

  const onNewPersonFnrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPersonFnr(e.target.value)
  }

  const onNewPersonNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPersonName(e.target.value)
  }

  const onNewPersonRelationChange = (e: any) => {
    setNewPersonRelation(e.value)
  }

  const onNewPersonAdd = () => {
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
  }

  const onSavePersons = () => {
    dispatch(setReplySed(_replySed))
  }

  const relationOptions = []

  relationOptions.push({
    label: t('ui:relationship-bruker') + (_replySed.bruker ? '(' + t('ui:label-not-available') + ')' : ''),
    value: 'bruker',
    isDisabled: !!_replySed.bruker
  })

  relationOptions.push({
    label: t('ui:relationship-ektefelle') + ((_replySed as F002Sed).ektefelle ? '(' + t('ui:label-not-available') + ')' : ''),
    value: 'ektefelle',
    isDisabled: !!(_replySed as F002Sed).ektefelle
  })

  relationOptions.push({
    label: t('ui:relationship-annenPerson') + ((_replySed as F002Sed).annenPerson ? '(' + t('ui:label-not-available') + ')' : ''),
    value: 'annenPerson',
    isDisabled: !!(_replySed as F002Sed).annenPerson
  })

  relationOptions.push({
    label: t('ui:relationship-barn'),
    value: 'barn'
  })

  const getPersonLabel = (personId: string) => {
    const id = personId.startsWith('barn[') ? 'barn' : personId
    return t('ui:relationship-' + id)
  }

  const renderPerson = (personId: string, i: number) => {
    const p = _.get(_replySed, `${personId}.personInfo`)
    return (
      <FlexDiv className='slideAnimate' style={{ animationDelay: i * 0.1 + 's' }} key={personId}>
        <CheckboxDiv>
          <FlexDiv>
            <Normaltekst>
              {p?.fornavn + ' ' + p?.etternavn + ' (' + getPersonLabel(personId) + ')'}
            </Normaltekst>
            {personId.startsWith('barn[') && (
              <>
                <HorizontalSeparatorDiv data-size='0.5' />
                <Barn />
              </>
            )}
          </FlexDiv>
          <HighContrastFlatknapp
            mini
            kompakt
            onClick={() => onRemovePerson(personId)}
          >
            <Trashcan />
            <HorizontalSeparatorDiv data-size='0.5' />
            {t('ui:label-remove')}
          </HighContrastFlatknapp>
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
      <div id='xxx'>
        {closeButton && (
          <CloseButton
            onClick={onCloseButtonClicked}
          >
            {t('ui:close')}
          </CloseButton>
        )}
        <Title>
          {t('ui:label-add-remove-persons')}
        </Title>
        <>
          {_replySed.bruker && renderPerson('bruker', brukerNr)}
          {(_replySed as F002Sed).ektefelle && renderPerson('ektefelle', ektefelleNr)}
          {(_replySed as F002Sed).annenPerson && renderPerson('annenPerson', annenPersonNr)}
          {(_replySed as F002Sed).barn && (_replySed as F002Sed).barn.map((b: any, i: number) => renderPerson(`barn[${i}]`, barnNr + i))}
          <hr />
          <VerticalSeparatorDiv data-size='2' />
          <Undertittel>
            {t('ui:label-add-new-person')}
          </Undertittel>
          <VerticalSeparatorDiv />
          <AlignCenterRow>
            <Column>
              <HighContrastInput
                data-test-id='c-familymanager-personopplysninger-newperson-fnr-input'
                id='c-familymanager-personopplysninger-newperson-fnr'
                onChange={onNewPersonFnrChange}
                value={_newPersonFnr}
                label={t('ui:label-fnr-dnr')}
                placeholder={t('ui:placeholder-input-default')}
              />
              <HorizontalSeparatorDiv />
            </Column>
            <Column>
              <HighContrastInput
                data-test-id='c-familymanager-personopplysninger-newperson-navn-input'
                id='c-familymanager-personopplysninger-newperson-navn'
                onChange={onNewPersonNameChange}
                value={_newPersonName}
                label={t('ui:label-name')}
                placeholder={t('ui:placeholder-input-default')}
              />
              <HorizontalSeparatorDiv />
            </Column>
            <Column>
              <Select
                data-test-id='c-familymanager-personopplysninger-newperson-navn-input'
                id='c-familymanager-personopplysninger-newperson-navn'
                highContrast={highContrast}
                label={t('ui:label-familyRelationship')}
                onChange={onNewPersonRelationChange}
                options={relationOptions}
                placeholder={t('ui:placeholder-select-default')}
                selectedValue={_newPersonRelation}
                menuPlacement={'auto'}
              />
              <HorizontalSeparatorDiv />
            </Column>
            <Column>
              <Knapp
                data-test-id='c-familymanager-personopplysninger-newperson-button'
                id='c-familymanager-personopplysninger-newperson-button'
                onClick={onNewPersonAdd}
              >
                <Tilsette width={20} />
                <HorizontalSeparatorDiv />
                {t('ui:label-add')}
              </Knapp>
            </Column>
          </AlignCenterRow>
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
            {t('ui:label-save')}
          </MainButton>
          <HorizontalSeparatorDiv />
          <OtherButton
            id='c-modal__other-button-id'
            onClick={closeModal}
          >
            {t('ui:label-cancel')}
          </OtherButton>
        </ModalButtons>
      </div>
    </ModalDiv>
  )
}

export default FamilyManagerModal
