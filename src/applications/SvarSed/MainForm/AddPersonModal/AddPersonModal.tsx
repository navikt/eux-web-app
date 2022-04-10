import { Add, Child } from '@navikt/ds-icons'
import {
  validateAddPersonModal,
  ValidationAddPersonModalProps
} from 'applications/SvarSed/MainForm/AddPersonModal/validation'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import { Option } from 'declarations/app'
import { F002Sed, PersonInfo, ReplySed } from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { Modal as NavModal, BodyLong, Heading, Button } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  FlexBaseSpacedDiv,
  FlexCenterSpacedDiv,
  FlexDiv,
  HorizontalSeparatorDiv,
  PaddedDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

const ModalDiv = styled(NavModal)`
  width: auto !important;
  height: auto !important;
`
const ModalButtons = styled.div`
  text-align: center;
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

interface AddPersonModalProps {
  appElement?: any
  onModalClose?: () => void
  closeButton?: boolean
  parentNamespace: string
  replySed: ReplySed | null | undefined
  setReplySed: (replySed: ReplySed) => void
}

const AddPersonModal: React.FC<AddPersonModalProps> = ({
  onModalClose = () => {},
  parentNamespace,
  replySed,
  setReplySed
}: AddPersonModalProps) => {
  const { t } = useTranslation()
  const namespace = `${parentNamespace}-addpersonmodal`
  const dispatch = useDispatch()

  const [_newPersonFnr, _setNewPersonFnr] = useState<string>('')
  const [_newPersonName, _setNewPersonName] = useState<string>('')
  const [_newPersonRelation, _setNewPersonRelation] = useState<string | undefined>(undefined)
  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<PersonInfo>((p: PersonInfo) => p?.fornavn + ' ' + (p?.etternavn ?? ''))
  const [_replySed, _setReplySed] = useState<ReplySed | null | undefined>(replySed)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationAddPersonModalProps>({}, validateAddPersonModal)

  const brukerNr = 0
  const ektefelleNr = brukerNr + ((_replySed as F002Sed).ektefelle ? 1 : 0)
  const annenPersonNr = ektefelleNr + ((_replySed as F002Sed).annenPerson ? 1 : 0)
  const barnNr = annenPersonNr + ((_replySed as F002Sed).barn ? 1 : 0)

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

  const onNewPersonRelationChange = (o: unknown) => {
    _resetValidation(namespace + '-relasjon')
    _setNewPersonRelation((o as Option).value.trim())
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
          (newReplySed as F002Sed).barn?.push({
            personInfo: personInfo
          })
        }
      }
      if (_newPersonRelation === 'bruker') {
        newReplySed!.bruker = {
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
    if (!_.isEmpty(replySed?.bruker) && _.isEmpty(_replySed?.bruker)) {
      standardLogger('svarsed.editor.personmodal.remove', { person: 'bruker' })
    }
    if (_.isEmpty(replySed?.bruker) && !_.isEmpty(_replySed?.bruker)) {
      standardLogger('svarsed.editor.personmodal.add', { person: 'bruker' })
    }
    if (!_.isEmpty((replySed as F002Sed).ektefelle) && _.isEmpty((replySed as F002Sed).ektefelle)) {
      standardLogger('svarsed.editor.personmodal.remove', { person: 'ektefelle' })
    }
    if (_.isEmpty((replySed as F002Sed).ektefelle) && !_.isEmpty((replySed as F002Sed).ektefelle)) {
      standardLogger('svarsed.editor.personmodal.add', { person: 'ektefelle' })
    }
    if (!_.isEmpty((replySed as F002Sed).annenPerson) && _.isEmpty((replySed as F002Sed).annenPerson)) {
      standardLogger('svarsed.editor.personmodal.remove', { person: 'annenPerson' })
    }
    if (_.isEmpty((replySed as F002Sed).annenPerson) && !_.isEmpty((replySed as F002Sed).annenPerson)) {
      standardLogger('svarsed.editor.personmodal.add', { person: 'annenPerson' })
    }
    const numberOfOriginalBarn = (_replySed as F002Sed)?.barn?.length ?? 0
    const numberOfNewBarn = (replySed as F002Sed)?.barn?.length ?? 0

    if (numberOfOriginalBarn !== numberOfNewBarn) {
      if (numberOfOriginalBarn < numberOfNewBarn) {
        for (let i = 0; i < (numberOfNewBarn - numberOfOriginalBarn); i++) {
          standardLogger('svarsed.editor.personmodal.add', { person: 'barn' })
        }
      }
      if (numberOfOriginalBarn > numberOfNewBarn) {
        for (let j = 0; j < (numberOfOriginalBarn - numberOfNewBarn); j++) {
          standardLogger('svarsed.editor.personmodal.remove', { person: 'barn' })
        }
      }
    }
    dispatch(setReplySed(_replySed!))
  }

  const getRelationOptions = (): Array<Option> => {
    const relationOptions: Array<Option> = []
    relationOptions.push({
      label: t('el:option-familierelasjon-bruker') + (_replySed?.bruker
        ? '(' + t('label:ikke-tilgjengelig') + ')'
        : ''),
      value: 'bruker',
      isDisabled: !!_replySed?.bruker
    })

    relationOptions.push({
      label: t('el:option-familierelasjon-ektefelle') + ((_replySed as F002Sed).ektefelle
        ? '(' + t('label:ikke-tilgjengelig') + ')'
        : ''),
      value: 'ektefelle',
      isDisabled: !!(_replySed as F002Sed).ektefelle
    })

    relationOptions.push({
      label: t('el:option-familierelasjon-annenPerson') + ((_replySed as F002Sed).annenPerson
        ? '(' + t('label:ikke-tilgjengelig') + ')'
        : ''),
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
      <FlexDiv
        className='slideInFromLeft'
        style={{ animationDelay: i * 0.05 + 's' }}
        key={personId}
      >
        <CheckboxDiv>
          <FlexCenterSpacedDiv>
            <FlexBaseSpacedDiv>
              <BodyLong>
                {p?.fornavn + ' ' + (p?.etternavn ?? '')}
              </BodyLong>
              <HorizontalSeparatorDiv size='0.5' />
              <GreySpan>
                {'(' + getPersonLabel(personId) + ')'}
              </GreySpan>
            </FlexBaseSpacedDiv>
            {personId.startsWith('barn[') && (
              <>
                <HorizontalSeparatorDiv size='0.5' />
                <Child />
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
      open
      onClose={onModalClose}
    >
      <PaddedDiv id='add-person-modal-id'>
        <Heading size='small'>
          {t('label:legg-til-fjern-personer')}
        </Heading>
        <VerticalSeparatorDiv size='2' />
        <>
          {_replySed?.bruker && renderPerson('bruker', brukerNr)}
          {(_replySed as F002Sed).ektefelle && renderPerson('ektefelle', ektefelleNr)}
          {(_replySed as F002Sed).annenPerson && renderPerson('annenPerson', annenPersonNr)}
          {(_replySed as F002Sed).barn?.map((b: any, i: number) => renderPerson(`barn[${i}]`, barnNr + i))}
          <VerticalSeparatorDiv />
          <HorizontalLineSeparator />
          <VerticalSeparatorDiv size='2' />
          <Heading size='small'>
            {t('el:button-add-new-x', { x: t('label:person').toLowerCase() })}
          </Heading>
          <VerticalSeparatorDiv />
          <AlignStartRow className='slideInFromLeft'>
            <Column>
              <Input
                error={_validation[namespace + '-fnr']?.feilmelding}
                id='fnr'
                label={t('label:fnr-dnr')}
                namespace={namespace}
                onChanged={onNewPersonFnrChange}
                required
                value={_newPersonFnr}
              />
              <HorizontalSeparatorDiv />
            </Column>
            <Column>
              <Input
                error={_validation[namespace + '-navn']?.feilmelding}
                id='navn'
                namespace={namespace}
                label={t('label:navn')}
                onChanged={onNewPersonNameChange}
                required
                value={_newPersonName}
              />
              <HorizontalSeparatorDiv />
            </Column>
            <Column>
              <Select
                aria-label={t('label:familierelasjon')}
                key={namespace + '-relasjon-' + _newPersonRelation}
                data-testid={namespace + '-relasjon'}
                error={_validation[namespace + '-relasjon']?.feilmelding}
                id={namespace + '-relasjon'}
                label={t('label:familierelasjon')}
                onChange={onNewPersonRelationChange}
                options={relationOptions}
                value={_.find(relationOptions, o => o.value === _newPersonRelation)}
                defaultValue={_.find(relationOptions, o => o.value === _newPersonRelation)}
              />
              <HorizontalSeparatorDiv />
            </Column>
            <Column>
              <div className='nolabel'>
                <Button
                  variant='secondary'
                  onClick={onAdd}
                >
                  <Add width={20} />
                  <HorizontalSeparatorDiv />
                  {t('el:button-add')}
                </Button>
              </div>
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
        </>
        <ModalButtons>
          <Button
            variant='primary'
            onClick={() => {
              onSavePersons()
              onModalClose()
            }}
          >
            {t('el:button-save')}
          </Button>
          <HorizontalSeparatorDiv />
          <Button
            variant='secondary'
            onClick={onModalClose}
          >
            {t('el:button-cancel')}
          </Button>
        </ModalButtons>
      </PaddedDiv>
    </ModalDiv>
  )
}

export default AddPersonModal
