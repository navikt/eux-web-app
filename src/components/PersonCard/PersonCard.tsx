import { Person } from 'declarations/types'
import { PersonPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { formatterDatoTilNorsk } from 'utils/dato'
import { PanelHeader } from 'felles-komponenter/panelHeader'
import * as Eux from 'felles-komponenter/Ikon'

export interface PersonCardProps {
  person: Person,
  onRemoveClick: () => void;
}

const PersonCard: React.FC<PersonCardProps> = ({ onRemoveClick, person }: PersonCardProps): JSX.Element => {
  const { fnr, fdato, fornavn, etternavn, kjoenn } = person
  const { t } = useTranslation()

  return (
    <div>
      <Ui.Nav.Panel border className='personsok__kort mt-4'>
        <PanelHeader
          ikon={Eux.IkonFraKjonn(kjoenn)}
          tittel={`${fornavn} ${etternavn}`}
          undertittel={(
            <div className='panelheader__undertittel'>
              <span>{t('ui:form-fnr') + ' : ' + fnr}</span>
              <span>{t('ui:form-birthdate') + ': ' + formatterDatoTilNorsk(fdato)}</span>
            </div>
          )}
        />
        <Ui.Nav.Knapp
          className='familierelasjoner__knapp familierelasjoner__knapp--slett'
          onClick={onRemoveClick}
        >
          <Eux.Icon kind='trashcan' size='20' className='familierelasjoner__knapp__ikon' />
          <div className='familierelasjoner__knapp__label'>{t('ui:form-remove')}</div>
        </Ui.Nav.Knapp>
      </Ui.Nav.Panel>
    </div>
  )
}

PersonCard.propTypes = {
  onRemoveClick: PT.func.isRequired,
  person: PersonPropType.isRequired
}

export default PersonCard
