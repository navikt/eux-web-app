import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Select from 'components/Forms/Select'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { PensjonPeriode, PensjonsType, Periode, SedCategory } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Ingress, Normaltekst, UndertekstBold } from 'nav-frontend-typografi'
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
import { Option } from 'declarations/app.d'
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

  const [_newPeriode, _setNewPeriode] = useState<Periode>({ startdato: '' })
  const [_newCategory, _setNewCategory] = useState<SedCategory | undefined>(undefined)
  const [_newPensjonsType, _setNewPensjonsType] = useState<PensjonsType | undefined>(undefined)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Periode | PensjonPeriode>((p: Periode | PensjonPeriode): string => {
    if (_.isNil((p as Periode).startdato) && !_.isNil((p as PensjonPeriode).periode)) {
      return (p as PensjonPeriode).periode.startdato + '-' + ((p as PensjonPeriode).periode.sluttdato ?? (p as PensjonPeriode).periode.aapenPeriodeType)
    }
    return (p as Periode).startdato + '-' + ((p as Periode).sluttdato ?? (p as Periode).aapenPeriodeType)
  })
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation, _setValidation] =
    useValidation<ValidationFamilieytelsePeriodeProps>({}, validateFamilieytelserPeriode)

  const selectCategoryOptions: Array<Option> = [{
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

  const setPeriode = (periode: Periode, index: number, newSedCategory: SedCategory | null) => {
    let suffixnamespace: string = ''
    if (newSedCategory === 'perioderMedPensjon') {
      suffixnamespace = '-periode'
    }
    if (index < 0) {
      _setNewPeriode(periode)
      _resetValidation(namespace + '-familieYtelse-startdato')
      _resetValidation(namespace + '-familieYtelse-sluttdato')
    } else {
      // const newPerioder: Array<Periode | PensjonPeriode> = _.cloneDeep(perioder[newSedCategory!])
      if (newSedCategory === 'perioderMedPensjon') {
        dispatch(updateReplySed(`${personID}.${newSedCategory}.periode`, periode))
      } else {
        dispatch(updateReplySed(`${personID}.${newSedCategory}`, periode))
      }
      if (validation[namespace + '-' + newSedCategory + getIdx(index) + suffixnamespace + '-startdato']) {
        dispatch(resetValidation(namespace + '-' + newSedCategory + getIdx(index) + suffixnamespace + '-startdato'))
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
    _setNewPeriode({ startdato: '' })
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
    standardLogger('svarsed.editor.periode.remove', { type: newSedCategory })
  }

  const onAdd = () => {
    if (!_newCategory) {
      const newValidation: Validation = {}
      newValidation[namespace + '-familieYtelse-category'] = {
        feilmelding: t('message:validation-noPensjonTypeTil', { person: personName }),
        skjemaelementId: namespace + '-category'
      } as FeiloppsummeringFeil
      _setValidation(newValidation)
      return false
    }

    let newPeriode: PensjonPeriode | Periode

    if (_newCategory === 'perioderMedPensjon') {
      newPeriode = {
        pensjonstype: _newPensjonsType!,
        periode: _newPeriode
      }
    } else {
      newPeriode = _newPeriode
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
      dispatch(updateReplySed(`${personID}.${_newCategory}`, newPerioder))
      standardLogger('svarsed.editor.periode.add', { type: _newCategory })
      resetForm()
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

    const _periode = index < 0
      ? _newPeriode
      : sedCategory === 'perioderMedPensjon'
        ? (periode as PensjonPeriode)?.periode
        : (periode as Periode)

    return (
      <RepeatableRow
        className={classNames('slideInFromLeft', { new: index < 0 })}
        style={{ animationDelay: index < 0 ? '0s' : (index * 0.1) + 's' }}
      >
        <AlignStartRow>
          <PeriodeInput
            key={'' + _periode.startdato + _periode.sluttdato}
            showLabel={false}
            namespace={namespace + idx}
            error={{
              startdato: getErrorFor(index, 'startdato'),
              sluttdato: getErrorFor(index, 'sluttdato')
            }}
            setPeriode={(p: Periode) => setPeriode(p, index, sedCategory)}
            value={_periode}
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
                    value={getCategoryOption(_newCategory)}
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
                    value={getPensjonsTypeOption(index < 0 ? _newPensjonsType : (periode as PensjonPeriode)?.pensjonstype)}
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
      </RepeatableRow>
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
  const existsFamilieYtelser = (
    (perioder?.perioderMedArbeid?.length ?? 0) +
    (perioder?.perioderMedTrygd?.length ?? 0) +
    (perioder?.perioderMedYtelser?.length ?? 0) +
    (perioder?.perioderMedPensjon?.length ?? 0)
  ) > 0

  return (
    <>
      <Ingress>
        {t('label:trygdeordningen-familieYtelse')}
      </Ingress>
      <VerticalSeparatorDiv size={2} />
      {existsFamilieYtelser
        ? (
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
          )
        : (
          <Normaltekst>
            {t('message:warning-no-periods')}
          </Normaltekst>
          )}
      <VerticalSeparatorDiv />
      {titleFor('perioderMedArbeid')}
      {perioder?.perioderMedArbeid?.map((p, i) => renderRow(p, 'perioderMedArbeid', i))}
      {titleFor('perioderMedTrygd')}
      {perioder?.perioderMedTrygd?.map((p, i) => renderRow(p, 'perioderMedTrygd', i))}
      {titleFor('perioderMedYtelser')}
      {perioder?.perioderMedYtelser?.map((p, i) => renderRow(p, 'perioderMedYtelser', i))}
      {titleFor('perioderMedPensjon')}
      {perioder?.perioderMedPensjon?.map((p, i) => renderRow(p, 'perioderMedPensjon', i))}
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
