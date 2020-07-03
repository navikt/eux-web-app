import { clientClear } from 'actions/alert'
import * as formActions from 'actions/form'
import Tilsette from 'assets/icons/Tilsette'
import Alert, { AlertStatus } from 'components/Alert/Alert'
import { HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'components/StyledComponents'
import * as types from 'constants/actionTypes'
import { State } from 'declarations/reducers'
import { FamilieRelasjon, Kodeverk } from 'declarations/types'
import { KodeverkPropType } from 'declarations/types.pt'
import { CountryFilter } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Knapp } from 'nav-frontend-knapper'
import Panel from 'nav-frontend-paneler'
import { Input, Select } from 'nav-frontend-skjema'
import { Normaltekst } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { vaskInputDato } from 'utils/dato'

const mapState = (state: State): AbroadPersonFormSelector => ({
  alertStatus: state.alert.clientErrorStatus,
  alertMessage: state.alert.clientErrorMessage,
  alertType: state.alert.type,
  kjoenn: state.sak.kjoenn,
  landkoder: state.sak.landkoder
})

export interface AbroadPersonFormSelector {
  alertStatus: string | undefined
  alertMessage: string | undefined
  alertType: string | undefined
  kjoenn: Array<Kodeverk> | undefined
  landkoder: Array<Kodeverk> | undefined
}

export interface AbroadPersonFormProps {
  className?: string,
  rolleList: Array<Kodeverk>,
  existingFamilyRelationships: Array<FamilieRelasjon>
}

const Container = styled.div`
  margin-top: 1,5rem;
`
const Row = styled.div`
  display: flex;
`
const Cell = styled.div`
  flex: 1;
`
const AlignEndDiv = styled.div`
 display: flex;
 align-items: flex-end;
`
const AlertstripeDiv = styled.div`
  margin: 0.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  width: 50%;
`
const emptyRelation = { fnr: '', fdato: '', land: null, statsborgerskap: null, rolle: '', kjoenn: '', fornavn: '', etternavn: '' }

const AbroadPersonForm: React.FC<AbroadPersonFormProps> = ({
  rolleList, existingFamilyRelationships
}: AbroadPersonFormProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { alertType, alertMessage, alertStatus, kjoenn, landkoder }: AbroadPersonFormSelector = useSelector<State, AbroadPersonFormSelector>(mapState)
  const [relation, setRelation] = useState<FamilieRelasjon>(emptyRelation)

  const updateCountry = (felt: string, value: string): void => {
    setRelation({
      ...relation,
      [felt]: value
    })
  }

  const updateRelation = (felt: string, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const value = event.currentTarget.value
    setRelation({
      ...relation,
      [felt]: value || ''
    })
  }

  const updateDate = (felt: string, event: React.ChangeEvent<HTMLInputElement>): void => {
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
    const { fnr, rolle, land, statsborgerskap, kjoenn, fornavn, etternavn, fdato } = relation
    return !_.isEmpty(fnr) && !_.isEmpty(rolle) && !_.isEmpty(land) && !_.isEmpty(statsborgerskap) &&
      !_.isEmpty(kjoenn) && !_.isEmpty(fornavn) && !_.isEmpty(etternavn) && !_.isEmpty(fdato) && fdato?.match(/\d{2}\.\d{2}\.\d{4}/) !== null
  }

  const conflictingPerson = (): boolean => {
    const { fnr } = relation
    if (_.find(existingFamilyRelationships, f => f.fnr === fnr) !== undefined) {
      dispatch({
        type: types.FORM_ABROADPERSON_ADD_FAILURE
      })
      return true
    }
    return false
  }

  const addRelation = (): void => {
    if (canAddRelation() && !conflictingPerson()) {
      setRelation(emptyRelation)
      dispatch(formActions.addFamilierelasjoner(trimFamilyRelation(relation)))
      dispatch({
        type: types.FORM_ABROADPERSON_ADD_SUCCESS
      })
    }
  }

  return (
    <Container>
      <Normaltekst>
        {t('ui:form-family-utland-add-form-title')}
      </Normaltekst>
      <VerticalSeparatorDiv />
      <Panel data-testid='familierelasjoner__utland__wrapper'>
        <Row>
          <Cell className='slideAnimate'>
            <Input
              data-testid='familierelasjoner__input-fnr-id'
              label={t('ui:label-abroad-id')}
              value={relation.fnr}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRelation('fnr', e)}
            />
            <VerticalSeparatorDiv />
          </Cell>
          <Cell className='slideAnimate' style={{ animationDelay: '0.1s' }}>
            <CountrySelect
              label={t('ui:label-landkode')}
              data-testid='familierelasjoner__input-land'
              placeholder={t('ui:form-choose')}
              menuPortalTarget={document.body}
              value={relation.land}
              includeList={landkoder ? landkoder.map((l: Kodeverk) => l.kode) : []}
              onOptionSelected={(e: any) => updateCountry('land', e.value)}
            />
            <VerticalSeparatorDiv />
          </Cell>
          <Cell className='slideAnimate' style={{ animationDelay: '0.1s' }}>
            <CountrySelect
              label={t('ui:label-statsborgerskap')}
              data-testid='familierelasjoner__input-statsborgerskap'
              placeholder={t('ui:form-choose')}
              menuPortalTarget={document.body}
              value={relation.statsborgerskap}
              includeList={CountryFilter.STANDARD}
              onOptionSelected={(e: any) => updateCountry('statsborgerskap', e.value)}
            />
            <VerticalSeparatorDiv />
          </Cell>
        </Row>
        <Row>
          <Cell className='slideAnimate' style={{ animationDelay: '0.2s' }}>
            <Input
              label={t('ui:label-firstname')}
              data-testid='familierelasjoner__input-fornavn'
              value={relation.fornavn}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRelation('fornavn', e)}
            />
            <VerticalSeparatorDiv />
          </Cell>
          <Cell className='slideAnimate' style={{ animationDelay: '0.3s' }}>
            <Input
              label={t('ui:label-lastname')}
              data-testid='familierelasjoner__input-etternavn'
              value={relation.etternavn}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRelation('etternavn', e)}
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
              value={relation.kjoenn}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateRelation('kjoenn', e)}
            >
              <option value='' disabled>{t('ui:form-choose')}</option>
              {kjoenn && kjoenn.map((element: Kodeverk) => (
                <option value={element.kode} key={element.kode}>{element.term}</option>)
              )}
            </Select>
            <VerticalSeparatorDiv />
          </Cell>
          <Cell className='slideAnimate' style={{ animationDelay: '0.5s' }}>
            <Input
              label={t('ui:form-birthdate')}
              data-testid='familierelasjoner__input-fdato'
              value={relation.fdato}
              placeholder='DD.MM.ÅÅÅÅ'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRelation('fdato', e)}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => updateDate('fdato', e)}
            />
            <VerticalSeparatorDiv />
          </Cell>
          <Cell className='slideAnimate' style={{ animationDelay: '0.6s' }}>
            <Select
              label={t('ui:label-familyRelationship')}
              data-testid='familierelasjoner__input-familierelasjon'
              value={relation.rolle}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateRelation('rolle', e)}
            >
              <option value='' disabled>{t('ui:form-choose')}</option>
              {rolleList.map((element: Kodeverk) => (
                <option value={element.kode} key={element.kode}>{element.term}</option>)
              )}
            </Select>
            <VerticalSeparatorDiv />
          </Cell>
        </Row>
        <Row>
          <Cell className='slideAnimate' style={{ animationDelay: '0.7s' }}>
            <AlignEndDiv>
              <Knapp
                onClick={addRelation}
                disabled={!canAddRelation()}
                className='relasjon familierelasjoner__knapp'
              >
                <Tilsette width='20' height='20' color={!canAddRelation() ? 'white' : '#0067C5'} />
                <HorizontalSeparatorDiv />
                <span>
                  {t('ui:form-add')}
                </span>
              </Knapp>
            </AlignEndDiv>
          </Cell>
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
