import { PlusCircleIcon } from '@navikt/aksel-icons';
import {BodyLong, Button, Heading, Label} from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  AlignEndRow,
  Column,
  FlexDiv,
  FlexRadioPanels,
  HorizontalSeparatorDiv,
  PaddedDiv,
  RadioPanel,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { Currency } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import FormText from 'components/Forms/FormText'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import { RepeatableRow } from 'components/StyledComponents'
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
import { hasNamespaceWithErrors } from 'utils/validation'
import { validateBeløpNavnOgValuta, ValidationBeløpNavnOgValutaProps } from './validation'
import styled from "styled-components";

const PanelDiv = styled.div`
  .navds-radio{
    margin: 0.2rem 0;
  }
`

const RepeatableRowWithMargin = styled(RepeatableRow)`
    background-color: var(--a-bg-default);
    margin: 0.2rem 0;
`

const DivWithHorizontalPadding = styled.div<{padded:boolean}>`
  padding-left: ${props => (props.padded ? 1 : 0)}rem;
  padding-right: ${props => (props.padded ? 1 : 0)}rem;
`

const PaddedFlexDiv = styled(FlexDiv)`
  padding-top: 0.7rem;
`

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const BeløpNavnOgValuta: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed,
  options
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const showHeading = options && options.hasOwnProperty("showHeading") ? options["showHeading"] : true
  const utvidetBarneTrygd = options && options.hasOwnProperty("utvidetBarneTrygd") ? options["utvidetBarneTrygd"] : false

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
        beloep: newBeløp.trim(),
        valuta: _.isNil(_newYtelse?.valuta) ? 'NOK' : _newYtelse?.valuta
      } as Ytelse)
      _resetValidation([namespace + '-beloep', namespace + '-valuta'])
      return
    }
    _setEditYtelse({
      ..._editYtelse,
      beloep: newBeløp.trim(),
      valuta: _.isNil(_editYtelse?.valuta) ? 'NOK' : _editYtelse?.valuta
    } as Ytelse)
    dispatch(resetValidation([namespace + getIdx(index) + '-beloep', namespace + getIdx(index) + '-valuta']))
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
        startdato: newPeriode.startdato.trim(),
        sluttdato: newPeriode.sluttdato?.trim()
      } as Ytelse)
      _resetValidation([namespace + '-startdato', namespace + '-sluttdato'])
      return
    }
    _setEditYtelse({
      ..._editYtelse,
      startdato: newPeriode.startdato.trim(),
      sluttdato: newPeriode.sluttdato?.trim()
    } as Ytelse)
    dispatch(resetValidation([namespace + getIdx(index) + '-startdato', namespace + getIdx(index) + '-sluttdato']))
  }

  const setMottakersNavn = (newMottakersNavn: string, index: number) => {
    if (index < 0) {
      _setNewYtelse({
        ..._newYtelse,
        mottakersNavn: newMottakersNavn.trim()
      } as Ytelse)
      _resetValidation(namespace + '-mottakersNavn')
      return
    }
    _setEditYtelse({
      ..._editYtelse,
      mottakersNavn: newMottakersNavn.trim()
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
    let ytelseForSaving = _.cloneDeep(_editYtelse)
    if(utvidetBarneTrygd){
      ytelseForSaving = {
        ...ytelseForSaving as Ytelse,
        ytelseNavn: "Utvidet barnetrygd",
        antallPersoner: "1"
      }
    }

    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationBeløpNavnOgValutaProps>(
      clonedValidation, namespace, validateBeløpNavnOgValuta, {
        ytelse: ytelseForSaving,
        index: _editIndex,
        personID,
        personName
      })
    if (!hasErrors) {
      const __editYtelse = _.cloneDeep(ytelseForSaving)
      if (personID !== 'familie') {
        delete __editYtelse?.antallPersoner
      }
      dispatch(updateReplySed(`${target}[${_editIndex}]`, __editYtelse))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removed: Ytelse) => {
    const newYtelser: Array<Ytelse> = _.reject(ytelser, (y: Ytelse) => _.isEqual(removed, y))
    dispatch(updateReplySed(target, newYtelser))
    standardLogger('svarsed.editor.ytelse.remove')
  }

  const onAddNew = () => {
    let __newYtelse = _.cloneDeep(_newYtelse)
    if (personID !== 'familie') {
      delete __newYtelse?.antallPersoner
    }

    if(utvidetBarneTrygd){
      __newYtelse = {
        ...__newYtelse as Ytelse,
        ytelseNavn: "Utvidet barnetrygd",
        antallPersoner: "1"
      }
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
      <AddRemovePanel<Ytelse>
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
      <RepeatableRowWithMargin
        id={'repeatablerow-' + _namespace}
        key={getId(ytelse)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        {inEditMode
          ? (
            <>
              {!utvidetBarneTrygd &&
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
                      <PanelDiv>
                        <RadioPanel value='Barnetrygd'>{t('el:option-familieytelser-barnetrygd')}</RadioPanel>
                        <RadioPanel value='Kontantstøtte'>{t('el:option-familieytelser-kontantstøtte')}</RadioPanel>
                        {personID === 'familie' && <RadioPanel value='Utvidet barnetrygd'>{t('el:option-familieytelser-utvidet-barnetrygd')}</RadioPanel>}
                      </PanelDiv>
                    </RadioPanelGroup>
                  </Column>
                  <Column>
                    {personID === 'familie' && (
                      <Input
                        type='number'
                        min='0'
                        error={_v[_namespace + '-antallPersoner']?.feilmelding}
                        namespace={_namespace}
                        id='antallPersoner'
                        label={t('label:antall-innvilges')}
                        onChanged={(newAntallPersoner: string) => setAntallPersoner(newAntallPersoner, index)}
                        required
                        value={_ytelse?.antallPersoner}
                      />
                    )}
                  </Column>
                </AlignStartRow>
              }
              <VerticalSeparatorDiv />
              <AlignStartRow>
                <Column>
                  <Input
                    error={_v[_namespace + '-beloep']?.feilmelding}
                    namespace={_namespace}
                    id='beloep'
                    description={personID === 'familie' && showHeading ? t('message:help-familieytelser-beløp') : undefined}
                    label={t('label:beløp')}
                    onChanged={(newBeløp: string) => setBeløp(newBeløp, index)}
                    required
                    value={_ytelse?.beloep}
                  />
                </Column>
                <Column style={{ marginTop: personID === 'familie' && showHeading  ? '3rem' : '0rem' }}>
                  <CountrySelect
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
                  requiredStartDato={false}
                  requiredSluttDato={false}
                />
                <Column flex='2'>
                  <RadioPanelGroup
                    value={_ytelse?.utbetalingshyppighet}
                    data-no-border
                    data-testid={_namespace + '-utbetalingshyppighet'}
                    id={_namespace + '-utbetalingshyppighet'}
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
              <AlignEndRow>
                <Column>
                  <Input
                    error={_v[_namespace + '-mottakersNavn']?.feilmelding}
                    namespace={_namespace}
                    id='mottakersNavn'
                    label={t('label:mottakers-navn-naar-annen-enn-soker')}
                    onChanged={(newNavn: string) => setMottakersNavn(newNavn, index)}
                    value={_ytelse?.mottakersNavn}
                  />
                </Column>
                <AlignEndColumn>
                  {addremovepanel}
                </AlignEndColumn>
              </AlignEndRow>
            </>
            )
          : (
            <>
              <AlignStartRow>
                {!utvidetBarneTrygd &&
                  <Column>
                    <FormText
                      error={_v[_namespace + '-ytelseNavn']?.feilmelding}
                      id={_namespace + '-ytelseNavn'}
                    >
                      <FlexDiv>
                        <Label>{t('label:betegnelse-på-ytelse') + ':'}</Label>
                        <HorizontalSeparatorDiv size='0.5' />
                        {_ytelse?.ytelseNavn}
                      </FlexDiv>
                    </FormText>
                  </Column>
                }
                <Column>
                  <FlexDiv>
                    {personID === 'familie' && !utvidetBarneTrygd && (
                      <>
                        <FormText
                          error={_v[_namespace + '-antallPersoner']?.feilmelding}
                          id={_namespace + '-antallPersoner'}
                        >
                          <FlexDiv>
                            <Label>{t('label:antall-innvilges') + ':'}</Label>
                            <HorizontalSeparatorDiv size='0.5' />
                            {_ytelse?.antallPersoner}
                          </FlexDiv>
                        </FormText>
                        <HorizontalSeparatorDiv size='0.5' />
                      </>
                    )}
                  </FlexDiv>
                </Column>
              </AlignStartRow>
              <AlignStartRow>
                <Column>
                  <FlexDiv>
                    <Label>{t('label:beløp') + ':'}</Label>
                    <HorizontalSeparatorDiv size='0.5' />
                    <FormText
                      error={_v[_namespace + '-beloep']?.feilmelding}
                      id={_namespace + '-beloep'}
                    >
                      {_ytelse?.beloep}
                    </FormText>
                    <HorizontalSeparatorDiv size='0.5' />
                    <FormText
                      error={_v[_namespace + '-valuta']?.feilmelding}
                      id={_namespace + '-valuta'}
                    >
                      {_ytelse?.valuta}
                    </FormText>
                  </FlexDiv>
                </Column>
                <Column/>
              </AlignStartRow>
              <VerticalSeparatorDiv />
              <AlignStartRow>
                <Column>
                  <PeriodeText
                    error={{
                      startdato: _v[_namespace + '-startdato']?.feilmelding,
                      sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                    }}
                    namespace={_namespace}
                    periode={_ytelse}
                  />
                </Column>
                <Column>
                  <FormText
                    error={_v[_namespace + '-utbetalingshyppighet']?.feilmelding}
                    id={_namespace + '-utbetalingshyppighet'}
                  >
                    <FlexDiv>
                      <Label>{t('label:periode-avgrensing') + ':'}</Label>
                      <HorizontalSeparatorDiv size='0.5' />
                      {_ytelse?.utbetalingshyppighet}
                    </FlexDiv>
                  </FormText>
                </Column>
              </AlignStartRow>
              <VerticalSeparatorDiv />
              <AlignEndRow>
                <Column>
                  <FormText
                    error={_v[_namespace + '-mottakersNavn']?.feilmelding}
                    id={_namespace + '-mottakersNavn'}
                  >
                    <PaddedFlexDiv>
                      <Label>{t('label:mottakers-navn') + ':'}</Label>
                      <HorizontalSeparatorDiv size='0.5' />
                      {_ytelse?.mottakersNavn}
                    </PaddedFlexDiv>
                  </FormText>
                </Column>
                <AlignEndColumn>
                  {addremovepanel}
                </AlignEndColumn>
              </AlignEndRow>
            </>
            )}
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRowWithMargin>
    )
  }



  return (
    <>
      {showHeading &&
        <PaddedDiv>
          <Heading size='small'>
            {personID === 'familie' ? t('label:beløp-for-hele-familien') : t('label:beløp-navn-valuta-barn')}
          </Heading>
        </PaddedDiv>
      }
      <VerticalSeparatorDiv />
      {_.isEmpty(ytelser)
        ? (
          <DivWithHorizontalPadding padded={showHeading}>
            <BodyLong>
              {t('message:warning-no-ytelse')}
            </BodyLong>
          </DivWithHorizontalPadding>
          )
        : ytelser?.map(renderRow)}
      <VerticalSeparatorDiv />
      {_newForm
        ? renderRow(null, -1)
        : (
          <DivWithHorizontalPadding padded={showHeading}>
            <Button
              variant='tertiary'
              onClick={() => _setNewForm(true)}
              icon={<PlusCircleIcon/>}
            >
              {t('el:button-add-new-x', { x: t('label:ytelse').toLowerCase() })}
            </Button>
            {!showHeading && <VerticalSeparatorDiv/>}
          </DivWithHorizontalPadding>
          )}
    </>
  )
}

export default BeløpNavnOgValuta
