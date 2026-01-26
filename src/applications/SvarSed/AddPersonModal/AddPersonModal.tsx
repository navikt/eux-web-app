import { PlusCircleIcon, ChildEyesIcon } from '@navikt/aksel-icons';
import {BodyLong, Box, Button, Heading, HStack, Modal as NavModal, Radio, RadioGroup, Spacer, TextField, VStack} from '@navikt/ds-react'
import { ActionWithPayload } from '@navikt/fetch'
import { validateAddPersonModal, ValidationAddPersonModalProps } from 'applications/SvarSed/AddPersonModal/validation'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import DateField from 'components/DateField/DateField'
import Select from 'components/Forms/Select'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import { Option } from 'declarations/app'
import { F002Sed, Kjoenn, PersonInfo } from 'declarations/sed'
import { StorageTypes } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'store'
import styles from './AddPersonModal.module.css'
import commonStyles from "../../../assets/css/common.module.css";

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
    if ((newReplySed as F002Sed).andrePersoner && personID.startsWith('andrePersoner[')) {
      // _unset leaves null values on array, trim them
      (newReplySed as F002Sed).andrePersoner = _.filter((newReplySed as F002Sed).andrePersoner, (p: any) => !_.isNil(p))
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
      let pin
      if(!_.isEmpty(_newPersonFnr?.trim())){
        pin = [{
          landkode: "NOR",
          identifikator: _newPersonFnr.trim()
        }]
      }
      const personInfo: PersonInfo = {
        fornavn: _newPersonFornavn.trim(),
        etternavn: _newPersonEtternavn.trim(),
        foedselsdato: _newPersonFodselsdato.trim(),
        kjoenn: _newPersonKjoenn.trim() as Kjoenn,
        statsborgerskap: [],
        pin
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

      if (_newPersonRelation === 'andrePersoner') {
        if (!Object.prototype.hasOwnProperty.call(newReplySed, 'andrePersoner')) {
          (newReplySed as F002Sed).andrePersoner = [{
            personInfo
          }]
        } else {
          (newReplySed as F002Sed).andrePersoner?.push({
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
    dispatch(setReplySed(_replySed as T))
  }

  const getRelationOptions = (): Array<Option> => {
    const cdmVersion = (_replySed as F002Sed).sak?.cdmVersjon

    const relationOptions: Array<Option> = []
    relationOptions.push({
      label: "Velg",
      value: ""
    })
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

    if(!cdmVersion || parseFloat(cdmVersion) <= 4.3) {
      relationOptions.push({
        label: t('el:option-familierelasjon-annenPerson') + ((_replySed as F002Sed).annenPerson
          ? '(' + t('label:ikke-tilgjengelig') + ')'
          : ''),
        value: 'annenPerson',
        isDisabled: !!(_replySed as F002Sed).annenPerson
      })
    } else if(parseFloat(cdmVersion) >= 4.4) {
      relationOptions.push({
        label: t('el:option-familierelasjon-annenPerson'),
        value: 'andrePersoner',
        isDisabled: false
      })
    }

    relationOptions.push({
      label: t('el:option-familierelasjon-barn'),
      value: 'barn',
      isDisabled: false
    })

    return relationOptions
  }

  const relationOptions = getRelationOptions()

  const getPersonLabel = (personId: string): string => {
    let id: string
    if(personId.startsWith('barn[')){
      id = 'barn'
    } else if (personId.startsWith('andrePersoner[')){
      id = 'annenPerson'
    } else {
      id = personId
    }
    return t('el:option-familierelasjon-' + id)
  }

  const renderPerson = (personId: string) => {
    const p: PersonInfo | undefined = _.get(_replySed, `${personId}.personInfo`)
    if (!p) return null

    return (
      <HStack key={personId}>
        <HStack gap="2">
          <BodyLong>
            {p?.fornavn + ' ' + (p?.etternavn ?? '')}
          </BodyLong>
          <span className={styles.greySpan}>
            {'(' + getPersonLabel(personId) + ')'}
          </span>
          {personId.startsWith('barn[') && (
            <ChildEyesIcon />
          )}
        </HStack>
        <Spacer/>
        <AddRemovePanel<PersonInfo>
          item={p}
          index={0}
          allowEdit={false}
          onRemove={() => onRemovePerson(personId)}
        />
      </HStack>
    )
  }

  const modalClose = () => {
    resetForm()
    onModalClose()
  }

  return (
    <NavModal
      open={open}
      onClose={modalClose}
      header={{heading: t('label:legg-til-fjern-personer')}}
      width="1"
    >
      <NavModal.Body id='add-person-modal-id'>
        <VStack gap="4">
          <VStack>
            {_replySed?.bruker && renderPerson('bruker')}
            {(_replySed as F002Sed).ektefelle && renderPerson('ektefelle')}
            {(_replySed as F002Sed).annenPerson && renderPerson('annenPerson')}
            {(_replySed as F002Sed).andrePersoner?.map((_p: any, i: number) => renderPerson(`andrePersoner[${i}]`))}
            {(_replySed as F002Sed).barn?.map((_b: any, i: number) => renderPerson(`barn[${i}]`))}
          </VStack>
          <HorizontalLineSeparator/>
          <Box background="bg-subtle" padding="4">
            <VStack gap="4">
              <Heading size='small'>
                {t('el:button-add-new-x', {x: t('label:person').toLowerCase()})}
              </Heading>
              <HorizontalLineSeparator/>
              <HStack gap="2" justify="space-evenly">
                <TextField
                  error={_validation[namespace + '-fornavn']?.feilmelding}
                  id={namespace + '-fornavn'}
                  label={t('label:fornavn')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFornavn(e.target.value)}
                  value={_newPersonFornavn}
                />
                <TextField
                  error={_validation[namespace + '-etternavn']?.feilmelding}
                  id={namespace + '-etternavn'}
                  label={t('label:etternavn')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEtternavn(e.target.value)}
                  value={_newPersonEtternavn}
                />
                <DateField
                  error={_validation[namespace + '-fdato']?.feilmelding}
                  id='fdato'
                  namespace={namespace}
                  label={t('label:fødselsdato')}
                  onChanged={setFoedselsdato}
                  dateValue={_newPersonFodselsdato}
                />
                <TextField
                  error={_validation[namespace + '-fnr']?.feilmelding}
                  id={namespace + '-fnr'}
                  label={t('label:fnr-dnr')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFnr(e.target.value)}
                  value={_newPersonFnr}
                />
              </HStack>
              <HStack gap="2" align="center" justify="space-evenly">
                <RadioGroup
                  value={_newPersonKjoenn}
                  data-no-border
                  data-testid={namespace + '-kjoenn'}
                  error={_validation[namespace + '-kjoenn']?.feilmelding}
                  id={namespace + '-kjoenn'}
                  legend={t('label:kjønn') + ' *'}
                  name={namespace + '-kjoenn'}
                  onChange={setKjoenn}
                >
                  <HStack gap="2">
                    <Radio value='M' className={commonStyles.radioPanel}>
                      {t(_newPersonRelation?.startsWith('barn') ? 'label:gutt' : 'label:mann')}
                    </Radio>
                    <Radio value='K' className={commonStyles.radioPanel}>
                      {t(_newPersonRelation?.startsWith('barn') ? 'label:jente' : 'label:kvinne')}
                    </Radio>
                    <Radio value='U' className={commonStyles.radioPanel}>
                      {t('label:ukjent')}
                    </Radio>
                  </HStack>
                </RadioGroup>
                <Select
                  aria-label={t('label:familierelasjon')}
                  data-testid={namespace + '-relasjon'}
                  error={_validation[namespace + '-relasjon']?.feilmelding}
                  id={namespace + '-relasjon'}
                  label={t('label:familierelasjon')}
                  onChange={setRelation}
                  options={relationOptions}
                  value={_.find(relationOptions, o => o.value === _newPersonRelation)}
                  defaultValue={_.find(relationOptions, o => o.value === _newPersonRelation)}
                />
                <div className='nolabel'>
                  <Button
                    variant='secondary'
                    onClick={onAdd}
                    icon={<PlusCircleIcon/>}
                  >
                    {t('el:button-add')}
                  </Button>
                </div>
              </HStack>
            </VStack>
          </Box>
          <Box>
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
          </Box>
        </VStack>
      </NavModal.Body>
    </NavModal>
  )
}

export default AddPersonModal
