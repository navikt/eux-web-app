import { getArbeidsperioder } from 'actions/arbeidsgiver'
import { fetchInntekt } from 'actions/inntekt'
import {
  validateArbeidsgiver,
  ValidationArbeidsgiverProps
} from 'applications/SvarSed/PersonManager/PersonensStatus/ansattValidation'
import {
  validateDato,
  ValidationDatoProps
} from './validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Add from 'assets/icons/Add'
import ArbeidsgiverBox from 'components/Arbeidsgiver/ArbeidsgiverBox'
import ArbeidsgiverSøk from 'components/Arbeidsgiver/ArbeidsgiverSøk'
import Input from 'components/Forms/Input'
import Inntekt from 'components/Inntekt/Inntekt'
import Period, { toFinalDateFormat } from 'components/Period/Period'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
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

interface ArbeidsforholdSelector extends PersonManagerFormSelector {
  arbeidsperioder: Arbeidsperioder | undefined
  gettingArbeidsperioder: boolean
  inntekter: IInntekter | undefined
  gettingInntekter: boolean
  replySed: ReplySed | undefined
  validation: Validation
}

const mapState = (state: State): ArbeidsforholdSelector => ({
  arbeidsperioder: state.arbeidsgiver.arbeidsperioder,
  gettingArbeidsperioder: state.loading.gettingArbeidsperioder,
  inntekter: state.inntekt.inntekter,
  gettingInntekter: state.loading.gettingInntekter,
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const Arbeidsforhold: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    arbeidsperioder,
    gettingArbeidsperioder,
    inntekter,
    gettingInntekter,
    replySed
  } = useSelector<State, ArbeidsforholdSelector>(mapState)
  const dispatch = useDispatch()
  // TODO add target
  // const target = 'xxx-arbeidsforhold'
  //const anmodningsperiode: Periode = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-arbeidsforhold`
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
  const [_validationDato, _resetValidationDato, performValidationDato] =
    useValidation<ValidationDatoProps>({}, validateDato)

  const [_addedArbeidsperioder, setAddedArbeidsperioder] = useState<Arbeidsperioder>(() => ({
    arbeidsperioder: [],
    uriArbeidsgiverRegister: '',
    uriInntektRegister: ''
  }))

  const setArbeidssøkStartDato = (value: string) => {
    _resetValidationDato('startdato')
    _setArbeidssøkStartDato(value)
  }

  const setArbeidssøkSluttDato = (value: string) => {
    _resetValidationDato('sluttdato')
    _setArbeidssøkSluttDato(value)
  }

  const onArbeidsperioderClicked = () => {
    const valid = performValidationDato({
      startdato: _arbeidssøkStartDato,
      sluttdato: _arbeidssøkSluttDato,
      namespace: 'arbeidssok'
    })
    if (valid) {
      dispatch(getArbeidsperioder(fnr))
    }
  }

  const onInntektClicked = () => {
    dispatch(fetchInntekt(fnr))
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
      fraDato: toFinalDateFormat(_newArbeidsgiverStartDato),
      tilDato: toFinalDateFormat(_newArbeidsgiverSluttDato),
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
          namespace='arbeidssok'
          errorStartDato={_validationDato['arbeidssok-startdato']?.feilmelding}
          errorSluttDato={_validationDato['arbeidssok-sluttdato']?.feilmelding}
          setStartDato={setArbeidssøkStartDato}
          setSluttDato={setArbeidssøkSluttDato}
          valueStartDato={_arbeidssøkStartDato}
          valueSluttDato={_arbeidssøkSluttDato}
        />
        <Column>
          <VerticalSeparatorDiv size='1.8' />
          <ArbeidsgiverSøk
            gettingArbeidsperioder={gettingArbeidsperioder}
            getArbeidsperioder={onArbeidsperioderClicked}
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
      {arbeidsperioder?.arbeidsperioder.map(arbeidsgiver => (
        <AlignStartRow key={arbeidsgiver.arbeidsgiversOrgnr} className='slideInFromLeft'>
          <Column>
            <ArbeidsgiverBox
              arbeidsgiver={arbeidsgiver}
              editable={false}
              newArbeidsgiver={false}
              key={arbeidsgiver.arbeidsgiversOrgnr}
              onArbeidsgiverSelect={() => {}}
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
              key={arbeidsgiver.arbeidsgiversOrgnr}
              onArbeidsgiverSelect={() => {}}
              namespace={namespace}
            />
          </Column>
        </AlignStartRow>
      ))}
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
          <HorizontalSeparatorDiv/>
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

export default Arbeidsforhold
