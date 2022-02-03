import { Add } from '@navikt/ds-icons'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import DateInput from 'components/Forms/DateInput'
import TextArea from 'components/Forms/TextArea'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { HorizontalLineSeparator, RepeatableRow, TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Flyttegrunn, Periode } from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import { BodyLong, Detail, Button, Heading } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  HorizontalSeparatorDiv,
  PaddedDiv,
  Row,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getIdx } from 'utils/namespace'
import { validateGrunnlagForBosetting, ValidationGrunnlagForBosettingProps } from './validation'

const mapState = (state: State): PersonManagerFormSelector => ({
  validation: state.validation.status
})

const GrunnlagforBosetting: React.FC<PersonManagerFormProps & {standalone?: boolean}> = ({
  parentNamespace,
  personID,
  personName,
  standalone = true,
  replySed,
  updateReplySed
}:PersonManagerFormProps & {standalone?: boolean}): JSX.Element => {
  const { t } = useTranslation()
  const {
    validation
  } = useSelector<State, PersonManagerFormSelector>(mapState)
  const dispatch = useDispatch()
  const target = `${personID}.flyttegrunn`
  const flyttegrunn: Flyttegrunn | undefined = _.get(replySed, target)
  const namespace = standalone ? `${parentNamespace}-${personID}-grunnlagforbosetting` : `${parentNamespace}-grunnlagforbosetting`

  const [_newPeriode, _setNewPeriode] = useState<Periode>({ startdato: '' })

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Periode>((p: Periode): string => {
    return p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType)
  })
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationGrunnlagForBosettingProps>({}, validateGrunnlagForBosetting)

  const setAvsenderDato = (dato: string) => {
    dispatch(updateReplySed(`${target}.datoFlyttetTilAvsenderlandet`, dato.trim()))
    if (validation[namespace + '-datoFlyttetTilAvsenderlandet']) {
      dispatch(resetValidation(namespace + '-datoFlyttetTilAvsenderlandet'))
    }
  }

  const setMottakerDato = (dato: string) => {
    dispatch(updateReplySed(`${target}.datoFlyttetTilMottakerlandet`, dato.trim()))
    if (validation[namespace + '-datoFlyttetTilMottakerlandet']) {
      dispatch(resetValidation(namespace + '-datoFlyttetTilMottakerlandet'))
    }
  }

  const setPeriode = (periode: Periode, id: string, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      if (id === 'startdato') {
        _resetValidation(namespace + '-perioder-startdato')
      }
      if (id === 'sluttdato') {
        _resetValidation(namespace + '-perioder-sluttdato')
      }
    } else {
      dispatch(updateReplySed(`${target}.perioder[${index}]`, periode))
      if (id === 'startdato' && validation[namespace + '-perioder' + getIdx(index) + '-startdato']) {
        dispatch(resetValidation(namespace + '-perioder' + getIdx(index) + '-startdato'))
      }
      if (id === 'sluttdato' && validation[namespace + '-perioder' + getIdx(index) + '-sluttdato']) {
        dispatch(resetValidation(namespace + '-perioder' + getIdx(index) + '-sluttdato'))
      }
    }
  }

  const setPersonligSituasjon = (personligSituasjon: string) => {
    dispatch(updateReplySed(`${target}.personligSituasjon`, personligSituasjon.trim()))
    if (validation[namespace + '-personligSituasjon']) {
      dispatch(resetValidation(namespace + '-personligSituasjon'))
    }
  }

  const resetForm = () => {
    _setNewPeriode({ startdato: '' })
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (index: number) => {
    const newPerioder: Array<Periode> = _.cloneDeep(flyttegrunn!.perioder)
    const deletedPeriods: Array<Periode> = newPerioder.splice(index, 1)
    if (deletedPeriods && deletedPeriods.length > 0) {
      removeFromDeletion(deletedPeriods[0])
    }
    dispatch(updateReplySed(`${target}.perioder`, newPerioder))
    standardLogger('svarsed.editor.periode.remove', { type: 'flyttegrunn' })
  }

  const onAdd = () => {
    const valid: boolean = performValidation({
      periode: _newPeriode,
      perioder: flyttegrunn?.perioder,
      namespace: namespace + '-perioder',
      personName
    })

    if (valid) {
      let newPerioder: Array<Periode> | undefined = _.cloneDeep(flyttegrunn?.perioder)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      newPerioder = newPerioder.concat(_newPeriode)
      dispatch(updateReplySed(`${target}.perioder`, newPerioder))
      standardLogger('svarsed.editor.periode.add', { type: 'flyttegrunn' })
      onCancel()
    }
  }

  const renderRow = (periode: Periode | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periode)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | null | undefined => (
      index < 0
        ? _validation[namespace + '-perioder-' + el]?.feilmelding
        : validation[namespace + '-perioder' + idx + '-' + el]?.feilmelding
    )
    const _periode = index < 0 ? _newPeriode : periode

    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.1) + 's' }}
        >
          <PeriodeInput
            namespace={namespace + '-perioder' + idx}
            error={{
              startdato: getErrorFor(index, 'startdato'),
              sluttdato: getErrorFor(index, 'sluttdato')
            }}
            setPeriode={(p: Periode, id: string) => setPeriode(p, id, index)}
            value={_periode}
          />
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(periode)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(periode)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </RepeatableRow>
    )
  }

  const render = () => (
    <>
      <Detail>
        {t('label:oppholdets-varighet')}
      </Detail>
      <VerticalSeparatorDiv />
      {_.isEmpty(flyttegrunn?.perioder)
        ? (
          <BodyLong>
            {t('message:warning-no-periods')}
          </BodyLong>
          )
        : flyttegrunn?.perioder.sort((a, b) =>
          moment(a.startdato).isSameOrBefore(moment(b.startdato)) ? -1 : 1
        )
          ?.map(renderRow)}
      <VerticalSeparatorDiv size={2} />
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
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
              </Button>
            </Column>
          </Row>
          )}
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column>
          <DateInput
            error={validation[namespace + '-datoFlyttetTilAvsenderlandet']?.feilmelding}
            namespace={namespace}
            id='datoFlyttetTilAvsenderlandet'
            key={'' + flyttegrunn?.datoFlyttetTilAvsenderlandet}
            label={t('label:flyttedato-til-avsenderlandet')}
            onChanged={setAvsenderDato}
            value={flyttegrunn?.datoFlyttetTilAvsenderlandet}
          />
        </Column>
        <Column>
          <DateInput
            error={validation[namespace + '-datoFlyttetTilMottakerlandet']?.feilmelding}
            namespace={namespace}
            id='datoFlyttetTilMottakerlandet'
            key={'' + flyttegrunn?.datoFlyttetTilMottakerlandet}
            label={t('label:flyttedato-til-mottakerslandet')}
            onChanged={setMottakerDato}
            value={flyttegrunn?.datoFlyttetTilMottakerlandet}
          />
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
        <Column flex='2'>
          <TextAreaDiv>
            <TextArea
              error={validation[namespace + '-personligSituasjon']?.feilmelding}
              namespace={namespace}
              id='personligSituasjon'
              label={t('label:elementter-i-personlig-situasjon')}
              onChanged={setPersonligSituasjon}
              value={flyttegrunn?.personligSituasjon ?? ''}
            />
          </TextAreaDiv>
        </Column>
        <Column />
      </AlignStartRow>
    </>
  )

  return (
    standalone
      ? (
        <PaddedDiv>
          <Heading size='small'>
            {t('label:grunnlag-for-bosetting')}
          </Heading>
          <VerticalSeparatorDiv size={2} />
          {render()}
        </PaddedDiv>
        )
      : (
        <>
          <Heading size='small'>
            {t('label:grunnlag-for-bosetting')}
          </Heading>
          <VerticalSeparatorDiv />
          {render()}
        </>
        )
  )
}

export default GrunnlagforBosetting
