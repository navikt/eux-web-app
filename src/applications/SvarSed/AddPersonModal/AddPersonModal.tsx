import { AddCircle, Child } from '@navikt/ds-icons'
import { BodyLong, Button, Heading, Modal as NavModal } from '@navikt/ds-react'
import { ActionWithPayload } from '@navikt/fetch'
import {
  AlignStartRow,
  Column,
  FlexBaseSpacedDiv,
  FlexCenterSpacedDiv,
  FlexDiv,
  FlexRadioPanels,
  HorizontalSeparatorDiv,
  PaddedDiv,
  RadioPanel,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { validateAddPersonModal, ValidationAddPersonModalProps } from 'applications/SvarSed/AddPersonModal/validation'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import DateField from 'components/DateField/DateField'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { GrayPanel, HorizontalLineSeparator } from 'components/StyledComponents'
import { Option } from 'declarations/app'
import { F002Sed, Kjoenn, PersonInfo } from 'declarations/sed'
import { StorageTypes } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'store'
import styled from 'styled-components'

const ModalDiv = styled(NavModal)`
  width: auto !important;
  height: auto !important;
`
const ModalButtons = styled.div`
  text-align: left;
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

interface AddPersonModalProps<T> {
  appElement?: any
  open: boolean
  onModalClose: () => void
  closeButton?: boolean
  parentNamespace: string
  replySed: T | null | undefined
  setReplySed: (replySed: T) => ActionWithPayload<T>
}

const AddPersonModal = <T extends StorageTypes>({
  open,
  onModalClose,
  parentNamespace,
  replySed,
  setReplySed
}: AddPersonModalProps<T>) => {
  const { t } = useTranslation()
  const namespace = `${parentNamespace}-addpersonmodal`
  const dispatch = useAppDispatch()

  const [_newPersonFnr, _setNewPersonFnr] = useState<string>('')
  const [_newPersonFornavn, _setNewPersonFornavn] = useState<string>('')
  const [_newPersonEtternavn, _setNewPersonEtternavn] = useState<string>('')
  const [_newPersonFodselsdato, _setNewPersonFodselsdato] = useState<string>('')
  const [_newPersonKjoenn, _setNewPersonKjoenn] = useState<string>('')
  const [_newPersonRelation, _setNewPersonRelation] = useState<string | undefined>(undefined)
  const [_replySed, _setReplySed] = useState<T | null | undefined>(replySed)
  const [_validation, _resetValidation, performValidation] = useLocalValidation<ValidationAddPersonModalProps>(validateAddPersonModal, namespace)

  useEffect(() => {
    _setReplySed(replySed)
  }, [replySed])

  const onRemovePerson = (personID: string) => {
    const newReplySed = _.cloneDeep(_replySed)
    _.unset(newReplySed, personID)
    if ((newReplySed as F002Sed).barn && personID.startsWith('barn[')) {
      // _unset leaves null values on array, trim them
      (newReplySed as F002Sed).barn = _.filter((newReplySed as F002Sed).barn, (b: any) => !_.isNil(b))
    }
    _setReplySed(newReplySed)
  }

  const setFnr = (fnr: string) => {
    _resetValidation(namespace + '-fnr')
    _setNewPersonFnr(fnr.trim())
  }

  const setFornavn = (navn: string) => {
    _resetValidation(namespace + '-fornavn')
    _setNewPersonFornavn(navn.trim())
  }

  const setEtternavn = (navn: string) => {
    _resetValidation(namespace + '-etternavn')
    _setNewPersonEtternavn(navn.trim())
  }

  const setFoedselsdato = (fdato: string) => {
    _resetValidation(namespace + '-fdato')
    _setNewPersonFodselsdato(fdato.trim())
  }

  const setKjoenn = (kjoenn: string) => {
    _resetValidation(namespace + '-kjoenn')
    _setNewPersonKjoenn(kjoenn.trim())
  }

  const setRelation = (o: unknown) => {
    _resetValidation(namespace + '-relasjon')
    _setNewPersonRelation((o as Option).value.trim())
  }

  const resetForm = () => {
    _setNewPersonFnr('')
    _setNewPersonFornavn('')
    _setNewPersonEtternavn('')
    _setNewPersonFodselsdato('')
    _setNewPersonKjoenn('')
    _setNewPersonRelation('')
    _resetValidation()
  }

  const onAdd = () => {
    const valid: boolean = performValidation({
      fnr: _newPersonFnr.trim(),
      fornavn: _newPersonFornavn.trim(),
      etternavn: _newPersonEtternavn.trim(),
      fdato: _newPersonFodselsdato.trim(),
      kjoenn: _newPersonKjoenn.trim(),
      relasjon: _newPersonRelation?.trim()
    })
    if (valid) {
      const newReplySed = _.cloneDeep(_replySed)
      const personInfo: PersonInfo = {
        fornavn: _newPersonFornavn.trim(),
        etternavn: _newPersonEtternavn.trim(),
        foedselsdato: _newPersonFodselsdato.trim(),
        kjoenn: _newPersonKjoenn.trim() as Kjoenn,
        statsborgerskap: [],
        pin: [{
          land: "NO",
          identifikator: _newPersonFnr.trim()
        }]
      } as PersonInfo
      if (_newPersonRelation === 'barn') {
        if (!Object.prototype.hasOwnProperty.call(newReplySed, 'barn')) {
          (newReplySed as F002Sed).barn = [{
            personInfo
          }]
        } else {
          (newReplySed as F002Sed).barn?.push({
            personInfo
          })
        }
      }
      if (_newPersonRelation === 'bruker') {
        newReplySed!.bruker = {
          personInfo
        }
      }
      if (_newPersonRelation === 'ektefelle') {
        (newReplySed as F002Sed).ektefelle = {
          personInfo
        }
      }
      if (_newPersonRelation === 'annenPerson') {
        (newReplySed as F002Sed).annenPerson = {
          personInfo
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
    dispatch(setReplySed(_replySed as T))
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

  const renderPerson = (personId: string) => {
    const p: PersonInfo = _.get(_replySed, `${personId}.personInfo`)

    return (
      <FlexDiv key={personId}>
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
          <AddRemovePanel<PersonInfo>
            item={p}
            index={0}
            allowEdit={false}
            onRemove={() => onRemovePerson(personId)}
          />
        </CheckboxDiv>
      </FlexDiv>
    )
  }

  const modalClose = () => {
    resetForm()
    onModalClose()
  }

  return (
    <ModalDiv
      open={open}
      onClose={modalClose}
    >
      <PaddedDiv id='add-person-modal-id'>
        <Heading size='small'>
          {t('label:legg-til-fjern-personer')}
        </Heading>
        <VerticalSeparatorDiv size='2' />
        <>
          {_replySed?.bruker && renderPerson('bruker')}
          {(_replySed as F002Sed).ektefelle && renderPerson('ektefelle')}
          {(_replySed as F002Sed).annenPerson && renderPerson('annenPerson')}
          {(_replySed as F002Sed).barn?.map((b: any, i: number) => renderPerson(`barn[${i}]`))}
          <VerticalSeparatorDiv />
          <HorizontalLineSeparator />
          <VerticalSeparatorDiv size='2' />
          <GrayPanel>
            <Heading size='small'>
              {t('el:button-add-new-x', { x: t('label:person').toLowerCase() })}
            </Heading>
            <VerticalSeparatorDiv />
            <HorizontalLineSeparator />
            <VerticalSeparatorDiv />
            <AlignStartRow>
              <Column>
                <Input
                  error={_validation[namespace + '-fornavn']?.feilmelding}
                  id='fornavn'
                  namespace={namespace}
                  label={t('label:fornavn')}
                  onChanged={setFornavn}
                  required
                  value={_newPersonFornavn}
                />
                <HorizontalSeparatorDiv />
              </Column>
              <Column>
                <Input
                  error={_validation[namespace + '-etternavn']?.feilmelding}
                  id='etternavn'
                  namespace={namespace}
                  label={t('label:etternavn')}
                  onChanged={setEtternavn}
                  required
                  value={_newPersonEtternavn}
                />
                <HorizontalSeparatorDiv />
              </Column>
              <Column>
                <DateField
                  error={_validation[namespace + '-fdato']?.feilmelding}
                  id='fdato'
                  namespace={namespace}
                  label={t('label:fødselsdato')}
                  onChanged={setFoedselsdato}
                  required
                  dateValue={_newPersonFodselsdato}
                />
                <HorizontalSeparatorDiv />
              </Column>
              <Column>
                <Input
                  error={_validation[namespace + '-fnr']?.feilmelding}
                  id='fnr'
                  label={t('label:fnr-dnr')}
                  namespace={namespace}
                  onChanged={setFnr}
                  value={_newPersonFnr}
                />
                <HorizontalSeparatorDiv />
              </Column>
            </AlignStartRow>
            <AlignStartRow>
              <Column flex='1.5'>
                <RadioPanelGroup
                  value={_newPersonKjoenn}
                  data-no-border
                  data-testid={namespace + '-kjoenn'}
                  error={_validation[namespace + '-kjoenn']?.feilmelding}
                  id={namespace + '-kjoenn'}
                  legend={t('label:kjønn') + ' *'}
                  name={namespace + '-kjoenn'}
                  onChange={setKjoenn}
                >
                  <FlexRadioPanels>
                    <RadioPanel value='M'>
                      {t(_newPersonRelation?.startsWith('barn') ? 'label:gutt' : 'label:mann')}
                    </RadioPanel>
                    <RadioPanel value='K'>
                      {t(_newPersonRelation?.startsWith('barn') ? 'label:jente' : 'label:kvinne')}
                    </RadioPanel>
                    <RadioPanel value='U'>
                      {t('label:ukjent')}
                    </RadioPanel>
                  </FlexRadioPanels>
                </RadioPanelGroup>
              </Column>
              <Column flex='1'>
                <Select
                  aria-label={t('label:familierelasjon')}
                  data-testid={namespace + '-relasjon'}
                  error={_validation[namespace + '-relasjon']?.feilmelding}
                  id={namespace + '-relasjon'}
                  label={t('label:familierelasjon')}
                  onChange={setRelation}
                  options={relationOptions}
                  required
                  value={_.find(relationOptions, o => o.value === _newPersonRelation)}
                  defaultValue={_.find(relationOptions, o => o.value === _newPersonRelation)}
                />
                <HorizontalSeparatorDiv />
              </Column>
              <Column flex='0.5'>
                <div className='nolabel'>
                  <Button
                    variant='secondary'
                    onClick={onAdd}
                  >
                    <AddCircle width={20} />
                    {t('el:button-add')}
                  </Button>
                </div>
              </Column>
            </AlignStartRow>
          </GrayPanel>
          <VerticalSeparatorDiv />
        </>
        <ModalButtons>
          <Button
            variant='primary'
            onClick={() => {
              onSavePersons()
              resetForm()
              onModalClose()
            }}
          >
            {t('el:button-close-person-modal')}
          </Button>
        </ModalButtons>
      </PaddedDiv>
    </ModalDiv>
  )
}

export default AddPersonModal
