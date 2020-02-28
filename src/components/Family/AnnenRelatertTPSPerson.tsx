import * as sakActions from 'actions/sak'
import classNames from 'classnames'
import PersonCard from 'components/PersonCard/PersonCard'
import { State } from 'declarations/reducers'
import { FamilieRelasjon } from 'declarations/types'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import './AnnenRelatertTPSPerson.css'

const mapState = (state: State): AnnenRelatertTPSPersonSelector => ({
  personRelatert: state.sak.personerRelatert
})

export interface AnnenRelatertTPSPersonSelector {
   personRelatert: any;
}

export interface AnnenRelatertTPSPersonProps {
  className ?: string;
  valgteRelasjoner: any;
  tpsrelasjoner: any;
  leggTilTPSrelasjon: (personer: any) => void;
  filtrerteFamilieRelasjoner: any;
  valgtBrukerFnr: any;
}

const AnnenRelatertTPSPerson: React.FC<AnnenRelatertTPSPersonProps> = ({
  className,
  valgteRelasjoner, tpsrelasjoner, leggTilTPSrelasjon, filtrerteFamilieRelasjoner, valgtBrukerFnr
}: AnnenRelatertTPSPersonProps): JSX.Element => {
  const [sok, setSok] = useState('')
  const [_personRelatert, setPersonRelatert] = useState<FamilieRelasjon | undefined>(undefined)
  const [tpsperson, setTpsPerson] = useState(undefined)
  const [rolle, setRolle] = useState('')
  const [knappDisabled, setKnappDisabled] = useState(false)

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { personRelatert }: AnnenRelatertTPSPersonSelector = useSelector<State, AnnenRelatertTPSPersonSelector>(mapState)

  const sokEtterFnr = () => {
    dispatch(sakActions.getPersonerRelated(sok))
  }

  useEffect(() => {
    if (personRelatert && _personRelatert) {
      // Fjern relasjoner array, NOTE! det er kun relasjoner som har rolle.
      const person = (_.omit(personRelatert, 'relasjoner'))
      const tpsperson = tpsrelasjoner.find((elem: any) => elem.fnr === person.fnr)
      if (!tpsperson) {
        setPersonRelatert(person)
        setTpsPerson(undefined)
      } else {
        setTpsPerson(tpsperson)
        setSok('')
        setPersonRelatert(undefined)
        setRolle('')
        setKnappDisabled(true)
      }
    }
  }, [])

  const updateSok = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSok(e.target.value)
  }

  const leggTilPersonOgRolle = () => {
    const person = {
      ...personRelatert,
      rolle: rolle
    }
    setSok('')
    setPersonRelatert(undefined)
    setTpsPerson(undefined)
    setRolle('')
    setKnappDisabled(true)

    leggTilTPSrelasjon(person)
  }

  const oppdaterFamilierelajon = (rolle: any) => {
    setPersonRelatert({
      ...personRelatert,
      rolle: rolle
    })
    setKnappDisabled(false)
    setRolle(rolle)
  }

  /**
   * Returnerer JSX-elementer med informasjon og feilmeldinger basert på ymse kriterie
   */
  const feilmeldingerOgInformasjon = (valgtBrukerFnr: any, tpsperson: any, sok: any) => {
    if (valgtBrukerFnr === sok) {
      return (
        <Ui.Nav.Column xs='3'>
          <Ui.Nav.AlertStripe type='info'>FNR {sok} tilhører bruker</Ui.Nav.AlertStripe>
        </Ui.Nav.Column>
      )
    } else if (tpsperson) {
      return (
        <Ui.Nav.Column xs='3'>
          <Ui.Nav.AlertStripe type='info'>Familierelasjonen er allerede registrert i TPS</Ui.Nav.AlertStripe>
        </Ui.Nav.Column>
      )
    }
    return null
  }

  return (
    <div className={classNames(className, 'annenpersonsok')}>
      <div className='annenpersonsok__skjema'>
        <Ui.Nav.Input
          label=''
          placeholder={t('ui:label-fnr-or-dnr')}
          value={sok}
          onChange={updateSok}
        />
        <Ui.Nav.Knapp
          disabled={valgtBrukerFnr === sok}
          className='annenpersonsok__knapp'
          onClick={sokEtterFnr}
        >
          {t('ui:form-search')}
        </Ui.Nav.Knapp>
      </div>
      {feilmeldingerOgInformasjon(valgtBrukerFnr, tpsperson, sok)}
      {personRelatert ? (
        <PersonCard
          person={personRelatert}
          initialRolle={rolle}
          onAddClick={!knappDisabled ? leggTilPersonOgRolle : undefined}
          familierelasjonKodeverk={filtrerteFamilieRelasjoner()}
          oppdaterFamilierelajon={oppdaterFamilierelajon}
        />
      ) : null}
    </div>
  )
}

AnnenRelatertTPSPerson.propTypes = {
  tpsrelasjoner: PT.any.isRequired,
  filtrerteFamilieRelasjoner: PT.func.isRequired,
  leggTilTPSrelasjon: PT.func.isRequired,
  valgtBrukerFnr: PT.string.isRequired
}

export default AnnenRelatertTPSPerson
