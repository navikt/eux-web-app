import { getArbeidsperioder } from 'actions/arbeidsgiver'
import { fetchInntekt } from 'actions/inntekt'
import { updateReplySed } from 'actions/svarpased'
import {
  validateArbeidsgiver,
  ValidationArbeidsgiverProps
} from 'components/Arbeidsgiver/validation'
import moment from 'moment'
import {
  performValidationArbeidsperioderSearch,
  ValidationDatoProps
} from './validation'
import { PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Add from 'assets/icons/Add'
import ArbeidsgiverBox from 'components/Arbeidsgiver/ArbeidsgiverBox'
import ArbeidsgiverSøk from 'components/Arbeidsgiver/ArbeidsgiverSøk'
import Input from 'components/Forms/Input'
import Inntekt from 'components/Inntekt/Inntekt'
import Period from 'components/Period/Period'
import { State } from 'declarations/reducers'
import { Periode, PeriodeAnnen, ReplySed } from 'declarations/sed'
import { Arbeidsgiver, Arbeidsperioder, IInntekter, Validation } from 'declarations/types'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { Systemtittel, Undertittel } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column,
  FlexBaseDiv,
  HighContrastFlatknapp,
  HighContrastKnapp,
  HorizontalSeparatorDiv,
  PaddedDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getFnr } from 'utils/fnr'

export interface ArbeidsforholdOtherSelector extends PersonManagerFormSelector {
  arbeidsperioder: Arbeidsperioder | undefined
  gettingArbeidsperioder: boolean
  inntekter: IInntekter | undefined
  gettingInntekter: boolean
  replySed: ReplySed | undefined
  validation: Validation
}

export interface ArbeidsforholdOtherProps {
  parentNamespace: string
  target: string
  typeTrygdeforhold: string
}

const mapState = (state: State): ArbeidsforholdOtherSelector => ({
  arbeidsperioder: state.arbeidsgiver.arbeidsperioder,
  gettingArbeidsperioder: state.loading.gettingArbeidsperioder,
  inntekter: state.inntekt.inntekter,
  gettingInntekter: state.loading.gettingInntekter,
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const ArbeidsforholdOther: React.FC<ArbeidsforholdOtherProps> = ({
  parentNamespace,
  target,
  typeTrygdeforhold
}:ArbeidsforholdOtherProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    arbeidsperioder,
    gettingArbeidsperioder,
    inntekter,
    gettingInntekter,
    replySed
  } = useSelector<State, ArbeidsforholdOtherSelector>(mapState)
  const dispatch = useDispatch()

  const perioder: Array<PeriodeAnnen> | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${target}`
  const fnr = getFnr(replySed)

  const [_arbeidssøkStartDato, _setArbeidssøkStartDato] = useState<string>('')
  const [_arbeidssøkSluttDato, _setArbeidssøkSluttDato] = useState<string>('')

  const [_newArbeidsgiverStartDato, _setNewArbeidsgiverStartDato] = useState<string>('')
  const [_newArbeidsgiverSluttDato, _setNewArbeidsgiverSluttDato] = useState<string>('')
  const [_newArbeidsgiversOrgnr, _setNewArbeidsgiversOrgnr] = useState<string>('')
  const [_newArbeidsgiversNavn, _setNewArbeidsgiversNavn] = useState<string>('')
  const [_seeNewArbeidsgiver, _setSeeNewArbeidsgiver] = useState<boolean>(false)
  const [_validationArbeidsgiver, _resetValidationArbeidsgiver, performValidationArbeidsgiver] =
    useValidation<ValidationArbeidsgiverProps>({}, validateArbeidsgiver)
  const [_validationSearch, _resetValidationSearch, performValidationSearch] =
    useValidation<ValidationDatoProps>({}, performValidationArbeidsperioderSearch)

  const [_addedArbeidsperioder, setAddedArbeidsperioder] = useState<Arbeidsperioder>(() => ({
    arbeidsperioder: [],
    uriArbeidsgiverRegister: '',
    uriInntektRegister: ''
  }))

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

  const addPeriodeFromArbeidsgiver = (selectedArbeidsgiver: Arbeidsgiver) => {
    const newPeriode: Periode = {
      startdato: selectedArbeidsgiver.fraDato!
    }
    if (selectedArbeidsgiver.tilDato) {
      newPeriode.sluttdato = selectedArbeidsgiver.tilDato
    } else {
      newPeriode.aapenPeriodeType = 'åpen_sluttdato'
    }
    const newPeriodePlusArbeidsgiver: PeriodeAnnen = {
      periode: newPeriode,
      arbeidsgiver: {
        navn: selectedArbeidsgiver.arbeidsgiversNavn ?? '',
        identifikator: [{
          type: 'registrering',
          id: selectedArbeidsgiver.arbeidsgiversOrgnr
        }]
      },
      typeTrygdeforhold: typeTrygdeforhold
    }
    let newPerioderAnsattMedForsikring: Array<PeriodeAnnen> | undefined = _.cloneDeep(perioder)
    if (!newPerioderAnsattMedForsikring) {
      newPerioderAnsattMedForsikring = []
    }
    newPerioderAnsattMedForsikring = newPerioderAnsattMedForsikring.concat(newPeriodePlusArbeidsgiver).sort((a, b) =>
      moment(a.periode.startdato).isSameOrBefore(moment(b.periode.startdato)) ? -1 : 1
    )
    dispatch(updateReplySed(target, newPerioderAnsattMedForsikring))
  }

  const removePeriodeFromArbeidsgiver = (deletedArbeidsgiver: Arbeidsgiver) => {
    let newPerioderAnsattMedForsikring: Array<PeriodeAnnen> | undefined = _.cloneDeep(perioder)
    if (!newPerioderAnsattMedForsikring) {
      newPerioderAnsattMedForsikring = []
    }
    newPerioderAnsattMedForsikring = _.filter(newPerioderAnsattMedForsikring, p => p.periode.startdato !== deletedArbeidsgiver.fraDato)
    dispatch(updateReplySed(target, newPerioderAnsattMedForsikring))
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
      const index = _.findIndex(newAddedArbeidsperioder.arbeidsperioder, a => a.arbeidsgiversOrgnr === arbeidsgiver.arbeidsgiversOrgnr)
      if (index >= 0) {
        newAddedArbeidsperioder.arbeidsperioder[index] = arbeidsgiver
        setAddedArbeidsperioder(newAddedArbeidsperioder)
      }
    }
  }

  const onArbeidsgiverDelete = (deletedArbeidsgiver: Arbeidsgiver) => {
    const newAddedArbeidsperioder: Arbeidsperioder = _.cloneDeep(_addedArbeidsperioder) as Arbeidsperioder
    newAddedArbeidsperioder.arbeidsperioder = _.filter(newAddedArbeidsperioder?.arbeidsperioder,
      (a: Arbeidsgiver) => a.arbeidsgiversOrgnr !== deletedArbeidsgiver.arbeidsgiversOrgnr)
    setAddedArbeidsperioder(newAddedArbeidsperioder)
  }

  const resetArbeidsgiverForm = () => {
    _setNewArbeidsgiversNavn('')
    _setNewArbeidsgiversOrgnr('')
    _setNewArbeidsgiverSluttDato('')
    _setNewArbeidsgiverStartDato('')
    _resetValidationArbeidsgiver()
  }

  const onCancelArbeidsgiverClicked = () => {
    resetArbeidsgiverForm()
    _setSeeNewArbeidsgiver(!_seeNewArbeidsgiver)
  }

  const onArbeidsgiverStartDatoChanged = (dato: string) => {
    _resetValidationArbeidsgiver(namespace + '-arbeidsgiver-startdato')
    _setNewArbeidsgiverStartDato(dato)
  }

  const onArbeidsgiverSluttDatoChanged = (dato: string) => {
    _resetValidationArbeidsgiver(namespace + '-arbeidsgiver-sluttdato')
    _setNewArbeidsgiverSluttDato(dato)
  }

  const onArbeidsgiversOrgnrChanged = (newOrg: string) => {
    _resetValidationArbeidsgiver(namespace + '-arbeidsgiver-orgnr')
    _setNewArbeidsgiversOrgnr(newOrg)
  }

  const onArbeidsgiversNavnChanged = (newName: string) => {
    _resetValidationArbeidsgiver(namespace + '-arbeidsgiver-navn')
    _setNewArbeidsgiversNavn(newName)
  }

  const onArbeidsgiverAdd = () => {
    const newArbeidsgiver: Arbeidsgiver = {
      arbeidsgiversNavn: _newArbeidsgiversNavn,
      arbeidsgiversOrgnr: _newArbeidsgiversOrgnr,
      fraDato: _newArbeidsgiverStartDato,
      tilDato: _newArbeidsgiverSluttDato,
      fraInntektsregisteret: 'nei',
      fraArbeidsgiverregisteret: 'nei'
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
      <VerticalSeparatorDiv />

      {arbeidsperioder?.arbeidsperioder.map((arbeidsgiver: any) => (
        <AlignStartRow key={arbeidsgiver.arbeidsgiversOrgnr} className='slideInFromLeft'>
          <Column>
            <ArbeidsgiverBox
              arbeidsgiver={arbeidsgiver}
              editable={false}
              newArbeidsgiver={false}
             /* selected={_.find(perioder, (p: PeriodeAnnen) =>
                p.periode.startdato === toFinalDateFormat(arbeidsgiver.fraDato) &&
                _.find(p.arbeidsgiver.identifikator, id => id.id === arbeidsgiver.arbeidsgiversOrgnr && id.type === 'registrering') !== undefined
              ) !== undefined} */
              key={arbeidsgiver.arbeidsgiversOrgnr}
              onArbeidsgiverSelect={onArbeidsgiverSelect}
              namespace={namespace}
            />
          </Column>
        </AlignStartRow>
      ))}

      {_addedArbeidsperioder?.arbeidsperioder.map(arbeidsgiver => (
        <AlignStartRow key={arbeidsgiver.arbeidsgiversOrgnr} className='slideInFromLeft'>
          <Column>
            <ArbeidsgiverBox
              arbeidsgiver={arbeidsgiver}
              editable={false}
              newArbeidsgiver
              /* selected={_.find(perioder, (p: PeriodeAnnen) =>
                p.periode.startdato === toFinalDateFormat(arbeidsgiver.fraDato) &&
                _.find(p.arbeidsgiver.identifikator, id => id.id === arbeidsgiver.arbeidsgiversOrgnr && id.type === 'registrering') !== undefined
              ) !== undefined} */
              key={arbeidsgiver.arbeidsgiversOrgnr}
              onArbeidsgiverSelect={onArbeidsgiverSelect}
              onArbeidsgiverDelete={onArbeidsgiverDelete}
              onArbeidsgiverEdit={onArbeidsgiverEdit}
              namespace={namespace}
            />
          </Column>
        </AlignStartRow>
      ))}

      <VerticalSeparatorDiv size='2' />
      {!_seeNewArbeidsgiver
        ? (
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
                  onChanged={onArbeidsgiversOrgnrChanged}
                  value={_newArbeidsgiversOrgnr}
                />
              </Column>
              <Column>
                <Input
                  feil={_validationArbeidsgiver[namespace + '-arbeidsgiver-navn']?.feilmelding}
                  namespace={namespace + '-arbeidsgiver'}
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
          </>
          )}
      <VerticalSeparatorDiv size='3' />
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

export default ArbeidsforholdOther
