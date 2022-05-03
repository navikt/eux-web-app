import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Heading } from '@navikt/ds-react'
import { AlignStartRow, Column, Row, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { resetValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import PeriodeInput from 'components/Forms/PeriodeInput'
import Select from 'components/Forms/Select'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { Option, Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { PensjonPeriode, Periode } from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import { validateWithSubsidiesPeriode, ValidationWithSubsidiesProps } from './withSubsidiesValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const WithSubsidies: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target: string = `${personID}.perioderMedPensjon`
  const perioderMedPensjon: Array<PensjonPeriode> = _.get(replySed, target)
  const namespace = `${parentNamespace}-withsubsidies`

  const [_newPeriode, _setNewPeriode] = useState<Periode>({ startdato: '' })
  const [_newPensjonType, _setNewPensjonType] = useState<string>('')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<PensjonPeriode>((p: PensjonPeriode): string => {
    return p?.periode.startdato // assume startdato is unique
  })
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useLocalValidation<ValidationWithSubsidiesProps>({}, validateWithSubsidiesPeriode)

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
      onCancel()
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
      <RepeatableRow>
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
              data-testid={namespace + idx + '-pensjontype'}
              error={getErrorFor(index, 'pensjontype')}
              id={namespace + idx + '-pensjontype'}
              key={namespace + idx + '-pensjontype-' + (index < 0 ? _newPensjonType : (pensjonPeriode as PensjonPeriode)?.pensjonstype)}
              label={t('label:type-pensjon')}
              menuPortalTarget={document.body}
              onChange={(o: unknown) => setPensjonType((o as Option).value, index)}
              options={selectPensjonTypeOptions}
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
      <Heading size='small'>
        {t('label:periode-pensjon-avsenderlandet')}
      </Heading>
      <VerticalSeparatorDiv size={2} />
      {_.isEmpty(perioderMedPensjon)
        ? (
          <BodyLong>
            {t('message:warning-no-periods')}
          </BodyLong>
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
              <Button
                variant='tertiary'
                onClick={() => _setSeeNewForm(true)}
              >
                <AddCircle />
                {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
              </Button>
            </Column>
          </Row>
          )}
      <VerticalSeparatorDiv />
    </>
  )
}

export default WithSubsidies
