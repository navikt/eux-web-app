import Add from 'assets/icons/Add'
import Edit from 'assets/icons/Edit'
import Trashcan from 'assets/icons/Trashcan'
import { FlexCenterDiv, FlexDiv, PaddedFlexDiv, PileDiv } from 'components/StyledComponents'
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
  personID
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
    let validation: Validation = {}
    if (!_navn) {
      validation['arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-navn'] = {
        skjemaelementId: 'c-arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-navn-input',
        feilmelding: t('message:validation-noName'),
      } as FeiloppsummeringFeil
    }
    if (!_orgnr) {
      validation['arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-orgnr'] = {
        skjemaelementId: 'c-arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-orgnr-input',
        feilmelding: t('message:validation-noOrgnr'),
      } as FeiloppsummeringFeil
    }
    if (!_startDato) {
      validation['arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-startdato'] = {
        skjemaelementId: 'c-arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-startdato-input',
        feilmelding: t('message:validation-noDate'),
      } as FeiloppsummeringFeil
    }
    if (_startDato && !_startDato.match(/\d{2}\.\d{2}\.\d{4}/)) {
      validation['arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-startdato'] = {
        skjemaelementId: 'c-arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-startdato-input',
        feilmelding: t('message:validation-invalidDate'),
      } as FeiloppsummeringFeil
    }
    if (!_sluttDato) {
      validation['arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-sluttdato'] = {
        skjemaelementId: 'c-arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-sluttdato-input',
        feilmelding: t('message:validation-noDate'),
      } as FeiloppsummeringFeil
    }
    if (_sluttDato && !_sluttDato.match(/\d{2}\.\d{2}\.\d{4}/)) {
      validation['arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-sluttdato'] = {
        skjemaelementId: 'c-arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-sluttdato-input',
        feilmelding: t('message:validation-invalidDate')
      } as FeiloppsummeringFeil
    }
    setValidation(validation)
    return hasNoValidationErrors(validation)
  }

    const onNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetValidation('arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-navn')
    setNavn(e.target.value)
  }

  const onOrgnrChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetValidation('arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-orgnr')
    setOrgnr(e.target.value)
  }

  const onStartDatoChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetValidation('arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-startdato')
    setStartDato(e.target.value)
  }

  const onSluttDatoChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetValidation('arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-sluttdato')
    setSluttDato(e.target.value)
  }

  const onSaveButtonClicked = () => {
    const valid = performValidation()
    if (valid) {
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

  const onEditButtonClicked  = () => {
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
      style={{animationDelay : (index * 0.1) + 's'}}
    >
      <VerticalSeparatorDiv data-size='0.5' />
      <ArbeidsforholdPanel key={index} border>
        <FlexCenterDiv>
          <PaddedFlexDiv  className='slideInFromLeft'>
            <IkonArbeidsforhold />
            <HorizontalSeparatorDiv />
            <div>
              {_isEditing ? (
                <Row>
                  <Column>
                    <HighContrastInput
                      data-test-id={'c-arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-navn-input'}
                      feil={_validation['arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-navn']?.feilmelding}
                      id={'c-arbeidsforholdet-' + personID + '-arbeidsforholdet[' + index + ']-navn-input'}
                      label={t('label:name')}
                      onChange={onNameChanged}
                      placeholder={t('elements:placeholder-input-default')}
                      value={_navn}
                    />
                  </Column>
                  <Column>
                    <HighContrastInput
                      data-test-id={'c-arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-orgnr-input'}
                      feil={_validation['arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-orgnr']?.feilmelding}
                      id={'c-arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-orgnr-input'}
                      onChange={onOrgnrChanged}
                      value={_orgnr}
                      label={t('label:orgnr')}
                      placeholder={t('elements:placeholder-input-default')}
                    />
                  </Column>
                </Row>
              ) :
                (
                  <div>
                    <UndertekstBold>
                      {navn}
                    </UndertekstBold>
                    <Normaltekst>
                      {t('label:orgnr')}:&nbsp;{orgnr}
                    </Normaltekst>
                  </div>
                )
              }
              {_isEditing ?
                (
                  <>
                    <VerticalSeparatorDiv data-size='0.5' />
                    <Row>
                      <Column>
                        <HighContrastInput
                          data-test-id={'c-arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-startdato-input'}
                          feil={_validation['arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-startdato']?.feilmelding}
                          id={'c-arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-startdato-input'}
                          label={t('label:endDate')}
                          onChange={onStartDatoChanged}
                          placeholder={t('elements:placeholder-date-default')}
                          value={_startDato}
                        />
                      </Column>
                      <Column>
                        <HighContrastInput
                          data-test-id={'c-arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-sluttdato-input'}
                          feil={_validation['arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-sluttdato']?.feilmelding}
                          id={'c-arbeidsforhold-' + personID + '-arbeidsforholdet[' + index + ']-sluttdato-input'}
                          label={t('label:endDate')}
                          onChange={onSluttDatoChanged}
                          placeholder={t('elements:placeholder-date-default')}
                          value={_sluttDato}
                        />
                      </Column>
                    </Row>
                  </>
                  )
                : (
                  <div>
                    <Normaltekst>
                      {t('label:startDate')}:&nbsp;{formatterDatoTilNorsk(fom)}
                    </Normaltekst>
                    <Normaltekst>
                      {t('label:startDate')}:&nbsp;{formatterDatoTilNorsk(tom)}
                    </Normaltekst>
                  </div>
                )}
            </div>
          </PaddedFlexDiv>
          <PaddedFlexDiv className='slideInFromRight'  style={{animationDelay: '0.3s'}}>
            {editable && !_isEditing && !_isDeleting && (
              <>
                <HighContrastFlatknapp kompakt style={{
                  marginTop: '-0.5rem',
                  marginRight: '-0.5rem'
                }}
                 onClick={() => setIsDeleting(!_isDeleting)}
                >
                  <TrashcanIcon/>
                </HighContrastFlatknapp>
                <HorizontalSeparatorDiv data-size='0.5' />
                <HighContrastFlatknapp kompakt style={{
                  marginTop: '-0.5rem',
                  marginRight: '-0.5rem'
                }}
                 onClick={onEditButtonClicked}
                >
                  <EditIcon/>
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
                  {t('elements:button-add')}
                </HighContrastKnapp>
                <HorizontalSeparatorDiv data-size='0.5' />
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={onCancelButtonClicked}
                >
                  {t('elements:button-cancel')}
                </HighContrastFlatknapp>
              </div>
            )}
          </PaddedFlexDiv>
          {_isDeleting && (
            <PileDiv className='slideInFromRight'>
              <strong>
                {t('label:areYouSure')}
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
                  {t('elements:button-remove')}
                </HighContrastKnapp>
                <HorizontalSeparatorDiv data-size='0.5' />
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={() => setIsDeleting(!_isDeleting)}
                >
                  {t('elements:button-cancel')}
                </HighContrastFlatknapp>
                <HorizontalSeparatorDiv/>
              </FlexDiv>
            </PileDiv>
          )}
        </FlexCenterDiv>
        {hasError && (
          <div className='slideInFromBottom' style={{animationDelay: '0.2s'}}>
            <AlertStripeAdvarsel>
              <FlexDivNoWrap>
                {t('message:warning-conflict-aa-1')}
                <PaddedLink href='#'>{t('message:warning-conflict-aa-link-1')}</PaddedLink>
                {t('message:warning-conflict-aa-2')}
                <PaddedLink href='#'>{t('message:warning-conflict-aa-link-2')}</PaddedLink>
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
