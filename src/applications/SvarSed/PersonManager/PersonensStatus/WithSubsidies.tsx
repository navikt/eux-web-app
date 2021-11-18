import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Select from 'components/Forms/Select'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { Option, Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { PensjonPeriode, Periode } from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
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
import { getIdx } from 'utils/namespace'
import { validateWithSubsidiesPeriode, ValidationWithSubsidiesProps } from './withSubsidiesValidation'
import { Add } from '@navikt/ds-icons'

interface WithSubsidiesSelector extends PersonManagerFormSelector {
  highContrast: boolean
}

const mapState = (state: State): WithSubsidiesSelector => ({
  highContrast: state.ui.highContrast,
  validation: state.validation.status
})

const WithSubsidies: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    highContrast,
    validation
  } = useSelector<State, WithSubsidiesSelector>(mapState)
  const dispatch = useDispatch()
  const target: string = `${personID}.perioderMedPensjon`
  const perioderMedPensjon: Array<PensjonPeriode> = _.get(replySed, target)
  const namespace = `${parentNamespace}-withsubsidies`

  const [_newPeriode, _setNewPeriode] = useState<Periode>({ startdato: '' })
  const [_newPensjonType, _setNewPensjonType] = useState<string>('')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<PensjonPeriode>((p: PensjonPeriode): string => {
    return p?.periode.startdato // assume startdato is unique
  })
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationWithSubsidiesProps>({}, validateWithSubsidiesPeriode)

  const selectPensjonTypeOptions: Options = [{
    label: t('el:option-trygdeordning-alderspensjon'), value: 'alderspensjon'
  }, {
    label: t('el:option-trygdeordning-uførhet'), value: 'uførhet'
  }]

  const setPeriode = (periode: Periode, id: string, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      if (id === 'startdato') {
        _resetValidation(namespace + '-startdato')
      }
      if (id === 'sluttdato') {
        _resetValidation(namespace + '-sluttdato')
      }
    } else {
      dispatch(updateReplySed(`${target}[${index}]`, periode))
      if (id === 'startdato' && validation[namespace + getIdx(index) + '-startdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-startdato'))
      }
      if (id === 'sluttdato' && validation[namespace + getIdx(index) + '-sluttdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-sluttdato'))
      }
    }
  }

  const setPensjonType = (pensjontype: string | undefined, index: number) => {
    if (pensjontype) {
      if (index < 0) {
        _setNewPensjonType(pensjontype.trim())
        _resetValidation(namespace + '-pensjontype')
      } else {
        dispatch(updateReplySed(`${target}[${index}].pensjonstype`, pensjontype.trim()))
        if (validation[namespace + getIdx(index) + '-pensjontype']) {
          dispatch(resetValidation(namespace + getIdx(index) + '-pensjontype'))
        }
      }
    }
  }

  const resetForm = () => {
    _setNewPeriode({ startdato: '' })
    _setNewPensjonType('')
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (index: number) => {
    const newPerioder: Array<PensjonPeriode> = _.cloneDeep(perioderMedPensjon)
    const deletedPeriods: Array<PensjonPeriode> = newPerioder.splice(index, 1)
    if (deletedPeriods && deletedPeriods.length > 0) {
      removeFromDeletion(deletedPeriods[0])
    }
    dispatch(updateReplySed(target, newPerioder))
    standardLogger('svarsed.editor.periode.remove', { type: 'perioderMedPensjon' })
  }

  const onAdd = () => {
    const newPensjonPeriode: PensjonPeriode = {
      pensjonstype: _newPensjonType.trim(),
      periode: _newPeriode
    }

    const valid: boolean = performValidation({
      pensjonPeriode: newPensjonPeriode,
      perioder: perioderMedPensjon,
      namespace,
      personName
    })

    if (valid) {
      let newPensjonPerioder: Array<PensjonPeriode> = _.cloneDeep(perioderMedPensjon)
      if (_.isNil(newPensjonPerioder)) {
        newPensjonPerioder = []
      }
      newPensjonPerioder = newPensjonPerioder.concat(newPensjonPeriode)
      dispatch(updateReplySed(target, newPensjonPerioder))
      standardLogger('svarsed.editor.periode.add', { type: 'perioderMedPensjon' })
      resetForm()
    }
  }

  const getPensjonTypeOption = (value: string | undefined | null) => _.find(selectPensjonTypeOptions, s => s.value === value)

  const renderRow = (pensjonPeriode: PensjonPeriode | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(pensjonPeriode)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
    const _periode = index < 0 ? _newPeriode : pensjonPeriode?.periode
    return (
      <RepeatableRow
        className={classNames('slideInFromLeft', { new: index < 0 })}
        style={{ animationDelay: index < 0 ? '0s' : (index * 0.1) + 's' }}
      >
        <AlignStartRow>
          <PeriodeInput
            namespace={namespace + idx + '-periode'}
            error={{
              startdato: getErrorFor(index, 'periode-startdato'),
              sluttdato: getErrorFor(index, 'periode-sluttdato')
            }}
            setPeriode={(p: Periode, id: string) => setPeriode(p, id, index)}
            value={_periode}
          />
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column>
            <Select
              closeMenuOnSelect
              data-test-id={namespace + idx + '-pensjontype'}
              feil={getErrorFor(index, 'pensjontype')}
              highContrast={highContrast}
              id={namespace + idx + '-pensjontype'}
              key={namespace + idx + '-pensjontype-' + (index < 0 ? _newPensjonType : (pensjonPeriode as PensjonPeriode)?.pensjonstype)}
              label={t('label:type-pensjon')}
              menuPortalTarget={document.body}
              onChange={(o: Option) => setPensjonType(o?.value, index)}
              options={selectPensjonTypeOptions}
              placeholder={t('el:placeholder-select-default')}
              value={getPensjonTypeOption(index < 0 ? _newPensjonType : (pensjonPeriode as PensjonPeriode)?.pensjonstype)}
              defaultValue={getPensjonTypeOption(index < 0 ? _newPensjonType : (pensjonPeriode as PensjonPeriode)?.pensjonstype)}
            />
          </Column>
          <Column />
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(pensjonPeriode)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(pensjonPeriode)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </RepeatableRow>
    )
  }

  return (
    <>
      <Undertittel>
        {t('label:periode-pensjon-avsenderlandet')}
      </Undertittel>
      <VerticalSeparatorDiv size={2} />
      {_.isEmpty(perioderMedPensjon)
        ? (
          <Normaltekst>
            {t('message:warning-no-periods')}
          </Normaltekst>
          )
        : perioderMedPensjon
          ?.sort((a, b) =>
            moment(a.periode.startdato).isSameOrBefore(moment(b.periode.startdato)) ? -1 : 1
          )
          ?.map(renderRow)}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
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
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
      <VerticalSeparatorDiv />
    </>
  )
}

export default WithSubsidies
