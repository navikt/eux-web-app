import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import useAddRemove from 'components/AddRemovePanel/useAddRemove'
import Input from 'components/Forms/Input'
import { AlignStartRow, PaddedDiv } from 'components/StyledComponents'
import useValidation from 'components/Validation/useValidation'
import { Adresse, AdresseType, ReplySed } from 'declarations/sed'
import { Kodeverk, Validation } from 'declarations/types'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastRadioPanelGroup,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validateAdresse, ValidationAddressProps } from './validation'

interface AdresseProps {
  highContrast: boolean
  landkoderList: Array<Kodeverk>
  personID: string
  personName: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const Adresser: React.FC<AdresseProps> = ({
  landkoderList,
  personID,
  personName,
  replySed,
  resetValidation,
  updateReplySed,
  validation
}:AdresseProps): JSX.Element => {
  const { t } = useTranslation()
  const target = `${personID}.adresser`
  const adresses: Array<Adresse> = _.get(replySed, target)
  const namespace = `familymanager-${personID}-adresser`

  const [_newType, _setNewType] = useState<AdresseType | undefined>(undefined)
  const [_newGate, _setNewGate] = useState<string>('')
  const [_newPostnummer, _setNewPostnummer] = useState<string>('')
  const [_newBy, _setNewBy] = useState<string>('')
  const [_newBygning, _setNewBygning] = useState<string>('')
  const [_newRegion, _setNewRegion] = useState<string>('')
  const [_newLand, _setNewLand] = useState<string>('')

  const [addCandidateForDeletion, removeCandidateForDeletion, hasKey] = useAddRemove()
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationAddressProps>({}, validateAdresse)

  const setType = (type: AdresseType, index: number) => {
    if (index < 0) {
      _setNewType(type)
      _resetValidation(namespace + '-type')
    } else {
      const newAdresses = _.cloneDeep(adresses)
      newAdresses[index].type = type
      updateReplySed(target, newAdresses)
      if (validation[namespace + '-type']) {
        resetValidation(namespace + '-type')
      }
    }
  }

  const setGate = (gate: string, index: number) => {
    if (index < 0) {
      _setNewGate(gate)
      _resetValidation(namespace + '-gate')
    } else {
      const newAdresses = _.cloneDeep(adresses)
      newAdresses[index].gate = gate
      updateReplySed(target, newAdresses)
      if (validation[namespace + '-gate']) {
        resetValidation(namespace + '-gate')
      }
    }
  }

  const setPostnummer = (postnummer: string, index: number) => {
    if (index < 0) {
      _setNewPostnummer(postnummer)
      _resetValidation(namespace + '-postnummer')
    } else {
      const newAdresses = _.cloneDeep(adresses)
      newAdresses[index].postnummer = postnummer
      updateReplySed(target, newAdresses)
      if (validation[namespace + '-postnummer']) {
        resetValidation(namespace + '-postnummer')
      }
    }
  }

  const setBy = (by: string, index: number) => {
    if (index < 0) {
      _setNewBy(by)
      _resetValidation(namespace + '-by')
    } else {
      const newAdresses = _.cloneDeep(adresses)
      newAdresses[index].by = by
      updateReplySed(target, newAdresses)
      if (validation[namespace + '-by']) {
        resetValidation(namespace + '-by')
      }
    }
  }

  const setBygning = (bygning: string, index: number) => {
    if (index < 0) {
      _setNewBygning(bygning)
      _resetValidation(namespace + '-bygning')
    } else {
      const newAdresses = _.cloneDeep(adresses)
      newAdresses[index].bygning = bygning
      updateReplySed(target, newAdresses)
      if (validation[namespace + '-bygning']) {
        resetValidation(namespace + '-bygning')
      }
    }
  }

  const setRegion = (region: string, index: number) => {
    if (index < 0) {
      _setNewRegion(region)
      _resetValidation(namespace + '-region')
    } else {
      const newAdresses = _.cloneDeep(adresses)
      newAdresses[index].region = region
      updateReplySed(target, newAdresses)
      if (validation[namespace + '-region']) {
        resetValidation(namespace + '-region')
      }
    }
  }

  const setLand = (land: string, index: number) => {
    if (index < 0) {
      _setNewLand(land)
      _resetValidation(namespace + '-land')
    } else {
      const newAdresses = _.cloneDeep(adresses)
      newAdresses[index].land = land
      updateReplySed(target, newAdresses)
      if (validation[namespace + '-land']) {
        resetValidation(namespace + '-land')
      }
    }
  }

  const resetForm = () => {
    _setNewType(undefined)
    _setNewGate('')
    _setNewPostnummer('')
    _setNewBy('')
    _setNewBygning('')
    _setNewRegion('')
    _setNewLand('')
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const getKey = (a: Adresse): string => {
    return a.type + '-' + a.postnummer
  }

  const onRemove = (index: number) => {
    const newAdresses = _.cloneDeep(adresses)
    const deletedAddresses: Array<Adresse> = newAdresses.splice(index, 1)
    if (deletedAddresses && deletedAddresses.length > 0) {
      removeCandidateForDeletion(getKey(deletedAddresses[0]))
    }
    updateReplySed(target, newAdresses)
  }

  const onAdd = () => {
    const newAdresse: Adresse = {
      bygning: _newBygning,
      region: _newRegion,
      postnummer: _newPostnummer,
      by: _newBy,
      gate: _newGate,
      land: _newLand,
      type: _newType
    }
    const valid: boolean = performValidation({
      adresse: newAdresse,
      index: -1,
      namespace: namespace,
      personName: personName
    })
    if (valid) {
      let newAdresses: Array<Adresse> = _.cloneDeep(adresses)
      if (_.isNil(newAdresses)) {
        newAdresses = []
      }
      newAdresses = newAdresses.concat(newAdresse)
      resetForm()
      updateReplySed(target, newAdresses)
    }
  }

  const getErrorFor = (index: number, el: string): string | undefined => {
    return index < 0
      ? _validation[namespace + '-' + el]?.feilmelding
      : validation[namespace + '[' + index + ']-' + el]?.feilmelding
  }

  const renderRow = (address: Adresse | null, index: number) => {
    const key = address ? getKey(address) : 'new'
    const candidateForDeletion = index < 0 ? false : !!key && hasKey(key)
    const idx = (index >= 0 ? '[' + index + ']' : '')
    return (
      <>
        <AlignStartRow className={classNames('slideInFromLeft')}>
          <Column data-flex='3'>
            <HighContrastRadioPanelGroup
              checked={index < 0 ? _newType : address!.type}
              data-no-border
              data-test-id={'c-' + namespace + idx + '-type-text'}
              feil={getErrorFor(index, 'type')}
              id={'c-' + namespace + idx + '-type-text'}
              legend={t('label:adresse') + ' *'}
              name={namespace + idx + '-type'}
              radios={[
                { label: t('label:bostedsland'), value: 'bosted' },
                { label: t('label:oppholdsland'), value: 'opphold' }
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setType((e.target.value as AdresseType), index)}
            />
            <VerticalSeparatorDiv data-size='0.15' />
            <HighContrastRadioPanelGroup
              checked={index < 0 ? _newType : address!.type}
              data-no-border
              data-test-id={'c-' + namespace + idx + '-type-text'}
              feil={getErrorFor(index, 'type')}
              id={'c-' + namespace + idx + '-type-text'}
              name={namespace + idx + '-type'}
              radios={[
                { label: t('label:kontaktadresse'), value: 'kontakt' },
                { label: t('label:annet'), value: 'annet' }
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setType((e.target.value as AdresseType), index)}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: '0.1s' }}
        >
          <Column data-flex='2'>
            <Input
              feil={getErrorFor(index, 'gate')}
              namespace={namespace + idx}
              id='gate-text'
              label={t('label:gateadresse') + ' *'}
              onChanged={(value: string) => setGate(value, index)}
              value={index < 0 ? _newGate : address?.gate}
            />
          </Column>
          <Column>
            <Input
              feil={getErrorFor(index, 'bygning')}
              namespace={namespace + idx}
              id='bygning-text'
              label={t('label:bygning') + ' *'}
              onChanged={(value: string) => setBygning(value, index)}
              value={index < 0 ? _newBygning : address?.bygning}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: '0.2s' }}
        >
          <Column>
            <Input
              feil={getErrorFor(index, 'postnummer')}
              namespace={namespace + idx}
              id='postnummer-text'
              label={t('label:postnummer') + ' *'}
              onChanged={(value: string) => setPostnummer(value, index)}
              value={index < 0 ? _newPostnummer : address?.postnummer}
            />
          </Column>
          <Column data-flex='2'>
            <Input
              feil={getErrorFor(index, 'by')}
              namespace={namespace + idx}
              id='by-text'
              label={t('label:by') + ' *'}
              onChanged={(value: string) => setBy(value, index)}
              value={index < 0 ? _newBy : address?.by}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: '0.3s' }}
        >
          <Column data-flex='1.5'>
            <Input
              feil={getErrorFor(index, 'region')}
              namespace={namespace + idx}
              id='region-text'
              label={t('label:region') + ' *'}
              onChanged={(value: string) => setRegion(value, index)}
              value={index < 0 ? _newRegion : address?.region}
            />
          </Column>
          <Column data-flex='1.5'>
            <CountrySelect
              data-test-id={'c-' + namespace + idx + '-land-text'}
              error={getErrorFor(index, 'land')}
              id={'c-' + namespace + idx + '-land-text'}
              label={t('label:land') + ' *'}
              menuPortalTarget={document.body}
              includeList={landkoderList ? landkoderList.map((l: Kodeverk) => l.kode) : []}
              onOptionSelected={(e: any) => setLand(e.value, index)}
              placeholder={t('el:placeholder-select-default')}
              values={index < 0 ? _newLand : address?.land}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addCandidateForDeletion(key!)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeCandidateForDeletion(key!)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv data-size='2' />
      </>
    )
  }

  return (
    <PaddedDiv>
      {adresses?.map(renderRow)}
      <hr />
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
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('el:button-add-new-x', { x: t('label:adresse').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
    </PaddedDiv>
  )
}

export default Adresser
