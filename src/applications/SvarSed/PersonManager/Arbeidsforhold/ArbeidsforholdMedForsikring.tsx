import { getArbeidsperioder, updateArbeidsgivere } from 'actions/arbeidsgiver'
import { fetchInntekt } from 'actions/inntekt'
import { updateReplySed } from 'actions/svarpased'
import InntektSearch from 'applications/SvarSed/PersonManager/InntektSearch/InntektSearch'
import { PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Add from 'assets/icons/Add'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import ArbeidsgiverBox from 'components/Arbeidsgiver/ArbeidsgiverBox'
import ArbeidsgiverSøk from 'components/Arbeidsgiver/ArbeidsgiverSøk'
import Input from 'components/Forms/Input'
import Inntekt from 'components/Inntekt/Inntekt'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Periode, PeriodeMedForsikring, ReplySed } from 'declarations/sed'
import { Arbeidsgiver, Arbeidsperioder, IInntekter, Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import { Country } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import moment from 'moment'
import { Systemtittel, Undertittel } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column,
  HighContrastFlatknapp,
  HighContrastKnapp,
  HorizontalSeparatorDiv,
  PaddedDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getOrgnr, hasOrgnr, sanitizePeriodeMedForsikring } from 'utils/arbeidsgiver'
import { getFnr } from 'utils/fnr'
import makeRenderPlan, { PlanItem } from 'utils/renderPlan'
// import { performValidationArbeidsperioderSearch, ValidationDatoProps } from './validation'
import { validatePeriodeMedForsikring, ValidationPeriodeMedForsikringProps } from './validationPeriodeMedForsikring'

export interface ArbeidsforholdMedForsikringSelector extends PersonManagerFormSelector {
  arbeidsperioder: Arbeidsperioder | undefined
  gettingArbeidsperioder: boolean
  inntekter: IInntekter | undefined
  gettingInntekter: boolean
  replySed: ReplySed | undefined
  validation: Validation
  highContrast: boolean
}

export interface ArbeidsforholdMedForsikringProps {
  parentNamespace: string
  personID: string | undefined
  target: string
  typeTrygdeforhold: string
}

const mapState = (state: State): ArbeidsforholdMedForsikringSelector => ({
  arbeidsperioder: state.arbeidsgiver.arbeidsperioder,
  gettingArbeidsperioder: state.loading.gettingArbeidsperioder,
  inntekter: state.inntekt.inntekter,
  gettingInntekter: state.loading.gettingInntekter,
  replySed: state.svarpased.replySed,
  validation: state.validation.status,
  highContrast: state.ui.highContrast
})

const ArbeidsforholdMedForsikring: React.FC<ArbeidsforholdMedForsikringProps> = ({
  parentNamespace,
  personID,
  target,
  typeTrygdeforhold
}:ArbeidsforholdMedForsikringProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    arbeidsperioder,
    gettingArbeidsperioder,
    inntekter,
    gettingInntekter,
    replySed,
    highContrast
  } = useSelector<State, ArbeidsforholdMedForsikringSelector>(mapState)
  const dispatch = useDispatch()

  const includeAddress = true
  const perioder: Array<PeriodeMedForsikring> | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${target}`
  const fnr = getFnr(replySed, personID)
  /*
  const [_arbeidssøkStartDato, _setArbeidssøkStartDato] = useState<string>('')
  const [_arbeidssøkSluttDato, _setArbeidssøkSluttDato] = useState<string>('')
*/
  const [_newPeriode, _setNewPeriode] = useState<Periode>({ startdato: '' })
  const [_newOrgnr, _setNewOrgnr] = useState<string>('')
  const [_newNavn, _setNewNavn] = useState<string>('')
  const [_newGate, _setNewGate] = useState<string>('')
  const [_newPostnummer, _setNewPostnummer] = useState<string>('')
  const [_newBy, _setNewBy] = useState<string>('')
  const [_newBygning, _setNewBygning] = useState<string>('')
  const [_newRegion, _setNewRegion] = useState<string>('')
  const [_newLand, _setNewLand] = useState<string>('')

  const [_seeNewPeriodeMedForsikring, _setSeeNewPeriodeMedForsikring] = useState<boolean>(false)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<PeriodeMedForsikring>(
    (p: PeriodeMedForsikring) => p.periode.startdato + '-' + (p.periode.sluttdato ?? p.periode.aapenPeriodeType))

  const [_validationPeriodeMedForsikring, _resetValidationPeriodeMedForsikring, performValidationPeriodeMedForsikring] =
    useValidation<ValidationPeriodeMedForsikringProps>({}, validatePeriodeMedForsikring)
  // const [_validationSearch, _resetValidationSearch, performValidationSearch] = useValidation<ValidationDatoProps>({}, performValidationArbeidsperioderSearch)

  const [_addedPeriodeMedForsikring, setAddedPeriodeMedForsikring] = useState<Array<PeriodeMedForsikring>>([])

  /*
  const setArbeidssøkStartDato = (value: string) => {
    _resetValidationSearch('arbeidssok-startdato')
    _setArbeidssøkStartDato(value)
  }

  const setArbeidssøkSluttDato = (value: string) => {
    _resetValidationSearch('arbeidssok-sluttdato')
    _setArbeidssøkSluttDato(value)
  } */

  const onArbeidsperioderSearchClicked = () => {
    /* const valid = performValidationSearch({
      startdato: _arbeidssøkStartDato,
      sluttdato: _arbeidssøkSluttDato,
      namespace: namespace + '-arbeidssok'
    })
    if (valid) { */
    dispatch(getArbeidsperioder(fnr))
  //  }
  }

  const onInntektSearch = (fnr: string, fom: string, tom: string, inntektsliste: string) => {
    dispatch(fetchInntekt(fnr, fom, tom, inntektsliste))
  }

  const addPeriodeMedForsikring = (newPeriodeMedForsikring: PeriodeMedForsikring) => {
    let newPerioderMedForsikring: Array<PeriodeMedForsikring> | undefined = _.cloneDeep(perioder)
    if (!newPerioderMedForsikring) {
      newPerioderMedForsikring = []
    }
    newPerioderMedForsikring = newPerioderMedForsikring.concat(newPeriodeMedForsikring).sort((a, b) =>
      moment(a.periode.startdato).isSameOrBefore(moment(b.periode.startdato)) ? -1 : 1
    )
    dispatch(updateReplySed(target, newPerioderMedForsikring))
  }

  const removePeriodeMedForsikring = (deletedPeriodeMedForsikring: PeriodeMedForsikring) => {
    let newPerioderMedForsikring: Array<PeriodeMedForsikring> | undefined = _.cloneDeep(perioder)
    if (!newPerioderMedForsikring) {
      newPerioderMedForsikring = []
    }
    newPerioderMedForsikring = _.filter(newPerioderMedForsikring,
      p => p.periode.startdato !== deletedPeriodeMedForsikring.periode.startdato
    )
    dispatch(updateReplySed(target, newPerioderMedForsikring))
  }

  const onPeriodeMedForsikringSelect = (periodeMedForsikring: PeriodeMedForsikring, checked: boolean) => {
    if (checked) {
      addPeriodeMedForsikring(sanitizePeriodeMedForsikring(periodeMedForsikring))
    } else {
      removePeriodeMedForsikring(periodeMedForsikring)
    }
  }

  const onPeriodeMedForsikringEdit = (newPeriodeMedForsikring: PeriodeMedForsikring, oldPeriodeMedForsikring: PeriodeMedForsikring, selected: boolean) => {
    const newPerioderMedForsikring: Array<PeriodeMedForsikring> = _.cloneDeep(perioder) as Array<PeriodeMedForsikring>
    const newArbeidsgivere: Array<Arbeidsgiver> = _.cloneDeep(arbeidsperioder?.arbeidsperioder) as Array<Arbeidsgiver>
    const needleId: string | undefined = getOrgnr(newPeriodeMedForsikring)
    if (needleId) {
      const indexArbeidsgiver = _.findIndex(newArbeidsgivere, (p: Arbeidsgiver) => p.arbeidsgiversOrgnr === needleId)
      if (indexArbeidsgiver >= 0) {
        newArbeidsgivere[indexArbeidsgiver].fraDato = newPeriodeMedForsikring.periode.startdato
        newArbeidsgivere[indexArbeidsgiver].tilDato = newPeriodeMedForsikring.periode.sluttdato
        dispatch(updateArbeidsgivere(newArbeidsgivere))
      }
      if (selected) {
        const indexPerioder = _.findIndex(newPerioderMedForsikring, (p: PeriodeMedForsikring) => hasOrgnr(p, needleId))
        if (indexPerioder >= 0) {
          newPerioderMedForsikring[indexPerioder] = newPeriodeMedForsikring
          dispatch(updateReplySed(target, newPerioderMedForsikring))
        }
      }
    }
  }

  const onAddedPeriodeMedForsikringEdit = (newPeriodeMedForsikring: PeriodeMedForsikring, oldPeriodeMedForsikring: PeriodeMedForsikring, selected: boolean) => {
    const newPerioderMedForsikring: Array<PeriodeMedForsikring> = _.cloneDeep(perioder) as Array<PeriodeMedForsikring>
    const newAddedPeriodeMedForsikring: Array<PeriodeMedForsikring> = _.cloneDeep(_addedPeriodeMedForsikring)
    if (newAddedPeriodeMedForsikring) {
      const needleId : string | undefined = getOrgnr(newPeriodeMedForsikring)
      if (needleId) {
        const index = _.findIndex(newAddedPeriodeMedForsikring, (p: PeriodeMedForsikring) => hasOrgnr(p, needleId))
        if (index >= 0) {
          newAddedPeriodeMedForsikring[index] = newPeriodeMedForsikring
          setAddedPeriodeMedForsikring(newAddedPeriodeMedForsikring)
        }
        if (selected) {
          const indexPerioder = _.findIndex(newPerioderMedForsikring, (p: PeriodeMedForsikring) => hasOrgnr(p, needleId))
          if (indexPerioder >= 0) {
            newPerioderMedForsikring[indexPerioder] = newPeriodeMedForsikring
            dispatch(updateReplySed(target, newPerioderMedForsikring))
          }
        }
      }
    }
  }

  const onPeriodeMedForsikringDelete = (deletedPeriodeMedForsikring: PeriodeMedForsikring, selected: boolean) => {
    let newAddedPeriodeMedForsikring: Array<PeriodeMedForsikring> = _.cloneDeep(_addedPeriodeMedForsikring)
    const needleId : string | undefined = getOrgnr(deletedPeriodeMedForsikring)
    if (needleId) {
      newAddedPeriodeMedForsikring = _.filter(newAddedPeriodeMedForsikring, (p: PeriodeMedForsikring) => !hasOrgnr(p, needleId))
      setAddedPeriodeMedForsikring(newAddedPeriodeMedForsikring)
    }
    if (selected) {
      removePeriodeMedForsikring(deletedPeriodeMedForsikring)
    }
  }

  const resetArbeidsgiverForm = () => {
    _setNewNavn('')
    _setNewOrgnr('')
    _setNewPeriode({ startdato: '' })
    _setNewBy('')
    _setNewGate('')
    _setNewPostnummer('')
    _setNewBygning('')
    _setNewRegion('')
    _setNewLand('')
    _resetValidationPeriodeMedForsikring()
  }

  const onCancelArbeidsgiverClicked = () => {
    resetArbeidsgiverForm()
    _setSeeNewPeriodeMedForsikring(!_seeNewPeriodeMedForsikring)
  }

  const onArbeidsgiverPeriodeChanged = (p: Periode) => {
    _resetValidationPeriodeMedForsikring(namespace + '-startdato')
    _resetValidationPeriodeMedForsikring(namespace + '-sluttdato')
    _setNewPeriode(p)
  }

  const onArbeidsgiversOrgnrChanged = (newOrg: string) => {
    _resetValidationPeriodeMedForsikring(namespace + '-orgnr')
    _setNewOrgnr(newOrg)
  }

  const onArbeidsgiversNavnChanged = (newName: string) => {
    _resetValidationPeriodeMedForsikring(namespace + '-navn')
    _setNewNavn(newName)
  }

  const onGateChanged = (newGate: string) => {
    _resetValidationPeriodeMedForsikring(namespace + '-gate')
    _setNewGate(newGate)
  }

  const onPostnummerChanged = (newPostnummer: string) => {
    _resetValidationPeriodeMedForsikring(namespace + '-postnummer')
    _setNewPostnummer(newPostnummer)
  }

  const onByChanged = (newBy: string) => {
    _resetValidationPeriodeMedForsikring(namespace + '-by')
    _setNewBy(newBy)
  }

  const onBygningChanged = (newBygning: string) => {
    _resetValidationPeriodeMedForsikring(namespace + '-bygning')
    _setNewBygning(newBygning)
  }

  const onRegionChanged = (newRegion: string) => {
    _resetValidationPeriodeMedForsikring(namespace + '-region')
    _setNewRegion(newRegion)
  }

  const onLandChanged = (newLand: string) => {
    _resetValidationPeriodeMedForsikring(namespace + '-land')
    _setNewLand(newLand)
  }

  const onPeriodeMedForsikringAdd = () => {
    const newPeriodeMedForsikring: PeriodeMedForsikring = {
      arbeidsgiver: {
        identifikator: [{
          type: 'registrering',
          id: _newOrgnr
        }],
        navn: _newNavn,
        adresse: {
          postnummer: _newPostnummer,
          gate: _newGate,
          bygning: _newBygning,
          land: _newLand,
          by: _newBy,
          region: _newRegion
        }
      },
      periode: _newPeriode,
      typeTrygdeforhold: typeTrygdeforhold
    }

    const valid: boolean = performValidationPeriodeMedForsikring({
      periodeMedForsikring: newPeriodeMedForsikring,
      namespace: namespace,
      includeAddress: true
    })

    if (valid) {
      let newAddedPerioderMedForsikring: Array<PeriodeMedForsikring> = _.cloneDeep(_addedPeriodeMedForsikring)
      newAddedPerioderMedForsikring = newAddedPerioderMedForsikring.concat(newPeriodeMedForsikring)
      setAddedPeriodeMedForsikring(newAddedPerioderMedForsikring)
      resetArbeidsgiverForm()
    }
  }

  const renderNewArbeidsgiver = () => (
    <>
      <Undertittel>
        {t('label:legg-til-arbeidsgiver')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft'>
        <PeriodeInput
          key={'' + _newPeriode.startdato + _newPeriode.sluttdato}
          namespace={namespace}
          error={{
            startdato: _validationPeriodeMedForsikring[namespace + '-startdato']?.feilmelding,
            sluttdato: _validationPeriodeMedForsikring[namespace + '-sluttdato']?.feilmelding
          }}
          setPeriode={onArbeidsgiverPeriodeChanged}
          value={_newPeriode}
        />
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv size='0.5' />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.05s' }}>
        <Column>
          <Input
            feil={_validationPeriodeMedForsikring[namespace + '-orgnr']?.feilmelding}
            namespace={namespace}
            id='orgnr'
            key={'orgnr-' + _newOrgnr}
            label={t('label:orgnr')}
            onChanged={onArbeidsgiversOrgnrChanged}
            value={_newOrgnr}
          />
        </Column>
        <Column>
          <Input
            feil={_validationPeriodeMedForsikring[namespace + '-navn']?.feilmelding}
            namespace={namespace}
            id='navn'
            key={'navn-' + _newNavn}
            label={t('label:navn')}
            onChanged={onArbeidsgiversNavnChanged}
            value={_newNavn}
          />
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />

      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column flex='3'>
          <Input
            namespace={namespace}
            feil={_validationPeriodeMedForsikring[namespace + '-gate']?.feilmelding}
            id='gate'
            key={'gate-' + _newGate}
            label={t('label:gateadresse')}
            onChanged={onGateChanged}
            value={_newGate}
          />
        </Column>
        <Column>
          <Input
            namespace={namespace}
            feil={_validationPeriodeMedForsikring[namespace + '-bygning']?.feilmelding}
            id='bygning'
            key={'bygning-' + _newBygning}
            label={t('label:bygning')}
            onChanged={onBygningChanged}
            value={_newBygning}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.15s' }}>
        <Column>
          <Input
            namespace={namespace}
            feil={_validationPeriodeMedForsikring[namespace + '-postnummer']?.feilmelding}
            id='postnummer'
            key={'postnummer-' + _newPostnummer}
            label={t('label:postnummer')}
            onChanged={onPostnummerChanged}
            value={_newPostnummer}
          />
        </Column>
        <Column flex='3'>
          <Input
            namespace={namespace}
            feil={_validationPeriodeMedForsikring[namespace + '-by']?.feilmelding}
            id='by'
            key={'by-' + _newBy}
            label={t('label:by')}
            onChanged={onByChanged}
            value={_newBy}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
        <Column flex='2'>
          <Input
            namespace={namespace}
            feil={_validationPeriodeMedForsikring[namespace + '-region']?.feilmelding}
            id='region'
            key={'region-' + _newRegion}
            label={t('label:region')}
            onChanged={onRegionChanged}
            value={_newRegion}
          />
        </Column>
        <Column flex='2'>
          <CountrySelect
            closeMenuOnSelect
            key={'land-' + _newLand}
            data-test-id={namespace + '-land'}
            error={_validationPeriodeMedForsikring[namespace + '-land']?.feilmelding}
            flagWave
            id={namespace + '-land'}
            label={t('label:land') + ' *'}
            menuPortalTarget={document.body}
            onOptionSelected={(e: Country) => onLandChanged(e.value)}
            placeholder={t('el:placeholder-select-default')}
            values={_newLand}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.25s' }}>
        <Column>
          <HighContrastKnapp
            mini
            kompakt
            onClick={onPeriodeMedForsikringAdd}
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
  )

  const renderPlan = () => {
    const plan = makeRenderPlan<PeriodeMedForsikring>({
      perioder,
      arbeidsperioder,
      addedArbeidsperioder: _addedPeriodeMedForsikring
    })
    return plan?.map((item: PlanItem<PeriodeMedForsikring>, i: number) => {
      let element: JSX.Element | null = null
      if (item.type === 'orphan') {
        const candidateForDeletion = !_.isNil(item.index) && item.index >= 0 ? isInDeletion(item.item as PeriodeMedForsikring) : false
        element = (
          <AlignStartRow className='slideInFromLeft'>
            <Column flex='2'>
              <ArbeidsgiverBox
                arbeidsgiver={item.item}
                editable='no'
                includeAddress={includeAddress}
                orphanArbeidsgiver
                key={getOrgnr(item.item)}
                namespace={namespace}
                selectable={false}
              />
            </Column>
            <Column>
              <AddRemovePanel
                candidateForDeletion={candidateForDeletion}
                existingItem
                marginTop
                onBeginRemove={() => addToDeletion(item.item as PeriodeMedForsikring)}
                onConfirmRemove={() => removePeriodeMedForsikring(item.item as PeriodeMedForsikring)}
                onCancelRemove={() => removeFromDeletion(item.item as PeriodeMedForsikring)}
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
                arbeidsgiver={item.item}
                editable='only_period'
                includeAddress={includeAddress}
                typeTrygdeforhold={typeTrygdeforhold}
                newArbeidsgiver={false}
                selected={!_.isNil(item.index) && item.index >= 0}
                key={getOrgnr(item.item)}
                onArbeidsgiverSelect={onPeriodeMedForsikringSelect}
                onArbeidsgiverEdit={onPeriodeMedForsikringEdit}
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
                arbeidsgiver={item.item}
                editable='full'
                includeAddress={includeAddress}
                error={item.duplicate}
                newArbeidsgiver
                typeTrygdeforhold={typeTrygdeforhold}
                selected={!_.isNil(item.index) && item.index >= 0}
                key={getOrgnr(item.item)}
                onArbeidsgiverSelect={onPeriodeMedForsikringSelect}
                onArbeidsgiverDelete={onPeriodeMedForsikringDelete}
                onArbeidsgiverEdit={onAddedPeriodeMedForsikringEdit}
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
    })
  }

  return (
    <PaddedDiv>
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <Undertittel>
            {t('label:arbeidsforhold/arbeidsgivere')}
          </Undertittel>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        {/*        <PeriodeInput
          key={_arbeidssøkStartDato + _arbeidssøkSluttDato}
          namespace={namespace + '-arbeidssok'}
          errorStartDato={_validationSearch[namespace + '-arbeidssok-startdato']?.feilmelding}
          errorSluttDato={_validationSearch[namespace + '-arbeidssok-sluttdato']?.feilmelding}
          setStartDato={setArbeidssøkStartDato}
          setSluttDato={setArbeidssøkSluttDato}
          valueStartDato={_arbeidssøkStartDato}
          valueSluttDato={_arbeidssøkSluttDato}
        /> */}
        <Column>
          <VerticalSeparatorDiv size='1.8' />
          <ArbeidsgiverSøk
            fnr={fnr}
            gettingArbeidsperioder={gettingArbeidsperioder}
            getArbeidsperioder={onArbeidsperioderSearchClicked}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      <Systemtittel>
        {t('label:aa-registeret')}
      </Systemtittel>
      <VerticalSeparatorDiv />
      <Undertittel>
        {t('label:registered-arbeidsperiode')}
      </Undertittel>
      <VerticalSeparatorDiv size='2' />
      {renderPlan()}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv size='2' />
      {_seeNewPeriodeMedForsikring
        ? renderNewArbeidsgiver()
        : (
          <HighContrastFlatknapp
            mini
            kompakt
            onClick={() => _setSeeNewPeriodeMedForsikring(true)}
          >
            <Add />
            <HorizontalSeparatorDiv size='0.5' />
            {t('el:button-add-new-x', {
              x: t('label:arbeidsgiver').toLowerCase()
            })}
          </HighContrastFlatknapp>
          )}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv size='2' />
      <Undertittel>
        {t('label:kontoller-inntekt')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <InntektSearch
        fnr={fnr!}
        highContrast={highContrast}
        onInntektSearch={onInntektSearch}
        gettingInntekter={gettingInntekter}
      />
      <VerticalSeparatorDiv />
      {inntekter && <Inntekt inntekter={inntekter} />}
    </PaddedDiv>
  )
}

export default ArbeidsforholdMedForsikring
