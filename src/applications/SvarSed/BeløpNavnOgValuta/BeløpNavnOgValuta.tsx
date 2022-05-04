import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Heading } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  FlexRadioPanels,
  PaddedDiv,
  RadioPanel,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { Currency } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import { resetValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import Select from 'components/Forms/Select'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { Periode, Utbetalingshyppighet, Ytelse, YtelseNavn } from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
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
  const ytelser: Array<Ytelse> = _.get(replySed, target)
  const namespace: string = `${parentNamespace}-${personID}-` + (personID === 'familie' ? 'familieytelser' : 'beløpnavnogvaluta')

  const [_newAntallPersoner, _setNewAntallPersoner] = useState<string | undefined>(undefined)
  const [_newYtelsesNavn, _setNewYtelsesNavn] = useState<string | undefined>(undefined)
  const [_newBeløp, _setNewBeløp] = useState<string | undefined>(undefined)
  const [_newValuta, _setNewValuta] = useState<Currency | undefined>(undefined)
  const [_newPeriode, _setNewPeriode] = useState<Periode | undefined>(undefined)
  const [_newMottakersNavn, _setNewMottakersNavn] = useState<string | undefined>(undefined)
  const [_newUtbetalingshyppighet, _setNewUtbetalingshyppighet] = useState<string | undefined>(undefined)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Ytelse>((y: Ytelse): string => y.ytelseNavn + '-' + y.startdato + '-' + y.sluttdato)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useLocalValidation<ValidationBeløpNavnOgValutaProps>(validateBeløpNavnOgValuta, namespace)

  const ytelseNavnOptions: Options = [{
    label: t('el:option-familieytelser-barnetrygd'), value: 'Barnetrygd'
  }, {
    label: t('el:option-familieytelser-kontantstøtte'), value: 'Kontantstøtte'
  }]

  const setAntallPersoner = (newAntallPersoner: string, index: number) => {
    if (index < 0) {
      _setNewAntallPersoner(newAntallPersoner.trim())
      _resetValidation(namespace + '-antallPersoner')
    } else {
      dispatch(updateReplySed(`${target}[${index}].antallPersoner`, newAntallPersoner.trim()))
      if (validation[namespace + getIdx(index) + '-antallPersoner']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-antallPersoner'))
      }
    }
  }

  const setYtelseNavn = (newYtelseNavn: YtelseNavn, index: number) => {
    if (index < 0) {
      _setNewYtelsesNavn(newYtelseNavn.trim())
      _resetValidation(namespace + '-ytelseNavn')
    } else {
      dispatch(updateReplySed(`${target}[${index}].ytelseNavn`, newYtelseNavn.trim()))
      if (validation[namespace + getIdx(index) + '-ytelseNavn']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-ytelseNavn'))
      }
    }
  }

  const setBeløp = (newBeløp: string, index: number) => {
    if (index < 0) {
      _setNewBeløp(newBeløp.trim())
      _resetValidation(namespace + '-beloep')
      if (_.isNil(_newValuta)) {
        _setNewValuta({ value: 'NOK' } as Currency)
      }
    } else {
      dispatch(updateReplySed(`${target}[${index}].beloep`, newBeløp.trim()))
      if (validation[namespace + getIdx(index) + '-beloep']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-beloep'))
      }
      if (_.isNil(ytelser[index]?.valuta)) {
        setValuta({ value: 'NOK' } as Currency, index)
      }
    }
  }

  const setValuta = (newValuta: Currency, index: number) => {
    if (index < 0) {
      _setNewValuta(newValuta)
      _resetValidation(namespace + '-valuta')
    } else {
      dispatch(updateReplySed(`${target}[${index}].valuta`, newValuta?.value))
      if (validation[namespace + getIdx(index) + '-valuta']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-valuta'))
      }
    }
  }

  const setPeriode = (newPeriode: Periode, id: string, index: number) => {
    if (index < 0) {
      _setNewPeriode(newPeriode)
      if (id === 'startdato') {
        _resetValidation(namespace + '-startdato')
      }
      if (id === 'sluttdato') {
        _resetValidation(namespace + '-sluttdato')
      }
    } else {
      if (ytelser[index].startdato !== newPeriode.startdato) {
        dispatch(updateReplySed(`${target}[${index}].startdato`, newPeriode.startdato))
        if (id === 'startdato' && validation[namespace + getIdx(index) + '-startdato']) {
          dispatch(resetValidation(namespace + getIdx(index) + '-startdato'))
        }
      }
      if (ytelser[index].sluttdato !== newPeriode.sluttdato) {
        dispatch(updateReplySed(`${target}[${index}].sluttdato`, newPeriode.sluttdato))
        if (id === 'sluttdato' && validation[namespace + getIdx(index) + '-sluttdato']) {
          dispatch(resetValidation(namespace + getIdx(index) + '-sluttdato'))
        }
      }
    }
  }

  const setMottakersNavn = (newMottakersNavn: string, index: number) => {
    if (index < 0) {
      _setNewMottakersNavn(newMottakersNavn)
      _resetValidation(namespace + '-mottakersNavn')
    } else {
      dispatch(updateReplySed(`${target}[${index}].mottakersNavn`, newMottakersNavn.trim()))
      if (validation[namespace + getIdx(index) + '-mottakersNavn']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-mottakersNavn'))
      }
    }
  }

  const setUtbetalingshyppighet = (newUtbetalingshyppighet: Utbetalingshyppighet, index: number) => {
    if (index < 0) {
      _setNewUtbetalingshyppighet(newUtbetalingshyppighet)
      _resetValidation(namespace + '-utbetalingshyppighet')
    } else {
      dispatch(updateReplySed(`${target}[${index}].utbetalingshyppighet`, newUtbetalingshyppighet.trim()))
      if (validation[namespace + getIdx(index) + '-utbetalingshyppighet']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-utbetalingshyppighet'))
      }
    }
  }

  const resetForm = () => {
    _setNewAntallPersoner(undefined)
    _setNewYtelsesNavn(undefined)
    _setNewBeløp(undefined)
    _setNewValuta(undefined)
    _setNewPeriode(undefined)
    _setNewMottakersNavn(undefined)
    _setNewUtbetalingshyppighet(undefined)
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (i: number) => {
    const newYtelser = _.cloneDeep(ytelser)
    const deletedYtelser: Array<Ytelse> = newYtelser.splice(i, 1)
    if (deletedYtelser && deletedYtelser.length > 0) {
      removeFromDeletion(deletedYtelser[0])
    }
    dispatch(updateReplySed(target, newYtelser))
    standardLogger('svarsed.editor.ytelse.remove')
  }

  const onAdd = () => {
    const newYtelse: Ytelse = {
      antallPersoner: _newAntallPersoner?.trim(),
      beloep: _newBeløp?.trim(),
      mottakersNavn: _newMottakersNavn?.trim(),
      sluttdato: _newPeriode?.sluttdato?.trim(),
      startdato: _newPeriode?.startdato?.trim(),
      utbetalingshyppighet: _newUtbetalingshyppighet?.trim(),
      valuta: _newValuta?.value,
      ytelseNavn: _newYtelsesNavn?.trim()
    } as Ytelse

    if (personID !== 'familie') {
      delete newYtelse.antallPersoner
    }

    const valid = performValidation({
      ytelse: newYtelse,
      personID,
      personName
    })
    if (valid) {
      let newYtelser = _.cloneDeep(ytelser)
      if (_.isNil(newYtelser)) {
        newYtelser = []
      }
      newYtelser.push(newYtelse)
      dispatch(updateReplySed(target, newYtelser))
      standardLogger('svarsed.editor.ytelse.add')
      onCancel()
    }
  }

  const renderRow = (ytelse: Ytelse | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(ytelse)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )

    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow>
          <Column>
            <Select
              closeMenuOnSelect
              data-testid={namespace + '-ytelseNavn'}
              error={getErrorFor(index, 'ytelseNavn')}
              id={namespace + '-ytelseNavn'}
              key={namespace + '-ytelseNavn-' + (index < 0 ? _newYtelsesNavn : ytelse?.ytelseNavn as YtelseNavn)}
              label={t('label:betegnelse-på-ytelse')}
              menuPortalTarget={document.body}
              onChange={(e: any) => setYtelseNavn(e.value, index)}
              options={ytelseNavnOptions}
              required
              value={_.find(ytelseNavnOptions, b => b.value === (index < 0 ? _newYtelsesNavn : ytelse?.ytelseNavn as YtelseNavn))}
              defaultValue={_.find(ytelseNavnOptions, b => b.value === (index < 0 ? _newYtelsesNavn : ytelse?.ytelseNavn as YtelseNavn))}
            />
          </Column>
          {personID === 'familie' && (
            <Column>
              <Input
                type='number'
                min='0'
                error={getErrorFor(index, 'antallPersoner')}
                key={'antall-innvilges-' + (index < 0 ? _newAntallPersoner : ytelse?.antallPersoner)}
                namespace={namespace}
                id='antallPersoner'
                label={t('label:antall-innvilges')}
                onChanged={(newAntallPersoner: string) => setAntallPersoner(newAntallPersoner, index)}
                required
                value={(index < 0 ? _newAntallPersoner : ytelse?.antallPersoner) ?? ''}
              />
            </Column>
          )}
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column>
            <Input
              error={getErrorFor(index, 'beloep')}
              namespace={namespace}
              id='beloep'
              description={personID === 'familie' ? t('message:help-familieytelser-beløp') : undefined}
              label={t('label:beløp')}
              key={namespace + '-beløp-' + (index < 0 ? _newBeløp : (ytelse?.beloep ?? ''))}
              onChanged={(newBeløp: string) => setBeløp(newBeløp, index)}
              required
              value={index < 0 ? _newBeløp : (ytelse?.beloep ?? '')}
            />
          </Column>
          <Column style={{ marginTop: personID === 'familie' ? '3rem' : '0rem' }}>
            <CountrySelect
              key={namespace + '-valuta-' + (index < 0 ? _newYtelsesNavn : (ytelse?.valuta ?? ''))}
              closeMenuOnSelect
              ariaLabel={t('label:valuta')}
              data-testid={namespace + '-valuta'}
              error={getErrorFor(index, 'valuta')}
              id={namespace + '-valuta'}
              label={t('label:valuta') + ' *'}
              locale='nb'
              menuPortalTarget={document.body}
              onOptionSelected={(e: any) => setValuta(e, index)}
              type='currency'
              values={index < 0 ? _newYtelsesNavn : (ytelse?.valuta ?? '')}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv size='2' />
        <Heading size='small'>
          {t('label:grant-date')}
        </Heading>
        <VerticalSeparatorDiv size={2} />
        <AlignStartRow>
          <PeriodeInput
            namespace={namespace}
            error={{
              startdato: getErrorFor(index, 'startdato'),
              sluttdato: getErrorFor(index, 'sluttdato')
            }}
            setPeriode={(p: Periode, id: string) => setPeriode(p, id, index)}
            value={{
              startdato: (index < 0 ? _newPeriode?.startdato : ytelse?.startdato) ?? '',
              sluttdato: (index < 0 ? _newPeriode?.sluttdato : ytelse?.sluttdato) ?? ''
            }}
          />
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column>
            <Input
              error={getErrorFor(index, 'mottakersNavn')}
              namespace={namespace}
              id='mottakersNavn'
              key={namespace + '-mottakersNavn' + (index < 0 ? _newMottakersNavn : (ytelse?.mottakersNavn ?? ''))}
              label={t('label:mottakers-navn')}
              onChanged={(newNavn: string) => setMottakersNavn(newNavn, index)}
              required
              value={(index < 0 ? _newMottakersNavn : (ytelse?.mottakersNavn ?? ''))}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='2'>
            <RadioPanelGroup
              value={index < 0 ? _newUtbetalingshyppighet : ytelse?.utbetalingshyppighet}
              data-no-border
              data-testid={namespace + '-utbetalingshyppighet'}
              id={namespace + '-utbetalingshyppighet'}
              key={namespace + '-utbetalingshyppighet' + (index < 0 ? _newUtbetalingshyppighet : ytelse?.utbetalingshyppighet)}
              error={getErrorFor(index, 'utbetalingshyppighet')}
              name={namespace + '-utbetalingshyppighet'}
              legend={t('label:periode-avgrensing') + ' *'}
              onChange={(e: string) => setUtbetalingshyppighet(e as Utbetalingshyppighet, index)}
            >
              <FlexRadioPanels>
                <RadioPanel value='Månedlig'>{t('label:månedlig')}</RadioPanel>
                <RadioPanel value='Årlig'>{t('label:årlig')}</RadioPanel>
              </FlexRadioPanels>
            </RadioPanelGroup>
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(ytelse)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(ytelse)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
      </RepeatableRow>
    )
  }

  return (
    <PaddedDiv>
      <Heading size='small'>
        {personID === 'familie' ? t('label:beløp-for-hele-familien') : t('label:beløp-navn-valuta-barn')}
      </Heading>
      <VerticalSeparatorDiv size={2} />
      <VerticalSeparatorDiv />
      {_.isEmpty(ytelser)
        ? (
          <BodyLong>
            {t('message:warning-no-ytelse')}
          </BodyLong>
          )
        : ytelser?.map(renderRow)}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <AlignStartRow>
            <Column>
              <Button
                variant='tertiary'
                onClick={() => _setSeeNewForm(true)}
              >
                <AddCircle />
                {t('el:button-add-new-x', { x: t('label:ytelse').toLowerCase() })}
              </Button>

            </Column>
          </AlignStartRow>
          )}
    </PaddedDiv>
  )
}

export default BeløpNavnOgValuta
