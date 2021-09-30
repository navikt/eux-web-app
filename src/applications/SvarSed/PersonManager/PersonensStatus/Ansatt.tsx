import { getArbeidsperioder, updateArbeidsgivere } from 'actions/arbeidsgiver'
import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Add from 'assets/icons/Add'
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
import moment from 'moment'
import { Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column,
  FlexCenterDiv,
  HighContrastFlatknapp,
  HighContrastKnapp,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getOrgnr, hasOrgnr } from 'utils/arbeidsgiver'
import { getFnr } from 'utils/fnr'
import { getIdx } from 'utils/namespace'
import makeRenderPlan, { PlanItem, RenderPlanProps } from 'utils/renderPlan'
import { validateAnsattPeriode, ValidationArbeidsperiodeProps } from './ansattValidation'

interface AnsattSelector extends PersonManagerFormSelector {
  arbeidsperioder: Arbeidsperioder | undefined
  gettingArbeidsperioder: boolean
}

const mapState = (state: State): AnsattSelector => ({
  arbeidsperioder: state.arbeidsgiver.arbeidsperioder,
  gettingArbeidsperioder: state.loading.gettingArbeidsperioder,
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const Ansatt: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  personName
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    arbeidsperioder,
    gettingArbeidsperioder,
    replySed,
    validation
  } = useSelector<State, AnsattSelector>(mapState)
  const dispatch = useDispatch()
  const namespace = `${parentNamespace}-ansatt`
  const target = `${personID}.perioderSomAnsatt`
  const perioderSomAnsatt: Array<Periode> | undefined = _.get(replySed, target)
  const includeAddress = false

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

  const fnr = getFnr(replySed)

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
    addPeriode(selectedArbeidsgiver.periode)
  }

  const removePeriode = (deletedPeriode: Periode) => {
    let newPerioder: Array<Periode> | undefined = _.cloneDeep(perioderSomAnsatt)
    if (!newPerioder) {
      newPerioder = []
    }
    newPerioder = _.filter(newPerioder, p => p.startdato !== deletedPeriode.startdato)
    dispatch(updateReplySed(target, newPerioder))
  }

  const removePeriodeFromArbeidsgiver = (deletedArbeidsgiver: PeriodeMedForsikring) => {
    let newPerioder: Array<Periode> | undefined = _.cloneDeep(perioderSomAnsatt)
    if (!newPerioder) {
      newPerioder = []
    }
    newPerioder = _.filter(newPerioder, p => p.startdato !== deletedArbeidsgiver.periode.startdato)
    dispatch(updateReplySed(target, newPerioder))
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
    const needleId: string | undefined = getOrgnr(newArbeidsgiver)

    if (needleId) {
      const indexArbeidsgiver = _.findIndex(newArbeidsgivere, (p: Arbeidsgiver) => p.arbeidsgiversOrgnr === needleId)
      if (indexArbeidsgiver >= 0) {
        newArbeidsgivere[indexArbeidsgiver].fraDato = newArbeidsgiver.periode.startdato
        newArbeidsgivere[indexArbeidsgiver].tilDato = newArbeidsgiver.periode.sluttdato
        dispatch(updateArbeidsgivere(newArbeidsgivere))
      }

      if (selected) {
        const indexPerioder = _.findIndex(newPerioder, (p: Periode) => {
          return oldArbeidsgiver.periode.startdato === p.startdato && oldArbeidsgiver.periode.sluttdato === p.sluttdato
        })
        if (indexPerioder >= 0) {
          const newPeriode: Periode = {
            startdato: newArbeidsgiver.periode.startdato
          }
          if (newArbeidsgiver.periode.sluttdato) {
            newPeriode.sluttdato = newArbeidsgiver.periode.sluttdato.trim()
          } else {
            newPeriode.aapenPeriodeType = 'åpen_sluttdato'
          }

          newPerioder[indexPerioder] = newPeriode
          dispatch(updateReplySed(target, newPerioder))
        }
      }
    }
  }

  const onArbeidsgiverEdit = (newArbeidsgiver: PeriodeMedForsikring, oldArbeidsgiver: PeriodeMedForsikring, selected: boolean) => {
    let newPerioder: Array<Periode> | undefined = _.cloneDeep(perioderSomAnsatt)
    if (!newPerioder) {
      newPerioder = []
    }
    const newAddedArbeidsperioder: Array<PeriodeMedForsikring> = _.cloneDeep(_addedArbeidsperioder)
    const needleId : string | undefined = getOrgnr(newArbeidsgiver)

    if (newAddedArbeidsperioder && needleId) {
      const index = _.findIndex(newAddedArbeidsperioder, (p: PeriodeMedForsikring) => hasOrgnr(p, needleId))
      if (index >= 0) {
        newAddedArbeidsperioder[index] = newArbeidsgiver
        setAddedArbeidsperioder(newAddedArbeidsperioder)
      }

      if (selected) {
        const indexPerioder = _.findIndex(newPerioder, (p: Periode) => {
          return oldArbeidsgiver.periode.startdato === p.startdato && oldArbeidsgiver.periode.sluttdato === p.sluttdato
        })
        if (indexPerioder >= 0) {
          const newPeriode: Periode = {
            startdato: newArbeidsgiver.periode.startdato
          }
          if (newArbeidsgiver.periode.sluttdato) {
            newPeriode.sluttdato = newArbeidsgiver.periode.sluttdato.trim()
          } else {
            newPeriode.aapenPeriodeType = 'åpen_sluttdato'
          }

          newPerioder[indexPerioder] = newPeriode
          dispatch(updateReplySed(target, newPerioder))
        }
      }
    }
  }

  const onArbeidsgiverDelete = (deletedArbeidsgiver: PeriodeMedForsikring) => {
    let newAddedArbeidsperioder: Array<PeriodeMedForsikring> = _.cloneDeep(_addedArbeidsperioder)
    const needleId : string | undefined = getOrgnr(deletedArbeidsgiver)
    if (newAddedArbeidsperioder && needleId) {
      newAddedArbeidsperioder = _.filter(newAddedArbeidsperioder, (p: PeriodeMedForsikring) => !hasOrgnr(p, needleId))
      setAddedArbeidsperioder(newAddedArbeidsperioder)
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
      arbeidsgiver: {
        navn: _newArbeidsgiversNavn,
        identifikator: [{
          type: 'registrering',
          id: _newArbeidsgiversOrgnr
        }]
      },
      periode: _newArbeidsgiverPeriode,
      typeTrygdeforhold: ''
    }

    const valid: boolean = performValidationArbeidsgiver({
      arbeidsgiver: newArbeidsgiver,
      namespace: namespace,
      includeAddress: includeAddress
    })

    if (valid) {
      let newAddedArbeidsperioder: Array<PeriodeMedForsikring> = _.cloneDeep(_addedArbeidsperioder)
      newAddedArbeidsperioder = newAddedArbeidsperioder.concat(newArbeidsgiver)
      setAddedArbeidsperioder(newAddedArbeidsperioder)
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
      <Undertittel>
        {t('label:legg-til-arbeidsperiode')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft'>
        <PeriodeInput
          key={'' + _newArbeidsgiverPeriode.startdato + _newArbeidsgiverPeriode.sluttdato}
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
    </RepeatableRow>
  )

  const renderNewPeriode = () => (
    <RepeatableRow className='new'>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft'>
        <PeriodeInput
          key={'' + _newPeriode.startdato + _newPeriode.sluttdato}
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
              key={'' + (item.item as Periode).startdato + (item.item as Periode).sluttdato}
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
                newArbeidsgiver={false}
                includeAddress={includeAddress}
                selected={!_.isNil(item.index) && item.index >= 0}
                key={getOrgnr(item.item as unknown as PeriodeMedForsikring)}
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
                newArbeidsgiver
                includeAddress={includeAddress}
                selected={!_.isNil(item.index) && item.index >= 0}
                key={getOrgnr(item.item as unknown as PeriodeMedForsikring)}
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
      <Systemtittel>
        {t('label:aa-registeret')}
      </Systemtittel>
      <VerticalSeparatorDiv size='2' />
      <Undertittel>
        {t('label:registered-arbeidsperiode')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {_.isNil(arbeidsperioder) && (
        <Row>
          <Column>
            <ArbeidsgiverSøk
              gettingArbeidsperioder={gettingArbeidsperioder}
              getArbeidsperioder={() => dispatch(getArbeidsperioder(fnr))}
            />
          </Column>
        </Row>
      )}
      <VerticalSeparatorDiv size='2' />
      {_.isEmpty(perioderSomAnsatt) && (
        <>
          <Normaltekst>
            {t('message:warning-no-periods')}
          </Normaltekst>
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
          <span>&nbsp;{t('label:eller')}&nbsp;</span>
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
        </FlexCenterDiv>
      )}
    </>
  )
}

export default Ansatt
