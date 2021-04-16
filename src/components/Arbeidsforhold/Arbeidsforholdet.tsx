import Add from 'assets/icons/Add'
import Edit from 'assets/icons/Edit'
import Trashcan from 'assets/icons/Trashcan'
import { FlexCenterDiv, FlexDiv, PaddedFlexDiv, PileCenterDiv } from 'components/StyledComponents'
import { Arbeidsforholdet, Validation } from 'declarations/types.d'
import _ from 'lodash'
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper'
import { Checkbox, FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Normaltekst, UndertekstBold } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HighContrastKnapp,
  HighContrastLink,
  HighContrastPanel,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import IkonArbeidsforhold from 'resources/images/ikon-arbeidsforhold'
import styled from 'styled-components'
import { formatterDatoTilNorsk } from 'utils/dato'

const ArbeidsforholdPanel = styled(HighContrastPanel)`
  padding: 0rem !important;
  max-width: 800px;
`
const EditIcon = styled(Edit)`
  cursor: pointer;
`
const TrashcanIcon = styled(Trashcan)`
  width: 20px;
  cursor: pointer;
`
const FlexDivNoWrap = styled(FlexDiv)`
  flex-wrap: wrap;
`
const PaddedLink = styled(HighContrastLink)`
  padding: 0rem 0.35rem;
`

export interface ArbeidsforholdetProps {
  arbeidsforholdet: Arbeidsforholdet
  editable?: boolean
  index: number
  onArbeidsforholdSelect: (a: Arbeidsforholdet, checked: boolean) => void
  onArbeidsforholdEdit?: (a: Arbeidsforholdet, index: number) => void
  onArbeidsforholdDelete?: (index: number) => void
  personID: string
  personFnr?: string
  selected?: boolean
}

const ArbeidsforholdetFC: React.FC<ArbeidsforholdetProps> = ({
  arbeidsforholdet,
  editable,
  index,
  selected,
  onArbeidsforholdSelect,
  onArbeidsforholdDelete = () => {},
  onArbeidsforholdEdit = () => {},
  personID,
  personFnr
}: ArbeidsforholdetProps): JSX.Element => {
  const {
    arbeidsforholdIDnav,
    navn,
    orgnr,
    ansettelsesPeriode
  } = arbeidsforholdet
  const { fom, tom } = ansettelsesPeriode!
  const { t } = useTranslation()
  const hasError = true
  const namespace = 'arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']'

  const [_isDeleting, setIsDeleting] = useState<boolean>(false)
  const [_isEditing, setIsEditing] = useState<boolean>(false)
  const [_navn, setNavn] = useState<string>(navn || '')
  const [_orgnr, setOrgnr] = useState<string>(orgnr || '')
  const [_startDato, setStartDato] = useState<string>(fom || '')
  const [_sluttDato, setSluttDato] = useState<string>(tom || '')
  const [_validation, setValidation] = useState<Validation>({})

  const resetValidation = (key: string): void => {
    setValidation({
      ..._validation,
      [key]: undefined
    })
  }

  const hasNoValidationErrors = (validation: Validation): boolean => _.find(validation, (it) => (it !== undefined)) === undefined

  const performValidation = (): boolean => {
    const validation: Validation = {}
    if (!_navn) {
      validation[namespace + '-navn'] = {
        skjemaelementId: 'c-' + namespace + '-navn-text',
        feilmelding: t('message:validation-noName')
      } as FeiloppsummeringFeil
    }
    if (!_orgnr) {
      validation[namespace + '-orgnr'] = {
        skjemaelementId: 'c-' + namespace + '-orgnr-text',
        feilmelding: t('message:validation-noOrgnr')
      } as FeiloppsummeringFeil
    }
    if (!_startDato) {
      validation[namespace + '-startdato'] = {
        skjemaelementId: 'c-' + namespace + '-startdato-date',
        feilmelding: t('message:validation-noDate')
      } as FeiloppsummeringFeil
    }
    if (_startDato && !_startDato.match(/\d{2}\.\d{2}\.\d{4}/)) {
      validation[namespace + '-startdato'] = {
        skjemaelementId: 'c-' + namespace + '-startdato-date',
        feilmelding: t('message:validation-invalidDate')
      } as FeiloppsummeringFeil
    }
    if (!_sluttDato) {
      validation[namespace + '-sluttdato'] = {
        skjemaelementId: 'c-' + namespace + '-sluttdato-date',
        feilmelding: t('message:validation-noDate')
      } as FeiloppsummeringFeil
    }
    if (_sluttDato && !_sluttDato.match(/\d{2}\.\d{2}\.\d{4}/)) {
      validation[namespace + '-sluttdato'] = {
        skjemaelementId: 'c-' + namespace + '-sluttdato-date',
        feilmelding: t('message:validation-invalidDate')
      } as FeiloppsummeringFeil
    }
    setValidation(validation)
    return hasNoValidationErrors(validation)
  }

  const onNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetValidation(namespace + '-navn')
    setNavn(e.target.value)
  }

  const onOrgnrChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetValidation(namespace + '-orgnr')
    setOrgnr(e.target.value)
  }

  const onStartDatoChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetValidation(namespace + '-startdato')
    setStartDato(e.target.value)
  }

  const onSluttDatoChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetValidation(namespace + '-sluttdato')
    setSluttDato(e.target.value)
  }

  const onSaveButtonClicked = () => {
    if (performValidation()) {
      onArbeidsforholdEdit({
        navn: _navn,
        orgnr: _orgnr,
        ansettelsesPeriode: {
          fom: _startDato,
          tom: _sluttDato
        }
      } as Arbeidsforholdet,
      index)
      setIsEditing(false)
    }
  }

  const onEditButtonClicked = () => {
    setIsEditing(true)
    setOrgnr(orgnr || '')
    setNavn(navn || '')
    setStartDato(fom)
    setSluttDato(tom)
  }

  const onCancelButtonClicked = () => {
    setIsEditing(false)
    setOrgnr('')
    setNavn('')
    setStartDato('')
    setSluttDato('')
  }

  const onSelectCheckboxClicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    onArbeidsforholdSelect(arbeidsforholdet, e.target.checked)
  }

  if (!navn || !orgnr) {
    return <div />
  }
  return (
    <div
      className='slideInFromLeft'
      key={arbeidsforholdIDnav}
      style={{ animationDelay: (index * 0.1) + 's' }}
    >
      <VerticalSeparatorDiv data-size='0.5' />
      <ArbeidsforholdPanel key={index} border>
        <FlexCenterDiv>
          <PaddedFlexDiv className='slideInFromLeft'>
            <IkonArbeidsforhold />
            <HorizontalSeparatorDiv />
            <div>
              {_isEditing
                ? (
                  <Row>
                    <Column>
                      <HighContrastInput
                        data-test-id={'c-' + namespace + '-navn-text'}
                        feil={_validation[namespace + '-navn']?.feilmelding}
                        id={'c-' + namespace + '-navn-text'}
                        label={t('label:name')}
                        onChange={onNameChanged}
                        placeholder={t('el:placeholder-input-default')}
                        value={_navn}
                      />
                    </Column>
                    <Column>
                      <HighContrastInput
                        data-test-id={'c-' + namespace + '-orgnr-text'}
                        feil={_validation[namespace + '-orgnr']?.feilmelding}
                        id={'c-' + namespace + '-orgnr-text'}
                        onChange={onOrgnrChanged}
                        value={_orgnr}
                        label={t('label:orgnr')}
                        placeholder={t('el:placeholder-input-default')}
                      />
                    </Column>
                  </Row>
                  )
                : (
                  <div>
                    <UndertekstBold>
                      {navn}
                    </UndertekstBold>
                    <Normaltekst>
                      {t('label:orgnr')}:&nbsp;{orgnr}
                    </Normaltekst>
                  </div>
                  )}
              {_isEditing
                ? (
                  <>
                    <VerticalSeparatorDiv data-size='0.5' />
                    <Row>
                      <Column>
                        <HighContrastInput
                          data-test-id={'c-' + namespace + '-startdato-date'}
                          feil={_validation[namespace + '-startdato']?.feilmelding}
                          id={'c-' + namespace + '-startdato-date'}
                          label={t('label:end-date')}
                          onChange={onStartDatoChanged}
                          placeholder={t('el:placeholder-date-default')}
                          value={_startDato}
                        />
                      </Column>
                      <Column>
                        <HighContrastInput
                          data-test-id={'c-' + namespace + '-sluttdato-date'}
                          feil={_validation[namespace + '-sluttdato']?.feilmelding}
                          id={'c-' + namespace + '-sluttdato-date'}
                          label={t('label:end-date')}
                          onChange={onSluttDatoChanged}
                          placeholder={t('el:placeholder-date-default')}
                          value={_sluttDato}
                        />
                      </Column>
                    </Row>
                  </>
                  )
                : (
                  <div>
                    <Normaltekst>
                      {t('label:start-date')}:&nbsp;{formatterDatoTilNorsk(fom)}
                    </Normaltekst>
                    <Normaltekst>
                      {t('label:start-date')}:&nbsp;{formatterDatoTilNorsk(tom)}
                    </Normaltekst>
                  </div>
                  )}
            </div>
          </PaddedFlexDiv>
          <PaddedFlexDiv className='slideInFromRight' style={{ animationDelay: '0.3s' }}>
            {editable && !_isEditing && !_isDeleting && (
              <>
                <HighContrastFlatknapp
                  kompakt style={{
                    marginTop: '-0.5rem',
                    marginRight: '-0.5rem'
                  }}
                  onClick={() => setIsDeleting(!_isDeleting)}
                >
                  <TrashcanIcon />
                </HighContrastFlatknapp>
                <HorizontalSeparatorDiv data-size='0.5' />
                <HighContrastFlatknapp
                  kompakt style={{
                    marginTop: '-0.5rem',
                    marginRight: '-0.5rem'
                  }}
                  onClick={onEditButtonClicked}
                >
                  <EditIcon />
                </HighContrastFlatknapp>
                <HorizontalSeparatorDiv />
              </>
            )}
            {!_isEditing && !_isDeleting && (
              <Checkbox
                checked={selected}
                onChange={onSelectCheckboxClicked}
                label={t('label:choose')}
              />
            )}
            {_isEditing && (
              <div>
                <VerticalSeparatorDiv />
                <HighContrastKnapp
                  mini
                  kompakt
                  onClick={onSaveButtonClicked}
                >
                  <Add />
                  <HorizontalSeparatorDiv data-size='0.5' />
                  {t('el:button-add')}
                </HighContrastKnapp>
                <HorizontalSeparatorDiv data-size='0.5' />
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={onCancelButtonClicked}
                >
                  {t('el:button-cancel')}
                </HighContrastFlatknapp>
              </div>
            )}
          </PaddedFlexDiv>
          {_isDeleting && (
            <PileCenterDiv className='slideInFromRight'>
              <strong>
                {t('label:are-you-sure')}
              </strong>
              <VerticalSeparatorDiv />
              <FlexDiv>
                <HighContrastKnapp
                  mini
                  kompakt
                  onClick={() =>
                    onArbeidsforholdDelete(index)}
                >
                  <Trashcan />
                  <HorizontalSeparatorDiv data-size='0.5' />
                  {t('el:button-remove')}
                </HighContrastKnapp>
                <HorizontalSeparatorDiv data-size='0.5' />
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={() => setIsDeleting(!_isDeleting)}
                >
                  {t('el:button-cancel')}
                </HighContrastFlatknapp>
                <HorizontalSeparatorDiv />
              </FlexDiv>
            </PileCenterDiv>
          )}
        </FlexCenterDiv>
        {hasError && (
          <div className='slideInFromBottom' style={{ animationDelay: '0.2s' }}>
            <AlertStripeAdvarsel>
              <FlexDivNoWrap>
                {t('message:warning-conflict-aa-1')}
                <PaddedLink
                  href={`https://modapp.adeo.no/aareg-web/?1&rolle=arbeidstaker&ident=${personFnr}#!arbeidsforhold`}
                >
                  {t('message:warning-conflict-aa-link-1')}
                </PaddedLink>
                {t('message:warning-conflict-aa-2')}
                <PaddedLink
                  href={`https://modapp.adeo.no/a-inntekt/person/${personFnr}?2#!PersonInntektLamell`}
                  >
                  {t('message:warning-conflict-aa-link-2')}
                </PaddedLink>
              </FlexDivNoWrap>
            </AlertStripeAdvarsel>
          </div>
        )}
      </ArbeidsforholdPanel>
      <VerticalSeparatorDiv data-size='0.5' />
    </div>
  )
}

export default ArbeidsforholdetFC
