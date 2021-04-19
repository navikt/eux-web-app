import { Arbeidsforholdet } from 'declarations/types.d'
import { Knapp } from 'nav-frontend-knapper'
import { Column, Row } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ArbeidsforholdetFC from './Arbeidsforholdet'

export interface ArbeidsforholdProps {
  arbeidsforholdList: Array<Arbeidsforholdet> | undefined
  editable?: boolean
  getArbeidsforholdList?: () => void
  gettingArbeidsforholdList?: boolean
  personID?: string
  personFnr?: string
  onArbeidsforholdSelect: (a: Arbeidsforholdet, checked: boolean) => void
  onArbeidsforholdEdit?: (a: Arbeidsforholdet, index: number) => void
  onArbeidsforholdDelete?: (index: number) => void
  searchable?: boolean
  valgteArbeidsforhold: Array<Arbeidsforholdet>
}

const Arbeidsforhold: React.FC<ArbeidsforholdProps> = ({
  arbeidsforholdList,
  editable = false,
  gettingArbeidsforholdList = false,
  getArbeidsforholdList = () => {},
  personID,
  personFnr,
  onArbeidsforholdSelect,
  onArbeidsforholdEdit = () => {},
  onArbeidsforholdDelete = () => {},
  searchable = false,
  valgteArbeidsforhold
}: ArbeidsforholdProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Row>
      <Column className='arbeidsforhold'>
        {searchable && !arbeidsforholdList && (
          <Row>
            <Column>
              <Knapp
                disabled={gettingArbeidsforholdList}
                spinner={gettingArbeidsforholdList}
                onClick={getArbeidsforholdList}
              >
                {gettingArbeidsforholdList
                  ? t('message:loading-searching')
                  : t('el:button-search-for-x', { x: t('label:arbeidsforhold').toLowerCase() })}
              </Knapp>
            </Column>
          </Row>
        )}
        {arbeidsforholdList && arbeidsforholdList.map(
          (arbeidsforholdet: Arbeidsforholdet, index: number) => {
            const selected: boolean = valgteArbeidsforhold
              ? valgteArbeidsforhold.find((item: Arbeidsforholdet) => item.arbeidsgiverOrgnr === arbeidsforholdet.arbeidsgiverOrgnr) !== undefined
              : false
            return (
              <ArbeidsforholdetFC
                arbeidsforholdet={arbeidsforholdet}
                editable={editable}
                selected={selected}
                key={arbeidsforholdet.arbeidsgiverOrgnr + '-' + index}
                index={index}
                onArbeidsforholdSelect={onArbeidsforholdSelect}
                onArbeidsforholdDelete={onArbeidsforholdDelete}
                onArbeidsforholdEdit={onArbeidsforholdEdit}
                personID={personID!}
                personFnr={personFnr}
              />
            )
          }

        ).filter(e => e !== undefined)}
      </Column>
    </Row>
  )
}

export default Arbeidsforhold
