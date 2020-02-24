import * as formActions from 'actions/form'
import { AnnenRelatertTPSPerson } from 'components/Family/AnnenRelatertTPSPerson'
import { FamilieRelasjonUtland } from 'components/Family/FamilieRelasjonUtland'
import PersonCard from 'components/PersonCard/PersonCard'
import { State } from 'declarations/reducers'
import { FamilieRelasjon, FamilieRelasjoner, Kjoenn, Landkoder, Person } from 'declarations/types'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { vaskInputDato } from 'utils/dato'

export interface FamilySelector {
  familierelasjonKodeverk:  FamilieRelasjoner | undefined;
  kjoenn: Kjoenn | undefined;
  landkoder: Landkoder | undefined;
  personer: Person | undefined;
  tpsrelasjoner: any | undefined;
  valgteFamilieRelasjoner: any | undefined;
}

const mapState = (state: State): FamilySelector => ({
  familierelasjonKodeverk:  state.sak.familierelasjoner,
  kjoenn: state.sak.kjoenn,
  landkoder: state.sak.landkoder,
  personer: state.sak.personer,
  tpsrelasjoner: state.sak.personer.relasjoner,
  valgteFamilieRelasjoner: state.form.familierelasjoner
})

const Family: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {familierelasjonKodeverk, kjoenn, landkoder, personer, tpsrelasjoner, valgteFamilieRelasjoner }: FamilySelector = useSelector<State, FamilySelector>(mapState)
  const [viewFormRelatedUtland, setViewFormRelatedUtland] = useState<boolean>(false)
  const [viewFormRelatedTPS, setViewFormRelatedTPS] = useState<boolean>(false)
  const emptyRelation = { fnr: '', fdato: '', nasjonalitet: '', rolle: '', kjoenn: '', fornavn: '', etternavn: '' }
  const [specialRelation, setSpecialRelation] = useState<FamilieRelasjon>(emptyRelation)

  const remainingRelationsFromTPS = _.filter(tpsrelasjoner, (relasjon) => {
    const alreadyExists = _.find(valgteFamilieRelasjoner, (r: any) => r.fnr === relasjon.fnr)
    return alreadyExists !== undefined
  })

  const slettRelasjon = (p: Person) => {
    const newValgteFamilieRelasjoner = _.filter(valgteFamilieRelasjoner, (relasjon: any) => relasjon.fnr === p.fnr)
    dispatch(formActions.set('familierelasjoner', newValgteFamilieRelasjoner))
  }

  const leggTilTPSrelasjon = (relasjon: any) => {
    /* Personer fra TPS har alltid norsk nasjonalitet. Derfor default til denne. */
    const vasketRelasjon = {
      ...relasjon,
      nasjonalitet: 'NO',
    }
    const newValgteFamilieRelasjoner = valgteFamilieRelasjoner.concat(vasketRelasjon)
    dispatch(formActions.set('familierelasjoner', newValgteFamilieRelasjoner))
  }

  const toggleFormRelatedUtland = () => {
    setViewFormRelatedUtland(!viewFormRelatedUtland)
  }

  const toggleFormRelatedTPS = () => {
    setViewFormRelatedTPS(!viewFormRelatedTPS)
  }

  const oppdaterState = (felt: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSpecialRelation({
      ...specialRelation,
      [felt]: value
    })
  }

  const filtrerRoller = () => {
    const ekskluderteVerdier: any = [];
    if (!_.isEmpty(valgteFamilieRelasjoner)) {
      // Hvis ektefelle allerede er lagt til, fjern mulighet for andre typer samlivspartnere
      if (valgteFamilieRelasjoner.find((kt: any) => kt.rolle === 'EKTE')) ekskluderteVerdier.push('EKTE', 'SAMB', 'REPA');
      // Hvis registret partner allerede er lagt til, fjern mulighet for andre typer samlivspartnere
      if (valgteFamilieRelasjoner.find((kt: any) => kt.rolle === 'REPA')) ekskluderteVerdier.push('EKTE', 'SAMB', 'REPA');
      // Det skal kun være mulig å legge til en relasjon av typen annen
      if (valgteFamilieRelasjoner.find((kt: any) => kt.rolle === 'ANNEN')) ekskluderteVerdier.push('ANNEN');
    }
    return familierelasjonKodeverk!.filter(kt => ekskluderteVerdier.includes(kt.kode) === false)
  }

  const vaskInputDatoOgOppdater = (felt: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    const nyDato = vaskInputDato(value) || '';
    setSpecialRelation({
      ...specialRelation,
      [felt]: nyDato
    })
  }

  const kanSpesialRelasjonLeggesTil = () => {
    const { fnr, rolle, nasjonalitet, kjoenn, fornavn, etternavn } = specialRelation
    return (fnr && rolle && nasjonalitet && kjoenn && fornavn && etternavn)
  }

  const leggTilSpesialRelasjon = () => {
    const vasketRelasjon = {
      ...specialRelation,
      fdato: specialRelation.fdato || ''
    }
    if (kanSpesialRelasjonLeggesTil()) {
      setSpecialRelation(emptyRelation)
      const newValgteFamilieRelasjoner = valgteFamilieRelasjoner.concat(vasketRelasjon)
      dispatch(formActions.set('familierelasjoner', newValgteFamilieRelasjoner))
    }
  }

  return (
    <>
      <Ui.Nav.Systemtittel>{t('ui:label-familyRelationships')}</Ui.Nav.Systemtittel>
      <Ui.Nav.Panel border>
        <Ui.Nav.UndertekstBold>{t('ui:fom-family-description')}</Ui.Nav.UndertekstBold>
        <div className="familierelasjoner">
          {!_.isEmpty(valgteFamilieRelasjoner) ? (
            <>
              <Ui.Nav.UndertekstBold>Valgte familierelasjoner&nbsp;({valgteFamilieRelasjoner.length})</Ui.Nav.UndertekstBold>
              {valgteFamilieRelasjoner && valgteFamilieRelasjoner.map((relasjon: any, indeks: number) => (
                <PersonCard
                  key={indeks}
                  familierelasjonKodeverk={familierelasjonKodeverk!}
                  landKodeverk={landkoder!}
                  person={relasjon}
                  onRemoveClick={slettRelasjon}
                />))
              }
              </>
          ) : null}
          <div>
            <Ui.Nav.UndertekstBold>Familierelasjoner registrert i TPS</Ui.Nav.UndertekstBold>
            {remainingRelationsFromTPS.map((enkeltTPSRelasjon: any) => (
              <PersonCard
                person={enkeltTPSRelasjon}
                initialRolle={_.find(familierelasjonKodeverk, ((elem: any) => elem.kode === enkeltTPSRelasjon.kode))?.term}
                onAddClick={leggTilTPSrelasjon} />
            ))}
            {(!_.isEmpty(tpsrelasjoner) && _.isEmpty(remainingRelationsFromTPS)) ? <Ui.Nav.UndertekstBold>(Du har lagt til alle som fantes i listen.)</Ui.Nav.UndertekstBold> : null}
              {!tpsrelasjoner && <Ui.Nav.Panel>(Ingen familierelasjoner funnet i TPS)</Ui.Nav.Panel>}
          </div>
          <Ui.Nav.Row>
            <Ui.Nav.Column xs="3">
              <p><strong>Person uten fødsels- eller d-nummer&nbsp;</strong></p>
            </Ui.Nav.Column>
            <Ui.Nav.Column xs="2">
              <Ui.Nav.Knapp onClick={toggleFormRelatedUtland}>{viewFormRelatedUtland ? 'Skjul Skjema' : 'Vis skjema'}</Ui.Nav.Knapp>
            </Ui.Nav.Column>
          </Ui.Nav.Row>
          {viewFormRelatedUtland ? (
            <FamilieRelasjonUtland
              spesialRelasjon={specialRelation}
              oppdaterState={oppdaterState}
              kjoennKodeverk={kjoenn}
              landKodeverk={landkoder}
              filtrerteFamilieRelasjoner={filtrerRoller}
              leggTilSpesialRelasjon={leggTilSpesialRelasjon}
              vaskInputDatoOgOppdater={vaskInputDatoOgOppdater}
              kanSpesialRelasjonLeggesTil={kanSpesialRelasjonLeggesTil}
            />
          ) : null}
          <Ui.Nav.Row>
            <br />
          </Ui.Nav.Row>
          <Ui.Nav.Row>
            <Ui.Nav.Column xs="3">
              <p><strong>Person uten registrert relasjon i TPS&nbsp;</strong></p>
            </Ui.Nav.Column>
            <Ui.Nav.Column xs="2">
              <Ui.Nav.Knapp onClick={toggleFormRelatedTPS} >{viewFormRelatedTPS ? 'Skjul Skjema' : 'Vis skjema'}</Ui.Nav.Knapp>
            </Ui.Nav.Column>
          </Ui.Nav.Row>
          {viewFormRelatedTPS ? (
            <AnnenRelatertTPSPerson
              valgteRelasjoner={valgteFamilieRelasjoner}
              tpsrelasjoner={tpsrelasjoner}
              leggTilTPSrelasjon={leggTilTPSrelasjon}
              filtrerteFamilieRelasjoner={filtrerRoller}
              valgtBrukerFnr={personer!.fnr}
            />
          ) : null}
        </div>
      </Ui.Nav.Panel>
    </>
  )
}

export default Family
