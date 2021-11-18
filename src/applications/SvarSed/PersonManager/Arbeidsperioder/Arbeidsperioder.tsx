import { Add } from '@navikt/ds-icons'
import { updateArbeidsgivere } from 'actions/arbeidsgiver'
import { fetchInntekt } from 'actions/inntekt'
import { resetValidation } from 'actions/validation'
import AdresseFC from 'applications/SvarSed/PersonManager/Adresser/Adresse'
import IdentifikatorFC from 'applications/SvarSed/PersonManager/Identifikator/Identifikator'
import InntektSearch from 'applications/SvarSed/PersonManager/InntektSearch/InntektSearch'
import { PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import ArbeidsgiverBox from 'components/Arbeidsgiver/ArbeidsgiverBox'
import ArbeidsgiverSøk from 'components/Arbeidsgiver/ArbeidsgiverSøk'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import Inntekt from 'components/Inntekt/Inntekt'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Adresse, ArbeidsgiverIdentifikator, Periode, PeriodeMedForsikring, ReplySed } from 'declarations/sed'
import { Arbeidsgiver, Arbeidsperioder, IInntekter, Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import { Ingress, Systemtittel, Undertittel } from 'nav-frontend-typografi'
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
import { generateIdentifikatorKey, getOrgnr, sanitizePeriodeMedForsikring } from 'utils/arbeidsgiver'
import { getFnr } from 'utils/fnr'
import makeRenderPlan, { PlanItem } from 'utils/renderPlan'
import { validatePeriodeMedForsikring, ValidationPeriodeMedForsikringProps } from './validation'

export interface ArbeidsforholdSelector extends PersonManagerFormSelector {
  arbeidsperioder: Arbeidsperioder | null | undefined
  gettingArbeidsperioder: boolean
  inntekter: IInntekter | undefined
  gettingInntekter: boolean
  validation: Validation
  highContrast: boolean
}

export interface ArbeidsforholdProps {
  parentNamespace: string
  personID: string | undefined
  target: string
  replySed: ReplySed | null | undefined
  updateReplySed: (needle: string, value: any) => void
}

const mapState = (state: State): ArbeidsforholdSelector => ({
  arbeidsperioder: state.arbeidsgiver.arbeidsperioder,
  gettingArbeidsperioder: state.loading.gettingArbeidsperioder,
  inntekter: state.inntekt.inntekter,
  gettingInntekter: state.loading.gettingInntekter,
  validation: state.validation.status,
  highContrast: state.ui.highContrast
})

const ArbeidsperioderFC: React.FC<ArbeidsforholdProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
}:ArbeidsforholdProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    arbeidsperioder,
    inntekter,
    gettingInntekter,
    highContrast
  } = useSelector<State, ArbeidsforholdSelector>(mapState)
  const dispatch = useDispatch()
  const includeAddress = true
  const target = 'perioderAnsattMedForsikring'
  const perioder: Array<PeriodeMedForsikring> | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-arbeidsforhold`
  const fnr = getFnr(replySed, personID)

  const [_newPeriode, _setNewPeriode] = useState<Periode>({ startdato: '' })
  const [_newIdentifikatorer, _setNewIdentifikatorer] = useState<Array<ArbeidsgiverIdentifikator> | undefined>(undefined)
  const [_newNavn, _setNewNavn] = useState<string>('')
  const [_newAdresse, _setNewAdresse] = useState<Adresse | undefined>(undefined)

  const [_seeNewPeriodeMedForsikring, _setSeeNewPeriodeMedForsikring] = useState<boolean>(false)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<PeriodeMedForsikring>(
    (p: PeriodeMedForsikring) => p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType))

  const [_validationPeriodeMedForsikring, _resetValidationPeriodeMedForsikring, performValidationPeriodeMedForsikring] =
    useValidation<ValidationPeriodeMedForsikringProps>({}, validatePeriodeMedForsikring)

  const [_addedPeriodeMedForsikring, setAddedPeriodeMedForsikring] = useState<Array<PeriodeMedForsikring>>([])

  const onInntektSearch = (fnr: string, fom: string, tom: string, inntektsliste: string) => {
    dispatch(fetchInntekt(fnr, fom, tom, inntektsliste))
  }

  const addPeriodeMedForsikring = (newPeriodeMedForsikring: PeriodeMedForsikring) => {
    let newPerioderMedForsikring: Array<PeriodeMedForsikring> | undefined = _.cloneDeep(perioder)
    if (!newPerioderMedForsikring) {
      newPerioderMedForsikring = []
    }
    newPerioderMedForsikring = newPerioderMedForsikring.concat(newPeriodeMedForsikring).sort((a, b) =>
      moment(a.startdato).isSameOrBefore(moment(b.startdato)) ? -1 : 1
    )
    dispatch(updateReplySed(target, newPerioderMedForsikring))
    standardLogger('svarsed.editor.periode.add', { type: 'perioderAnsattMedForsikring' })
  }

  const removePeriodeMedForsikring = (deletedPeriodeMedForsikring: PeriodeMedForsikring) => {
    let newPerioderMedForsikring: Array<PeriodeMedForsikring> | undefined = _.cloneDeep(perioder)
    if (!newPerioderMedForsikring) {
      newPerioderMedForsikring = []
    }
    newPerioderMedForsikring = _.filter(newPerioderMedForsikring,
      p => p.startdato !== deletedPeriodeMedForsikring.startdato
    )
    dispatch(updateReplySed(target, newPerioderMedForsikring))
    standardLogger('svarsed.editor.periode.remove', { type: 'perioderAnsattMedForsikring' })
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
    const needleId: string | undefined = getOrgnr(newPeriodeMedForsikring, 'organisasjonsnummer')
    if (needleId) {
      const indexArbeidsgiver = _.findIndex(newArbeidsgivere, (p: Arbeidsgiver) => p.arbeidsgiversOrgnr === needleId)
      if (indexArbeidsgiver >= 0) {
        newArbeidsgivere[indexArbeidsgiver].fraDato = newPeriodeMedForsikring.startdato
        newArbeidsgivere[indexArbeidsgiver].tilDato = newPeriodeMedForsikring.sluttdato
        dispatch(updateArbeidsgivere(newArbeidsgivere))
      }
      if (selected) {
        const indexPerioder = _.findIndex(newPerioderMedForsikring, (p: PeriodeMedForsikring) =>
          _.find(p.arbeidsgiver.identifikator, id => id.type === 'organisasjonsnummer' && id.id === needleId) !== undefined
        )
        if (indexPerioder >= 0) {
          newPerioderMedForsikring[indexPerioder] = newPeriodeMedForsikring
          dispatch(updateReplySed(target, newPerioderMedForsikring))
        }
      }
      standardLogger('svarsed.editor.arbeidsgiver.fromAA.edit')
    }
  }

  const onAddedPeriodeMedForsikringEdit = (newPeriodeMedForsikring: PeriodeMedForsikring, oldPeriodeMedForsikring: PeriodeMedForsikring, selected: boolean) => {
    const newPerioderMedForsikring: Array<PeriodeMedForsikring> = _.cloneDeep(perioder) as Array<PeriodeMedForsikring>
    const newAddedPeriodeMedForsikring: Array<PeriodeMedForsikring> = _.cloneDeep(_addedPeriodeMedForsikring)
    if (newAddedPeriodeMedForsikring) {
      const needleId : string | undefined = generateIdentifikatorKey(newPeriodeMedForsikring.arbeidsgiver.identifikator)
      if (needleId) {
        const index = _.findIndex(newAddedPeriodeMedForsikring, (p: PeriodeMedForsikring) =>
          generateIdentifikatorKey(p.arbeidsgiver.identifikator) === needleId)
        if (index >= 0) {
          newAddedPeriodeMedForsikring[index] = newPeriodeMedForsikring
          setAddedPeriodeMedForsikring(newAddedPeriodeMedForsikring)
        }
        if (selected) {
          const indexPerioder = _.findIndex(newAddedPeriodeMedForsikring, (p: Periode) => {
            return oldPeriodeMedForsikring.startdato === p.startdato && oldPeriodeMedForsikring.sluttdato === p.sluttdato
          })
          if (indexPerioder > 0) {
            newPerioderMedForsikring[indexPerioder] = newPeriodeMedForsikring
            dispatch(updateReplySed(target, newPerioderMedForsikring))
          }
        }
        standardLogger('svarsed.editor.arbeidsgiver.added.edit')
      }
    }
  }

  const onPeriodeMedForsikringDelete = (deletedPeriodeMedForsikring: PeriodeMedForsikring, selected: boolean) => {
    let newAddedPeriodeMedForsikring: Array<PeriodeMedForsikring> = _.cloneDeep(_addedPeriodeMedForsikring)
    const needleId : string | undefined = generateIdentifikatorKey(deletedPeriodeMedForsikring.arbeidsgiver.identifikator)
    if (needleId) {
      newAddedPeriodeMedForsikring = _.filter(newAddedPeriodeMedForsikring, (p: PeriodeMedForsikring) =>
        generateIdentifikatorKey(p.arbeidsgiver.identifikator) !== needleId)
      setAddedPeriodeMedForsikring(newAddedPeriodeMedForsikring)
    }
    if (selected) {
      removePeriodeMedForsikring(deletedPeriodeMedForsikring)
    }
    standardLogger('svarsed.editor.arbeidsgiver.added.remove')
  }

  const resetArbeidsgiverForm = () => {
    _setNewNavn('')
    _setNewIdentifikatorer(undefined)
    _setNewPeriode({ startdato: '' })
    _setNewAdresse(undefined)
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

  const onIdentifikatorerChanged = (newIdentifikatorer: Array<ArbeidsgiverIdentifikator>) => {
    _setNewIdentifikatorer(newIdentifikatorer)
  }

  const resetSubValidation = (fullnamespace: string) => resetValidation(fullnamespace)

  const onArbeidsgiversNavnChanged = (newName: string) => {
    _resetValidationPeriodeMedForsikring(namespace + '-navn')
    _setNewNavn(newName)
  }

  const setAdresse = (adresse: Adresse) => {
    _setNewAdresse(adresse)
  }

  const resetAdresseValidation = (fullnamespace: string) => {
    _resetValidationPeriodeMedForsikring(fullnamespace)
  }

  const onPeriodeMedForsikringAdd = () => {
    const newPeriodeMedForsikring: PeriodeMedForsikring = {
      ..._newPeriode,
      arbeidsgiver: {
        identifikator: _newIdentifikatorer as Array<ArbeidsgiverIdentifikator>,
        navn: _newNavn,
        adresse: _newAdresse
      }
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
      standardLogger('svarsed.editor.arbeidsgiver.added.add')
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
            feil={_validationPeriodeMedForsikring[namespace + '-navn']?.feilmelding}
            namespace={namespace}
            id='navn'
            key={'navn-' + _newNavn}
            label={t('label:institusjonens-navn')}
            onChanged={onArbeidsgiversNavnChanged}
            value={_newNavn}
          />
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.05s' }}>
        <Column>
          <IdentifikatorFC
            highContrast={highContrast}
            identifikatorer={_newIdentifikatorer}
            onIdentifikatorerChanged={onIdentifikatorerChanged}
            namespace={namespace + '-identifikator'}
            validation={_validationPeriodeMedForsikring}
            personName={_newNavn}
            resetValidation={resetSubValidation}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AdresseFC
        adresse={_newAdresse}
        onAdressChanged={setAdresse}
        namespace={namespace + '-adresse'}
        validation={_validationPeriodeMedForsikring}
        resetValidation={resetAdresseValidation}
      />
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
                highContrast={highContrast}
                arbeidsgiver={item.item}
                editable='no'
                includeAddress={includeAddress}
                orphanArbeidsgiver
                key={getOrgnr(item.item, 'organisasjonsnummer')}
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
                highContrast={highContrast}
                includeAddress={includeAddress}
                newArbeidsgiver={false}
                selected={!_.isNil(item.index) && item.index >= 0}
                key={getOrgnr(item.item, 'organisasjonsnummer')}
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
                highContrast={highContrast}
                includeAddress={includeAddress}
                error={item.duplicate}
                newArbeidsgiver
                selected={!_.isNil(item.index) && item.index >= 0}
                key={getOrgnr(item.item, 'organisasjonsnummer')}
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
      <Undertittel>
        {t('label:oversikt-brukers-arbeidsperioder')}
      </Undertittel>
      <VerticalSeparatorDiv size='2' />
      <Ingress>
        {t('label:hent-perioder-i-aa-registeret')}
      </Ingress>
      <VerticalSeparatorDiv />
      <ArbeidsgiverSøk
        amplitude='svarsed.editor.arbeidsforholdmedforsikring.arbeidsgiver.search'
        fnr={fnr}
        namespace={namespace}
      />
      <VerticalSeparatorDiv size='2' />
      <Systemtittel>
        {t('label:arbeidsperioder-i-aa-registeret')}
      </Systemtittel>
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
              x: t('label:arbeidperioder').toLowerCase()
            })}
          </HighContrastFlatknapp>
          )}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv size='2' />
      <Ingress>
        {t('label:hent-inntekt-i-A-inntekt')}
      </Ingress>
      <VerticalSeparatorDiv />
      <InntektSearch
        amplitude='svarsed.editor.inntekt.search'
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

export default ArbeidsperioderFC
