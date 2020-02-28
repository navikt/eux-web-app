import { FamilieRelasjon, Kodeverk, Person } from 'declarations/types'
import { PersonPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatterDatoTilNorsk } from 'utils/dato'

import './PersonCard.css'

export interface PersonCardProps {
  className?: string,
  person: Person | FamilieRelasjon,
  onAddClick?: (p: Person) => void;
  onRemoveClick?: (p: Person) => void;
  familierelasjonKodeverk?: Array<Kodeverk>;
  rolleList?: Array<Kodeverk>;
  landKodeverk?: any;
}

const PersonCard: React.FC<PersonCardProps> = ({
  className, rolleList, familierelasjonKodeverk, landKodeverk, onAddClick, onRemoveClick, person
}: PersonCardProps): JSX.Element => {
  const [_person, setPerson] = useState<Person | FamilieRelasjon>(person)
  const { fnr, fdato, fornavn, etternavn, kjoenn } = _person
  const { nasjonalitet } = _person as FamilieRelasjon
  const { t } = useTranslation()

  let kind: string = 'nav-unknown-icon'
  if (kjoenn === 'K') {
    kind = 'nav-woman-icon'
  } else if (kjoenn === 'M') {
    kind = 'nav-man-icon'
  }

  let nasjonalitetTerm, rolleTerm

  if ((_person as FamilieRelasjon).rolle && (familierelasjonKodeverk || rolleList)) {
    let rolleObjekt
    if (familierelasjonKodeverk) {
      rolleObjekt = familierelasjonKodeverk.find((item: any) => item.kode === (_person as FamilieRelasjon).rolle)
    }
    if (rolleList) {
      rolleObjekt = rolleList.find((item: any) => item.kode === (_person as FamilieRelasjon).rolle)
    }
    const nasjonalitetObjekt = landKodeverk?.find((item: any) => item.kode === nasjonalitet)

    const kodeverkObjektTilTerm = (kodeverkObjekt: any) => {
      if (!kodeverkObjekt || !kodeverkObjekt.term) return undefined
      return Object.keys(kodeverkObjekt).includes('term') ? kodeverkObjekt.term : null
    }

    rolleTerm = kodeverkObjektTilTerm(rolleObjekt) || t('ui:form-unknownRolle')
    nasjonalitetTerm = kodeverkObjektTilTerm(nasjonalitetObjekt) || t('ui:form-unknownNationality')
  }

  const updateFamilyRelation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPerson({
      ..._person,
      rolle: e.target.value
    })
  }

  return (
    <div className={className}>
      <Ui.Nav.Panel border style={{ background: 'transparent' }} className='mt-4'>
        <div className='personcard'>
          <div className='personcard__desc'>
            <Ui.Icons className='mr-3' kind={kind} size={40} />
            <div className='panelheader__tittel'>
              <Ui.Nav.Undertittel className='panelheader__tittel__hoved'>
                {fornavn}
                {etternavn}
                {(_person as FamilieRelasjon).rolle ? ' - ' + rolleTerm : ''}
              </Ui.Nav.Undertittel>
              <div className='panelheader__undertittel'>
                <div>{t('ui:form-fnr') + ' : ' + fnr}</div>
                <div>{t('ui:form-birthdate') + ': ' + formatterDatoTilNorsk(fdato)}</div>
                {nasjonalitet ? (
                  <div>
                    <span>{t('ui:label-nationality')}: </span>
                    <Ui.Flag className='ml-2 mr-2' country={nasjonalitet} size='S' label={nasjonalitetTerm} />
                    <span>{nasjonalitetTerm}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          {rolleList !== undefined ? (
            <Ui.Nav.Select
              id='id-familirelasjon-rolle'
              label={t('ui:label-familyRelationship')}
              className='familierelasjoner__input'
              value={(_person as FamilieRelasjon).rolle}
              onChange={updateFamilyRelation}
            >
              <option value='' disabled>{t('ui:form-choose')}</option>
              {rolleList ? rolleList.map((element: Kodeverk) => (
                <option value={element.kode} key={element.kode}>{element.term}</option>)
              ) : null}
            </Ui.Nav.Select>
          ) : null}
          {_.isFunction(onRemoveClick) ? (
            <Ui.Nav.Knapp
              className='familierelasjoner__knapp familierelasjoner__knapp--slett'
              onClick={() => onRemoveClick(_person)}
            >
              <Ui.Icons kind='trashcan' color='#0067C5' size='20' className='familierelasjoner__knapp__ikon mr-3' />
              <div className='familierelasjoner__knapp__label'>{t('ui:form-remove')}</div>
            </Ui.Nav.Knapp>
          ) : null}
          {_.isFunction(onAddClick) ? (
            <Ui.Nav.Knapp
              className='familierelasjoner__knapp familierelasjoner__knapp--legg-til'
              onClick={() => onAddClick(_person)}
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
  onAddClick: PT.func,
  onRemoveClick: PT.func,
  person: PersonPropType.isRequired
}

export default PersonCard
