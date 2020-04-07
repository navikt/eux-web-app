import { clientClear } from 'actions/alert'
import * as formActions from 'actions/form'
import classNames from 'classnames'
import * as types from 'constants/actionTypes'
import { State } from 'declarations/reducers'
import { FamilieRelasjon, Kodeverk } from 'declarations/types'
import { KodeverkPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { vaskInputDato } from 'utils/dato'
import _ from 'lodash'

const mapState = (state: State): AbroadPersonFormSelector => ({
  alertStatus: state.alert.clientErrorStatus,
  alertMessage: state.alert.clientErrorMessage,
  alertType: state.alert.type,
  kjoenn: state.sak.kjoenn,
  landkoder: state.sak.landkoder
})

export interface AbroadPersonFormSelector {
  alertStatus: string | undefined;
  alertMessage: string | undefined;
  alertType: string | undefined;
  kjoenn: Array<Kodeverk> | undefined;
  landkoder: Array<Kodeverk> | undefined;
}

export interface AbroadPersonFormProps {
  className?: string,
  rolleList: Array<Kodeverk>,
  existingFamilyRelationships: Array<FamilieRelasjon>
}

const emptyRelation = { fnr: '', fdato: '', land: '', statsborgerskap: '', rolle: '', kjoenn: '', fornavn: '', etternavn: '' }

const AbroadPersonForm: React.FC<AbroadPersonFormProps> = ({
  className, rolleList, existingFamilyRelationships
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
      [felt]: value
    })
  }

  const updateDate = (felt: string, event: React.ChangeEvent<HTMLInputElement>): void => {
    const nyDato = vaskInputDato(event.currentTarget.value) || ''
    setRelation({
      ...relation,
      [felt]: nyDato
    })
  }

  const canAddRelation = (): boolean => {
    const { fnr, rolle, land, statsborgerskap, kjoenn, fornavn, etternavn } = relation
    return !_.isEmpty(fnr) && !_.isEmpty(rolle) && !_.isEmpty(land) && !_.isEmpty(statsborgerskap) && !_.isEmpty(kjoenn) && !_.isEmpty(fornavn) && !_.isEmpty(etternavn)
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
      dispatch(formActions.addFamilierelasjoner({
        ...relation,
        fdato: relation.fdato || ''
      }))
      dispatch({
        type: types.FORM_ABROADPERSON_ADD_SUCCESS
      })
    }
  }

  return (
    <div className={classNames(className, 'c-abroadPersonForm', 'mt-4')}>
      <Ui.Nav.Normaltekst>{t('ui:form-family-utland-add-form-title')}</Ui.Nav.Normaltekst>
      <Ui.Nav.Panel border className='mt-4 familierelasjoner__utland__wrapper'>
        <Ui.Nav.Row>
          <div className='col-xs-4'>
            <div className='slideAnimate mb-3'>
              <Ui.Nav.Input
                id='familierelasjoner__input-fnr-id'
                label={t('ui:label-abroad-id')}
                className='familierelasjoner__input'
                value={relation.fnr}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRelation('fnr', e)}
              />
            </div>
          </div>
          <div className='col-xs-4'>
            <div className='slideAnimate mb-3' style={{ animationDelay: '0.1s' }}>
              <Ui.CountrySelect
                id='id-land'
                label={t('ui:label-landkode')}
                className='familierelasjoner__input'
                menuPortalTarget={document.body}
                value={relation.land}
                includeList={landkoder ? landkoder.map((l: Kodeverk) => l.kode) : []}
                onOptionSelected={(e: any) => updateCountry('land', e.value)}
              />
            </div>
          </div>
          <div className='col-xs-4'>
            <div className='slideAnimate mb-3' style={{ animationDelay: '0.1s' }}>
              <Ui.CountrySelect
                id='id-statsborgerskap'
                label={t('ui:label-statsborgerskap')}
                className='familierelasjoner__input'
                menuPortalTarget={document.body}
                value={relation.statsborgerskap}
                onOptionSelected={(e: any) => updateCountry('statsborgerskap', e.value)}
              />
            </div>
          </div>
          <div className='col-xs-6'>
            <div className='slideAnimate mb-3' style={{ animationDelay: '0.2s' }}>
              <Ui.Nav.Input
                id='familierelasjoner__input-fornavn-id'
                label={t('ui:label-firstname')}
                className='familierelasjoner__input'
                value={relation.fornavn}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRelation('fornavn', e)}
              />
            </div>
          </div>
          <div className='col-xs-6'>
            <div className='slideAnimate mb-3' style={{ animationDelay: '0.3s' }}>
              <Ui.Nav.Input
                id='familierelasjoner__input-etternavn-id'
                label={t('ui:label-lastname')}
                className='familierelasjoner__input'
                value={relation.etternavn}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRelation('etternavn', e)}
              />
            </div>
          </div>
          <div className='col-xs-6'>
            <div className='slideAnimate mb-3' style={{ animationDelay: '0.4s' }}>
              <Ui.Nav.Select
                id='id-kjoenn'
                label={t('ui:label-gender')}
                className='familierelasjoner__input'
                value={relation.kjoenn}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateRelation('kjoenn', e)}
              >
                <option value='' disabled>{t('ui:form-choose')}</option>
                {kjoenn ? kjoenn.map((element: Kodeverk) => (
                  <option value={element.kode} key={element.kode}>{element.term}</option>)
                ) : null}
              </Ui.Nav.Select>
            </div>
          </div>
          <div className='col-xs-6'>
            <div className='slideAnimate mb-3' style={{ animationDelay: '0.5s' }}>
              <Ui.Nav.Input
                id='familierelasjoner__input-fdato-id'
                label={t('ui:form-birthdate')}
                className='familierelasjoner__input'
                value={relation.fdato}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRelation('fdato', e)}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => updateDate('fdato', e)}
              />
            </div>
          </div>
          <div className='col-xs-6'>
            <div className='slideAnimate mb-3' style={{ animationDelay: '0.6s' }}>
              <Ui.Nav.Select
                id='id-familierelasjon'
                label={t('ui:label-familyRelationship')}
                className='familierelasjoner__input'
                value={relation.rolle}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateRelation('rolle', e)}
              >
                <option value='' disabled>{t('ui:form-choose')}</option>
                {rolleList.map((element: Kodeverk) => (
                  <option value={element.kode} key={element.kode}>{element.term}</option>)
                )}
              </Ui.Nav.Select>
            </div>
          </div>
          <div className='col-xs-6 d-flex' style={{ alignItems: 'flex-end' }}>
            <div className='slideAnimate mb-3' style={{ animationDelay: '0.7s' }}>
              <Ui.Nav.Knapp
                onClick={addRelation}
                disabled={!canAddRelation()}
                className='relasjon familierelasjoner__knapp'
              >
                <Ui.Icons kind='tilsette' size='20' color={!canAddRelation() ? 'white' : '#0067C5'} className='familierelasjoner__knapp__ikon mr-3' />
                <div className='familierelasjoner__knapp__label'>
                  {t('ui:form-add')}
                </div>
              </Ui.Nav.Knapp>
            </div>
          </div>
          {alertMessage && alertType === types.FORM_ABROADPERSON_ADD_FAILURE && (
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
        </Ui.Nav.Row>
      </Ui.Nav.Panel>
    </div>
  )
}

AbroadPersonForm.propTypes = {
  className: PT.string,
  rolleList: PT.arrayOf(KodeverkPropType.isRequired).isRequired
}

export default AbroadPersonForm
