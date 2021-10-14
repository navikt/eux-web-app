import { setReplySed, updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { FormålManagerFormProps, FormålManagerFormSelector, mapState } from 'applications/SvarSed/Formaal/FormålManager'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import DateInput from 'components/Forms/DateInput'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import TextArea from 'components/Forms/TextArea'
import { HorizontalLineSeparator, RepeatableRow, TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import {
  AnmodningSvarType,
  Barn,
  BarnaEllerFamilie,
  F002Sed,
  Motregning as IMotregning,
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
import KeyAndYtelseNavn, { IKeyAndYtelseNavn } from './KeyAndYtelseNavn'
import { validateMotregning, ValidationMotregningProps} from './validation'

export type BarnaNameKeyMap = {[barnaName in string]: string}

export interface Index {
  key: string
  ytelseNavn?: string
  barnaKey?: string
  barnaName?: string
}

type BigIndexMap = {[motregningKey in string]: Array<Index>}

const Motregning: React.FC<FormålManagerFormProps> = ({
  parentNamespace,
  seeKontoopplysninger
}: FormålManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {replySed, validation, highContrast}: FormålManagerFormSelector = useSelector<State, FormålManagerFormSelector>(mapState)
  const dispatch = useDispatch()
  const namespace = `${parentNamespace}-motregning`
  const _currencyData = CountryData.getCurrencyInstance('nb')

  // Motregning
  const [_newSvarType, _setNewSvarType] = useState<AnmodningSvarType | undefined>(undefined)
  const [_newBarnaEllerFamilie, _setNewBarnaEllerFamilie] = useState<BarnaEllerFamilie | undefined>(undefined)
  const [_newKeyAndYtelseNavns, _setNewKeyAndYtelseNavns] = useState<Array<IKeyAndYtelseNavn>>([])
  const [_newVedtaksdato, _setNewVedtaksdato] = useState<string | undefined>(undefined)
  const [_newBeløp, _setNewBeløp] = useState<string | undefined>(undefined)
  const [_newValuta, _setNewValuta] = useState<Currency | undefined>(undefined)
  const [_newPeriode, _setNewPeriode] = useState<Periode | undefined>(undefined)
  const [_newUtbetalingshyppighet, _setNewUtbetalingshyppighet] = useState<Utbetalingshyppighet | undefined>(undefined)
  const [_newMottakersNavn, _setNewMottakersNavn] = useState<string | undefined>(undefined)
  const [_newBegrunnelse, _setNewBegrunnelse] = useState<string | undefined>(undefined)
  const [_newYtterligereInfo, _setNewYtterligereInfo] = useState<string | undefined>(undefined)


  const getMotregningId = (m: IMotregning | null): string => m?.vedtaksdato ?? 'new-motregning'
  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<IMotregning>(getMotregningId)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationMotregningProps>({}, validateMotregning)

  const [_allBarnaNameKeys, _setAllBarnaNameKeys] = useState<BarnaNameKeyMap>({})
  const [_bigIndexMap, _setBigIndexMap] = useState<BigIndexMap>({})
  // toggle between motregning for barna, and motregning for familie

  const getPersonName = (b: Barn): string => b.personInfo.fornavn + ' ' + b.personInfo.etternavn

  useEffect(() => {
     /**
       {
         '2020-08-01' : [{key: 'familie.motregninger[0]'}],
         '2020-08-02' : [{key: 'familie.motregninger[1]'}],
         '2020-09-01' : [
           {key: 'barn[1].motregninger[0]', ytelseNavn: 'x', barnaKey: 'barn[1]', barnaName: 'bart simpson'}
         ],
         '2020-10-01' : [
           {key: 'barn[0].motregninger[0]', ytelseNavn: 'y', barnaKey: 'barn[1]', barnaName: 'lisa simpson'}
           {key: 'barn[1].motregninger[1]', ytelseNavn: 'z', barnaKey: 'barn[1]', barnaName: 'bart simpson'}
         ],
         '2020-11-01' : [
           {key: 'barn[0].motregninger[1]', ytelseNavn: 'z', barnaKey: 'barn[1]', barnaName: 'lisa simpson'}
           {key: 'barn[1].motregninger[2]', ytelseNavn: 'w', barnaKey: 'barn[1]', barnaName: 'bart simpson'}
         ],
         'new-motregning': [
            {... }
         ]
      } */
    const newBigIndexMap: BigIndexMap = {}

    /** {'bart simpson' : 'barn[0]', 'lisa simpson' 'barn[1]' } */
    const newAllBarnaNameKeys: BarnaNameKeyMap = {};

    (replySed as F002Sed).barn?.forEach((barn: Barn, i: number) => {
      const barnaName: string = getPersonName(barn)
      const barnaKey = 'barn[' + i + ']'
      newAllBarnaNameKeys[barnaKey] = barnaName

      barn.motregninger?.forEach((motregning: IMotregning, j: number) => {
        let motregningKey = getMotregningId(motregning)
        const index = {key: barnaKey + '.motregninger[' + j + ']', ytelseNavn: motregning.ytelseNavn, barnaKey, barnaName}
        if (! Object.prototype.hasOwnProperty.call(newBigIndexMap, motregningKey)) {
          newBigIndexMap[motregningKey] = [index]
        } else {
          newBigIndexMap[motregningKey].push(index)
        }
      })
    })
    _setAllBarnaNameKeys(newAllBarnaNameKeys)
    _setBigIndexMap(newBigIndexMap)
  }, [replySed])

  const setSvarType = (newSvarType: AnmodningSvarType, motregningKey: string) => {
    if (motregningKey === 'new-motregning') {
      _setNewSvarType(newSvarType)
      _resetValidation(namespace + '-svarType')
    } else {
      const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
      _bigIndexMap[motregningKey].forEach(index => _.set(newReplySed, index.key + '.svarType', newSvarType))
      dispatch(setReplySed(newReplySed))
      if (validation[namespace + '[' + motregningKey + ']-svarType']) {
        dispatch(resetValidation(namespace + '[' + motregningKey + ']-svarType'))
      }
    }
  }

  const setBarnaEllerFamilie = (newBarnaEllerFamilie: BarnaEllerFamilie, motregningKey: string) => {
    if (motregningKey === 'new-motregning') {
      _setNewBarnaEllerFamilie(newBarnaEllerFamilie)
    } else {
      const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
      const newBigIndex: BigIndexMap = _.cloneDeep(_bigIndexMap)
      let _clonedMotregning: IMotregning = _.get(newReplySed,  _bigIndexMap[motregningKey][0].key)
      let _newIndex : Array<Index> = []

      if (newBarnaEllerFamilie === 'barna' as BarnaEllerFamilie) {

        // delete the motregning from familie
        newReplySed.familie!.motregninger = _.filter(newReplySed.familie!.motregninger, (m: IMotregning) => getMotregningId(m) !== motregningKey)

        // pre-select all barn, add a opy of the motregning to each.
        newReplySed.barn?.forEach((barn: Barn, i: number) => {
          let barnaKey = 'barn[' + i + ']'
          let barnaName = _allBarnaNameKeys[barnaKey]
          let newMotregninger: Array<IMotregning> |undefined = _.cloneDeep(barn.motregninger)
          if (!newMotregninger) {
            newMotregninger = []
          }
          let newKey = barnaKey + '.motregninger[' + newMotregninger.length + ']'
          // since family motregning does not have ytelseNavn, we will init with a blank
          _clonedMotregning.ytelseNavn = ''
          newMotregninger.push(_clonedMotregning)
          // update indexes
          _newIndex.push({
            key: newKey, barnaKey, barnaName, ytelseNavn: _clonedMotregning.ytelseNavn
          })
        })
      }

      if (newBarnaEllerFamilie === 'familie' as BarnaEllerFamilie) {

        // delete the motregning from barnas
        newReplySed.barn?.forEach((barn: Barn, i: number) => {
          newReplySed.barn![i].motregninger = _.filter(newReplySed.barn![i].motregninger, (m: IMotregning) => getMotregningId(m) !== motregningKey)
        })
        let newMotregninger: Array<IMotregning> | undefined = _.get(newReplySed, 'familie.motregninger')
        if (!newMotregninger) {
          newMotregninger = []
        }
        let newKey = 'familie.motregninger[' + newMotregninger.length + ']'
        // since family motregning does not have ytelseNavn, let's delete it from the clone
        delete _clonedMotregning.ytelseNavn
        newMotregninger.push(_clonedMotregning)
        // update indexes
        _newIndex.push({key: newKey})

      }
      newBigIndex[motregningKey] = _newIndex
      _setBigIndexMap(newBigIndex)
      dispatch(setReplySed(newReplySed))
    }
  }

  const setKeyAndYtelseNavns = (newKeyAndYtelseNavn: Array<IKeyAndYtelseNavn>, motregningKey: string) => {
    if (motregningKey === 'new-motregning') {
      _setNewKeyAndYtelseNavns(newKeyAndYtelseNavn)
    } else {
      const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
      const newBigIndex: BigIndexMap = _.cloneDeep(_bigIndexMap)
      let _clonedMotregning: IMotregning = _.get(newReplySed, _bigIndexMap[motregningKey][0].key)
      let _newIndex: Array<Index> = []

      // if it is barna
      if (!_.isEmpty(_bigIndexMap[motregningKey][0].barnaName)) {

        // delete the motregning from barnas - I have to rebuild them
        newReplySed.barn?.forEach((barn: Barn, index: number) => {
          newReplySed.barn![index].motregninger = _.filter(newReplySed.barn![index].motregninger, (m: IMotregning) => getMotregningId(m) !== motregningKey)
        })

        // adding motregnings according to new indexes
        newKeyAndYtelseNavn?.forEach((keyAndYtelseNavn) => {
          let barnaKey: string = keyAndYtelseNavn.key.match(/^barn\[\d+\]/)?.[0] ?? 'error'
          _.set(newReplySed, keyAndYtelseNavn.key, {
            ..._clonedMotregning,
            ytelseNavn: keyAndYtelseNavn.ytelseNavn
          })
          _newIndex.push({
            key: keyAndYtelseNavn.key,
            ytelseNavn: keyAndYtelseNavn.ytelseNavn,
            barnaKey: barnaKey,
            barnaName: _allBarnaNameKeys[barnaKey]
          })
        })

        newBigIndex[motregningKey] = _newIndex
        _setBigIndexMap(newBigIndex)
        dispatch(setReplySed(newReplySed))
      }
    }
  }

  const setVedtaksDato = (newDato: string, motregningKey: string): boolean => {
    if (motregningKey === 'new-motregning') {
      _setNewVedtaksdato(newDato.trim())
      _resetValidation(namespace + '-vedtaksDato')
      return true
    } else {
      // let's see if it does not collide.
      let otherKeys: Array<string> = _.filter(Object.keys(_bigIndexMap), key => key !== motregningKey)
      if (otherKeys.indexOf(newDato.trim()) >= 0) {
        window.alert('vedtaks dato already exists, choose another')
        return false
      } else {
        const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
        _bigIndexMap[motregningKey].forEach(index => _.set(newReplySed, index.key + '.vedtaksDato', newDato.trim()))
        dispatch(setReplySed(newReplySed))
        if (validation[namespace + '[' + motregningKey + ']-vedtaksDato']) {
          dispatch(resetValidation(namespace + '[' + motregningKey + ']-vedtaksDato'))
        }
        // we have to update the big index with the new motregningKey
        let newBigIndexMap = _.cloneDeep(_bigIndexMap)
        newBigIndexMap[newDato.trim()] = _.cloneDeep(newBigIndexMap[motregningKey])
        delete newBigIndexMap[motregningKey]
        _setBigIndexMap(newBigIndexMap)
        return true
      }
    }
  }

  const setBeløp = (newBeløp: string, motregningKey: string) => {
    if (motregningKey === 'new-motregning') {
      _setNewBeløp(newBeløp.trim())
      _resetValidation(namespace + '-beloep')
      if (_.isNil(_newValuta)) {
        _setNewValuta({value: 'NOK'} as Currency)
      }
    } else {
      const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
      _bigIndexMap[motregningKey].forEach(index => {
        _.set(newReplySed, index.key + '.beloep', newBeløp.trim())
        let valuta = _.get(newReplySed, index.key + '.valuta')
        if (_.isNil(valuta)) {
          _.set(newReplySed, index.key + '.valuta', 'NOK')
        }
      })
      dispatch(setReplySed(newReplySed))
      if (validation[namespace + '[' + motregningKey + ']-beloep']) {
        dispatch(resetValidation(namespace + '[' + motregningKey + ']-beloep'))
      }
      if (validation[namespace + '[' + motregningKey + ']-valuta']) {
        dispatch(resetValidation(namespace + '[' + motregningKey + ']-valuta'))
      }
    }
  }

  const setValuta = (newValuta: Currency, motregningKey: string) => {
    if (motregningKey === 'new-motregning') {
      _setNewValuta(newValuta)
      _resetValidation(namespace + '-valuta')
    } else {
      const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
      _bigIndexMap[motregningKey].forEach(index => _.set(newReplySed, index.key + '.valuta', newValuta.value))
      dispatch(setReplySed(newReplySed))
      if (validation[namespace + '[' + motregningKey + ']-valuta']) {
        dispatch(resetValidation(namespace + '[' + motregningKey + ']-valuta'))
      }
    }
  }

  const setPeriode = (newPeriode: Periode, motregningKey: string) => {
    if (motregningKey === 'new-motregning') {
      _setNewPeriode(newPeriode)
      _resetValidation(namespace + '-startdato')
      _resetValidation(namespace + '-sluttdato')
    } else {
      const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
      _bigIndexMap[motregningKey].forEach(index => {
        _.set(newReplySed, index.key + '.startdato', newPeriode.startdato)
        _.set(newReplySed, index.key + '.sluttdato', newPeriode.sluttdato)
      })
      dispatch(setReplySed(newReplySed))
      if (validation[namespace + '[' + motregningKey + ']-startdato']) {
        dispatch(resetValidation(namespace + '[' + motregningKey + ']-startdato'))
      }
      if (validation[namespace + '[' + motregningKey + ']-sluttdato']) {
        dispatch(resetValidation(namespace + '[' + motregningKey + ']-sluttdato'))
      }
    }
  }

  const setUtbetalingshyppighet = (newUtbetalingshyppighet: Utbetalingshyppighet, motregningKey: string) => {
    if (motregningKey === 'new-motregning') {
      _setNewUtbetalingshyppighet(newUtbetalingshyppighet)
      _resetValidation(namespace + '-utbetalingshyppighet')
    } else {
      const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
      _bigIndexMap[motregningKey].forEach(index => _.set(newReplySed, index.key + '.utbetalingshyppighet', newUtbetalingshyppighet))
      dispatch(setReplySed(newReplySed))
      if (validation[namespace + '[' + motregningKey + ']-utbetalingshyppighet']) {
        dispatch(resetValidation(namespace + '[' + motregningKey + ']-utbetalingshyppighet'))
      }
    }
  }

  const setMottakersNavn = (mottakersNavn: string, motregningKey: string) => {
    if (motregningKey === 'new-motregning') {
      _setNewMottakersNavn(mottakersNavn.trim())
      _resetValidation(namespace + '-mottakersNavn')
    } else {
      const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
      _bigIndexMap[motregningKey].forEach(index => _.set(newReplySed, index.key + '.mottakersNavn', mottakersNavn.trim()))
      dispatch(setReplySed(newReplySed))
      if (validation[namespace + '[' + motregningKey + ']-mottakersNavn']) {
        dispatch(resetValidation(namespace + '[' + motregningKey + ']-mottakersNavn'))
      }
    }
  }

  const setBegrunnelse = (newBegrunnelse: string, motregningKey: string) => {
    if (motregningKey === 'new-motregning') {
      _setNewBegrunnelse(newBegrunnelse.trim())
      _resetValidation(namespace + '-begrunnelse')
    } else {
      const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
      _bigIndexMap[motregningKey].forEach(index => _.set(newReplySed, index.key + '.begrunnelse', newBegrunnelse.trim()))
      dispatch(setReplySed(newReplySed))
      if (validation[namespace + '[' + motregningKey + ']-begrunnelse']) {
        dispatch(resetValidation(namespace + '[' + motregningKey + ']-begrunnelse'))
      }
    }
  }

  const setYtterligereInfo = (newYtterligereInfo: string, motregningKey: string) => {
    if (motregningKey === 'new-motregning') {
      _setNewYtterligereInfo(newYtterligereInfo.trim())
      _resetValidation(namespace + '-ytterligereInfo')
    } else {
      const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
      _bigIndexMap[motregningKey].forEach(index => _.set(newReplySed, index.key + '.ytterligereInfo', newYtterligereInfo.trim()))
      dispatch(setReplySed(newReplySed))
      if (validation[namespace + '[' + motregningKey + ']-ytterligereInfo']) {
        dispatch(resetValidation(namespace + '[' + motregningKey + ']-ytterligereInfo'))
      }
    }
  }

  const resetForm = () => {
    _setNewSvarType(undefined)
    _setNewBarnaEllerFamilie(undefined)
    _setNewVedtaksdato(undefined)
    _setNewBeløp(undefined)
    _setNewValuta(undefined)
    _setNewPeriode(undefined)
    _setNewUtbetalingshyppighet(undefined)
    _setNewMottakersNavn(undefined)
    _setNewBegrunnelse(undefined)
    _setNewYtterligereInfo(undefined)
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (motregningKey: string) => {
    const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
    newReplySed.barn?.forEach((barn: Barn, index: number) => {
      newReplySed.barn![index].motregninger = _.filter(newReplySed.barn![index].motregninger, (m: IMotregning) => getMotregningId(m) !== motregningKey)
    })
    if (!_.isNil(newReplySed.familie?.motregninger)) {
      newReplySed.familie!.motregninger = _.filter(newReplySed.familie!.motregninger, (m: IMotregning) => getMotregningId(m) !== motregningKey)
    }
    // sync big index
    let newBigIndexMap = _.cloneDeep(_bigIndexMap)
    delete newBigIndexMap[motregningKey]
    _setBigIndexMap(newBigIndexMap)
    dispatch(setReplySed(newReplySed))
    standardLogger('svarsed.editor.motregning.remove')
  }

  const onAdd = () => {
    const newMotregning: IMotregning = {
      begrunnelse: _newBegrunnelse,
      beloep: _newBeløp,
      mottakersNavn: _newMottakersNavn,
      svarType: _newSvarType,
      sluttdato: _newPeriode?.sluttdato,
      startdato: _newPeriode?.startdato,
      utbetalingshyppighet: _newUtbetalingshyppighet,
      valuta: _newValuta?.value,
      vedtaksdato: _newVedtaksdato,
      ytterligereInfo: _newYtterligereInfo
    } as IMotregning

    const valid: boolean = performValidation({
      motregning: newMotregning,
      type: _newBarnaEllerFamilie as BarnaEllerFamilie,
      namespace: namespace,
      formalName: t('label:motregning').toLowerCase()
    })

    if (valid && _newBarnaEllerFamilie === 'familie') {
      let newMotregninger: Array<IMotregning> | undefined = _.get(replySed, 'familie.motregninger')
      if (!newMotregninger) {
        newMotregninger = []
      }
      newMotregninger.push(newMotregning)
      dispatch(updateReplySed('familie.motregninger', newMotregninger))
      standardLogger('svarsed.editor.motregning.add')
      resetForm()
    }

    if (valid && _newBarnaEllerFamilie === 'barna') {
      const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
      _newKeyAndYtelseNavns.forEach(keyAndYtelseNavn => {
        let barn: Barn = _.get(replySed, keyAndYtelseNavn.key)
        let newMotregninger: Array<IMotregning> | undefined = _.cloneDeep(barn.motregninger)
        if (_.isNil(newMotregninger)) {
          newMotregninger = []
        }
        let thisMotregning: IMotregning = _.cloneDeep(newMotregning)
        thisMotregning.ytelseNavn = keyAndYtelseNavn.ytelseNavn
        newMotregninger.push(thisMotregning)
        _.set(newReplySed, keyAndYtelseNavn.key + '.motregninger', newMotregninger)
      })
      dispatch(setReplySed(newReplySed))
      standardLogger('svarsed.editor.motregning.add')
      resetForm()
    }
  }

  const renderRow = (motregningKey: string) => {

    let motregning: IMotregning | null
    if (motregningKey === 'new-motregning') {
      motregning = null
    } else {
       let indexes: Array<Index> | undefined = _bigIndexMap[motregningKey]
       if (_.isEmpty(indexes)) {
         motregning = {} as IMotregning
       } else {
         motregning = _.get(replySed, _bigIndexMap[motregningKey][0].key)
       }
    }

    const candidateForDeletion = motregningKey === 'new-motregning' ? false : isInDeletion(motregning)
    const idx = motregningKey === 'new-motregning' ? '' : '[' + motregningKey + ']'
    const getErrorFor = (el: string): string | undefined => {
      return motregningKey === 'new-motregning'
        ? _validation[namespace + idx + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    }

    const indexes: Array<Index> = _bigIndexMap[motregningKey]
    const barnaEllerFamilie: BarnaEllerFamilie | undefined = !_.isEmpty(indexes)
      ? (!_.isEmpty(indexes[0].barnaName) ? 'barna' : 'familie')
      : undefined
    const _barnaEllerFamilie = motregningKey === 'new-motregning' ? _newBarnaEllerFamilie : barnaEllerFamilie
    const _keyAndYtelseNavns: Array<IKeyAndYtelseNavn> | undefined = _barnaEllerFamilie === 'barna'
      ? motregningKey === 'new-motregning'
        ? _newKeyAndYtelseNavns
        : indexes.map(i => ({key: i.key, ytelseNavn: i.ytelseNavn})) as Array<IKeyAndYtelseNavn>
      : undefined

    return (
      <RepeatableRow className={classNames({ new: motregningKey === 'new-motregning' })}>
        <AlignStartRow>
          <Column flex='2'>
            <HighContrastRadioPanelGroup
              checked={motregningKey === 'new-motregning' ? _newBarnaEllerFamilie : barnaEllerFamilie}
              data-no-border
              data-test-id={namespace + idx + '-barnaEllerFamilie'}
              feil={getErrorFor('barnaEllerFamilie')}
              id={namespace + idx + '-barnaEllerFamilie'}
              key={namespace + idx + '-barnaEllerFamilie-' + (motregningKey === 'new-motregning' ? _newBarnaEllerFamilie : barnaEllerFamilie)}
              legend={t('label:barna-or-familie') + ' *'}
              name={namespace + '-barnaEllerFamilie'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBarnaEllerFamilie(e.target.value as BarnaEllerFamilie, motregningKey)}
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
              checked={motregningKey === 'new-motregning' ? _newSvarType : motregning?.svarType}
              data-multiple-line
              data-no-border
              data-test-id={namespace + idx + '-svarType'}
              feil={getErrorFor('svarType')}
              id={namespace + idx + '-svarType'}
              key={namespace + idx + '-svarType-' + (motregningKey === 'new-motregning' ? _newSvarType : motregning?.svarType)}
              legend={t('label:anmodning-om-motregning')}
              name={namespace + idx + '-svarType'}
              radios={[
                { label: t('label:anmodning-om-motregning-barn'), value: 'anmodning_om_motregning_per_barn' },
                { label: t('label:anmodning-om-motregning-svar-barn'), value: 'svar_på_anmodning_om_motregning_per_barn' }
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSvarType(e.target.value as AnmodningSvarType, motregningKey)}
            />
          </Column>
          <Column/>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        {_barnaEllerFamilie === 'barna' && (
          <>
            {_.isEmpty(_keyAndYtelseNavns)
              ? (
                <Normaltekst>
                  {t('message:warning-no-barn')}
                </Normaltekst>
              )
              : (
                <KeyAndYtelseNavn
                  highContrast={highContrast}
                  keyAndYtelseNavns={_keyAndYtelseNavns!}
                  onKeyAndYtelseNavnChanged={(newKeyAndYtelseNavn) => setKeyAndYtelseNavns(newKeyAndYtelseNavn, motregningKey)}
                  allBarnaNameKeys={_allBarnaNameKeys}
                  selectedBarnaNames={indexes}
                  parentNamespace={namespace}
                  validation={validation}
                  />
              )}
              <VerticalSeparatorDiv size='2' />
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
              feil={getErrorFor('vedtaksdato')}
              id='vedtaksdato'
              key={namespace + '-vedtaksdato-' + (motregningKey === 'new-motregning' ? _newVedtaksdato : motregning?.vedtaksdato)}
              label={t('label:vedtaksdato') + ' *'}
              namespace={namespace}
              onChanged={(newVedtaksdato) => {return setVedtaksDato(newVedtaksdato, motregningKey)}}
              required
              value={(motregningKey === 'new-motregning' ? _newVedtaksdato : motregning?.vedtaksdato)}
            />
          </Column>
          <Column flex='2' />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column>
            <Input
              feil={getErrorFor('beloep')}
              id='beloep'
              key={namespace + idx + '-beloep-' + (motregningKey === 'new-motregning' ? _newBeløp : motregning?.beloep)}
              label={t('label:beløp') + ' *'}
              namespace={namespace + idx}
              onChanged={(newBeløp: string) => setBeløp(newBeløp, motregningKey)}
              value={(motregningKey === 'new-motregning' ? _newBeløp : motregning?.beloep)}
            />
          </Column>
          <Column>
            <CountrySelect
              ariaLabel={t('label:valuta')}
              closeMenuOnSelect
              data-test-id={namespace + idx + '-valuta'}
              error={getErrorFor('valuta')}
              highContrast={highContrast}
              id={namespace + idx + '-valuta'}
              key={namespace + idx + '-valuta-' + (motregningKey === 'new-motregning' ? _newValuta : _currencyData.findByValue(motregning?.valuta)?.valuta ?? '')}
              label={t('label:valuta') + ' *'}
              locale='nb'
              menuPortalTarget={document.body}
              onOptionSelected={setValuta}
              type='currency'
              values={(motregningKey === 'new-motregning' ? _newValuta : _currencyData.findByValue(motregning?.valuta))}
            />
          </Column>
          <Column/>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <PeriodeInput
            key={namespace + idx + '-periode-' + (motregningKey === 'new-motregning'
              ? _newPeriode?.startdato + '-' + _newPeriode?.sluttdato
              : motregning?.startdato + '-' + motregning?.sluttdato)}
            namespace={namespace + idx}
            error={{
              startdato: getErrorFor('startdato'),
              sluttdato: getErrorFor('sluttdato')
            }}
            label={{
              startdato: t('label:startdato') + ' (' + t('label:innvilgelse').toLowerCase() + ')',
              sluttdato: t('label:sluttdato') + ' (' + t('label:innvilgelse').toLowerCase() + ')'
            }}
            periodeType='simple'
            setPeriode={(newPeriode: Periode) => setPeriode(newPeriode, motregningKey)}
            value={motregningKey === 'new-motregning' ? _newPeriode: {
              startdato: motregning?.startdato,
              sluttdato: motregning?.sluttdato
            } as Periode}
          />
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='2'>
            <HighContrastRadioPanelGroup
              checked={motregningKey === 'new-motregning' ? _newUtbetalingshyppighet : motregning?.utbetalingshyppighet}
              data-no-border
              data-test-id={namespace + idx + '-utbetalingshyppighet'}
              id={namespace + idx + '-utbetalingshyppighet'}
              key={namespace + idx + '-utbetalingshyppighet-' + (motregningKey === 'new-motregning' ? _newUtbetalingshyppighet : motregning?.utbetalingshyppighet)}
              feil={getErrorFor('utbetalingshyppighet')}
              name={namespace + idx + '-utbetalingshyppighet'}
              legend={t('label:periode-avgrensing') + ' *'}
              radios={[
                { label: t('label:månedlig'), value: 'Månedlig' },
                { label: t('label:årlig'), value: 'Årlig' }
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUtbetalingshyppighet(e.target.value as Utbetalingshyppighet, motregningKey)}
            />
          </Column>
          <Column/>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='2'>
            <Input
              feil={getErrorFor('mottakersNavn')}
              namespace={namespace + idx}
              id='mottakersNavn'
              key={namespace + idx + '-mottakersnavn-' + (motregningKey === 'new-motregning' ? _newMottakersNavn : motregning?.mottakersNavn)}
              label={t('label:mottakers-navn') + ' *'}
              onChanged={(newMottakersNavn: string) => setMottakersNavn(newMottakersNavn, motregningKey)}
              required
              value={(motregningKey === 'new-motregning' ? _newMottakersNavn : motregning?.mottakersNavn)}
            />
          </Column>
          <Column/>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='2'>
            <TextAreaDiv>
              <TextArea
                feil={getErrorFor('begrunnelse')}
                namespace={namespace + idx}
                id='begrunnelse'
                key={namespace + idx + '-begrunnelse-' + (motregningKey === 'new-motregning' ? _newBegrunnelse : motregning?.begrunnelse)}
                label={t('label:anmodning-grunner')}
                onChanged={(newBegrunnelse: string) => setBegrunnelse(newBegrunnelse, motregningKey)}
                value={(motregningKey === 'new-motregning' ? _newBegrunnelse : motregning?.begrunnelse)}
              />
            </TextAreaDiv>
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='2'>
            <TextAreaDiv>
              <TextArea
                feil={getErrorFor('ytterligereInfo')}
                namespace={namespace + idx}
                id='ytterligereInfo'
                key={namespace + idx + '-ytterligereInfo-' + (motregningKey === 'new-motregning' ? _newYtterligereInfo : motregning?.ytterligereInfo)}
                label={t('label:ytterligere-informasjon')}
                onChanged={(newYtterligereInfo: string) => setYtterligereInfo(newYtterligereInfo, motregningKey)}
                value={(motregningKey === 'new-motregning' ? _newYtterligereInfo : motregning?.ytterligereInfo)}
              />
            </TextAreaDiv>
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={motregningKey !== 'new-motregning'}
              marginTop
              onBeginRemove={() => addToDeletion(motregning)}
              onConfirmRemove={() => onRemove(motregningKey)}
              onCancelRemove={() => removeFromDeletion(motregning)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
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

      {_.isEmpty(Object.keys(_bigIndexMap))
        ? (
          <Normaltekst>
            {t('message:warning-no-motregning')}
          </Normaltekst>
        )
        : Object.keys(_bigIndexMap)?.map(renderRow)}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow('new-motregning')
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
                {t('el:button-add-new-x', { x: t('label:motregning').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
        )}
      </PaddedDiv>

  )
}

export default Motregning
