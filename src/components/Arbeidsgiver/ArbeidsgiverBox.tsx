import Add from 'assets/icons/Add'
import IkonArbeidsgiver from 'assets/icons/Arbeidsgiver'
import Edit from 'assets/icons/Edit'
import Trashcan from 'assets/icons/Trashcan'
import classNames from 'classnames'
import Input from 'components/Forms/Input'
import Period, { toUIDateFormat } from 'components/Period/Period'
import { Periode, PeriodeMedForsikring } from 'declarations/sed.d'
import useValidation from 'hooks/useValidation'
import CountryData, { Country } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Checkbox } from 'nav-frontend-skjema'
import { Normaltekst, Undertekst, UndertekstBold } from 'nav-frontend-typografi'
import {
  AlignStartRow,
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
import { getOrgnr } from 'utils/arbeidsgiver'
import { validateArbeidsgiver, ValidationArbeidsgiverProps } from './validation'

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
export type Editable = 'no' | 'only_period' | 'full'

export interface ArbeidsgiverProps {
  arbeidsgiver: PeriodeMedForsikring
  editable?: Editable
  error?: boolean,
  includeAddress ?: boolean
  newArbeidsgiver?: boolean
  typeTrygdeforhold ?: string
  onArbeidsgiverSelect: (a: PeriodeMedForsikring, checked: boolean) => void
  onArbeidsgiverEdit?: (a: PeriodeMedForsikring, checked: boolean) => void
  onArbeidsgiverDelete?: (a: PeriodeMedForsikring, checked: boolean) => void
  namespace: string
  personFnr?: string
  selected?: boolean
}

const ArbeidsgiverBox = ({
  arbeidsgiver,
  editable = 'no',
  error = false,
  includeAddress = false,
  newArbeidsgiver = false,
  typeTrygdeforhold,
  selected = false,
  onArbeidsgiverSelect,
  onArbeidsgiverDelete,
  onArbeidsgiverEdit,
  namespace
//  personFnr
}: ArbeidsgiverProps): JSX.Element => {
  const { t } = useTranslation()
  const _namespace = namespace + '-arbeidsgiver[' + getOrgnr(arbeidsgiver) ?? '-' + ']'
  const countryData = CountryData.getCountryInstance('nb')

  const [_isDeleting, setIsDeleting] = useState<boolean>(false)
  const [_isEditing, setIsEditing] = useState<boolean>(false)

  const [_arbeidsgiversNavn, setArbeidsgiversNavn] = useState<string>(arbeidsgiver.arbeidsgiver.navn ?? '')
  const [_arbeidsgiversOrgnr, setArbeidsgiversOrgnr] = useState<string>(getOrgnr(arbeidsgiver) ?? '')
  const [_startDato, setStartDato] = useState<string>(arbeidsgiver.periode.startdato ?? '')
  const [_sluttDato, setSluttDato] = useState<string>(arbeidsgiver.periode.sluttdato ?? '')

  // for includeAddress
  const [_gate, setGate] = useState<string>(arbeidsgiver.arbeidsgiver?.adresse?.gate ?? '')
  const [_postnummer, setPostnummer] = useState<string>(arbeidsgiver.arbeidsgiver?.adresse?.postnummer ?? '')
  const [_by, setBy] = useState<string>(arbeidsgiver.arbeidsgiver?.adresse?.by ?? '')
  const [_bygning, setBygning] = useState<string>(arbeidsgiver.arbeidsgiver?.adresse?.bygning ?? '')
  const [_region, setRegion] = useState<string>(arbeidsgiver.arbeidsgiver?.adresse?.region ?? '')
  const [_land, setLand] = useState<string>(arbeidsgiver.arbeidsgiver?.adresse?.land ?? '')

  const [_validation, resetValidation, performValidation] = useValidation<ValidationArbeidsgiverProps>({}, validateArbeidsgiver)

  const onNameChanged = (newName: string) => {
    resetValidation(_namespace + '-navn')
    setArbeidsgiversNavn(newName)
  }

  const onOrgnrChanged = (newOrgnr: string) => {
    resetValidation(_namespace + '-orgnr')
    setArbeidsgiversOrgnr(newOrgnr)
  }

  const onStartDatoChanged = (newDato: string) => {
    resetValidation(_namespace + '-startdato')
    setStartDato(newDato)
  }

  const onSluttDatoChanged = (newDato: string) => {
    resetValidation(_namespace + '-sluttdato')
    setSluttDato(newDato)
  }

  const onGateChanged = (newGate: string) => {
    resetValidation(_namespace + '-gate')
    setGate(newGate)
  }

  const onPostnummerChanged = (newPostnummer: string) => {
    resetValidation(_namespace + '-postnummer')
    setPostnummer(newPostnummer)
  }

  const onByChanged = (newBy: string) => {
    resetValidation(_namespace + '-by')
    setBy(newBy)
  }

  const onBygningChanged = (newBygning: string) => {
    resetValidation(_namespace + '-bygning')
    setBygning(newBygning)
  }

  const onRegionChanged = (newRegion: string) => {
    resetValidation(_namespace + '-region')
    setRegion(newRegion)
  }

  const onLandChanged = (newLand: string) => {
    resetValidation(_namespace + '-land')
    setLand(newLand)
  }

  const onSaveEditButtonClicked = () => {
    const newPeriode: Periode = {
      startdato: _startDato
    }
    if (_sluttDato === '') {
      newPeriode.aapenPeriodeType = 'åpen_sluttdato'
    } else {
      newPeriode.sluttdato = _sluttDato
    }

    const newArbeidsgiver: PeriodeMedForsikring = {
      arbeidsgiver: {
        identifikator: [{
          type: 'registrering',
          id: _arbeidsgiversOrgnr
        }],
        navn: _arbeidsgiversNavn
      },
      periode: newPeriode,
      typeTrygdeforhold: typeTrygdeforhold
    } as PeriodeMedForsikring

    if (includeAddress) {
      newArbeidsgiver.arbeidsgiver.adresse = {
        gate: _gate,
        postnummer: _postnummer,
        by: _by,
        bygning: _bygning,
        region: _region,
        land: _land
      }
    }

    const valid: boolean = performValidation({
      arbeidsgiver: newArbeidsgiver,
      includeAddress: includeAddress,
      namespace: namespace
    })
    if (valid) {
      if (_.isFunction(onArbeidsgiverEdit)) {
        onArbeidsgiverEdit(newArbeidsgiver, selected)
      }
      setIsEditing(false)
    }
  }

  const onEditButtonClicked = () => {
    setIsEditing(true)
    setArbeidsgiversOrgnr(_arbeidsgiversOrgnr || '')
    setArbeidsgiversNavn(_arbeidsgiversNavn || '')
    setStartDato(_startDato)
    setSluttDato(_sluttDato)
    if (includeAddress) {
      setGate(_gate)
      setPostnummer(_postnummer)
      setBygning(_bygning)
      setBy(_by)
      setRegion(_region)
      setLand(_land)
    }
  }

  const onCancelButtonClicked = () => {
    setIsEditing(false)
    setArbeidsgiversOrgnr('')
    setArbeidsgiversNavn('')
    setStartDato('')
    setSluttDato('')
    if (includeAddress) {
      setGate('')
      setPostnummer('')
      setBygning('')
      setBy('')
      setRegion('')
      setLand('')
    }
  }

  const onSelectCheckboxClicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    onArbeidsgiverSelect(arbeidsgiver, e.target.checked)
  }

  if (!_arbeidsgiversNavn || !_arbeidsgiversOrgnr) {
    return <div />
  }
  return (
    <div
      className='slideInFromLeft'
      key={_arbeidsgiversOrgnr}
    >
      <VerticalSeparatorDiv size='0.5' />
      <ArbeidsgiverPanel
        border
        className={classNames({ new: newArbeidsgiver })}
      >
        <FlexCenterSpacedDiv>
          <PaddedFlexDiv className='slideInFromLeft'>
            <IkonArbeidsgiver />
            <HorizontalSeparatorDiv />
            <div>
              {_isEditing && editable === 'full'
                ? (
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
                    <Column>
                      <Input
                        namespace={_namespace}
                        feil={_validation[_namespace + '-orgnr']?.feilmelding}
                        id='orgnr'
                        label={t('label:orgnr')}
                        onChanged={onOrgnrChanged}
                        value={_arbeidsgiversOrgnr}
                      />
                    </Column>
                  </Row>
                  )
                : (
                  <div>
                    <UndertekstBold>
                      {_arbeidsgiversNavn}
                    </UndertekstBold>
                    <Normaltekst>
                      {t('label:orgnr')}:&nbsp;{_arbeidsgiversOrgnr}
                    </Normaltekst>
                  </div>
                  )}
              {_isEditing
                ? (
                  <>
                    <VerticalSeparatorDiv size='0.5' />
                    <Row>
                      <Period
                        key={'' + _startDato + _sluttDato}
                        namespace={_namespace}
                        errorStartDato={_validation[_namespace + '-startdato']?.feilmelding}
                        errorSluttDato={_validation[_namespace + '-sluttdato']?.feilmelding}
                        setStartDato={onStartDatoChanged}
                        setSluttDato={onSluttDatoChanged}
                        valueStartDato={_startDato}
                        valueSluttDato={_sluttDato}
                      />
                    </Row>
                  </>
                  )
                : (
                  <div>
                    <Normaltekst>
                      {t('label:startdato')}:&nbsp;{toUIDateFormat(_startDato)}
                    </Normaltekst>
                    <Normaltekst>
                      {t('label:sluttdato')}:&nbsp;{toUIDateFormat(_sluttDato)}
                    </Normaltekst>
                  </div>
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
                        <AlignStartRow>
                          <Column flex='3'>
                            <Input
                              namespace={_namespace}
                              feil={_validation[_namespace + '-gate']?.feilmelding}
                              id='gate'
                              label={t('label:gateadresse')}
                              onChanged={onGateChanged}
                              value={_gate}
                            />
                          </Column>
                          <Column>
                            <Input
                              namespace={_namespace}
                              feil={_validation[_namespace + '-bygning']?.feilmelding}
                              id='bygning'
                              label={t('label:bygning')}
                              onChanged={onBygningChanged}
                              value={_bygning}
                            />
                          </Column>
                        </AlignStartRow>
                        <VerticalSeparatorDiv />
                        <AlignStartRow>
                          <Column>
                            <Input
                              namespace={_namespace}
                              feil={_validation[_namespace + '-postnummer']?.feilmelding}
                              id='postnummer'
                              label={t('label:postnummer')}
                              onChanged={onPostnummerChanged}
                              value={_postnummer}
                            />
                          </Column>
                          <Column flex='3'>
                            <Input
                              namespace={_namespace}
                              feil={_validation[_namespace + '-by']?.feilmelding}
                              id='by'
                              label={t('label:by')}
                              onChanged={onByChanged}
                              value={_by}
                            />
                          </Column>
                        </AlignStartRow>
                        <VerticalSeparatorDiv />
                        <AlignStartRow>
                          <Column flex='2'>
                            <Input
                              namespace={_namespace}
                              feil={_validation[_namespace + '-region']?.feilmelding}
                              id='region'
                              label={t('label:region')}
                              onChanged={onRegionChanged}
                              value={_region}
                            />
                          </Column>
                          <Column flex='2'>
                            <CountrySelect
                              closeMenuOnSelect
                              key={_land}
                              data-test-id={namespace + '-land'}
                              error={_validation[_namespace + '-land']?.feilmelding}
                              flagWave
                              id={namespace + '-land'}
                              label={t('label:land') + ' *'}
                              menuPortalTarget={document.body}
                              onOptionSelected={(e: Country) => onLandChanged(e.value)}
                              placeholder={t('el:placeholder-select-default')}
                              values={_land}
                            />
                          </Column>
                        </AlignStartRow>
                      </>
                      )
                    : (
                      <div>
                        <Normaltekst>
                          {(!!_gate || !!_bygning || !!_postnummer || !!_by || !!_region || !!_land) && (
                            <>{t('label:adresse')}: </>
                          )}
                        </Normaltekst>
                        <Normaltekst>
                          {_gate ?? '-'}
                          {_bygning ? ', ' + t('label:bygning').toLowerCase() + ' ' + _bygning : ''}
                        </Normaltekst>
                        <Normaltekst>
                          {_postnummer + ' ' + _by}
                        </Normaltekst>
                        <Normaltekst>
                          {_region ? _region + ', ' : ''}
                          {countryData.findByValue(_land)?.label ?? _land}
                        </Normaltekst>
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
                  onClick={onSaveEditButtonClicked}
                >
                  <Add />
                  <HorizontalSeparatorDiv size='0.5' />
                  {t('el:button-save')}
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
