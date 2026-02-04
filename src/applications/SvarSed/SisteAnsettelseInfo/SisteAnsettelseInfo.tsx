import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyLong, Box, Button, Heading, HGrid, HStack, Label, Radio, RadioGroup, Spacer, VStack } from '@navikt/ds-react'
import CountryData, { Currency } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import FormText from 'components/Forms/FormText'
import Input from 'components/Forms/Input'
import TextArea from 'components/Forms/TextArea'
import DateField from "components/DateField/DateField";
import { HorizontalLineSeparator, RepeatableBox, SpacedHr } from 'components/StyledComponents'
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
import commonStyles from 'assets/css/common.module.css'

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
        etterbetalinger: _editUtbetaling,
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
      etterbetalinger: _newUtbetaling,
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
      <HStack>
        <Spacer/>
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
      </HStack>
    )

    return (
      <RepeatableBox
        id={'repeatablerow-' + _namespace}
        key={getId(utbetaling)}
        className={classNames({
          new: index < 0,
          error: _v[_namespace + '-land'] || _v[_namespace + '-fraDato']
        })}
        padding="4"
      >
        <VStack gap="4">
          <HGrid columns="1fr auto" gap="4" align="start">
            {inEditMode
              ? (
                <RadioGroup
                  legend={t('label:utbetaling-type')}
                  value={_utbetaling?.utbetalingType}
                  data-testid={_namespace + '-utbetalingType'}
                  error={_v[_namespace + 'utbetalingType']?.skjemaelementId}
                  id={_namespace + '-utbetalingType'}
                  onChange={(e: string) => setUtbetalingType(e, index)}
                >
                  <VStack gap="2">
                    <Radio className={commonStyles.radioPanel} value='inntekter_for_periode_etter_avslutning_av_arbeidsforhold_eller_opphør_i_selvstendig_næringsvirksomhet'>
                      {t('el:option-typebeløp-inntekter_for_periode_etter_avslutning_av_arbeidsforhold_eller_opphør_i_selvstendig_næringsvirksomhet')}
                    </Radio>
                    <Radio className={commonStyles.radioPanel} value='vederlag_for_ferie_som_ikke_er_tatt_ut_årlig_ferie'>
                      {t('el:option-typebeløp-vederlag_for_ferie_som_ikke_er_tatt_ut_årlig_ferie')}
                    </Radio>
                    <Radio className={commonStyles.radioPanel} value='annet_vederlag_eller_tilsvarende_utbetalinger'>
                      {t('el:option-typebeløp-annet_vederlag_eller_tilsvarende_utbetalinger')}
                    </Radio>
                  </VStack>
                </RadioGroup>
                )
              : (
                <FormText
                  error={_v[_namespace + '-utbetalingType']?.feilmelding}
                  id={_namespace + '-utbetalingType'}
                >
                  <HStack gap="2">
                    <Label>{t('label:utbetaling-type') + ':'}</Label>
                    {t('el:option-typebeløp-' + _utbetaling?.utbetalingType)}
                  </HStack>
                </FormText>
                )}
            {!inEditMode && addremovepanel}
          </HGrid>
          {inEditMode && (
            <>
              <Heading size='small'>
                {t('label:utbetaling')}
              </Heading>
              <HGrid columns={3} gap="4" align="start">
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
                <Box>
                  {_utbetaling?.utbetalingType === 'inntekter_for_periode_etter_avslutning_av_arbeidsforhold_eller_opphør_i_selvstendig_næringsvirksomhet' && (
                    <DateField
                      error={_v[_namespace + '-loennTilDato']?.feilmelding}
                      namespace={_namespace}
                      id='loennTilDato'
                      label={t('label:loenn-til-dato')}
                      onChanged={(date: string) => setLoennTilDato(date, index)}
                      dateValue={_utbetaling?.loennTilDato}
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
                </Box>
              </HGrid>
              {addremovepanel}
            </>
            )}
          {!inEditMode && (
            <>
              <HGrid columns={2} gap="4">
                <HStack gap="2">
                  <Label>{t('label:beløp') + ':'}</Label>
                  <HStack gap="2">
                    <FormText
                      error={_v[_namespace + '-beloep']?.feilmelding}
                      id={_namespace + '-beloep'}
                    >
                      {_utbetaling?.beloep}
                    </FormText>
                    <FormText
                      error={_v[_namespace + '-valuta']?.feilmelding}
                      id={_namespace + '-valuta'}
                    >
                      {_utbetaling?.valuta}
                    </FormText>
                  </HStack>
                </HStack>
                <Box>
                  {!!_utbetaling?.feriedagerTilGode && (
                    <FormText
                      error={_v[_namespace + '-feriedagerTilGode']?.feilmelding}
                      id={_namespace + '-feriedagerTilGode'}
                    >
                      <HStack gap="2">
                        <Label>{t('label:feriedager-til-gode') + ':'}</Label>
                        {_utbetaling?.feriedagerTilGode}
                      </HStack>
                    </FormText>
                  )}
                  {!!_utbetaling?.loennTilDato && (
                    <FormText
                      error={_v[_namespace + '-loennTilDato']?.feilmelding}
                      id={_namespace + '-loennTilDato'}
                    >
                      <HStack gap="2">
                        <Label>{t('label:loenn-til-dato') + ':'}</Label>
                        {_utbetaling?.loennTilDato}
                      </HStack>
                    </FormText>
                  )}
                </Box>
              </HGrid>
              <HorizontalLineSeparator />
            </>
            )}
        </VStack>
      </RepeatableBox>
    )
  }

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        {_.isEmpty(sisteAnsettelseInfo?.utbetalinger)
          ? (
            <Box>
              <SpacedHr />
              <BodyLong>
                {t('message:warning-no-utbetaling')}
              </BodyLong>
              <SpacedHr />
            </Box>
            )
          : sisteAnsettelseInfo?.utbetalinger?.map(renderRow)}
        {_newForm
          ? renderRow(null, -1)
          : (
            <Box>
              <Button
                variant='tertiary'
                onClick={() => _setNewForm(true)}
                icon={<PlusCircleIcon/>}
              >
                {t('el:button-add-new-x', { x: t('label:utbetaling').toLowerCase() })}
              </Button>
            </Box>
            )}
        <Heading size='small'>
          {t('label:opphoer')}
        </Heading>
        <TextArea
          maxLength={255}
          error={validation[namespace + '-opphoerRettighet']?.feilmelding}
          namespace={namespace}
          id='avkall'
          label={t('label:opphoer-rettighet')}
          onChanged={setOpphoerRettighet}
          value={sisteAnsettelseInfo?.opphoerRettighet}
        />
        <TextArea
          maxLength={255}
          error={validation[namespace + '-opphoerRettighetGrunn']?.feilmelding}
          namespace={namespace}
          id='opphoerRettighetGrunn'
          label={t('label:opphoer-rettighet-grunn')}
          onChanged={setOpphoerRettighetGrunn}
          value={sisteAnsettelseInfo?.opphoerRettighetGrunn}
        />
        <TextArea
          maxLength={255}
          error={validation[namespace + '-opphoerYtelse']?.feilmelding}
          namespace={namespace}
          id='opphoerYtelse'
          label={t('label:opphoer-ytelse')}
          onChanged={setOpphoerYtelse}
          value={sisteAnsettelseInfo?.opphoerYtelse}
        />
      </VStack>
    </Box>
  )
}

export default SisteAnsettelseInfoFC
