import { FamilieRelasjon, Person } from 'declarations/types'
import { PersonPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatterDatoTilNorsk } from 'utils/dato'
import _ from 'lodash'

import './PersonCard.css'

export interface PersonCardProps {
  className?: string,
  person: Person | FamilieRelasjon,
  initialRolle?: string | undefined;
  onAddClick?: (p: Person) => void;
  onRemoveClick?: (p: Person) => void;
  oppdaterFamilierelajon?: (rolle: string) => void;
  familierelasjonKodeverk?: any;
  landKodeverk?: any;
}

const PersonCard: React.FC<PersonCardProps> = ({
  className, familierelasjonKodeverk, landKodeverk, initialRolle, onAddClick, onRemoveClick,
  oppdaterFamilierelajon, person
}: PersonCardProps): JSX.Element => {
  const { fnr, fdato, fornavn, etternavn, kjoenn } = person
  const { nasjonalitet } = person as FamilieRelasjon
  const { t } = useTranslation()
  const [rolle, setRolle] = useState<string |undefined>(initialRolle)

  let kind: string = 'nav-unknown-icon'
  if (kjoenn === 'K') {
    kind = 'nav-woman-icon'
  } else if (kjoenn === 'M') {
    kind = 'nav-man-icon'
  }

  let nasjonalitetTerm//, rolleTerm

  if ((person as FamilieRelasjon).rolle) {
    // const rolleObjekt = familierelasjonKodeverk.find((item: any) => item.kode === (person as FamilieRelasjon).rolle)
    const nasjonalitetObjekt = landKodeverk ? landKodeverk.find((item: any) => item.kode === nasjonalitet) : undefined

    const kodeverkObjektTilTerm = (kodeverkObjekt: any) => {
      if (!kodeverkObjekt || !kodeverkObjekt.term) { return '(mangler informasjon)' }
      return Object.keys(kodeverkObjekt).includes('term') ? kodeverkObjekt.term : null
    }

    // rolleTerm = kodeverkObjektTilTerm(rolleObjekt)
    nasjonalitetTerm = kodeverkObjektTilTerm(nasjonalitetObjekt)
  }

  const updateFamilyRelation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRolle = e.target.value
    if (newRolle && oppdaterFamilierelajon) {
      setRolle(newRolle)
      oppdaterFamilierelajon(newRolle)
    }
  }

  return (
    <div className={className}>
      <Ui.Nav.Panel border style={{background: 'transparent'}} className='mt-4'>
        <div className='personcard'>
          <div className='personcard__desc'>
            <Ui.Icons className='mr-3' kind={kind} size={40} />
            <div className='panelheader__tittel'>
              <Ui.Nav.Undertittel className='panelheader__tittel__hoved'>
                {fornavn}
                {etternavn}
                {rolle ? ' - ' + rolle : ''}
              </Ui.Nav.Undertittel>
              <div className='panelheader__undertittel'>
                <div>{t('ui:form-fnr') + ' : ' + fnr}</div>
                <div>{t('ui:form-birthdate') + ': ' + formatterDatoTilNorsk(fdato)}</div>
                {nasjonalitetTerm ? <div>Nasjonalitet: {nasjonalitetTerm}</div> : null}
              </div>
            </div>
          </div>
          {_.isFunction(oppdaterFamilierelajon) ? (
            <Ui.Nav.Select
              id='id-familirelasjon-rolle'
              label='Familierelasjon'
              bredde='fullbredde'
              className='familierelasjoner__input'
              value={rolle}
              onChange={updateFamilyRelation}
            >
              <option value='' disabled>{t('ui:form-choose')}</option>
              {familierelasjonKodeverk && familierelasjonKodeverk.map((element: any) => (
                <option value={element.kode} key={element.kode}>{element.term}</option>)
              )}
            </Ui.Nav.Select>
          ) : null}
          {_.isFunction(onRemoveClick) ? (
            <Ui.Nav.Knapp
              className='familierelasjoner__knapp familierelasjoner__knapp--slett'
              onClick={() => onRemoveClick(person)}
            >
              <Ui.Icons kind='trashcan' size='20' className='familierelasjoner__knapp__ikon' />
              <div className='familierelasjoner__knapp__label'>{t('ui:form-remove')}</div>
            </Ui.Nav.Knapp>
          ) : null}
          {_.isFunction(onAddClick) ? (
            <Ui.Nav.Knapp
              className='familierelasjoner__knapp familierelasjoner__knapp--legg-til'
              onClick={() => onAddClick(person)}
            >
              <Ui.Icons kind='tilsette' size='20' className='familierelasjoner__knapp__ikon' />
              <div className='familierelasjoner__knapp__label'>{t('ui:form-add')}</div>
            </Ui.Nav.Knapp>
          ) : null}
        </div>
      </Ui.Nav.Panel>
    </div>
  )
}

PersonCard.propTypes = {
  className: PT.string,
  onAddClick: PT.func,
  onRemoveClick: PT.func,
  oppdaterFamilierelajon: PT.func,
  person: PersonPropType.isRequired
}

export default PersonCard
