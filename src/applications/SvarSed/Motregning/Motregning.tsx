import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Checkbox, Label } from '@navikt/ds-react'
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
import { MainFormProps, MainFormSelector, mapState } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel2 from 'components/AddRemovePanel/AddRemovePanel2'
import DateInput from 'components/Forms/DateInput'
import FormText from 'components/Forms/FormText'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import TextArea from 'components/Forms/TextArea'
import { RepeatableRow, SpacedHr, TextAreaDiv } from 'components/StyledComponents'
import {
  AnmodningSvarType,
  Barn,
  BarnEllerFamilie,
  F002Sed,
  Motregning,
  Periode,
  ReplySed,
  Utbetalingshyppighet
} from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { periodeSort } from 'utils/sort'
import { hasNamespaceWithErrors } from 'utils/validation'
import { validateMotregning, ValidationMotregningProps } from './validation'

export type BarnaNameKeyMap = {[barnaName in string]: string}

export interface KeyAndYtelse {
  key1: string // it can be barn[0]/barn[1]/familie/etc
  key2: number | undefined // it is the motregninger array index (0, 1, etc) inside the key1 objecy
  ytelseNavn: string // used only when motregning is barna
  isChecked: boolean // boolean to signal that barna is checked (good to check/uncheck entries without cleaning ytelseNavn)
}

export interface KeyAndYtelseIndexes {
  index: string
  values?: Array<KeyAndYtelse>
}

const MotregningFC: React.FC<MainFormProps> = ({
  parentNamespace,
  setReplySed,
  replySed,
  personName
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: MainFormSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-motregning`
  const getId = (m: Motregning | undefined | null): string => m ? '[' + m.__type + ']-' + m?.startdato + '-' + (m?.sluttdato ?? '') : 'new'

  const [_allMotregnings, _setAllMotregnings] = useState<Array<Motregning>>([])
  const [_newMotregning, _setNewMotregning] = useState<Motregning | undefined>(undefined)
  const [_editMotregning, _setEditMotregning] = useState<Motregning | undefined>(undefined)

  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_editIndex, _setEditIndex] = useState<KeyAndYtelseIndexes | undefined>(undefined)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationMotregningProps>(validateMotregning, namespace)

  // Dictionary to convert barna keys (barn[0]) into names (Bart Simpson)
  const [_allBarnaNameKeys, _setAllBarnaNameKeys] = useState<BarnaNameKeyMap>({})

  const getPersonName = (b: Barn): string => b.personInfo.fornavn + ' ' + (b.personInfo?.etternavn ?? '')

  useEffect(() => {
    /**
      Structure of __type and __index for this sample ReplySed:

      barn: [{
        ...,
        motregning: [{
          date: 2000-2001,
          ytelseNavn: 'aaaa'
        }, {
          date: 2002-2003,
          ytelseNavn: 'bbbb'
        }, {
          date: 2004-2005,
          ytelseNavn: 'cccc'
       }
     }, {
       ...,
       motregning: [{
          date: 2002-2003,
          ytelseNavn: 'dddd'
       }
     },
     familie: {
       ...,
       motregning: [{
         date: 2010-2011
          ytelseNavn: 'yyyy'
       }, {
          date: 2012-
          ytelseNavn: 'zzzz'
       }]
     }

     Yields 5 motregnings:

     [{
       ...,
       __type: 'barn',
       __index: {
        index: 'barn-2000-2001',
        values: [{key1: barn[0]', key2, isChecked, ytelseNavn: 'aaa'}]
     }, {
        ...,
       __type: 'barn',
       __index' : {
         index: 'barn-2002-2003',
         values: [
          {key1: barn[0], key2: 1, isChecked, ytelseNavn: 'bbb'},
          {key1: barn[1], key2: 0, isChecked, ytelseNavn: 'dddd'}
        ]
     }, {
       ...,
       __type: 'barn',
       __index',
         index: 'barn-2004-2005',
         values: [{key1: barn[0], key2: 2, isChecked, ytelseNavn: 'ccc'}]
     },  {
        ...,
       __type: 'familie',
       __index' : {
         index: 'familie-2010-2011',
         values: [{key1: familie, key2: 0}]
     }, {
       __type: 'familie',
       __index' : {
         index: 'familie-2012-',
         values: [{key1: familie, key2: 1}]
     }]
     */

    const newKeyAndYtelseMap: {[motregningKey in string]: Motregning} = {}
    /** sample of allBarnaNameKeys
      {
        'barn[0]': 'bart simpson',
        'barn[1]': 'lisa simpson'
      }
     */
    const newAllBarnaNameKeys: BarnaNameKeyMap = {};

    (replySed as F002Sed).barn?.forEach((barn: Barn, barnIndex: number) => {
      newAllBarnaNameKeys['barn[' + barnIndex + ']'] = getPersonName(barn)
      barn.motregninger?.forEach((motregning: Motregning, motregningIndex: number) => {
        const _motregning: Motregning = _.cloneDeep(motregning)
        const motregningKey = getId({
          ..._motregning,
          __type: 'barn'
        })

        // ytelseNavn can be different for different barn, so store it on __index.values
        const ytelseNavn: string = _motregning.ytelseNavn ?? ''
        delete _motregning.ytelseNavn

        if (!Object.prototype.hasOwnProperty.call(newKeyAndYtelseMap, motregningKey)) {
          const values: Array<KeyAndYtelse> = [{
            key1: 'barn[' + barnIndex + ']',
            key2: motregningIndex,
            isChecked: true,
            ytelseNavn
          }]
          newKeyAndYtelseMap[motregningKey] = {
            ..._motregning,
            __type: 'barn' as BarnEllerFamilie,
            __index: {
              index: motregningKey,
              values
            } as KeyAndYtelseIndexes
          }
        } else {
          // append key
          const currentIndex: KeyAndYtelseIndexes = newKeyAndYtelseMap[motregningKey].__index
          currentIndex.values!.push({
            key1: 'barn[' + barnIndex + ']',
            key2: motregningIndex,
            isChecked: true,
            ytelseNavn
          })
          // should be enough to sort by key1, since one motregning only exists at least once on each barn[0]/barn[1]/etc
          currentIndex.values = currentIndex.values!.sort(
            (a: KeyAndYtelse, b: KeyAndYtelse) => a.key1.localeCompare(b.key1))
          newKeyAndYtelseMap[motregningKey] = {
            ..._motregning,
            __index: currentIndex
          }
        }
      })
    });

    (replySed as F002Sed).familie?.motregninger?.forEach((motregning: Motregning, motregningIndex: number) => {
      const _motregning: Motregning = _.cloneDeep(motregning)
      const motregningKey = getId({
        ...motregning,
        __type: 'familie' as BarnEllerFamilie
      })

      newKeyAndYtelseMap[motregningKey] = {
        ..._motregning,
        __type: 'familie' as BarnEllerFamilie,
        __index: {
          inxex: motregningKey,
          values: [{
            key1: 'familie',
            key2: motregningIndex
          }]
        }
      }
    })

    _setAllBarnaNameKeys(newAllBarnaNameKeys)
    const allMotregnings: Array<Motregning> = []
    Object.keys(newKeyAndYtelseMap).sort(
      (keyA: string, keyB: string) => periodeSort(newKeyAndYtelseMap[keyA], newKeyAndYtelseMap[keyB])
    ).forEach(key => {
      allMotregnings.push(newKeyAndYtelseMap[key])
    })
    _setAllMotregnings(allMotregnings)
  }, [replySed])

  const setBegrunnelse = (begrunnelse: string, index: number) => {
    if (index < 0) {
      _setNewMotregning({
        ..._newMotregning,
        begrunnelse
      } as Motregning)
      _resetValidation(namespace + '-begrunnelse')
      return
    }
    _setEditMotregning({
      ..._editMotregning,
      begrunnelse
    } as Motregning)
    _resetValidation(namespace + '[' + _editMotregning?.__index.index + ']-begrunnelse')
  }

  const setBeløp = (newBeløp: string, index: number) => {
    if (index < 0) {
      _setNewMotregning({
        ..._newMotregning,
        beloep: newBeløp.trim().trim(),
        valuta: _.isNil(_newMotregning?.valuta) ? 'NOK' : _newMotregning?.valuta
      } as Motregning)
      _resetValidation(namespace + '-beloep')
      return
    }
    _setEditMotregning({
      ..._editMotregning,
      beloep: newBeløp.trim().trim(),
      valuta: _.isNil(_editMotregning?.valuta) ? 'NOK' : _editMotregning?.valuta
    } as Motregning)
    dispatch(resetValidation(namespace + '[' + _editMotregning?.__index.index + ']-beloep'))
    dispatch(resetValidation(namespace + '[' + _editMotregning?.__index.index + ']-valuta'))
  }

  const setMottakersNavn = (mottakersNavn: string, index: number) => {
    if (index < 0) {
      _setNewMotregning({
        ..._newMotregning,
        mottakersNavn
      } as Motregning)
      _resetValidation(namespace + '-mottakersNavn')
      return
    }
    _setEditMotregning({
      ..._editMotregning,
      mottakersNavn
    } as Motregning)
    _resetValidation(namespace + '[' + _editMotregning?.__index.index + ']-mottakersNavn')
  }

  const setSvarType = (svarType: string, index: number) => {
    if (index < 0) {
      _setNewMotregning({
        ..._newMotregning,
        svarType
      } as Motregning)
      _resetValidation(namespace + '-svarType')
      return
    }
    _setEditMotregning({
      ..._editMotregning,
      svarType
    } as Motregning)
    _resetValidation(namespace + '[' + _editMotregning?.__index.index + ']-svarType')
  }

  const setUtbetalingshyppighet = (utbetalingshyppighet: string, index: number) => {
    if (index < 0) {
      _setNewMotregning({
        ..._newMotregning,
        utbetalingshyppighet
      } as Motregning)
      _resetValidation(namespace + '-utbetalingshyppighet')
      return
    }
    _setEditMotregning({
      ..._editMotregning,
      utbetalingshyppighet
    } as Motregning)
    _resetValidation(namespace + '[' + _editMotregning?.__index.index + ']-utbetalingshyppighet')
  }

  const setValuta = (valuta: Currency, index: number) => {
    if (index < 0) {
      _setNewMotregning({
        ..._newMotregning,
        valuta: valuta.value
      } as Motregning)
      _resetValidation(namespace + '-valuta')
      return
    }
    _setEditMotregning({
      ..._editMotregning,
      valuta: valuta.value
    } as Motregning)
    _resetValidation(namespace + '[' + _editMotregning?.__index.index + ']-valuta')
  }

  const setVedtaksDato = (vedtaksdato: string, index: number) => {
    if (index < 0) {
      _setNewMotregning({
        ..._newMotregning,
        vedtaksdato
      } as Motregning)
      _resetValidation(namespace + '-vedtaksdato')
      return
    }
    _setEditMotregning({
      ..._editMotregning,
      vedtaksdato
    } as Motregning)
    _resetValidation(namespace + '[' + _editMotregning?.__index.index + ']-vedtaksdato')
  }

  const setYtterligereInfo = (ytterligereInfo: string, index: number) => {
    if (index < 0) {
      _setNewMotregning({
        ..._newMotregning,
        ytterligereInfo
      } as Motregning)
      _resetValidation(namespace + '-ytterligereInfo')
      return
    }
    _setEditMotregning({
      ..._editMotregning,
      ytterligereInfo
    } as Motregning)
    _resetValidation(namespace + '[' + _editMotregning?.__index.index + ']-ytterligereInfo')
  }

  const setPeriode = (periode: Motregning, index: number) => {
    if (index < 0) {
      _setNewMotregning(periode)
      _resetValidation(namespace + '-startdato')
      _resetValidation(namespace + '-sluttdato')
      return
    }
    _setEditMotregning(periode)
    _resetValidation(namespace + '[' + _editMotregning?.__index.index + ']-startdato')
    _resetValidation(namespace + '[' + _editMotregning?.__index.index + ']-sluttdato')
  }

  const setType = (type: BarnEllerFamilie, index: number) => {
    if (index < 0) {
      _setNewMotregning({
        ..._newMotregning,
        __type: type
      } as Motregning)
      _resetValidation(namespace + '-type')
      return
    }
    _setEditMotregning({
      ..._editMotregning,
      __type: type
    } as Motregning)
    _resetValidation(namespace + '[' + _editMotregning?.__index + ']-type')
  }

  const checkKey = (key1: string, checked: boolean, index: number) => {
    if (index < 0) {
      _setNewMotregning({
        ..._newMotregning,
        __index: {
          ..._newMotregning?.__index,
          values: _newMotregning?.__index.values.map((k: KeyAndYtelse) => {
            if (k.key1 === key1) {
              return { ...k, isChecked: checked }
            }
            return k
          })
        }
      } as Motregning)
      return
    }

    _setEditMotregning({
      ..._editMotregning,
      __index: {
        ..._editMotregning?.__index,
        values: _editMotregning?.__index.values.map((k: KeyAndYtelse) => {
          if (k.key1 === key1) {
            return { ...k, isChecked: checked }
          }
          return k
        })
      }
    } as Motregning)
  }

  const setYtelseNavnForBarna = (key1: string, ytelseNavn: string, index: number) => {
    if (index < 0) {
      _setNewMotregning({
        ..._newMotregning,
        __index: {
          ..._newMotregning?.__index,
          values: _newMotregning?.__index.values.map((k: KeyAndYtelse) => {
            if (k.key1 === key1) {
              return { ...k, ytelseNavn }
            }
            return k
          })
        }
      } as Motregning)
      return
    }
    _setEditMotregning({
      ..._editMotregning,
      __index: {
        ..._editMotregning?.__index,
        values: _editMotregning?.__index.values.map((k: KeyAndYtelse) => {
          if (k.key1 === key1) {
            return { ...k, ytelseNavn }
          }
          return k
        })
      }
    } as Motregning)
  }

  const setYtelseNavnForFamilie = (ytelseNavn: string, index: number) => {
    if (index < 0) {
      _setNewMotregning({
        ..._newMotregning,
        ytelseNavn
      } as Motregning)
      _resetValidation(namespace + '-ytelseNavn')
      return
    }
    _setEditMotregning({
      ..._editMotregning,
      ytelseNavn
    } as Motregning)
    _resetValidation(namespace + '[' + _editMotregning?.__index + ']-ytelseNavn')
  }

  const onCloseEdit = (namespace: string) => {
    _setEditMotregning(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewMotregning(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (motregning: Motregning) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + _editIndex))
    }
    _setEditMotregning(motregning)
    _setEditIndex(_editMotregning?.__index.index)
  }

  // in order to remove motregning, check __index.values for all the keys where this motreging "lives" for now,
  const onRemove = (motregning: Motregning) => {
    const newReplySed: ReplySed = _.cloneDeep(replySed) as ReplySed
    motregning?.__index.values?.forEach((keyAndYtelse: KeyAndYtelse) => {
      const newMotregninger: Array<Motregning> = _.get(newReplySed, keyAndYtelse.key1 + '.motregninger')
      newMotregninger.splice(keyAndYtelse.key2!, 1)
      _.set(newReplySed, keyAndYtelse.key1 + '.motregninger', newMotregninger)
    })
    dispatch(setReplySed(newReplySed))
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      motregning: _newMotregning,
      formalName: personName
    })
    if (!!_newMotregning && valid) {
      // create the version that will be added, with no aux props
      const newNewMotregning = _.cloneDeep(_newMotregning)
      delete newNewMotregning.__type
      delete newNewMotregning.__index

      const newReplySed: ReplySed = _.cloneDeep(replySed) as ReplySed

      if (_newMotregning?.__type === 'familie') {
        let newMotregninger: Array<Motregning> | undefined = _.get(newReplySed, 'familie.motregninger')
        if (_.isNil(newMotregninger)) {
          newMotregninger = []
        }
        newMotregninger.push(newNewMotregning)
        newMotregninger = newMotregninger.sort(periodeSort)
        _.set(newReplySed, 'familie.motregninger', newMotregninger)
      }
      if (_newMotregning?.__type === 'barn') {
        // I have to iterate through keyAndYtelses to fill up the necessary ytelseNavn, and know where to add it

        _newMotregning?.__index?.values?.forEach((keyAndYtelse: KeyAndYtelse) => {
          // for new motregnings (we are adding a new one), key2 is undefined
          if (keyAndYtelse.isChecked) {
            let newMotregninger: Array<Motregning> | undefined = _.get(newReplySed, keyAndYtelse.key1 + '.motregninger')
            if (_.isNil(newMotregninger)) {
              newMotregninger = []
            }
            newMotregninger.push({
              ...newNewMotregning,
              ytelseNavn: keyAndYtelse.ytelseNavn
            })
            newMotregninger = newMotregninger.sort(periodeSort)
            _.set(newReplySed, keyAndYtelse.key1 + '.motregninger', newMotregninger)
          }
        })
      }
      dispatch(setReplySed(newReplySed))
      onCloseNew()
    }
  }

  const onSaveEdit = () => {
    const [valid, newValidation] = performValidation<ValidationMotregningProps>(
      validation, namespace, validateMotregning, {
        motregning: _editMotregning,
        formalName: personName
      })

    if (!!_editMotregning && valid) {
      const newReplySed: ReplySed = _.cloneDeep(replySed) as ReplySed

      // the easiest is to:
      // 1) delete all instances of this motregning, using _editIndex.values (which was set BEFORE editing started)
      // 2) add all instances of this motregning, using the _editMotregning.__index.values (which was changed DURING editing)

      // 1) delete
      _editIndex?.values?.forEach((keyAndYtelse: KeyAndYtelse) => {
        const newMotregninger: Array<Motregning> = _.get(newReplySed, keyAndYtelse.key1 + '.motregninger')
        newMotregninger.splice(keyAndYtelse.key2!, 1)
        _.set(newReplySed, keyAndYtelse.key1 + '.motregninger', newMotregninger)
      })

      // 2) add
      // create the version that will be added, with no aux props
      const newEditMotregning = _.cloneDeep(_editMotregning)
      delete newEditMotregning.__type
      delete newEditMotregning.__index

      if (_editMotregning?.__type === 'familie') {
        let newMotregninger: Array<Motregning> | undefined = _.get(newReplySed, 'familie.motregninger')
        if (_.isNil(newMotregninger)) {
          newMotregninger = []
        }
        newMotregninger.push(newEditMotregning)
        newMotregninger = newMotregninger.sort(periodeSort)
        _.set(newReplySed, 'familie.motregninger', newMotregninger)
      }
      if (_editMotregning?.__type === 'barn') {
        // I have to iterate through keyAndYtelses to fill up the necessary ytelseNavn, and know where to add it

        _editMotregning?.__index?.values?.forEach((keyAndYtelse: KeyAndYtelse) => {
          if (keyAndYtelse.isChecked === true) {
            let newMotregninger: Array<Motregning> | undefined = _.get(newReplySed, keyAndYtelse.key1 + '.motregninger')
            if (_.isNil(newMotregninger)) {
              newMotregninger = []
            }
            newMotregninger.push({
              ...newEditMotregning,
              ytelseNavn: keyAndYtelse.ytelseNavn
            })
            newMotregninger = newMotregninger.sort(periodeSort)
            _.set(newReplySed, keyAndYtelse.key1 + '.motregninger', newMotregninger)
          }
        })
      }
      dispatch(setReplySed(newReplySed))
      onCloseEdit(namespace + _editIndex?.index)
    } else {
      dispatch(setValidation(newValidation))
    }
  }

  const renderRow = (motregning: Motregning | null, index: number) => {
    // replace index order from map (which is "ruined" by a sort) with real index from motregning.__index.index
    const idx: string = index < 0 ? '' : motregning?.__index?.index
    const _namespace = namespace + idx
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex?.index === idx
    const _motregning = index < 0 ? _newMotregning : (inEditMode ? _editMotregning : motregning)

    const addremovepanel = (
      <AddRemovePanel2<Motregning>
        item={motregning}
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

    if (inEditMode) {
      return (
        <RepeatableRow
          id={'repeatablerow-' + _namespace}
          key={getId(motregning)}
          className={classNames({
            new: index < 0,
            error: hasNamespaceWithErrors(_v, _namespace)
          })}
        >
          <VerticalSeparatorDiv size='0.5' />
          <AlignStartRow>
            <Column flex='2'>
              <RadioPanelGroup
                value={_motregning?.svarType}
                data-multiple-line
                data-no-border
                data-testid={_namespace + '-svarType'}
                error={_v[_namespace + '-svarType']?.feilmelding}
                id={_namespace + '-svarType'}
                key={_namespace + '-svarType-' + _motregning?.svarType}
                legend={t('label:anmodning-om-motregning')}
                name={_namespace + '-svarType'}
                onChange={(e: string) => setSvarType(e as AnmodningSvarType, index)}
              >
                <FlexRadioPanels>
                  <RadioPanel value='anmodning_om_motregning_per_barn'>{t('label:anmodning')}</RadioPanel>
                  <RadioPanel value='svar_på_anmodning_om_motregning_per_barn'>{t('label:anmodning-svar')}</RadioPanel>
                </FlexRadioPanels>
              </RadioPanelGroup>
            </Column>
            <Column />
          </AlignStartRow>
          <VerticalSeparatorDiv />
          <AlignStartRow>
            <Column flex='2'>
              <RadioPanelGroup
                value={_motregning?.__type}
                data-no-border
                data-testid={_namespace + '-type'}
                error={_v[_namespace + '-type']?.feilmelding}
                id={_namespace + '-type'}
                key={_namespace + '-type-' + _motregning?.__type}
                legend={t('label:barna-or-familie') + ' *'}
                name={_namespace + '-type'}
                onChange={(type: string) => setType(type as BarnEllerFamilie, index)}
              >
                <FlexRadioPanels>
                  <RadioPanel value='barn'>{t('label:barn')}</RadioPanel>
                  <RadioPanel value='familie'>{t('label:familien')}</RadioPanel>
                </FlexRadioPanels>
              </RadioPanelGroup>
            </Column>
            <Column />
          </AlignStartRow>
          <VerticalSeparatorDiv />
          {_motregning?.__type === 'barna' && (
            <>
              <PaddedHorizontallyDiv>
                <AlignStartRow>
                  <Column>
                    <Label>
                      {t('label:velg-barn-som-motregning')}
                    </Label>
                  </Column>
                  <Column>
                    <Label>
                      {t('label:betegnelse-på-ytelse')}
                    </Label>
                  </Column>
                  <Column />
                </AlignStartRow>
              </PaddedHorizontallyDiv>
              <VerticalSeparatorDiv />
              {Object.keys(_allBarnaNameKeys)?.map(barnaKey => {
                const matchedKeyAndYtelseIndex: number = _.findIndex(_motregning?.__index.values,
                  (value: KeyAndYtelse) => value.key1 === barnaKey)
                const matchedKeyAndYtelse: KeyAndYtelse | undefined = matchedKeyAndYtelseIndex < 0
                  ? undefined
                  : _motregning?.__index.values[matchedKeyAndYtelseIndex]
                const ytelseIdx = getIdx(matchedKeyAndYtelseIndex)
                return (
                  <PaddedHorizontallyDiv key={barnaKey}>
                    <AlignStartRow>
                      <Column>
                        <Checkbox
                          checked={!_.isUndefined(matchedKeyAndYtelse) && matchedKeyAndYtelse.isChecked === true}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => checkKey(barnaKey, e.target.checked, index)}
                        >
                          {_allBarnaNameKeys[barnaKey]}
                        </Checkbox>
                      </Column>
                      <Column>
                        <Input
                          disabled={_.isUndefined(matchedKeyAndYtelse) || matchedKeyAndYtelse.isChecked === false}
                          error={_v[_namespace + '-ytelse' + ytelseIdx + '-ytelseNavn']?.feilmelding}
                          id='ytelseNavn'
                          key={_namespace + '-ytelseNavn-' + matchedKeyAndYtelse?.ytelseNavn}
                          label={t('label:betegnelse-på-ytelse')}
                          namespace={_namespace}
                          onChanged={(newYtelseNavn: string) => setYtelseNavnForBarna(barnaKey, newYtelseNavn, index)}
                          required
                          value={matchedKeyAndYtelse?.ytelseNavn}
                        />
                      </Column>
                      <Column />
                    </AlignStartRow>
                  </PaddedHorizontallyDiv>
                )
              })}
            </>
          )}
          {_motregning?.__type === 'familie' && (
            <AlignStartRow>
              <Column>
                <Input
                  error={_v[_namespace + '-ytelseNavn']?.feilmelding}
                  id='ytelseNavn'
                  key={_namespace + '-ytelseNavn-' + _motregning?.ytelseNavn}
                  label={t('label:betegnelse-på-ytelse')}
                  namespace={_namespace}
                  onChanged={(newYtelseNavn: string) => setYtelseNavnForFamilie(newYtelseNavn, index)}
                  required
                  value={_motregning?.ytelseNavn}
                />
              </Column>
            </AlignStartRow>
          )}
          <VerticalSeparatorDiv />
          <Label>
            {t('label:informasjon-om-familieytelser')}
          </Label>
          <VerticalSeparatorDiv />
          <AlignStartRow>
            <Column>
              <DateInput
                error={_v[_namespace + '-vedtaksdato']?.feilmelding}
                id='vedtaksdato'
                key={_namespace + '-vedtaksdato-' + _motregning?.vedtaksdato}
                label={t('label:vedtaksdato')}
                namespace={_namespace}
                onChanged={(newVedtaksdato) => setVedtaksDato(newVedtaksdato, index)}
                required
                value={_motregning?.vedtaksdato}
              />
            </Column>
            <Column>
              <Input
                error={_v[_namespace + '-beloep']?.feilmelding}
                id='beloep'
                key={_namespace + '-beloep-' + _motregning?.beloep}
                label={t('label:beløp')}
                namespace={_namespace}
                onChanged={(newBeløp: string) => setBeløp(newBeløp, index)}
                required
                value={_motregning?.beloep}
              />
            </Column>
            <Column>
              <CountrySelect
                ariaLabel={t('label:valuta')}
                closeMenuOnSelect
                data-testid={_namespace + '-valuta'}
                error={_v[_namespace + '-valuta']?.feilmelding}
                id={_namespace + '-valuta'}
                key={_namespace + '-valuta-' + _motregning?.valuta}
                label={t('label:valuta') + ' *'}
                locale='nb'
                menuPortalTarget={document.body}
                onOptionSelected={(newValuta: Currency) => setValuta(newValuta, index)}
                type='currency'
                values={_motregning?.valuta}
              />
            </Column>
            <Column />
          </AlignStartRow>
          <VerticalSeparatorDiv />
          <AlignStartRow>
            <PeriodeInput
              namespace={_namespace}
              error={{
                startdato: _v[_namespace + '-startdato']?.feilmelding,
                sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
              }}
              label={{
                startdato: t('label:startdato') + ' (' + t('label:innvilgelse').toLowerCase() + ') *',
                sluttdato: t('label:sluttdato') + ' (' + t('label:innvilgelse').toLowerCase() + ') *'
              }}
              periodeType='simple'
              setPeriode={(newPeriode: Periode) => setPeriode(newPeriode, index)}
              value={_motregning}
            />
            <Column flex='2'>
              <RadioPanelGroup
                value={_motregning?.utbetalingshyppighet}
                data-no-border
                data-testid={_namespace + '-utbetalingshyppighet'}
                id={_namespace + '-utbetalingshyppighet'}
                key={_namespace + '-utbetalingshyppighet-' + _motregning?.utbetalingshyppighet}
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
            <Column />
          </AlignStartRow>
          <VerticalSeparatorDiv />
          <AlignStartRow>
            <Column flex='2'>
              <Input
                error={_v[_namespace + '-mottakersNavn']?.feilmelding}
                namespace={_namespace}
                id='mottakersNavn'
                key={_namespace + '-mottakersNavn-' + _motregning?.mottakersNavn}
                label={t('label:mottakers-navn')}
                onChanged={(newMottakersNavn: string) => setMottakersNavn(newMottakersNavn, index)}
                required
                value={_motregning?.mottakersNavn}
              />
            </Column>
            <Column />
          </AlignStartRow>
          <VerticalSeparatorDiv />
          <AlignStartRow>
            <Column flex='2'>
              <TextAreaDiv>
                <TextArea
                  error={_v[_namespace + '-begrunnelse']?.feilmelding}
                  namespace={_namespace}
                  id='begrunnelse'
                  key={_namespace + '-begrunnelse-' + _motregning?.begrunnelse}
                  label={t('label:anmodning-grunner')}
                  onChanged={(newBegrunnelse: string) => setBegrunnelse(newBegrunnelse, index)}
                  value={_motregning?.begrunnelse}
                />
              </TextAreaDiv>
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
          <AlignStartRow>
            <Column flex='2'>
              <TextAreaDiv>
                <TextArea
                  error={_v[_namespace + '-ytterligereInfo']?.feilmelding}
                  namespace={_namespace}
                  id='ytterligereInfo'
                  key={_namespace + '-ytterligereInfo-' + _motregning?.ytterligereInfo}
                  label={t('label:ytterligere-informasjon')}
                  onChanged={(newYtterligereInfo: string) => setYtterligereInfo(newYtterligereInfo, index)}
                  value={_motregning?.ytterligereInfo}
                />
              </TextAreaDiv>
            </Column>
            <AlignEndColumn>
              {addremovepanel}
            </AlignEndColumn>
          </AlignStartRow>
          <VerticalSeparatorDiv size='0.5' />
        </RepeatableRow>
      )
    }

    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getId(motregning)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow>
          <Column>
            <FormText error={_v[_namespace + '-svarType']?.feilmelding}>
              {_motregning?.svarType}
            </FormText>
          </Column>

          <Column>
            <FormText error={_v[_namespace + '-type']?.feilmelding}>
              {t('label:' + _motregning?.__type)}
            </FormText>
          </Column>
        </AlignStartRow>
        {_motregning?.__type === 'barna' && Object.keys(_allBarnaNameKeys)?.map(barnaKey => {
          const matchedKeyAndYtelseIndex: number = _.findIndex(_motregning?.__index.values,
            (value: KeyAndYtelse) => value.key1 === barnaKey)
          const matchedKeyAndYtelse: KeyAndYtelse | undefined = matchedKeyAndYtelseIndex < 0
            ? undefined
            : _motregning?.__index.values[matchedKeyAndYtelseIndex]
          const ytelseIdx = getIdx(matchedKeyAndYtelseIndex)
          if (!matchedKeyAndYtelse) {
            return null
          }
          return (
            <PaddedHorizontallyDiv key={barnaKey}>
              <AlignStartRow>
                <Column>
                  <FormText error={_v[_namespace + '-svarType']?.feilmelding}>
                    {_allBarnaNameKeys[barnaKey]}:
                  </FormText>
                  <FormText error={_v[_namespace + '-ytelse' + ytelseIdx + '-ytelseNavn']?.feilmelding}>
                    {matchedKeyAndYtelse?.ytelseNavn}
                  </FormText>
                </Column>
              </AlignStartRow>
            </PaddedHorizontallyDiv>
          )
        })}
        {_motregning?.__type === 'familie' && (
          <AlignStartRow>
            <Column>
              <FormText error={_v[_namespace + '-svarType']?.feilmelding}>
                {t('label:familie') + ': '}
              </FormText>
              <FormText error={_v[_namespace + '-ytelseNavn']?.feilmelding}>
                {_motregning?.ytelseNavn}
              </FormText>
            </Column>
          </AlignStartRow>
        )}
        <VerticalSeparatorDiv />
        <Label>
          {t('label:informasjon-om-familieytelser')}
        </Label>
        <AlignStartRow>
          <Column>
            <FormText error={_v[_namespace + '-vedtaksdato']?.feilmelding}>
              {_motregning?.vedtaksdato}
            </FormText>
          </Column>
          <Column>
            <FlexDiv>
              <Label>{t('label:beløp') + ':'}</Label>
              <HorizontalSeparatorDiv size='0.5' />
              <FlexDiv>
                <FormText error={_v[_namespace + '-beloep']}>
                  {_motregning?.beloep}
                </FormText>
                <HorizontalSeparatorDiv size='0.5' />
                <FormText error={_v[_namespace + '-valuta']}>
                  {_motregning?.valuta}
                </FormText>
              </FlexDiv>
            </FlexDiv>
          </Column>
        </AlignStartRow>
        <AlignStartRow>
          <PeriodeText
            error={{
              startdato: _v[_namespace + '-startdato'],
              sluttdato: _v[_namespace + '-sluttdato']
            }}
            periode={_motregning}
          />
          <Column>
            <FormText error={_v[_namespace + '-vedtaksdato']?.feilmelding}>
              {_motregning?.vedtaksdato}
            </FormText>
          </Column>
          <Column>
            <FormText error={_v[_namespace + '-utbetalingshyppighet']?.feilmelding}>
              {_motregning?.utbetalingshyppighet}
            </FormText>
          </Column>
        </AlignStartRow>
        <AlignStartRow>
          <Column>
            <FormText error={_v[_namespace + '-mottakersNavn']?.feilmelding}>
              {_motregning?.mottakersNavn}
            </FormText>
          </Column>
          <Column>
            <FormText error={_v[_namespace + '-begrunnelse']?.feilmelding}>
              {_motregning?.begrunnelse}
            </FormText>
          </Column>
        </AlignStartRow>
        <AlignStartRow>
          <Column>
            <FormText error={_v[_namespace + '-ytterligereInfo']?.feilmelding}>
              {_motregning?.ytterligereInfo}
            </FormText>
          </Column>
          <AlignEndColumn>
            {addremovepanel}
          </AlignEndColumn>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <>
      {_.isEmpty(_allMotregnings)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-motregning')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : _allMotregnings?.map(renderRow)}
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
              {t('el:button-add-new-x', { x: t('label:motregning').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
    </>
  )
}

export default MotregningFC
