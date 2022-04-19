import { Add } from '@navikt/ds-icons'
import { Button, Heading, Ingress } from '@navikt/ds-react'
import { ActionWithPayload } from '@navikt/fetch'
import { updateArbeidsperioder } from 'actions/arbeidsperioder'
import { fetchInntekt } from 'actions/inntekt'
import AdresseForm from 'applications/SvarSed/MainForm/Adresser/AdresseForm'
import IdentifikatorFC from 'applications/SvarSed/MainForm/Identifikator/Identifikator'
import InntektSearch from 'applications/SvarSed/MainForm/InntektSearch/InntektSearch'
import { TwoLevelFormSelector } from 'applications/SvarSed/TwoLevelForm'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import ArbeidsperioderBox from 'components/Arbeidsperioder/ArbeidsperioderBox'
import ArbeidsperioderSøk from 'components/Arbeidsperioder/ArbeidsperioderSøk'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import Inntekt from 'components/Inntekt/Inntekt'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Adresse, ArbeidsgiverIdentifikator, Periode, PeriodeMedForsikring, ReplySed } from 'declarations/sed'
import {
  ArbeidsperiodeFraAA,
  ArbeidsperioderFraAA,
  IInntekter,
  UpdateReplySedPayload,
  Validation
} from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import { AlignStartRow, Column, HorizontalSeparatorDiv, PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { generateIdentifikatorKey, getOrgnr, sanitizePeriodeMedForsikring } from 'utils/arbeidsperioder'
import { getFnr } from 'utils/fnr'
import makeRenderPlan, { PlanItem } from 'utils/renderPlan'
import { validatePeriodeMedForsikring, ValidationPeriodeMedForsikringProps } from './validation'

export interface ArbeidsforholdSelector extends TwoLevelFormSelector {
  arbeidsperioder: ArbeidsperioderFraAA | null | undefined
  gettingArbeidsperioder: boolean
  inntekter: IInntekter | undefined
  gettingInntekter: boolean
  validation: Validation
}

export interface ArbeidsforholdProps {
  parentNamespace: string
  personID: string | undefined
  target: string
  replySed: ReplySed | null | undefined
  updateReplySed: (needle: string, value: any) => ActionWithPayload<UpdateReplySedPayload>
}

const mapState = (state: State): ArbeidsforholdSelector => ({
  arbeidsperioder: state.arbeidsperioder,
  gettingArbeidsperioder: state.loading.gettingArbeidsperioder,
  inntekter: state.inntekt.inntekter,
  gettingInntekter: state.loading.gettingInntekter,
  validation: state.validation.status
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
    gettingInntekter
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
    const newArbeidsgivere: Array<ArbeidsperiodeFraAA> = _.cloneDeep(arbeidsperioder?.arbeidsperioder) as Array<ArbeidsperiodeFraAA>
    const needleId: string | undefined = getOrgnr(newPeriodeMedForsikring, 'organisasjonsnummer')
    if (needleId) {
      const indexArbeidsgiver = _.findIndex(newArbeidsgivere, (p: ArbeidsperiodeFraAA) => p.arbeidsgiversOrgnr === needleId)
      if (indexArbeidsgiver >= 0) {
        newArbeidsgivere[indexArbeidsgiver].fraDato = newPeriodeMedForsikring.startdato
        newArbeidsgivere[indexArbeidsgiver].tilDato = newPeriodeMedForsikring.sluttdato
        dispatch(updateArbeidsperioder(newArbeidsgivere))
      }
      if (selected) {
        const indexPerioder = _.findIndex(newPerioderMedForsikring, (p: PeriodeMedForsikring) =>
          _.find(p.arbeidsgiver.identifikatorer, id => id.type === 'organisasjonsnummer' && id.id === needleId) !== undefined
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
      const needleId : string | undefined = generateIdentifikatorKey(newPeriodeMedForsikring.arbeidsgiver.identifikatorer)
      if (needleId) {
        const index = _.findIndex(newAddedPeriodeMedForsikring, (p: PeriodeMedForsikring) =>
          generateIdentifikatorKey(p.arbeidsgiver.identifikatorer) === needleId)
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
    const needleId : string | undefined = generateIdentifikatorKey(deletedPeriodeMedForsikring.arbeidsgiver.identifikatorer)
    if (needleId) {
      newAddedPeriodeMedForsikring = _.filter(newAddedPeriodeMedForsikring, (p: PeriodeMedForsikring) =>
        generateIdentifikatorKey(p.arbeidsgiver.identifikatorer) !== needleId)
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

  const onIdentifikatorerChanged = (newIdentifikatorer: Array<ArbeidsgiverIdentifikator>, whatChanged: string) => {
    _setNewIdentifikatorer(newIdentifikatorer)
    if (whatChanged && _validationPeriodeMedForsikring[namespace + '-' + whatChanged]) {
      _resetValidationPeriodeMedForsikring(namespace + '-' + whatChanged)
    }
  }

  const onArbeidsgiversNavnChanged = (newName: string) => {
    _resetValidationPeriodeMedForsikring(namespace + '-navn')
    _setNewNavn(newName)
  }

  const setAdresse = (adresse: Adresse, id: string | undefined) => {
    _setNewAdresse(adresse)
    if (id) {
      _resetValidationPeriodeMedForsikring(namespace + '-' + id)
    }
  }

  const onPeriodeMedForsikringAdd = () => {
    const newPeriodeMedForsikring: PeriodeMedForsikring = {
      ..._newPeriode,
      arbeidsgiver: {
        identifikatorer: _newIdentifikatorer as Array<ArbeidsgiverIdentifikator>,
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
      <Heading size='small'>
        {t('label:legg-til-arbeidsperiode')}
      </Heading>
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
            error={_validationPeriodeMedForsikring[namespace + '-navn']?.feilmelding}
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
            identifikatorer={_newIdentifikatorer}
            onIdentifikatorerChanged={onIdentifikatorerChanged}
            namespace={namespace + '-identifikator'}
            validation={_validationPeriodeMedForsikring}
            personName={_newNavn}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AdresseForm
        adresse={_newAdresse}
        onAdressChanged={setAdresse}
        namespace={namespace + '-adresse'}
        validation={_validationPeriodeMedForsikring}
      />
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.25s' }}>
        <Column>
          <Button
            variant='secondary'
            onClick={onPeriodeMedForsikringAdd}
          >
            <Add />
            <HorizontalSeparatorDiv size='0.5' />
            {t('el:button-add')}
          </Button>
          <HorizontalSeparatorDiv size='0.5' />
          <Button
            variant='tertiary'
            onClick={onCancelArbeidsgiverClicked}
          >
            {t('el:button-cancel')}
          </Button>
        </Column>
      </AlignStartRow>
    </>
  )

  const renderPlanItem = (item: any) => {
    if (item.type === 'periode') {
      const candidateForDeletion = !_.isNil(item.index) && item.index >= 0 ? isInDeletion(item.item as PeriodeMedForsikring) : false
      return (
        <>
          <Column flex='2'>
            <ArbeidsperioderBox
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
        </>
      )
    }

    if (item.type === 'arbeidsperiode') {
      return (
        <Column>
          <ArbeidsperioderBox
            arbeidsgiver={item.item}
            editable='only_period'
            includeAddress={includeAddress}
            newArbeidsgiver={false}
            selected={!_.isNil(item.index) && item.index >= 0}
            key={getOrgnr(item.item, 'organisasjonsnummer')}
            onArbeidsgiverSelect={onPeriodeMedForsikringSelect}
            onArbeidsgiverEdit={onPeriodeMedForsikringEdit}
            namespace={namespace}
          />
        </Column>
      )
    }

    if (item.type === 'addedArbeidsperiode') {
      return (
        <Column>
          <ArbeidsperioderBox
            arbeidsgiver={item.item}
            editable='full'
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
      )
    }
  }

  const renderPlan = () => {
    const plan = makeRenderPlan<PeriodeMedForsikring>({
      perioder,
      arbeidsperioder,
      addedArbeidsperioder: _addedPeriodeMedForsikring
    })
    return plan?.map((item: PlanItem<PeriodeMedForsikring>) => (
      <div key={
        item.type + '-' +
        item.item?.arbeidsgiver?.identifikatorer?.map(i => i.type + '-' + i.id).join(',') ?? '' +
        '-' + item.item.startdato + '-' + item.item.sluttdato
      }
      >
        <AlignStartRow className='slideInFromLeft'>
          {renderPlanItem(item)}
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </div>
    ))
  }

  return (
    <PaddedDiv>
      <Heading size='small'>
        {t('label:oversikt-brukers-arbeidsperioder')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <Ingress>
        {t('label:hent-perioder-fra-aa-registeret-og-a-inntekt')}
      </Ingress>
      <VerticalSeparatorDiv />
      <ArbeidsperioderSøk
        amplitude='svarsed.editor.arbeidsforholdmedforsikring.arbeidsgiver.search'
        fnr={fnr}
        namespace={namespace}
      />
      <VerticalSeparatorDiv size='2' />
      <Ingress>
        {t('label:arbeidsperioder')}
      </Ingress>
      <VerticalSeparatorDiv size='2' />
      {renderPlan()}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv size='2' />
      {_seeNewPeriodeMedForsikring
        ? renderNewArbeidsgiver()
        : (
          <Button
            variant='tertiary'
            onClick={() => _setSeeNewPeriodeMedForsikring(true)}
          >
            <Add />
            <HorizontalSeparatorDiv size='0.5' />
            {t('el:button-add-new-x', {
              x: t('label:arbeidperioder').toLowerCase()
            })}
          </Button>
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
        onInntektSearch={onInntektSearch}
        gettingInntekter={gettingInntekter}
      />
      <VerticalSeparatorDiv />
      {inntekter && <Inntekt inntekter={inntekter} />}
    </PaddedDiv>
  )
}

export default ArbeidsperioderFC
