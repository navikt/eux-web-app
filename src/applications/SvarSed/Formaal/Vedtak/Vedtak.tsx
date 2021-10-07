import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { FormålManagerFormProps, FormålManagerFormSelector } from 'applications/SvarSed/Formaal/FormålManager'
import {
  validateVedtakVedtaksperiode,
  ValidationVedtakPeriodeProps,
  ValidationVedtakVedtaksperiodeProps
} from 'applications/SvarSed/Formaal/Vedtak/validation'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import DateInput from 'components/Forms/DateInput'
import Select from 'components/Forms/Select'
import TextArea from 'components/Forms/TextArea'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { HorizontalLineSeparator, RepeatableRow, TextAreaDiv } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { F002Sed, JaNei, Periode, Vedtak, VedtakBarn, VedtakPeriode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import { Checkbox, FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Ingress, Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column,
  HighContrastFlatknapp,
  HighContrastRadioPanelGroup,
  HorizontalSeparatorDiv,
  PaddedDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Option } from 'declarations/app.d'
import { getIdx } from 'utils/namespace'
import { validateVedtakPeriode } from './validation'

export interface MotregningSelector extends FormålManagerFormSelector {
  highContrast: boolean
}

const mapState = (state: State): MotregningSelector => ({
  highContrast: state.ui.highContrast,
  replySed: state.svarpased.replySed,
  validation: state.validation.status,
  viewValidation: state.validation.view
})

const VedtakFC: React.FC<FormålManagerFormProps> = ({
  parentNamespace
}: FormålManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    highContrast,
    replySed,
    validation
  }: any = useSelector<State, MotregningSelector>(mapState)
  const dispatch = useDispatch()
  const target = 'vedtak'
  const vedtak: Vedtak | undefined = (replySed as F002Sed).vedtak
  const namespace = `${parentNamespace}-vedtak`

  const [_newPeriode, _setNewPeriode] = useState<Periode>({ startdato: '', sluttdato: '' })
  const [_newVedtaksperioder, _setNewVedtaksperioder] = useState<Periode>({ startdato: '', sluttdato: '' })
  const [_newVedtaksperioderVedtak, _setNewVedtaksperioderVedtak] = useState<string>('')
  const [_newVedtaksperioderSkalYtelseUtbetales, _setNewVedtaksperioderSkalYtelseUtbetales] = useState<JaNei | undefined>(undefined)

  const [perioderAddToDeletion, perioderRemoveFromDeletion, perioderIsInDeletion] = useAddRemove<Periode>((p: Periode): string => p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType))
  const [vedtaksperioder1AddToDeletion, vedtaksperioder1RemoveFromDeletion, vedtaksperioder1IsInDeletion] = useAddRemove<VedtakPeriode>((p: VedtakPeriode): string => '1_58_' + p.periode.startdato)
  const [vedtaksperioder2AddToDeletion, vedtaksperioder2RemoveFromDeletion, vedtaksperioder2IsInDeletion] = useAddRemove<VedtakPeriode>((p: VedtakPeriode): string => '2_58_' + p.periode.startdato)
  const [vedtaksperioder3AddToDeletion, vedtaksperioder3RemoveFromDeletion, vedtaksperioder3IsInDeletion] = useAddRemove<VedtakPeriode>((p: VedtakPeriode): string => '1_68_' + p.periode.startdato)
  const [vedtaksperioder4AddToDeletion, vedtaksperioder4RemoveFromDeletion, vedtaksperioder4IsInDeletion] = useAddRemove<VedtakPeriode>((p: VedtakPeriode): string => '1_68_' + p.periode.startdato)

  const deletionHash: any = {
    primaerkompetanseArt58: { addto: vedtaksperioder1AddToDeletion, removefrom: vedtaksperioder1RemoveFromDeletion, isin: vedtaksperioder1IsInDeletion },
    sekundaerkompetanseArt58: { addto: vedtaksperioder2AddToDeletion, removefrom: vedtaksperioder2RemoveFromDeletion, isin: vedtaksperioder2IsInDeletion },
    primaerkompetanseArt68: { addto: vedtaksperioder3AddToDeletion, removefrom: vedtaksperioder3RemoveFromDeletion, isin: vedtaksperioder3IsInDeletion },
    sekundaerkompetanseArt68: { addto: vedtaksperioder4AddToDeletion, removefrom: vedtaksperioder4RemoveFromDeletion, isin: vedtaksperioder4IsInDeletion }
  }

  const [_seeNewPerioderForm, _setSeeNewPerioderForm] = useState<boolean>(false)
  const [_seeNewVedtaksperioderForm, _setSeeNewVedtaksperioderForm] = useState<boolean>(false)

  const [_perioderValidation, _perioderResetValidation, perioderPerformValidation] = useValidation<ValidationVedtakPeriodeProps>({}, validateVedtakPeriode)
  const [_vedtaksperioderValidation, _vedtaksperioderResetValidation, vedtaksperioderPerformValidation, _setVedtaksperioderValidation] = useValidation<ValidationVedtakVedtaksperiodeProps>({}, validateVedtakVedtaksperiode)

  const vedtakTypeOptions: Options = [
    { label: t('el:option-vedtaktype-primaerkompetanseArt58'), value: 'primaerkompetanseArt58' },
    { label: t('el:option-vedtaktype-sekundaerkompetanseArt58'), value: 'sekundaerkompetanseArt58' },
    { label: t('el:option-vedtaktype-primaerkompetanseArt68'), value: 'primaerkompetanseArt68' },
    { label: t('el:option-vedtaktype-sekundaerkompetanseArt68'), value: 'sekundaerkompetanseArt68' }
  ]

  const setGjelderAlleBarn = (newGjelderAlleBarn: JaNei) => {
    dispatch(updateReplySed(`${target}.gjelderAlleBarn`, newGjelderAlleBarn.trim()))
    if (validation[namespace + '-gjelderAlleBarn']) {
      dispatch(resetValidation(namespace + '-gjelderAlleBarn'))
    }
  }

  const onChangedBarnaCheckbox = (vedtakBarn: VedtakBarn, checked: boolean) => {
    let newBarnVedtaketOmfatter: Array<VedtakBarn> | undefined = _.cloneDeep(vedtak?.barnVedtaketOmfatter)
    if (_.isNil(newBarnVedtaketOmfatter)) {
      newBarnVedtaketOmfatter = []
    }
    if (checked) {
      newBarnVedtaketOmfatter.push(vedtakBarn)
      newBarnVedtaketOmfatter = newBarnVedtaketOmfatter.sort((a: VedtakBarn, b: VedtakBarn) =>
        moment(a.foedselsdato).isSameOrBefore(moment(b.foedselsdato)) ? -1 : 1
      )
    } else {
      newBarnVedtaketOmfatter = _.filter(newBarnVedtaketOmfatter, vb =>
        `${vb.fornavn}-${vb.etternavn}-${vb.foedselsdato}` !== `${vedtakBarn.fornavn}-${vedtakBarn.etternavn}-${vedtakBarn.foedselsdato}`
      )
    }
    dispatch(updateReplySed(`${target}.barnVedtaketOmfatter`, newBarnVedtaketOmfatter))
    if (validation[namespace + '-newBarnVedtaketOmfatter']) {
      dispatch(resetValidation(namespace + '-newBarnVedtaketOmfatter'))
    }
  }

  const setPeriode = (p: Periode, index: number) => {
    if (index < 0) {
      _setNewPeriode(p)
      _perioderResetValidation(namespace + '-perioder-startdato')
      _perioderResetValidation(namespace + '-perioder-sluttdato')
    } else {
      dispatch(updateReplySed(`${target}.vedtaksperioder[${index}]`, p))
      if (validation[namespace + '-perioder' + getIdx(index) + '-startdato']) {
        dispatch(resetValidation(namespace + '-perioder' + getIdx(index) + '-startdato'))
      }
      if (validation[namespace + '-perioder' + getIdx(index) + '-sluttdato']) {
        dispatch(resetValidation(namespace + '-perioder' + getIdx(index) + '-sluttdato'))
      }
    }
  }

  const setVedtakstype = (newType: string) => {
    dispatch(updateReplySed(`${target}.vedtakstype`, newType.trim()))
    if (validation[namespace + '-vedtakstype']) {
      dispatch(resetValidation(namespace + '-vedtakstype'))
    }
  }

  const setVedtaksdato = (newDato: string) => {
    dispatch(updateReplySed(`${target}.vedtaksdato`, newDato.trim()))
    if (validation[namespace + '-vedtaksdato']) {
      dispatch(resetValidation(namespace + '-vedtaksdato'))
    }
  }

  const setBegrunnelse = (newBegrunnelse: string) => {
    dispatch(updateReplySed(`${target}.begrunnelse`, newBegrunnelse.trim()))
    if (validation[namespace + '-begrunnelse']) {
      dispatch(resetValidation(namespace + '-begrunnelse'))
    }
  }

  const setYtterligeInfo = (newInfo: string) => {
    dispatch(updateReplySed(`${target}.ytterligereInfo`, newInfo.trim()))
    if (validation[namespace + '-ytterligereInfo']) {
      dispatch(resetValidation(namespace + '-ytterligereInfo'))
    }
  }

  const setVedtaksperioder = (newPeriode: Periode, index: number, vedtaktype: string) => {
    if (index < 0) {
      _setNewVedtaksperioder(newPeriode)
      _vedtaksperioderResetValidation(namespace + '-vedtaksperioder-periode-startdato')
      _vedtaksperioderResetValidation(namespace + '-vedtaksperioder-periode-sluttdato')
    } else {
      dispatch(updateReplySed(`${target}.${vedtaktype}[${index}].periode`, newPeriode))
      if (validation[namespace + '-vedtaksperioder-' + vedtaktype + getIdx(index) + '-periode-startdato']) {
        dispatch(resetValidation(namespace + '-vedtaksperioder-' + vedtaktype + getIdx(index) + '-periode-startdato'))
      }
      if (validation[namespace + '-vedtaksperioder-' + vedtaktype + getIdx(index) + '-periode-sluttdato']) {
        dispatch(resetValidation(namespace + '-vedtaksperioder-' + vedtaktype + getIdx(index) + '-periode-sluttdato'))
      }
    }
  }

  const setVedtaksperioderSkalYtelseUtbetales = (newSkalYtelseUtbetales: JaNei, index: number, vedtaktype: string) => {
    if (index < 0) {
      _setNewVedtaksperioderSkalYtelseUtbetales(newSkalYtelseUtbetales)
      _vedtaksperioderResetValidation(namespace + '-vedtaksperioder-skalYtelseUtbetales')
    } else {
      dispatch(updateReplySed(`${target}.${vedtaktype}[${index}].skalYtelseUtbetales`, newSkalYtelseUtbetales))
      if (validation[namespace + '-vedtaksperioder-' + vedtaktype + getIdx(index) + '-skalYtelseUtbetales']) {
        dispatch(resetValidation(namespace + '-vedtaksperioder-' + vedtaktype + getIdx(index) + '-skalYtelseUtbetales'))
      }
    }
  }

  const setVedtaksperioderVedtak = (newVedtak: string, index: number) => {
    if (index < 0) {
      _setNewVedtaksperioderVedtak(newVedtak.trim())
      _vedtaksperioderResetValidation(namespace + '-vedtaksperioder-vedtak')
    }
    // too much hassle to move around with new vedtaktype.
  }

  const perioderResetForm = () => {
    _setNewPeriode({ startdato: '', sluttdato: '' })
    _perioderResetValidation()
  }

  const vedtaksperioderResetForm = () => {
    _setNewVedtaksperioder({ startdato: '', sluttdato: '' })
    _setNewVedtaksperioderVedtak('')
    _setNewVedtaksperioderSkalYtelseUtbetales(undefined)
    _vedtaksperioderResetValidation()
  }

  const onPeriodeCancel = () => {
    _setSeeNewPerioderForm(false)
    perioderResetForm()
  }

  const onVedtaksperiodeCancel = () => {
    _setSeeNewVedtaksperioderForm(false)
    vedtaksperioderResetForm()
  }

  const onPeriodeRemove = (index: number) => {
    const newPerioder = _.cloneDeep(vedtak?.vedtaksperioder) as Array<Periode>
    const deletedPerioder: Array<Periode> = newPerioder.splice(index, 1)
    if (deletedPerioder && deletedPerioder.length > 0) {
      perioderRemoveFromDeletion(deletedPerioder[0])
    }
    dispatch(updateReplySed(`${target}.vedtaksperioder`, newPerioder))
    standardLogger('svarsed.editor.periode.remove', { type: 'vedtaksperioder' })
  }

  const onVedtaksperioderRemove = (index: number, vedtaktype: string) => {
    const newPerioder = _.get(vedtak, vedtaktype) as Array<VedtakPeriode>
    const deletedPerioder: Array<VedtakPeriode> = newPerioder.splice(index, 1)
    if (deletedPerioder && deletedPerioder.length > 0) {
      // @ts-ignore
      deletionHash[vedtaktype].removefrom(deletedPerioder[0])
    }
    dispatch(updateReplySed(`${target}.${vedtaktype}`, newPerioder))
    standardLogger('svarsed.editor.periode.remove', { type: vedtaktype })
  }

  const onPeriodeAdd = () => {
    const valid = perioderPerformValidation({
      periode: _newPeriode,
      perioder: vedtak?.vedtaksperioder ?? [],
      namespace
    })

    if (valid) {
      let newPerioder: Array<Periode> = _.cloneDeep(vedtak?.vedtaksperioder) as Array<Periode>
      if (!newPerioder) {
        newPerioder = []
      }
      newPerioder = newPerioder.concat(_newPeriode)
      dispatch(updateReplySed(`${target}.vedtaksperioder`, newPerioder))
      standardLogger('svarsed.editor.periode.add', { type: 'vedtaksperioder' })
      perioderResetForm()
    }
  }

  const onVedtaksperiodeAdd = () => {
    const newVedtaksperiode: VedtakPeriode = {
      periode: _newVedtaksperioder,
      skalYtelseUtbetales: _newVedtaksperioderSkalYtelseUtbetales?.trim() as JaNei ?? ''
    }

    if (_.isEmpty(_newVedtaksperioderVedtak)) {
      const newValidation: Validation = {}
      newValidation[namespace + '-vedtaksperioder-vedtak'] = {
        feilmelding: t('message:validation-noVedtakTypeTilPerson', { person: t('label:vedtak') }),
        skjemaelementId: namespace + '-vedtaksperioder-vedtak'
      } as FeiloppsummeringFeil
      _setVedtaksperioderValidation(newValidation)
      return false
    }

    const valid: boolean = vedtaksperioderPerformValidation({
      vedtaksperiode: newVedtaksperiode,
      vedtaksperioder: _.get(vedtak, _newVedtaksperioderVedtak) ?? [],
      vedtaktype: _newVedtaksperioderVedtak,
      namespace
    })

    if (valid) {
      let newVedtaksperioder: Array<VedtakPeriode> = _.get(vedtak, _newVedtaksperioderVedtak) as Array<VedtakPeriode>
      if (!newVedtaksperioder) {
        newVedtaksperioder = []
      }
      newVedtaksperioder = newVedtaksperioder.concat(newVedtaksperiode)
      dispatch(updateReplySed(`${target}.${_newVedtaksperioderVedtak}`, newVedtaksperioder))
      standardLogger('svarsed.editor.periode.add', { type: _newVedtaksperioderVedtak })
      vedtaksperioderResetForm()
    }
  }

  const renderPeriode = (periode: Periode | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : perioderIsInDeletion(periode)
    const idx = (index >= 0 ? '[' + index + ']' : '')
    const getErrorFor = (index: number, el: string): string | undefined => {
      return index < 0
        ? _perioderValidation[namespace + '-perioder' + idx + '-' + el]?.feilmelding
        : validation[namespace + '-vedtaksperioder' + idx + '-' + el]?.feilmelding
    }
    const _periode = index < 0 ? _newPeriode : periode

    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow className={classNames('slideInFromLeft')}>
          <PeriodeInput
            key={'' + _periode?.startdato + _periode?.sluttdato}
            namespace={namespace + '-perioder' + getIdx(index)}
            error={{
              startdato: getErrorFor(index, 'startdato'),
              sluttdato: getErrorFor(index, 'sluttdato')
            }}
            setPeriode={(p: Periode) => setPeriode(p, index)}
            value={_periode}
          />
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => perioderAddToDeletion(periode)}
              onConfirmRemove={() => onPeriodeRemove(index)}
              onCancelRemove={() => perioderRemoveFromDeletion(periode)}
              onAddNew={onPeriodeAdd}
              onCancelNew={onPeriodeCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  const renderVedtakPeriode = (vedtaksperiode: VedtakPeriode | null, index: number, vedtaktype: string) => {
    // @ts-ignore
    const candidateForDeletion = index < 0 ? false : deletionHash[vedtaktype].isin(vedtaksperiode)
    const idx = (index >= 0 ? '-' + vedtaktype + '[' + index + ']' : '')
    const getErrorFor = (index: number, el: string): string | undefined => {
      return index < 0
        ? _vedtaksperioderValidation[namespace + '-vedtaksperioder' + idx + '-' + el]?.feilmelding
        : validation[namespace + '-vedtaksperioder' + idx + '-' + el]?.feilmelding
    }
    const periode: Periode | undefined = index < 0 ? _newVedtaksperioder : vedtaksperiode?.periode
    // @ts-ignore
    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow className={classNames('slideInFromLeft')}>
          <PeriodeInput
            key={'' + periode?.startdato + '-' + periode?.sluttdato}
            namespace={namespace + '-vedtaksperioder' + getIdx(index) + '-periode'}
            error={{
              startdato: getErrorFor(index, 'periode-startdato'),
              sluttdato: getErrorFor(index, 'periode-sluttdato')
            }}
            setPeriode={(p: Periode) => setVedtaksperioder(p, index, vedtaktype)}
            value={periode}
          />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        {index < 0 && (
          <>
            <AlignStartRow>
              <Column>
                <Select
                  closeMenuOnSelect
                  key={namespace + '-vedtaksperioder-vedtak-' + _newVedtaksperioderVedtak}
                  data-test-id={namespace + '-vedtaksperioder-vedtak'}
                  feil={getErrorFor(index, 'vedtak')}
                  highContrast={highContrast}
                  id={namespace + '-vedtaksperioder-vedtak'}
                  label={t('label:vedtak-type')}
                  menuPortalTarget={document.body}
                  onChange={(o: Option) => setVedtaksperioderVedtak(o.value, index)}
                  options={vedtakTypeOptions}
                  placeholder={t('el:placeholder-select-default')}
                  defaultValue={_.find(vedtakTypeOptions, v => v.value === _newVedtaksperioderVedtak)}
                  value={_.find(vedtakTypeOptions, v => v.value === _newVedtaksperioderVedtak)}
                />
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv />
          </>
        )}
        <AlignStartRow>
          <Column>
            <HighContrastRadioPanelGroup
              checked={index < 0 ? _newVedtaksperioderSkalYtelseUtbetales : vedtaksperiode?.skalYtelseUtbetales}
              data-test-id={namespace + '-vedtaksperioder' + getIdx(index) + '-skalYtelseUtbetales'}
              data-no-border
              feil={getErrorFor(index, 'skalYtelseUtbetales')}
              id={namespace + '-vedtaksperioder' + getIdx(index) + '-skalYtelseUtbetales'}
              legend={t('label:skal-ytelse-utbetales') + ' *'}
              name={namespace + idx + '-borSammen'}
              radios={[
                { label: t('label:ja'), value: 'ja' },
                { label: t('label:nei'), value: 'nei' }
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVedtaksperioderSkalYtelseUtbetales(e.target.value as JaNei, index, vedtaktype)}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => deletionHash[vedtaktype].addto(vedtaksperiode)}
              onConfirmRemove={() => onVedtaksperioderRemove(index, vedtaktype)}
              onCancelRemove={() => deletionHash[vedtaktype].removefrom(vedtaksperiode)}
              onAddNew={onVedtaksperiodeAdd}
              onCancelNew={onVedtaksperiodeCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <PaddedDiv>
      <Undertittel>
        {t('label:vedtak')}
      </Undertittel>
      <VerticalSeparatorDiv size='2' />
      <Row>
        <Column flex='2'>
          <HighContrastRadioPanelGroup
            checked={vedtak?.gjelderAlleBarn}
            data-no-border
            data-test-id={namespace + '-gjelderAlleBarn'}
            feil={validation[namespace + '-gjelderAlleBarn']?.feilmelding}
            id={namespace + '-gjelderAlleBarn'}
            legend={t('label:vedtak-angående-alle-barn') + ' *'}
            name={namespace + '-gjelderAlleBarn'}
            radios={[
              { label: t('label:ja'), value: 'ja' },
              { label: t('label:nei'), value: 'nei' }
            ]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGjelderAlleBarn(e.target.value as JaNei)}
          />
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv />
      {vedtak?.gjelderAlleBarn === 'nei' && (
        <div className={classNames('slideInFromLeft')}>
          <div dangerouslySetInnerHTML={{ __html: t('label:avhuk-de-barn-vedtaket') + ':' }} />
          <VerticalSeparatorDiv />
          {(replySed as F002Sed)?.barn?.map((b, index) => {
            const vedtakBarn: VedtakBarn = {
              fornavn: b.personInfo.fornavn,
              etternavn: b.personInfo.etternavn,
              foedselsdato: b.personInfo.foedselsdato
            }

            const checked: boolean = _.find(vedtak?.barnVedtaketOmfatter, vb =>
              `${vb.fornavn}-${vb.etternavn}-${vb.foedselsdato}` === `${vedtakBarn.fornavn}-${vedtakBarn.etternavn}-${vedtakBarn.foedselsdato}`
            ) !== undefined
            return (
              <div
                key={`${vedtakBarn.fornavn}-${vedtakBarn.etternavn}-${vedtakBarn.foedselsdato}`}
                className={classNames('slideInFromLeft')}
                style={{ animationDelay: (index * 0.1) + 's' }}
              >
                <Checkbox
                  checked={checked}
                  label={vedtakBarn.fornavn + ' ' + vedtakBarn.etternavn + ' (' + vedtakBarn.foedselsdato + ')'}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangedBarnaCheckbox(vedtakBarn, e.target.checked)}
                />
                <VerticalSeparatorDiv size='0.5' />
              </div>
            )
          })}
        </div>
      )}
      <VerticalSeparatorDiv size='2' />
      <Undertittel>
        {t('label:periode')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {_.isEmpty(vedtak?.vedtaksperioder)
        ? (
          <Normaltekst>
            {t('message:warning-no-periods')}
          </Normaltekst>
          )
        : vedtak?.vedtaksperioder?.map(renderPeriode)}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewPerioderForm
        ? renderPeriode(null, -1)
        : (
          <Row className='slideInFromLeft'>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => _setSeeNewPerioderForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
      <VerticalSeparatorDiv />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: '0.1s' }}
      >
        <Column flex='2'>
          <Select
            data-test-id={namespace + '-vedtakstype'}
            feil={validation[namespace + '-vedtakstype']?.feilmelding}
            highContrast={highContrast}
            key={namespace + '-vedtakstype-' + vedtak?.vedtakstype}
            id={namespace + '-vedtakstype'}
            label={t('label:vedtak-type') + ' *'}
            menuPortalTarget={document.body}
            onChange={(e: Option) => setVedtakstype(e.value)}
            options={vedtakTypeOptions}
            placeholder={t('el:placeholder-select-default')}
            defaultValue={_.find(vedtakTypeOptions, v => v.value === vedtak?.vedtakstype)}
            value={_.find(vedtakTypeOptions, v => v.value === vedtak?.vedtakstype)}
          />
        </Column>
        <Column>
          <DateInput
            feil={validation[namespace + '-vedtaksdato']?.feilmelding}
            namespace={namespace}
            id='vedtaksdato'
            key={namespace + '-vedtaksdato-' + vedtak?.vedtaksdato}
            label={t('label:vedtaksdato') + ' *'}
            onChanged={setVedtaksdato}
            required
            value={vedtak?.vedtaksdato}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: '0.15s' }}
      >
        <Column flex='2'>
          <TextAreaDiv>
            <TextArea
              feil={validation[namespace + '-begrunnelse']?.feilmelding}
              namespace={namespace}
              id='grunnen'
              label={t('label:begrunnelse')}
              onChanged={setBegrunnelse}
              value={vedtak?.begrunnelse}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: '0.2s' }}
      >
        <Column flex='2'>
          <TextAreaDiv>
            <TextArea
              feil={validation[namespace + '-ytterligereInfo']?.feilmelding}
              namespace={namespace}
              id='ytterligereInfo'
              label={t('label:ytterligere-informasjon-til-sed')}
              onChanged={setYtterligeInfo}
              value={vedtak?.ytterligereInfo}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      <Undertittel>
        {t('label:perioder')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {(_.isEmpty(vedtak?.primaerkompetanseArt58) && _.isEmpty(vedtak?.sekundaerkompetanseArt58) &&
      _.isEmpty(vedtak?.primaerkompetanseArt68) && _.isEmpty(vedtak?.sekundaerkompetanseArt68)) && (
        <Normaltekst>
          {t('message:warning-no-periods')}
        </Normaltekst>
      )}
      {['primaerkompetanseArt58', 'sekundaerkompetanseArt58', 'primaerkompetanseArt68', 'sekundaerkompetanseArt68'].map(vedtaktype => {
        const perioder: Array<VedtakPeriode> | undefined | null = _.get(vedtak, vedtaktype)
        if (!_.isEmpty(perioder)) {
          return (
            <>
              <Ingress>
                {t('el:option-vedtaktype-' + vedtaktype)}
              </Ingress>
              <VerticalSeparatorDiv />
              {perioder!.map((vp, i) => renderVedtakPeriode(vp, i, vedtaktype))}
              <VerticalSeparatorDiv size='2' />
            </>
          )
        } else {
          return null
        }
      })}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewVedtaksperioderForm
        ? renderVedtakPeriode(null, -1, '')
        : (
          <Row className='slideInFromLeft'>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => _setSeeNewVedtaksperioderForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
    </PaddedDiv>
  )
}

export default VedtakFC
