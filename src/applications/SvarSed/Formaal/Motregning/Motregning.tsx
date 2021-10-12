import { setReplySed, updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { FormålManagerFormProps, FormålManagerFormSelector, mapState } from 'applications/SvarSed/Formaal/FormålManager'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import DateInput from 'components/Forms/DateInput'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import Select from 'components/Forms/Select'
import TextArea from 'components/Forms/TextArea'
import { HorizontalLineSeparator, RepeatableRow, TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import {
  AnmodningSvarType,
  Barn,
  BarnaEllerFamilie,
  F002Sed,
  Motregning as IMotregning,
  NavnOgBetegnelse,
  Periode,
  Utbetalingshyppighet
} from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import CountryData, { Currency } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
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
import { getIdx } from 'utils/namespace'
import { validateMotregningNavnOgBetegnelser, ValidationMotregningNavnOgBetegnelserProps } from './validation'

type BarnaList = {[k in string]: NavnOgBetegnelse}
type BarnaNameKeys = {[k in string]: any}

const Motregning: React.FC<FormålManagerFormProps> = ({
  parentNamespace,
  seeKontoopplysninger
}: FormålManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {replySed, validation, highContrast}: FormålManagerFormSelector = useSelector<State, FormålManagerFormSelector>(mapState)
  const dispatch = useDispatch()
  const namespace = `${parentNamespace}-motregning`
  const _currencyData = CountryData.getCurrencyInstance('nb')

  const [_newNavn, _setNewNavn] = useState<string | undefined>(undefined)
  const [_newBetegnelse, _setNewBetegnelse] = useState<string | undefined>(undefined)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<NavnOgBetegnelse>(
    (nob: NavnOgBetegnelse): string => nob.navn)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationMotregningNavnOgBetegnelserProps>({}, validateMotregningNavnOgBetegnelser)

  const [_barnaList, _setBarnaList] = useState<BarnaList>({})
  const [_barnaNameKeys, _setBarnaNameKeys] = useState<BarnaNameKeys>({})
  const [_navnOgBetegnelse, _setNavnOgBetegnelse] = useState<Array<NavnOgBetegnelse>>([])
  // toggle between motregning for barna, and motregning for familie
  const [_barnaEllerFamilie, _setBarnaEllerFamilie] = useState<BarnaEllerFamilie>(() =>
    !_.isEmpty((replySed as F002Sed)?.familie?.motregning) ? 'familie' : 'barna'
  )

  const getPersonName = (b: Barn): string => b.personInfo.fornavn + ' ' + b.personInfo.etternavn

  useEffect(() => {
    // map of barna ID => { navn: barna name, betegnelse: ytelse }
    const newBarnaList: BarnaList = {}
    const newBarnaNameKeys: BarnaNameKeys = {}
    let newNavnOgBetegnelse: Array<NavnOgBetegnelse> = [];

    (replySed as F002Sed).barn?.forEach((barn: Barn, i: number) => {
      const name: string = getPersonName(barn)
      newBarnaNameKeys[name] = {
        key: 'barn[' + i + ']',
        id: i
      }
      if (!_.isEmpty(barn.motregning?.barnetsNavn)) {
        newBarnaList[name] = {
          navn: name, // b.motregning.barnetsNavn may be wrong
          betegnelsePåYtelse: barn.motregning!.ytelseNavn
        } as NavnOgBetegnelse
      }
    })

    newNavnOgBetegnelse = Object.values(newBarnaList).sort((a, b) => a.navn.localeCompare(b.navn))
    _setBarnaList(newBarnaList)
    _setBarnaNameKeys(newBarnaNameKeys)
    _setNavnOgBetegnelse(newNavnOgBetegnelse)
  }, [replySed])

  const currentMotregning = (): IMotregning => {
    let motregningTemplate: IMotregning = {} as IMotregning
    if (_barnaEllerFamilie === 'barna') {
      const isThereBarna = Object.keys(_barnaList).length > 0
      if (isThereBarna) {
        const firstBarnaName = Object.keys(_barnaList)[0]
        motregningTemplate = _.get(replySed, `${_barnaNameKeys[firstBarnaName].key}.motregning`) ?? {}
      }
    } else if (_barnaEllerFamilie === 'familie') {
      motregningTemplate = _.get(replySed, 'familie.motregning') ?? {}
    }
    return motregningTemplate
  }

  const setSvarType = (newSvarType: AnmodningSvarType) => {
    if (_barnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      Object.keys(_barnaList).forEach(barnName =>
        dispatch(updateReplySed(`${_barnaNameKeys[barnName].key}.motregning.svarType`, newSvarType))
      )
    } else if (_barnaEllerFamilie === 'familie' as BarnaEllerFamilie) {
      dispatch(updateReplySed('familie.motregning.svarType', newSvarType))
    }
    if (validation[namespace + '-svarType']) {
      dispatch(resetValidation(namespace + '-svarType'))
    }
  }

  const setBarnaEllerFamilie = (newBarnaEllerFamilie: BarnaEllerFamilie) => {
    const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
    const _motregning: IMotregning = currentMotregning()

    if (newBarnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      newReplySed.barn?.forEach((barn: Barn, i: number) => {
        newReplySed.barn![i].motregning = _.cloneDeep(_motregning)
        newReplySed.barn![i].motregning!.barnetsNavn = getPersonName(barn)
      })
      delete newReplySed.familie?.motregning
    }
    if (newBarnaEllerFamilie === 'familie' as BarnaEllerFamilie) {
      delete _motregning.barnetsNavn
      delete _motregning.ytelseNavn
      _.set(newReplySed, 'familie.motregning', _motregning)
      newReplySed.barn?.forEach((b: Barn, i: number) =>
        delete newReplySed.barn![i].motregning
      )
    }
    _setBarnaEllerFamilie(newBarnaEllerFamilie)
    dispatch(setReplySed(newReplySed))
  }

  const setNavn = (newNavn: string, index: number, oldNavn: string | undefined) => {
    if (index < 0) {
      _setNewNavn(newNavn)
      _resetValidation(namespace + '-navnOgBetegnelser-navn')
    } else {
      const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
      const motRegningToMove: IMotregning = _.get(newReplySed, `${_barnaNameKeys[oldNavn!].key}.motregning`)
      motRegningToMove.barnetsNavn = newNavn
      _.set(newReplySed, `${_barnaNameKeys[newNavn!].key}.motregning`, motRegningToMove)
      delete newReplySed.barn![_barnaNameKeys[oldNavn!].id].motregning
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
      if (validation[namespace + '-navnOgBetegnelser' + getIdx(index) + '-betegnelse']) {
        dispatch(resetValidation(namespace + '-navnOgBetegnelser' + getIdx(index) + '-betegnelse'))
      }
    }
  }

  const setBeløp = (newBeløp: string) => {
    const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
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
      if (_.isNil((replySed as F002Sed).familie?.motregning?.valuta)) {
        setValuta({ value: 'NOK' } as Currency)
      }
    }
    if (validation[namespace + '-beloep']) {
      dispatch(resetValidation(namespace + '-beloep'))
    }
  }

  const setValuta = (newValuta: Currency) => {
    if (_barnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      Object.keys(_barnaList).forEach(barnaName =>
        dispatch(updateReplySed( `${_barnaNameKeys[barnaName].key}.motregning.valuta`, newValuta?.value))
      )
    }
    if (_barnaEllerFamilie === 'familie' as BarnaEllerFamilie) {
      dispatch(updateReplySed('familie.motregning.valuta', newValuta?.value))
    }
    if (validation[namespace + '-valuta']) {
      dispatch(resetValidation(namespace + '-valuta'))
    }
  }

  const setPeriode = (periode: Periode) => {
    const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
    if (_barnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
      Object.keys(_barnaList).forEach(barnaName => {
        _.set(newReplySed, `${_barnaNameKeys[barnaName].key}.motregning.startdato`, periode.startdato)
        _.set(newReplySed, `${_barnaNameKeys[barnaName].key}.motregning.sluttdato`, periode.sluttdato)
      })
      dispatch(setReplySed(newReplySed))
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
    const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
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
    const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
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
    const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
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
    const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
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
    const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
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
    const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
    const navn = _navnOgBetegnelse[index].navn
    removeFromDeletion(_navnOgBetegnelse[index])
    delete newReplySed.barn![_barnaNameKeys[navn].id].motregning
    dispatch(setReplySed(newReplySed))
    standardLogger('svarsed.editor.motregning.remove')
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
      Object.keys(_barnaList).forEach(barnName => {
        const m: IMotregning | undefined = _.get(replySed, `${_barnaNameKeys[barnName].key}.motregning`)
        if (!_.isEmpty(m)) {
          newMotregning = m
        }
      })
      if (_.isNil(newMotregning)) {
        newMotregning = _.get(replySed, 'familie.motregning')
      }
      if (_.isNil(newMotregning)) {
        newMotregning = {} as IMotregning
      }

      newMotregning!.barnetsNavn = newNavOgBetegnelse.navn
      newMotregning!.ytelseNavn = newNavOgBetegnelse.betegnelsePåYtelse

      dispatch(updateReplySed(`${_barnaNameKeys[_newNavn!].key}.motregning`, newMotregning))
      standardLogger('svarsed.editor.motregning.add')
      resetForm()
    }
  }

  const renderRowOfNavnOgBetegnelse = (nob: NavnOgBetegnelse | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(nob)
    const idx = getIdx(index)
    const getErrorFor = (el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-navnOgBetegnelser' + idx + '-' + el]?.feilmelding
        : validation[namespace + '-navnOgBetegnelser' + idx + '-' + el]?.feilmelding
    )

    const allNames: Array<string> = (replySed as F002Sed).barn?.map(getPersonName) ?? []
    const selectedNames: Array<string> = _navnOgBetegnelse.map(n => n.navn)
    const allNameOptions = allNames.map(name => ({
      label: name,
      value: name,
      isDisabled: selectedNames.indexOf(name) >= 0
    }))

    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.05) + 's' }}
        >
          <Column>
            <Select
              closeMenuOnSelect
              data-test-id={namespace + '-navn'}
              feil={getErrorFor('navn')}
              highContrast={highContrast}
              id={namespace + '-navn'}
              key={namespace + '-navn-' + (index < 0 ? _newNavn : nob?.navn)}
              label={t('label:barnets-navn') + ' *'}
              menuPortalTarget={document.body}
              onChange={(e: any) => setNavn(e.value, index, nob?.navn)}
              options={allNameOptions}
              placeholder={t('el:placeholder-select-default')}
              value={_.find(allNameOptions, b => b.value === (index < 0 ? _newNavn : nob?.navn))}
              defaultValue={_.find(allNameOptions, b => b.value === (index < 0 ? _newNavn : nob?.navn))}
            />
          </Column>
          <Column>
            <Input
              feil={getErrorFor('betegnelsePåYtelse')}
              id='betegnelsePåYtelse'
              key={namespace + '-betegnelsePåYtelse-' + (index < 0 ? _newBetegnelse : nob?.betegnelsePåYtelse)}
              label={t('label:betegnelse-på-ytelse') + ' *'}
              namespace={namespace + '-navnOgBetegnelser' + idx}
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
      <AlignStartRow>
        <Column flex='2'>
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
        </Column>
        <Column/>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column flex='2'>
          <HighContrastRadioPanelGroup
            checked={currentMotregning()?.svarType}
            data-multiple-line
            data-no-border
            data-test-id={namespace + '-svarType'}
            feil={validation[namespace + '-svarType']?.feilmelding}
            id={namespace + '-svarType'}
            key={namespace + '-svarType-' + currentMotregning()?.svarType}
            legend={t('label:anmodning-om-motregning')}
            name={namespace + '-svarType'}
            radios={[
              { label: t('label:anmodning-om-motregning-barn'), value: 'anmodning_om_motregning_per_barn' },
              { label: t('label:anmodning-om-motregning-svar-barn'), value: 'svar_på_anmodning_om_motregning_per_barn' }
            ]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSvarType(e.target.value as AnmodningSvarType)}
          />
        </Column>
        <Column/>
      </AlignStartRow>
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
      <AlignStartRow>
        <Column>
          <DateInput
            feil={validation[namespace + '-vedtaksdato']?.feilmelding}
            id='vedtaksdato'
            key={namespace + '-vedtaksdato-' + currentMotregning().vedtaksdato}
            label={t('label:vedtaksdato') + ' *'}
            namespace={namespace}
            onChanged={setVedtaksDato}
            required
            value={currentMotregning().vedtaksdato}
          />
        </Column>
        <Column flex='2' />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column>
          <Input
            feil={validation[namespace + '-beloep']?.feilmelding}
            id='beloep'
            key={'beloep-' + currentMotregning().beloep}
            label={t('label:beløp') + ' *'}
            namespace={namespace}
            onChanged={setBeløp}
            value={currentMotregning().beloep}
          />
        </Column>
        <Column>
          <CountrySelect
            ariaLabel={t('label:valuta')}
            closeMenuOnSelect
            data-test-id={namespace + '-valuta'}
            error={validation[namespace + '-valuta']?.feilmelding}
            highContrast={highContrast}
            id={namespace + '-valuta'}
            key={namespace + '-valuta-' + _currencyData.findByValue(currentMotregning()?.valuta ?? '')}
            label={t('label:valuta') + ' *'}
            locale='nb'
            menuPortalTarget={document.body}
            onOptionSelected={setValuta}
            type='currency'
            values={_currencyData.findByValue(currentMotregning()?.valuta ?? '')}
          />
        </Column>
        <Column/>
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
      <AlignStartRow>
        <Column flex='2'>
          <HighContrastRadioPanelGroup
            checked={currentMotregning()?.utbetalingshyppighet}
            data-no-border
            data-test-id={namespace + '-utbetalingshyppighet'}
            id={namespace + '-utbetalingshyppighet'}
            key={namespace + '-utbetalingshyppighet-' + currentMotregning()?.utbetalingshyppighet}
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
        <Column/>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column flex='2'>
          <Input
            feil={validation[namespace + '-mottakersNavn']?.feilmelding}
            namespace={namespace}
            id='mottakersNavn'
            key={namespace + '-mottakersnavn-' + currentMotregning()?.mottakersNavn}
            label={t('label:mottakers-navn') + ' *'}
            onChanged={setMottakersNavn}
            required
            value={currentMotregning()?.mottakersNavn}
          />
        </Column>
        <Column/>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column flex='2'>
          <TextAreaDiv>
            <TextArea
              feil={validation[namespace + '-begrunnelse']?.feilmelding}
              namespace={namespace}
              id='begrunnelse'
              key={namespace + '-begrunnelse-' + currentMotregning()?.begrunnelse}
              label={t('label:anmodning-grunner')}
              onChanged={setBegrunnelse}
              value={currentMotregning()?.begrunnelse}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column flex='2'>
          <TextAreaDiv>
            <TextArea
              feil={validation[namespace + '-ytterligereInfo']?.feilmelding}
              namespace={namespace}
              id='ytterligereInfo'
              key={namespace + '-ytterligereInfo-' + currentMotregning()?.ytterligereInfo}
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
            mini
            kompakt
            data-amplitude='svarsed.editor.seekontoopplysning'
            onClick={(e: React.ChangeEvent<HTMLButtonElement>) => {
              buttonLogger(e)
              seeKontoopplysninger()
            }}
          >
            {t('label:oppgi-kontoopplysninger')}
          </HighContrastFlatknapp>
        </Column>
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default Motregning
