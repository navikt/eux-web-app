import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Heading, Label } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  FlexDiv,
  FlexRadioPanels,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PaddedHorizontallyDiv,
  RadioPanel,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { Currency } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel2 from 'components/AddRemovePanel/AddRemovePanel2'
import FormText from 'components/Forms/FormText'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Periode, Utbetalingshyppighet, Ytelse, YtelseNavn } from 'declarations/sed'
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
import { hasNamespace } from 'utils/validation'
import { validateBeløpNavnOgValuta, ValidationBeløpNavnOgValutaProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const BeløpNavnOgValuta: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const target: string = `${personID}.ytelser`
  const ytelser: Array<Ytelse> | undefined = _.get(replySed, target)
  const namespace: string = `${parentNamespace}-${personID}-` + (personID === 'familie' ? 'familieytelser' : 'beløpnavnogvaluta')
  const getId = (y: Ytelse | null | undefined): string => y ? y.ytelseNavn + '-' + (y?.startdato ?? '') : 'new'

  const [_newYtelse, _setNewYtelse] = useState<Ytelse | undefined>(undefined)
  const [_editYtelse, _setEditYtelse] = useState<Ytelse | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationBeløpNavnOgValutaProps>(validateBeløpNavnOgValuta, namespace)

  const setAntallPersoner = (newAntallPersoner: string, index: number) => {
    if (index < 0) {
      _setNewYtelse({
        ..._newYtelse,
        antallPersoner: newAntallPersoner.trim()
      } as Ytelse)
      _resetValidation(namespace + '-antallPersoner')
      return
    }
    _setEditYtelse({
      ..._editYtelse,
      antallPersoner: newAntallPersoner.trim()
    } as Ytelse)
    dispatch(resetValidation(namespace + getIdx(index) + '-antallPersoner'))
  }

  const setYtelseNavn = (newYtelseNavn: YtelseNavn, index: number) => {
    if (index < 0) {
      _setNewYtelse({
        ..._newYtelse,
        ytelseNavn: newYtelseNavn.trim()
      } as Ytelse)
      _resetValidation(namespace + '-ytelseNavn')
      return
    }
    _setEditYtelse({
      ..._editYtelse,
      ytelseNavn: newYtelseNavn.trim()
    } as Ytelse)
    dispatch(resetValidation(namespace + getIdx(index) + '-ytelseNavn'))
  }

  const setBeløp = (newBeløp: string, index: number) => {
    if (index < 0) {
      _setNewYtelse({
        ..._newYtelse,
        beloep: newBeløp.trim().trim(),
        valuta: _.isNil(_newYtelse?.valuta) ? 'NOK' : _newYtelse?.valuta
      } as Ytelse)
      _resetValidation(namespace + '-beloep')
      return
    }
    _setEditYtelse({
      ..._editYtelse,
      beloep: newBeløp.trim().trim(),
      valuta: _.isNil(_editYtelse?.valuta) ? 'NOK' : _editYtelse?.valuta
    } as Ytelse)
    dispatch(resetValidation(namespace + getIdx(index) + '-beloep'))
    dispatch(resetValidation(namespace + getIdx(index) + '-valuta'))
  }

  const setValuta = (newValuta: Currency, index: number) => {
    if (index < 0) {
      _setNewYtelse({
        ..._newYtelse,
        valuta: newValuta.value
      } as Ytelse)
      _resetValidation(namespace + '-valuta')
      return
    }
    _setEditYtelse({
      ..._editYtelse,
      valuta: newValuta.value
    } as Ytelse)
    dispatch(resetValidation(namespace + getIdx(index) + '-valuta'))
  }

  const setPeriode = (newPeriode: Periode, id: string, index: number) => {
    if (index < 0) {
      _setNewYtelse({
        ..._newYtelse,
        startdato: newPeriode.startdato,
        sluttdato: newPeriode.sluttdato
      } as Ytelse)
      _resetValidation(namespace + '-startdato')
      _resetValidation(namespace + '-sluttdato')
      return
    }
    _setEditYtelse({
      ..._editYtelse,
      startdato: newPeriode.startdato,
      sluttdato: newPeriode.sluttdato
    } as Ytelse)
    dispatch(resetValidation(namespace + getIdx(index) + '-startdato'))
    dispatch(resetValidation(namespace + getIdx(index) + '-sluttdato'))
  }

  const setMottakersNavn = (newMottakersNavn: string, index: number) => {
    if (index < 0) {
      _setNewYtelse({
        ..._newYtelse,
        mottakersNavn: newMottakersNavn
      } as Ytelse)
      _resetValidation(namespace + '-mottakersNavn')
      return
    }
    _setEditYtelse({
      ..._editYtelse,
      mottakersNavn: newMottakersNavn
    } as Ytelse)
    dispatch(resetValidation(namespace + getIdx(index) + '-mottakersNavn'))
  }

  const setUtbetalingshyppighet = (newUtbetalingshyppighet: Utbetalingshyppighet, index: number) => {
    if (index < 0) {
      _setNewYtelse({
        ..._newYtelse,
        utbetalingshyppighet: newUtbetalingshyppighet.trim()
      } as Ytelse)
      _resetValidation(namespace + '-utbetalingshyppighet')
      return
    }
    _setEditYtelse({
      ..._editYtelse,
      utbetalingshyppighet: newUtbetalingshyppighet.trim()
    } as Ytelse)
    dispatch(resetValidation(namespace + getIdx(index) + '-utbetalingshyppighet'))
  }

  const onCloseEdit = (namespace: string) => {
    _setEditYtelse(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewYtelse(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (y: Ytelse, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditYtelse(y)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const [valid, newValidation] = performValidation<ValidationBeløpNavnOgValutaProps>(
      validation, namespace, validateBeløpNavnOgValuta, {
        ytelse: _editYtelse,
        index: _editIndex,
        personID,
        personName
      })
    if (valid) {
      const __editYtelse = _.cloneDeep(_editYtelse)
      if (personID !== 'familie') {
        delete __editYtelse?.antallPersoner
      }
      dispatch(updateReplySed(`${target}[${_editIndex}]`, __editYtelse))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(newValidation))
    }
  }

  const onRemove = (removed: Ytelse) => {
    const newYtelser: Array<Ytelse> = _.reject(ytelser, (y: Ytelse) => _.isEqual(removed, y))
    dispatch(updateReplySed(target, newYtelser))
    standardLogger('svarsed.editor.ytelse.remove')
  }

  const onAddNew = () => {
    const __newYtelse = _.cloneDeep(_newYtelse)
    if (personID !== 'familie') {
      delete __newYtelse?.antallPersoner
    }

    const valid = _performValidation({
      ytelse: __newYtelse,
      personID,
      personName
    })
    if (!!__newYtelse && valid) {
      let newYtelser: Array<Ytelse> | undefined = _.cloneDeep(ytelser)
      if (_.isNil(newYtelser)) {
        newYtelser = []
      }
      newYtelser.push(__newYtelse)
      newYtelser = newYtelser.sort(periodeSort)
      dispatch(updateReplySed(target, newYtelser))
      standardLogger('svarsed.editor.ytelse.add')
      onCloseNew()
    }
  }

  const renderRow = (ytelse: Ytelse | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _ytelse = index < 0 ? _newYtelse : (inEditMode ? _editYtelse : ytelse)

    const addremovepanel = (
      <AddRemovePanel2<Ytelse>
        item={ytelse}
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
    )

    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getId(ytelse)}
        className={classNames({
          new: index < 0,
          error: hasNamespace(_v, _namespace)
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        {inEditMode
          ? (
            <>
              <AlignStartRow>
                <Column>
                  <RadioPanelGroup
                    defaultValue={ytelse?.ytelseNavn}
                    data-no-border
                    data-testid={_namespace + '-ytelseNavn'}
                    error={_v[_namespace + '-ytelseNavn']?.feilmelding}
                    id={_namespace + '-ytelseNavn'}
                    legend={t('label:betegnelse-på-ytelse') + ' *'}
                    name={_namespace + '-ytelseNavn'}
                    onChange={(e: string) => setYtelseNavn(e as YtelseNavn, index)}
                  >
                    <FlexRadioPanels>
                      <RadioPanel value='Barnetrygd'>{t('el:option-familieytelser-barnetrygd')}</RadioPanel>
                      <RadioPanel value='Kontantstøtte'>{t('el:option-familieytelser-kontantstøtte')}</RadioPanel>
                    </FlexRadioPanels>
                  </RadioPanelGroup>
                </Column>
                {personID === 'familie'
                  ? (
                    <Column>
                      <Input
                        type='number'
                        min='0'
                        error={_v[_namespace + '-antallPersoner']?.feilmelding}
                        key={'antall-innvilges-' + _ytelse?.antallPersoner}
                        namespace={_namespace}
                        id='antallPersoner'
                        label={t('label:antall-innvilges')}
                        onChanged={(newAntallPersoner: string) => setAntallPersoner(newAntallPersoner, index)}
                        required
                        value={_ytelse?.antallPersoner}
                      />
                    </Column>
                    )
                  : (<Column />)}
              </AlignStartRow>
              <VerticalSeparatorDiv />
              <AlignStartRow>
                <Column>
                  <Input
                    error={_v[_namespace + '-beloep']?.feilmelding}
                    namespace={_namespace}
                    id='beloep'
                    description={personID === 'familie' ? t('message:help-familieytelser-beløp') : undefined}
                    label={t('label:beløp')}
                    key={_namespace + '-beløp-' + _ytelse?.beloep}
                    onChanged={(newBeløp: string) => setBeløp(newBeløp, index)}
                    required
                    value={_ytelse?.beloep}
                  />
                </Column>
                <Column style={{ marginTop: personID === 'familie' ? '3rem' : '0rem' }}>
                  <CountrySelect
                    key={_namespace + '-valuta-' + _ytelse?.valuta}
                    closeMenuOnSelect
                    ariaLabel={t('label:valuta')}
                    data-testid={_namespace + '-valuta'}
                    error={_v[_namespace + '-valuta']?.feilmelding}
                    id={_namespace + '-valuta'}
                    label={t('label:valuta') + ' *'}
                    locale='nb'
                    menuPortalTarget={document.body}
                    onOptionSelected={(e: any) => setValuta(e, index)}
                    type='currency'
                    values={_ytelse?.valuta}
                  />
                </Column>
              </AlignStartRow>
              <VerticalSeparatorDiv />
              <Heading size='small'>
                {t('label:grant-date')}
              </Heading>
              <VerticalSeparatorDiv />
              <AlignStartRow>
                <PeriodeInput
                  namespace={namespace}
                  error={{
                    startdato: _v[_namespace + '-startdato']?.feilmelding,
                    sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                  }}
                  hideLabel={false}
                  label={{
                    startdato: t('label:fra-og-med'),
                    sluttdato: t('label:til-og-med')
                  }}
                  periodeType='simple'
                  setPeriode={(p: Periode, id: string) => setPeriode(p, id, index)}
                  value={_ytelse}
                />
                <Column flex='2'>
                  <RadioPanelGroup
                    value={_ytelse?.utbetalingshyppighet}
                    data-no-border
                    data-testid={_namespace + '-utbetalingshyppighet'}
                    id={_namespace + '-utbetalingshyppighet'}
                    key={_namespace + '-utbetalingshyppighet' + _ytelse?.utbetalingshyppighet}
                    error={_v[_namespace + '-utbetalingshyppighet']?.feilmelding}
                    name={_namespace + '-utbetalingshyppighet'}
                    legend={t('label:periode-avgrensing') + ' *'}
                    onChange={(e: string) => setUtbetalingshyppighet(e as Utbetalingshyppighet, index)}
                  >
                    <FlexRadioPanels>
                      <RadioPanel value='Månedlig'>{t('label:månedlig')}</RadioPanel>
                      <RadioPanel value='Årlig'>{t('label:årlig')}</RadioPanel>
                    </FlexRadioPanels>
                  </RadioPanelGroup>
                </Column>
              </AlignStartRow>
              <VerticalSeparatorDiv />
              <AlignStartRow>
                <Column>
                  <Input
                    error={_v[_namespace + '-mottakersNavn']?.feilmelding}
                    namespace={_namespace}
                    id='mottakersNavn'
                    key={_namespace + '-mottakersNavn' + _ytelse?.mottakersNavn}
                    label={t('label:mottakers-navn')}
                    onChanged={(newNavn: string) => setMottakersNavn(newNavn, index)}
                    required
                    value={_ytelse?.mottakersNavn}
                  />
                </Column>
                <AlignEndColumn>
                  {addremovepanel}
                </AlignEndColumn>
              </AlignStartRow>
            </>
            )
          : (
            <>
              <AlignStartRow>
                <Column>
                  <FormText error={_v[_namespace + '-ytelseNavn']}>
                    <FlexDiv>
                      <Label>{t('label:betegnelse-på-ytelse') + ':'}</Label>
                      <HorizontalSeparatorDiv size='0.5' />
                      {_ytelse?.ytelseNavn}
                    </FlexDiv>
                  </FormText>
                </Column>
                {personID === 'familie' && (
                  <Column>
                    <FormText error={_v[_namespace + '-antallPersoner']}>
                      <FlexDiv>
                        <Label>{t('label:antall-innvilges') + ':'}</Label>
                        <HorizontalSeparatorDiv size='0.5' />
                        {_ytelse?.antallPersoner}
                      </FlexDiv>
                    </FormText>
                  </Column>
                )}
                <Column>
                  <FlexDiv>
                    <Label>{t('label:beløp') + ':'}</Label>
                    <HorizontalSeparatorDiv size='0.5' />
                    <FlexDiv>
                      <FormText error={_v[_namespace + '-beloep']}>
                        {_ytelse?.beloep}
                      </FormText>
                      <HorizontalSeparatorDiv size='0.5' />
                      <FormText error={_v[_namespace + '-valuta']}>
                        {_ytelse?.valuta}
                      </FormText>
                    </FlexDiv>
                  </FlexDiv>
                </Column>
              </AlignStartRow>
              <VerticalSeparatorDiv />
              <AlignStartRow>
                <PeriodeText
                  error={{
                    startdato: _v[_namespace + '-startdato'],
                    sluttdato: _v[_namespace + '-sluttdato']
                  }}
                  periode={_ytelse}
                />
                <Column>
                  <FormText error={_v[_namespace + '-utbetalingshyppighet']}>
                    <FlexDiv>
                      <Label>{t('label:periode-avgrensing') + ':'}</Label>
                      <HorizontalSeparatorDiv size='0.5' />
                      {_ytelse?.utbetalingshyppighet}
                    </FlexDiv>
                  </FormText>
                </Column>
              </AlignStartRow>
              <VerticalSeparatorDiv />
              <AlignStartRow>
                <Column>
                  <FormText error={_v[_namespace + '-mottakersNavn']}>
                    <FlexDiv>
                      <Label>{t('label:mottakers-navn') + ':'}</Label>
                      <HorizontalSeparatorDiv size='0.5' />
                      {_ytelse?.mottakersNavn}
                    </FlexDiv>
                  </FormText>
                </Column>
                <AlignEndColumn>
                  {addremovepanel}
                </AlignEndColumn>
              </AlignStartRow>
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
          {personID === 'familie' ? t('label:beløp-for-hele-familien') : t('label:beløp-navn-valuta-barn')}
        </Heading>
      </PaddedDiv>
      <VerticalSeparatorDiv />
      {_.isEmpty(ytelser)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-ytelse')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : ytelser?.map(renderRow)}
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
              {t('el:button-add-new-x', { x: t('label:ytelse').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
    </>
  )
}

export default BeløpNavnOgValuta
