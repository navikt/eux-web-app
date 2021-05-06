import {
  validateArbeidsgiver,
  ValidationArbeidsgiverProps
} from 'applications/SvarSed/PersonManager/PersonensStatus/ansattValidation'
import Add from 'assets/icons/Add'
import ArbeidsgiverBox from 'components/Arbeidsgiver/ArbeidsgiverBox'
import ArbeidsgiverSøk from 'components/Arbeidsgiver/ArbeidsgiverSøk'
import Input from 'components/Forms/Input'
import Inntekt from 'components/Inntekt/Inntekt'
import Period, { toFinalDateFormat } from 'components/Period/Period'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { Periode, ReplySed } from 'declarations/sed'
import { Arbeidsgiver, Arbeidsperioder, IInntekter, Validation } from 'declarations/types'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
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
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ArbeidsforholdProps {
  arbeidsperioder: Arbeidsperioder
  getArbeidsperioder: () => void
  gettingArbeidsperioder: boolean
  inntekter: IInntekter | undefined
  getInntekter: () => void
  highContrast: boolean
  gettingInntekter: boolean
  parentNamespace: string
  personID: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const Arbeidsforhold: React.FC<ArbeidsforholdProps> = ({
  arbeidsperioder,
  getArbeidsperioder,
  gettingArbeidsperioder,
  inntekter,
  getInntekter,
  gettingInntekter,
  highContrast,
  parentNamespace,
  personID,
  replySed,
  resetValidation,
  updateReplySed,
  validation
}:ArbeidsforholdProps): JSX.Element => {
  const { t } = useTranslation()
  const target = 'anmodningsperiode'
  const anmodningsperiode: Periode = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-arbeidsforhold`

  const [_newArbeidsgiverStartDato, _setNewArbeidsgiverStartDato] = useState<string>('')
  const [_newArbeidsgiverSluttDato, _setNewArbeidsgiverSluttDato] = useState<string>('')
  const [_newArbeidsgiverOrgnr, _setNewArbeidsgiverOrgnr] = useState<string>('')
  const [_newArbeidsgiverNavn, _setNewArbeidsgiverNavn] = useState<string>('')
  const [_seeNewArbeidsgiver, _setSeeNewArbeidsgiver] = useState<boolean>(false)
  const [_validationArbeidsgiver, _resetValidationArbeidsgiver, performValidationArbeidsgiver] =
    useValidation<ValidationArbeidsgiverProps>({}, validateArbeidsgiver)

  const [_addedArbeidsperioder, setAddedArbeidsperioder] = useState<Arbeidsperioder>(() => ({
    arbeidsperioder: [],
    uriArbeidsgiverRegister: '',
    uriInntektRegister: ''
  }))

  const setStartDato = (startdato: string) => {
    updateReplySed(`${target}.startdato`, startdato.trim())
    if (validation[namespace + '-startdato']) {
      resetValidation(namespace + '-startdato')
    }
  }

  const setSluttDato = (sluttdato: string) => {
    const newAnmodningsperiode: Periode = _.cloneDeep(anmodningsperiode)
    if (sluttdato === '') {
      delete newAnmodningsperiode.sluttdato
      newAnmodningsperiode.aapenPeriodeType = 'åpen_sluttdato'
    } else {
      delete newAnmodningsperiode.aapenPeriodeType
      newAnmodningsperiode.sluttdato = sluttdato.trim()
    }
    updateReplySed(target, newAnmodningsperiode)
    if (validation[namespace + '-sluttdato']) {
      resetValidation(namespace + '-sluttdato')
    }
  }

  const resetArbeidsgiverForm = () => {
    _setNewArbeidsgiverNavn('')
    _setNewArbeidsgiverOrgnr('')
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

  const onArbeidsgiverOrgnrChanged = (newOrg: string) => {
    _resetValidationArbeidsgiver(namespace + '-arbeidsgiver-orgnr')
    _setNewArbeidsgiverOrgnr(newOrg)
  }

  const onArbeidsgiverNameChanged = (newName: string) => {
    _resetValidationArbeidsgiver(namespace + '-arbeidsgiver-navn')
    _setNewArbeidsgiverNavn(newName)
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

  useEffect(() => {
    if (!inntekter && !gettingInntekter) {
      getInntekter()
    }
  }, [])

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
          key={'' + anmodningsperiode?.startdato + anmodningsperiode?.sluttdato}
          namespace={namespace}
          errorStartDato={validation[namespace + '-startdato']?.feilmelding}
          errorSluttDato={validation[namespace + '-sluttdato']?.feilmelding}
          setStartDato={setStartDato}
          setSluttDato={setSluttDato}
          valueStartDato={anmodningsperiode?.startdato ?? ''}
          valueSluttDato={anmodningsperiode?.sluttdato ?? ''}
        />
        <Column>
          <VerticalSeparatorDiv size='1.8' />
          <ArbeidsgiverSøk
            gettingArbeidsperioder={gettingArbeidsperioder}
            getArbeidsperioder={getArbeidsperioder}
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
        <AlignStartRow key={arbeidsgiver.arbeidsgiverOrgnr} className='slideInFromLeft'>
          <Column>
            <ArbeidsgiverBox
              arbeidsgiver={arbeidsgiver}
              editable={false}
              newArbeidsgiver={false}
              key={arbeidsgiver.arbeidsgiverOrgnr}
              onArbeidsgiverSelect={() => {}}
              namespace={namespace}
            />
          </Column>
        </AlignStartRow>
      ))}

      {_addedArbeidsperioder?.arbeidsperioder.map(arbeidsgiver => (
        <AlignStartRow key={arbeidsgiver.arbeidsgiverOrgnr} className='slideInFromLeft'>
          <Column>
            <ArbeidsgiverBox
              arbeidsgiver={arbeidsgiver}
              editable={false}
              newArbeidsgiver
              key={arbeidsgiver.arbeidsgiverOrgnr}
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
      <VerticalSeparatorDiv size='3' />
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <Undertittel>
            {t('label:kontoller-inntekt')}
          </Undertittel>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      {gettingInntekter && <WaitingPanel />}
      {inntekter && (
        <Inntekt
          highContrast={highContrast}
          inntekter={inntekter}
          personID={personID}
        />
      )}

    </PaddedDiv>
  )
}

export default Arbeidsforhold
