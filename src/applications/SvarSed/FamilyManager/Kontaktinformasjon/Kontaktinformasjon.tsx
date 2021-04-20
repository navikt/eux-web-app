import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Select from 'components/Select/Select'
import { AlignStartRow, PaddedDiv } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { Epost, ReplySed, Telefon, TelefonType } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { UndertekstBold } from 'nav-frontend-typografi'
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
import { validateKontaktsinformasjonEpost, validateKontaktsinformasjonTelefon } from './validation'

interface KontaktinformasjonProps {
  highContrast: boolean
  onValueChanged: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation
}

const Kontaktinformasjon: React.FC<KontaktinformasjonProps> = ({
  highContrast,
  onValueChanged,
  personID,
  replySed,
  validation
}:KontaktinformasjonProps): JSX.Element => {
  const [_newNummer, setNewNummer] = useState<string>('')
  const [_newType, setNewType] = useState<TelefonType | undefined>(undefined)
  const [_seeNewTelefonForm, setSeeNewTelefonForm] = useState<boolean>(false)

  const [_newAdresse, setNewAdresse] = useState<string>('')
  const [_seeNewEpostForm, setSeeNewEpostForm] = useState<boolean>(false)

  const [_confirmDelete, setConfirmDelete] = useState<Array<string>>([])
  const [_validation, setValidation] = useState<Validation>({})

  const { t } = useTranslation()

  const targetTelefon = `${personID}.telefon`
  const targetEpost = `${personID}.epost`
  const telefoner: Array<Telefon> = _.get(replySed, targetTelefon)
  const eposter: Array<Epost> = _.get(replySed, targetEpost)
  const namespaceTelefon = `familymanager-${personID}-kontaktinformasjon-telefon`
  const namespaceEpost = `familymanager-${personID}-kontaktinformasjon-epost`

  const p = _.get(replySed, personID)
  const personName = p.personInfo.fornavn + ' ' + p.personInfo.etternavn

  const telefonTypeOptions: Options = [{
    label: t('el:option-telefon-type-work'), value: 'arbeid'
  }, {
    label: t('el:option-telefon-type-home'), value: 'hjem'
  }, {
    label: t('el:option-telefon-type-mobile'), value: 'mobil'
  }]

  const resetValidation = (key: string): void => {
    setValidation({
      ..._validation,
      [key]: undefined
    })
  }

  const hasNoValidationErrors = (validation: Validation): boolean => _.find(validation, (it) => (it !== undefined)) === undefined

  const performValidationTelefon = (): boolean => {
    const newValidation: Validation = {}
    validateKontaktsinformasjonTelefon(
      newValidation,
      {
        type: _newType,
        nummer: _newNummer
      },
      -1,
      t,
      namespaceTelefon,
      personName
    )
    setValidation(newValidation)
    return hasNoValidationErrors(newValidation)
  }

  const performValidationEpost = (): boolean => {
    const newValidation: Validation = {}
    validateKontaktsinformasjonEpost(
      newValidation,
      {
        adresse: _newAdresse
      },
      -1,
      t,
      namespaceEpost,
      personName
    )
    setValidation(newValidation)
    return hasNoValidationErrors(newValidation)
  }

  const onAddNewClicked = (what: string) => {
    if (what === 'telefon') setSeeNewTelefonForm(true)
    if (what === 'epost') setSeeNewEpostForm(true)
  }

  const addCandidateForDeletion = (key: string) => {
    setConfirmDelete(_confirmDelete.concat(key))
  }

  const removeCandidateForDeletion = (key: string) => {
    setConfirmDelete(_.filter(_confirmDelete, it => it !== key))
  }

  const onTypeChanged = (type: TelefonType, i: number) => {
    if (i < 0) {
      setNewType(type)
      resetValidation(namespaceTelefon + '-type')
    } else {
      const newTelefoner = _.cloneDeep(telefoner)
      newTelefoner[i].type = type
      onValueChanged(targetTelefon, newTelefoner)
    }
  }

  const onNummerChanged = (nummer: string, i: number) => {
    if (i < 0) {
      setNewNummer(nummer)
      resetValidation(namespaceTelefon + '-nummer')
    } else {
      const newTelefoner = _.cloneDeep(telefoner)
      newTelefoner[i].nummer = nummer
      onValueChanged(targetTelefon, newTelefoner)
    }
  }

  const onAdresseChanged = (adresse: string, i: number) => {
    if (i < 0) {
      setNewAdresse(adresse)
      resetValidation(namespaceEpost + '-adresse')
    } else {
      const newEposter = _.cloneDeep(eposter)
      newEposter[i].adresse = adresse
      onValueChanged(targetEpost, newEposter)
    }
  }

  const resetForm = (what: string) => {
    if (what === 'telefon') {
      setNewType(undefined)
      setNewNummer('')
    }
    if (what === 'epost') {
      setNewAdresse('')
    }
    setValidation({})
  }

  const onCancel = (what: string) => {
    if (what === 'telefon') setSeeNewTelefonForm(false)
    if (what === 'epost') setSeeNewEpostForm(false)
    resetForm(what)
  }

  const getKey = (it: Telefon | Epost): string => {
    if ((it as Epost).adresse) {
      return (it as Epost).adresse
    }
    return (it as Telefon).type + '-' + (it as Telefon).nummer
  }

  const onTelefonRemoved = (index: number) => {
    const newTelefoner = _.cloneDeep(telefoner)
    const deletedTelefoner: Array<Telefon> = newTelefoner.splice(index, 1)
    if (deletedTelefoner && deletedTelefoner.length > 0) {
      removeCandidateForDeletion(getKey(deletedTelefoner[0]))
    }
    onValueChanged(targetTelefon, newTelefoner)
  }

  const onEpostRemoved = (i: number) => {
    const newEposter = _.cloneDeep(eposter)
    const deletedEposter: Array<Epost> = newEposter.splice(i, 1)
    if (deletedEposter && deletedEposter.length > 0) {
      removeCandidateForDeletion(getKey(deletedEposter[0]))
    }
    onValueChanged(targetEpost, newEposter)
  }

  const onTelefonAdd = () => {
    if (performValidationTelefon()) {
      let newTelefoner = _.cloneDeep(telefoner)
      if (_.isNil(newTelefoner)) {
        newTelefoner = []
      }
      newTelefoner.push({
        type: _newType!,
        nummer: _newNummer
      })
      resetForm('telefon')
      onValueChanged(targetTelefon, newTelefoner)
    }
  }

  const onEpostAdd = () => {
    if (performValidationEpost()) {
      let newEposter = _.cloneDeep(eposter)

      if (_.isNil(newEposter)) {
        newEposter = []
      }
      newEposter.push({
        adresse: _newAdresse
      })
      resetForm('epost')
      onValueChanged(targetEpost, newEposter)
    }
  }

  const getErrorFor = (index: number, what: string, el: string): string | undefined => {
    const namespace = what === 'telefon' ? namespaceTelefon : namespaceEpost
    return index < 0 ? _validation[namespace + '-' + el]?.feilmelding : validation[namespace + '[' + index + ']-' + el]?.feilmelding
  }

  const getTypeOption = (value: string | undefined | null) => _.find(telefonTypeOptions, s => s.value === value)

  const renderTelefonRow = (_t: Telefon | null, i: number) => {
    const key = _t ? getKey(_t) : 'new'
    const candidateForDeletion = i < 0 ? false : !!key && _confirmDelete.indexOf(key) >= 0

    return (
      <>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: i < 0 ? '0s' : (i * 0.1) + 's' }}
        >
          <Column>
            <HighContrastInput
              data-test-id={'c-' + namespaceTelefon + (i >= 0 ? '[' + i + ']' : '') + '-nummer-text'}
              feil={getErrorFor(i, 'telefon', 'nummer')}
              id={'c-' + namespaceTelefon + (i >= 0 ? '[' + i + ']' : '') + '-nummer-text'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onNummerChanged(e.target.value, i)}
              value={i < 0 ? _newNummer : _t?.nummer}
              placeholder={t('el:placeholder-input-default')}
            />
          </Column>
          <Column>
            <Select
              data-test-id={'c-' + namespaceTelefon + (i >= 0 ? '[' + i + ']' : '') + '-type-text'}
              feil={getErrorFor(i, 'telefon', 'type')}
              highContrast={highContrast}
              id={'c-' + namespaceTelefon + (i >= 0 ? '[' + i + ']' : '') + '-type-text'}
              menuPortalTarget={document.body}
              onChange={(e) => onTypeChanged(e.value as TelefonType, i)}
              options={telefonTypeOptions}
              placeholder={t('el:placeholder-select-default')}
              selectedValue={getTypeOption(i < 0 ? _newType : _t?.type)}
              defaultValue={getTypeOption(i < 0 ? _newType : _t?.type)}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(i >= 0)}
              marginTop={false}
              onBeginRemove={() => addCandidateForDeletion(key!)}
              onConfirmRemove={() => onTelefonRemoved(i)}
              onCancelRemove={() => removeCandidateForDeletion(key!)}
              onAddNew={onTelefonAdd}
              onCancelNew={() => onCancel('telefon')}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </>
    )
  }

  const renderEpostRow = (e: Epost | null, i: number) => {
    const key = e ? getKey(e) : 'new'
    const candidateForDeletion = i < 0 ? false : !!key && _confirmDelete.indexOf(key) >= 0

    return (
      <>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: i < 0 ? '0s' : (i * 0.1) + 's' }}
        >
          <Column data-flex='2'>
            <HighContrastInput
              data-test-id={'c-' + namespaceTelefon + (i >= 0 ? '[' + i + ']' : '') + '-adresse-text'}
              feil={getErrorFor(i, 'epost', 'adresse')}
              id={'c-' + namespaceTelefon + (i >= 0 ? '[' + i + ']' : '') + '-adresse-text'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onAdresseChanged(e.target.value, i)}
              value={i < 0 ? _newAdresse : e?.adresse}
              placeholder={t('el:placeholder-input-default')}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(i >= 0)}
              marginTop={false}
              onBeginRemove={() => addCandidateForDeletion(key!)}
              onConfirmRemove={() => onEpostRemoved(i)}
              onCancelRemove={() => removeCandidateForDeletion(key!)}
              onAddNew={onEpostAdd}
              onCancelNew={() => onCancel('epost')}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </>
    )
  }

  return (
    <PaddedDiv>
      <Row className='slideInFromLeft'>
        <Column>
          <UndertekstBold>
            {t('label:telefonnummer')}
          </UndertekstBold>
        </Column>
        <Column>
          <UndertekstBold>
            {t('label:type')}
          </UndertekstBold>
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv />
      {telefoner?.map((t, i) => (renderTelefonRow(t, i)))}
      <hr />
      <VerticalSeparatorDiv />
      {_seeNewTelefonForm
        ? renderTelefonRow(null, -1)
        : (
          <Row className='slideInFromLeft'>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => onAddNewClicked('telefon')}
              >
                <Add />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('el:button-add-new-x', { x: t('label:telefonnummer').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
      <VerticalSeparatorDiv data-size='3' />
      <Row className='slideInFromLeft'>
        <Column>
          <UndertekstBold>
            {t('label:epost')}
          </UndertekstBold>
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv />
      {eposter?.map((e, i) => (renderEpostRow(e, i)))}
      <hr />
      {_seeNewEpostForm
        ? renderEpostRow(null, -1)
        : (
          <Row className='slideInFromLeft'>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => onAddNewClicked('epost')}
              >
                <Add />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('el:button-add-new-x', { x: t('label:epost').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
    </PaddedDiv>
  )
}

export default Kontaktinformasjon
