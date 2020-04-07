import { clientClear } from 'actions/alert'
import * as formActions from 'actions/form'
import * as sakActions from 'actions/sak'
import classNames from 'classnames'
import PersonCard from 'components/PersonCard/PersonCard'
import * as types from 'constants/actionTypes'
import { State } from 'declarations/reducers'
import { FamilieRelasjon, Kodeverk, Person } from 'declarations/types'
import { KodeverkPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import './TPSPersonForm.css'

const mapState = (state: State): TPSPersonFormSelector => ({
  alertStatus: state.alert.clientErrorStatus,
  alertMessage: state.alert.clientErrorMessage,
  alertType: state.alert.type,
  personRelatert: state.sak.personRelatert,
  person: state.sak.person
})

export interface TPSPersonFormSelector {
  alertStatus: string | undefined;
  alertMessage: string | undefined;
  alertType: string | undefined;
  personRelatert: Person | undefined;
  person: Person;
}

export interface TPSPersonFormProps {
  className ?: string;
  rolleList: Array<Kodeverk>;
}

const TPSPersonForm: React.FC<TPSPersonFormProps> = ({
  className, rolleList
}: TPSPersonFormProps): JSX.Element => {
  const [sok, setSok] = useState('')
  const [_personRelatert, setPersonRelatert] = useState<FamilieRelasjon | undefined>(undefined)
  const [tpsperson, setTpsPerson] = useState<FamilieRelasjon | undefined>(undefined)

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { alertStatus, alertMessage, alertType, personRelatert, person }: TPSPersonFormSelector = useSelector<State, TPSPersonFormSelector>(mapState)

  const sokEtterFnr = () => {
    dispatch(sakActions.resetPersonRelatert())
    setPersonRelatert(undefined)
    setTpsPerson(undefined)
    dispatch(sakActions.getPersonRelated(sok))
  }

  useEffect(() => {
    if (personRelatert && !_personRelatert) {
      // Fjern relasjoner array, NOTE! det er kun relasjoner som har rolle.
      const person = (_.omit(personRelatert, 'relasjoner'))
      const tpsperson = personRelatert && personRelatert.relasjoner
        ? personRelatert.relasjoner.find((elem: FamilieRelasjon) => elem.fnr === person.fnr)
        : undefined
      setTpsPerson(tpsperson)
      if (!tpsperson) {
        setPersonRelatert(person)
      } else {
        dispatch(sakActions.resetPersonRelatert())
        setPersonRelatert(undefined)
      }
    }
  }, [personRelatert, _personRelatert, dispatch])

  const updateSok = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSok(e.target.value)
  }

  const leggTilPersonOgRolle = (person: FamilieRelasjon) => {
    setSok('')
    setPersonRelatert(undefined)
    setTpsPerson(undefined)

    dispatch(sakActions.resetPersonRelatert())
    /* Person fra TPS har alltid norsk nasjonalitet. Derfor default til denne. */

    dispatch(formActions.addFamilierelasjoner({
      ...person,
      nasjonalitet: 'NO'
    }))
  }

  return (
    <div className='col-xs-12'>
      <div className={classNames(className, 'c-TPSPersonForm', 'slideAnimate', { feil: !!alertMessage })}>
        <div className='w-50 mr-3'>
          <Ui.Nav.Input
            id='c-TPSPersonForm__input-fnr-or-dnr-id'
            label={t('ui:label-fnr-or-dnr')}
            placeholder={t('ui:label-fnr-or-dnr')}
            value={sok}
            onChange={updateSok}
          />
        </div>
        <div className='w-50'>
          <Ui.Nav.Knapp
            disabled={person.fnr === sok}
            className='annenpersonsok__knapp'
            onClick={sokEtterFnr}
          >
            {t('ui:form-search')}
          </Ui.Nav.Knapp>
        </div>
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
      {alertMessage && alertType === types.SAK_PERSON_RELATERT_GET_FAILURE && (
        <div className='col-xs-12'>
          <Ui.Alert
            className='mt-4 mb-4 w-50'
            type='client'
            fixed={false}
            message={t(alertMessage)}
            status={alertStatus}
            onClose={() => dispatch(clientClear())}
          />
        </div>
      )}
      {_personRelatert ? (
        <div className='col-xs-12'>
          <PersonCard
            person={_personRelatert}
            onAddClick={leggTilPersonOgRolle}
            rolleList={rolleList}
          />
        </div>
      ) : null}
    </div>
  )
}

TPSPersonForm.propTypes = {
  className: PT.string,
  rolleList: PT.arrayOf(KodeverkPropType.isRequired).isRequired
}

export default TPSPersonForm
