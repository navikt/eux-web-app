import Add from 'assets/icons/Add'
import IkonArbeidsgiver from 'assets/icons/Arbeidsgiver'
import Edit from 'assets/icons/Edit'
import Trashcan from 'assets/icons/Trashcan'
import classNames from 'classnames'
import { Arbeidsgiver, Validation } from 'declarations/types.d'
import _ from 'lodash'
import { Checkbox, FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Normaltekst, Undertekst, UndertekstBold } from 'nav-frontend-typografi'
import {
  Column,
  FlexCenterSpacedDiv,
  FlexDiv,
  HighContrastFlatknapp,
  HighContrastInput,
  HighContrastKnapp,
  HighContrastPanel,
  HorizontalSeparatorDiv,
  PaddedFlexDiv,
  PileCenterDiv,
  PileDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { formatterDatoTilNorsk } from 'utils/dato'

const ArbeidsgiverPanel = styled(HighContrastPanel)`
  padding: 0rem !important;
  max-width: 800px;
  &.new {
    background-color: #FFFFCC;
  }
`
const EditIcon = styled(Edit)`
  cursor: pointer;
`
const TrashcanIcon = styled(Trashcan)`
  width: 20px;
  cursor: pointer;
`
/* const FlexDivNoWrap = styled(FlexDiv)`
  flex-wrap: wrap;
`
const PaddedLink = styled(HighContrastLink)`
  padding: 0rem 0.35rem;
` */

export interface ArbeidsgiverProps {
  arbeidsgiver: Arbeidsgiver
  editable?: boolean
  error?: boolean,
  newArbeidsgiver?: boolean
  onArbeidsgiverSelect: (a: Arbeidsgiver, checked: boolean) => void
  onArbeidsgiverEdit?: (a: Arbeidsgiver) => void
  onArbeidsgiverDelete?: (a: Arbeidsgiver) => void
  namespace: string
  personFnr?: string
  selected?: boolean
}

const ArbeidsgiverBox: React.FC<ArbeidsgiverProps> = ({
  arbeidsgiver,
  editable,
  error = false,
  newArbeidsgiver = false,
  selected,
  onArbeidsgiverSelect,
  onArbeidsgiverDelete = () => {},
  onArbeidsgiverEdit = () => {},
  namespace
//  personFnr
}: ArbeidsgiverProps): JSX.Element => {
  const {
    fraInntektsregistreret,
    fraArbeidsgiverregisteret,
    arbeidsgiverNavn,
    arbeidsgiverOrgnr,
    fraDato,
    tilDato
  } = arbeidsgiver
  const { t } = useTranslation()
  const _namespace = namespace + '-arbeidsgiver[' + arbeidsgiverOrgnr + ']'

  const [_isDeleting, setIsDeleting] = useState<boolean>(false)
  const [_isEditing, setIsEditing] = useState<boolean>(false)
  const [_arbeidsgiverNavn, setArbeidsgiverNavn] = useState<string>(arbeidsgiverNavn || '')
  const [_arbeidsgiverOrgnr, setArbeidsgiverOrgnr] = useState<string>(arbeidsgiverOrgnr || '')
  const [_startDato, setStartDato] = useState<string>(fraDato || '')
  const [_sluttDato, setSluttDato] = useState<string>(tilDato || '')
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
    if (!_arbeidsgiverNavn) {
      validation[_namespace + '-navn'] = {
        skjemaelementId: _namespace + '-navn',
        feilmelding: t('message:validation-noName')
      } as FeiloppsummeringFeil
    }
    if (!_arbeidsgiverOrgnr) {
      validation[_namespace + '-orgnr'] = {
        skjemaelementId: _namespace + '-orgnr',
        feilmelding: t('message:validation-noOrgnr')
      } as FeiloppsummeringFeil
    }
    if (!_startDato) {
      validation[_namespace + '-startdato'] = {
        skjemaelementId: _namespace + '-startdato',
        feilmelding: t('message:validation-noDate')
      } as FeiloppsummeringFeil
    }
    if (_startDato && !_startDato.match(/\d{2}\.\d{2}\.\d{4}/)) {
      validation[_namespace + '-startdato'] = {
        skjemaelementId: _namespace + '-startdato',
        feilmelding: t('message:validation-invalidDate')
      } as FeiloppsummeringFeil
    }
    if (!_sluttDato) {
      validation[_namespace + '-sluttdato'] = {
        skjemaelementId: _namespace + '-sluttdato',
        feilmelding: t('message:validation-noDate')
      } as FeiloppsummeringFeil
    }
    if (_sluttDato && !_sluttDato.match(/\d{2}\.\d{2}\.\d{4}/)) {
      validation[_namespace + '-sluttdato'] = {
        skjemaelementId: _namespace + '-sluttdato',
        feilmelding: t('message:validation-invalidDate')
      } as FeiloppsummeringFeil
    }
    setValidation(validation)
    return hasNoValidationErrors(validation)
  }

  const onNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetValidation(_namespace + '-navn')
    setArbeidsgiverNavn(e.target.value)
  }

  const onOrgnrChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetValidation(_namespace + '-orgnr')
    setArbeidsgiverOrgnr(e.target.value)
  }

  const onStartDatoChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetValidation(_namespace + '-startdato')
    setStartDato(e.target.value)
  }

  const onSluttDatoChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetValidation(_namespace + '-sluttdato')
    setSluttDato(e.target.value)
  }

  const onSaveButtonClicked = () => {
    if (performValidation()) {
      onArbeidsgiverEdit({
        arbeidsgiverNavn: _arbeidsgiverNavn,
        arbeidsgiverOrgnr: _arbeidsgiverOrgnr,
        fraDato: _startDato,
        tilDato: _sluttDato
      } as Arbeidsgiver)
      setIsEditing(false)
    }
  }

  const onEditButtonClicked = () => {
    setIsEditing(true)
    setArbeidsgiverOrgnr(_arbeidsgiverOrgnr || '')
    setArbeidsgiverNavn(_arbeidsgiverNavn || '')
    setStartDato(_startDato)
    setSluttDato(_sluttDato)
  }

  const onCancelButtonClicked = () => {
    setIsEditing(false)
    setArbeidsgiverOrgnr('')
    setArbeidsgiverNavn('')
    setStartDato('')
    setSluttDato('')
  }

  const onSelectCheckboxClicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    onArbeidsgiverSelect(arbeidsgiver, e.target.checked)
  }

  if (!_arbeidsgiverNavn || !_arbeidsgiverOrgnr) {
    return <div />
  }
  return (
    <div
      className='slideInFromLeft'
      key={_arbeidsgiverOrgnr}
    >
      <VerticalSeparatorDiv size='0.5' />
      <ArbeidsgiverPanel border className={classNames('', { new: newArbeidsgiver })}>
        <FlexCenterSpacedDiv>
          <PaddedFlexDiv className='slideInFromLeft'>
            <IkonArbeidsgiver />
            <HorizontalSeparatorDiv />
            <div>
              {_isEditing
                ? (
                  <Row>
                    <Column>
                      <HighContrastInput
                        data-test-id={_namespace + '-navn'}
                        feil={_validation[_namespace + '-navn']?.feilmelding}
                        id={_namespace + '-navn'}
                        label={t('label:navn')}
                        onChange={onNameChanged}
                        placeholder={t('el:placeholder-input-default')}
                        value={_arbeidsgiverNavn}
                      />
                    </Column>
                    <Column>
                      <HighContrastInput
                        data-test-id={_namespace + '-orgnr'}
                        feil={_validation[_namespace + '-orgnr']?.feilmelding}
                        id={_namespace + '-orgnr'}
                        onChange={onOrgnrChanged}
                        value={_arbeidsgiverOrgnr}
                        label={t('label:orgnr')}
                        placeholder={t('el:placeholder-input-default')}
                      />
                    </Column>
                  </Row>
                  )
                : (
                  <div>
                    <UndertekstBold>
                      {_arbeidsgiverNavn}
                    </UndertekstBold>
                    <Normaltekst>
                      {t('label:orgnr')}:&nbsp;{_arbeidsgiverOrgnr}
                    </Normaltekst>
                  </div>
                  )}
              {_isEditing
                ? (
                  <>
                    <VerticalSeparatorDiv size='0.5' />
                    <Row>
                      <Column>
                        <HighContrastInput
                          data-test-id={_namespace + '-startdato'}
                          feil={_validation[_namespace + '-startdato']?.feilmelding}
                          id={_namespace + '-startdato'}
                          label={t('label:startdato')}
                          onChange={onStartDatoChanged}
                          placeholder={t('el:placeholder-date-default')}
                          value={_startDato}
                        />
                      </Column>
                      <Column>
                        <HighContrastInput
                          data-test-id={_namespace + '-sluttdato'}
                          feil={_validation[_namespace + '-sluttdato']?.feilmelding}
                          id={_namespace + '-sluttdato'}
                          label={t('label:sluttdato')}
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
                      {t('label:startdato')}:&nbsp;{formatterDatoTilNorsk(_startDato)}
                    </Normaltekst>
                    <Normaltekst>
                      {t('label:sluttdato')}:&nbsp;{formatterDatoTilNorsk(_sluttDato)}
                    </Normaltekst>
                  </div>
                  )}
            </div>

            {error && (
              <Normaltekst>
                duplicate warning
              </Normaltekst>
            )}
            {fraArbeidsgiverregisteret && (
              <>
                <HorizontalSeparatorDiv />
                <PileDiv style={{ flexDirection: 'column-reverse' }}>
                  <Undertekst>{t('label:fra-arbeidsgiverregisteret')}</Undertekst>
                </PileDiv>
              </>
            )}
            {fraInntektsregistreret && (
              <>
                <HorizontalSeparatorDiv />
                <PileDiv style={{ flexDirection: 'column-reverse' }}>
                  <Undertekst>{t('label:fra-inntektsregisteret')}</Undertekst>
                </PileDiv>
              </>
            )}
            {/*! harRegistrertInntekt && (
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
        ) */}

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
                <HorizontalSeparatorDiv size='0.5' />
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
                label={t('label:velg')}
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
                  <HorizontalSeparatorDiv size='0.5' />
                  {t('el:button-add')}
                </HighContrastKnapp>
                <HorizontalSeparatorDiv size='0.5' />
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
                {t('label:er-du-sikker')}
              </strong>
              <VerticalSeparatorDiv />
              <FlexDiv>
                <HighContrastKnapp
                  mini
                  kompakt
                  onClick={() =>
                    onArbeidsgiverDelete(arbeidsgiver)}
                >
                  <Trashcan />
                  <HorizontalSeparatorDiv size='0.5' />
                  {t('el:button-remove')}
                </HighContrastKnapp>
                <HorizontalSeparatorDiv size='0.5' />
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
        </FlexCenterSpacedDiv>
      </ArbeidsgiverPanel>
      <VerticalSeparatorDiv size='0.5' />
    </div>
  )
}

export default ArbeidsgiverBox
