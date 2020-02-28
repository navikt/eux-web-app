import * as formActions from 'actions/form'
import * as sakActions from 'actions/sak'
import classNames from 'classnames'
import PersonCard from 'components/PersonCard/PersonCard'
import { State } from 'declarations/reducers'
import { FamilieRelasjon, Kodeverk, Person } from 'declarations/types'
import { KodeverkPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import 'components/Family/TPSPersonForm.css'

const mapState = (state: State): AnnenRelatertTPSPersonSelector => ({
  personRelatert: state.sak.personRelatert,
  person: state.sak.person
})

export interface AnnenRelatertTPSPersonSelector {
   personRelatert: Person | undefined;
   person: Person;
}

export interface AnnenRelatertTPSPersonProps {
  className ?: string;
  rolleList: Array<Kodeverk>;
}

const TPSPersonForm: React.FC<AnnenRelatertTPSPersonProps> = ({
  className, rolleList
}: AnnenRelatertTPSPersonProps): JSX.Element => {
  const [sok, setSok] = useState('')
  const [_personRelatert, setPersonRelatert] = useState<FamilieRelasjon | undefined>(undefined)
  const [tpsperson, setTpsPerson] = useState<FamilieRelasjon | undefined>(undefined)
  const [knappDisabled, setKnappDisabled] = useState(false)

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { personRelatert, person }: AnnenRelatertTPSPersonSelector = useSelector<State, AnnenRelatertTPSPersonSelector>(mapState)

  const sokEtterFnr = () => {
    dispatch(sakActions.getPersonRelated(sok))
  }

  useEffect(() => {
    if (personRelatert && _personRelatert) {
      // Fjern relasjoner array, NOTE! det er kun relasjoner som har rolle.
      const person = (_.omit(personRelatert, 'relasjoner'))
      const tpsperson = personRelatert && personRelatert.relasjoner ? personRelatert.relasjoner.find((elem: any) => elem.fnr === person.fnr) : undefined
      if (!tpsperson) {
        setPersonRelatert(person)
        setTpsPerson(undefined)
      } else {
        setTpsPerson(tpsperson)
        setSok('')
        setPersonRelatert(undefined)
        setKnappDisabled(true)
      }
    }
  }, [personRelatert, _personRelatert])

  const updateSok = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSok(e.target.value)
  }

  const leggTilPersonOgRolle = (person: FamilieRelasjon) => {
    setSok('')
    setPersonRelatert(undefined)
    setTpsPerson(undefined)
    setKnappDisabled(true)

    /* Person fra TPS har alltid norsk nasjonalitet. Derfor default til denne. */
    const vasketPerson = {
      ...person,
      nasjonalitet: 'NO'
    }
    dispatch(formActions.addFamilierelasjoner(vasketPerson))
  }

  return (
    <div className={classNames(className, 'annenpersonsok')}>
      <Ui.Nav.Row className='annenpersonsok__skjema'>
        <div className='col-xs-6'>
          <Ui.Nav.Input
            label={t('ui:label-fnr-or-dnr')}
            placeholder={t('ui:label-fnr-or-dnr')}
            value={sok}
            onChange={updateSok}
          />
        </div>
        <div className='col-xs-6'>
          <Ui.Nav.Knapp
            disabled={person.fnr === sok}
            className='annenpersonsok__knapp'
            onClick={sokEtterFnr}
          >
            {t('ui:form-search')}
          </Ui.Nav.Knapp>
        </div>
        {(person.fnr === sok) ? (
          <div className='col-xs-12'>
            <Ui.Nav.AlertStripe className='w-50 mt-4 mb-4' type='advarsel'>
              {t('ui:error-fnr-is-user', { sok: sok })}
            </Ui.Nav.AlertStripe>
          </div>
        ) : null}
        {tpsperson ? (
          <div className='col-xs-12'>
            <Ui.Nav.AlertStripe className='mt-4 mb-4' type='advarsel'>
              {t('ui:error-relation-already-in-tps')}
            </Ui.Nav.AlertStripe>
          </div>
        ) : null}
        {personRelatert ? (
          <div className='col-xs-12'>
            <PersonCard
              person={personRelatert}
              onAddClick={!knappDisabled ? leggTilPersonOgRolle : undefined}
              rolleList={rolleList}
            />
          </div>
        ) : null}
      </Ui.Nav.Row>
    </div>
  )
}

TPSPersonForm.propTypes = {
  className: PT.string,
  rolleList: PT.arrayOf(KodeverkPropType.isRequired).isRequired
}

export default TPSPersonForm
