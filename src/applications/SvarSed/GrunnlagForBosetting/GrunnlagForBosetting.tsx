import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Detail, Heading } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  PaddedDiv,
  PaddedHorizontallyDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import DateInput from 'components/Forms/DateInput'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import TextArea from 'components/Forms/TextArea'
import { RepeatableRow, SpacedHr, TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Flyttegrunn, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { periodeSort } from 'utils/sort'
import { hasNamespaceWithErrors } from 'utils/validation'
import { validateGrunnlagForBosettingPeriode, ValidationGrunnlagForBosettingPeriodeProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const GrunnlagforBosetting: React.FC<MainFormProps & {standalone?: boolean}> = ({
  parentNamespace,
  personID,
  personName,
  standalone = true,
  replySed,
  updateReplySed
}:MainFormProps & {standalone?: boolean}): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const namespace = standalone ? `${parentNamespace}-${personID}-grunnlagforbosetting` : `${parentNamespace}-grunnlagforbosetting`
  const target = `${personID}.flyttegrunn`
  const flyttegrunn: Flyttegrunn | undefined = _.get(replySed, target)
  const getId = (p: Periode | null): string => p ? p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType) : 'new'

  const [_newPeriode, _setNewPeriode] = useState<Periode | undefined>(undefined)
  const [_editPeriode, _setEditPeriode] = useState<Periode | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationGrunnlagForBosettingPeriodeProps>(validateGrunnlagForBosettingPeriode, namespace)

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

  const setPeriode = (periode: Periode, whatChanged: string, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      _resetValidation(namespace + '-' + whatChanged)
      return
    }
    _setEditPeriode(periode)
    dispatch(resetValidation(namespace + getIdx(index)))
  }

  const setPersonligSituasjon = (personligSituasjon: string) => {
    dispatch(updateReplySed(`${target}.personligSituasjon`, personligSituasjon.trim()))
    if (validation[namespace + '-personligSituasjon']) {
      dispatch(resetValidation(namespace + '-personligSituasjon'))
    }
  }

  const onCloseEdit = (namespace: string) => {
    _setEditPeriode(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewPeriode(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (periode: Periode, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditPeriode(periode)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const [valid, newValidation] = performValidation<ValidationGrunnlagForBosettingPeriodeProps>(
      validation, namespace, validateGrunnlagForBosettingPeriode, {
        periode: _editPeriode,
        perioder: flyttegrunn?.perioder,
        index: _editIndex,
        personName
      })
    if (valid) {
      dispatch(updateReplySed(`${target}.perioder[${_editIndex}]`, _editPeriode))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(newValidation))
    }
  }

  const onRemove = (removedPeriode: Periode) => {
    const newPerioder: Array<Periode> = _.reject(flyttegrunn?.perioder, (p: Periode) => _.isEqual(removedPeriode, p))
    dispatch(updateReplySed(`${target}.perioder`, newPerioder))
    standardLogger('svarsed.editor.periode.remove', { type: 'flyttegrunn' })
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      periode: _newPeriode,
      perioder: flyttegrunn?.perioder,
      personName
    })

    if (!!_newPeriode && valid) {
      let newPerioder: Array<Periode> | undefined = _.cloneDeep(flyttegrunn?.perioder)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      newPerioder.push(_newPeriode)
      newPerioder = newPerioder.sort(periodeSort)
      dispatch(updateReplySed(`${target}.perioder`, newPerioder))
      standardLogger('svarsed.editor.periode.add', { type: 'flyttegrunn' })
      onCloseNew()
    }
  }

  const renderRow = (periode: Periode | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _periode = index < 0 ? _newPeriode : (inEditMode ? _editPeriode : periode)
    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getId(periode)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow>
          {inEditMode
            ? (
              <PeriodeInput
                namespace={_namespace}
                error={{
                  startdato: _v[_namespace + '-startdato']?.feilmelding,
                  sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                }}
                breakInTwo
                hideLabel={false}
                setPeriode={(p: Periode, whatChanged: string) => setPeriode(p, whatChanged, index)}
                value={_periode}
              />
              )
            : (
              <Column>
                <PeriodeText
                  error={{
                    startdato: _v[_namespace + '-startdato'],
                    sluttdato: _v[_namespace + '-sluttdato']
                  }}
                  periode={_periode}
                />
              </Column>
              )}
          <AlignEndColumn>
            <AddRemovePanel<Periode>
              item={periode}
              marginTop={inEditMode}
              index={index}
              inEditMode={inEditMode}
              onRemove={onRemove}
              onAddNew={onAddNew}
              onCancelNew={onCloseNew}
              onStartEdit={onStartEdit}
              onConfirmEdit={onSaveEdit}
              onCancelEdit={() => onCloseEdit(_namespace)}
            />
          </AlignEndColumn>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <>
      <PaddedDiv>
        <Heading size='small'>
          {t('label:grunnlag-for-bosetting')}
        </Heading>
        <VerticalSeparatorDiv />
        <Detail>
          {t('label:oppholdets-varighet')}
        </Detail>
      </PaddedDiv>
      <VerticalSeparatorDiv />
      {_.isEmpty(flyttegrunn?.perioder)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-periods')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : flyttegrunn?.perioder?.map(renderRow)}
      <VerticalSeparatorDiv />
      {_newForm
        ? renderRow(null, -1)
        : (
          <PaddedDiv>
            <Button
              variant='tertiary'
              onClick={() => _setNewForm(true)}
            >
              <AddCircle />
              {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
      <VerticalSeparatorDiv />
      <PaddedDiv>
        <AlignStartRow>
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
        <VerticalSeparatorDiv />
        <AlignStartRow>
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
      </PaddedDiv>
    </>
  )
}

export default GrunnlagforBosetting
