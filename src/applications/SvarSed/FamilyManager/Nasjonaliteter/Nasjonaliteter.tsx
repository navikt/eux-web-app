import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { AlignStartRow, PaddedDiv } from 'components/StyledComponents'
import { ReplySed, Statsborgerskap } from 'declarations/sed'
import { Kodeverk, Validation } from 'declarations/types'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { UndertekstBold } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HorizontalSeparatorDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validateNasjonalitet } from './validation'

interface NasjonalitetProps {
  highContrast: boolean
  landkoderList: Array<Kodeverk>
  onValueChanged: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation
}

const Nasjonaliteter: React.FC<NasjonalitetProps> = ({
  landkoderList,
  onValueChanged,
  personID,
  replySed,
  validation
}:NasjonalitetProps): JSX.Element => {
  const [_confirmDelete, setConfirmDelete] = useState<Array<string>>([])

  const [_newLand, setNewLand] = useState<string | undefined>(undefined)
  const [_newFradato, setNewFradato] = useState<string>('')
  const [_seeNewForm, setSeeNewForm] = useState<boolean>(false)
  const [_validation, setValidation] = useState<Validation>({})

  const { t } = useTranslation()
  const target = `${personID}.personInfo.statsborgerskap`
  const statsborgerskaper: Array<Statsborgerskap> = _.get(replySed, target)
  const namespace = `familymanager-${personID}-nasjonaliteter`

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
    validateNasjonalitet(
      newValidation,
      {
        land: _newLand || '',
        fradato: _newFradato
      },
      statsborgerskaper,
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

  const onFradatoChanged = (e: string, i: number) => {
    if (i < 0) {
      setNewFradato(e)
      resetValidation(namespace + '-fradato')
    } else {
      const newStatsborgerskaper = _.cloneDeep(statsborgerskaper)
      newStatsborgerskaper[i].fradato = e
      onValueChanged(target, newStatsborgerskaper)
    }
  }

  const onLandSelected = (e: string, i: number) => {
    if (i < 0) {
      setNewLand(e)
      resetValidation(namespace + '-land')
    } else {
      const newStatsborgerskaper = _.cloneDeep(statsborgerskaper)
      statsborgerskaper[i].land = e
      onValueChanged(target, newStatsborgerskaper)
    }
  }

  const resetForm = () => {
    setNewLand(undefined)
    setNewFradato('')
    setValidation({})
  }

  const onCancel = () => {
    setSeeNewForm(false)
    resetForm()
  }

  const getKey = (s: Statsborgerskap): string => {
    return s.land
  }

  const onRemove = (i: number) => {
    const newStatsborgerskaper = _.cloneDeep(statsborgerskaper)
    const deletedStatsborgerskaper: Array<Statsborgerskap> = newStatsborgerskaper.splice(i, 1)
    if (deletedStatsborgerskaper && deletedStatsborgerskaper.length > 0) {
      removeCandidateForDeletion(getKey(deletedStatsborgerskaper[0]))
    }
    onValueChanged(target, newStatsborgerskaper)
  }

  const onAdd = () => {
    if (performValidation()) {
      let newStatsborgerskaper = _.cloneDeep(statsborgerskaper)
      if (_.isNil(newStatsborgerskaper)) {
        newStatsborgerskaper = []
      }
      newStatsborgerskaper.push({
        land: _newLand!,
        fradato: _newFradato
      })
      resetForm()
      onValueChanged(target, newStatsborgerskaper)
    }
  }

  const getErrorFor = (index: number, el: string): string | undefined => {
    return index < 0 ? _validation[namespace + '-' + el]?.feilmelding : validation[namespace + '[' + index + ']-' + el]?.feilmelding
  }

  const renderRow = (s: Statsborgerskap | null, i: number) => {
    const key = s ? getKey(s) : 'new'
    const candidateForDeletion = i < 0 ? false : !!key && _confirmDelete.indexOf(key) >= 0

    return (
      <>
        <AlignStartRow className={classNames('slideInFromLeft')} style={{ animationDelay: (i * 0.1) + 's' }}>
          <Column>
            <CountrySelect
              data-test-id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-land-text'}
              error={getErrorFor(i, 'land')}
              id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-land-text'}
              menuPortalTarget={document.body}
              includeList={landkoderList ? landkoderList.map((l: Kodeverk) => l.kode) : []}
              onOptionSelected={(e: any) => onLandSelected(e.value, i)}
              placeholder={t('el:placeholder-select-default')}
              values={i < 0 ? _newLand : s!.land}
            />
          </Column>
          <Column>
            <HighContrastInput
              data-test-id={'c-familymanager-' + personID + '-nasjonaliteter-' + i + '-fradato-date'}
              feil={getErrorFor(i, 'fradato')}
              id={'c-familymanager-' + personID + '-nasjonaliteter-' + i + '-fradato'}
              onChange={(e: any) => onFradatoChanged(e.target.value, i)}
              value={i < 0 ? _newFradato : s!.fradato}
              placeholder={t('el:placeholder-date-default')}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(i >= 0)}
              marginTop={false}
              onBeginRemove={() => addCandidateForDeletion(key!)}
              onConfirmRemove={() => onRemove(i)}
              onCancelRemove={() => removeCandidateForDeletion(key!)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </>
    )
  }

  return (
    <PaddedDiv>
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <UndertekstBold>
            {t('label:nasjonalitet')}
          </UndertekstBold>
        </Column>
        <Column>
          <UndertekstBold>
            {t('label:fra-dato')}
          </UndertekstBold>
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      {statsborgerskaper.map(renderRow)}
      <hr />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <AlignStartRow className='slideInFromLeft'>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={onAddNewClicked}
              >
                <Add />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('el:button-add-new-x', { x: t('label:nasjonalitet').toLowerCase() })}
              </HighContrastFlatknapp>

            </Column>
          </AlignStartRow>
          )}
    </PaddedDiv>
  )
}

export default Nasjonaliteter
