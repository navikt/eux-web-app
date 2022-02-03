import { Add } from '@navikt/ds-icons'
import { resetValidation } from 'actions/validation'
import { FormålManagerFormProps, FormålManagerFormSelector, mapState } from 'applications/SvarSed/Formaal/FormålManager'
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
import CountryData, { Currency } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import { BodyLong, Detail, Heading, Button } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  RadioPanelGroup,
  HorizontalSeparatorDiv,
  PaddedDiv,
  Row,
  VerticalSeparatorDiv,
  FlexRadioPanels,
  RadioPanel
} from '@navikt/hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import KeyAndYtelseFC, { KeyAndYtelse } from './KeyAndYtelse/KeyAndYtelse'
import { validateMotregning, ValidationMotregningProps } from './validation'

export type BarnaNameKeyMap = {[barnaName in string]: string}
type KeyAndYtelseMap = {[motregningKey in string]: Array<KeyAndYtelse>}

const Motregning: React.FC<FormålManagerFormProps> = ({
  parentNamespace,
  setReplySed,
  replySed,
  updateReplySed,
  seeKontoopplysninger
}: FormålManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: FormålManagerFormSelector = useSelector<State, FormålManagerFormSelector>(mapState)
  const dispatch = useDispatch()
  const namespace = `${parentNamespace}-motregning`
  const _currencyData = CountryData.getCurrencyInstance('nb')

  // Motregning
  const [_newSvarType, _setNewSvarType] = useState<AnmodningSvarType | undefined>(undefined)
  const [_newBarnaEllerFamilie, _setNewBarnaEllerFamilie] = useState<BarnaEllerFamilie | undefined>(undefined)
  // ytelseNavn for barnas
  const [_newKeyAndYtelses, _setNewKeyAndYtelses] = useState<Array<KeyAndYtelse>>([])
  // ytelseNavn for familie
  const [_newYtelseNavn, _setNewYtelseNavn] = useState<string | undefined>(undefined)
  const [_newVedtaksdato, _setNewVedtaksdato] = useState<string | undefined>(undefined)
  const [_newBeløp, _setNewBeløp] = useState<string | undefined>(undefined)
  const [_newValuta, _setNewValuta] = useState<Currency | undefined>(undefined)
  const [_newPeriode, _setNewPeriode] = useState<Periode | undefined>(undefined)
  const [_newUtbetalingshyppighet, _setNewUtbetalingshyppighet] = useState<Utbetalingshyppighet | undefined>(undefined)
  const [_newMottakersNavn, _setNewMottakersNavn] = useState<string | undefined>(undefined)
  const [_newBegrunnelse, _setNewBegrunnelse] = useState<string | undefined>(undefined)
  const [_newYtterligereInfo, _setNewYtterligereInfo] = useState<string | undefined>(undefined)

  const getMotregningId = (m: IMotregning | null): string => m ? m?.startdato + '-' + (m?.sluttdato ?? '') : 'new-motregning'
  const [_addToDeletion, _removeFromDeletion, _isInDeletion] = useAddRemove<IMotregning>(getMotregningId)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationMotregningProps>({}, validateMotregning)

  const [_allBarnaNameKeys, _setAllBarnaNameKeys] = useState<BarnaNameKeyMap>({})
  const [_keyAndYtelseMap, _setKeyAndYtelseMap] = useState<KeyAndYtelseMap>({})

  const getPersonName = (b: Barn): string => b.personInfo.fornavn + ' ' + (b.personInfo?.etternavn ?? '')

  useEffect(() => {
    /** sample of a keyAndYtelse map. When fullKey is for familie, we do not have ytelseNavn
       {
         '2020-08-01-2020-08-02' : [{fullKey: 'familie.motregninger[0]'}],
         '2020-08-02-2020-08-03' : [{fullKey: 'familie.motregninger[1]'}],
         '2020-09-01-2020-09-02' : [{fullKey: 'barn[1].motregninger[0]', ytelseNavn: 'xxx'}],
         '2020-10-01-2020-10-02' : [{fullKey: 'barn[0].motregninger[0]', ytelseNavn: 'yyy'},
                                    {fullKey: 'barn[1].motregninger[1]', ytelseNavn: 'zzz'}],
         '2020-11-01-2020-11-02' : [{fullKey: 'barn[0].motregninger[1]', ytelseNavn: 'zzz'},
                                    {fullKey: 'barn[1].motregninger[2]', ytelseNavn: 'www'}]
      } */
    const newKeyAndYtelseMap: KeyAndYtelseMap = {}

    /** sample of allBarnaNameKeys
      {
        'barn[0]': 'bart simpson',
        'barn[1]': 'lisa simpson'
      }
     */
    const newAllBarnaNameKeys: BarnaNameKeyMap = {};

    (replySed as F002Sed).barn?.forEach((barn: Barn, i: number) => {
      const barnaKey = 'barn[' + i + ']'
      newAllBarnaNameKeys[barnaKey] = getPersonName(barn)

      barn.motregninger?.forEach((motregning: IMotregning, j: number) => {
        const motregningKey = getMotregningId(motregning)
        const index = { fullKey: `${barnaKey}.motregninger[${j}]`, ytelseNavn: motregning.ytelseNavn ?? '', barnaKey }
        if (!Object.prototype.hasOwnProperty.call(newKeyAndYtelseMap, motregningKey)) {
          newKeyAndYtelseMap[motregningKey] = [index]
        } else {
          newKeyAndYtelseMap[motregningKey].push(index)
        }
      })
    });

    (replySed as F002Sed).familie?.motregninger?.forEach((motregning: IMotregning, j: number) => {
      const motregningKey = getMotregningId(motregning)
      const index = { fullKey: `familie.motregninger[${j}]`, ytelseNavn: motregning.ytelseNavn ?? '' }
      if (!Object.prototype.hasOwnProperty.call(newKeyAndYtelseMap, motregningKey)) {
        newKeyAndYtelseMap[motregningKey] = [index]
      } else {
        newKeyAndYtelseMap[motregningKey].push(index)
      }
    })

    _setAllBarnaNameKeys(newAllBarnaNameKeys)
    _setKeyAndYtelseMap(newKeyAndYtelseMap)
  }, [replySed])

  const setKeyAndYtelseMap = (newKeyAndYtelseMap: KeyAndYtelseMap) => {
    console.log('KeyAndYtelseMap updated: ', newKeyAndYtelseMap)
    _setKeyAndYtelseMap(newKeyAndYtelseMap)
  }

  const setSvarType = (newSvarType: AnmodningSvarType, motregningKey: string) => {
    if (motregningKey === 'new-motregning') {
      _setNewSvarType(newSvarType)
      _resetValidation(namespace + '-svarType')
    } else {
      const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
      _keyAndYtelseMap[motregningKey].forEach(index => _.set(newReplySed, index.fullKey + '.svarType', newSvarType))
      dispatch(setReplySed(newReplySed))
      if (validation[namespace + '[' + motregningKey + ']-svarType']) {
        dispatch(resetValidation(namespace + '[' + motregningKey + ']-svarType'))
      }
    }
  }

  const setBarnaEllerFamilie = (newBarnaEllerFamilie: BarnaEllerFamilie, motregningKey: string) => {
    if (motregningKey === 'new-motregning') {
      _setNewBarnaEllerFamilie(newBarnaEllerFamilie)
      _resetValidation(namespace + '-barnaEllerFamilie')
    } else {
      const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
      const newKeyAndYtelseMap: KeyAndYtelseMap = _.cloneDeep(_keyAndYtelseMap)
      const _clonedMotregning: IMotregning = _.get(newReplySed, _keyAndYtelseMap[motregningKey][0].fullKey)
      const _newIndex : Array<KeyAndYtelse> = []

      // switching to barna -- maybe switching from familie
      if (newBarnaEllerFamilie === 'barna' as BarnaEllerFamilie) {
        // delete the motregning from familie
        newReplySed.familie!.motregninger = _.filter(newReplySed.familie!.motregninger, (m: IMotregning) => getMotregningId(m) !== motregningKey)
        // pre-select all barn, add a copy of the cloned motregning to each barn.
        newReplySed.barn?.forEach((barn: Barn, i: number) => {
          let newMotregninger: Array<IMotregning> | undefined = _.cloneDeep(barn.motregninger)
          if (!newMotregninger) {
            newMotregninger = []
          }
          // newMotregninger.length will be the index when pushed the motregning
          const fullKey = 'barn[' + i + '].motregninger[' + newMotregninger.length + ']'
          newMotregninger.push(_clonedMotregning)
          newReplySed.barn![i].motregninger = newMotregninger
          // update indexes
          _newIndex.push({ fullKey: fullKey, ytelseNavn: _clonedMotregning.ytelseNavn })
        })
      }

      // switching to familie -- maybe switching from barna
      if (newBarnaEllerFamilie === 'familie' as BarnaEllerFamilie) {
        // delete the motregning from barna
        newReplySed.barn?.forEach((barn: Barn, i: number) => {
          newReplySed.barn![i].motregninger = _.filter(newReplySed.barn![i].motregninger, (m: IMotregning) => getMotregningId(m) !== motregningKey)
        })
        let newMotregninger: Array<IMotregning> | undefined = _.get(newReplySed, 'familie.motregninger')
        if (!newMotregninger) {
          newMotregninger = []
        }
        // newMotregninger.length will be the index when pushed the motregning
        const fullKey = 'familie.motregninger[' + newMotregninger.length + ']'
        // familie will inherit ytelseNavn from cloned motregning -- up to saksbehandler to check if it is right
        newMotregninger.push(_clonedMotregning)
        _.set(newReplySed, 'familie.motregninger', newMotregninger)
        // update indexes
        _newIndex.push({ fullKey: fullKey })
      }
      newKeyAndYtelseMap[motregningKey] = _newIndex
      setKeyAndYtelseMap(newKeyAndYtelseMap)
      dispatch(setReplySed(newReplySed))
    }
  }

  /** this will only be called when barnaEllerFamilie === 'familie, it does not apply to barna (that is handled on onYtelseChanged) */
  const setYtelseNavn = (newYtelseNavn: string, motregningKey: string) => {
    if (motregningKey === 'new-motregning') {
      _setNewYtelseNavn(newYtelseNavn.trim())
      _resetValidation(namespace + '-ytelseNavn')
    } else {
      const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
      _keyAndYtelseMap[motregningKey].forEach(index => _.set(newReplySed, index.fullKey + '.ytelseNavn', newYtelseNavn.trim()))
      dispatch(setReplySed(newReplySed))
      if (validation[namespace + '[' + motregningKey + ']-ytelseNavn']) {
        dispatch(resetValidation(namespace + '[' + motregningKey + ']-ytelseNavn'))
      }
    }
  }

  /** this will only be called when barnaEllerFamilie === 'barna', and for adding a new keyAndYtelse on an existing motregning */
  const onAdded = (barnKey: string, ytelseNavn: string, motregningKey: string) => {
    if (motregningKey === 'new-motregning') {
      let newKeyAndYtelses = _.cloneDeep(_newKeyAndYtelses)
      newKeyAndYtelses = newKeyAndYtelses.concat({ fullKey: barnKey, ytelseNavn: ytelseNavn })
      _setNewKeyAndYtelses(newKeyAndYtelses)
    } else {
      const newKeyAndYtelseMap: KeyAndYtelseMap = _.cloneDeep(_keyAndYtelseMap)
      const _clonedMotregning: IMotregning = _.get(replySed, _keyAndYtelseMap[motregningKey][0].fullKey)

      let newMotregninger: Array<IMotregning> | undefined = _.get(replySed, barnKey + '.motregninger')
      if (_.isNil(newMotregninger)) {
        newMotregninger = []
      }
      const newFullKey = barnKey + '.motregninger[' + newMotregninger.length + ']'
      newMotregninger.push({
        ..._clonedMotregning,
        ytelseNavn: ytelseNavn
      })
      newKeyAndYtelseMap[motregningKey].push({
        fullKey: newFullKey, ytelseNavn: ytelseNavn
      })
      setKeyAndYtelseMap(newKeyAndYtelseMap)
      dispatch(updateReplySed(barnKey + '.motregninger', newMotregninger))
    }
  }

  /** this will only be called when barnaEllerFamilie === 'barna', and for removing a keyAndYtelse on an existing motregning */
  const onRemoved = (fullKey: string, motregningKey: string) => {
    if (motregningKey === 'new-motregning') {
      let newKeyAndYtelses = _.cloneDeep(_newKeyAndYtelses)
      newKeyAndYtelses = _.filter(newKeyAndYtelses, it => it.fullKey !== fullKey)
      _setNewKeyAndYtelses(newKeyAndYtelses)
    } else {
      const newKeyAndYtelseMap: KeyAndYtelseMap = _.cloneDeep(_keyAndYtelseMap)
      const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed

      // if we will remove the last element of an array, them remove the whole motregninger
      const partialKey = fullKey.match(/^barn\[\d+\]/)![0] + '.motregninger'
      const motregninger = _.get(newReplySed, partialKey)
      if (motregninger.length === 1) {
        _.unset(newReplySed, partialKey)
      } else {
        _.unset(newReplySed, fullKey)
      }

      newKeyAndYtelseMap[motregningKey] = _.filter(newKeyAndYtelseMap[motregningKey], keyAndYtelse => keyAndYtelse.fullKey !== fullKey)
      setKeyAndYtelseMap(newKeyAndYtelseMap)
      dispatch(setReplySed(newReplySed))
    }
  }

  /** this will only be called when barnaEllerFamilie === 'barna', and for switching an existing motregning fom barbn X to barn Y */
  const onKeyChanged = (fullKey: string, barnKey: string, motregningKey: string) => {
    if (motregningKey === 'new-motregning') {
      let newKeyAndYtelses = _.cloneDeep(_newKeyAndYtelses)
      newKeyAndYtelses = newKeyAndYtelses.map(it => {
        if (it.fullKey === fullKey) {
          return {
            ...it,
            fullKey: barnKey
          }
        }
        return it
      })
      _setNewKeyAndYtelses(newKeyAndYtelses)
      _resetValidation(namespace + '-key')
    } else {
      // basically an operation of remove, and add

      // starting with remove
      const newKeyAndYtelseMap: KeyAndYtelseMap = _.cloneDeep(_keyAndYtelseMap)
      const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
      const clonedMotregning: IMotregning = _.get(newReplySed, fullKey) as IMotregning

      // if we will remove the last element of an array, them remove the whole motregninger
      const partialKey = fullKey.match(/^barn\[\d+\]/)![0] + '.motregninger'
      const motregninger = _.get(newReplySed, partialKey)
      if (motregninger.length === 1) {
        _.unset(newReplySed, partialKey)
      } else {
        _.unset(newReplySed, fullKey)
      }

      newKeyAndYtelseMap[motregningKey] = _.filter(newKeyAndYtelseMap[motregningKey], keyAndYtelse => keyAndYtelse.fullKey !== fullKey)

      // now, adding
      let newMotregninger: Array<IMotregning> | undefined = _.get(replySed, barnKey + '.motregninger')
      if (_.isNil(newMotregninger)) {
        newMotregninger = []
      }
      const newFullKey = barnKey + '.motregninger[' + newMotregninger.length + ']'
      newMotregninger.push(clonedMotregning)
      newKeyAndYtelseMap[motregningKey].push({
        fullKey: newFullKey, ytelseNavn: clonedMotregning.ytelseNavn
      })
      setKeyAndYtelseMap(newKeyAndYtelseMap)
      dispatch(setReplySed(newReplySed))
    }
  }

  /** this will only be called when barnaEllerFamilie === 'barna', and for switching ytelseNavn for one certain barn */
  const onYtelseChanged = (fullKey: string, ytelseNavn: string, motregningKey: string) => {
    if (motregningKey === 'new-motregning') {
      let newKeyAndYtelses = _.cloneDeep(_newKeyAndYtelses)
      newKeyAndYtelses = newKeyAndYtelses.map(it => {
        if (it.fullKey === fullKey) {
          return {
            ...it,
            ytelseNavn: ytelseNavn
          }
        }
        return it
      })
      _setNewKeyAndYtelses(newKeyAndYtelses)
      _resetValidation(namespace + '-ytelseNavn')
    } else {
      const newKeyAndYtelseMap: KeyAndYtelseMap = _.cloneDeep(_keyAndYtelseMap)
      const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
      _.set(newReplySed, fullKey + '.ytelseNavn', ytelseNavn)
      newKeyAndYtelseMap[motregningKey] = newKeyAndYtelseMap[motregningKey].map(keyAndYtelse => {
        if (keyAndYtelse.fullKey === fullKey) {
          return {
            ...keyAndYtelse,
            ytelseNavn: ytelseNavn
          }
        }
        return keyAndYtelse
      })
      setKeyAndYtelseMap(newKeyAndYtelseMap)
      dispatch(setReplySed(newReplySed))
    }
  }

  const setVedtaksDato = (newDato: string, motregningKey: string) => {
    if (motregningKey === 'new-motregning') {
      _setNewVedtaksdato(newDato.trim())
      _resetValidation(namespace + '-vedtaksDato')
    } else {
      const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
      _keyAndYtelseMap[motregningKey].forEach(index => _.set(newReplySed, index.fullKey + '.vedtaksDato', newDato.trim()))
      dispatch(setReplySed(newReplySed))
      if (validation[namespace + '[' + motregningKey + ']-vedtaksDato']) {
        dispatch(resetValidation(namespace + '[' + motregningKey + ']-vedtaksDato'))
      }
    }
  }

  const setBeløp = (newBeløp: string, motregningKey: string) => {
    if (motregningKey === 'new-motregning') {
      _setNewBeløp(newBeløp.trim())
      _resetValidation(namespace + '-beloep')
      if (_.isNil(_newValuta)) {
        _setNewValuta({ value: 'NOK' } as Currency)
      }
    } else {
      const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
      _keyAndYtelseMap[motregningKey].forEach(index => {
        _.set(newReplySed, index.fullKey + '.beloep', newBeløp.trim())
        const valuta = _.get(newReplySed, index.fullKey + '.valuta')
        if (_.isNil(valuta)) {
          _.set(newReplySed, index.fullKey + '.valuta', 'NOK')
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
      _keyAndYtelseMap[motregningKey].forEach(index => _.set(newReplySed, index.fullKey + '.valuta', newValuta.value))
      dispatch(setReplySed(newReplySed))
      if (validation[namespace + '[' + motregningKey + ']-valuta']) {
        dispatch(resetValidation(namespace + '[' + motregningKey + ']-valuta'))
      }
    }
  }

  const setPeriode = (newPeriode: Periode, id: string, oldMotregningKey: string): boolean => {
    if (oldMotregningKey === 'new-motregning') {
      _setNewPeriode(newPeriode)
      if (id === 'startdato') {
        _resetValidation(namespace + '-startdato')
      }
      if (id === 'sluttdato') {
        _resetValidation(namespace + '-sluttdato')
      }
      return true
    } else {
      const otherKeys: Array<string> = _.filter(Object.keys(_keyAndYtelseMap), key => key !== oldMotregningKey)
      const newMotregningKey = newPeriode.startdato.trim() + '-' + (newPeriode.sluttdato ?? '')
      if (otherKeys.indexOf(newMotregningKey) >= 0) {
        window.alert('startsdato/sluttdato already exists, choose another')
        return false
      } else {
        const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
        _keyAndYtelseMap[oldMotregningKey].forEach(index => {
          _.set(newReplySed, index.fullKey + '.startdato', newPeriode.startdato)
          _.set(newReplySed, index.fullKey + '.sluttdato', newPeriode.sluttdato)
        })
        dispatch(setReplySed(newReplySed))
        if (id === 'startdato' && validation[namespace + '[' + oldMotregningKey + ']-startdato']) {
          dispatch(resetValidation(namespace + '[' + oldMotregningKey + ']-startdato'))
        }
        if (id === 'sluttdato' && validation[namespace + '[' + oldMotregningKey + ']-sluttdato']) {
          dispatch(resetValidation(namespace + '[' + oldMotregningKey + ']-sluttdato'))
        }
        // we have to update the big index with the new motregningKey
        const newBigIndexMap = _.cloneDeep(_keyAndYtelseMap)
        newBigIndexMap[newMotregningKey] = _.cloneDeep(newBigIndexMap[oldMotregningKey])
        delete newBigIndexMap[oldMotregningKey]
        setKeyAndYtelseMap(newBigIndexMap)
        return true
      }
    }
  }

  const setUtbetalingshyppighet = (newUtbetalingshyppighet: Utbetalingshyppighet, motregningKey: string) => {
    if (motregningKey === 'new-motregning') {
      _setNewUtbetalingshyppighet(newUtbetalingshyppighet)
      _resetValidation(namespace + '-utbetalingshyppighet')
    } else {
      const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
      _keyAndYtelseMap[motregningKey].forEach(index => _.set(newReplySed, index.fullKey + '.utbetalingshyppighet', newUtbetalingshyppighet))
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
      _keyAndYtelseMap[motregningKey].forEach(index => _.set(newReplySed, index.fullKey + '.mottakersNavn', mottakersNavn.trim()))
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
      _keyAndYtelseMap[motregningKey].forEach(index => _.set(newReplySed, index.fullKey + '.begrunnelse', newBegrunnelse.trim()))
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
      _keyAndYtelseMap[motregningKey].forEach(index => _.set(newReplySed, index.fullKey + '.ytterligereInfo', newYtterligereInfo.trim()))
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
    const newBigIndexMap = _.cloneDeep(_keyAndYtelseMap)
    delete newBigIndexMap[motregningKey]
    setKeyAndYtelseMap(newBigIndexMap)
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
      ytterligereInfo: _newYtterligereInfo,
      ytelseNavn: _newYtelseNavn // only for familie
    } as IMotregning

    const valid: boolean = _performValidation({
      motregning: newMotregning,
      keyAndYtelses: _newKeyAndYtelses,
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
      onCancel()
    }

    if (valid && _newBarnaEllerFamilie === 'barna') {
      const newReplySed: F002Sed = _.cloneDeep(replySed) as F002Sed
      _newKeyAndYtelses.forEach(keyAndYtelse => {
        const barn: Barn = _.get(replySed, keyAndYtelse.fullKey) // on new-motregning, fullKey is used to store barnKey
        let newMotregninger: Array<IMotregning> | undefined = _.cloneDeep(barn.motregninger)
        if (_.isNil(newMotregninger)) {
          newMotregninger = []
        }
        newMotregninger.push({
          ...newMotregning,
          ytelseNavn: keyAndYtelse.ytelseNavn
        })
        _.set(newReplySed, keyAndYtelse.fullKey + '.motregninger', newMotregninger)
      })
      dispatch(setReplySed(newReplySed))
      standardLogger('svarsed.editor.motregning.add')
      onCancel()
    }
  }

  const renderRow = (motregningKey: string) => {
    let motregning: IMotregning | null
    const keyAndYtelses: Array<KeyAndYtelse> | undefined = _keyAndYtelseMap[motregningKey]
    if (motregningKey === 'new-motregning') {
      motregning = null
    } else {
      if (_.isEmpty(keyAndYtelses)) {
        motregning = {} as IMotregning
      } else {
        motregning = _.get(replySed, _keyAndYtelseMap[motregningKey][0].fullKey)
      }
    }

    const candidateForDeletion = motregningKey === 'new-motregning' ? false : _isInDeletion(motregning)
    const idx = motregningKey === 'new-motregning' ? '' : '[' + motregningKey + ']'
    const getErrorFor = (el: string): string | undefined => {
      return motregningKey === 'new-motregning'
        ? _validation[namespace + idx + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    }

    const barnaEllerFamilie: BarnaEllerFamilie | undefined = !_.isEmpty(keyAndYtelses)
      ? (keyAndYtelses[0].fullKey.startsWith('barn') ? 'barna' : 'familie')
      : undefined
    const _barnaEllerFamilie = motregningKey === 'new-motregning' ? _newBarnaEllerFamilie : barnaEllerFamilie
    const _keyAndYtelses: Array<KeyAndYtelse> = _barnaEllerFamilie === 'barna'
      ? (motregningKey === 'new-motregning' ? _newKeyAndYtelses : _keyAndYtelseMap[motregningKey])
      : []

    return (
      <RepeatableRow className={classNames({ new: motregningKey === 'new-motregning' })}>
        <AlignStartRow>
          <Column flex='2'>
            <RadioPanelGroup
              value={motregningKey === 'new-motregning' ? _newBarnaEllerFamilie : barnaEllerFamilie}
              data-no-border
              data-test-id={namespace + idx + '-barnaEllerFamilie'}
              error={getErrorFor('barnaEllerFamilie')}
              id={namespace + idx + '-barnaEllerFamilie'}
              key={namespace + idx + '-barnaEllerFamilie-' + (motregningKey === 'new-motregning' ? _newBarnaEllerFamilie : barnaEllerFamilie)}
              legend={t('label:barna-or-familie') + ' *'}
              name={namespace + '-barnaEllerFamilie'}
              onChange={(e: string) => setBarnaEllerFamilie(e as BarnaEllerFamilie, motregningKey)}
            >
              <FlexRadioPanels>
                <RadioPanel value='barna'>{t('label:barn')}</RadioPanel>
                <RadioPanel value='familie'>{t('label:familien')}</RadioPanel>
              </FlexRadioPanels>
            </RadioPanelGroup>
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv size='2' />
        <AlignStartRow>
          <Column flex='2'>
            <RadioPanelGroup
              value={motregningKey === 'new-motregning' ? _newSvarType : motregning?.svarType}
              data-multiple-line
              data-no-border
              data-test-id={namespace + idx + '-svarType'}
              error={getErrorFor('svarType')}
              id={namespace + idx + '-svarType'}
              key={namespace + idx + '-svarType-' + (motregningKey === 'new-motregning' ? _newSvarType : motregning?.svarType)}
              legend={t('label:anmodning-om-motregning')}
              name={namespace + idx + '-svarType'}
              onChange={(e: string) => setSvarType(e as AnmodningSvarType, motregningKey)}
            >
              <FlexRadioPanels>
                <RadioPanel value='anmodning_om_motregning_per_barn'>{t('label:anmodning-om-motregning-barn')}</RadioPanel>
                <RadioPanel value='svar_på_anmodning_om_motregning_per_barn'>{t('label:anmodning-om-motregning-svar-barn')}</RadioPanel>
              </FlexRadioPanels>
            </RadioPanelGroup>
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        {_barnaEllerFamilie === 'barna' && (
          <>
            <KeyAndYtelseFC
              onAdded={(barnKey: string, ytelseNavn: string) => onAdded(barnKey, ytelseNavn, motregningKey)}
              onRemoved={(fullKey: string) => onRemoved(fullKey, motregningKey)}
              onKeyChanged={(fullKey: string, barnKey: string) => onKeyChanged(fullKey, barnKey, motregningKey)}
              onYtelseChanged={(fullKey: string, ytelseNavn: string) => onYtelseChanged(fullKey, ytelseNavn, motregningKey)}
              keyAndYtelses={_keyAndYtelses}
              allBarnaNameKeys={_allBarnaNameKeys}
              parentNamespace={namespace}
              validation={validation}
            />
            {getErrorFor('ytelseNavn') && (
              <div className='navds-error-message navds-error-message--medium navds-label'>
                {getErrorFor('ytelseNavn')}
              </div>
            )}
            <VerticalSeparatorDiv size='2' />
          </>
        )}
        {_barnaEllerFamilie === 'familie' && (
          <>
            <AlignStartRow>
              <Column>
                <Input
                  error={getErrorFor('ytelseNavn')}
                  id='ytelseNavn'
                  key={namespace + idx + '-ytelseNavn-' + (motregningKey === 'new-motregning' ? _newYtelseNavn : motregning?.ytelseNavn)}
                  label={t('label:betegnelse-på-ytelse') + ' *'}
                  namespace={namespace + idx}
                  onChanged={(newYtelseNavn: string) => setYtelseNavn(newYtelseNavn, motregningKey)}
                  value={(motregningKey === 'new-motregning' ? _newYtelseNavn : motregning?.ytelseNavn)}
                />
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv size='2' />
          </>
        )}
        <VerticalSeparatorDiv size='2' />
        <Detail>
          {t('label:informasjon-om-familieytelser')}
        </Detail>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column>
            <DateInput
              error={getErrorFor('vedtaksdato')}
              id='vedtaksdato'
              key={namespace + '-vedtaksdato-' + (motregningKey === 'new-motregning' ? _newVedtaksdato : motregning?.vedtaksdato)}
              label={t('label:vedtaksdato') + ' *'}
              namespace={namespace}
              onChanged={(newVedtaksdato) => { return setVedtaksDato(newVedtaksdato, motregningKey) }}
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
              error={getErrorFor('beloep')}
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
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <PeriodeInput
            namespace={namespace + idx}
            error={{
              startdato: getErrorFor('startdato'),
              sluttdato: getErrorFor('sluttdato')
            }}
            label={{
              startdato: t('label:startdato') + ' (' + t('label:innvilgelse').toLowerCase() + ') *',
              sluttdato: t('label:sluttdato') + ' (' + t('label:innvilgelse').toLowerCase() + ') *'
            }}
            periodeType='simple'
            setPeriode={(newPeriode: Periode, id: string) => setPeriode(newPeriode, id, motregningKey)}
            value={motregningKey === 'new-motregning'
              ? _newPeriode
              : {
                startdato: motregning?.startdato,
                sluttdato: motregning?.sluttdato
              } as Periode}
          />
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='2'>
            <RadioPanelGroup
              checked={motregningKey === 'new-motregning' ? _newUtbetalingshyppighet : motregning?.utbetalingshyppighet}
              data-no-border
              data-test-id={namespace + idx + '-utbetalingshyppighet'}
              id={namespace + idx + '-utbetalingshyppighet'}
              key={namespace + idx + '-utbetalingshyppighet-' + (motregningKey === 'new-motregning' ? _newUtbetalingshyppighet : motregning?.utbetalingshyppighet)}
              error={getErrorFor('utbetalingshyppighet')}
              name={namespace + idx + '-utbetalingshyppighet'}
              legend={t('label:periode-avgrensing') + ' *'}
              onChange={(e: string) => setUtbetalingshyppighet(e as Utbetalingshyppighet, motregningKey)}
            >
              <FlexRadioPanels>
                <RadioPanel value='Månedlig'>{t('label:månedlig')}</RadioPanel>
                <RadioPanel value='Årlig'>{t('label:årlig')}</RadioPanel>
              </FlexRadioPanels>
            </RadioPanelGroup>
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='2'>
            <Input
              error={getErrorFor('mottakersNavn')}
              namespace={namespace + idx}
              id='mottakersNavn'
              key={namespace + idx + '-mottakersnavn-' + (motregningKey === 'new-motregning' ? _newMottakersNavn : motregning?.mottakersNavn)}
              label={t('label:mottakers-navn') + ' *'}
              onChanged={(newMottakersNavn: string) => setMottakersNavn(newMottakersNavn, motregningKey)}
              required
              value={(motregningKey === 'new-motregning' ? _newMottakersNavn : motregning?.mottakersNavn)}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='2'>
            <TextAreaDiv>
              <TextArea
                error={getErrorFor('begrunnelse')}
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
                error={getErrorFor('ytterligereInfo')}
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
              onBeginRemove={() => _addToDeletion(motregning)}
              onConfirmRemove={() => onRemove(motregningKey)}
              onCancelRemove={() => _removeFromDeletion(motregning)}
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
      <Heading size='small'>
        {t('label:motregning')}
      </Heading>
      <VerticalSeparatorDiv size='2' />

      {_.isEmpty(Object.keys(_keyAndYtelseMap))
        ? (
          <BodyLong>
            {t('message:warning-no-motregning')}
          </BodyLong>
          )
        : Object.keys(_keyAndYtelseMap)?.map(renderRow)}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow('new-motregning')
        : (
          <Row>
            <Column>
              <Button
                variant='tertiary'
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:motregning').toLowerCase() })}
              </Button>
            </Column>
          </Row>
          )}
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column>
          <Button
            variant='tertiary'
            data-amplitude='svarsed.editor.seekontoopplysning'
            onClick={(e) => {
              buttonLogger(e)
              seeKontoopplysninger()
            }}
          >
            {t('label:oppgi-kontoopplysninger')}
          </Button>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='0.5' />
    </PaddedDiv>
  )
}

export default Motregning
