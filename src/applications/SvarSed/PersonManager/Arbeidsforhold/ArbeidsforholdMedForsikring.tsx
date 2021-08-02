import { getArbeidsperioder } from 'actions/arbeidsgiver'
import { fetchInntekt } from 'actions/inntekt'
import { updateReplySed } from 'actions/svarpased'
import { PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Add from 'assets/icons/Add'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import ArbeidsgiverBox from 'components/Arbeidsgiver/ArbeidsgiverBox'
import ArbeidsgiverSøk from 'components/Arbeidsgiver/ArbeidsgiverSøk'
import { validateArbeidsgiver, ValidationArbeidsgiverProps } from 'components/Arbeidsgiver/validation'
import Input from 'components/Forms/Input'
import Inntekt from 'components/Inntekt/Inntekt'
import Period from 'components/Period/Period'
import { Dd, Dl, Dt, HorizontalLineSeparator } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Periode, PeriodeMedForsikring, ReplySed } from 'declarations/sed'
import { Arbeidsperioder, IInntekter, Validation } from 'declarations/types'
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
  FlexBaseDiv,
  HighContrastFlatknapp,
  HighContrastKnapp,
  HighContrastPanel,
  HorizontalSeparatorDiv,
  PaddedDiv,
  themeKeys,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { getOrgnr, hasOrgnr, sanitizePeriodeMedForsikring } from 'utils/arbeidsgiver'
import { getFnr } from 'utils/fnr'
import makeRenderPlan, { PlanItem } from 'utils/renderPlan'
import { performValidationArbeidsperioderSearch, ValidationDatoProps } from './validation'

const OrphanArbeidsgiver = styled(HighContrastPanel)`
   background-color: ${({ theme }: any) => theme[themeKeys.MAIN_BACKGROUND_COLOR]} !important;
`

export interface ArbeidsforholdMedForsikringSelector extends PersonManagerFormSelector {
  arbeidsperioder: Arbeidsperioder | undefined
  gettingArbeidsperioder: boolean
  inntekter: IInntekter | undefined
  gettingInntekter: boolean
  replySed: ReplySed | undefined
  validation: Validation
}

export interface ArbeidsforholdMedForsikringProps {
  parentNamespace: string
  target: string
  typeTrygdeforhold: string
}

const mapState = (state: State): ArbeidsforholdMedForsikringSelector => ({
  arbeidsperioder: state.arbeidsgiver.arbeidsperioder,
  gettingArbeidsperioder: state.loading.gettingArbeidsperioder,
  inntekter: state.inntekt.inntekter,
  gettingInntekter: state.loading.gettingInntekter,
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const ArbeidsforholdMedForsikring: React.FC<ArbeidsforholdMedForsikringProps> = ({
  parentNamespace,
  target,
  typeTrygdeforhold
}:ArbeidsforholdMedForsikringProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    arbeidsperioder,
    gettingArbeidsperioder,
    inntekter,
    gettingInntekter,
    replySed
  } = useSelector<State, ArbeidsforholdMedForsikringSelector>(mapState)
  const dispatch = useDispatch()

  const includeAddress = true
  const perioder: Array<PeriodeMedForsikring> | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${target}`
  const fnr = getFnr(replySed)

  const [_arbeidssøkStartDato, _setArbeidssøkStartDato] = useState<string>('')
  const [_arbeidssøkSluttDato, _setArbeidssøkSluttDato] = useState<string>('')

  const [_newStartDato, _setNewStartDato] = useState<string>('')
  const [_newSluttDato, _setNewSluttDato] = useState<string>('')
  const [_newOrgnr, _setNewOrgnr] = useState<string>('')
  const [_newNavn, _setNewNavn] = useState<string>('')
  const [_newGate, _setNewGate] = useState<string>('')
  const [_newPostnummer, _setNewPostnummer] = useState<string>('')
  const [_newBy, _setNewBy] = useState<string>('')
  const [_newBygning, _setNewBygning] = useState<string>('')
  const [_newRegion, _setNewRegion] = useState<string>('')
  const [_newLand, _setNewLand] = useState<string>('')

  const [_seeNewPeriodeMedForsikring, _setSeeNewPeriodeMedForsikring] = useState<boolean>(false)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<PeriodeMedForsikring>((periode: PeriodeMedForsikring) => periode.periode.startdato)

  const [_validationPeriodeMedForsikring, _resetValidationPeriodeMedForsikring, performValidationPeriodeMedForsikring] =
    useValidation<ValidationArbeidsgiverProps>({}, validateArbeidsgiver)
  const [_validationSearch, _resetValidationSearch, performValidationSearch] =
    useValidation<ValidationDatoProps>({}, performValidationArbeidsperioderSearch)

  const [_addedPeriodeMedForsikring, setAddedPeriodeMedForsikring] = useState<Array<PeriodeMedForsikring>>([])

  const setArbeidssøkStartDato = (value: string) => {
    _resetValidationSearch('arbeidssok-startdato')
    _setArbeidssøkStartDato(value)
  }

  const setArbeidssøkSluttDato = (value: string) => {
    _resetValidationSearch('arbeidssok-sluttdato')
    _setArbeidssøkSluttDato(value)
  }

  const onArbeidsperioderSearchClicked = () => {
    const valid = performValidationSearch({
      startdato: _arbeidssøkStartDato,
      sluttdato: _arbeidssøkSluttDato,
      namespace: namespace + '-arbeidssok'
    })
    if (valid) {
      dispatch(getArbeidsperioder(fnr))
    }
  }

  const onInntektClicked = () => {
    dispatch(fetchInntekt(fnr))
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

  const onPeriodeMedForsikringEdit = (periodeMedForsikring: PeriodeMedForsikring) => {
    const newAddedPeriodeMedForsikring: Array<PeriodeMedForsikring> = _.cloneDeep(_addedPeriodeMedForsikring)
    if (newAddedPeriodeMedForsikring) {
      const needleId : string | undefined = getOrgnr(periodeMedForsikring)
      if (needleId) {
        const index = _.findIndex(newAddedPeriodeMedForsikring, (p: PeriodeMedForsikring) => hasOrgnr(p, needleId))
        if (index >= 0) {
          newAddedPeriodeMedForsikring[index] = periodeMedForsikring
          setAddedPeriodeMedForsikring(newAddedPeriodeMedForsikring)
        }
      }
    }
  }

  const onPeriodeMedForsikringDelete = (deletedPeriodeMedForsikring: PeriodeMedForsikring) => {
    let newAddedPeriodeMedForsikring: Array<PeriodeMedForsikring> = _.cloneDeep(_addedPeriodeMedForsikring)
    const needleId : string | undefined = getOrgnr(deletedPeriodeMedForsikring)
    if (needleId) {
      newAddedPeriodeMedForsikring = _.filter(newAddedPeriodeMedForsikring, (p: PeriodeMedForsikring) => hasOrgnr(p, needleId))
      setAddedPeriodeMedForsikring(newAddedPeriodeMedForsikring)
    }
  }

  const resetArbeidsgiverForm = () => {
    _setNewNavn('')
    _setNewOrgnr('')
    _setNewSluttDato('')
    _setNewStartDato('')
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

  const onArbeidsgiverStartDatoChanged = (dato: string) => {
    _resetValidationPeriodeMedForsikring(namespace + '-startdato')
    _setNewStartDato(dato)
  }

  const onArbeidsgiverSluttDatoChanged = (dato: string) => {
    _resetValidationPeriodeMedForsikring(namespace + '-sluttdato')
    _setNewSluttDato(dato)
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
    const newPeriode: Periode = {
      startdato: _newStartDato
    }
    if (_newSluttDato) {
      newPeriode.sluttdato = _newSluttDato
    } else {
      newPeriode.aapenPeriodeType = 'åpen_sluttdato'
    }
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
      periode: newPeriode,
      typeTrygdeforhold: typeTrygdeforhold
    }

    const valid: boolean = performValidationPeriodeMedForsikring({
      arbeidsgiver: newPeriodeMedForsikring,
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

  const renderOrphanArbeidsgiver = (item: PeriodeMedForsikring) => (
    <OrphanArbeidsgiver>
      <FlexBaseDiv>
        <Dl>
          {item.arbeidsgiver.navn && (
            <><Dt>{t('label:navn')}:</Dt><Dd>{item.arbeidsgiver.navn}</Dd></>
          )}
          {item.arbeidsgiver.identifikator && (
            <>
              <Dt>{t('label:identifikator')}:</Dt>
              <Dd>
                {item.arbeidsgiver.identifikator.map(id => (
                  <FlexBaseDiv key={id.type}>{id.type}: {id.id}</FlexBaseDiv>
                ))}

              </Dd>
            </>
          )}
          {item.periode && (
            <>
              <Dt>{t('label:periode')}:</Dt>
              <Dd>
                {item.periode.startdato + '  -  ' + item.periode.sluttdato ?? ''}
              </Dd>
            </>
          )}
        </Dl>
        {item.arbeidsgiver.adresse && (
          <Dl>
            <Dt>{t('label:adresse')}:</Dt>
            <Dd>
              <FlexBaseDiv>{t('label:gateadresse')}: {item.arbeidsgiver.adresse.gate}</FlexBaseDiv>
              <FlexBaseDiv>{t('label:postnummer')}: {item.arbeidsgiver.adresse.postnummer}</FlexBaseDiv>
              <FlexBaseDiv>{t('label:by')}: {item.arbeidsgiver.adresse.by}</FlexBaseDiv>
              <FlexBaseDiv>{t('label:bygning')}: {item.arbeidsgiver.adresse.bygning}</FlexBaseDiv>
              <FlexBaseDiv>{t('label:region')}: {item.arbeidsgiver.adresse.region}</FlexBaseDiv>
              <FlexBaseDiv>{t('label:land')}: {item.arbeidsgiver.adresse.land}</FlexBaseDiv>
            </Dd>
          </Dl>
        )}
      </FlexBaseDiv>
    </OrphanArbeidsgiver>
  )

  const renderNewArbeidsgiver = () => (
    <>
      <Undertittel>
        {t('label:legg-til-arbeidsperiode')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft'>
        <Period
          key={'' + _newStartDato + _newSluttDato}
          namespace={namespace}
          errorStartDato={_validationPeriodeMedForsikring[namespace + '-startdato']?.feilmelding}
          errorSluttDato={_validationPeriodeMedForsikring[namespace + '-sluttdato']?.feilmelding}
          setStartDato={onArbeidsgiverStartDatoChanged}
          setSluttDato={onArbeidsgiverSluttDatoChanged}
          valueStartDato={_newStartDato}
          valueSluttDato={_newSluttDato}
        />
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv size='0.5' />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
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

      <AlignStartRow>
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
      <AlignStartRow>
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
      <AlignStartRow>
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
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
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
              {renderOrphanArbeidsgiver(item.item as PeriodeMedForsikring)}
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
                editable={false}
                includeAddress={includeAddress}
                typeTrygdeforhold={typeTrygdeforhold}
                newArbeidsgiver={false}
                selected={!_.isNil(item.index) && item.index >= 0}
                key={getOrgnr(item.item)}
                onArbeidsgiverSelect={onPeriodeMedForsikringSelect}
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
                editable
                includeAddress={includeAddress}
                error={item.duplicate}
                newArbeidsgiver
                typeTrygdeforhold={typeTrygdeforhold}
                selected={!_.isNil(item.index) && item.index >= 0}
                key={getOrgnr(item.item)}
                onArbeidsgiverSelect={onPeriodeMedForsikringSelect}
                onArbeidsgiverDelete={onPeriodeMedForsikringDelete}
                onArbeidsgiverEdit={onPeriodeMedForsikringEdit}
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
        <Period
          key={_arbeidssøkStartDato + _arbeidssøkSluttDato}
          namespace={namespace + '-arbeidssok'}
          errorStartDato={_validationSearch[namespace + '-arbeidssok-startdato']?.feilmelding}
          errorSluttDato={_validationSearch[namespace + '-arbeidssok-sluttdato']?.feilmelding}
          setStartDato={setArbeidssøkStartDato}
          setSluttDato={setArbeidssøkSluttDato}
          valueStartDato={_arbeidssøkStartDato}
          valueSluttDato={_arbeidssøkSluttDato}
        />
        <Column>
          <VerticalSeparatorDiv size='1.8' />
          <ArbeidsgiverSøk
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
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <FlexBaseDiv>
            <Undertittel>
              {t('label:kontoller-inntekt')}
            </Undertittel>
            <HorizontalSeparatorDiv />
            <HighContrastFlatknapp
              mini
              kompakt
              spinner={gettingInntekter}
              disabled={gettingInntekter}
              onClick={onInntektClicked}
            >
              {t('label:fetch-inntekt')}
            </HighContrastFlatknapp>
          </FlexBaseDiv>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      {inntekter && <Inntekt inntekter={inntekter} />}
    </PaddedDiv>
  )
}

export default ArbeidsforholdMedForsikring
