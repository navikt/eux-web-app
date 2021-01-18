import Tilsette from 'assets/icons/Tilsette'
import Trashcan from 'assets/icons/Trashcan'
import { FamilieRelasjon, Person } from 'declarations/types'
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
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  padding: 1rem 0.5rem;
`
const FlexDiv = styled.div`
  display: flex;
  align-items: center;
`

interface FamilyManagerModalProps {
  appElement?: any
  onModalClose?: () => void
  onPersonsChanged: (p: Array<Person | FamilieRelasjon>) => void
  closeButton?: boolean
  personPlusRelations: Array<Person | FamilieRelasjon>
}

const FamilyManagerModal: React.FC<FamilyManagerModalProps> = ({
   appElement = document.body,
   onModalClose,
   onPersonsChanged,
   closeButton,
   personPlusRelations
 }: FamilyManagerModalProps) => {

  const {t} = useTranslation()
  const [_extraPersons, setExtraPersons] = useState<Array<Person | FamilieRelasjon>>([])
  const [_newPersonFnr, setNewPersonFnr] = useState<string>('')
  const [_newPersonName, setNewPersonName] = useState<string>('')

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

  // TODO
  const onRemovePerson = (person: Person) => {
    const newPersons = _.filter(_extraPersons, f => f !== person)
    setExtraPersons(newPersons)
  }

  // TODO
  const onNewPersonFnrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPersonFnr(e.target.value)
  }

  // TODO
  const onNewPersonNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPersonName(e.target.value)
  }

  // TODO
  const onNewPersonAdd = () => {
    const newPersons = _extraPersons.concat({
      fnr: _newPersonFnr,
      fornavn: _newPersonName
    })
    setExtraPersons(newPersons)
  }

  const onSavePersons = () => {
    if (onPersonsChanged) {
      onPersonsChanged(_extraPersons)
    }
  }

  return (
    <ModalDiv
      isOpen={true}
      onRequestClose={closeModal}
      closeButton={true}
      contentLabel='contentLabel'
    >
      <div>
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
          {personPlusRelations.map(person => (
            <CheckboxDiv key={person.fnr}>
              <Normaltekst>
                {person?.fornavn + ' ' + person?.etternavn + ' (' + person?.kjoenn + ')'}
              </Normaltekst>
            </CheckboxDiv>
          ))}
          {_extraPersons.map(person => (
            <FlexDiv key={person.fnr}>
              <CheckboxDiv>
                <Normaltekst>
                  {person?.fornavn + ' ' + person?.etternavn + ' (' + person?.kjoenn + ')'}
                </Normaltekst>
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={() => onRemovePerson(person)}
                >
                  <Trashcan />
                  <HorizontalSeparatorDiv data-size='0.5' />
                  {t('ui:label-remove')}
                </HighContrastFlatknapp>
              </CheckboxDiv>
            </FlexDiv>
          ))}
          <hr/>
          <VerticalSeparatorDiv/>
          <Undertittel>
            {t('ui:label-add-new-person')}
          </Undertittel>
          <AlignCenterRow>
            <Column>
              <HighContrastInput
                data-test-id={'c-familymanager-personopplysninger-newperson-fnr-input'}
                id={'c-familymanager-personopplysninger-newperson-fnr'}
                onChange={onNewPersonFnrChange}
                value={_newPersonFnr}
                label={t('ui:label-fnr')}
              />
              <HorizontalSeparatorDiv/>
            </Column>
            <Column>
              <HighContrastInput
                data-test-id={'c-familymanager-personopplysninger-newperson-navn-input'}
                key={'c-familymanager-personopplysninger-newperson-navn-key'}
                id={'c-familymanager-personopplysninger-newperson-navn'}
                onChange={onNewPersonNameChange}
                value={_newPersonName}
                label={t('ui:label-name')}
              />
              <HorizontalSeparatorDiv/>
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
          <VerticalSeparatorDiv/>
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
          <HorizontalSeparatorDiv/>
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
