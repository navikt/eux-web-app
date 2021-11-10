import { updateReplySed } from 'actions/svarsed'
import { resetValidation } from 'actions/validation'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { standardLogger } from 'metrics/loggers'
import { validateUtbetaling, ValidationUtbetalingProps } from './validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import DateInput from 'components/Forms/DateInput'
import Input from 'components/Forms/Input'
import TextArea from 'components/Forms/TextArea'
import { HorizontalLineSeparator, RepeatableRow, TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { SisteAnsettelsesForhold, Utbetaling } from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import CountryData, { Currency } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column, HighContrastFlatknapp,
  HighContrastRadioPanelGroup, HorizontalSeparatorDiv,
  PaddedDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getIdx } from 'utils/namespace'
import { Add } from '@navikt/ds-icons'

interface SisteAnsettelsesForholdSelector extends PersonManagerFormSelector {
  highContrast: boolean
}

const mapState = (state: State): SisteAnsettelsesForholdSelector => ({
  highContrast: state.ui.highContrast,
  replySed: state.svarsed.replySed,
  validation: state.validation.status
})

const SisteAnsettelsesForholdFC: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    highContrast,
    replySed,
    validation
  } = useSelector<State, SisteAnsettelsesForholdSelector>(mapState)
  const dispatch = useDispatch()
  const target = 'sisteAnsettelsesForhold'
  const sisteAnsettelsesForhold: SisteAnsettelsesForhold = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-sisteansettelsesforhold`

  const [_newUtbetalingType, _setNewUtbetalingType] = useState<string | undefined>(undefined)
  const [_newLoennTilDato, _setNewLoennTilDato] = useState<string | undefined>(undefined)
  const [_newFeriedagerTilGode, _setNewFeriedagerTilGode] = useState<string | undefined>(undefined)
  const [_newValuta, _setNewValuta] = useState<string | undefined>(undefined)
  const [_newBeloep, _setNewBeloep] = useState<string | undefined>(undefined)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Utbetaling>((a: Utbetaling): string => a.utbetalingType + '-' + a.loennTilDato)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationUtbetalingProps>({}, validateUtbetaling)

  const _currencyData = CountryData.getCurrencyInstance('nb')

  const setBeløp = (newBeløp: string, index: number) => {
    if (index < 0) {
      _setNewBeloep(newBeløp.trim())
      _resetValidation(namespace + '-beloep')
      if (_.isNil(_newValuta)) {
        setValuta({ value: 'NOK' } as Currency, index)
      }
    } else {
      dispatch(updateReplySed(`${target}.utbetalinger[${index}].beloep`, newBeløp.trim()))
      if (validation[namespace + getIdx(index) + '-beloep']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-beloep'))
      }

      if (_.isNil(sisteAnsettelsesForhold.utbetalinger[index]?.valuta)) {
        setValuta({ value: 'NOK' } as Currency, index)
      }
    }
  }

  const setValuta = (newValuta: Currency, index: number) => {
    if (index < 0) {
      _setNewValuta(newValuta.value)
      _resetValidation(namespace + '-valuta')
    } else {
      dispatch(updateReplySed(`${target}.utbetalinger[${index}].valuta`, newValuta?.value))
      if (validation[namespace + getIdx(index) + '-valuta']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-valuta'))
      }
    }
  }

  const setLoennTilDato = (newLoennTilDato: string, index: number) => {
    if (index < 0) {
      _setNewLoennTilDato(newLoennTilDato.trim())
      _resetValidation(namespace + '-loennTilDato')
    } else {
      dispatch(updateReplySed(`${target}.utbetalinger[${index}].loennTilDato`, newLoennTilDato.trim()))
      if (validation[namespace + getIdx(index) + '-loennTilDato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-loennTilDato'))
      }
    }
  }

  const setUtbetalingType = (newUtbetalingType: string, index: number) => {
    if (index < 0) {
      _setNewUtbetalingType(newUtbetalingType.trim())
      if (newUtbetalingType !== 'inntekter_for_periode_etter_avslutning_av_arbeidsforhold_eller_opphør_i_selvstendig_næringsvirksomhet') {
        _setNewLoennTilDato('')
      }
      if (newUtbetalingType !== 'vederlag_for_ferie_som_ikke_er_tatt_ut_årlig_ferie') {
        _setNewFeriedagerTilGode('')
      }
      _resetValidation(namespace + '-utbetalingType')
    } else {
      const newUtbetaling = _.get(sisteAnsettelsesForhold, `utbetalinger[${index}]`)
      newUtbetaling.utbetalingType = newUtbetalingType
      if (newUtbetalingType !== 'inntekter_for_periode_etter_avslutning_av_arbeidsforhold_eller_opphør_i_selvstendig_næringsvirksomhet') {
        delete newUtbetaling.loennTilDato
      }
      if (newUtbetalingType !== 'vederlag_for_ferie_som_ikke_er_tatt_ut_årlig_ferie') {
        delete newUtbetaling.feriedagerTilGode
      }
      dispatch(updateReplySed(`${target}.utbetalinger[${index}]`, newUtbetaling))
      if (validation[namespace + getIdx(index) + '-utbetalingType']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-utbetalingType'))
      }
    }
  }

  const setFeriedagerTilGode = (newFeriedagerTilGode: string, index: number) => {
    if (index < 0) {
      _setNewFeriedagerTilGode(newFeriedagerTilGode.trim())
      _resetValidation(namespace + '-feriedagerTilGode')
    } else {
      dispatch(updateReplySed(`${target}.utbetalinger[${index}].feriedagerTilGode`, newFeriedagerTilGode.trim()))
      if (validation[namespace + getIdx(index) + '-feriedagerTilGode']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-feriedagerTilGode'))
      }
    }
  }

  const setOpphoerRettighet = (opphoerRettighet: string) => {
    dispatch(updateReplySed(`${target}.opphoerRettighet`, opphoerRettighet.trim()))
    if (validation[namespace + '-opphoerRettighet']) {
      dispatch(resetValidation(namespace + '-opphoerRettighet'))
    }
  }

  const setOpphoerRettighetGrunn = (opphoerRettighetGrunn: string) => {
    dispatch(updateReplySed(`${target}.opphoerRettighetGrunn`, opphoerRettighetGrunn.trim()))
    if (validation[namespace + '-opphoerRettighetGrunn']) {
      dispatch(resetValidation(namespace + '-opphoerRettighetGrunn'))
    }
  }

  const setOpphoerYtelse = (opphoerYtelse: string) => {
    dispatch(updateReplySed(`${target}.opphoerYtelse`, opphoerYtelse.trim()))
    if (validation[namespace + '-opphoerYtelse']) {
      dispatch(resetValidation(namespace + '-opphoerYtelse'))
    }
  }

  const resetForm = () => {
    _setNewUtbetalingType('')
    _setNewLoennTilDato('')
    _setNewFeriedagerTilGode('')
    _setNewValuta('')
    _setNewBeloep('')
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (index: number) => {
    const newUtbetalinger: Array<Utbetaling> = _.cloneDeep(sisteAnsettelsesForhold?.utbetalinger)
    const deletedUtbetalinger: Array<Utbetaling> = newUtbetalinger.splice(index, 1)
    if (deletedUtbetalinger && deletedUtbetalinger.length > 0) {
      removeFromDeletion(deletedUtbetalinger[0])
    }
    dispatch(updateReplySed(`${target}.utbetalinger`, newUtbetalinger))
    standardLogger('svarsed.editor.utbetaling.remove')
  }

  const onAdd = () => {
    const newUtbetaling: Utbetaling = {
      utbetalingType: _newUtbetalingType as string,
      loennTilDato: _newLoennTilDato as string,
      feriedagerTilGode: _newFeriedagerTilGode as string,
      valuta: _newValuta as string,
      beloep: _newBeloep as string
    }

    const valid: boolean = performValidation({
      utbetaling: newUtbetaling,
      namespace: namespace
    })
    if (valid) {
      let newUtbetalinger: Array<Utbetaling> = _.cloneDeep(sisteAnsettelsesForhold?.utbetalinger)
      if (_.isNil(newUtbetalinger)) {
        newUtbetalinger = []
      }
      newUtbetalinger = newUtbetalinger.concat(newUtbetaling)
      dispatch(updateReplySed(`${target}.utbetalinger`, newUtbetalinger))
      standardLogger('svarsed.editor.utbetaling.add')
      resetForm()
    }
  }

  const renderRow = (utbetaling: Utbetaling | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(utbetaling)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.3) + 's' }}
        >
          <Column>
            <label className='skjemaelement__label'>
              {t('label:utbetaling-type')}
            </label>
            <HighContrastRadioPanelGroup
              checked={index < 0 ? _newUtbetalingType : utbetaling?.utbetalingType ?? ''}
              data-multiple-line
              data-no-border
              data-test-id={namespace + '-utbetalingType'}
              feil={getErrorFor(index, 'utbetalingType')}
              key={namespace + '-utbetalingType-' + (index < 0 ? _newUtbetalingType : utbetaling?.utbetalingType ?? '')}
              id={namespace + '-utbetalingType'}
              name={namespace + '-utbetalingType'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUtbetalingType(e.target.value, index)}
              radios={[
                {
                  label: t('el:option-typebeløp-1'),
                  value: 'inntekter_for_periode_etter_avslutning_av_arbeidsforhold_eller_opphør_i_selvstendig_næringsvirksomhet'
                },
                {
                  label: t('el:option-typebeløp-2'),
                  value: 'vederlag_for_ferie_som_ikke_er_tatt_ut_årlig_ferie'
                },
                {
                  label: t('el:option-typebeløp-3'),
                  value: 'annet_vederlag_eller_tilsvarende_utbetalinger'
                }
              ]}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <Undertittel>
          {t('label:utbetaling')}
        </Undertittel>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column>
            <Input
              type='number'
              feil={getErrorFor(index, 'beloep')}
              namespace={namespace}
              id='beloep'
              key={'beloep-' + (index < 0 ? _newBeloep : utbetaling?.beloep ?? '')}
              label={t('label:beløp') + ' *'}
              onChanged={(newBeløp: string) => setBeløp(newBeløp, index)}
              value={index < 0 ? _newBeloep : utbetaling?.beloep ?? ''}
            />
          </Column>
          <Column>
            <CountrySelect
              key={'valuta-' + _currencyData.findByValue(index < 0 ? _newValuta : utbetaling?.valuta)}
              closeMenuOnSelect
              ariaLabel={t('label:valuta')}
              data-test-id={namespace + '-valuta'}
              error={getErrorFor(index, 'valuta')}
              highContrast={highContrast}
              id={namespace + '-valuta'}
              label={t('label:valuta') + ' *'}
              locale='nb'
              menuPortalTarget={document.body}
              onOptionSelected={(c: Currency) => setValuta(c, index)}
              type='currency'
              values={_currencyData.findByValue(index < 0 ? _newValuta : utbetaling?.valuta)}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
          <Column>
            {(index < 0 ? _newUtbetalingType : utbetaling?.utbetalingType) === 'inntekter_for_periode_etter_avslutning_av_arbeidsforhold_eller_opphør_i_selvstendig_næringsvirksomhet' && (
              <DateInput
                feil={getErrorFor(index, 'loennTilDato')}
                namespace={namespace}
                key={utbetaling?.loennTilDato}
                id='loennTilDato'
                label={t('label:loenn-til-dato')}
                onChanged={(date: string) => setLoennTilDato(date, index)}
                value={utbetaling?.loennTilDato}
              />
            )}
            {(index < 0 ? _newUtbetalingType : utbetaling?.utbetalingType) === 'vederlag_for_ferie_som_ikke_er_tatt_ut_årlig_ferie' && (
              <Input
                type='number'
                feil={getErrorFor(index, 'feriedagerTilGode')}
                namespace={namespace}
                id='feriedagerTilGode'
                label={t('label:feriedager-til-gode') + ' *'}
                onChanged={(value) => setFeriedagerTilGode(value, index)}
                value={utbetaling?.feriedagerTilGode ?? ''}
              />
            )}
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(utbetaling)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(utbetaling)}
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
    <PaddedDiv>
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <Undertittel>
            {t('label:siste-ansettelsesforhold')}
          </Undertittel>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      {_.isEmpty(sisteAnsettelsesForhold?.utbetalinger)
        ? (
          <Normaltekst>
            {t('message:warning-no-utbetaling')}
          </Normaltekst>
          )
        : sisteAnsettelsesForhold?.utbetalinger?.map(renderRow)}
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
                {t('el:button-add-new-x', { x: t('label:utbetaling').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
      <VerticalSeparatorDiv size='2' />
      <Undertittel>
        {t('label:opphoer')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column>
          <TextAreaDiv>
            <TextArea
              feil={validation[namespace + '-opphoerRettighet']?.feilmelding}
              namespace={namespace}
              id='avkall'
              label={t('label:opphoer-rettighet')}
              onChanged={setOpphoerRettighet}
              value={sisteAnsettelsesForhold?.opphoerRettighet}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column>
          <TextAreaDiv>
            <TextArea
              feil={validation[namespace + '-opphoerRettighetGrunn']?.feilmelding}
              namespace={namespace}
              id='opphoerRettighetGrunn'
              label={t('label:opphoer-rettighet-grunn')}
              onChanged={setOpphoerRettighetGrunn}
              value={sisteAnsettelsesForhold?.opphoerRettighetGrunn}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column>
          <TextAreaDiv>
            <TextArea
              feil={validation[namespace + '-opphoerYtelse']?.feilmelding}
              namespace={namespace}
              id='opphoerYtelse'
              label={t('label:opphoer-ytelse')}
              onChanged={setOpphoerYtelse}
              value={sisteAnsettelsesForhold?.opphoerYtelse}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default SisteAnsettelsesForholdFC
