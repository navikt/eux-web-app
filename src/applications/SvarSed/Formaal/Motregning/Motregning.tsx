import { setReplySed, updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { FormålManagerFormProps, FormålManagerFormSelector } from 'applications/SvarSed/Formaal/FormålManager'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import DateInput from 'components/Forms/DateInput'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import TextArea from 'components/Forms/TextArea'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { HorizontalLineSeparator, RepeatableRow, TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import {
  AnmodningSvarType,
  Barn,
  BarnaEllerFamilie,
  F002Sed,
  Motregning as IMotregning,
  NavnOgBetegnelse, Periode, ReplySed, Utbetalingshyppighet
} from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import CountryData, { Currency } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Normaltekst, UndertekstBold, Undertittel } from 'nav-frontend-typografi'
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
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { OptionTypeBase } from 'react-select'
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

  const [_newNavn, _setNewNavn] = useState<string | undefined>(undefined)
  const [_newBetegnelse, _setNewBetegnelse] = useState<string | undefined>(undefined)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<NavnOgBetegnelse>(
    (nob: NavnOgBetegnelse): string => nob.navn)

  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationMotregningNavnOgBetegnelserProps>({}, validateMotregningNavnOgBetegnelser)

  const [_barnaList, _setBarnaList] = useState<{[k in string]: NavnOgBetegnelse}>({})
  const [_barnaNameKeys, _setBarnaNameKeys] = useState<{[k in string]: any}>({})
  const [_navnOgBetegnelse, _setNavnOgBetegnelse] = useState<Array<NavnOgBetegnelse>>([])
  // toggle between motregning for barna, and motregning for familie
  const [_barnaEllerFamilie, _setBarnaEllerFamilie] = useState<BarnaEllerFamilie>(() => {
    if (!_.isEmpty(replySed?.familie?.motregning)) {
      return 'familie'
    }
    return 'barna'
  })

  useEffect(() => {
    // map of barna ID => { navn: barna name, betegnelse: ytelse }
    const newBarnaList: {[k in string]: NavnOgBetegnelse} = {}
    const newBarnaNameKeys: {[k in string]: any} = {}
    let newNavnOgBetegnelse = [];

    (replySed as F002Sed).barn.forEach((b: Barn, i: number) => {
      const name = b.personInfo.fornavn + ' ' + b.personInfo.etternavn
      newBarnaNameKeys[name] = {
        key: 'barn[' + i + ']',
        id: i
      }

      if (b.motregning && b.motregning.barnetsNavn) {
        newBarnaList[name] = {
          navn: name, // b.motregning.barnetsNavn may be wrong
          betegnelsePåYtelse: b.motregning.ytelseNavn
        } as NavnOgBetegnelse
      }
    })

    newNavnOgBetegnelse = Object.values(newBarnaList).sort((a, b) => a.navn.localeCompare(b.navn))
    _setBarnaList(newBarnaList)
    _setBarnaNameKeys(newBarnaNameKeys)
    _setNavnOgBetegnelse(newNavnOgBetegnelse)
  }, [replySed])

  const currentMotregning = () => {
    if (_barnaEllerFamilie === 'barna') {
      const isThereBarna = Object.keys(_barnaList).length > 0
      let motregningTemplate: IMotregning = {} as any
      if (isThereBarna) {
        const firstBarnaName = Object.keys(_barnaList)[0]
        motregningTemplate = _.get(replySed, `${_barnaNameKeys[firstBarnaName].key}.motregning`) ?? {}
      }
      return motregningTemplate
    }
    if (_barnaEllerFamilie === 'familie') {
      const motregningTemplate = _.get(replySed, 'familie.motregning') ?? {}
      return motregningTemplate
    }
    return {}
  }

  const setSvarType = (newSvarType: AnmodningSvarType) => {
    const newReplySed = _.cloneDeep(replySed)
    if (_barnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      Object.keys(_barnaList).forEach(barnName => {
        _.set(newReplySed, `${_barnaNameKeys[barnName].key}.motregning.svarType`, newSvarType)
      })
    }
    if (_barnaEllerFamilie === 'familie' as BarnaEllerFamilie) {
      _.set(newReplySed, 'familie.motregning.svarType', newSvarType)
    }

    dispatch(setReplySed(newReplySed))
    if (validation[namespace + '-svarType']) {
      dispatch(resetValidation(namespace + '-svarType'))
    }
  }

  const setBarnaEllerFamilie = (newBarnaEllerFamilie: BarnaEllerFamilie) => {
    const newReplySed = _.cloneDeep(replySed)
    const _motregning = currentMotregning()

    if (newBarnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      newReplySed.barn.forEach((b: Barn, i: number) => {
        newReplySed.barn[i].motregning = _.cloneDeep(_motregning)
        newReplySed.barn[i].motregning.barnetsNavn = b.personInfo.fornavn + ' ' + b.personInfo.etternavn
      })
      delete newReplySed.familie.motregning
    }
    if (newBarnaEllerFamilie === 'familie' as BarnaEllerFamilie) {
      delete _motregning.barnetsNavn
      delete _motregning.ytelseNavn
      if (_.isNil(newReplySed.familie)) {
        newReplySed.familie = {}
      }
      newReplySed.familie.motregning = _motregning
      newReplySed.barn.forEach((b: Barn, i: number) => {
        delete newReplySed.barn[i].motregning
      })
    }
    dispatch(setReplySed(newReplySed))
    _setBarnaEllerFamilie(newBarnaEllerFamilie)
  }

  const setNavn = (newNavn: string, index: number, oldNavn: string | undefined) => {
    if (index < 0) {
      _setNewNavn(newNavn)
      _resetValidation(namespace + '-navnOgBetegnelser-navn')
    } else {
      const newReplySed: ReplySed = _.cloneDeep(replySed)

      const motRegningToMove: IMotregning = _.get(newReplySed, `${_barnaNameKeys[oldNavn!].key}.motregning`)
      motRegningToMove.barnetsNavn = newNavn
      _.set(newReplySed, `${_barnaNameKeys[newNavn!].key}.motregning`, motRegningToMove)
      // @ts-ignore
      delete newReplySed.barn[_barnaNameKeys[oldNavn!].id].motregning

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
      dispatch(updateReplySed(`${_barnaNameKeys[navn!].key}.motregning.ytelseNavn`, newBetegnelse.trim()))
      if (validation[namespace + '-navnOgBetegnelser' + getIdx(index) + 'betegnelse']) {
        dispatch(resetValidation(namespace + '-navnOgBetegnelser' + getIdx(index) + 'betegnelse'))
      }
    }
  }

  const setBeløp = (newBeløp: string) => {
    const newReplySed = _.cloneDeep(replySed)
    if (_barnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      Object.keys(_barnaList).forEach(barnaName => {
        _.set(newReplySed, `${_barnaNameKeys[barnaName].key}.motregning.beloep`, newBeløp.trim())
        const valuta = _.get(newReplySed, `${_barnaNameKeys[barnaName].key}.motregning.valuta`)
        if (_.isNil(valuta)) {
          _.set(newReplySed, `${_barnaNameKeys[barnaName].key}.motregning.valuta`, 'NOK')
        }
        dispatch(setReplySed(newReplySed))
      })
    }
    if (_barnaEllerFamilie === 'familie' as BarnaEllerFamilie) {
      dispatch(updateReplySed('familie.motregning.beloep', newBeløp.trim()))
      if (_.isNil(replySed.familie.motregning.valuta)) {
        setValuta({ value: 'NOK' } as Currency)
      }
    }
    if (validation[namespace + '-beloep']) {
      dispatch(resetValidation(namespace + '-beloep'))
    }
  }

  const setValuta = (newValuta: Currency) => {
    const newReplySed = _.cloneDeep(replySed)
    if (_barnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      Object.keys(_barnaList).forEach(barnaName => {
        _.set(newReplySed, `${_barnaNameKeys[barnaName].key}.motregning.valuta`, newValuta?.value)
        dispatch(setReplySed(newReplySed))
      })
    }
    if (_barnaEllerFamilie === 'familie' as BarnaEllerFamilie) {
      dispatch(updateReplySed('familie.motregning.valuta', newValuta?.value))
    }
    if (validation[namespace + '-valuta']) {
      dispatch(resetValidation(namespace + '-valuta'))
    }
  }

  const setPeriode = (periode: Periode) => {
    const newReplySed = _.cloneDeep(replySed)
    if (_barnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      Object.keys(_barnaList).forEach(barnaName => {
        _.set(newReplySed, `${_barnaNameKeys[barnaName].key}.motregning.startdato`, periode.startdato)
        _.set(newReplySed, `${_barnaNameKeys[barnaName].key}.motregning.sluttdato`, periode.sluttdato)
        dispatch(setReplySed(newReplySed))
      })
    }
    if (_barnaEllerFamilie === 'familie' as BarnaEllerFamilie) {
      _.set(newReplySed, 'familie.motregning.startdato', periode.startdato)
      _.set(newReplySed, 'familie.motregning.sluttdato', periode.sluttdato)
      dispatch(setReplySed(newReplySed))
    }
    if (validation[namespace + '-startdato']) {
      dispatch(resetValidation(namespace + '-startdato'))
    }
    if (validation[namespace + '-sluttdato']) {
      dispatch(resetValidation(namespace + '-sluttdato'))
    }
  }

  const setVedtaksDato = (newDato: string) => {
    const newReplySed = _.cloneDeep(replySed)
    if (_barnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      Object.keys(_barnaList).forEach(barnaName => {
        _.set(newReplySed, `${_barnaNameKeys[barnaName].key}.motregning.vedtaksdato`, newDato.trim())
        dispatch(setReplySed(newReplySed))
      })
    }
    if (_barnaEllerFamilie === 'familie' as BarnaEllerFamilie) {
      dispatch(updateReplySed('familie.motregning.vedtaksdato', newDato.trim()))
    }
    if (validation[namespace + '-vedtaksdato']) {
      dispatch(resetValidation(namespace + '-vedtaksdato'))
    }
  }

  const setUtbetalingshyppighet = (newUtbetalingshyppighet: string) => {
    const newReplySed = _.cloneDeep(replySed)
    if (_barnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      Object.keys(_barnaList).forEach(barnaName => {
        _.set(newReplySed, `${_barnaNameKeys[barnaName].key}.motregning.utbetalingshyppighet`, newUtbetalingshyppighet.trim())
        dispatch(setReplySed(newReplySed))
      })
    }
    if (_barnaEllerFamilie === 'familie' as BarnaEllerFamilie) {
      dispatch(updateReplySed('familie.motregning.utbetalingshyppighet', newUtbetalingshyppighet.trim()))
    }
    if (validation[namespace + '-utbetalingshyppighet']) {
      dispatch(resetValidation(namespace + '-utbetalingshyppighet'))
    }
  }

  const setMottakersNavn = (mottakersNavn: string) => {
    const newReplySed = _.cloneDeep(replySed)
    if (_barnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      Object.keys(_barnaList).forEach(barnaName => {
        _.set(newReplySed, `${_barnaNameKeys[barnaName].key}.motregning.mottakersNavn`, mottakersNavn.trim())
        dispatch(setReplySed(newReplySed))
      })
    }
    if (_barnaEllerFamilie === 'familie' as BarnaEllerFamilie) {
      dispatch(updateReplySed('familie.motregning.mottakersNavn', mottakersNavn.trim()))
    }
    if (validation[namespace + '-mottakersNavn']) {
      dispatch(resetValidation(namespace + '-mottakersNavn'))
    }
  }

  const setBegrunnelse = (newBegrunnelse: string) => {
    const newReplySed = _.cloneDeep(replySed)
    if (_barnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      Object.keys(_barnaList).forEach(barnaName => {
        _.set(newReplySed, `${_barnaNameKeys[barnaName].key}.motregning.begrunnelse`, newBegrunnelse.trim())
        dispatch(setReplySed(newReplySed))
      })
    }
    if (_barnaEllerFamilie === 'familie' as BarnaEllerFamilie) {
      dispatch(updateReplySed('familie.motregning.begrunnelse', newBegrunnelse.trim()))
    }
    if (validation[namespace + '-begrunnelse']) {
      dispatch(resetValidation(namespace + '-begrunnelse'))
    }
  }

  const setYtterligereInfo = (newYtterligereInfo: string) => {
    const newReplySed = _.cloneDeep(replySed)
    if (_barnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      Object.keys(_barnaList).forEach(barnaName => {
        _.set(newReplySed, `${_barnaNameKeys[barnaName].key}.motregning.ytterligereInfo`, newYtterligereInfo.trim())
        dispatch(setReplySed(newReplySed))
      })
    }
    if (_barnaEllerFamilie === 'familie' as BarnaEllerFamilie) {
      dispatch(updateReplySed('familie.motregning.ytterligereInfo', newYtterligereInfo.trim()))
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
    const newReplySed: ReplySed = _.cloneDeep(replySed)
    const navn = _navnOgBetegnelse[index].navn
    removeFromDeletion(_navnOgBetegnelse[index])
    // @ts-ignore
    delete newReplySed.barn[_barnaNameKeys[navn].id].motregning
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
      let newMotregning: IMotregning | undefined

      Object.keys(_barnaList).forEach(barnName => {
        const m: IMotregning = _.get(replySed, `${_barnaNameKeys[barnName].key}.motregning`)
        if (!_.isEmpty(m)) {
          newMotregning = m
        }
      })
      if (_.isNil(newMotregning)) {
        newMotregning = _.get(replySed, 'familie.motregning')
      }
      if (_.isNil(newMotregning)) {
        newMotregning = {} as any
      }

      newMotregning!.barnetsNavn = newNavOgBetegnelse.navn
      newMotregning!.ytelseNavn = newNavOgBetegnelse.betegnelsePåYtelse

      dispatch(updateReplySed(`${_barnaNameKeys[_newNavn!].key}.motregning`, newMotregning))
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

    const allNames: Array<string> = replySed.barn?.map((b: Barn) => b.personInfo.fornavn + ' ' + b.personInfo.etternavn) ?? []
    const selectedNames: Array<string> = _navnOgBetegnelse.map(n => n.navn)
    const allNameOptions = allNames.map(n => ({
      label: n,
      value: n,
      isDisabled: selectedNames.indexOf(n) >= 0
    }))

    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.1) + 's' }}
        >
          <Column>
            <Select
              closeMenuOnSelect
              data-test-id={namespace + '-navn'}
              feil={getErrorFor(index, 'navn')}
              highContrast={highContrast}
              id={namespace + '-navn'}
              key={namespace + '-navn-' + (index < 0 ? _newNavn : nob?.navn)}
              label={t('label:barnets-navn') + ' *'}
              menuPortalTarget={document.body}
              onChange={(e: OptionTypeBase) => setNavn(e.value, index, nob?.navn)}
              options={allNameOptions}
              placeholder={t('el:placeholder-select-default')}
              selectedValue={_.find(allNameOptions, b => b.value === (index < 0 ? _newNavn : nob?.navn))}
              defaultValue={_.find(allNameOptions, b => b.value === (index < 0 ? _newNavn : nob?.navn))}
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
      </RepeatableRow>
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSvarType(e.target.value as AnmodningSvarType)}
      />
      <VerticalSeparatorDiv />
      {_barnaEllerFamilie === 'barna' && (
        <>
          {_.isEmpty(_navnOgBetegnelse)
            ? (
              <Normaltekst>
                {t('message:warning-no-barn')}
              </Normaltekst>
              )
            : _navnOgBetegnelse?.map(renderRowOfNavnOgBetegnelse)}
          <VerticalSeparatorDiv size='2' />
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
              )}
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
        <Column flex='2' />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: '0.1s' }}
      >
        <Column>
          <Input
            feil={validation[namespace + '-beloep']?.feilmelding}
            namespace={namespace}
            id='beloep'
            key={'beloep-' + currentMotregning().beloep}
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
        <PeriodeInput
          key={'' + currentMotregning()?.startdato + currentMotregning()?.sluttdato}
          namespace={namespace}
          error={{
            startdato: validation[namespace + '-startdato']?.feilmelding,
            sluttdato: validation[namespace + '-startdato']?.feilmelding
          }}
          label={{
            startdato: t('label:startdato') + ' (' + t('label:innvilgelse').toLowerCase() + ')',
            sluttdato: t('label:sluttdato') + ' (' + t('label:innvilgelse').toLowerCase() + ')'
          }}
          periodeType='simple'
          setPeriode={setPeriode}
          value={currentMotregning()}
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
