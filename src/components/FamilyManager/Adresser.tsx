import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { AlignStartRow, PaddedDiv } from 'components/StyledComponents'
import { Adresse, AdresseType, ReplySed } from 'declarations/sed'
import { Kodeverk, Validation } from 'declarations/types'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HighContrastRadioPanelGroup,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validateAdresse } from 'validation/adresser'

interface AdresseProps {
  highContrast: boolean
  landkoderList: Array<Kodeverk>
  onValueChanged: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation
}

const Adresser: React.FC<AdresseProps> = ({
  landkoderList,
  onValueChanged,
  personID,
  replySed,
  validation
}:AdresseProps): JSX.Element => {
  const { t } = useTranslation()
  const [_confirmDelete, setConfirmDelete] = useState<Array<string>>([])

  const [_newType, setNewType] = useState<AdresseType | undefined>(undefined)
  const [_newGate, setNewGate] = useState<string>('')
  const [_newPostnummer, setNewPostnummer] = useState<string>('')
  const [_newBy, setNewBy] = useState<string>('')
  const [_newBygning, setNewBygning] = useState<string>('')
  const [_newRegion, setNewRegion] = useState<string>('')
  const [_newLand, setNewLand] = useState<string>('')

  const [_seeNewForm, setSeeNewForm] = useState<boolean>(false)
  const [_validation, setValidation] = useState<Validation>({})

  const adresses: Array<Adresse> = _.get(replySed, `${personID}.adresser`)
  const namespace = 'familymanager-' + personID + '-adresser'

  const p = _.get(replySed, personID)
  const personName = p.personInfo.fornavn + ' ' + p.personInfo.etternavn

  const resetValidation = (key: string): void => {
    setValidation({
      ..._validation,
      [key]: undefined
    })
  }

  const hasNoValidationErrors = (validation: Validation): boolean => _.find(validation, (it) => (it !== undefined)) === undefined

  const performValidation = (): boolean => {
    const newValidation: Validation = {}
    validateAdresse(
      newValidation,
      {
        bygning: _newBygning,
        region: _newRegion,
        postnummer: _newPostnummer,
        by: _newBy,
        gate: _newGate,
        land: _newLand,
        type: _newType
      },
      -1,
      t,
      namespace,
      personName
    )
    setValidation(newValidation)
    return hasNoValidationErrors(newValidation)
  }

  const onAddNewClicked = () => setSeeNewForm(true)

  const addCandidateForDeletion = (key: string) => {
    setConfirmDelete(_confirmDelete.concat(key))
  }

  const removeCandidateForDeletion = (key: string) => {
    setConfirmDelete(_.filter(_confirmDelete, it => it !== key))
  }

  const onTypeChanged = (type: AdresseType, i: number) => {
    if (i < 0) {
      setNewType(type)
      resetValidation(namespace + '-type')
    } else {
      const newAdresses = _.cloneDeep(adresses)
      newAdresses[i].type = type
      onValueChanged(`${personID}.adresser`, newAdresses)
    }
  }

  const onGateChanged = (gate: string, i: number) => {
    if (i < 0) {
      setNewGate(gate)
      resetValidation(namespace + '-gate')
    } else {
      const newAdresses = _.cloneDeep(adresses)
      newAdresses[i].gate = gate
      onValueChanged(`${personID}.adresser`, newAdresses)
    }
  }

  const onPostnummerChanged = (postnummer: string, i: number) => {
    if (i < 0) {
      setNewPostnummer(postnummer)
      resetValidation(namespace + '-postnummer')
    } else {
      const newAdresses = _.cloneDeep(adresses)
      newAdresses[i].postnummer = postnummer
      onValueChanged(`${personID}.adresser`, newAdresses)
    }
  }

  const onByChanged = (by: string, i: number) => {
    if (i < 0) {
      setNewBy(by)
      resetValidation(namespace + '-by')
    } else {
      const newAdresses = _.cloneDeep(adresses)
      newAdresses[i].by = by
      onValueChanged(`${personID}.adresser`, newAdresses)
    }
  }

  const onBygningChanged = (bygning: string, i: number) => {
    if (i < 0) {
      setNewBygning(bygning)
      resetValidation(namespace + '-bygning')
    } else {
      const newAdresses = _.cloneDeep(adresses)
      newAdresses[i].bygning = bygning
      onValueChanged(`${personID}.adresser`, newAdresses)
    }
  }

  const onRegionChanged = (region: string, i: number) => {
    if (i < 0) {
      setNewRegion(region)
      resetValidation(namespace + '-region')
    } else {
      const newAdresses = _.cloneDeep(adresses)
      newAdresses[i].region = region
      onValueChanged(`${personID}.adresser`, newAdresses)
    }
  }

  const onLandChanged = (land: string, i: number) => {
    if (i < 0) {
      setNewLand(land)
      resetValidation(namespace + '-land')
    } else {
      const newAdresses = _.cloneDeep(adresses)
      newAdresses[i].land = land
      onValueChanged(`${personID}.adresser`, newAdresses)
    }
  }

  const resetForm = () => {
    setNewType(undefined)
    setNewGate('')
    setNewPostnummer('')
    setNewBy('')
    setNewBygning('')
    setNewRegion('')
    setNewLand('')
    setValidation({})
  }

  const onCancel = () => {
    setSeeNewForm(false)
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
    onValueChanged(`${personID}.adresser`, newAdresses)
  }

  const onAdd = () => {
    if (performValidation()) {
      let newAdresses: Array<Adresse> = _.cloneDeep(adresses)
      if (_.isNil(newAdresses)) {
        newAdresses = []
      }
      newAdresses = newAdresses.concat({
        type: _newType,
        gate: _newGate,
        postnummer: _newPostnummer,
        by: _newBy,
        land: _newLand,
        bygning: _newBygning,
        region: _newRegion
      })
      resetForm()
      onValueChanged(`${personID}.adresser`, newAdresses)
    }
  }

  const getErrorFor = (index: number, el: string): string | undefined => {
    return index < 0 ? _validation[namespace + '-' + el]?.feilmelding : validation[namespace + '[' + index + ']-' + el]?.feilmelding
  }

  const renderRow = (a: Adresse | null, i: number) => {
    const key = a ? getKey(a) : 'new'
    const candidateForDeletion = i < 0 ? false : !!key && _confirmDelete.indexOf(key) >= 0

    return (
      <>
        <AlignStartRow className={classNames('slideInFromLeft')}>
          <Column data-flex='3'>
            <HighContrastRadioPanelGroup
              checked={i < 0 ? _newType : a!.type}
              data-no-border
              data-test-id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-type-text'}
              feil={getErrorFor(i, 'type')}
              id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-type-text'}
              legend={t('label:adresse')}
              name={namespace + (i >= 0 ? '[' + i + ']' : '') + '-type'}
              radios={[
                { label: t('label:bostedsland'), value: 'bosted' },
                { label: t('label:oppholdsland'), value: 'opphold' }
              ]}
              onChange={(e: any) => onTypeChanged((e.target.value as AdresseType), i)}
            />
            <VerticalSeparatorDiv data-size='0.15'/>
            <HighContrastRadioPanelGroup
              checked={i < 0 ? _newType : a!.type}
              data-no-border
              data-test-id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-type-text'}
              feil={getErrorFor(i, 'type')}
              id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-type-text'}
              name={namespace + (i >= 0 ? '[' + i + ']' : '') + '-type'}
              radios={[
                { label: t('label:kontaktadresse'), value: 'kontakt' },
                { label: t('label:annet'), value: 'annet' }
              ]}
              onChange={(e: any) => onTypeChanged((e.target.value as AdresseType), i)}
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
            <HighContrastInput
              data-test-id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-gate-text'}
              feil={getErrorFor(i, 'gate')}
              id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-gate-text'}
              label={t('label:gateadresse')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onGateChanged(e.target.value, i)}
              value={i < 0 ? _newGate : a?.gate}
            />
          </Column>
          <Column>
            <HighContrastInput
              data-test-id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-bygning-text'}
              feil={getErrorFor(i, 'bygning')}
              id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-bygning-text'}
              label={t('label:bygning')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onBygningChanged(e.target.value, i)}
              value={i < 0 ? _newBygning : a?.bygning}
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
            <HighContrastInput
              data-test-id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-postnummer-text'}
              feil={getErrorFor(i, 'postnummer')}
              id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-postnummer-text'}
              label={t('label:postnummer')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPostnummerChanged(e.target.value, i)}
              value={i < 0 ? _newPostnummer : a?.postnummer}
            />
          </Column>
          <Column data-flex='2'>
            <HighContrastInput
              data-test-id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-by-text'}
              feil={getErrorFor(i, 'by')}
              id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-by-text'}
              label={t('label:by')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onByChanged(e.target.value, i)}
              value={i < 0 ? _newBy : a?.by}
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
            <HighContrastInput
              data-test-id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-region-text'}
              feil={getErrorFor(i, 'region')}
              id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-region-text'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onRegionChanged(e.target.value, i)}
              value={i < 0 ? _newRegion : a?.region}
              label={t('label:region')}
            />
          </Column>
          <Column data-flex='1.5'>
            <CountrySelect
              data-test-id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-land-text'}
              error={getErrorFor(i, 'land')}
              id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-land-text'}
              label={t('label:land')}
              menuPortalTarget={document.body}
              includeList={landkoderList ? landkoderList.map((l: Kodeverk) => l.kode) : []}
              onOptionSelected={(e: any) => onLandChanged(e.value, i)}
              placeholder={t('el:placeholder-select-default')}
              values={i < 0 ? _newLand : a?.land}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(i >= 0)}
              marginTop={true}
              onBeginRemove={() => addCandidateForDeletion(key!)}
              onConfirmRemove={() => onRemove(i)}
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
      {adresses?.map((a, i) => (renderRow(a, i)))}
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
                onClick={onAddNewClicked}
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
