import classNames from 'classnames'
import React from 'react'
import PT from 'prop-types'
import Ui from 'eessi-pensjon-ui'
import './FamilieRelasjonUtland.css'
import { KodeverkPropType } from 'declarations/types.pt'
import { useTranslation } from 'react-i18next'

export interface FamilieRelasjonUtlandProps {
  className: any,
  spesialRelasjon: any,
  oppdaterState: any,
  kjoennKodeverk: any,
  landKodeverk: any,
  filtrerteFamilieRelasjoner: any,
  leggTilSpesialRelasjon: any,
  vaskInputDatoOgOppdater: any,
  kanSpesialRelasjonLeggesTil: any
}

const FamilieRelasjonUtland: React.FC<FamilieRelasjonUtlandProps> = ({
  className,
  spesialRelasjon, oppdaterState,
  kjoennKodeverk, landKodeverk, filtrerteFamilieRelasjoner,
  leggTilSpesialRelasjon, vaskInputDatoOgOppdater, kanSpesialRelasjonLeggesTil
}: FamilieRelasjonUtlandProps): JSX.Element => {
  const { t } = useTranslation()

  console.log(landKodeverk.map((l: any) => ({label: l.term, value: l.kode})))
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

              value={spesialRelasjon.fnr}
              onChange={(event: any) => oppdaterState('fnr', event)}
            />
            </div>
          </div>
          <div className='col-xs-6'>
            <div className='slideAnimate mb-3' style={{animationDelay: '0.1s'}}>
              <Ui.CountrySelect
              id='id-nasjonalitet'
              label={t('ui:label-nationality')}
              className='familierelasjoner__input'
              menuPortalTarget={document.body}
              value={spesialRelasjon.nasjonalitet}
              includeList={landKodeverk.map((l: any) => l.kode)}
              onChange={(event: any) => oppdaterState('nasjonalitet', event.value)}
            >
            </Ui.CountrySelect>
            </div>
          </div>
          <div className='col-xs-6'>
            <div className='slideAnimate mb-3' style={{animationDelay: '0.2s'}}>
            <Ui.Nav.Input
              label={t('ui:label-firstname')}
              className='familierelasjoner__input'
              bredde='fullbredde'
              value={spesialRelasjon.fornavn}
              onChange={(event: any) => oppdaterState('fornavn', event)}
            />
          </div>
          </div>
          <div className='col-xs-6'>
            <div className='slideAnimate mb-3' style={{animationDelay: '0.3s'}}>
            <Ui.Nav.Input
              label={t('ui:label-lastname')}
              className='familierelasjoner__input'
              bredde='fullbredde'
              value={spesialRelasjon.etternavn}
              onChange={(event: any) => oppdaterState('etternavn', event)}
            />
          </div>
          </div>
          <div className='col-xs-6'>
            <div className='slideAnimate mb-3' style={{animationDelay: '0.4s'}}>

            <Ui.Nav.Select
              id='id-kjoenn'
              label={t('ui:label-gender')}
              className='familierelasjoner__input'
              value={spesialRelasjon.kjoenn}
              onChange={(event: any) => oppdaterState('kjoenn', event)}
            >
              <option value='' disabled>{t('ui:form-choose')}</option>
              {kjoennKodeverk && kjoennKodeverk.map((element: any) => (
                <option value={element.kode} key={element.kode}>{element.term}</option>)
              )}
            </Ui.Nav.Select>
            </div>
          </div>
          <div className='col-xs-6'>
            <div className='slideAnimate mb-3' style={{animationDelay: '0.5s'}}>

            <Ui.Nav.Input
              label={t('ui:form-birthdate')}
              className='familierelasjoner__input'
              value={spesialRelasjon.fdato}
              onChange={(event: any) => oppdaterState('fdato', event)}
              onBlur={(event: any) => vaskInputDatoOgOppdater('fdato', event)}
            />
          </div>
          </div>
          <div className='col-xs-6'>
            <div className='slideAnimate mb-3' style={{animationDelay: '0.6s'}}>

            <Ui.Nav.Select
              id='id-familierelasjon'
              label={t('ui:label-familyRelationship')}
              className='familierelasjoner__input'
              value={spesialRelasjon.rolle}
              onChange={(event: any) => oppdaterState('rolle', event)}
            >
              <option value='' disabled>{t('ui:form-choose')}</option>
              {filtrerteFamilieRelasjoner().map((element: any) => (
                <option value={element.kode} key={element.kode}>{element.term}</option>)
              )}
            </Ui.Nav.Select>
            </div>
          </div>
          <div className='col-xs-6'>
            <div className='slideAnimate mb-3' style={{animationDelay: '0.7s'}}>

            <Ui.Nav.Knapp
              onClick={leggTilSpesialRelasjon}
              disabled={!kanSpesialRelasjonLeggesTil()}
              className='spesialrelasjon familierelasjoner__knapp'
            >
              <Ui.Icons kind='tilsette' size='18' className='familierelasjoner__knapp__ikon' />
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

FamilieRelasjonUtland.propTypes = {
  spesialRelasjon: PT.object.isRequired,
  oppdaterState: PT.func.isRequired,
  filtrerteFamilieRelasjoner: PT.func.isRequired,
  kjoennKodeverk: PT.arrayOf(KodeverkPropType),
  landKodeverk: PT.arrayOf(KodeverkPropType),
  leggTilSpesialRelasjon: PT.func.isRequired,
  vaskInputDatoOgOppdater: PT.func.isRequired,
  kanSpesialRelasjonLeggesTil: PT.func.isRequired
}

export default FamilieRelasjonUtland
