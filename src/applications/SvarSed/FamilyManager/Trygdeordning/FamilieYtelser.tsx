import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import useAddRemove from 'components/AddRemovePanel/useAddRemove'
import Period from 'components/Period/Period'
import Select from 'components/Forms/Select'
import { AlignStartRow } from 'components/StyledComponents'
import useValidation from 'components/Validation/useValidation'
import { PensjonPeriode, PensjonsType, Periode, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Ingress, UndertekstBold } from 'nav-frontend-typografi'
import { Column, HighContrastFlatknapp, HorizontalSeparatorDiv, Row, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { OptionsType } from 'react-select'
import { validateFamilieytelserPeriode, ValidationFamilieytelsePeriodeProps } from './validation'

interface TrygdeordningProps {
  highContrast: boolean
  updateReplySed: (needle: string, value: any) => void
  personID: string
  personName: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  validation: Validation
}

type SedCategory = 'perioderMedArbeid' | 'perioderMedTrygd' |
  'perioderMedYtelser' | 'perioderMedPensjon'

const FamilieYtelser: React.FC<TrygdeordningProps> = ({
  highContrast,
  updateReplySed,
  personID,
  personName,
  replySed,
  resetValidation,
  validation
}: TrygdeordningProps): JSX.Element => {
  const { t } = useTranslation()
  const perioder: {[k in SedCategory]: Array<Periode | PensjonPeriode>} = {
    perioderMedArbeid: _.get(replySed, `${personID}.perioderMedArbeid`),
    perioderMedTrygd: _.get(replySed, `${personID}.perioderMedTrygd`),
    perioderMedYtelser: _.get(replySed, `${personID}.perioderMedYtelser`),
    perioderMedPensjon: _.get(replySed, `${personID}.perioderMedPensjon`)
  }
  const namespace = `familymanager-${personID}-trygdeordninger`

  const [_newSluttDato, _setNewSluttDato] = useState<string>('')
  const [_newStartDato, _setNewStartDato] = useState<string>('')
  const [_newCategory, _setNewCategory] = useState<SedCategory | undefined>(undefined)
  const [_newPensjonsType, _setNewPensjonsType] = useState<PensjonsType | undefined>(undefined)

  const [addCandidateForDeletion, removeCandidateForDeletion, hasKey] = useAddRemove()
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation, _setValidation] =
    useValidation<ValidationFamilieytelsePeriodeProps>({}, validateFamilieytelserPeriode)

  const selectCategoryOptions: OptionsType<{label: string, value: SedCategory}> = [{
    label: t('el:option-trygdeordning-perioderMedArbeid'), value: 'perioderMedArbeid'
  }, {
    label: t('el:option-trygdeordning-perioderMedTrygd'), value: 'perioderMedTrygd'
  }, {
    label: t('el:option-trygdeordning-perioderMedYtelser'), value: 'perioderMedYtelser'
  }, {
    label: t('el:option-trygdeordning-perioderMedPensjon'), value: 'perioderMedPensjon'
  }]

  const selectPensjonsTypeOptions: Array<{label: string, value: PensjonsType}> = [{
    label: t('el:option-trygdeordning-alderspensjon'), value: 'alderspensjon'
  }, {
    label: t('el:option-trygdeordning-uførhet'), value: 'uførhet'
  }]

  const getCategoryOption = (value: string | undefined | null) => _.find(selectCategoryOptions, s => s.value === value)

  const getPensjonsTypeOption = (value: string | undefined | null) => _.find(selectPensjonsTypeOptions, s => s.value === value)

  const setStartDato = (dato: string, index: number, newSedCategory: SedCategory | null) => {
    if (index < 0) {
      _setNewStartDato(dato)
      _resetValidation(namespace + '-familieYtelse-startdato')
    } else {
      const newPerioder: Array<Periode | PensjonPeriode> = _.cloneDeep(perioder[newSedCategory!])

      if (newSedCategory === 'perioderMedPensjon') {
        (newPerioder[index] as PensjonPeriode).periode.startdato = dato
      } else {
        (newPerioder[index] as Periode).startdato = dato
      }
      updateReplySed(`${personID}.${newSedCategory}`, newPerioder)
      if (validation[namespace + '-familieYtelse-startdato']) {
        resetValidation(namespace + '-familieYtelse-startdato')
      }
    }
  }

  const setSluttDato = (dato: string, index: number, newSedCategory: SedCategory |null) => {
    if (index < 0) {
      _setNewSluttDato(dato)
      _resetValidation(namespace + '-familieYtelse-sluttdato')
    } else {
      if (newSedCategory === 'perioderMedPensjon') {
        const newPerioder: Array<PensjonPeriode> = _.cloneDeep(perioder[newSedCategory]) as Array<PensjonPeriode>
        if (dato === '') {
          delete newPerioder[index].periode.sluttdato
          newPerioder[index].periode.aapenPeriodeType = 'åpen_sluttdato'
        } else {
          delete newPerioder[index].periode.aapenPeriodeType
          newPerioder[index].periode.sluttdato = dato
        }
        updateReplySed(`${personID}.${newSedCategory}`, newPerioder)
      } else {
        const newPerioder: Array<Periode> = _.cloneDeep(perioder[newSedCategory!]) as Array<Periode>
        if (dato === '') {
          delete newPerioder[index].sluttdato
          newPerioder[index].aapenPeriodeType = 'åpen_sluttdato'
        } else {
          delete newPerioder[index].aapenPeriodeType
          newPerioder[index].sluttdato = dato
        }
        updateReplySed(`${personID}.${newSedCategory}`, newPerioder)
      }
      if (validation[namespace + '-familieYtelse-sluttdato']) {
        resetValidation(namespace + '-familieYtelse-sluttdato')
      }
    }
  }

  const setCategory = (newSedCategory: SedCategory) => {
    _setNewCategory(newSedCategory)
    _resetValidation(namespace + '-familieYtelse-category')
  }

  const setPensjonType = (type: PensjonsType, index: number) => {
    if (index < 0) {
      _setNewPensjonsType(type)
      _resetValidation(namespace + '-familieYtelse-pensjontype')
    } else {
      const newPerioder: Array<PensjonPeriode> = _.cloneDeep(perioder.perioderMedPensjon) as Array<PensjonPeriode>
      newPerioder[index].pensjonstype = type

      updateReplySed(`${personID}.perioderMedPensjon`, newPerioder)
      if (validation[namespace + '-perioderMedPensjon[' + index + ']-startdato']) {
        resetValidation(namespace + '-perioderMedPensjon[' + index + ']-startdato')
      }
    }
  }

  const resetForm = () => {
    _setNewStartDato('')
    _setNewSluttDato('')
    _setNewCategory(undefined)
    _setNewPensjonsType(undefined)
    resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const getKey = (p: Periode | PensjonPeriode, sedCategory: SedCategory): string => {
    if (sedCategory === 'perioderMedPensjon') {
      return (p as PensjonPeriode).periode.startdato
    }
    return (p as Periode).startdato
  }

  const onRemove = (i: number, newSedCategory: SedCategory) => {
    const newPerioder: Array<Periode | PensjonPeriode> = _.cloneDeep(perioder[newSedCategory])
    const deletedPerioder: Array<Periode | PensjonPeriode> = newPerioder.splice(i, 1)
    if (deletedPerioder && deletedPerioder.length > 0) {
      removeCandidateForDeletion(getKey(deletedPerioder[0], newSedCategory))
    }
    updateReplySed(`${personID}.${newSedCategory}`, newPerioder)
  }

  const onAdd = () => {
    if (!_newCategory) {
      const newValidation: Validation = {}
      newValidation[namespace + '-familieYtelse-category'] = {
        feilmelding: t('message:validation-noPensjonTypeTilPerson', { person: personName }),
        skjemaelementId: 'c-' + namespace + '-category-text'
      } as FeiloppsummeringFeil
      _setValidation(newValidation)
      return false
    }

    const newPeriode: any = {}

    if (_newCategory === 'perioderMedPensjon') {
      (newPeriode as PensjonPeriode).pensjonstype = _newPensjonsType!;
      (newPeriode as PensjonPeriode).periode = {
        startdato: _newStartDato
      }
      if (_newSluttDato) {
        (newPeriode as PensjonPeriode).periode.sluttdato = _newSluttDato
      } else {
        (newPeriode as PensjonPeriode).periode.aapenPeriodeType = 'åpen_sluttdato'
      }
    } else {
      (newPeriode as Periode).startdato = _newStartDato
      if (_newSluttDato) {
        (newPeriode as Periode).sluttdato = _newSluttDato
      } else {
        (newPeriode as Periode).aapenPeriodeType = 'åpen_sluttdato'
      }
    }

    const valid: boolean = performValidation({
      periode: newPeriode,
      index: -1,
      namespace,
      sedCategory: _newCategory,
      personName
    })

    if (valid) {
      let newPerioder: Array<Periode | PensjonPeriode> = _.cloneDeep(perioder[_newCategory])
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      newPerioder = newPerioder.concat(newPeriode)
      resetForm()
      updateReplySed(`${personID}.${_newCategory}`, newPerioder)
    }
  }

  const getErrorFor = (sedCategory: SedCategory | null, index: number, el: string): string | undefined => {
    return index < 0
      ? _validation[namespace + '-familieYtelse-' + el]?.feilmelding
      : validation[namespace + '-' + sedCategory! + '[' + index + ']-' + el]?.feilmelding
  }

  const renderRow = (
    periode: Periode | PensjonPeriode | null,
    sedCategory: SedCategory | null,
    index: number
  ) => {
    const key = periode && sedCategory ? getKey(periode, sedCategory) : 'new'
    const candidateForDeletion: boolean = index < 0 ? false : hasKey(key)
    const idx = '-' + (index < 0 ? 'familieYtelse' : sedCategory + '[' + index + ']')

    const startdato = index < 0
      ? _newStartDato
      : (sedCategory === 'perioderMedPensjon'
          ? (periode as PensjonPeriode)?.periode.startdato
          : (periode as Periode)?.startdato)
    const sluttdato = index < 0
      ? _newSluttDato
      : (sedCategory === 'perioderMedPensjon'
          ? (periode as PensjonPeriode)?.periode.sluttdato
          : (periode as Periode)?.sluttdato)

    return (
      <>
        <AlignStartRow className={classNames('slideInFromLeft')}>
          <Period
            key={'' + startdato + sluttdato}
            labels={false}
            namespace={namespace + idx}
            errorStartDato={getErrorFor(sedCategory, index, 'startdato')}
            errorSluttDato={getErrorFor(sedCategory, index, 'sluttdato')}
            setStartDato={(dato: string) => setStartDato(dato, index, sedCategory)}
            setSluttDato={(dato: string) => setSluttDato(dato, index, sedCategory)}
            valueStartDato={startdato}
            valueSluttDato={sluttdato}
          />
          <Column>
            {sedCategory !== 'perioderMedPensjon' && index >= 0 && (
              <AddRemovePanel
                candidateForDeletion={candidateForDeletion}
                existingItem={(index >= 0)}
                marginTop={false}
                onBeginRemove={() => addCandidateForDeletion(key!)}
                onConfirmRemove={() => onRemove(index, sedCategory!)}
                onCancelRemove={() => removeCandidateForDeletion(key!)}
                onAddNew={() => onAdd()}
                onCancelNew={() => onCancel()}
              />
            )}
          </Column>
        </AlignStartRow>
        {(index < 0 || sedCategory === 'perioderMedPensjon') && (
          <>
            <VerticalSeparatorDiv data-size='0.5' />
            <AlignStartRow className={classNames('slideInFromLeft')}>
              <Column>
                {index < 0 && (
                  <Select
                    data-test-id={'c-' + namespace + '-familieYtelse-category-text'}
                    feil={getErrorFor(sedCategory, index, 'category')}
                    highContrast={highContrast}
                    id={'c-' + namespace + '-familieYtelse-category-text'}
                    menuPortalTarget={document.body}
                    onChange={(e: any) => setCategory(e.value)}
                    options={selectCategoryOptions}
                    placeholder={t('el:placeholder-select-default')}
                    selectedValue={getCategoryOption(_newCategory)}
                    defaultValue={getCategoryOption(_newCategory)}
                  />
                )}
              </Column>
              <Column>
                {(
                  (index < 0 && _newCategory === 'perioderMedPensjon') ||
                  (index >= 0 && sedCategory === 'perioderMedPensjon')
                ) &&
                (
                  <Select
                    data-test-id={'c-' + namespace + idx + '-pensjonstype-text'}
                    feil={getErrorFor(sedCategory, index, 'pensjonstype')}
                    highContrast={highContrast}
                    id={'c-' + namespace + idx + '-pensjonstype-text'}
                    menuPortalTarget={document.body}
                    onChange={(e: any) => setPensjonType(e.value, index)}
                    options={selectPensjonsTypeOptions}
                    placeholder={t('el:placeholder-select-default')}
                    selectedValue={getPensjonsTypeOption(index < 0 ? _newPensjonsType : (periode as PensjonPeriode)?.pensjonstype)}
                    defaultValue={getPensjonsTypeOption(index < 0 ? _newPensjonsType : (periode as PensjonPeriode)?.pensjonstype)}
                  />
                )}
              </Column>
              <Column>
                <AddRemovePanel
                  candidateForDeletion={candidateForDeletion}
                  existingItem={(index >= 0)}
                  marginTop={false}
                  onBeginRemove={() => addCandidateForDeletion(key!)}
                  onConfirmRemove={() => onRemove(index, sedCategory!)}
                  onCancelRemove={() => removeCandidateForDeletion(key!)}
                  onAddNew={() => onAdd()}
                  onCancelNew={() => onCancel()}
                />
              </Column>
            </AlignStartRow>
          </>
        )}
        <VerticalSeparatorDiv />
      </>
    )
  }

  const titleFor = (item: SedCategory) => {
    if (_.isEmpty(perioder[item])) {
      return null
    }
    return (
      <>
        <VerticalSeparatorDiv />
        <UndertekstBold>
          {t('el:option-trygdeordning-' + item)}
        </UndertekstBold>
        <VerticalSeparatorDiv />
      </>
    )
  }
  const existsFamilieYtelser = (perioder.perioderMedArbeid.length + perioder.perioderMedTrygd.length +
    perioder.perioderMedYtelser.length + perioder.perioderMedPensjon.length) > 0

  return (
    <>
      <Ingress>
        {t('el:title-trygdeordningen-familieYtelse')}
      </Ingress>
      <VerticalSeparatorDiv />
      {existsFamilieYtelser && (
        <Row className='slideInFromLeft'>
          <Column>
            <label className='skjemaelement__label'>
              {t('label:startdato') + ' *'}
            </label>
          </Column>
          <Column>
            <label className='skjemaelement__label'>
              {t('label:sluttdato')}
            </label>
          </Column>
          <Column />
        </Row>
      )}
      <VerticalSeparatorDiv />
      {titleFor('perioderMedArbeid')}
      {perioder.perioderMedArbeid.map((p, i) => renderRow(p, 'perioderMedArbeid', i))}
      {titleFor('perioderMedTrygd')}
      {perioder.perioderMedTrygd.map((p, i) => renderRow(p, 'perioderMedTrygd', i))}
      {titleFor('perioderMedYtelser')}
      {perioder.perioderMedYtelser.map((p, i) => renderRow(p, 'perioderMedYtelser', i))}
      {titleFor('perioderMedPensjon')}
      {perioder.perioderMedPensjon.map((p, i) => renderRow(p, 'perioderMedPensjon', i))}
      <hr />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, null, -1)
        : (
          <Row className='slideInFromLeft'>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
    </>
  )
}

export default FamilieYtelser
