import Add from 'assets/icons/Add'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import ArbeidsgiverBox from 'components/Arbeidsgiver/ArbeidsgiverBox'
import ArbeidsgiverSøk from 'components/Arbeidsgiver/ArbeidsgiverSøk'
import Input from 'components/Forms/Input'
import Period, { toFinalDateFormat } from 'components/Period/Period'
import { AlignStartRow } from 'components/StyledComponents'
import { Periode, ReplySed } from 'declarations/sed'
import { Arbeidsgiver, Arbeidsperioder } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import moment from 'moment'
import { Systemtittel, Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastKnapp,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getIdx } from 'utils/namespace'
import {
  validateArbeidsgiver,
  validateArbeidsperiode,
  ValidationArbeidsgiverProps,
  ValidationArbeidsperiodeProps
} from './ansattValidation'

export interface AnsattProps {
  arbeidsperioder: Arbeidsperioder
  getArbeidsperioder: () => void
  gettingArbeidsperioder: boolean
  parentNamespace: string
  replySed: ReplySed
  personID: string
  updateReplySed: (needle: string, value: any) => void
}

const Ansatt: React.FC<AnsattProps> = ({
  arbeidsperioder,
  getArbeidsperioder,
  gettingArbeidsperioder,
  parentNamespace,
  personID,
  replySed,
  updateReplySed
}: AnsattProps) => {
  const { t } = useTranslation()
  const namespace = `${parentNamespace}-ansatt`
  const target = `${personID}.perioderSomAnsatt`
  const perioderSomAnsatt: Array<Periode> | undefined = _.get(replySed, target)

  const [_addedArbeidsperioder, setAddedArbeidsperioder] = useState<Arbeidsperioder>(() => ({
    arbeidsperioder: [],
    uriArbeidsgiverRegister: '',
    uriInntektRegister: ''
  }))

  // arbeidsgivere
  const [_newArbeidsgiverStartDato, _setNewArbeidsgiverStartDato] = useState<string>('')
  const [_newArbeidsgiverSluttDato, _setNewArbeidsgiverSluttDato] = useState<string>('')
  const [_newArbeidsgiverOrgnr, _setNewArbeidsgiverOrgnr] = useState<string>('')
  const [_newArbeidsgiverNavn, _setNewArbeidsgiverNavn] = useState<string>('')
  const [_seeNewArbeidsgiver, _setSeeNewArbeidsgiver] = useState<boolean>(false)
  const [_validationArbeidsgiver, _resetValidationArbeidsgiver, performValidationArbeidsgiver] =
    useValidation<ValidationArbeidsgiverProps>({}, validateArbeidsgiver)

  // periode
  const [_newPeriodeStartDato, _setNewPeriodeStartDato] = useState<string>('')
  const [_newPeriodeSluttDato, _setNewPeriodeSluttDato] = useState<string>('')
  const [_seeNewPeriode, _setSeeNewPeriode] = useState<boolean>(false)
  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Periode>((periode: Periode) => periode.startdato)
  const [_validationPeriode, _resetValidationPeriode, performValidationPeriode] =
    useValidation<ValidationArbeidsperiodeProps>({}, validateArbeidsperiode)

  const addPeriode = (newPeriode: Periode) => {
    let newPerioder: Array<Periode> | undefined = _.cloneDeep(perioderSomAnsatt)
    if (!newPerioder) {
      newPerioder = []
    }
    newPerioder = newPerioder.concat(newPeriode).sort((a, b) =>
      moment(a.startdato).isSameOrBefore(moment(b.startdato)) ? -1 : 1
    )
    updateReplySed(target, newPerioder)
  }

  const addPeriodeFromArbeidsgiver = (selectedArbeidsgiver: Arbeidsgiver) => {
    const newPeriode: Periode = {
      startdato: toFinalDateFormat(selectedArbeidsgiver.fraDato)
    }
    if (selectedArbeidsgiver.tilDato) {
      newPeriode.sluttdato = toFinalDateFormat(selectedArbeidsgiver.tilDato)
    } else {
      newPeriode.aapenPeriodeType = 'åpen_sluttdato'
    }
    addPeriode(newPeriode)
  }

  const removePeriode = (deletedPeriode: Periode) => {
    let newPerioder: Array<Periode> | undefined = _.cloneDeep(perioderSomAnsatt)
    if (!newPerioder) {
      newPerioder = []
    }
    newPerioder = _.filter(newPerioder, p => p.startdato !== deletedPeriode.startdato)
    updateReplySed(target, newPerioder)
  }

  const removePeriodeFromArbeidsgiver = (deletedArbeidsgiver: Arbeidsgiver) => {
    let newPerioder: Array<Periode> | undefined = _.cloneDeep(perioderSomAnsatt)
    if (!newPerioder) {
      newPerioder = []
    }
    newPerioder = _.filter(newPerioder, p => p.startdato !== deletedArbeidsgiver.fraDato)
    updateReplySed(target, newPerioder)
  }

  const onArbeidsgiverSelect = (arbeidsgiver: Arbeidsgiver, checked: boolean) => {
    if (checked) {
      addPeriodeFromArbeidsgiver(arbeidsgiver)
    } else {
      removePeriodeFromArbeidsgiver(arbeidsgiver)
    }
  }

  const onArbeidsgiverEdit = (arbeidsgiver: Arbeidsgiver) => {
    const newAddedArbeidsperioder: Arbeidsperioder = _.cloneDeep(_addedArbeidsperioder)
    if (newAddedArbeidsperioder) {
      const index = _.findIndex(newAddedArbeidsperioder.arbeidsperioder, a => a.arbeidsgiverOrgnr === arbeidsgiver.arbeidsgiverOrgnr)
      if (index >= 0) {
        newAddedArbeidsperioder.arbeidsperioder[index] = arbeidsgiver
        setAddedArbeidsperioder(newAddedArbeidsperioder)
      }
    }
  }

  const onArbeidsgiverDelete = (deletedArbeidsgiver: Arbeidsgiver) => {
    const newAddedArbeidsperioder: Arbeidsperioder = _.cloneDeep(_addedArbeidsperioder) as Arbeidsperioder
    newAddedArbeidsperioder.arbeidsperioder = _.filter(newAddedArbeidsperioder?.arbeidsperioder,
      (a: Arbeidsgiver) => a.arbeidsgiverOrgnr !== deletedArbeidsgiver.arbeidsgiverOrgnr)
    setAddedArbeidsperioder(newAddedArbeidsperioder)
  }

  const resetArbeidsgiverForm = () => {
    _setNewArbeidsgiverNavn('')
    _setNewArbeidsgiverOrgnr('')
    _setNewArbeidsgiverSluttDato('')
    _setNewArbeidsgiverStartDato('')
    _resetValidationArbeidsgiver()
  }

  const resetPeriodeForm = () => {
    _setNewPeriodeSluttDato('')
    _setNewPeriodeStartDato('')
    _resetValidationPeriode()
  }

  const onArbeidsgiverAdd = () => {
    const newArbeidsgiver: Arbeidsgiver = {
      arbeidsgiverNavn: _newArbeidsgiverNavn,
      arbeidsgiverOrgnr: _newArbeidsgiverOrgnr,
      fraDato: toFinalDateFormat(_newArbeidsgiverStartDato),
      tilDato: toFinalDateFormat(_newArbeidsgiverSluttDato),
      fraInntektsregistreret: '-',
      fraArbeidsgiverregisteret: '-'
    }

    const valid: boolean = performValidationArbeidsgiver({
      arbeidsgiver: newArbeidsgiver,
      namespace: namespace
    })

    if (valid) {
      const newAddedArbeidsperioder: Arbeidsperioder = _.cloneDeep(_addedArbeidsperioder)
      newAddedArbeidsperioder.arbeidsperioder = newAddedArbeidsperioder.arbeidsperioder.concat(newArbeidsgiver)
      setAddedArbeidsperioder(newAddedArbeidsperioder)
      resetArbeidsgiverForm()
    }
  }

  const onPeriodeAdd = () => {
    const newPeriode: Periode = {
      startdato: _newPeriodeStartDato.trim()
    }
    if (_newPeriodeSluttDato) {
      newPeriode.sluttdato = _newPeriodeSluttDato.trim()
    } else {
      newPeriode.aapenPeriodeType = 'åpen_sluttdato'
    }

    const valid: boolean = performValidationPeriode({
      periode: newPeriode,
      namespace: namespace
    })
    if (valid) {
      addPeriode(newPeriode)
      resetPeriodeForm()
    }
  }

  const onCancelArbeidsgiverClicked = () => {
    resetArbeidsgiverForm()
    _setSeeNewArbeidsgiver(!_seeNewArbeidsgiver)
  }

  const onCancelPeriodeClicked = () => {
    resetPeriodeForm()
    _setSeeNewPeriode(!_seeNewPeriode)
  }

  const onArbeidsgiverStartDatoChanged = (dato: string) => {
    _resetValidationArbeidsgiver(namespace + '-arbeidsgiver-startdato')
    _setNewArbeidsgiverStartDato(dato)
  }

  const onArbeidsgiverSluttDatoChanged = (dato: string) => {
    _resetValidationArbeidsgiver(namespace + '-arbeidsgiver-sluttdato')
    _setNewArbeidsgiverSluttDato(dato)
  }

  const onArbeidsgiverOrgnrChanged = (newOrg: string) => {
    _resetValidationArbeidsgiver(namespace + '-arbeidsgiver-orgnr')
    _setNewArbeidsgiverOrgnr(newOrg)
  }

  const onArbeidsgiverNameChanged = (newName: string) => {
    _resetValidationArbeidsgiver(namespace + '-arbeidsgiver-navn')
    _setNewArbeidsgiverNavn(newName)
  }

  const setPeriodeStartDato = (startdato: string, index: number) => {
    if (index < 0) {
      _setNewPeriodeStartDato(startdato.trim())
      _resetValidationPeriode(namespace + '-periode-startdato')
    } else {
      updateReplySed(`${target}[${index}].startdato`, startdato.trim())
      if (_validationPeriode[namespace + getIdx(index) + '-periode-startdato']) {
        _resetValidationPeriode(namespace + getIdx(index) + '-periode-startdato')
      }
    }
  }

  const setPeriodeSluttDato = (sluttdato: string, index: number) => {
    if (index < 0) {
      _setNewPeriodeSluttDato(sluttdato.trim())
      _resetValidationPeriode(namespace + '-periode-sluttdato')
    } else {
      let newPeriode: Array<Periode> | undefined = _.cloneDeep(perioderSomAnsatt)
      if (!newPeriode) {
        newPeriode = []
      }
      if (sluttdato === '') {
        delete newPeriode[index].sluttdato
        newPeriode[index].aapenPeriodeType = 'åpen_sluttdato'
      } else {
        delete newPeriode[index].aapenPeriodeType
        newPeriode[index].sluttdato = sluttdato.trim()
      }
      updateReplySed(target, newPeriode)
      if (_validationPeriode[namespace + getIdx(index) + '-periode-sluttdato']) {
        _resetValidationPeriode(namespace + getIdx(index) + '-periode-sluttdato')
      }
    }
  }

  // establish a render plan

  interface Item {
    type: 'arbeidsgiver' | 'addedArbeidsgiver' | 'periode'
    item: Periode | Arbeidsgiver,
    index: number | undefined // for period index, also tells when we math arbeidsgiver with period
    duplicate: boolean | undefined // so I can complain when addedArbeidsgiver conflict with existing ones

  }
  type Plan = Array<Item>

  const makeRenderPlan = () => {
    let plan: Plan = perioderSomAnsatt?.map((periode: Periode, index: number) => ({
      item: periode,
      type: 'periode',
      selected: undefined,
      duplicate: undefined,
      index: index
    })) || []

    const unmatchedArbeidsgiver: Array<Item> = []
    arbeidsperioder?.arbeidsperioder.forEach((arbeidsgiver: Arbeidsgiver) => {
      const foundIndex: number = _.findIndex(plan, p => (p.item as Periode).startdato === arbeidsgiver.fraDato)
      if (foundIndex >= 0) {
        // replace period with the arbeidsgiver, mark it as selected
        plan[foundIndex] = {
          item: arbeidsgiver,
          type: 'arbeidsgiver',
          duplicate: false,
          index: foundIndex
        }
      } else {
        unmatchedArbeidsgiver.push({
          item: arbeidsgiver,
          type: 'arbeidsgiver',
          duplicate: false,
          index: undefined
        })
      }
    })
    plan = plan.concat(unmatchedArbeidsgiver)

    const unmatchedAddedArbeidsgiver: Array<Item> = []
    _addedArbeidsperioder.arbeidsperioder.forEach((arbeidsgiver: Arbeidsgiver) => {
      const foundPeriodeIndex: number = _.findIndex(plan, (item: Item) => {
        return item.type === 'periode'
          ? (item.item as Periode).startdato === arbeidsgiver.fraDato
          : false // only match Periods
      })
      const foundArbeidsgiverIndex: number = _.findIndex(plan, (item: Item) => {
        return item.type === 'arbeidsgiver'
          ? (item.item as Arbeidsgiver).fraDato === arbeidsgiver.fraDato
          : false // only match Arbeidsgiver
      })

      if (foundPeriodeIndex >= 0) {
        // replace period with the arbeidsgiver, mark it as selected
        plan[foundPeriodeIndex] = {
          item: arbeidsgiver,
          type: 'addedArbeidsgiver',
          duplicate: false,
          index: foundPeriodeIndex
        }
      } else {
        unmatchedAddedArbeidsgiver.push({
          item: arbeidsgiver,
          type: 'addedArbeidsgiver',
          duplicate: foundArbeidsgiverIndex >= 0,
          index: undefined
        })
      }
    })

    plan = plan.concat(unmatchedAddedArbeidsgiver)

    return plan.sort((a: Item, b: Item) => {
      const startDatoA = a.type === 'periode' ? (a.item as Periode).startdato : (a.item as Arbeidsgiver).fraDato
      const startDatoB = b.type === 'periode' ? (b.item as Periode).startdato : (b.item as Arbeidsgiver).fraDato
      return moment(startDatoA, 'YYYY-MM-DD').isSameOrBefore(moment(startDatoB, 'YYYY-MM-DD')) ? -1 : 1
    })
  }

  const plan = makeRenderPlan()

  return (
    <>
      <Systemtittel>
        {t('label:aa-registeret')}
      </Systemtittel>
      <VerticalSeparatorDiv />
      <Undertittel>
        {t('label:registered-arbeidsperiode')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {_.isNil(arbeidsperioder) && (
        <Row>
          <Column>
            <ArbeidsgiverSøk
              gettingArbeidsperioder={gettingArbeidsperioder}
              getArbeidsperioder={getArbeidsperioder}
            />
          </Column>
        </Row>
      )}
      <VerticalSeparatorDiv />
      {plan?.map((item, i) => {
        let element: JSX.Element | null = null
        if (item.type === 'periode') {
          const idx = getIdx(item.index)
          const candidateForDeletion = !_.isNil(item.index) && item.index >= 0 ? isInDeletion(item.item as Periode) : false
          element = (
            <AlignStartRow className='slideInFromLeft'>
              <Period
                key={'' + (item.item as Periode).startdato + (item.item as Periode).sluttdato}
                namespace={namespace + idx + '-periode'}
                errorStartDato={_validationPeriode[namespace + idx + '-periode-startdato']?.feilmelding}
                errorSluttDato={_validationPeriode[namespace + idx + '-periode-sluttdato']?.feilmelding}
                setStartDato={(dato: string) => setPeriodeStartDato(dato, item.index!)}
                setSluttDato={(dato: string) => setPeriodeSluttDato(dato, item.index!)}
                valueStartDato={(item.item as Periode).startdato}
                valueSluttDato={(item.item as Periode).sluttdato}
              />
              <Column>
                <AddRemovePanel
                  candidateForDeletion={candidateForDeletion}
                  existingItem
                  marginTop
                  onBeginRemove={() => addToDeletion(item.item as Periode)}
                  onConfirmRemove={() => removePeriode(item.item as Periode)}
                  onCancelRemove={() => removeFromDeletion(item.item as Periode)}
                />
              </Column>
            </AlignStartRow>
          )
        }

        if (item.type === 'arbeidsgiver') {
          element = (
            <AlignStartRow className='slideInFromLeft'>
              <Column>
                <ArbeidsgiverBox
                  arbeidsgiver={(item.item as Arbeidsgiver)}
                  editable={false}
                  newArbeidsgiver={false}
                  selected={!_.isNil(item.index) && item.index >= 0}
                  key={(item.item as Arbeidsgiver).arbeidsgiverOrgnr}
                  onArbeidsgiverSelect={onArbeidsgiverSelect}
                  namespace={namespace}
                />
              </Column>
            </AlignStartRow>
          )
        }

        if (item.type === 'addedArbeidsgiver') {
          element = (
            <AlignStartRow className='slideInFromLeft'>
              <Column>
                <ArbeidsgiverBox
                  arbeidsgiver={(item.item as Arbeidsgiver)}
                  editable
                  error={item.duplicate}
                  newArbeidsgiver
                  selected={!_.isNil(item.index) && item.index >= 0}
                  key={(item.item as Arbeidsgiver).arbeidsgiverOrgnr}
                  onArbeidsgiverSelect={onArbeidsgiverSelect}
                  onArbeidsgiverDelete={onArbeidsgiverDelete}
                  onArbeidsgiverEdit={onArbeidsgiverEdit}
                  namespace={namespace}
                />
              </Column>
            </AlignStartRow>
          )
        }

        return (
          <div key={i}>
            {element}
            <VerticalSeparatorDiv />
          </div>
        )
      })}
      <VerticalSeparatorDiv />
      <hr />
      <VerticalSeparatorDiv />
      {!_seeNewArbeidsgiver
        ? !_seeNewPeriode && (
          <HighContrastFlatknapp
            mini
            kompakt
            onClick={() => _setSeeNewArbeidsgiver(true)}
          >
            <Add />
            <HorizontalSeparatorDiv size='0.5' />
            {t('el:button-add-new-x', {
              x: t('label:arbeidsgiver').toLowerCase()
            })}
          </HighContrastFlatknapp>
          )
        : (
          <>
            <Undertittel>
              {t('label:legg-til-arbeidsperiode')}
            </Undertittel>
            <VerticalSeparatorDiv />
            <AlignStartRow className='slideInFromLeft'>
              <Period
                key={'' + _newArbeidsgiverStartDato + _newArbeidsgiverSluttDato}
                namespace={namespace}
                errorStartDato={_validationArbeidsgiver[namespace + '-arbeidsgiver-startdato']?.feilmelding}
                errorSluttDato={_validationArbeidsgiver[namespace + '-arbeidsgiver-sluttdato']?.feilmelding}
                setStartDato={onArbeidsgiverStartDatoChanged}
                setSluttDato={onArbeidsgiverSluttDatoChanged}
                valueStartDato={_newArbeidsgiverStartDato}
                valueSluttDato={_newArbeidsgiverSluttDato}
              />
              <Column />
            </AlignStartRow>
            <VerticalSeparatorDiv size='0.5' />
            <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
              <Column>
                <Input
                  feil={_validationArbeidsgiver[namespace + '-arbeidsgiver-orgnr']?.feilmelding}
                  namespace={namespace + '-arbeidsgiver'}
                  id='orgnr'
                  label={t('label:orgnr')}
                  onChanged={onArbeidsgiverOrgnrChanged}
                  value={_newArbeidsgiverOrgnr}
                />
              </Column>
              <Column>
                <Input
                  feil={_validationArbeidsgiver[namespace + '-arbeidsgiver-navn']?.feilmelding}
                  namespace={namespace + '-arbeidsgiver'}
                  id='navn'
                  label={t('label:navn')}
                  onChanged={onArbeidsgiverNameChanged}
                  value={_newArbeidsgiverNavn}
                />
              </Column>
              <Column />
            </AlignStartRow>
            <VerticalSeparatorDiv />
            <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
              <Column>
                <HighContrastKnapp
                  mini
                  kompakt
                  onClick={onArbeidsgiverAdd}
                >
                  <Add />
                  <HorizontalSeparatorDiv size='0.5' />
                  {t('el:button-add')}
                </HighContrastKnapp>
                <HorizontalSeparatorDiv size='0.5' />
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={onCancelArbeidsgiverClicked}
                >
                  {t('el:button-cancel')}
                </HighContrastFlatknapp>
              </Column>
            </AlignStartRow>
          </>
          )}
      <VerticalSeparatorDiv />
      {!_seeNewPeriode
        ? !_seeNewArbeidsgiver && (
          <HighContrastFlatknapp
            mini
            kompakt
            onClick={() => _setSeeNewPeriode(true)}
          >
            <Add />
            <HorizontalSeparatorDiv size='0.5' />
            {t('el:button-add-new-x', {
              x: t('label:periode').toLowerCase()
            })}
          </HighContrastFlatknapp>
          )
        : (
          <>
            <VerticalSeparatorDiv />
            <AlignStartRow className='slideInFromLeft'>
              <Period
                key={'' + _newPeriodeStartDato + _newPeriodeSluttDato}
                namespace={namespace}
                errorStartDato={_validationPeriode[namespace + '-periode-startdato']?.feilmelding}
                errorSluttDato={_validationPeriode[namespace + '-periode-sluttdato']?.feilmelding}
                setStartDato={(dato: string) => setPeriodeStartDato(dato, -1)}
                setSluttDato={(dato: string) => setPeriodeSluttDato(dato, -1)}
                valueStartDato={_newPeriodeStartDato}
                valueSluttDato={_newPeriodeSluttDato}
              />
              <Column />
            </AlignStartRow>
            <VerticalSeparatorDiv />
            <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
              <Column>
                <HighContrastKnapp
                  mini
                  kompakt
                  onClick={onPeriodeAdd}
                >
                  <Add />
                  <HorizontalSeparatorDiv size='0.5' />
                  {t('el:button-add')}
                </HighContrastKnapp>
                <HorizontalSeparatorDiv size='0.5' />
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={onCancelPeriodeClicked}
                >
                  {t('el:button-cancel')}
                </HighContrastFlatknapp>
              </Column>
            </AlignStartRow>
          </>
          )}
    </>
  )
}

export default Ansatt
