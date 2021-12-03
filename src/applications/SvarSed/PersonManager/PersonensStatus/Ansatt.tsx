import { Add } from '@navikt/ds-icons'
import { updateArbeidsgivere } from 'actions/arbeidsgiver'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import ArbeidsgiverBox from 'components/Arbeidsgiver/ArbeidsgiverBox'
import ArbeidsgiverSøk from 'components/Arbeidsgiver/ArbeidsgiverSøk'
import { validateArbeidsgiver, ValidationArbeidsgiverProps } from 'components/Arbeidsgiver/validation'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Periode, PeriodeMedForsikring } from 'declarations/sed'
import { Arbeidsgiver, Arbeidsperioder } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import { ErrorElement } from 'declarations/app.d'
import { Button, Ingress, BodyLong, Heading } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  FlexCenterDiv,
  HorizontalSeparatorDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { generateIdentifikatorKey, getOrgnr } from 'utils/arbeidsgiver'
import { getFnr } from 'utils/fnr'
import { getIdx } from 'utils/namespace'
import makeRenderPlan, { PlanItem, RenderPlanProps } from 'utils/renderPlan'
import { validateAnsattPeriode, ValidationArbeidsperiodeProps } from './ansattValidation'

interface AnsattSelector extends PersonManagerFormSelector {
  arbeidsperioder: Arbeidsperioder | null | undefined
  highContrast: boolean
}

const mapState = (state: State): AnsattSelector => ({
  arbeidsperioder: state.arbeidsgiver.arbeidsperioder,
  highContrast: state.ui.highContrast,
  validation: state.validation.status
})

const Ansatt: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    arbeidsperioder,
    highContrast,
    validation
  } = useSelector<State, AnsattSelector>(mapState)
  const dispatch = useDispatch()
  const namespace = `${parentNamespace}-ansatt`
  const target = `${personID}.perioderSomAnsatt`
  const perioderSomAnsatt: Array<Periode> | undefined = _.get(replySed, target)
  const includeAddress = false
  const fnr = getFnr(replySed, personID)

  const [_addedArbeidsperioder, setAddedArbeidsperioder] = useState<Array<PeriodeMedForsikring>>([])

  // arbeidsgivere
  const [_newArbeidsgiverPeriode, _setNewArbeidsgiverPeriode] = useState<Periode>({ startdato: '' })
  const [_newArbeidsgiversOrgnr, _setNewArbeidsgiversOrgnr] = useState<string>('')
  const [_newArbeidsgiversNavn, _setNewArbeidsgiversNavn] = useState<string>('')
  const [_seeNewArbeidsgiver, _setSeeNewArbeidsgiver] = useState<boolean>(false)
  const [_validationArbeidsgiver, _resetValidationArbeidsgiver, performValidationArbeidsgiver] =
    useValidation<ValidationArbeidsgiverProps>({}, validateArbeidsgiver)

  // periode
  const [_newPeriode, _setNewPeriode] = useState<Periode>({ startdato: '' })
  const [_seeNewPeriode, _setSeeNewPeriode] = useState<boolean>(false)
  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Periode>((p: Periode) => p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType))
  const [_validationPeriode, _resetValidationPeriode, performValidationPeriode] =
    useValidation<ValidationArbeidsperiodeProps>({}, validateAnsattPeriode)

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
    const newArbeidsgivere: Array<Arbeidsgiver> | undefined = _.cloneDeep(arbeidsperioder?.arbeidsperioder) as Array<Arbeidsgiver>
    const needleId: string | undefined = getOrgnr(newArbeidsgiver, 'organisasjonsnummer')

    if (needleId) {
      const indexArbeidsgiver = _.findIndex(newArbeidsgivere, (p: Arbeidsgiver) => p.arbeidsgiversOrgnr === needleId)
      if (indexArbeidsgiver >= 0) {
        newArbeidsgivere[indexArbeidsgiver].fraDato = newArbeidsgiver.startdato
        newArbeidsgivere[indexArbeidsgiver].tilDato = newArbeidsgiver.sluttdato
        dispatch(updateArbeidsgivere(newArbeidsgivere))
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
    const needleId : string | undefined = generateIdentifikatorKey(newArbeidsgiver.arbeidsgiver.identifikator)

    if (newAddedArbeidsperioder && needleId) {
      const index = _.findIndex(newAddedArbeidsperioder, (p: PeriodeMedForsikring) => generateIdentifikatorKey(p.arbeidsgiver.identifikator) === needleId)
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
    const needleId : string | undefined = generateIdentifikatorKey(deletedArbeidsgiver.arbeidsgiver.identifikator)
    if (newAddedArbeidsperioder && needleId) {
      newAddedArbeidsperioder = _.filter(newAddedArbeidsperioder, (p: PeriodeMedForsikring) => generateIdentifikatorKey(p.arbeidsgiver.identifikator) !== needleId)
      setAddedArbeidsperioder(newAddedArbeidsperioder)
      standardLogger('svarsed.editor.arbeidsgiver.added.remove')
    }
  }

  const resetArbeidsgiverForm = () => {
    _setNewArbeidsgiversNavn('')
    _setNewArbeidsgiversOrgnr('')
    _setNewArbeidsgiverPeriode({ startdato: '' })
    _resetValidationArbeidsgiver()
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
        identifikator: [{
          type: 'organisasjonsnummer',
          id: _newArbeidsgiversOrgnr
        }]
      }
    }

    const valid: boolean = performValidationArbeidsgiver({
      arbeidsgiver: newArbeidsgiver,
      namespace: namespace + '-arbeidsgiver',
      includeAddress: includeAddress
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
      namespace: namespace,
      personName: personName
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
    _resetValidationArbeidsgiver(namespace + '-arbeidsgiver-startdato')
    _resetValidationArbeidsgiver(namespace + '-arbeidsgiver-sluttdato')
    _setNewArbeidsgiverPeriode(periode)
  }

  const onArbeidsgiversOrgnrChanged = (newOrg: string) => {
    _resetValidationArbeidsgiver(namespace + '-arbeidsgiver-orgnr')
    _setNewArbeidsgiversOrgnr(newOrg)
  }

  const onArbeidsgiversNavnChanged = (newName: string) => {
    _resetValidationArbeidsgiver(namespace + '-arbeidsgiver-navn')
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
      <AlignStartRow className='slideInFromLeft'>
        <PeriodeInput
          namespace={namespace}
          error={{
            startdato: _validationArbeidsgiver[namespace + '-arbeidsgiver-startdato']?.feilmelding,
            sluttdato: _validationArbeidsgiver[namespace + '-arbeidsgiver-sluttdato']?.feilmelding
          }}
          setPeriode={onArbeidsgiverPeriodeChanged}
          value={_newArbeidsgiverPeriode}
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
            key={namespace + '-arbeidsgiver-orgnr-' + _newArbeidsgiversOrgnr}
            label={t('label:orgnr')}
            onChanged={onArbeidsgiversOrgnrChanged}
            value={_newArbeidsgiversOrgnr}
          />
        </Column>
        <Column>
          <Input
            feil={_validationArbeidsgiver[namespace + '-arbeidsgiver-navn']?.feilmelding}
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
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
        <Column>
          <Button
            variant='secondary'
            size='small'
            onClick={onArbeidsgiverAdd}
          >
            <Add />
            <HorizontalSeparatorDiv size='0.5' />
            {t('el:button-add')}
          </Button>
          <HorizontalSeparatorDiv size='0.5' />
          <Button
            variant='tertiary'
            size='small'
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
      <AlignStartRow className='slideInFromLeft'>
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
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
        <Column>
          <Button
            variant='secondary'
            size='small'
            onClick={onPeriodeAdd}
          >
            <Add />
            <HorizontalSeparatorDiv size='0.5' />
            {t('el:button-add')}
          </Button>
          <HorizontalSeparatorDiv size='0.5' />
          <Button
            variant='tertiary'
            size='small'
            onClick={onCancelPeriodeClicked}
          >
            {t('el:button-cancel')}
          </Button>
        </Column>
      </AlignStartRow>
    </RepeatableRow>
  )

  const renderPlan = () => {
    const plan = makeRenderPlan<Periode>({
      perioder: perioderSomAnsatt,
      arbeidsperioder,
      addedArbeidsperioder: _addedArbeidsperioder
    } as RenderPlanProps<Periode>)

    return plan?.map((item: PlanItem<Periode>, i: number) => {
      let element: JSX.Element | null = null
      if (item.type === 'orphan') {
        const idx = getIdx(item.index)
        const candidateForDeletion = !_.isNil(item.index) && item.index >= 0 ? isInDeletion(item.item as Periode) : false
        const getErrorFor = (el: string): string | undefined => (
          !_.isNil(item.index) && item.index >= 0
            ? validation[namespace + '-periode' + idx + '-' + el]?.feilmelding
            : _validationPeriode[namespace + '-periode-' + el]?.feilmelding
        )

        element = (
          <AlignStartRow className='slideInFromLeft'>
            <PeriodeInput
              namespace={namespace + '-periode' + idx}
              error={{
                startdato: getErrorFor('startdato'),
                sluttdato: getErrorFor('sluttdato')
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
          </AlignStartRow>
        )
      }

      if (item.type === 'arbeidsgiver') {
        element = (
          <AlignStartRow className='slideInFromLeft'>
            <Column>
              <ArbeidsgiverBox
                arbeidsgiver={item.item as unknown as PeriodeMedForsikring}
                editable='only_period'
                highContrast={highContrast}
                newArbeidsgiver={false}
                includeAddress={includeAddress}
                selected={!_.isNil(item.index) && item.index >= 0}
                key={getOrgnr(item.item as unknown as PeriodeMedForsikring, 'organisasjonsnummer')}
                onArbeidsgiverSelect={onArbeidsgiverSelect}
                onArbeidsgiverEdit={onRegisteredArbeidsgiverEdit}
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
                arbeidsgiver={item.item as unknown as PeriodeMedForsikring}
                editable='full'
                error={item.duplicate}
                highContrast={highContrast}
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
    <>
      <Heading size='small'>
        {t('label:oversikt-brukers-arbeidsperioder')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <Ingress>
        {t('label:hent-perioder-fra-aa-registeret-og-a-inntekt')}
      </Ingress>
      <VerticalSeparatorDiv />
      <ArbeidsgiverSøk
        amplitude='svarsed.editor.personensstatus.ansatt.arbeidsgiver.search'
        fnr={fnr}
        fillOutFnr={() => {
          document.dispatchEvent(new CustomEvent('feillenke', {
            detail: {
              skjemaelementId: `personmanager-${personID}-personopplysninger-norskpin-nummer`,
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
            size='small'
            onClick={() => _setSeeNewArbeidsgiver(true)}
          >
            <Add />
            <HorizontalSeparatorDiv size='0.5' />
            {t('el:button-add-new-x', {
              x: t('label:arbeidperioder').toLowerCase()
            })}
          </Button>
          <span>&nbsp;{t('label:eller')}&nbsp;</span>
          <Button
            variant='tertiary'
            size='small'
            onClick={() => _setSeeNewPeriode(true)}
          >
            <Add />
            <HorizontalSeparatorDiv size='0.5' />
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
