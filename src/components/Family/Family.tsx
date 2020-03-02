import * as formActions from 'actions/form'
import TPSPersonForm from 'components/Family/TPSPersonForm'
import AbroadPersonForm from 'components/Family/AbroadPersonForm'
import PersonCard from 'components/PersonCard/PersonCard'
import { State } from 'declarations/reducers'
import { FamilieRelasjon, Kodeverk, Person } from 'declarations/types'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

export interface FamilySelector {
  familierelasjonKodeverk: Array<Kodeverk> | undefined;
  person: Person | undefined;
  valgteFamilieRelasjoner: Array<FamilieRelasjon> | undefined;
}

const mapState = (state: State): FamilySelector => ({
  familierelasjonKodeverk: state.sak.familierelasjoner,
  person: state.sak.person,
  valgteFamilieRelasjoner: state.form.familierelasjoner
})

const Family: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { familierelasjonKodeverk, person, valgteFamilieRelasjoner }: FamilySelector = useSelector<State, FamilySelector>(mapState)
  const [viewFormRelatedUtland, setViewFormRelatedUtland] = useState<boolean>(false)
  const [viewFormRelatedTPS, setViewFormRelatedTPS] = useState<boolean>(false)

  const remainingRelationsFromTPS: Array<FamilieRelasjon> = _.filter(person!.relasjoner, (relation: FamilieRelasjon) => (
    _.find(valgteFamilieRelasjoner, (valgteRelasjon: FamilieRelasjon) => (
      valgteRelasjon.fnr === relation.fnr
    )) === undefined
  ))

  const deleteRelation = (relation: FamilieRelasjon): void => {
    dispatch(formActions.removeFamilierelasjoner(relation))
  }

  const addTpsRelation = (relation: FamilieRelasjon): void => {
    /* Person fra TPS har alltid norsk nasjonalitet. Derfor default til denne. */
    dispatch(formActions.addFamilierelasjoner({
      ...relation,
      nasjonalitet: 'NO'
    }))
  }

  const toggleFormRelatedUtland = (): void => {
    setViewFormRelatedUtland(!viewFormRelatedUtland)
  }

  const toggleFormRelatedTPS = (): void => {
    setViewFormRelatedTPS(!viewFormRelatedTPS)
  }

  const ekskluderteVerdier: Array<string> = []
  if (!_.isEmpty(valgteFamilieRelasjoner)) {
    // Hvis ektefelle allerede er lagt til, fjern mulighet for andre typer samlivspartnere
    if (valgteFamilieRelasjoner?.find((relation: FamilieRelasjon) => relation.rolle === 'EKTE')) ekskluderteVerdier.push('EKTE', 'SAMB', 'REPA')
    // Hvis registret partner allerede er lagt til, fjern mulighet for andre typer samlivspartnere
    if (valgteFamilieRelasjoner?.find((relation: FamilieRelasjon) => relation.rolle === 'REPA')) ekskluderteVerdier.push('EKTE', 'SAMB', 'REPA')
    // Det skal kun være mulig å legge til en relasjon av typen annen
    if (valgteFamilieRelasjoner?.find((relation: FamilieRelasjon) => relation.rolle === 'ANNEN')) ekskluderteVerdier.push('ANNEN')
  }

  const rolleList: Array<Kodeverk> = familierelasjonKodeverk!.filter((kt: Kodeverk) => ekskluderteVerdier.includes(kt.kode) === false)

  return (
    <>
      <Ui.Nav.Systemtittel className='mb-4'>{t('ui:label-familyRelationships')}</Ui.Nav.Systemtittel>
      <Ui.Nav.Panel border>
        <Ui.Nav.Undertittel className='mb-4 ml-2'>{t('ui:form-family-description')}</Ui.Nav.Undertittel>
        <Ui.Nav.Row>
          <div className='col-xs-6'>
            <Ui.Nav.Ingress className='ml-2'>{t('ui:form-family-relations-in-tps')}</Ui.Nav.Ingress>
            {remainingRelationsFromTPS.map((relation: FamilieRelasjon) => (
              <PersonCard
                className='slideAnimate personNotSelected m-2'
                key={relation.fnr}
                person={relation}
                familierelasjonKodeverk={familierelasjonKodeverk}
                onAddClick={addTpsRelation}
              />
            ))}
            {(!_.isEmpty(person!.relasjoner) && _.isEmpty(remainingRelationsFromTPS)) ? (
              <Ui.Nav.UndertekstBold className='ml-2 mt-4'>({t('ui:form-family-added-all')})</Ui.Nav.UndertekstBold>
            ) : null}
            {_.isEmpty(person!.relasjoner) ? (
              <Ui.Nav.UndertekstBold className='ml-2 mt-4'>({t('ui:form-family-none-in-tps')})</Ui.Nav.UndertekstBold>
            ) : null}
          </div>
          <div style={{
            borderLeft: '1px solid lightgrey',
            marginLeft: '-1px'
          }}
          />
          <div className='col-xs-6'>
            <Ui.Nav.Ingress className='ml-2'>
              {t('ui:form-family-chosen')}&nbsp;({valgteFamilieRelasjoner ? valgteFamilieRelasjoner.length : 0})
            </Ui.Nav.Ingress>
            {valgteFamilieRelasjoner ? valgteFamilieRelasjoner.map((relation: FamilieRelasjon) => (
              <PersonCard
                className='slideAnimate personSelected m-2'
                key={relation.fnr}
                familierelasjonKodeverk={familierelasjonKodeverk}
                person={relation}
                onRemoveClick={deleteRelation}
              />)) : null}
          </div>
        </Ui.Nav.Row>
        <Ui.Nav.Row>
          <div className='col-xs-12 mt-4'>
            <div>
              <Ui.Nav.Ingress className='ml-2'>{t('ui:form-family-utland-title')}</Ui.Nav.Ingress>
              {viewFormRelatedUtland ? (
                <AbroadPersonForm
                  className='m-2'
                  rolleList={rolleList}
                />
              ) : null}
              <Ui.Nav.Knapp className='m-2' onClick={toggleFormRelatedUtland}>
                {viewFormRelatedUtland ? t('ui:label-hide-form') : t('ui:label-show-form')}
              </Ui.Nav.Knapp>
            </div>

          </div>
        </Ui.Nav.Row>
        <Ui.Nav.Row>
          <div className='col-xs-12 mt-4'>
            <div>
              <Ui.Nav.Ingress className='ml-2'>{t('ui:form-family-tps-title')}</Ui.Nav.Ingress>
              {viewFormRelatedTPS ? (
                <TPSPersonForm
                  className='m-2'
                  rolleList={rolleList}
                />
              ) : null}
              <Ui.Nav.Knapp className='m-2' onClick={toggleFormRelatedTPS}>
                {viewFormRelatedTPS ? t('ui:label-hide-form') : t('ui:label-show-form')}
              </Ui.Nav.Knapp>
            </div>
          </div>
        </Ui.Nav.Row>
      </Ui.Nav.Panel>
    </>
  )
}

export default Family
