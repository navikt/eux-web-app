import { Knapp } from 'nav-frontend-knapper'
import { Systemtittel } from 'nav-frontend-typografi'
import { Column, HorizontalSeparatorDiv, Row } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import ArbeidsforholdetFC from './Arbeidsforholdet'
import { Arbeidsforholdet } from 'declarations/types.d'

const ArbeidsforholdButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export interface ArbeidsforholdProps {
  arbeidsforholdList: Array<Arbeidsforholdet> | undefined
  editable?: boolean
  getArbeidsforholdList: () => void
  gettingArbeidsforholdList?: boolean
  personID?: string
  valgteArbeidsforhold: Array<Arbeidsforholdet>
  onArbeidsforholdClick: (a: Arbeidsforholdet, checked: boolean) => void
  onArbeidsforholdEdited?: (a: Arbeidsforholdet) => void
  onArbeidsforholdDelete?: (a: Arbeidsforholdet) => void
}

const Arbeidsforhold: React.FC<ArbeidsforholdProps> = ({
  editable = false,
  arbeidsforholdList,
  gettingArbeidsforholdList = false,
  getArbeidsforholdList,
  personID,
  valgteArbeidsforhold,
  onArbeidsforholdClick,
  onArbeidsforholdEdited = () => {},
  onArbeidsforholdDelete = () => {}
}: ArbeidsforholdProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <Row>
      <Column className='arbeidsforhold'>
        <Row>
          <Column>
            <Systemtittel>
              {t('ui:label-aaRegistered')}
            </Systemtittel>
          </Column>
        </Row>
        <Row>
          <Column>
            <ArbeidsforholdButton>
              <span>
                {t('ui:label-arbeidsforhold')}
              </span>
              <HorizontalSeparatorDiv />
              <Knapp
                disabled={gettingArbeidsforholdList}
                spinner={gettingArbeidsforholdList}
                onClick={getArbeidsforholdList}>
                {gettingArbeidsforholdList ? t('ui:label-searching') : t('ui:label-search')}
              </Knapp>
            </ArbeidsforholdButton>
          </Column>
        </Row>
        {arbeidsforholdList && arbeidsforholdList.map(
          (arbeidsforholdet: Arbeidsforholdet, index: number) => {
            const selected: boolean = valgteArbeidsforhold
              ? valgteArbeidsforhold.find((item: Arbeidsforholdet) => item.orgnr === arbeidsforholdet.orgnr) !== undefined
              : false
            return (
              <ArbeidsforholdetFC
                arbeidsforholdet={arbeidsforholdet}
                editable={editable}
                selected={selected}
                index={index}
                onArbeidsforholdClick={onArbeidsforholdClick}
                onArbeidsforholdDelete={onArbeidsforholdDelete}
                onArbeidsforholdEdited={onArbeidsforholdEdited}
                personID={personID!}
              />
            )
          }

          ).filter(e => e !== undefined)}
      </Column>
    </Row>
  )
}

export default Arbeidsforhold
