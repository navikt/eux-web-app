import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import useAddRemove from 'components/AddRemovePanel/useAddRemove'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { AlignStartRow, PaddedDiv } from 'components/StyledComponents'
import useValidation from 'components/Validation/useValidation'
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
import {
  validateKontaktsinformasjonEpost,
  validateKontaktsinformasjonTelefon,
  ValidationKontaktsinformasjonEpostProps,
  ValidationKontaktsinformasjonTelefonProps
} from './validation'

interface KontaktinformasjonProps {
  highContrast: boolean
  updateReplySed: (needle: string, value: any) => void
  personID: string
  personName: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  validation: Validation
}

const Kontaktinformasjon: React.FC<KontaktinformasjonProps> = ({
  highContrast,
  updateReplySed,
  personID,
  personName,
  replySed,
  resetValidation,
  validation
}:KontaktinformasjonProps): JSX.Element => {
  const { t } = useTranslation()
  const targetTelefon = `${personID}.telefon`
  const targetEpost = `${personID}.epost`
  const telefoner: Array<Telefon> = _.get(replySed, targetTelefon)
  const eposter: Array<Epost> = _.get(replySed, targetEpost)
  const namespaceTelefon = `familymanager-${personID}-kontaktinformasjon-telefon`
  const namespaceEpost = `familymanager-${personID}-kontaktinformasjon-epost`

  const [_newNummer, _setNewNummer] = useState<string>('')
  const [_newType, _setNewType] = useState<TelefonType | undefined>(undefined)
  const [_seeNewTelefonForm, _setSeeNewTelefonForm] = useState<boolean>(false)

  const [_newAdresse, _setNewAdresse] = useState<string>('')
  const [_seeNewEpostForm, _setSeeNewEpostForm] = useState<boolean>(false)

  const [addCandidateForDeletion, removeCandidateForDeletion, hasKey] = useAddRemove()
  const [_validationTelefon, resetValidationTelefon, performValidationTelefon] =
    useValidation<ValidationKontaktsinformasjonTelefonProps>({}, validateKontaktsinformasjonTelefon)
  const [_validationEpost, resetValidationEpost, performValidationEpost] =
    useValidation<ValidationKontaktsinformasjonEpostProps>({}, validateKontaktsinformasjonEpost)

  const telefonTypeOptions: Options = [{
    label: t('el:option-telefon-type-work'), value: 'arbeid'
  }, {
    label: t('el:option-telefon-type-home'), value: 'hjem'
  }, {
    label: t('el:option-telefon-type-mobile'), value: 'mobil'
  }]

  const onAddNewClicked = (what: string) => {
    if (what === 'telefon') _setSeeNewTelefonForm(true)
    if (what === 'epost') _setSeeNewEpostForm(true)
  }

  const onTypeChanged = (type: TelefonType, index: number) => {
    if (index < 0) {
      _setNewType(type)
      resetValidationTelefon(namespaceTelefon + '-type')
    } else {
      const newTelefoner = _.cloneDeep(telefoner)
      newTelefoner[index].type = type
      updateReplySed(targetTelefon, newTelefoner)
      if (validation[namespaceTelefon + '-type']) {
        resetValidation(namespaceTelefon + '-type')
      }
    }
  }

  const onNummerChanged = (nummer: string, index: number) => {
    if (index < 0) {
      _setNewNummer(nummer)
      resetValidationTelefon(namespaceTelefon + '-nummer')
    } else {
      const newTelefoner = _.cloneDeep(telefoner)
      newTelefoner[index].nummer = nummer
      updateReplySed(targetTelefon, newTelefoner)
      if (validation[namespaceTelefon + '-nummer']) {
        resetValidation(namespaceTelefon + '-nummer')
      }
    }
  }

  const onAdresseChanged = (adresse: string, index: number) => {
    if (index < 0) {
      _setNewAdresse(adresse)
      resetValidationEpost(namespaceEpost + '-adresse')
    } else {
      const newEposter = _.cloneDeep(eposter)
      newEposter[index].adresse = adresse
      updateReplySed(targetEpost, newEposter)
      if (validation[namespaceEpost + '-adresse']) {
        resetValidation(namespaceEpost + '-adresse')
      }
    }
  }

  const resetForm = (what: string) => {
    if (what === 'telefon') {
      _setNewType(undefined)
      _setNewNummer('')
      resetValidationTelefon()
    }
    if (what === 'epost') {
      _setNewAdresse('')
      resetValidationEpost()
    }
  }

  const onCancel = (what: string) => {
    if (what === 'telefon') _setSeeNewTelefonForm(false)
    if (what === 'epost') _setSeeNewEpostForm(false)
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
    updateReplySed(targetTelefon, newTelefoner)
  }

  const onEpostRemoved = (i: number) => {
    const newEposter = _.cloneDeep(eposter)
    const deletedEposter: Array<Epost> = newEposter.splice(i, 1)
    if (deletedEposter && deletedEposter.length > 0) {
      removeCandidateForDeletion(getKey(deletedEposter[0]))
    }
    updateReplySed(targetEpost, newEposter)
  }

  const onTelefonAdd = () => {
    const newTelefon: Telefon | {type: any, nummer: any} = {
      type: _newType,
      nummer: _newNummer
    }

    const valid: boolean = performValidationTelefon({
      telefon: newTelefon,
      index: -1,
      namespace: namespaceTelefon,
      personName: personName
    })

    if (valid) {
      let newTelefoner = _.cloneDeep(telefoner)
      if (_.isNil(newTelefoner)) {
        newTelefoner = []
      }
      newTelefoner.push(newTelefon)
      resetForm('telefon')
      updateReplySed(targetTelefon, newTelefoner)
    }
  }

  const onEpostAdd = () => {
    const newEpost: Epost = {
      adresse: _newAdresse
    }

    const valid: boolean = performValidationEpost({
      epost: newEpost,
      index: -1,
      namespace: namespaceEpost,
      personName: personName
    })

    if (valid) {
      let newEposter = _.cloneDeep(eposter)

      if (_.isNil(newEposter)) {
        newEposter = []
      }
      newEposter.push(newEpost)
      resetForm('epost')
      updateReplySed(targetEpost, newEposter)
    }
  }

  const getErrorFor = (index: number, what: string, el: string): string | undefined => {
    const namespace = what === 'telefon' ? namespaceTelefon : namespaceEpost
    const _validation = what === 'telefon' ? _validationTelefon : _validationEpost
    return index < 0 ? _validation[namespace + '-' + el]?.feilmelding : validation[namespace + '[' + index + ']-' + el]?.feilmelding
  }

  const getTypeOption = (value: string | undefined | null) => _.find(telefonTypeOptions, s => s.value === value)

  const renderTelefonRow = (_t: Telefon | null, index: number) => {
    const key = _t ? getKey(_t) : 'new'
    const candidateForDeletion = index < 0 ? false : !!key && hasKey(key)
    const idx = (index >= 0 ? '[' + index + ']' : '')
    return (
      <>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.1) + 's' }}
        >
          <Column>
            <Input
              feil={getErrorFor(index, 'telefon', 'nummer')}
              namespace={namespaceTelefon + idx}
              id='nummer-text'
              label={''}
              onChanged={(value: string) => onNummerChanged(value, index)}
              value={index < 0 ? _newNummer : _t?.nummer}
            />
          </Column>
          <Column>
            <Select
              data-test-id={'c-' + namespaceTelefon + idx + '-type-text'}
              feil={getErrorFor(index, 'telefon', 'type')}
              highContrast={highContrast}
              id={'c-' + namespaceTelefon + idx + '-type-text'}
              menuPortalTarget={document.body}
              onChange={(e) => onTypeChanged(e.value as TelefonType, index)}
              options={telefonTypeOptions}
              placeholder={t('el:placeholder-select-default')}
              selectedValue={getTypeOption(index < 0 ? _newType : _t?.type)}
              defaultValue={getTypeOption(index < 0 ? _newType : _t?.type)}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop={false}
              onBeginRemove={() => addCandidateForDeletion(key!)}
              onConfirmRemove={() => onTelefonRemoved(index)}
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

  const renderEpostRow = (e: Epost | null, index: number) => {
    const key = e ? getKey(e) : 'new'
    const candidateForDeletion = index < 0 ? false : !!key && hasKey(key)
    const idx = (index >= 0 ? '[' + index + ']' : '')
    return (
      <>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.1) + 's' }}
        >
          <Column data-flex='2'>
            <Input
              feil={getErrorFor(index, 'epost', 'adresse')}
              namespace={namespaceEpost + idx}
              id='adresse-text'
              label={''}
              onChanged={(value: string) => onAdresseChanged(value, index)}
              value={index < 0 ? _newAdresse : e?.adresse}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop={false}
              onBeginRemove={() => addCandidateForDeletion(key!)}
              onConfirmRemove={() => onEpostRemoved(index)}
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
            {t('label:telefonnummer') + ' *'}
          </UndertekstBold>
        </Column>
        <Column>
          <UndertekstBold>
            {t('label:type') + ' *'}
          </UndertekstBold>
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv />
      {telefoner?.map(renderTelefonRow)}
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
            {t('label:epost') + ' *'}
          </UndertekstBold>
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv />
      {eposter?.map(renderEpostRow)}
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
