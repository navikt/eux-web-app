import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Heading, Label } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  FlexDiv,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PaddedHorizontallyDiv,
  RadioPanel,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import CountryData, { Currency } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import DateInput from 'components/Forms/DateInput'
import FormText from 'components/Forms/FormText'
import Input from 'components/Forms/Input'
import TextArea from 'components/Forms/TextArea'
import { HorizontalLineSeparator, RepeatableRow, SpacedHr, TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { SisteAnsettelseInfo, Utbetaling } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import {
  validateSisteAnsettelseInfo,
  ValidateSisteAnsettelseInfoProps,
  validateUtbetaling,
  ValidationUtbetalingProps
} from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const SisteAnsettelseInfoFC: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-sisteansettelseinfo`
  const _currencyData = CountryData.getCurrencyInstance('nb')
  const target = 'sisteAnsettelseInfo'
  const sisteAnsettelseInfo: SisteAnsettelseInfo | undefined = _.get(replySed, target)
  const getId = (u: Utbetaling | null | undefined) => u ? u.beloep + '-' + u.utbetalingType : 'new'

  const [_newUtbetaling, _setNewUtbetaling] = useState<Utbetaling | undefined>(undefined)
  const [_editUtbetaling, _setEditUtbetaling] = useState<Utbetaling | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationUtbetalingProps>(validateUtbetaling, namespace)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidateSisteAnsettelseInfoProps>(
      clonedValidation, namespace, validateSisteAnsettelseInfo, {
        sisteAnsettelseInfo,
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const setBeløp = (newBeløp: string, index: number) => {
    if (index < 0) {
      _setNewUtbetaling({
        ..._newUtbetaling,
        beloep: newBeløp.trim(),
        valuta: _.isNil(_newUtbetaling?.valuta) ? 'NOK' : _newUtbetaling?.valuta
      } as Utbetaling)
      _resetValidation([namespace + '-beloep', namespace + '-valuta'])
      return
    }
    _setEditUtbetaling({
      ..._editUtbetaling,
      beloep: newBeløp.trim(),
      valuta: _.isNil(_editUtbetaling?.valuta) ? 'NOK' : _editUtbetaling?.valuta
    } as Utbetaling)
    dispatch(resetValidation([namespace + getIdx(index) + '-beloep', namespace + getIdx(index) + '-valuta']))
  }

  const setValuta = (newValuta: Currency, index: number) => {
    if (index < 0) {
      _setNewUtbetaling({
        ..._newUtbetaling,
        valuta: newValuta.value
      } as Utbetaling)
      _resetValidation(namespace + '-valuta')
      return
    }
    _setEditUtbetaling({
      ..._editUtbetaling,
      valuta: newValuta.value
    } as Utbetaling)
    dispatch(resetValidation(namespace + getIdx(index) + '-valuta'))
  }

  const setLoennTilDato = (newLoennTilDato: string, index: number) => {
    if (index < 0) {
      _setNewUtbetaling({
        ..._newUtbetaling,
        loennTilDato: newLoennTilDato.trim()
      } as Utbetaling)
      _resetValidation(namespace + '-loennTilDato')
      return
    }
    _setEditUtbetaling({
      ..._editUtbetaling,
      loennTilDato: newLoennTilDato.trim()
    } as Utbetaling)
    dispatch(resetValidation(namespace + getIdx(index) + '-loennTilDato'))
  }

  const setFeriedagerTilGode = (newFeriedagerTilGode: string, index: number) => {
    if (index < 0) {
      _setNewUtbetaling({
        ..._newUtbetaling,
        feriedagerTilGode: newFeriedagerTilGode.trim()
      } as Utbetaling)
      _resetValidation(namespace + '-feriedagerTilGode')
      return
    }
    _setEditUtbetaling({
      ..._editUtbetaling,
      feriedagerTilGode: newFeriedagerTilGode.trim()
    } as Utbetaling)
    dispatch(resetValidation(namespace + getIdx(index) + '-feriedagerTilGode'))
  }

  const setUtbetalingType = (newUtbetalingType: string, index: number) => {
    if (index < 0) {
      const newUtbetaling: Utbetaling = {
        ..._newUtbetaling,
        utbetalingType: newUtbetalingType.trim()
      } as Utbetaling
      if (newUtbetalingType !== 'inntekter_for_periode_etter_avslutning_av_arbeidsforhold_eller_opphør_i_selvstendig_næringsvirksomhet') {
        delete newUtbetaling.loennTilDato
      }
      if (newUtbetalingType !== 'vederlag_for_ferie_som_ikke_er_tatt_ut_årlig_ferie') {
        delete newUtbetaling.feriedagerTilGode
      }
      _setNewUtbetaling(newUtbetaling)
      _resetValidation(namespace + '-utbetalingType')
      return
    }

    const editUtbetaling: Utbetaling = {
      ..._editUtbetaling,
      utbetalingType: newUtbetalingType.trim()
    } as Utbetaling
    if (newUtbetalingType !== 'inntekter_for_periode_etter_avslutning_av_arbeidsforhold_eller_opphør_i_selvstendig_næringsvirksomhet') {
      delete editUtbetaling.loennTilDato
    }
    if (newUtbetalingType !== 'vederlag_for_ferie_som_ikke_er_tatt_ut_årlig_ferie') {
      delete editUtbetaling.feriedagerTilGode
    }
    _setEditUtbetaling(editUtbetaling)
    dispatch(resetValidation(namespace + getIdx(index) + '-utbetalingType'))
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

  const onCloseEdit = (namespace: string) => {
    _setEditUtbetaling(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewUtbetaling(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (u: Utbetaling, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditUtbetaling(u)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationUtbetalingProps>(
      clonedValidation, namespace, validateUtbetaling, {
        utbetaling: _editUtbetaling,
        index: _editIndex,
        personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${target}.utbetalinger[${_editIndex}]`, _editUtbetaling))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removed: Utbetaling) => {
    const newUtbetalinger: Array<Utbetaling> = _.reject(sisteAnsettelseInfo?.utbetalinger,
      (u: Utbetaling) => _.isEqual(removed, u))
    dispatch(updateReplySed(`${target}.utbetalinger`, newUtbetalinger))
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      utbetaling: _newUtbetaling,
      personName
    })
    if (!!_newUtbetaling && valid) {
      let newUtbetalinger: Array<Utbetaling> | undefined = _.cloneDeep(sisteAnsettelseInfo?.utbetalinger)
      if (_.isNil(newUtbetalinger)) {
        newUtbetalinger = []
      }
      newUtbetalinger.push(_newUtbetaling)
      dispatch(updateReplySed(`${target}.utbetalinger`, newUtbetalinger))
      onCloseNew()
    }
  }

  const renderRow = (utbetaling: Utbetaling | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _utbetaling = index < 0 ? _newUtbetaling : (inEditMode ? _editUtbetaling : utbetaling)

    const addremovepanel = (
      <AlignEndColumn>
        <AddRemovePanel<Utbetaling>
          item={utbetaling}
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
    )

    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getId(utbetaling)}
        className={classNames({
          new: index < 0,
          error: _v[_namespace + '-land'] || _v[_namespace + '-fraDato']
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow>
          <Column>
            {inEditMode
              ? (
                <>
                  <Label>
                    {t('label:utbetaling-type')}
                  </Label>
                  <RadioPanelGroup
                    value={_utbetaling?.utbetalingType}
                    data-multiple-line
                    data-no-border
                    data-testid={_namespace + '-utbetalingType'}
                    error={_v[_namespace + 'utbetalingType']?.skjemaelementId}
                    id={_namespace + '-utbetalingType'}
                    name={_namespace + '-utbetalingType'}
                    onChange={(e: string) => setUtbetalingType(e, index)}
                  >
                    <RadioPanel value='inntekter_for_periode_etter_avslutning_av_arbeidsforhold_eller_opphør_i_selvstendig_næringsvirksomhet'>
                      {t('el:option-typebeløp-inntekter_for_periode_etter_avslutning_av_arbeidsforhold_eller_opphør_i_selvstendig_næringsvirksomhet')}
                    </RadioPanel>
                    <VerticalSeparatorDiv size='0.5' />
                    <RadioPanel value='vederlag_for_ferie_som_ikke_er_tatt_ut_årlig_ferie'>
                      {t('el:option-typebeløp-vederlag_for_ferie_som_ikke_er_tatt_ut_årlig_ferie')}
                    </RadioPanel>
                    <VerticalSeparatorDiv size='0.5' />
                    <RadioPanel value='annet_vederlag_eller_tilsvarende_utbetalinger'>
                      {t('el:option-typebeløp-annet_vederlag_eller_tilsvarende_utbetalinger')}
                    </RadioPanel>
                  </RadioPanelGroup>
                </>
                )
              : (
                <FormText
                  error={_v[_namespace + '-utbetalingType']?.feilmelding}
                  id={_namespace + '-utbetalingType'}
                >
                  <FlexDiv>
                    <Label>{t('label:utbetaling-type') + ':'}</Label>
                    <HorizontalSeparatorDiv size='0.5' />
                    {t('el:option-typebeløp-' + _utbetaling?.utbetalingType)}
                  </FlexDiv>
                </FormText>
                )}
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        {inEditMode
          ? (
            <>
              <Heading size='small'>
                {t('label:utbetaling')}
              </Heading>
              <VerticalSeparatorDiv />
              <AlignStartRow>
                <Column>
                  <Input
                    type='number'
                    error={_v[_namespace + '-beloep']?.feilmelding}
                    namespace={_namespace}
                    id='beloep'
                    label={t('label:beløp')}
                    onChanged={(newBeløp: string) => setBeløp(newBeløp, index)}
                    required
                    value={_utbetaling?.beloep}
                  />
                </Column>
                <Column>
                  <CountrySelect
                    closeMenuOnSelect
                    ariaLabel={t('label:valuta')}
                    data-testid={_namespace + '-valuta'}
                    error={_v[_namespace + '-valuta']?.feilmelding}
                    id={_namespace + '-valuta'}
                    label={t('label:valuta') + ' *'}
                    locale='nb'
                    menuPortalTarget={document.body}
                    onOptionSelected={(c: Currency) => setValuta(c, index)}
                    type='currency'
                    values={_currencyData.findByValue(_utbetaling?.valuta)}
                  />
                </Column>
                <Column>
                  {_utbetaling?.utbetalingType === 'inntekter_for_periode_etter_avslutning_av_arbeidsforhold_eller_opphør_i_selvstendig_næringsvirksomhet' && (
                    <DateInput
                      error={_v[_namespace + '-loennTilDato']?.feilmelding}
                      namespace={_namespace}
                      id='loennTilDato'
                      label={t('label:loenn-til-dato')}
                      onChanged={(date: string) => setLoennTilDato(date, index)}
                      value={_utbetaling?.loennTilDato}
                    />
                  )}
                  {_utbetaling?.utbetalingType === 'vederlag_for_ferie_som_ikke_er_tatt_ut_årlig_ferie' && (
                    <Input
                      error={_v[_namespace + '-feriedagerTilGode']?.feilmelding}
                      namespace={_namespace}
                      id='feriedagerTilGode'
                      label={t('label:feriedager-til-gode')}
                      onChanged={(value) => setFeriedagerTilGode(value, index)}
                      value={_utbetaling?.feriedagerTilGode}
                    />
                  )}
                </Column>
                {addremovepanel}
              </AlignStartRow>
            </>
            )
          : (
            <>
              <AlignStartRow style={{ minHeight: '2.2rem' }}>
                <Column>
                  <FlexDiv>
                    <Label>{t('label:beløp') + ':'}</Label>
                    <HorizontalSeparatorDiv size='0.5' />
                    <FlexDiv>
                      <FormText
                        error={_v[_namespace + '-beloep']?.feilmelding}
                        id={_namespace + '-beloep'}
                      >
                        {_utbetaling?.beloep}
                      </FormText>
                      <HorizontalSeparatorDiv size='0.5' />
                      <FormText
                        error={_v[_namespace + '-valuta']?.feilmelding}
                        id={_namespace + '-valuta'}
                      >
                        {_utbetaling?.valuta}
                      </FormText>
                    </FlexDiv>
                  </FlexDiv>
                </Column>
                <Column>
                  {!!_utbetaling?.feriedagerTilGode && (
                    <FormText
                      error={_v[_namespace + '-feriedagerTilGode']?.feilmelding}
                      id={_namespace + '-feriedagerTilGode'}
                    >
                      <FlexDiv>
                        <Label>{t('label:feriedager-til-gode') + ':'}</Label>
                        <HorizontalSeparatorDiv size='0.5' />
                        {_utbetaling?.feriedagerTilGode}
                      </FlexDiv>
                    </FormText>
                  )}
                  {!!_utbetaling?.loennTilDato && (
                    <FormText
                      error={_v[_namespace + '-loennTilDato']?.feilmelding}
                      id={_namespace + '-loennTilDato'}
                    >
                      <FlexDiv>
                        <Label>{t('label:loenn-til-dato') + ':'}</Label>
                        <HorizontalSeparatorDiv size='0.5' />
                        {_utbetaling?.loennTilDato}
                      </FlexDiv>
                    </FormText>
                  )}
                </Column>
                {addremovepanel}
              </AlignStartRow>
              <HorizontalLineSeparator />
            </>
            )}
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <>
      <PaddedDiv>
        <Heading size='small'>
          {label}
        </Heading>
      </PaddedDiv>
      <VerticalSeparatorDiv />
      {_.isEmpty(sisteAnsettelseInfo?.utbetalinger)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-utbetaling')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : sisteAnsettelseInfo?.utbetalinger?.map(renderRow)}
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
              {t('el:button-add-new-x', { x: t('label:utbetaling').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
      <VerticalSeparatorDiv />
      <PaddedDiv>
        <Heading size='small'>
          {t('label:opphoer')}
        </Heading>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column>
            <TextAreaDiv>
              <TextArea
                maxLength={255}
                error={validation[namespace + '-opphoerRettighet']?.feilmelding}
                namespace={namespace}
                id='avkall'
                label={t('label:opphoer-rettighet')}
                onChanged={setOpphoerRettighet}
                value={sisteAnsettelseInfo?.opphoerRettighet}
              />
            </TextAreaDiv>
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column>
            <TextAreaDiv>
              <TextArea
                maxLength={255}
                error={validation[namespace + '-opphoerRettighetGrunn']?.feilmelding}
                namespace={namespace}
                id='opphoerRettighetGrunn'
                label={t('label:opphoer-rettighet-grunn')}
                onChanged={setOpphoerRettighetGrunn}
                value={sisteAnsettelseInfo?.opphoerRettighetGrunn}
              />
            </TextAreaDiv>
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column>
            <TextAreaDiv>
              <TextArea
                maxLength={255}
                error={validation[namespace + '-opphoerYtelse']?.feilmelding}
                namespace={namespace}
                id='opphoerYtelse'
                label={t('label:opphoer-ytelse')}
                onChanged={setOpphoerYtelse}
                value={sisteAnsettelseInfo?.opphoerYtelse}
              />
            </TextAreaDiv>
          </Column>
        </AlignStartRow>
      </PaddedDiv>
    </>
  )
}

export default SisteAnsettelseInfoFC
