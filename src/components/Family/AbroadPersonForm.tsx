import Tilsette from 'assets/icons/Tilsette'
import Alert from 'components/Alert/Alert'
import { Column, HorizontalSeparatorDiv, Row, VerticalSeparatorDiv } from 'components/StyledComponents'
import { AlertStatus } from 'declarations/components'
import { State } from 'declarations/reducers'
import { FamilieRelasjon, Kodeverk, Person, Validation } from 'declarations/types'
import { KodeverkPropType } from 'declarations/types.pt'
import { CountryFilter } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Knapp } from 'nav-frontend-knapper'
import Panel from 'nav-frontend-paneler'
import { FeiloppsummeringFeil, Input, Select } from 'nav-frontend-skjema'
import { Normaltekst } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { vaskInputDato } from 'utils/dato'

const Container = styled.div`
  margin-top: 1, 5rem;
`
const AlertstripeDiv = styled.div`
  margin: 0.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  width: 50%;
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
  alertStatus: string | undefined
  alertMessage: string | undefined
  alertType: string | undefined
  alertTypesWatched: Array<string> | undefined
  className?: string
  rolleList: Array<Kodeverk>
  existingFamilyRelationships: Array<FamilieRelasjon>
  onAlertClose: () => void
  onAbroadPersonAddedFailure: () => void
  onAbroadPersonAddedSuccess: (r: FamilieRelasjon) => void
  person: Person | undefined
}

const mapState = (state: State): AbroadPersonFormSelector => ({
  kjoennList: state.app.kjoenn,
  landkoderList: state.app.landkoder
})

const emptyFamilieRelasjon: FamilieRelasjon = {
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
  alertStatus,
  alertMessage,
  alertType,
  alertTypesWatched = [],
  className,
  rolleList,
  existingFamilyRelationships,
  onAlertClose,
  onAbroadPersonAddedFailure,
  onAbroadPersonAddedSuccess,
  person
}: AbroadPersonFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    kjoennList,
    landkoderList
  }: AbroadPersonFormSelector = useSelector<State, AbroadPersonFormSelector>(mapState)
  const [_relation, setRelation] = useState<FamilieRelasjon>(emptyFamilieRelasjon)
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
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const value = event.currentTarget.value
    setRelation({
      ..._relation,
      [felt]: value || ''
    })
  }

  const updateDate = (
    felt: string,
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const nyDato = vaskInputDato(event.currentTarget.value) || ''
    setRelation({
      ..._relation,
      [felt]: nyDato
    })
  }

  const trimFamilyRelation = (relation: FamilieRelasjon): FamilieRelasjon => {
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
    } as FamilieRelasjon
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
      _relation.fdato?.match(/\d{2}\.\d{2}\.\d{4}/) !== null
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
          feilmelding: t('ui:validation-noFnr'),
          skjemaelementId: 'familierelasjoner__input-fnr-id'
        } as FeiloppsummeringFeil,
      fornavn: _relation.fornavn
        ? undefined
        : {
          feilmelding: t('ui:validation-noFirstName'),
          skjemaelementId: 'familierelasjoner__input-fornavn'
        } as FeiloppsummeringFeil,
      etternavn: _relation.etternavn
        ? undefined
        : {
          feilmelding: t('ui:validation-noLastName'),
          skjemaelementId: 'familierelasjoner__input-etternavn'
        } as FeiloppsummeringFeil,
      kjoenn: _relation.kjoenn
        ? undefined
        : {
          feilmelding: t('ui:validation-noGender'),
          skjemaelementId: 'familierelasjoner__select-kjoenn'
        } as FeiloppsummeringFeil,
      fdato: _relation.fdato
        ? undefined
        : {
          feilmelding: t('ui:validation-noFdato'),
          skjemaelementId: 'familierelasjoner__input-fdato'
        } as FeiloppsummeringFeil,
      rolle: _relation.rolle
        ? undefined
        : {
          feilmelding: t('ui:validation-noRolle'),
          skjemaelementId: 'familierelasjoner__input-familierelasjon'
        } as FeiloppsummeringFeil,
      land: _relation.land
        ? undefined
        : {
          feilmelding: t('ui:validation-noLand'),
          skjemaelementId: 'familierelasjoner__input-land'
        } as FeiloppsummeringFeil,
      statsborgerskap: _relation.land
        ? undefined
        : {
          feilmelding: t('ui:validation-noNationality'),
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
    const valid: boolean = performValidation()
    if (valid) {
      if (canAddRelation() && !conflictingPerson()) {
        setRelation(emptyFamilieRelasjon)
        onAbroadPersonAddedSuccess(trimFamilyRelation(_relation))
      }
    }
  }

  return (
    <Container className={className}>
      <Normaltekst>{t('ui:form-family-utland-add-form-title')}</Normaltekst>
      <VerticalSeparatorDiv />
      <Panel data-test-id='familierelasjoner__utland__wrapper'>
        <Row>
          <Column className='slideAnimate'>
            <Input
              data-test-id='familierelasjoner__input-fnr-id'
              feil={_validation.fnr ? _validation.fnr.feilmelding : undefined}
              label={t('ui:label-abroad-id')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateRelation('fnr', e)
                resetValidation('fnr')
              }}
              value={_relation.fnr}
            />
            <VerticalSeparatorDiv />
          </Column>
          <HorizontalSeparatorDiv />
          <Column className='slideAnimate' style={{ animationDelay: '0.1s' }}>
            <CountrySelect
              data-test-id='familierelasjoner__input-land'
              error={_validation.land ? _validation.land.feilmelding : undefined}
              label={t('ui:label-landkode')}
              menuPortalTarget={document.body}
              includeList={landkoderList ? landkoderList.map((l: Kodeverk) => l.kode) : []}
              onOptionSelected={(e: any) => {
                updateCountry('land', e.value)
                resetValidation('land')
              }}
              placeholder={t('ui:form-choose')}
              value={_relation.land}
            />
            <VerticalSeparatorDiv />
          </Column>
          <HorizontalSeparatorDiv />
          <Column className='slideAnimate' style={{ animationDelay: '0.2s' }}>
            <CountrySelect
              data-test-id='familierelasjoner__input-statsborgerskap'
              error={_validation.statsborgerskap ? _validation.statsborgerskap.feilmelding : undefined}
              includeList={CountryFilter.STANDARD}
              label={t('ui:label-statsborgerskap')}
              menuPortalTarget={document.body}
              placeholder={t('ui:form-choose')}
              onOptionSelected={(e: any) => {
                updateCountry('statsborgerskap', e.value)
                resetValidation('statsborgerskap')
              }}
              value={_relation.statsborgerskap}
            />
            <VerticalSeparatorDiv />
          </Column>
        </Row>
        <Row>
          <Column className='slideAnimate' style={{ animationDelay: '0.3s' }}>
            <Input
              data-test-id='familierelasjoner__input-fornavn'
              feil={_validation.fornavn ? _validation.fornavn.feilmelding : undefined}
              label={t('ui:label-firstname')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateRelation('fornavn', e)
                resetValidation('fornavn')
              }}
              value={_relation.fornavn}
            />
            <VerticalSeparatorDiv />
          </Column>
          <HorizontalSeparatorDiv />
          <Column className='slideAnimate' style={{ animationDelay: '0.4s' }}>
            <Input
              data-test-id='familierelasjoner__input-etternavn'
              feil={_validation.etternavn ? _validation.etternavn.feilmelding : undefined}
              label={t('ui:label-lastname')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateRelation('etternavn', e)
                resetValidation('etternavn')
              }}
              value={_relation.etternavn}
            />
            <VerticalSeparatorDiv />
          </Column>
        </Row>
        <Row>
          <Column className='slideAnimate' style={{ animationDelay: '0.5s' }}>
            <Select
              data-test-id='familierelasjoner__select-kjoenn'
              feil={_validation.kjoenn ? _validation.kjoenn.feilmelding : undefined}
              id='familierelasjoner__select-kjoenn'
              label={t('ui:label-gender')}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                updateRelation('kjoenn', e)
                resetValidation('kjoenn')
              }}
              value={_relation.kjoenn}
            >
              <option value='' disabled>
                {t('ui:form-choose')}
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
          <Column className='slideAnimate' style={{ animationDelay: '0.6s' }}>
            <Input
              data-test-id='familierelasjoner__input-fdato'
              feil={_validation.fdato ? _validation.fdato.feilmelding : undefined}
              label={t('ui:form-birthdate')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateRelation('fdato', e)
                resetValidation('fdato')
              }}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => updateDate('fdato', e)}
              placeholder='DD.MM.ÅÅÅÅ'
              value={_relation.fdato}
            />
            <VerticalSeparatorDiv />
          </Column>
        </Row>
        <Row>
          <Column className='slideAnimate' style={{ animationDelay: '0.7s' }}>
            <Select
              data-test-id='familierelasjoner__input-familierelasjon'
              feil={_validation.rolle ? _validation.rolle.feilmelding : undefined}
              label={t('ui:label-familyRelationship')}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                updateRelation('rolle', e)
                resetValidation('rolle')
              }}
              value={_relation.rolle}
            >
              <option value='' disabled>
                {t('ui:form-choose')}
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
            className='slideAnimate'
            style={{ animationDelay: '0.8s' }}
          >
            <Knapp
              onClick={addRelation}
              className='relasjon familierelasjoner__knapp'
            >
              <Tilsette
                width='20'
                height='20'
                color={!canAddRelation() ? 'white' : '#0067C5'}
              />
              <HorizontalSeparatorDiv />
              <span>{t('ui:form-add')}</span>
            </Knapp>
          </AlignCenterColumn>
          {alertMessage && alertType && alertTypesWatched.indexOf(alertType) >= 0 && (
            <AlertstripeDiv>
              <Alert
                type='client'
                fixed={false}
                message={t(alertMessage)}
                status={alertStatus as AlertStatus}
                onClose={onAlertClose}
              />
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
