import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Select from 'components/Forms/Select'
import Period from 'components/Period/Period'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { PensjonPeriode, PensjonsType, Periode, SedCategory } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Ingress, UndertekstBold } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column,
  HighContrastFlatknapp,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { OptionsType } from 'react-select'
import { getIdx } from 'utils/namespace'
import { validateFamilieytelserPeriode, ValidationFamilieytelsePeriodeProps } from './validation'

interface FamilieYtelserSelector extends PersonManagerFormSelector {
  highContrast: boolean
}

const mapState = (state: State): FamilieYtelserSelector => ({
  highContrast: state.ui.highContrast,
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const FamilieYtelser: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  personName
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    highContrast,
    replySed,
    validation
  } = useSelector<State, FamilieYtelserSelector>(mapState)
  const dispatch = useDispatch()
  const perioder: {[k in SedCategory]: Array<Periode | PensjonPeriode>} = {
    perioderMedArbeid: _.get(replySed, `${personID}.perioderMedArbeid`),
    perioderMedTrygd: _.get(replySed, `${personID}.perioderMedTrygd`),
    perioderMedYtelser: _.get(replySed, `${personID}.perioderMedYtelser`),
    perioderMedPensjon: _.get(replySed, `${personID}.perioderMedPensjon`)
  }
  const namespace = `${parentNamespace}-${personID}-trygdeordninger`

  const [_newSluttDato, _setNewSluttDato] = useState<string>('')
  const [_newStartDato, _setNewStartDato] = useState<string>('')
  const [_newCategory, _setNewCategory] = useState<SedCategory | undefined>(undefined)
  const [_newPensjonsType, _setNewPensjonsType] = useState<PensjonsType | undefined>(undefined)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Periode | PensjonPeriode>((p: Periode | PensjonPeriode): string => {
    if (_.isNil((p as Periode).startdato) && !_.isNil((p as PensjonPeriode).periode)) {
      return (p as PensjonPeriode).periode.startdato
    }
    return (p as Periode).startdato
  })
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

  const setStartDato = (startdato: string, index: number, newSedCategory: SedCategory | null) => {
    let suffixnamespace: string = ''
    if (newSedCategory === 'perioderMedPensjon') {
      suffixnamespace = '-periode'
    }
    if (index < 0) {
      _setNewStartDato(startdato.trim())
      _resetValidation(namespace + '-familieYtelse-startdato')
    } else {
      const newPerioder: Array<Periode | PensjonPeriode> = _.cloneDeep(perioder[newSedCategory!])
      if (newSedCategory === 'perioderMedPensjon') {
        (newPerioder[index] as PensjonPeriode).periode.startdato = startdato.trim()
      } else {
        (newPerioder[index] as Periode).startdato = startdato.trim()
      }
      dispatch(updateReplySed(`${personID}.${newSedCategory}`, newPerioder))
      if (validation[namespace + '-' + newSedCategory + getIdx(index) + suffixnamespace + '-startdato']) {
        dispatch(resetValidation(namespace + '-' + newSedCategory + getIdx(index) + suffixnamespace + '-startdato'))
      }
    }
  }

  const setSluttDato = (sluttdato: string, index: number, newSedCategory: SedCategory |null) => {
    let suffixnamespace: string = ''
    if (newSedCategory === 'perioderMedPensjon') {
      suffixnamespace = '-periode'
    }
    if (index < 0) {
      _setNewSluttDato(sluttdato.trim())
      _resetValidation(namespace + '-familieYtelse-sluttdato')
    } else {
      if (newSedCategory === 'perioderMedPensjon') {
        const newPerioder: Array<PensjonPeriode> = _.cloneDeep(perioder[newSedCategory]) as Array<PensjonPeriode>
        if (sluttdato === '') {
          delete newPerioder[index].periode.sluttdato
          newPerioder[index].periode.aapenPeriodeType = 'åpen_sluttdato'
        } else {
          delete newPerioder[index].periode.aapenPeriodeType
          newPerioder[index].periode.sluttdato = sluttdato.trim()
        }
        dispatch(updateReplySed(`${personID}.${newSedCategory}`, newPerioder))
      } else {
        const newPerioder: Array<Periode> = _.cloneDeep(perioder[newSedCategory!]) as Array<Periode>
        if (sluttdato === '') {
          delete newPerioder[index].sluttdato
          newPerioder[index].aapenPeriodeType = 'åpen_sluttdato'
        } else {
          delete newPerioder[index].aapenPeriodeType
          newPerioder[index].sluttdato = sluttdato.trim()
        }
        dispatch(updateReplySed(`${personID}.${newSedCategory}`, newPerioder))
      }
      if (validation[namespace + newSedCategory + getIdx(index) + suffixnamespace + '-sluttdato']) {
        dispatch(resetValidation(namespace + newSedCategory + getIdx(index) + suffixnamespace + '-sluttdato'))
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
      _resetValidation(namespace + '-familieYtelse-pensjonstype')
    } else {
      const newPerioder: Array<PensjonPeriode> = _.cloneDeep(perioder.perioderMedPensjon) as Array<PensjonPeriode>
      newPerioder[index].pensjonstype = type

      dispatch(updateReplySed(`${personID}.perioderMedPensjon`, newPerioder))
      if (validation[namespace + '-perioderMedPensjon' + getIdx(index) + '-pensjonstype']) {
        dispatch(resetValidation(namespace + '-perioderMedPensjon' + getIdx(index) + '-pensjonstype'))
      }
    }
  }

  const resetForm = () => {
    _setNewStartDato('')
    _setNewSluttDato('')
    _setNewCategory(undefined)
    _setNewPensjonsType(undefined)
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (i: number, newSedCategory: SedCategory) => {
    const newPerioder: Array<Periode | PensjonPeriode> = _.cloneDeep(perioder[newSedCategory])
    const deletedPerioder: Array<Periode | PensjonPeriode> = newPerioder.splice(i, 1)
    if (deletedPerioder && deletedPerioder.length > 0) {
      removeFromDeletion(deletedPerioder[0])
    }
    dispatch(updateReplySed(`${personID}.${newSedCategory}`, newPerioder))
  }

  const onAdd = () => {
    if (!_newCategory) {
      const newValidation: Validation = {}
      newValidation[namespace + '-familieYtelse-category'] = {
        feilmelding: t('message:validation-noPensjonTypeTilPerson', { person: personName }),
        skjemaelementId: namespace + '-category'
      } as FeiloppsummeringFeil
      _setValidation(newValidation)
      return false
    }

    const newPeriode: any = {}

    if (_newCategory === 'perioderMedPensjon') {
      (newPeriode as PensjonPeriode).pensjonstype = _newPensjonsType!;
      (newPeriode as PensjonPeriode).periode = {
        startdato: _newStartDato.trim()
      }
      if (_newSluttDato) {
        (newPeriode as PensjonPeriode).periode.sluttdato = _newSluttDato.trim()
      } else {
        (newPeriode as PensjonPeriode).periode.aapenPeriodeType = 'åpen_sluttdato'
      }
    } else {
      (newPeriode as Periode).startdato = _newStartDato.trim()
      if (_newSluttDato) {
        (newPeriode as Periode).sluttdato = _newSluttDato.trim()
      } else {
        (newPeriode as Periode).aapenPeriodeType = 'åpen_sluttdato'
      }
    }

    const valid: boolean = performValidation({
      periode: newPeriode,
      perioder: perioder[_newCategory],
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
      dispatch(updateReplySed(`${personID}.${_newCategory}`, newPerioder))
    }
  }

  const renderRow = (
    periode: Periode | PensjonPeriode | null,
    sedCategory: SedCategory | null,
    index: number
  ) => {
    const candidateForDeletion: boolean = index < 0 ? false : isInDeletion(periode)
    const idx = '-' + (index < 0 ? 'familieYtelse' : sedCategory + '[' + index + ']')
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + idx + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )

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
      <div
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: index < 0 ? '0s' : (index * 0.1) + 's' }}
      >
        <AlignStartRow>
          <Period
            key={'' + startdato + sluttdato}
            labels={false}
            namespace={namespace + idx}
            errorStartDato={getErrorFor(index, 'startdato')}
            errorSluttDato={getErrorFor(index, 'sluttdato')}
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
                onBeginRemove={() => addToDeletion(periode)}
                onConfirmRemove={() => onRemove(index, sedCategory!)}
                onCancelRemove={() => removeFromDeletion(periode)}
                onAddNew={() => onAdd()}
                onCancelNew={() => onCancel()}
              />
            )}
          </Column>
        </AlignStartRow>
        {(index < 0 || sedCategory === 'perioderMedPensjon') && (
          <>
            <VerticalSeparatorDiv size='0.5' />
            <AlignStartRow className={classNames('slideInFromLeft')}>
              <Column>
                {index < 0 && (
                  <Select
                    data-test-id={namespace + idx + '-category'}
                    feil={getErrorFor(index, 'category')}
                    highContrast={highContrast}
                    id={namespace + idx + '-category'}
                    key={namespace + idx + '-category-' + _newCategory}
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
                    data-test-id={namespace + idx + '-pensjonstype'}
                    feil={getErrorFor(index, 'pensjonstype')}
                    highContrast={highContrast}
                    id={namespace + idx + '-pensjonstype'}
                    key={namespace + idx + '-pensjonstype-' + (index < 0 ? _newPensjonsType : (periode as PensjonPeriode)?.pensjonstype)}
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
                  onBeginRemove={() => addToDeletion(periode)}
                  onConfirmRemove={() => onRemove(index, sedCategory!)}
                  onCancelRemove={() => removeFromDeletion(periode)}
                  onAddNew={() => onAdd()}
                  onCancelNew={() => onCancel()}
                />
              </Column>
            </AlignStartRow>
          </>
        )}
        <VerticalSeparatorDiv />
      </div>
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
        {t('label:trygdeordningen-familieYtelse')}
      </Ingress>
      <VerticalSeparatorDiv size={2} />
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
      <HorizontalLineSeparator />
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
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
    </>
  )
}

export default FamilieYtelser
