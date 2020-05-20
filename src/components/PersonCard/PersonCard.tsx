import classNames from 'classnames'
import { FamilieRelasjon, Kodeverk, Person } from 'declarations/types'
import { KodeverkPropType, PersonPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatterDatoTilNorsk } from 'utils/dato'

import './PersonCard.css'

export interface PersonCardProps {
  className?: string,
  familierelasjonKodeverk?: Array<Kodeverk>;
  onAddClick?: (p: Person | FamilieRelasjon) => void;
  onRemoveClick?: (p: Person | FamilieRelasjon) => void;
  person: Person | FamilieRelasjon;
  rolleList?: Array<Kodeverk>;
}

const PersonCard: React.FC<PersonCardProps> = ({
  className, familierelasjonKodeverk, onAddClick, onRemoveClick, person, rolleList
}: PersonCardProps): JSX.Element => {
  // const [_person, setPerson] = useState<Person | FamilieRelasjon>(person)
  const [rolle, setRolle] = useState<any>(undefined)
  const { fnr, fdato, fornavn, etternavn, kjoenn } = (person as FamilieRelasjon)
  const { t } = useTranslation()

  let kind: string = 'nav-unknown-icon'
  if (kjoenn === 'K') {
    kind = 'nav-woman-icon'
  } else if (kjoenn === 'M') {
    kind = 'nav-man-icon'
  }

  let rolleTerm

  if ((person as FamilieRelasjon).rolle && (familierelasjonKodeverk || rolleList)) {
    let rolleObjekt
    if (familierelasjonKodeverk) {
      rolleObjekt = familierelasjonKodeverk.find((item: any) => item.kode === (person as FamilieRelasjon).rolle)
    }
    if (rolleList) {
      rolleObjekt = rolleList.find((item: any) => item.kode === (person as FamilieRelasjon).rolle)
    }
    const kodeverkObjektTilTerm = (kodeverkObjekt: any) => {
      if (!kodeverkObjekt || !kodeverkObjekt.term) return undefined
      return Object.keys(kodeverkObjekt).includes('term') ? kodeverkObjekt.term : undefined
    }

    rolleTerm = kodeverkObjektTilTerm(rolleObjekt)
    if (!rolleTerm) {
      rolleTerm = t('ui:form-unknownRolle')
    }
  }

  const _onRemoveClick = (p: Person | FamilieRelasjon) => {
    if (rolle) {
      (p as FamilieRelasjon).rolle = rolle
    }
    if (onRemoveClick) {
      onRemoveClick(p)
    }
  }

  const _onAddClick = (p: Person | FamilieRelasjon) => {
    if (rolle) {
      (p as FamilieRelasjon).rolle = rolle
    }
    if (onAddClick) {
      onAddClick(p)
    }
  }

  const updateFamilyRelation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRolle(e.target.value)
  }

  return (
    <div className={classNames(className, 'c-personCard')}>
      <Ui.Nav.Panel border style={{ background: 'transparent' }} className='mt-4'>
        <div className='personcard'>
          <div className='personcard__desc'>
            <Ui.Icons className='mr-3' kind={kind} size={40} />
            <div className='panelheader__tittel'>
              <Ui.Nav.Undertittel className='panelheader__tittel__hoved'>
                {fornavn}
                {' '}
                {etternavn}
                {(person as FamilieRelasjon).rolle ? ' - ' + rolleTerm : ''}
              </Ui.Nav.Undertittel>
              <div className='panelheader__undertittel'>
                <div>{t('ui:form-fnr') + ' : ' + fnr}</div>
                <div>{t('ui:form-birthdate') + ': ' + formatterDatoTilNorsk(fdato)}</div>
              </div>
            </div>
          </div>
          {rolleList !== undefined ? (
            <Ui.Nav.Select
              id='id-familirelasjon-rolle'
              label={t('ui:label-familyRelationship')}
              className='familierelasjoner__input'
              value={(person as FamilieRelasjon).rolle}
              onChange={updateFamilyRelation}
            >
              <option value=''>{t('ui:form-choose')}</option>
              {rolleList ? rolleList.map((element: Kodeverk) => (
                <option value={element.kode} key={element.kode}>{element.term}</option>)
              ) : null}
            </Ui.Nav.Select>
          ) : null}
          {_.isFunction(onRemoveClick) ? (
            <Ui.Nav.Knapp
              className='familierelasjoner__knapp familierelasjoner__knapp--slett'
              onClick={() => _onRemoveClick(person)}
            >
              <Ui.Icons kind='trashcan' color='#0067C5' size='20' className='familierelasjoner__knapp__ikon mr-3' />
              <div className='familierelasjoner__knapp__label'>{t('ui:form-remove')}</div>
            </Ui.Nav.Knapp>
          ) : null}
          {_.isFunction(onAddClick) ? (
            <Ui.Nav.Knapp
              className='familierelasjoner__knapp familierelasjoner__knapp--legg-til'
              disabled={rolleList !== undefined && !rolle}
              onClick={() => _onAddClick(person)}
            >
              <Ui.Icons kind='tilsette' size='20' className='familierelasjoner__knapp__ikon mr-3' />
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
  familierelasjonKodeverk: PT.arrayOf(KodeverkPropType.isRequired),
  onAddClick: PT.func,
  onRemoveClick: PT.func,
  person: PersonPropType.isRequired,
  rolleList: PT.arrayOf(KodeverkPropType.isRequired)
}

export default PersonCard
