import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import DateInput from 'components/Forms/DateInput'
import { toFinalDateFormat } from 'components/Period/Period'
import { AlignStartRow, PaddedDiv } from 'components/StyledComponents'
import { ReplySed, Statsborgerskap } from 'declarations/sed'
import { Kodeverk, Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { UndertekstBold, Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastFlatknapp, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getIdx } from 'utils/namespace'
import { validateNasjonalitet, ValidationNasjonalitetProps } from './validation'

interface NasjonalitetProps {
  highContrast: boolean
  landkoderList: Array<Kodeverk>
  parentNamespace: string
  personID: string
  personName: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const Nasjonaliteter: React.FC<NasjonalitetProps> = ({
  landkoderList,
  parentNamespace,
  personID,
  personName,
  replySed,
  resetValidation,
  updateReplySed,
  validation
}:NasjonalitetProps): JSX.Element => {
  const { t } = useTranslation()
  const target = `${personID}.personInfo.statsborgerskap`
  const statsborgerskaper: Array<Statsborgerskap> = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-nasjonaliteter`

  const [_newLand, _setNewLand] = useState<string | undefined>(undefined)
  const [_newFradato, _setNewFradato] = useState<string>('')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Statsborgerskap>((s: Statsborgerskap): string => s.land)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationNasjonalitetProps>({}, validateNasjonalitet)

  const onFradatoChanged = (fradato: string, index: number) => {
    if (index < 0) {
      _setNewFradato(fradato.trim())
      _resetValidation(namespace + '-fradato')
    } else {
      updateReplySed(`${target}[${index}].fradato`, toFinalDateFormat(fradato.trim()))
      if (validation[namespace + getIdx(index) + '-fradato']) {
        resetValidation(namespace + getIdx(index) + '-fradato')
      }
    }
  }

  const onLandSelected = (land: string, index: number) => {
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
    _setNewLand(undefined)
    _setNewFradato('')
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (i: number) => {
    const newStatsborgerskaper = _.cloneDeep(statsborgerskaper)
    const deletedStatsborgerskaper: Array<Statsborgerskap> = newStatsborgerskaper.splice(i, 1)
    if (deletedStatsborgerskaper && deletedStatsborgerskaper.length > 0) {
      removeFromDeletion(deletedStatsborgerskaper[0])
    }
    updateReplySed(target, newStatsborgerskaper)
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
      updateReplySed(target, newStatsborgerskaper)
      resetForm()
    }
  }

  const renderRow = (statsborgerskap: Statsborgerskap | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(statsborgerskap)
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
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.05) + 's' }}
        >
          <Column>
            <CountrySelect
              key={namespace + idx + '-land' + statsborgerskap!.land}
              data-test-id={namespace + idx + '-land'}
              error={getErrorFor(index, 'land')}
              id={namespace + idx + '-land'}
              includeList={landkoderList ? landkoderList.map((l: Kodeverk) => l.kode) : []}
              menuPortalTarget={document.body}
              onOptionSelected={(e: any) => onLandSelected(e.value, index)}
              placeholder={t('el:placeholder-select-default')}
              values={index < 0 ? _newLand : statsborgerskap!.land}
            />
          </Column>
          <Column>
            <DateInput
              error={getErrorFor(index, 'fradato')}
              namespace={namespace + idx + '-fradato'}
              key={index < 0 ? _newFradato : statsborgerskap!.fradato}
              label=''
              setDato={(date: string) => onFradatoChanged(date, index)}
              value={index < 0 ? _newFradato : statsborgerskap!.fradato}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop={false}
              onBeginRemove={() => addToDeletion(statsborgerskap)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(statsborgerskap)}
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
      <Undertittel>
        {t('label:nasjonalitet')}
      </Undertittel>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column>
          <UndertekstBold>
            {t('label:nasjonalitet') + ' *'}
          </UndertekstBold>
        </Column>
        <Column>
          <UndertekstBold>
            {t('label:fra-dato') + ' *'}
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
          <AlignStartRow>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:nasjonalitet').toLowerCase() })}
              </HighContrastFlatknapp>

            </Column>
          </AlignStartRow>
          )}
    </PaddedDiv>
  )
}

export default Nasjonaliteter
