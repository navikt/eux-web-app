import { resetValidation } from 'actions/validation'
import { TwoLevelFormProps, TwoLevelFormSelector } from 'applications/SvarSed/TwoLevelForm'
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
import { ErrorElement, Option } from 'declarations/app.d'
import { Button, Ingress, BodyLong, Detail } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getIdx } from 'utils/namespace'
import { validateFamilieytelserPeriode, ValidationFamilieytelsePeriodeProps } from './validation'
import { Add } from '@navikt/ds-icons'

const mapState = (state: State): TwoLevelFormSelector => ({
  validation: state.validation.status
})

const FamilieYtelser: React.FC<TwoLevelFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:TwoLevelFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useSelector<State, TwoLevelFormSelector>(mapState)
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

  const setPeriode = (periode: Periode, id: string, index: number, newSedCategory: SedCategory | null) => {
    let suffixnamespace: string = ''
    if (newSedCategory === 'perioderMedPensjon') {
      suffixnamespace = '-periode'
    }
    if (index < 0) {
      _setNewPeriode(periode)
      if (id === 'startdato') {
        _resetValidation(namespace + '-familieYtelse-startdato')
      }
      if (id === 'sluttdato') {
        _resetValidation(namespace + '-familieYtelse-sluttdato')
      }
    } else {
      // const newPerioder: Array<Periode | PensjonPeriode> = _.cloneDeep(perioder[newSedCategory!])
      if (newSedCategory === 'perioderMedPensjon') {
        dispatch(updateReplySed(`${personID}.${newSedCategory}.periode`, periode))
      } else {
        dispatch(updateReplySed(`${personID}.${newSedCategory}`, periode))
      }
      if (id === 'startdato' && validation[namespace + '-' + newSedCategory + getIdx(index) + suffixnamespace + '-startdato']) {
        dispatch(resetValidation(namespace + '-' + newSedCategory + getIdx(index) + suffixnamespace + '-startdato'))
      }
      if (id === 'sluttdato' && validation[namespace + newSedCategory + getIdx(index) + suffixnamespace + '-sluttdato']) {
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
        feilmelding: t('validation:noPensjonType') + (personName ? t('validation:til-person', { person: personName }) : ''),
        skjemaelementId: namespace + '-category'
      } as ErrorElement
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
      onCancel()
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
            showLabel={false}
            namespace={namespace + idx}
            error={{
              startdato: getErrorFor(index, 'startdato'),
              sluttdato: getErrorFor(index, 'sluttdato')
            }}
            setPeriode={(p: Periode, id: string) => setPeriode(p, id, index, sedCategory)}
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
                    data-testid={namespace + idx + '-category'}
                    error={getErrorFor(index, 'category')}
                    id={namespace + idx + '-category'}
                    key={namespace + idx + '-category-' + _newCategory}
                    menuPortalTarget={document.body}
                    onChange={(e: unknown) => setCategory((e as Option).value as SedCategory)}
                    options={selectCategoryOptions}
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
                    data-testid={namespace + idx + '-pensjonstype'}
                    error={getErrorFor(index, 'pensjonstype')}
                    id={namespace + idx + '-pensjonstype'}
                    key={namespace + idx + '-pensjonstype-' + (index < 0 ? _newPensjonsType : (periode as PensjonPeriode)?.pensjonstype)}
                    menuPortalTarget={document.body}
                    onChange={(e: unknown) => setPensjonType((e as Option).value as PensjonsType, index)}
                    options={selectPensjonsTypeOptions}
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
        <Detail>
          {t('el:option-trygdeordning-' + item)}
        </Detail>
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
              <label className='navds-text-field__label navds-label'>
                {t('label:startdato') + ' *'}
              </label>
            </Column>
            <Column>
              <label className='navds-text-field__label navds-label'>
                {t('label:sluttdato')}
              </label>
            </Column>
            <Column />
          </Row>
          )
        : (
          <BodyLong>
            {t('message:warning-no-periods')}
          </BodyLong>
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
              <Button
                variant='tertiary'
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
              </Button>
            </Column>
          </Row>
          )}
    </>
  )
}

export default FamilieYtelser
