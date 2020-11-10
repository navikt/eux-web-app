import { clientClear } from '../../actions/alert'
import * as formActions from '../../actions/form'
import Tilsette from '../../assets/icons/Tilsette'
import Alert, { AlertStatus } from '../../components/Alert/Alert'
import {
  Cell,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from '../../components/StyledComponents'
import * as types from '../../constants/actionTypes'
import { State } from '../../declarations/reducers'
import {
  FamilieRelasjon,
  Kodeverk,
  Validation,
  Person
} from '../../declarations/types'
import { KodeverkPropType } from '../../declarations/types.pt'
import { CountryFilter } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Knapp } from 'nav-frontend-knapper'
import Panel from 'nav-frontend-paneler'
import { Input, Select } from 'nav-frontend-skjema'
import { Normaltekst } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { vaskInputDato } from '../../utils/dato'

export interface AbroadPersonFormSelector {
  alertStatus: string | undefined;
  alertMessage: string | undefined;
  alertType: string | undefined;
  kjoenn: Array<Kodeverk> | undefined;
  landkoder: Array<Kodeverk> | undefined;
}

export interface AbroadPersonFormProps {
  className?: string;
  rolleList: Array<Kodeverk>;
  existingFamilyRelationships: Array<FamilieRelasjon>;
  person: Person | undefined;
}

const mapState = (state: State): AbroadPersonFormSelector => ({
  alertStatus: state.alert.clientErrorStatus,
  alertMessage: state.alert.clientErrorMessage,
  alertType: state.alert.type,
  kjoenn: state.app.kjoenn,
  landkoder: state.app.landkoder
})

const Container = styled.div`
  margin-top: 1, 5rem;
`
const AlertstripeDiv = styled.div`
  margin: 0.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  width: 50%;
`
const AlignCenterCell = styled(Cell)`
  display: flex;
  align-items: center;
`
const emptyRelation = {
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
  rolleList,
  existingFamilyRelationships,
  person
}: AbroadPersonFormProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    alertType,
    alertMessage,
    alertStatus,
    kjoenn,
    landkoder
  }: AbroadPersonFormSelector = useSelector<State, AbroadPersonFormSelector>(
    mapState
  )
  const [relation, setRelation] = useState<FamilieRelasjon>(emptyRelation)
  const [validation, setValidation] = useState<{ [k: string]: any }>({})

  useEffect(() => {
    setRelation(emptyRelation)
    setValidation({})
    console.log(person)
  }, [person])

  const updateCountry = (felt: string, value: string): void => {
    setRelation({
      ...relation,
      [felt]: value
    })
  }

  const updateRelation = (
    felt: string,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const value = event.currentTarget.value
    setRelation({
      ...relation,
      [felt]: value || ''
    })
  }

  const updateDate = (
    felt: string,
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const nyDato = vaskInputDato(event.currentTarget.value) || ''
    setRelation({
      ...relation,
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
    const {
      fnr,
      rolle,
      land,
      statsborgerskap,
      kjoenn,
      fornavn,
      etternavn,
      fdato
    } = relation
    return (
      !_.isEmpty(fnr) &&
      !_.isEmpty(rolle) &&
      !_.isEmpty(land) &&
      !_.isEmpty(statsborgerskap) &&
      !_.isEmpty(kjoenn) &&
      !_.isEmpty(fornavn) &&
      !_.isEmpty(etternavn) &&
      !_.isEmpty(fdato) &&
      fdato?.match(/\d{2}\.\d{2}\.\d{4}/) !== null
    )
  }

  const conflictingPerson = (): boolean => {
    const { fnr } = relation
    if (
      _.find(existingFamilyRelationships, (f) => f.fnr === fnr) !== undefined
    ) {
      dispatch({
        type: types.FORM_ABROADPERSON_ADD_FAILURE
      })
      return true
    }
    return false
  }

  const validate = (): Validation => {
    const validation: Validation = {
      // saksnummer: saksnummer ? null : "No saksnummer",
      fnr: relation.fnr ? null : 'ugjyldig fnr',
      fornavn: relation.fornavn ? null : 'ugjyldig fornavn',
      etternavn: relation.etternavn ? null : 'ugjyldig etternavn',
      kjoenn: relation.kjoenn ? null : 'kjønn er ikke valgt',
      fdato: relation.fdato ? null : 'Ingen dato valgt',
      rolle: relation.rolle ? null : 'ingen roller',
      land: relation.land ? null : 'Du har ikke valg noe land',
      statsborgerskap: relation.land
        ? null
        : 'Du har ikke valg statsborgerskap'
    }
    setValidation(validation)
    return validation
  }
  /*
  const resetAllValidation = () => {
    setValidation({});
  };
*/
  const resetValidation = (key: Array<string> | string): void => {
    const newValidation = _.cloneDeep(validation)
    if (_.isString(key)) {
      newValidation[key] = null
    }
    if (_.isArray(key)) {
      key.forEach((k) => {
        newValidation[k] = null
      })
    }
    setValidation(newValidation)
  }

  const isValid = (_validation: Validation): boolean => {
    return _.find(_.values(_validation), (e) => e !== null) === undefined
  }

  const addRelation = (): void => {
    if (isValid(validate())) {
      if (canAddRelation() && !conflictingPerson()) {
        setRelation(emptyRelation)
        dispatch(formActions.addFamilierelasjoner(trimFamilyRelation(relation)))
        dispatch({
          type: types.FORM_ABROADPERSON_ADD_SUCCESS
        })
      }
    }
  }

  return (
    <Container>
      <Normaltekst>{t('ui:form-family-utland-add-form-title')}</Normaltekst>
      <VerticalSeparatorDiv />
      <Panel data-testid='familierelasjoner__utland__wrapper'>
        <Row>
          <Cell className='slideAnimate'>
            <Input
              data-testid='familierelasjoner__input-fnr-id'
              label={t('ui:label-abroad-id')}
              feil={validation.fnr}
              value={relation.fnr}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateRelation('fnr', e)
                resetValidation('fnr')
              }}
            />
            <VerticalSeparatorDiv />
          </Cell>
          <HorizontalSeparatorDiv />
          <Cell className='slideAnimate' style={{ animationDelay: '0.1s' }}>
            <CountrySelect
              label={t('ui:label-landkode')}
              data-testid='familierelasjoner__input-land'
              placeholder={t('ui:form-choose')}
              menuPortalTarget={document.body}
              value={relation.land}
              error={validation.land}
              includeList={
                landkoder ? landkoder.map((l: Kodeverk) => l.kode) : []
              }
              onOptionSelected={(e: any) => {
                updateCountry('land', e.value)
                resetValidation('land')
              }}
            />
            <VerticalSeparatorDiv />
          </Cell>
          <HorizontalSeparatorDiv />
          <Cell className='slideAnimate' style={{ animationDelay: '0.1s' }}>
            <CountrySelect
              label={t('ui:label-statsborgerskap')}
              data-testid='familierelasjoner__input-statsborgerskap'
              placeholder={t('ui:form-choose')}
              menuPortalTarget={document.body}
              error={validation.statsborgerskap}
              value={relation.statsborgerskap}
              includeList={CountryFilter.STANDARD}
              onOptionSelected={(e: any) => {
                updateCountry('statsborgerskap', e.value)
                resetValidation('statsborgerskap')
              }}
            />
            <VerticalSeparatorDiv />
          </Cell>
        </Row>
        <Row>
          <Cell className='slideAnimate' style={{ animationDelay: '0.2s' }}>
            <Input
              label={t('ui:label-firstname')}
              data-testid='familierelasjoner__input-fornavn'
              feil={validation.fornavn}
              value={relation.fornavn}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateRelation('fornavn', e)
                resetValidation('fornavn')
              }}
            />
            <VerticalSeparatorDiv />
          </Cell>
          <HorizontalSeparatorDiv />
          <Cell className='slideAnimate' style={{ animationDelay: '0.3s' }}>
            <Input
              label={t('ui:label-lastname')}
              data-testid='familierelasjoner__input-etternavn'
              feil={validation.etternavn}
              value={relation.etternavn}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateRelation('etternavn', e)
                resetValidation('etternavn')
              }}
            />
            <VerticalSeparatorDiv />
          </Cell>
        </Row>
        <Row>
          <Cell className='slideAnimate' style={{ animationDelay: '0.4s' }}>
            <Select
              id='id-kjoenn'
              label={t('ui:label-gender')}
              className='familierelasjoner__select-kjoenn'
              feil={validation.kjoenn}
              value={relation.kjoenn}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                updateRelation('kjoenn', e)
                resetValidation('kjoenn')
              }}
            >
              <option value='' disabled>
                {t('ui:form-choose')}
              </option>
              {kjoenn &&
                kjoenn.map((element: Kodeverk) => (
                  <option value={element.kode} key={element.kode}>
                    {element.term}
                  </option>
                ))}
            </Select>
            <VerticalSeparatorDiv />
          </Cell>
          <HorizontalSeparatorDiv />
          <Cell className='slideAnimate' style={{ animationDelay: '0.5s' }}>
            <Input
              label={t('ui:form-birthdate')}
              data-testid='familierelasjoner__input-fdato'
              feil={validation.fdato}
              value={relation.fdato}
              placeholder='DD.MM.ÅÅÅÅ'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateRelation('fdato', e)
                resetValidation('fdato')
              }}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                updateDate('fdato', e)}
            />
            <VerticalSeparatorDiv />
          </Cell>
        </Row>
        <Row>
          <Cell className='slideAnimate' style={{ animationDelay: '0.6s' }}>
            <Select
              label={t('ui:label-familyRelationship')}
              data-testid='familierelasjoner__input-familierelasjon'
              feil={validation.rolle}
              value={relation.rolle}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                updateRelation('rolle', e)
                resetValidation('rolle')
              }}
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
          </Cell>
          <HorizontalSeparatorDiv />
          <AlignCenterCell
            className='slideAnimate'
            style={{ animationDelay: '0.7s' }}
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
          </AlignCenterCell>
          {alertMessage && alertType === types.FORM_ABROADPERSON_ADD_FAILURE && (
            <AlertstripeDiv>
              <Alert
                type='client'
                fixed={false}
                message={t(alertMessage)}
                status={alertStatus as AlertStatus}
                onClose={() => dispatch(clientClear())}
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
