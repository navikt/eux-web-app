import { setReplySed, updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { FormålManagerFormProps, FormålManagerFormSelector } from 'applications/SvarSed/Formaal/FormålManager'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import DateInput from 'components/Forms/DateInput'
import Input from 'components/Forms/Input'
import TextArea from 'components/Forms/TextArea'
import Period from 'components/Period/Period'
import { HorizontalLineSeparator, TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import {
  AnmodningSvarType,
  Barn,
  BarnaEllerFamilie,
  F002Sed,
  Motregning as IMotregning,
  NavnOgBetegnelse, ReplySed, Utbetalingshyppighet
} from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import CountryData, { Currency } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { UndertekstBold, Undertittel } from 'nav-frontend-typografi'
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
import { getIdx } from 'utils/namespace'
import { validateMotregningNavnOgBetegnelser, ValidationMotregningNavnOgBetegnelserProps } from './validation'

export interface MotregningSelector extends FormålManagerFormSelector {
  highContrast: boolean
}

const mapState = (state: State): MotregningSelector => ({
  highContrast: state.ui.highContrast,
  replySed: state.svarpased.replySed,
  validation: state.validation.status,
  viewValidation: state.validation.view
})

const Motregning: React.FC<FormålManagerFormProps> = ({
  parentNamespace,
  seeKontoopplysninger
}: FormålManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    highContrast,
    replySed,
    validation
  }: any = useSelector<State, MotregningSelector>(mapState)
  const dispatch = useDispatch()
  const namespace = `${parentNamespace}-motregning`
  const _currencyData = CountryData.getCurrencyInstance('nb')

  let barnaList: {[k in string]: NavnOgBetegnelse} = {};

  // map of barna ID => { navn: barna name, betegnelse: ytelse }
  (replySed as F002Sed).barn.forEach((b: Barn, i: number) => {
    if (b.motregning && b.motregning.barnetsNavn) {
      barnaList['barn['  + i +  ']'] = {
        navn: b.motregning.barnetsNavn,
        betegnelsePåYtelse: b.motregning.ytelseNavn
      } as NavnOgBetegnelse
    }
  })

  const getBarnIdFromNavn = (barnaNavn: string): string | undefined => {
    return Object.keys(barnaList).find(b => barnaList[b].navn === barnaNavn)
  }

  const _navnOgBetegnelse = Object.values(barnaList).sort((a, b) => a.navn.localeCompare(b.navn))

  // toggle between motregning for barna, and motregning for familie
  const [_barnaEllerFamilie, _setBarnaEllerFamilie] = useState<BarnaEllerFamilie>('barna')

  const currentMotregning = () => {
    if (_barnaEllerFamilie === 'barna') {
      let isThereBarna = Object.keys(barnaList).length > 0
      let motregningTemplate: IMotregning = {} as any
      if (isThereBarna) {
        let firstBarnaKey = Object.keys(barnaList)[0]
        motregningTemplate = _.get(replySed, `${firstBarnaKey}.motregning`)
      }
      return motregningTemplate
    }
    if (_barnaEllerFamilie === 'familie') {
      return _.get(replySed, `familie.motregning`) ?? {}
    }
  }

  const [_newNavn, _setNewNavn] = useState<string | undefined>(undefined)
  const [_newBetegnelse, _setNewBetegnelse] = useState<string | undefined>(undefined)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<NavnOgBetegnelse>(
    (nob: NavnOgBetegnelse): string => nob.navn)

  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationMotregningNavnOgBetegnelserProps>({}, validateMotregningNavnOgBetegnelser)

  const setSvarTyoe = (newSvarType: AnmodningSvarType) => {
    let newReplySed = _.cloneDeep(replySed)
    if (_barnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      Object.keys(barnaList).forEach(barnKey => {
        _.set(newReplySed, `${barnKey}.motregning.svarType`, newSvarType)
      })
    }
    if (_barnaEllerFamilie === 'famile' as BarnaEllerFamilie) {
      _.set(newReplySed, `familie.motregning.svarType`, newSvarType)
    }

    dispatch(setReplySed(newReplySed))
    if (validation[namespace + '-svarType']) {
      dispatch(resetValidation(namespace + '-svarType'))
    }
  }

  const setBarnaEllerFamilie = (newBarnaEllerFamilie: BarnaEllerFamilie) => {

    let newReplySed = _.cloneDeep(replySed)
    let _motregning = currentMotregning()

    if (newBarnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      newReplySed.barn.forEach((i: number) => {
        newReplySed.barn[i].motregning = _.cloneDeep(_motregning)
      })
    }
    if (newBarnaEllerFamilie === 'famile' as BarnaEllerFamilie) {
      delete _motregning.barnetsNavn
      delete _motregning.ytelseNavn
      if (_.isNil(newReplySed.familie)) {
        newReplySed.familie = {}
      }
      newReplySed.familie.motregning = _motregning
    }
    dispatch(setReplySed(newReplySed))
    _setBarnaEllerFamilie(newBarnaEllerFamilie)
  }

  const setNavn = (newNavn: string, index: number, oldNavn: string | undefined) => {
    if (index < 0) {
      _setNewNavn(newNavn)
      _resetValidation(namespace + '-navnOgBetegnelser-navn')
    } else {
      let newReplySed: ReplySed = _.cloneDeep(replySed)
      const oldBarnId: string | undefined = getBarnIdFromNavn(oldNavn!)
      const newBarnId: string | undefined = getBarnIdFromNavn(newNavn!)
      let motRegningToMove: IMotregning = _.get(newReplySed, `${oldBarnId}.motregning`)
      motRegningToMove.barnetsNavn = newNavn
      _.set(newReplySed, `${newBarnId}.motregning`, motRegningToMove)
      // @ts-ignore
      delete newReplySed[oldBarnId!].motregning

      dispatch(setReplySed(newReplySed))
      if (validation[namespace + '-navnOgBetegnelser' + getIdx(index) + '-navn']) {
        dispatch(resetValidation(namespace + '-navnOgBetegnelser' + getIdx(index) + '-navn'))
      }
    }
  }

  const setBetegnelse = (newBetegnelse: string, index: number) => {
    if (index < 0) {
      _setNewBetegnelse(newBetegnelse)
      _resetValidation(namespace + '-navnOgBetegnelser-betegnelse')
    } else {
      const navn = _navnOgBetegnelse[index].navn
      const barnId: string | undefined = getBarnIdFromNavn(navn!)
      dispatch(updateReplySed(`${barnId}.motregning.ytelseNavn`, newBetegnelse.trim()))
      if (validation[namespace + '-navnOgBetegnelser' + getIdx(index) + 'betegnelse']) {
        dispatch(resetValidation(namespace + '-navnOgBetegnelser' + getIdx(index) + 'betegnelse'))
      }
    }
  }

  const setBeløp = (newBeløp: string) => {
    let newReplySed = _.cloneDeep(replySed)
    if (_barnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      Object.keys(barnaList).forEach(barnaKey => {
         _.set(newReplySed, `${barnaKey}.motregning.beloep`, newBeløp.trim())
        dispatch(setReplySed(newReplySed))
      })
    }
    if (_barnaEllerFamilie === 'familie' as BarnaEllerFamilie) {
      dispatch(updateReplySed( `familie.motregning.beloep`, newBeløp.trim()))
    }
    if (validation[namespace + '-beloep']) {
      dispatch(resetValidation(namespace + '-beloep'))
    }
  }

  const setValuta = (newValuta: Currency) => {
    let newReplySed = _.cloneDeep(replySed)
    if (_barnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      Object.keys(barnaList).forEach(barnaKey => {
        _.set(newReplySed, `${barnaKey}.motregning.valuta`, newValuta?.value)
        dispatch(setReplySed(newReplySed))
      })
    }
    if (_barnaEllerFamilie === 'familie' as BarnaEllerFamilie) {
      dispatch(updateReplySed( `familie.motregning.valuta`,newValuta?.value))
    }
    if (validation[namespace + '-valuta']) {
      dispatch(resetValidation(namespace + '-valuta'))
    }
  }

  const setStartDato = (newDato: string) => {
    let newReplySed = _.cloneDeep(replySed)
    if (_barnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      Object.keys(barnaList).forEach(barnaKey => {
        _.set(newReplySed, `${barnaKey}.motregning.startdato`, newDato.trim())
        dispatch(setReplySed(newReplySed))
      })
    }
    if (_barnaEllerFamilie === 'familie' as BarnaEllerFamilie) {
      dispatch(updateReplySed( `familie.motregning.startdato`, newDato.trim()))
    }
    if (validation[namespace + '-startdato']) {
      dispatch(resetValidation(namespace + '-startdato'))
    }
  }

  const setSluttDato = (newDato: string) => {
    let newReplySed = _.cloneDeep(replySed)
    if (_barnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      Object.keys(barnaList).forEach(barnaKey => {
        _.set(newReplySed, `${barnaKey}.motregning.sluttdato`, newDato.trim())
        dispatch(setReplySed(newReplySed))
      })
    }
    if (_barnaEllerFamilie === 'familie' as BarnaEllerFamilie) {
      dispatch(updateReplySed( `familie.motregning.sluttdato`, newDato.trim()))
    }
    if (validation[namespace + '-sluttdato']) {
      dispatch(resetValidation(namespace + '-sluttdato'))
    }
  }

  const setVedtaksDato = (newDato: string) => {
    let newReplySed = _.cloneDeep(replySed)
    if (_barnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      Object.keys(barnaList).forEach(barnaKey => {
        _.set(newReplySed, `${barnaKey}.motregning.vedtaksdato`, newDato.trim())
        dispatch(setReplySed(newReplySed))
      })
    }
    if (_barnaEllerFamilie === 'familie' as BarnaEllerFamilie) {
      dispatch(updateReplySed( `familie.motregning.vedtaksdato`, newDato.trim()))
    }
    if (validation[namespace + '-vedtaksdato']) {
      dispatch(resetValidation(namespace + '-vedtaksdato'))
    }
  }

  const setUtbetalingshyppighet = (newUtbetalingshyppighet: string) => {
    let newReplySed = _.cloneDeep(replySed)
    if (_barnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      Object.keys(barnaList).forEach(barnaKey => {
        _.set(newReplySed, `${barnaKey}.motregning.utbetalingshyppighet`, newUtbetalingshyppighet.trim())
        dispatch(setReplySed(newReplySed))
      })
    }
    if (_barnaEllerFamilie === 'familie' as BarnaEllerFamilie) {
      dispatch(updateReplySed( `familie.motregning.utbetalingshyppighet`, newUtbetalingshyppighet.trim()))
    }
    if (validation[namespace + '-utbetalingshyppighet']) {
      dispatch(resetValidation(namespace + '-utbetalingshyppighet'))
    }
  }

  const setMottakersNavn = (mottakersNavn: string) => {
    let newReplySed = _.cloneDeep(replySed)
    if (_barnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      Object.keys(barnaList).forEach(barnaKey => {
        _.set(newReplySed, `${barnaKey}.motregning.mottakersNavn`, mottakersNavn.trim())
        dispatch(setReplySed(newReplySed))
      })
    }
    if (_barnaEllerFamilie === 'familie' as BarnaEllerFamilie) {
      dispatch(updateReplySed( `familie.motregning.mottakersNavn`, mottakersNavn.trim()))
    }
    if (validation[namespace + '-mottakersNavn']) {
      dispatch(resetValidation(namespace + '-mottakersNavn'))
    }
  }

  const setBegrunnelse = (newBegrunnelse: string) => {
    let newReplySed = _.cloneDeep(replySed)
    if (_barnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      Object.keys(barnaList).forEach(barnaKey => {
        _.set(newReplySed, `${barnaKey}.motregning.begrunnelse`, newBegrunnelse.trim())
        dispatch(setReplySed(newReplySed))
      })
    }
    if (_barnaEllerFamilie === 'familie' as BarnaEllerFamilie) {
      dispatch(updateReplySed( `familie.motregning.begrunnelse`, newBegrunnelse.trim()))
    }
    if (validation[namespace + '-begrunnelse']) {
      dispatch(resetValidation(namespace + '-begrunnelse'))
    }
  }

  const setYtterligereInfo = (newYtterligereInfo: string) => {
    let newReplySed = _.cloneDeep(replySed)
    if (_barnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      Object.keys(barnaList).forEach(barnaKey => {
        _.set(newReplySed, `${barnaKey}.motregning.ytterligereInfo`, newYtterligereInfo.trim())
        dispatch(setReplySed(newReplySed))
      })
    }
    if (_barnaEllerFamilie === 'familie' as BarnaEllerFamilie) {
      dispatch(updateReplySed( `familie.motregning.ytterligereInfo`, newYtterligereInfo.trim()))
    }
    if (validation[namespace + '-ytterligereInfo']) {
      dispatch(resetValidation(namespace + '-ytterligereInfo'))
    }
  }

  const resetForm = () => {
    _setNewNavn('')
    _setNewBetegnelse('')
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }



  const onRemove = (index: number) => {
    let newReplySed: ReplySed = _.cloneDeep(replySed)
    const barnId: string | undefined = getBarnIdFromNavn(_navnOgBetegnelse[index].navn)
    removeFromDeletion(_navnOgBetegnelse[index])
    // @ts-ignore
    delete newReplySed[barnId!].motregning
    dispatch(setReplySed(newReplySed))
  }

  const onAdd = () => {

    const newNavOgBetegnelse: NavnOgBetegnelse | any = {
      navn: _newNavn?.trim(),
      betegnelsePåYtelse: _newBetegnelse?.trim()
    }

    const valid: boolean = performValidation({
      navnOgBetegnelse: newNavOgBetegnelse,
      namespace: namespace
    })

    if (valid) {

      // get a motregning template from either barn or familie
      let newMotregning: IMotregning | undefined = undefined
      let barnId: string = getBarnIdFromNavn(_newNavn!) as string

      Object.keys(barnaList).forEach(barnKey => {
        let m: IMotregning = _.get(replySed, `${barnKey}.motregning`)
        if (!_.isEmpty(m)) {
          newMotregning = m
        }
      })
      if (_.isNil(newMotregning)) {
        newMotregning = _.get(replySed, `familie.motregning`)
      }
      if (_.isNil(newMotregning)) {
        newMotregning = {} as any
      }

      newMotregning!.barnetsNavn = newNavOgBetegnelse.navn
      newMotregning!.ytelseNavn = newNavOgBetegnelse.betegnelsePåYtelse

      dispatch(updateReplySed(`${barnId}.motregning`, newMotregning))
      resetForm()
    }
  }

  const renderRowOfNavnOgBetegnelse = (nob: NavnOgBetegnelse | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(nob)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-navnOgBetegnelser' + idx + '-' + el]?.feilmelding
        : validation[namespace + '-navnOgBetegnelser' + idx + '-' + el]?.feilmelding
    )
    return (
      <>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.1) + 's' }}
        >
          <Column>
            <Input
              feil={getErrorFor(index, 'navn')}
              namespace={namespace + '-navnOgBetegnelser' + idx}
              id='navn'
              label={t('label:barnets-navn') + ' *'}
              onChanged={(value: string) => setNavn(value, index, nob?.navn)}
              value={index < 0 ? _newNavn : nob?.navn}
            />
          </Column>
          <Column>
            <Input
              feil={getErrorFor(index, 'betegnelsePåYtelse')}
              namespace={namespace + '-navnOgBetegnelser' + idx}
              id='betegnelsePåYtelse'
              label={t('label:betegnelse-på-ytelse') + ' *'}
              onChanged={(value: string) => setBetegnelse(value, index)}
              value={index < 0 ? _newBetegnelse : nob?.betegnelsePåYtelse}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(nob)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(nob)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </>
    )
  }

  return (
    <PaddedDiv>
      <Undertittel>
        {t('label:motregning')}
      </Undertittel>
      <VerticalSeparatorDiv size='2' />

      <HighContrastRadioPanelGroup
        checked={_barnaEllerFamilie}
        data-no-border
        data-test-id={namespace + '-barnaEllerFamilie'}
        feil={validation[namespace + '-barnaEllerFamilie']?.feilmelding}
        id={namespace + '-barnaEllerFamilie'}
        key={namespace + '-barnaEllerFamilie-' + _barnaEllerFamilie}
        legend={t('label:barna-or-familie') + ' *'}
        name={namespace + '-barnaEllerFamilie'}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBarnaEllerFamilie(e.target.value as BarnaEllerFamilie)}
        radios={[
          { label: t('label:barn'), value: 'barna' },
          { label: t('label:familien'), value: 'familie' }
        ]}
      />
      <VerticalSeparatorDiv size='2' />
      <HighContrastRadioPanelGroup
        checked={currentMotregning()?.svarType}
        data-multiple-line
        data-no-border
        data-test-id={namespace + '-svarType'}
        feil={validation[namespace + '-svarType']?.feilmelding}
        id={namespace + '-svarType'}
        legend={t('label:anmodning-om-motregning')}
        name={namespace + '-svarType'}
        radios={[
          { label: t('label:anmodning-om-motregning-barn'), value: 'anmodning_om_motregning_per_barn' },
          { label: t('label:anmodning-om-motregning-svar-barn'), value: 'svar_på_anmodning_om_motregning_per_barn' }
        ]}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSvarTyoe(e.target.value as AnmodningSvarType)}
      />
      <VerticalSeparatorDiv />
      {_barnaEllerFamilie === 'barna' && (
        <>
        {_navnOgBetegnelse?.map(renderRowOfNavnOgBetegnelse)}
        <HorizontalLineSeparator />
        <VerticalSeparatorDiv />
        {_seeNewForm
          ? renderRowOfNavnOgBetegnelse(null, -1)
          : (
            <Row className='slideInFromLeft'>
              <Column>
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={() => _setSeeNewForm(true)}
                >
                  <Add />
                  <HorizontalSeparatorDiv size='0.5' />
                  {t('el:button-add-new-x', { x: t('label:barn').toLowerCase() })}
                </HighContrastFlatknapp>
              </Column>
            </Row>
            )
        }
        </>
      )}
      <VerticalSeparatorDiv size='2' />
      <UndertekstBold>
        {t('label:informasjon-om-familieytelser')}
      </UndertekstBold>
      <VerticalSeparatorDiv />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: '0.1s' }}
      >
        <Column>
          <DateInput
            feil={validation[namespace + '-vedtaksdato']?.feilmelding}
            namespace={namespace}
            id='vedtaksdato'
            key={namespace + '-vedtaksdato-' + currentMotregning().vedtaksdato}
            label={t('label:vedtaksdato') + ' *'}
            onChanged={setVedtaksDato}
            required
            value={currentMotregning().vedtaksdato}
          />
        </Column>
      </AlignStartRow>
      <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: '0.1s' }}
        >
        <Column>
          <Input
            feil={validation[namespace + '-beloep']?.feilmelding}
            namespace={namespace}
            id='beloep'
            label={t('label:beløp') + ' *'}
            onChanged={setBeløp}
            value={currentMotregning().beloep}
          />
        </Column>
        <Column>
          <CountrySelect
            key={_currencyData.findByValue(currentMotregning()?.valuta ?? '')}
            closeMenuOnSelect
            ariaLabel={t('label:valuta')}
            data-test-id={namespace + '-valuta'}
            error={validation[namespace + '-valuta']?.feilmelding}
            highContrast={highContrast}
            id={namespace + '-valuta'}
            label={t('label:valuta') + ' *'}
            locale='nb'
            menuPortalTarget={document.body}
            onOptionSelected={setValuta}
            type='currency'
            values={_currencyData.findByValue(currentMotregning()?.valuta ?? '')}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: '0.2s' }}
      >
        <Period
          key={'' + currentMotregning()?.startdato + currentMotregning()?.sluttdato}
          namespace={namespace}
          errorStartDato={validation[namespace + '-startdato']?.feilmelding}
          errorSluttDato={validation[namespace + '-startdato']?.feilmelding}
          labelStartDato={t('label:startdato') + ' (' + t('label:innvilgelse').toLowerCase() + ')'}
          labelSluttDato={t('label:sluttdato') + ' (' + t('label:innvilgelse').toLowerCase() + ')'}
          setStartDato={setStartDato}
          setSluttDato={setSluttDato}
          valueStartDato={currentMotregning()?.startdato}
          valueSluttDato={currentMotregning()?.sluttdato}
        />
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: '0.3s' }}
      >
        <Column flex='2'>
          <HighContrastRadioPanelGroup
            checked={currentMotregning()?.utbetalingshyppighet}
            data-no-border
            data-test-id={namespace + '-utbetalingshyppighet'}
            id={namespace + '-utbetalingshyppighet'}
            feil={validation[namespace + '-utbetalingshyppighet']?.feilmelding}
            name={namespace + '-utbetalingshyppighet'}
            legend={t('label:periode-avgrensing') + ' *'}
            radios={[
              { label: t('label:månedlig'), value: 'Månedlig' },
              { label: t('label:årlig'), value: 'Årlig' }
            ]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUtbetalingshyppighet(e.target.value as Utbetalingshyppighet)}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: '0.4s' }}
      >
        <Column flex='2'>
          <Input
            feil={validation[namespace + '-mottakersNavn']?.feilmelding}
            namespace={namespace}
            id='mottakersNavn'
            label={t('label:mottakers-navn') + ' *'}
            onChanged={setMottakersNavn}
            value={currentMotregning()?.mottakersNavn}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: '0.5s' }}
      >
        <Column flex='2'>
          <TextAreaDiv>
            <TextArea
              feil={validation[namespace + '-begrunnelse']?.feilmelding}
              namespace={namespace}
              id='begrunnelse'
              label={t('label:anmodning-grunner')}
              onChanged={setBegrunnelse}
              value={currentMotregning()?.begrunnelse}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: '0.5s' }}
      >
        <Column flex='2'>
          <TextAreaDiv>
            <TextArea
              feil={validation[namespace + '-ytterligereInfo']?.feilmelding}
              namespace={namespace}
              id='ytterligereInfo'
              label={t('label:ytterligere-informasjon')}
              onChanged={setYtterligereInfo}
              value={currentMotregning()?.ytterligereInfo}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column>
          <HighContrastFlatknapp
            mini kompakt
            onClick={() => seeKontoopplysninger()}
          >
            {t('label:oppgi-kontoopplysninger')}
          </HighContrastFlatknapp>
        </Column>
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default Motregning
