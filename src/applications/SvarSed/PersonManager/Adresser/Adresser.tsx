import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import { AlignStartRow, PaddedDiv } from 'components/StyledComponents'
import { Adresse, AdresseType, ReplySed } from 'declarations/sed'
import { Kodeverk, Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
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
import { getIdx } from 'utils/namespace'
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
  const namespace = `personmanager-${personID}-adresser`

  const [_newType, _setNewType] = useState<AdresseType | undefined>(undefined)
  const [_newGate, _setNewGate] = useState<string>('')
  const [_newPostnummer, _setNewPostnummer] = useState<string>('')
  const [_newBy, _setNewBy] = useState<string>('')
  const [_newBygning, _setNewBygning] = useState<string>('')
  const [_newRegion, _setNewRegion] = useState<string>('')
  const [_newLand, _setNewLand] = useState<string>('')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Adresse>((a: Adresse): string => {
    return a.type + '-' + a.postnummer
  })
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationAddressProps>({}, validateAdresse)

  const setType = (type: AdresseType, index: number) => {
    if (index < 0) {
      _setNewType(type.trim() as AdresseType)
      _resetValidation(namespace + '-type')
    } else {
      updateReplySed(`${target}[${index}].type`, type.trim())
      if (validation[namespace + getIdx(index) + '-type']) {
        resetValidation(namespace + getIdx(index) + '-type')
      }
    }
  }

  const setGate = (gate: string, index: number) => {
    if (index < 0) {
      _setNewGate(gate.trim())
      _resetValidation(namespace + '-gate')
    } else {
      updateReplySed(`${target}[${index}].gate`, gate.trim())
      if (validation[namespace + getIdx(index) + '-gate']) {
        resetValidation(namespace + getIdx(index) + '-gate')
      }
    }
  }

  const setPostnummer = (postnummer: string, index: number) => {
    if (index < 0) {
      _setNewPostnummer(postnummer.trim())
      _resetValidation(namespace + '-postnummer')
    } else {
      updateReplySed(`${target}[${index}].postnummer`, postnummer.trim())
      if (validation[namespace + getIdx(index) + '-postnummer']) {
        resetValidation(namespace + getIdx(index) + '-postnummer')
      }
    }
  }

  const setBy = (by: string, index: number) => {
    if (index < 0) {
      _setNewBy(by.trim())
      _resetValidation(namespace + '-by')
    } else {
      updateReplySed(`${target}[${index}].by`, by.trim())
      if (validation[namespace + getIdx(index) + '-by']) {
        resetValidation(namespace + getIdx(index) + '-by')
      }
    }
  }

  const setBygning = (bygning: string, index: number) => {
    if (index < 0) {
      _setNewBygning(bygning.trim())
      _resetValidation(namespace + '-bygning')
    } else {
      updateReplySed(`${target}[${index}].bygning`, bygning.trim())
      if (validation[namespace + getIdx(index) + '-bygning']) {
        resetValidation(namespace + getIdx(index) + '-bygning')
      }
    }
  }

  const setRegion = (region: string, index: number) => {
    if (index < 0) {
      _setNewRegion(region.trim())
      _resetValidation(namespace + '-region')
    } else {
      updateReplySed(`${target}[${index}].region`, region.trim())
      if (validation[namespace + getIdx(index) + '-region']) {
        resetValidation(namespace + getIdx(index) + '-region')
      }
    }
  }

  const setLand = (land: string, index: number) => {
    if (index < 0) {
      _setNewLand(land.trim())
      _resetValidation(namespace + '-land')
    } else {
      updateReplySed(`${target}[${index}].land`, land.trim())
      if (validation[namespace + getIdx(index) + '-land']) {
        resetValidation(namespace + getIdx(index) + '-land')
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

  const onRemove = (index: number) => {
    const newAdresses = _.cloneDeep(adresses)
    const deletedAddresses: Array<Adresse> = newAdresses.splice(index, 1)
    if (deletedAddresses && deletedAddresses.length > 0) {
      removeFromDeletion(deletedAddresses[0])
    }
    updateReplySed(target, newAdresses)
  }

  const onAdd = () => {
    const newAdresse: Adresse = {
      bygning: _newBygning.trim(),
      region: _newRegion.trim(),
      postnummer: _newPostnummer.trim(),
      by: _newBy.trim(),
      gate: _newGate.trim(),
      land: _newLand.trim(),
      type: _newType?.trim() as AdresseType
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
      updateReplySed(target, newAdresses)
      resetForm()
    }
  }

  const renderRow = (adresse: Adresse | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(adresse)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
    return (
      <>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.3) + 's' }}
        >
          <Column data-flex='3'>
            <HighContrastRadioPanelGroup
              checked={index < 0 ? _newType : adresse!.type}
              data-no-border
              data-test-id={namespace + idx + '-type'}
              feil={getErrorFor(index, 'type')}
              id={namespace + idx + '-type'}
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
              checked={index < 0 ? _newType : adresse!.type}
              data-no-border
              data-test-id={namespace + idx + '-type'}
              feil={getErrorFor(index, 'type')}
              id={namespace + idx + '-type'}
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
          style={{ animationDelay: index < 0 ? '0.1s' : (index * 0.3 + 0.1) + 's' }}
        >
          <Column data-flex='2'>
            <Input
              feil={getErrorFor(index, 'gate')}
              namespace={namespace + idx}
              id='gate'
              label={t('label:gateadresse') + ' *'}
              onChanged={(value: string) => setGate(value, index)}
              value={index < 0 ? _newGate : adresse?.gate}
            />
          </Column>
          <Column>
            <Input
              feil={getErrorFor(index, 'bygning')}
              namespace={namespace + idx}
              id='bygning'
              label={t('label:bygning') + ' *'}
              onChanged={(value: string) => setBygning(value, index)}
              value={index < 0 ? _newBygning : adresse?.bygning}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0.2s' : (index * 0.3 + 0.2) + 's' }}
        >
          <Column>
            <Input
              feil={getErrorFor(index, 'postnummer')}
              namespace={namespace + idx}
              id='postnummer'
              label={t('label:postnummer') + ' *'}
              onChanged={(value: string) => setPostnummer(value, index)}
              value={index < 0 ? _newPostnummer : adresse?.postnummer}
            />
          </Column>
          <Column data-flex='2'>
            <Input
              feil={getErrorFor(index, 'by')}
              namespace={namespace + idx}
              id='by'
              label={t('label:by') + ' *'}
              onChanged={(value: string) => setBy(value, index)}
              value={index < 0 ? _newBy : adresse?.by}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0.2s' : (index * 0.3 + 0.2) + 's' }}
        >
          <Column data-flex='1.5'>
            <Input
              feil={getErrorFor(index, 'region')}
              namespace={namespace + idx}
              id='region'
              label={t('label:region') + ' *'}
              onChanged={(value: string) => setRegion(value, index)}
              value={index < 0 ? _newRegion : adresse?.region}
            />
          </Column>
          <Column data-flex='1.5'>
            <CountrySelect
              data-test-id={namespace + idx + '-land'}
              error={getErrorFor(index, 'land')}
              id={namespace + idx + '-land'}
              label={t('label:land') + ' *'}
              menuPortalTarget={document.body}
              includeList={landkoderList ? landkoderList.map((l: Kodeverk) => l.kode) : []}
              onOptionSelected={(e: any) => setLand(e.value, index)}
              placeholder={t('el:placeholder-select-default')}
              values={index < 0 ? _newLand : adresse?.land}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(adresse)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(adresse)}
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
