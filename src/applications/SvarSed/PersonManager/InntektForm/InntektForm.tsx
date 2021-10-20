import { Add } from '@navikt/ds-icons'
import { fetchInntekt } from 'actions/inntekt'
import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import Inntekter from 'applications/SvarSed/PersonManager/InntektForm/Inntekter'
import InntektSearch from 'applications/SvarSed/PersonManager/InntektSearch/InntektSearch'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import Select from 'components/Forms/Select'
import InntektFC from 'components/Inntekt/Inntekt'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { State } from 'declarations/reducers'
import { Loennsopplysning, Periode, PeriodeType } from 'declarations/sed'
import { Inntekt } from 'declarations/sed.d'
import { IInntekter } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import Chevron from 'nav-frontend-chevron'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column,
  FlexCenterDiv,
  HighContrastFlatknapp,
  HorizontalSeparatorDiv,
  PaddedDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getFnr } from 'utils/fnr'
import { getIdx } from 'utils/namespace'
import { validateLoennsopplysning, ValidationLoennsopplysningProps } from './validationInntektForm'

interface InntektFormSelector extends PersonManagerFormSelector {
  gettingInntekter: boolean
  highContrast: boolean
  inntekter: IInntekter | undefined
}

const mapState = (state: State): InntektFormSelector => ({
  gettingInntekter: state.loading.gettingInntekter,
  highContrast: state.ui.highContrast,
  inntekter: state.inntekt.inntekter,
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const InntektForm: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    gettingInntekter,
    highContrast,
    inntekter,
    replySed,
    validation
  } = useSelector<State, InntektFormSelector>(mapState)
  const dispatch = useDispatch()
  const target = 'loennsopplysninger'
  const loennsopplysninger: Array<Loennsopplysning> = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-inntekt`

  const [_newPeriode, _setNewPeriode] = useState<Periode>({ startdato: '' })
  const [_newPeriodeType, _setNewPeriodeType] = useState<PeriodeType | undefined>(undefined)
  const [_newInntekter, _setNewInntekter] = useState<Array<Inntekt>>([])
  const [_newArbeidsdager, _setNewArbeidsdager] = useState<string>('')
  const [_newArbeidstimer, _setNewArbeidstimer] = useState<string>('')

  const [_visible, _setVisible] = useState<Array<number>>([])

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Loennsopplysning>((l: Loennsopplysning) => l.periode.startdato)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] =
    useValidation<ValidationLoennsopplysningProps>({}, validateLoennsopplysning)

  const isVisible = (index: number): boolean => _visible.indexOf(index) >= 0

  const periodeTypeOptions = [
    { label: t('el:option-periodetype-ansettelsesforhold'), value: 'ansettelsesforhold' },
    { label: t('el:option-periodetype-selvstendig-næringsvirksomhet'), value: 'selvstendig-næringsvirksomhet' }
  ]

  const toggleVisibility = (index: number) => {
    const visible: boolean = isVisible(index)
    _setVisible(visible ? _.filter(_visible, (it) => it !== index) : _visible.concat(index))
  }

  const setPeriode = (periode: Periode, id: string, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      if (id === 'startdato') {
        _resetValidation(namespace + '-periode-startdato')
      }
      if (id === 'sluttdato') {
        _resetValidation(namespace + '-periode-sluttdato')
      }
    } else {
      dispatch(updateReplySed(`${target}[${index}].periode`, periode))
      if (id === 'startdato' && validation[namespace + getIdx(index) + '-periode-startdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-periode-startdato'))
      }
      if (id === 'sluttdato' && validation[namespace + getIdx(index) + '-periode-sluttdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-periode-sluttdato'))
      }
    }
  }

  const setPeriodeType = (newPeriodeType: PeriodeType, index: number) => {
    if (index < 0) {
      _setNewPeriodeType(newPeriodeType)
      _resetValidation(namespace + '-periodetype')
    } else {
      dispatch(updateReplySed(`${target}[${index}].periodetype`, newPeriodeType))
      if (validation[namespace + getIdx(index) + '-periodetype']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-periodetype'))
      }
    }
  }

  const setInntekter = (_newInntekter: Array<Inntekt>, index: number) => {
    if (index < 0) {
      _setNewInntekter(_newInntekter)
      _resetValidation(namespace + '-inntekter')
    } else {
      dispatch(updateReplySed(`${target}[${index}].inntekter`, _newInntekter))
      if (validation[namespace + getIdx(index) + '-inntekter']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-inntekter'))
      }
    }
  }

  const setArbeidsDager = (newArbeidsDager: string, index: number) => {
    if (index < 0) {
      _setNewArbeidsdager(newArbeidsDager.trim())
      _resetValidation(namespace + '-arbeidsdager')
    } else {
      dispatch(updateReplySed(`${target}[${index}].arbeidsdager`, newArbeidsDager.trim()))
      if (validation[namespace + getIdx(index) + '-arbeidsdager']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-arbeidsdager'))
      }
    }
  }

  const setArbeidsTimer = (newArbeidstimer: string, index: number) => {
    if (index < 0) {
      _setNewArbeidstimer(newArbeidstimer.trim())
      _resetValidation(namespace + '-arbeidstimer')
    } else {
      dispatch(updateReplySed(`${target}[${index}].arbeidstimerr`, newArbeidstimer.trim()))
      if (validation[namespace + getIdx(index) + '-arbeidstimer']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-arbeidstimer'))
      }
    }
  }
  const resetForm = () => {
    _setNewArbeidsdager('')
    _setNewArbeidstimer('')
    _setNewPeriode({ startdato: '' })
    _setNewPeriodeType(undefined)
    _setNewInntekter([])
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (index: number) => {
    const newLoennsopplysning: Array<Loennsopplysning> = _.cloneDeep(loennsopplysninger) as Array<Loennsopplysning>
    const deletedLoennsopplysning: Array<Loennsopplysning> = newLoennsopplysning.splice(index, 1)
    if (deletedLoennsopplysning && deletedLoennsopplysning.length > 0) {
      removeFromDeletion(deletedLoennsopplysning[0])
    }
    dispatch(updateReplySed(target, newLoennsopplysning))
    standardLogger('svarsed.editor.loennsopplysning.remove')
  }

  const onAdd = () => {
    const newLoennsopplysning: Loennsopplysning = {
      periode: _newPeriode,
      periodetype: _newPeriodeType,
      inntekter: _newInntekter,
      arbeidsdager: _newArbeidsdager,
      arbeidstimer: _newArbeidstimer
    } as Loennsopplysning

    const valid: boolean = performValidation({
      loennsopplysning: newLoennsopplysning,
      loennsopplysninger: loennsopplysninger ?? [],
      namespace: namespace
    })
    if (valid) {
      let newLoennsopplysninger: Array<Loennsopplysning> | undefined = _.cloneDeep(loennsopplysninger)
      if (_.isNil(newLoennsopplysninger)) {
        newLoennsopplysninger = []
      }
      newLoennsopplysninger = newLoennsopplysninger.concat(newLoennsopplysning)
      dispatch(updateReplySed(target, newLoennsopplysninger))
      standardLogger('svarsed.editor.loennsopplysning.add')
      resetForm()
    }
  }

  const renderRow = (loennsopplysning: Loennsopplysning | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(loennsopplysning)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
    const _periode = index < 0 ? _newPeriode : loennsopplysning?.periode
    const visible = index >= 0 ? isVisible(index) : true

    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.3) + 's' }}
        >
          <PeriodeInput
            key={'' + _periode?.startdato + _periode?.sluttdato}
            namespace={namespace}
            error={{
              startdato: getErrorFor(index, 'periode-startdato'),
              sluttdato: getErrorFor(index, 'periode-sluttdato')
            }}
            setPeriode={(p: Periode, id: string) => setPeriode(p, id, index)}
            value={_periode}
            periodeType='simple'
          />
          <Column>
            <Column>
              <Select
                closeMenuOnSelect
                data-test-id={namespace + '-periodetype'}
                feil={validation[namespace + '-periodetype']?.feilmelding}
                highContrast={highContrast}
                id={namespace + '-periodetype'}
                key={namespace + '-periodetype-' + loennsopplysning?.periodetype}
                label={t('label:type-periode') + ' *'}
                menuPortalTarget={document.body}
                onChange={(e: any) => setPeriodeType(e.value, index)}
                options={periodeTypeOptions}
                placeholder={t('el:placeholder-select-default')}
                value={_.find(periodeTypeOptions, b => b.value === loennsopplysning?.periodetype)}
                defaultValue={_.find(periodeTypeOptions, b => b.value === loennsopplysning?.periodetype)}
              />
            </Column>
          </Column>
          <Column>
            {index >= 0 && (
              <div className='nolabel'>
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={() => toggleVisibility(index)}
                >
                  <FlexCenterDiv>
                    <Chevron type={visible ? 'opp' : 'ned'} />
                    <HorizontalSeparatorDiv size='0.35' />
                    {visible ? t('label:show-less') : t('label:show-more')}
                  </FlexCenterDiv>

                </HighContrastFlatknapp>
              </div>
            )}
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        {visible
          ? (
            <>
              <AlignStartRow
                className={classNames('slideInFromLeft')}
                style={{ animationDelay: index < 0 ? '0s' : (index * 0.3) + 's' }}
              >
                <Column>
                  <Inntekter
                    key={JSON.stringify(index < 0 ? _newInntekter : loennsopplysning?.inntekter ?? [])}
                    highContrast={highContrast}
                    inntekter={index < 0 ? _newInntekter : loennsopplysning?.inntekter ?? []}
                    onInntekterChanged={(inntekter: Array<Inntekt>) => setInntekter(inntekter, index)}
                    parentNamespace={namespace + '-inntekter'}
                    validation={validation}
                  />
                </Column>
              </AlignStartRow>
              <VerticalSeparatorDiv size='0.5' />
              <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
                <Column>
                  <Input
                    feil={getErrorFor(index, 'arbeidsdager')}
                    namespace={namespace}
                    id='arbeidsdager'
                    key={'arbeidsdager' + (index < 0 ? _newArbeidsdager : loennsopplysning?.arbeidsdager ?? '')}
                    label={t('label:arbeidsdager')}
                    onChanged={(arbeidsdager: string) => setArbeidsDager(arbeidsdager, index)}
                    value={index < 0 ? _newArbeidsdager : loennsopplysning?.arbeidsdager ?? ''}
                  />
                </Column>
                <Column>
                  <Input
                    feil={getErrorFor(index, 'arbeidstimer')}
                    namespace={namespace}
                    id='arbeidstimer'
                    key={'arbeidstimer' + (index < 0 ? _newArbeidstimer : loennsopplysning?.arbeidstimer ?? '')}
                    label={t('label:arbeidstimer')}
                    onChanged={(arbeidstimer: string) => setArbeidsTimer(arbeidstimer, index)}
                    value={index < 0 ? _newArbeidstimer : loennsopplysning?.arbeidstimer ?? ''}
                  />
                </Column>
                <Column flex='1.3'>
                  <AddRemovePanel
                    candidateForDeletion={candidateForDeletion}
                    existingItem={(index >= 0)}
                    marginTop
                    onBeginRemove={() => addToDeletion(loennsopplysning)}
                    onConfirmRemove={() => onRemove(index)}
                    onCancelRemove={() => removeFromDeletion(loennsopplysning)}
                    onAddNew={onAdd}
                    onCancelNew={onCancel}
                  />
                </Column>
              </AlignStartRow>
            </>
            )
          : <div />}
        <VerticalSeparatorDiv size={index < 0 ? '0.5' : '3'} />
      </RepeatableRow>
    )
  }

  const onInntektSearch = (fnr: string, fom: string, tom: string, inntektsliste: string) => {
    dispatch(fetchInntekt(fnr, fom, tom, inntektsliste))
  }

  const fnr = getFnr(replySed, personID)

  return (
    <PaddedDiv>
      <Undertittel>
        {t('label:inntekt')}
      </Undertittel>
      <VerticalSeparatorDiv size='2' />
      {_.isEmpty(loennsopplysninger)
        ? (
          <Normaltekst>
            {t('message:warning-no-inntekt')}
          </Normaltekst>
          )
        : loennsopplysninger?.map(renderRow)}
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
                {t('el:button-add-new-xs', { x: t('label:loennsopplysninger').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <Undertittel>
            {t('label:inntekt-fra-komponent')}
          </Undertittel>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <InntektSearch
        fnr={fnr!}
        highContrast={highContrast}
        onInntektSearch={onInntektSearch}
        gettingInntekter={gettingInntekter}
      />
      <VerticalSeparatorDiv size='2' />
      {gettingInntekter && <WaitingPanel />}
      {inntekter && (
        <InntektFC inntekter={inntekter} />
      )}

    </PaddedDiv>
  )
}

export default InntektForm
