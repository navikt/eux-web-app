import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Heading, Ingress } from '@navikt/ds-react'
import { AlignStartRow, Column, FlexCenterDiv, HorizontalSeparatorDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { updateArbeidsperioder } from 'actions/arbeidsperioder'
import { resetValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import ArbeidsperioderBox from 'components/Arbeidsperioder/ArbeidsperioderBox'
import ArbeidsperioderSøk from 'components/Arbeidsperioder/ArbeidsperioderSøk'
import { validateArbeidsgiver, ValidationArbeidsgiverProps } from 'components/Arbeidsperioder/validation'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { ErrorElement } from 'declarations/app.d'
import { State } from 'declarations/reducers'
import { Periode, PeriodeMedForsikring } from 'declarations/sed'
import { ArbeidsperiodeFraAA, ArbeidsperioderFraAA } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { generateIdentifikatorKey, getOrgnr } from 'utils/arbeidsperioder'
import { getFnr } from 'utils/fnr'
import { getIdx } from 'utils/namespace'
import makeRenderPlan, { PlanItem, RenderPlanProps } from 'utils/renderPlan'
import { validateAnsattPeriode, ValidationArbeidsperiodeProps } from './validation'

interface AnsattSelector extends MainFormSelector {
  arbeidsperioder: ArbeidsperioderFraAA | null | undefined
}

const mapState = (state: State): AnsattSelector => ({
  arbeidsperioder: state.arbeidsperioder,
  validation: state.validation.status
})

const Ansatt: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { arbeidsperioder, validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-ansatt`
  const target = `${personID}.perioderSomAnsatt`
  const perioderSomAnsatt: Array<Periode> | undefined = _.get(replySed, target)
  const includeAddress = false
  const fnr = getFnr(replySed, personID)

  // added arbeidsperioder list
  const [_addedArbeidsperioder, setAddedArbeidsperioder] = useState<Array<PeriodeMedForsikring>>([])

  // fields for new arbeidsperiode
  const [_newArbeidsgiverPeriode, _setNewArbeidsgiverPeriode] = useState<Periode>({ startdato: '' })
  const [_newArbeidsgiversOrgnr, _setNewArbeidsgiversOrgnr] = useState<string>('')
  const [_newArbeidsgiversNavn, _setNewArbeidsgiversNavn] = useState<string>('')
  const [_seeNewArbeidsgiver, _setSeeNewArbeidsgiver] = useState<boolean>(false)
  const [_validationArbeidsperiode, _resetValidationArbeidsperiode, performValidationArbeidsperiode] = useLocalValidation<ValidationArbeidsgiverProps>(validateArbeidsgiver, namespace + '-arbeidsgiver')

  // fields for new periode (not connected to arbeidsgiver)
  const [_newPeriode, _setNewPeriode] = useState<Periode>({ startdato: '' })
  const [_seeNewPeriode, _setSeeNewPeriode] = useState<boolean>(false)
  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Periode>((p: Periode) => p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType))
  const [_validationPeriode, _resetValidationPeriode, performValidationPeriode] = useLocalValidation<ValidationArbeidsperiodeProps>(validateAnsattPeriode, namespace)

  const addPeriode = (newPeriode: Periode) => {
    let newPerioder: Array<Periode> | undefined = _.cloneDeep(perioderSomAnsatt)
    if (!newPerioder) {
      newPerioder = []
    }
    newPerioder = newPerioder.concat(newPeriode).sort((a, b) =>
      moment(a.startdato).isSameOrBefore(moment(b.startdato)) ? -1 : 1
    )
    dispatch(updateReplySed(target, newPerioder))
  }

  const addPeriodeFromArbeidsgiver = (selectedArbeidsgiver: PeriodeMedForsikring) => {
    addPeriode({
      startdato: selectedArbeidsgiver.startdato,
      sluttdato: selectedArbeidsgiver.sluttdato,
      aapenPeriodeType: selectedArbeidsgiver.aapenPeriodeType
    })
    standardLogger('svarsed.editor.periode.add', { type: 'perioderSomAnsatt' })
  }

  const removePeriode = (deletedPeriode: Periode) => {
    let newPerioder: Array<Periode> | undefined = _.cloneDeep(perioderSomAnsatt)
    if (!newPerioder) {
      newPerioder = []
    }
    newPerioder = _.filter(newPerioder, p =>
      p.startdato !== deletedPeriode.startdato && p.sluttdato !== deletedPeriode.sluttdato)
    dispatch(updateReplySed(target, newPerioder))
    standardLogger('svarsed.editor.periode.remove', { type: 'perioderSomAnsatt' })
  }

  const removePeriodeFromArbeidsgiver = (deletedArbeidsgiver: PeriodeMedForsikring) => {
    let newPerioder: Array<Periode> | undefined = _.cloneDeep(perioderSomAnsatt)
    if (!newPerioder) {
      newPerioder = []
    }
    newPerioder = _.filter(newPerioder, p =>
      p.startdato !== deletedArbeidsgiver.startdato && p.sluttdato !== deletedArbeidsgiver.sluttdato)
    dispatch(updateReplySed(target, newPerioder))
    standardLogger('svarsed.editor.periode.remove', { type: 'perioderSomAnsatt' })
  }

  const onArbeidsgiverSelect = (arbeidsgiver: PeriodeMedForsikring, checked: boolean) => {
    if (checked) {
      addPeriodeFromArbeidsgiver(arbeidsgiver)
    } else {
      removePeriodeFromArbeidsgiver(arbeidsgiver)
    }
  }

  const onRegisteredArbeidsgiverEdit = (newArbeidsgiver: PeriodeMedForsikring, oldArbeidsgiver: PeriodeMedForsikring, selected: boolean) => {
    let newPerioder: Array<Periode> | undefined = _.cloneDeep(perioderSomAnsatt)
    if (!newPerioder) {
      newPerioder = []
    }
    const newArbeidsgivere: Array<ArbeidsperiodeFraAA> | undefined = _.cloneDeep(arbeidsperioder?.arbeidsperioder) as Array<ArbeidsperiodeFraAA>
    const needleId: string | undefined = getOrgnr(newArbeidsgiver, 'organisasjonsnummer')

    if (needleId) {
      const indexArbeidsgiver = _.findIndex(newArbeidsgivere, (p: ArbeidsperiodeFraAA) => p.arbeidsgiversOrgnr === needleId)
      if (indexArbeidsgiver >= 0) {
        newArbeidsgivere[indexArbeidsgiver].fraDato = newArbeidsgiver.startdato
        newArbeidsgivere[indexArbeidsgiver].tilDato = newArbeidsgiver.sluttdato
        dispatch(updateArbeidsperioder(newArbeidsgivere))
      }

      if (selected) {
        const indexPerioder = _.findIndex(newPerioder, (p: Periode) => {
          return oldArbeidsgiver.startdato === p.startdato && oldArbeidsgiver.sluttdato === p.sluttdato
        })
        if (indexPerioder >= 0) {
          newPerioder[indexPerioder] = {
            startdato: newArbeidsgiver.startdato,
            sluttdato: newArbeidsgiver.sluttdato,
            aapenPeriodeType: newArbeidsgiver.aapenPeriodeType
          }
          dispatch(updateReplySed(target, newPerioder))
        }
      }
      standardLogger('svarsed.editor.arbeidsgiver.fromAA.edit')
    }
  }

  const onArbeidsgiverEdit = (newArbeidsgiver: PeriodeMedForsikring, oldArbeidsgiver: PeriodeMedForsikring, selected: boolean) => {
    let newPerioder: Array<Periode> | undefined = _.cloneDeep(perioderSomAnsatt)
    if (!newPerioder) {
      newPerioder = []
    }
    const newAddedArbeidsperioder: Array<PeriodeMedForsikring> = _.cloneDeep(_addedArbeidsperioder)
    const needleId : string | undefined = generateIdentifikatorKey(newArbeidsgiver.arbeidsgiver.identifikatorer)

    if (newAddedArbeidsperioder && needleId) {
      const index = _.findIndex(newAddedArbeidsperioder, (p: PeriodeMedForsikring) => generateIdentifikatorKey(p.arbeidsgiver.identifikatorer) === needleId)
      if (index >= 0) {
        newAddedArbeidsperioder[index] = newArbeidsgiver
        setAddedArbeidsperioder(newAddedArbeidsperioder)
      }

      if (selected) {
        const indexPerioder = _.findIndex(newPerioder, (p: Periode) => {
          return oldArbeidsgiver.startdato === p.startdato && oldArbeidsgiver.sluttdato === p.sluttdato
        })
        if (indexPerioder >= 0) {
          newPerioder[indexPerioder] = {
            startdato: newArbeidsgiver.startdato,
            sluttdato: newArbeidsgiver.sluttdato,
            aapenPeriodeType: newArbeidsgiver.aapenPeriodeType
          }
          dispatch(updateReplySed(target, newPerioder))
        }
      }
      standardLogger('svarsed.editor.arbeidsgiver.added.edit')
    }
  }

  const onArbeidsgiverDelete = (deletedArbeidsgiver: PeriodeMedForsikring) => {
    let newAddedArbeidsperioder: Array<PeriodeMedForsikring> = _.cloneDeep(_addedArbeidsperioder)
    const needleId : string | undefined = generateIdentifikatorKey(deletedArbeidsgiver.arbeidsgiver.identifikatorer)
    if (newAddedArbeidsperioder && needleId) {
      newAddedArbeidsperioder = _.filter(newAddedArbeidsperioder, (p: PeriodeMedForsikring) => generateIdentifikatorKey(p.arbeidsgiver.identifikatorer) !== needleId)
      setAddedArbeidsperioder(newAddedArbeidsperioder)
      standardLogger('svarsed.editor.arbeidsgiver.added.remove')
    }
  }

  const resetArbeidsgiverForm = () => {
    _setNewArbeidsgiversNavn('')
    _setNewArbeidsgiversOrgnr('')
    _setNewArbeidsgiverPeriode({ startdato: '' })
    _resetValidationArbeidsperiode()
  }

  const resetPeriodeForm = () => {
    _setNewPeriode({ startdato: '' })
    _resetValidationPeriode()
  }

  const onArbeidsgiverAdd = () => {
    const newArbeidsgiver: PeriodeMedForsikring = {
      ..._newArbeidsgiverPeriode,
      arbeidsgiver: {
        navn: _newArbeidsgiversNavn,
        identifikatorer: [{
          type: 'organisasjonsnummer',
          id: _newArbeidsgiversOrgnr
        }]
      }
    }

    const valid: boolean = performValidationArbeidsperiode({
      arbeidsgiver: newArbeidsgiver,
      includeAddress
    })

    if (valid) {
      let newAddedArbeidsperioder: Array<PeriodeMedForsikring> = _.cloneDeep(_addedArbeidsperioder)
      newAddedArbeidsperioder = newAddedArbeidsperioder.concat(newArbeidsgiver)
      setAddedArbeidsperioder(newAddedArbeidsperioder)
      standardLogger('svarsed.editor.arbeidsgiver.added.add')
      resetArbeidsgiverForm()
    }
  }

  const onPeriodeAdd = () => {
    const valid: boolean = performValidationPeriode({
      periode: _newPeriode,
      perioder: perioderSomAnsatt,
      personName
    })
    if (valid) {
      addPeriode(_newPeriode)
      standardLogger('svarsed.editor.periode.add', { type: 'perioderSomAnsatt' })
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

  const onArbeidsgiverPeriodeChanged = (periode: Periode) => {
    _resetValidationArbeidsperiode(namespace + '-arbeidsgiver-startdato')
    _resetValidationArbeidsperiode(namespace + '-arbeidsgiver-sluttdato')
    _setNewArbeidsgiverPeriode(periode)
  }

  const onArbeidsgiversOrgnrChanged = (newOrg: string) => {
    _resetValidationArbeidsperiode(namespace + '-arbeidsgiver-orgnr')
    _setNewArbeidsgiversOrgnr(newOrg)
  }

  const onArbeidsgiversNavnChanged = (newName: string) => {
    _resetValidationArbeidsperiode(namespace + '-arbeidsgiver-navn')
    _setNewArbeidsgiversNavn(newName)
  }

  const setPeriode = (periode: Periode, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      _resetValidationPeriode(namespace + '-periode-startdato')
      _resetValidationPeriode(namespace + '-periode-sluttdato')
    } else {
      dispatch(updateReplySed(`${target}[${index}]`, periode))
      if (validation[namespace + getIdx(index) + '-periode-startdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-periode-startdato'))
      }
      if (validation[namespace + getIdx(index) + '-periode-luttdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-periode-sluttdato'))
      }
    }
  }

  const renderNewArbeidsgiver = () => (
    <RepeatableRow className='new'>
      <Heading size='small'>
        {t('label:legg-til-arbeidsperiode')}
      </Heading>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <PeriodeInput
          namespace={namespace}
          error={{
            startdato: _validationArbeidsperiode[namespace + '-arbeidsgiver-startdato']?.feilmelding,
            sluttdato: _validationArbeidsperiode[namespace + '-arbeidsgiver-sluttdato']?.feilmelding
          }}
          setPeriode={onArbeidsgiverPeriodeChanged}
          value={_newArbeidsgiverPeriode}
        />
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv size='0.5' />
      <AlignStartRow>
        <Column>
          <Input
            error={_validationArbeidsperiode[namespace + '-arbeidsgiver-orgnr']?.feilmelding}
            namespace={namespace + '-arbeidsgiver'}
            id='orgnr'
            key={namespace + '-arbeidsgiver-orgnr-' + _newArbeidsgiversOrgnr}
            label={t('label:orgnr')}
            onChanged={onArbeidsgiversOrgnrChanged}
            value={_newArbeidsgiversOrgnr}
          />
        </Column>
        <Column>
          <Input
            error={_validationArbeidsperiode[namespace + '-arbeidsgiver-navn']?.feilmelding}
            namespace={namespace + '-arbeidsgiver'}
            key={namespace + '-arbeidsgiver-navn-' + _newArbeidsgiversNavn}
            id='navn'
            label={t('label:navn')}
            onChanged={onArbeidsgiversNavnChanged}
            value={_newArbeidsgiversNavn}
          />
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column>
          <Button
            variant='secondary'
            onClick={onArbeidsgiverAdd}
          >
            <AddCircle />
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
    </RepeatableRow>
  )

  const renderNewPeriode = () => (
    <RepeatableRow className='new'>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <PeriodeInput
          namespace={namespace}
          error={{
            startdato: _validationPeriode[namespace + '-periode-startdato']?.feilmelding,
            sluttdato: _validationPeriode[namespace + '-periode-sluttdato']?.feilmelding
          }}
          setPeriode={(p: Periode) => setPeriode(p, -1)}
          value={_newPeriode}
        />
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column>
          <Button
            variant='secondary'
            onClick={onPeriodeAdd}
          >
            <AddCircle />
            {t('el:button-add')}
          </Button>
          <HorizontalSeparatorDiv size='0.5' />
          <Button
            variant='tertiary'
            onClick={onCancelPeriodeClicked}
          >
            {t('el:button-cancel')}
          </Button>
        </Column>
      </AlignStartRow>
    </RepeatableRow>
  )

  const renderPlanItem = (item: any) => {
    if (item.type === 'periode') {
      const idx = getIdx(item.index)
      const candidateForDeletion = !_.isNil(item.index) && item.index >= 0 ? isInDeletion(item.item as Periode) : false
      const getErrorFor = (el: string): string | undefined => (
        !_.isNil(item.index) && item.index >= 0
          ? validation[namespace + '-periode' + idx + '-' + el]?.feilmelding
          : _validationPeriode[namespace + '-periode-' + el]?.feilmelding
      )
      return (
        <>
          <PeriodeInput
            namespace={namespace + '-periode' + idx}
            error={{
              startdato: getErrorFor('startdato'),
              sluttdato: getErrorFor('sluttdato'),
              aapenPeriodeType: getErrorFor('aapenPeriodeType')
            }}
            setPeriode={(p: Periode) => setPeriode(p, item.index!)}
            value={(item.item as Periode)}
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
        </>
      )
    }

    if (item.type === 'arbeidsperiode') {
      return (
        <Column>
          <ArbeidsperioderBox
            arbeidsgiver={item.item as unknown as PeriodeMedForsikring}
            editable='only_period'
            newArbeidsgiver={false}
            includeAddress={includeAddress}
            selected={!_.isNil(item.index) && item.index >= 0}
            key={getOrgnr(item.item as unknown as PeriodeMedForsikring, 'organisasjonsnummer')}
            onArbeidsgiverSelect={onArbeidsgiverSelect}
            onArbeidsgiverEdit={onRegisteredArbeidsgiverEdit}
            namespace={namespace}
          />
        </Column>
      )
    }

    if (item.type === 'addedArbeidsperiode') {
      return (
        <Column>
          <ArbeidsperioderBox
            arbeidsgiver={item.item as unknown as PeriodeMedForsikring}
            editable='full'
            error={item.duplicate}
            newArbeidsgiver
            includeAddress={includeAddress}
            selected={!_.isNil(item.index) && item.index >= 0}
            key={getOrgnr(item.item as unknown as PeriodeMedForsikring, 'organisasjonsnummer')}
            onArbeidsgiverSelect={onArbeidsgiverSelect}
            onArbeidsgiverDelete={onArbeidsgiverDelete}
            onArbeidsgiverEdit={onArbeidsgiverEdit}
            namespace={namespace}
          />
        </Column>
      )
    }
  }

  const renderPlan = () => {
    const plan = makeRenderPlan<Periode>({
      perioder: perioderSomAnsatt,
      arbeidsperioder,
      addedArbeidsperioder: _addedArbeidsperioder
    } as RenderPlanProps<Periode>)

    return plan?.map((item: PlanItem<Periode>) => (
      <div key={item.type + '-' + item.item.startdato + '-' + item.item.sluttdato}>
        <AlignStartRow>
          {renderPlanItem(item)}
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </div>
    ))
  }

  return (
    <>
      <Heading size='small'>
        {t('label:oversikt-brukers-arbeidsperioder')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <Ingress>
        {t('label:hent-perioder-fra-aa-registeret-og-a-inntekt')}
      </Ingress>
      <VerticalSeparatorDiv />
      <ArbeidsperioderSøk
        amplitude='svarsed.editor.personensstatus.ansatt.arbeidsgiver.search'
        fnr={fnr}
        fillOutFnr={() => {
          document.dispatchEvent(new CustomEvent('feillenke', {
            detail: {
              skjemaelementId: `MainForm-${personID}-personopplysninger-norskpin-nummer`,
              feilmelding: ''
            } as ErrorElement
          }))
        }}
        namespace={namespace}
      />
      <VerticalSeparatorDiv size='2' />
      {_.isEmpty(perioderSomAnsatt) && (
        <>
          <BodyLong>
            {t('message:warning-no-periods')}
          </BodyLong>
          <VerticalSeparatorDiv />
        </>
      )}
      {renderPlan()}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv size='2' />
      {_seeNewArbeidsgiver && renderNewArbeidsgiver()}
      {_seeNewPeriode && renderNewPeriode()}
      {!_seeNewPeriode && !_seeNewArbeidsgiver && (
        <FlexCenterDiv>
          <span>{t('label:du-kan')}</span>
          <Button
            variant='tertiary'
            onClick={() => _setSeeNewArbeidsgiver(true)}
          >
            <AddCircle />
            {t('el:button-add-new-x', {
              x: t('label:arbeidperioder').toLowerCase()
            })}
          </Button>
          <span>&nbsp;{t('label:eller')}&nbsp;</span>
          <Button
            variant='tertiary'
            onClick={() => _setSeeNewPeriode(true)}
          >
            <AddCircle />
            {t('el:button-add-new-x', {
              x: t('label:periode').toLowerCase()
            })}
          </Button>
        </FlexCenterDiv>
      )}
    </>
  )
}

export default Ansatt