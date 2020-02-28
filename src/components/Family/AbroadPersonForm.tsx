import * as formActions from 'actions/form'
import classNames from 'classnames'
import { State } from 'declarations/reducers'
import { FamilieRelasjon, Kodeverk } from 'declarations/types'
import { KodeverkPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { vaskInputDato } from 'utils/dato'
import './AbroadPersonForm.css'

const mapState = (state: State): AbroadPersonFormSelector => ({
  kjoenn: state.sak.kjoenn,
  landkoder: state.sak.landkoder
})

export interface AbroadPersonFormSelector {
  kjoenn: Array<Kodeverk> | undefined;
  landkoder: Array<Kodeverk> | undefined;
}

export interface AbroadPersonFormProps {
  className?: string,
  rolleList: Array<Kodeverk>
}

const emptyRelation = { fnr: '', fdato: '', nasjonalitet: '', rolle: '', kjoenn: '', fornavn: '', etternavn: '' }

const AbroadPersonForm: React.FC<AbroadPersonFormProps> = ({
  className, rolleList
}: AbroadPersonFormProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { kjoenn, landkoder }: AbroadPersonFormSelector = useSelector<State, AbroadPersonFormSelector>(mapState)
  const [relation, setRelation] = useState<FamilieRelasjon>(emptyRelation)

  const updateCountry = (felt: string, value: string) => {
    setRelation({
      ...relation,
      [felt]: value
    })
  }

  const updateRelation = (felt: string, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.currentTarget.value
    setRelation({
      ...relation,
      [felt]: value
    })
  }

  const updateDate = (felt: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const nyDato = vaskInputDato(event.currentTarget.value) || ''
    setRelation({
      ...relation,
      [felt]: nyDato
    })
  }

  const canAddRelation = () => {
    const { fnr, rolle, nasjonalitet, kjoenn, fornavn, etternavn } = relation
    return (fnr && rolle && nasjonalitet && kjoenn && fornavn && etternavn)
  }

  const addRelation = () => {
    if (canAddRelation()) {
      setRelation(emptyRelation)
      dispatch(formActions.addFamilierelasjoner({
        ...relation,
        fdato: relation.fdato || ''
      }))
    }
  }

  return (
    <div className={classNames(className, 'mt-4')}>
      <Ui.Nav.Normaltekst>{t('ui:form-family-utland-add-form-title')}</Ui.Nav.Normaltekst>
      <Ui.Nav.Panel border className='mt-4 familierelasjoner__utland__wrapper'>
        <Ui.Nav.Row>
          <div className='col-xs-6'>
            <div className='slideAnimate mb-3'>
              <Ui.Nav.Input
                label={t('ui:label-abroad-id')}
                className='familierelasjoner__input'
                value={relation.fnr}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRelation('fnr', e)}
              />
            </div>
          </div>
          <div className='col-xs-6'>
            <div className='slideAnimate mb-3' style={{ animationDelay: '0.1s' }}>
              <Ui.CountrySelect
                id='id-nasjonalitet'
                label={t('ui:label-nationality')}
                className='familierelasjoner__input'
                menuPortalTarget={document.body}
                value={relation.nasjonalitet}
                includeList={landkoder ? landkoder.map((l: Kodeverk) => l.kode) : []}
                onOptionSelected={(e: any) => updateCountry('nasjonalitet', e.value)}
              >
              </Ui.CountrySelect>
            </div>
          </div>
          <div className='col-xs-6'>
            <div className='slideAnimate mb-3' style={{ animationDelay: '0.2s' }}>
              <Ui.Nav.Input
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
