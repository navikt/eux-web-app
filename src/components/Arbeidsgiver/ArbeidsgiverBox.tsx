import { Add, Close, Edit, Office1 } from '@navikt/ds-icons'
import AdresseFC from 'applications/SvarSed/PersonManager/Adresser/Adresse'
import IdentifikatorFC from 'applications/SvarSed/PersonManager/Identifikator/Identifikator'
import Trashcan from 'assets/icons/Trashcan'
import classNames from 'classnames'
import AdresseBox from 'components/AdresseBox/AdresseBox'
import Input from 'components/Forms/Input'
import PeriodeInput, { toUIDateFormat } from 'components/Forms/PeriodeInput'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import { Adresse as IAdresse, ArbeidsgiverIdentifikator, Periode, PeriodeMedForsikring } from 'declarations/sed.d'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { Checkbox } from 'nav-frontend-skjema'
import { Normaltekst, Undertekst, UndertekstBold } from 'nav-frontend-typografi'
import {
  Column,
  FlexCenterSpacedDiv,
  FlexDiv,
  HighContrastFlatknapp,
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
import { generateIdentifikatorKey } from 'utils/arbeidsgiver'
import { validateArbeidsgiver, ValidationArbeidsgiverProps } from './validation'

const ArbeidsgiverPanel = styled(HighContrastPanel)`
  padding: 0rem !important;
  max-width: 800px;
  &.new {
    background-color: #FFFFCC;
  }
  &.new {
    background-color: light-gray;
  }
`
const EditIcon = styled(Edit)`
  cursor: pointer;
`
const TrashcanIcon = styled(Trashcan)`
  width: 20px;
  cursor: pointer;
`
export type Editable = 'no' | 'only_period' | 'full'

export interface ArbeidsgiverProps {
  arbeidsgiver: PeriodeMedForsikring
  editable?: Editable
  error?: boolean,
  highContrast: boolean
  includeAddress ?: boolean
  newArbeidsgiver?: boolean
  orphanArbeidsgiver ?: boolean
  onArbeidsgiverSelect?: (a: PeriodeMedForsikring, checked: boolean) => void
  onArbeidsgiverEdit?: (a: PeriodeMedForsikring, old: PeriodeMedForsikring, checked: boolean) => void
  onArbeidsgiverDelete?: (a: PeriodeMedForsikring, checked: boolean) => void
  namespace: string
  personFnr?: string
  selected?: boolean
  selectable?: boolean
}

const ArbeidsgiverBox = ({
  arbeidsgiver,
  editable = 'no',
  error = false,
  includeAddress = false,
  highContrast,
  newArbeidsgiver = false,
  orphanArbeidsgiver = false,
  selected = false,
  selectable = true,
  onArbeidsgiverSelect,
  onArbeidsgiverDelete,
  onArbeidsgiverEdit,
  namespace
//  personFnr
}: ArbeidsgiverProps): JSX.Element => {
  const { t } = useTranslation()
  const _namespace = namespace + '-arbeidsgiver[' + (generateIdentifikatorKey(arbeidsgiver.arbeidsgiver.identifikator) ?? '-') + ']'

  const [_isDeleting, setIsDeleting] = useState<boolean>(false)
  const [_isEditing, setIsEditing] = useState<boolean>(false)
  const [_beforeEditingVersion, setBeforeEditingVersion] = useState<PeriodeMedForsikring | undefined>(undefined)

  const [_arbeidsgiversNavn, setArbeidsgiversNavn] = useState<string>(arbeidsgiver.arbeidsgiver.navn ?? '')
  const [_arbeidsgiversIdentifikator, setArbeidsgiversIdentifikator] = useState<Array<ArbeidsgiverIdentifikator>>(arbeidsgiver.arbeidsgiver.identifikator ?? [])
  const [_arbeidsgiverPeriode, setArbeidsgiversPeriode] = useState<Periode>({
    startdato: arbeidsgiver.startdato,
    sluttdato: arbeidsgiver.sluttdato,
    aapenPeriodeType: arbeidsgiver.aapenPeriodeType
  })

  // for includeAddress
  const [_adresse, _setAdresse] = useState<IAdresse | undefined>(arbeidsgiver.arbeidsgiver.adresse ?? undefined)
  const [_validation, resetValidation, performValidation] = useValidation<ValidationArbeidsgiverProps>({}, validateArbeidsgiver)

  const onNameChanged = (newName: string) => {
    resetValidation(_namespace + '-navn')
    setArbeidsgiversNavn(newName)
  }

  const onIdentifikatorerChanged = (newIdentifikatorer: Array<ArbeidsgiverIdentifikator>, whatChanged: string) => {
    resetValidation(_namespace + '-' + whatChanged)
    setArbeidsgiversIdentifikator(newIdentifikatorer)
  }

  const resetSubValidation = (fullnamespace: string) => resetValidation(fullnamespace)

  const onPeriodeChanged = (newPeriode: Periode) => {
    if (_arbeidsgiverPeriode.startdato !== newPeriode.startdato) {
      resetValidation(_namespace + '-startdato')
    }
    if (_arbeidsgiverPeriode.sluttdato !== newPeriode.sluttdato) {
      resetValidation(_namespace + '-sluttdato')
    }
    setArbeidsgiversPeriode(newPeriode)
  }

  const onSaveEditButtonClicked = () => {
    const newArbeidsgiver: PeriodeMedForsikring = {
      ..._arbeidsgiverPeriode,
      arbeidsgiver: {
        identifikator: _arbeidsgiversIdentifikator,
        navn: _arbeidsgiversNavn
      }
    } as PeriodeMedForsikring

    if (includeAddress) {
      newArbeidsgiver.arbeidsgiver.adresse = _adresse
    }

    const valid: boolean = performValidation({
      arbeidsgiver: newArbeidsgiver,
      includeAddress: includeAddress,
      namespace: _namespace
    })
    if (valid) {
      if (_.isFunction(onArbeidsgiverEdit)) {
        onArbeidsgiverEdit(newArbeidsgiver, _beforeEditingVersion!, selected)
      }
      setIsEditing(false)
      setBeforeEditingVersion(undefined)
    }
  }

  const onEditButtonClicked = () => {
    setIsEditing(true)
    setBeforeEditingVersion(_.cloneDeep(arbeidsgiver))
    setArbeidsgiversIdentifikator(_arbeidsgiversIdentifikator)
    setArbeidsgiversNavn(_arbeidsgiversNavn || '')
    setArbeidsgiversPeriode(_arbeidsgiverPeriode)
    if (includeAddress) {
      _setAdresse(_adresse)
    }
  }

  const onCancelButtonClicked = () => {
    setIsEditing(false)
    setArbeidsgiversIdentifikator(_beforeEditingVersion?.arbeidsgiver.identifikator ?? [])
    setArbeidsgiversNavn(_beforeEditingVersion?.arbeidsgiver.navn || '')
    setArbeidsgiversPeriode({
      startdato: _beforeEditingVersion?.startdato!,
      sluttdato: _beforeEditingVersion?.sluttdato,
      aapenPeriodeType: _beforeEditingVersion?.aapenPeriodeType
    })
    setBeforeEditingVersion(undefined)
  }

  const onSelectCheckboxClicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (_.isFunction(onArbeidsgiverSelect)) {
      onArbeidsgiverSelect(arbeidsgiver, e.target.checked)
    }
  }

  if (!_arbeidsgiversNavn || _.isEmpty(_arbeidsgiversIdentifikator)) {
    return <div />
  }
  return (
    <div
      className='slideInFromLeft'
      key={generateIdentifikatorKey(_arbeidsgiversIdentifikator)}
    >
      <VerticalSeparatorDiv size='0.5' />
      <ArbeidsgiverPanel
        border
        className={classNames({ new: newArbeidsgiver, orphan: orphanArbeidsgiver })}
      >
        <FlexCenterSpacedDiv>
          <PaddedFlexDiv className='slideInFromLeft'>
            <Office1 width='30' height='30' />
            <HorizontalSeparatorDiv />
            <div>
              {_isEditing && editable === 'full'
                ? (
                  <>
                    <Row>
                      <Column>
                        <Input
                          namespace={_namespace}
                          feil={_validation[_namespace + '-navn']?.feilmelding}
                          id='navn'
                          label={t('label:navn')}
                          onChanged={onNameChanged}
                          value={_arbeidsgiversNavn}
                        />
                      </Column>
                    </Row>
                    <IdentifikatorFC
                      highContrast={highContrast}
                      identifikatorer={_arbeidsgiversIdentifikator}
                      onIdentifikatorerChanged={onIdentifikatorerChanged}
                      namespace={_namespace + '-identifikator'}
                      validation={_validation}
                      resetValidation={resetSubValidation}
                      personName={_arbeidsgiversNavn}
                    />
                  </>
                  )
                : (
                  <div>
                    <UndertekstBold>
                      {_arbeidsgiversNavn}
                    </UndertekstBold>
                    <HorizontalLineSeparator />
                    <VerticalSeparatorDiv size='0.5' />
                    {_.isEmpty(_arbeidsgiversIdentifikator)
                      ? (<Normaltekst>{t('message:warning-no-ids')}</Normaltekst>)
                      : null}
                    {_arbeidsgiversIdentifikator.map(id => (
                      <Normaltekst key={id.type}>
                        {t('el:option-identifikator-' + id.type) + ': ' + id.id}
                      </Normaltekst>
                    ))}
                  </div>
                  )}
              {_isEditing
                ? (
                  <>
                    <VerticalSeparatorDiv size='0.5' />
                    <Row>
                      <PeriodeInput
                        key={'' + _arbeidsgiverPeriode.startdato + _arbeidsgiverPeriode.sluttdato}
                        namespace={_namespace}
                        error={{
                          startdato: _validation[_namespace + '-startdato']?.feilmelding,
                          sluttdato: _validation[_namespace + '-sluttdato']?.feilmelding
                        }}
                        setPeriode={onPeriodeChanged}
                        value={_arbeidsgiverPeriode}
                      />
                    </Row>
                  </>
                  )
                : (
                  <div>
                    <Normaltekst>
                      {toUIDateFormat(_arbeidsgiverPeriode.startdato)} - {_arbeidsgiverPeriode.sluttdato ? toUIDateFormat(_arbeidsgiverPeriode.sluttdato) : _arbeidsgiverPeriode.aapenPeriodeType}
                    </Normaltekst>
                  </div>
                  )}
              {arbeidsgiver?.extra?.fraArbeidsgiverregisteret === 'ja' && (
                <PileDiv style={{ flexDirection: 'column-reverse' }}>
                  <Undertekst>{t('label:fra-arbeidsgiverregisteret')}</Undertekst>
                </PileDiv>
              )}
              {arbeidsgiver?.extra?.fraInntektsregisteret === 'ja' && (
                <PileDiv style={{ flexDirection: 'column-reverse' }}>
                  <Undertekst>{t('label:fra-inntektsregisteret')}</Undertekst>
                </PileDiv>
              )}
            </div>
            {includeAddress && (
              <>
                <HorizontalSeparatorDiv />
                <div>
                  {_isEditing && editable === 'full'
                    ? (
                      <>
                        <VerticalSeparatorDiv size='0.5' />
                        <AdresseFC
                          adresse={_adresse}
                          onAdressChanged={_setAdresse}
                          namespace={_namespace}
                          validation={_validation}
                          resetValidation={resetValidation}
                        />
                      </>
                      )
                    : _.isEmpty(_adresse)
                      ? (
                        <Normaltekst>
                          {t('message:warning-no-address')}
                        </Normaltekst>
                        )
                      : (
                        <div>
                          <Normaltekst>
                            {!_.isEmpty(_adresse) && (
                              <>{t('label:adresse')}: </>
                            )}
                          </Normaltekst>
                          <AdresseBox adresse={_adresse} />
                        </div>
                        )}
                </div>
              </>
            )}
            <>
              <HorizontalSeparatorDiv />
              {error && (
                <Normaltekst>
                  duplicate warning
                </Normaltekst>
              )}

            </>
          </PaddedFlexDiv>
          <PaddedFlexDiv className='slideInFromRight' style={{ animationDelay: '0.3s' }}>
            {editable === 'full' && !_isEditing && !_isDeleting && (
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
              </>
            )}
            {editable !== 'no' && !_isEditing && !_isDeleting && (
              <>
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
            {!_isEditing && !_isDeleting && selectable && (
              <Checkbox
                checked={selected}
                onChange={onSelectCheckboxClicked}
                label={t('label:velg')}
              />
            )}
            {_isEditing && (
              <PileDiv>
                <HighContrastKnapp
                  mini
                  kompakt
                  onClick={onSaveEditButtonClicked}
                >
                  <Add />
                  <HorizontalSeparatorDiv size='0.5' />
                  {t('el:button-save')}
                </HighContrastKnapp>
                <VerticalSeparatorDiv size='0.5' />
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={onCancelButtonClicked}
                >
                  <Close />
                  <HorizontalSeparatorDiv size='0.5' />
                  {t('el:button-cancel')}
                </HighContrastFlatknapp>

              </PileDiv>
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
                  onClick={() => {
                    if (_.isFunction(onArbeidsgiverDelete)) {
                      onArbeidsgiverDelete(arbeidsgiver, selected)
                    }
                  }}
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
