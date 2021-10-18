import Add from 'assets/icons/Add'
import DateInput from 'components/Forms/DateInput'
import { toUIDateFormat } from 'components/Forms/PeriodeInput'
import { AlertstripeDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Kodeverk, OldFamilieRelasjon, Person, Validation } from 'declarations/types'
import { KodeverkPropType } from 'declarations/types.pt'
import { Country, CountryFilter } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import AlertStripe from 'nav-frontend-alertstriper'
import Panel from 'nav-frontend-paneler'
import { FeiloppsummeringFeil, Input, Select } from 'nav-frontend-skjema'
import { Normaltekst } from 'nav-frontend-typografi'
import { Column, HighContrastKnapp, HorizontalSeparatorDiv, Row, VerticalSeparatorDiv } from 'nav-hoykontrast'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

const Container = styled.div`
  margin-top: 1, 5rem;
`
const AlignCenterColumn = styled(Column)`
  display: flex;
  align-items: center;
`

export interface AbroadPersonFormSelector {
  kjoennList: Array<Kodeverk> | undefined
  landkoderList: Array<Kodeverk> | undefined
}

export interface AbroadPersonFormProps {
  alertMessage: string | undefined
  alertType: string | undefined
  alertTypesWatched: Array<string> | undefined
  className?: string
  rolleList: Array<Kodeverk>
  existingFamilyRelationships: Array<OldFamilieRelasjon>
  onAbroadPersonAddedFailure: () => void
  onAbroadPersonAddedSuccess: (r: OldFamilieRelasjon) => void
  person: Person | null | undefined
}

const mapState = (state: State): AbroadPersonFormSelector => ({
  kjoennList: state.app.kjoenn,
  landkoderList: state.app.landkoder
})

const emptyFamilieRelasjon: OldFamilieRelasjon = {
  fnr: '',
  fdato: '',
  land: null,
  statsborgerskap: null,
  rolle: '',
  kjoenn: '',
  fornavn: '',
  etternavn: ''
}

const AbroadPersonForm: React.FC<AbroadPersonFormProps> = ({
  alertMessage,
  alertType,
  alertTypesWatched = [],
  className,
  rolleList,
  existingFamilyRelationships,
  onAbroadPersonAddedFailure,
  onAbroadPersonAddedSuccess,
  person
}: AbroadPersonFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    kjoennList,
    landkoderList
  }: AbroadPersonFormSelector = useSelector<State, AbroadPersonFormSelector>(mapState)
  const [_relation, setRelation] = useState<OldFamilieRelasjon>(emptyFamilieRelasjon)
  const [_validation, setValidation] = useState<Validation>({})

  useEffect(() => {
    setRelation(emptyFamilieRelasjon)
    setValidation({})
  }, [person])

  const updateCountry = (felt: string, value: string): void => {
    setRelation({
      ..._relation,
      [felt]: value
    })
  }

  const updateRelation = (
    felt: string,
    value: string
  ): void => {
    setRelation({
      ..._relation,
      [felt]: value ?? ''
    })
  }

  const trimFamilyRelation = (relation: OldFamilieRelasjon): OldFamilieRelasjon => {
    return {
      fnr: relation.fnr ? relation.fnr.trim() : '',
      fdato: relation.fdato ? relation.fdato.trim() : '',
      fornavn: relation.fornavn ? relation.fornavn.trim() : '',
      etternavn: relation.etternavn ? relation.etternavn.trim() : '',
      kjoenn: relation.kjoenn ? relation.kjoenn.trim() : '',
      relasjoner: relation.relasjoner,
      land: relation.land,
      statsborgerskap: relation.statsborgerskap,
      rolle: relation.rolle
    } as OldFamilieRelasjon
  }

  const canAddRelation = (): boolean => {
    return (
      !_.isEmpty(_relation.fnr) &&
      !_.isEmpty(_relation.rolle) &&
      !_.isEmpty(_relation.land) &&
      !_.isEmpty(_relation.statsborgerskap) &&
      !_.isEmpty(_relation.kjoenn) &&
      !_.isEmpty(_relation.fornavn) &&
      !_.isEmpty(_relation.etternavn) &&
      !_.isEmpty(_relation.fdato) &&
      _relation.fdato?.match(/\d{4}-\d{2}-\d{2}/) !== null
    )
  }

  const conflictingPerson = (): boolean => {
    if (_.find(existingFamilyRelationships, (f) => f.fnr === _relation.fnr) !== undefined) {
      onAbroadPersonAddedFailure()
      return true
    }
    return false
  }

  const hasNoValidationErrors = (validation: Validation): boolean => _.find(validation, (it) => (it !== undefined)) === undefined

  const performValidation = (): boolean => {
    const validation: Validation = {
      // saksnummer: saksnummer ? null : "No saksnummer",
      fnr: _relation.fnr
        ? undefined
        : {
          feilmelding: t('message:validation-noFnr'),
          skjemaelementId: 'familierelasjoner__input-fnr-id'
        } as FeiloppsummeringFeil,
      fornavn: _relation.fornavn
        ? undefined
        : {
          feilmelding: t('message:validation-noFirstName'),
          skjemaelementId: 'familierelasjoner__input-fornavn'
        } as FeiloppsummeringFeil,
      etternavn: _relation.etternavn
        ? undefined
        : {
          feilmelding: t('message:validation-noLastName'),
          skjemaelementId: 'familierelasjoner__input-etternavn'
        } as FeiloppsummeringFeil,
      kjoenn: _relation.kjoenn
        ? undefined
        : {
          feilmelding: t('message:validation-noGender'),
          skjemaelementId: 'familierelasjoner__select-kjoenn'
        } as FeiloppsummeringFeil,
      fdato: _relation.fdato
        ? undefined
        : {
          feilmelding: t('message:validation-noDate'),
          skjemaelementId: 'familierelasjoner__input-fdato'
        } as FeiloppsummeringFeil,
      rolle: _relation.rolle
        ? undefined
        : {
          feilmelding: t('message:validation-noRolle'),
          skjemaelementId: 'familierelasjoner__input-familierelasjon'
        } as FeiloppsummeringFeil,
      land: _relation.land
        ? undefined
        : {
          feilmelding: t('message:validation-noLand'),
          skjemaelementId: 'familierelasjoner__input-land'
        } as FeiloppsummeringFeil,
      statsborgerskap: _relation.land
        ? undefined
        : {
          feilmelding: t('message:validation-noNationality'),
          skjemaelementId: 'familierelasjoner__input-statsborgerskap'
        } as FeiloppsummeringFeil
    } as Validation
    setValidation(validation)
    return hasNoValidationErrors(validation)
  }

  const resetValidation = (key: Array<string> | string | undefined): void => {
    let newValidation = _.cloneDeep(_validation)
    if (!key) {
      newValidation = {}
    }
    if (_.isString(key)) {
      newValidation[key] = undefined
    }
    if (_.isArray(key)) {
      key.forEach((k) => {
        newValidation[k] = undefined
      })
    }
    setValidation(newValidation)
  }

  const addRelation = (): void => {
    if (performValidation()) {
      if (canAddRelation() && !conflictingPerson()) {
        setRelation(emptyFamilieRelasjon)
        onAbroadPersonAddedSuccess(trimFamilyRelation(_relation))
      }
    }
  }

  return (
    <Container className={className}>
      <Normaltekst>{t('label:family-utland-add-form')}</Normaltekst>
      <VerticalSeparatorDiv />
      <Panel data-test-id='familierelasjoner__utland__wrapper'>
        <Row>
          <Column className='slideInFromLeft'>
            <Input
              data-test-id='familierelasjoner__input-fnr-id'
              feil={_validation.fnr ? _validation.fnr.feilmelding : undefined}
              label={t('label:utenlandsk-id')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateRelation('fnr', e.currentTarget.value)
                resetValidation('fnr')
              }}
              value={_relation.fnr}
            />
            <VerticalSeparatorDiv />
          </Column>
          <HorizontalSeparatorDiv />
          <Column className='slideInFromLeft' style={{ animationDelay: '0.05s' }}>
            <CountrySelect
              data-test-id='familierelasjoner__input-land'
              error={_validation.land ? _validation.land.feilmelding : undefined}
              label={t('label:land')}
              key={'familierelasjoner__input-land-' + _relation.land}
              menuPortalTarget={document.body}
              includeList={landkoderList ? landkoderList.map((l: Kodeverk) => l.kode) : []}
              onOptionSelected={(e: Country) => {
                updateCountry('land', e.value)
                resetValidation('land')
              }}
              placeholder={t('el:placeholder-select-default')}
              values={_relation.land}
            />
            <VerticalSeparatorDiv />
          </Column>
          <HorizontalSeparatorDiv />
          <Column className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
            <CountrySelect
              data-test-id='familierelasjoner__input-statsborgerskap'
              error={_validation.statsborgerskap ? _validation.statsborgerskap.feilmelding : undefined}
              includeList={CountryFilter.STANDARD}
              label={t('label:statsborgerskap')}
              key={'familierelasjoner__input-statsborgerskap' + _relation.statsborgerskap}
              menuPortalTarget={document.body}
              placeholder={t('el:placeholder-select-default')}
              onOptionSelected={(e: Country) => {
                updateCountry('statsborgerskap', e.value)
                resetValidation('statsborgerskap')
              }}
              values={_relation.statsborgerskap}
            />
            <VerticalSeparatorDiv />
          </Column>
        </Row>
        <Row>
          <Column className='slideInFromLeft' style={{ animationDelay: '0.15s' }}>
            <Input
              data-test-id='familierelasjoner__input-fornavn'
              feil={_validation.fornavn ? _validation.fornavn.feilmelding : undefined}
              label={t('label:fornavn')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateRelation('fornavn', e.currentTarget.value)
                resetValidation('fornavn')
              }}
              value={_relation.fornavn}
            />
            <VerticalSeparatorDiv />
          </Column>
          <HorizontalSeparatorDiv />
          <Column className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
            <Input
              data-test-id='familierelasjoner__input-etternavn'
              feil={_validation.etternavn ? _validation.etternavn.feilmelding : undefined}
              label={t('label:etternavn')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateRelation('etternavn', e.currentTarget.value)
                resetValidation('etternavn')
              }}
              value={_relation.etternavn}
            />
            <VerticalSeparatorDiv />
          </Column>
        </Row>
        <Row>
          <Column className='slideInFromLeft' style={{ animationDelay: '0.25s' }}>
            <Select
              data-test-id='familierelasjoner__select-kjoenn'
              feil={_validation.kjoenn ? _validation.kjoenn.feilmelding : undefined}
              id='familierelasjoner__select-kjoenn'
              label={t('label:kjønn')}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                updateRelation('kjoenn', e.currentTarget.value)
                resetValidation('kjoenn')
              }}
              value={_relation.kjoenn}
            >
              <option value='' disabled>
                {t('el:placeholder-select-default')}
              </option>
              {kjoennList &&
                kjoennList.map((element: Kodeverk) => (
                  <option value={element.kode} key={element.kode}>
                    {element.term}
                  </option>
                ))}
            </Select>
            <VerticalSeparatorDiv />
          </Column>
          <HorizontalSeparatorDiv />
          <Column className='slideInFromLeft' style={{ animationDelay: '0.3s' }}>
            <DateInput
              id={'fdato'}
              data-test-id='familierelasjoner__input-fdato'
              key={'familierelasjoner__input-fdato-' + _relation.fdato}
              namespace={'familierelasjoner__input'}
              feil={_validation['familierelasjoner__input-fdato']?.feilmelding}
              label={t('label:fødselsdato')}
              onChanged={(date: string) => {
                updateRelation('fdato', date)
                resetValidation('fdato')
              }}
              placeholder={t('el:placeholder-date-default')}
              value={toUIDateFormat(_relation.fdato)}
            />
            <VerticalSeparatorDiv />
          </Column>
        </Row>
        <Row>
          <Column className='slideInFromLeft' style={{ animationDelay: '0.4s' }}>
            <Select
              data-test-id='familierelasjoner__input-familierelasjon'
              feil={_validation.rolle ? _validation.rolle.feilmelding : undefined}
              label={t('label:familierelasjon')}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                updateRelation('rolle', e.currentTarget.value)
                resetValidation('rolle')
              }}
              value={_relation.rolle}
            >
              <option value='' disabled>
                {t('el:placeholder-select-default')}
              </option>
              {rolleList.map((element: Kodeverk) => (
                <option value={element.kode} key={element.kode}>
                  {element.term}
                </option>
              ))}
            </Select>
            <VerticalSeparatorDiv />
          </Column>
          <HorizontalSeparatorDiv />
          <AlignCenterColumn
            className='slideInFromLeft'
            style={{ animationDelay: '0.4s' }}
          >
            <HighContrastKnapp
              onClick={addRelation}
              className='relasjon familierelasjoner__knapp'
            >
              <Add
                width='20'
                height='20'
                color={!canAddRelation() ? 'white' : '#0067C5'}
              />
              <HorizontalSeparatorDiv />
              <span>
                {t('el:button-add')}
              </span>
            </HighContrastKnapp>
          </AlignCenterColumn>
          {alertMessage && alertType && alertTypesWatched.indexOf(alertType) >= 0 && (
            <AlertstripeDiv>
              <AlertStripe type='advarsel'>
                {t(alertMessage)}
              </AlertStripe>
            </AlertstripeDiv>
          )}
        </Row>
      </Panel>
    </Container>
  )
}

AbroadPersonForm.propTypes = {
  className: PT.string,
  rolleList: PT.arrayOf(KodeverkPropType.isRequired).isRequired
}

export default AbroadPersonForm
