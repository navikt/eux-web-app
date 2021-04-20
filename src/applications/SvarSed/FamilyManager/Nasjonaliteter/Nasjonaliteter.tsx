import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import DateInput from 'components/DateInput/DateInput'
import { toFinalDateFormat } from 'components/Period/Period'
import { AlignStartRow, PaddedDiv } from 'components/StyledComponents'
import useValidation from 'components/Validation/useValidation'
import { ReplySed, Statsborgerskap } from 'declarations/sed'
import { Kodeverk, Validation } from 'declarations/types'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { UndertekstBold } from 'nav-frontend-typografi'
import { Column, HighContrastFlatknapp, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validateNasjonalitet, ValidationNasjonalitetProps } from './validation'

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
  const { t } = useTranslation()

  const [_newLand, _setNewLand] = useState<string | undefined>(undefined)
  const [_newFradato, _setNewFradato] = useState<string>('')

  const [_confirmDelete, _setConfirmDelete] = useState<Array<string>>([])
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, resetValidation, performValidation] = useValidation<ValidationNasjonalitetProps>({}, validateNasjonalitet)

  const target = `${personID}.personInfo.statsborgerskap`
  const statsborgerskaper: Array<Statsborgerskap> = _.get(replySed, target)
  const namespace = `familymanager-${personID}-nasjonaliteter`

  const p = _.get(replySed, personID)
  const personName = p.personInfo.fornavn + ' ' + p.personInfo.etternavn

  const onAddNewClicked = () => _setSeeNewForm(true)

  const addCandidateForDeletion = (key: string) => {
    _setConfirmDelete(_confirmDelete.concat(key))
  }

  const removeCandidateForDeletion = (key: string) => {
    _setConfirmDelete(_.filter(_confirmDelete, it => it !== key))
  }

  const onFradatoChanged = (dato: string, i: number) => {
    if (i < 0) {
      _setNewFradato(dato)
      resetValidation(namespace + '-fradato')
    } else {
      const newStatsborgerskaper = _.cloneDeep(statsborgerskaper)
      newStatsborgerskaper[i].fradato = toFinalDateFormat(dato)
      onValueChanged(target, newStatsborgerskaper)
    }
  }

  const onLandSelected = (land: string, i: number) => {
    if (i < 0) {
      _setNewLand(land)
      resetValidation(namespace + '-land')
    } else {
      const newStatsborgerskaper = _.cloneDeep(statsborgerskaper)
      statsborgerskaper[i].land = land
      onValueChanged(target, newStatsborgerskaper)
    }
  }

  const resetForm = () => {
    _setNewLand(undefined)
    _setNewFradato('')
    resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
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

    const newStatsborgerskap: Statsborgerskap = {
      land: _newLand || '',
      fradato: toFinalDateFormat(_newFradato)
    }

    const valid = performValidation({
      statsborgerskap: newStatsborgerskap,
      statsborgerskaper: statsborgerskaper,
      index: -1,
      namespace: namespace,
      personName: personName
    })

    if (valid) {
      let newStatsborgerskaper = _.cloneDeep(statsborgerskaper)
      if (_.isNil(newStatsborgerskaper)) {
        newStatsborgerskaper = []
      }
      newStatsborgerskaper.push(newStatsborgerskap)
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
    const idx = (i >= 0 ? '[' + i + ']' : '')

    return (
      <>
        <AlignStartRow className={classNames('slideInFromLeft')} style={{ animationDelay: (i * 0.1) + 's' }}>
          <Column>
            <CountrySelect
              data-test-id={'c-' + namespace + idx + '-land-text'}
              error={getErrorFor(i, 'land')}
              id={'c-' + namespace +idx + '-land-text'}
              menuPortalTarget={document.body}
              includeList={landkoderList ? landkoderList.map((l: Kodeverk) => l.kode) : []}
              onOptionSelected={(e: any) => onLandSelected(e.value, i)}
              placeholder={t('el:placeholder-select-default')}
              values={i < 0 ? _newLand : s!.land}
            />
          </Column>
          <Column>
            <DateInput
              error={getErrorFor(i, 'fradato')}
              namespace={namespace + idx + '-fradato'}
              index={i}
              key={i < 0 ? _newFradato : s!.fradato}
              label={t('label:dato-for-relasjon')}
              setDato={onFradatoChanged}
              value={i < 0 ?_newFradato : s!.fradato}
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
      {statsborgerskaper?.map(renderRow)}
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
