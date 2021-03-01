import { Arbeidsforholdet } from 'declarations/types'
import { Knapp } from 'nav-frontend-knapper'
import Panel from 'nav-frontend-paneler'
import { Checkbox } from 'nav-frontend-skjema'
import { Systemtittel } from 'nav-frontend-typografi'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import IkonArbeidsforhold from 'resources/images/ikon-arbeidsforhold'
import { formatterDatoTilNorsk } from 'utils/dato'
import { Column, HorizontalSeparatorDiv, Row, VerticalSeparatorDiv } from 'components/StyledComponents'

const ArbeidsforholdItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`
const ArbeidsforholdDesc = styled.div`
  display: flex;
  flex-direction: row;
`

const ArbeidsforholdButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export interface ArbeidsforholdProps {
  getArbeidsforholdList: () => void
  valgteArbeidsforhold: Array<Arbeidsforholdet>
  arbeidsforholdList: Array<Arbeidsforholdet> | undefined
  onArbeidsforholdClick: (a: Arbeidsforholdet, checked: boolean) => void
}

const Arbeidsforhold: React.FC<ArbeidsforholdProps> = ({
  arbeidsforholdList, getArbeidsforholdList, valgteArbeidsforhold, onArbeidsforholdClick
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
              <Knapp onClick={getArbeidsforholdList}>
                {t('ui:form-search')}
              </Knapp>
            </ArbeidsforholdButton>
          </Column>
        </Row>
        {arbeidsforholdList && arbeidsforholdList.map(
          (arbeidsforholdet: Arbeidsforholdet, index: number) => {
            const {
              arbeidsforholdIDnav,
              navn,
              orgnr,
              ansettelsesPeriode
            } = arbeidsforholdet
            const { fom, tom } = ansettelsesPeriode!
            const arbeidsForholdErValgt: boolean = valgteArbeidsforhold
              ? valgteArbeidsforhold.find((item: Arbeidsforholdet) => item.arbeidsforholdIDnav === arbeidsforholdIDnav) !== undefined
              : false
            if (navn && orgnr) {
              return (
                <div key={arbeidsforholdIDnav}>
                  <VerticalSeparatorDiv data-size='0.5'/>
                  <Panel key={index} border>
                    <ArbeidsforholdItem>
                      <ArbeidsforholdDesc>
                        <IkonArbeidsforhold/>
                        <HorizontalSeparatorDiv/>
                        <div>
                          <strong>{navn}</strong>
                          <br/>
                          {t('ui:label-orgnummer')}:&nbsp;{orgnr}
                          <br/>
                          {t('ui:label-startDate')}:&nbsp;
                          {formatterDatoTilNorsk(fom)}
                          <br/>
                          {t('ui:label-endDate')}:&nbsp;
                          {formatterDatoTilNorsk(tom)}
                        </div>
                      </ArbeidsforholdDesc>
                      <div>
                        <Checkbox
                          checked={arbeidsForholdErValgt}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onArbeidsforholdClick(
                            arbeidsforholdet,
                            e.target.checked
                          )}
                          label={t('ui:form-choose')}
                        />
                      </div>
                    </ArbeidsforholdItem>
                  </Panel>
                  <VerticalSeparatorDiv data-size='0.5'/>
                </div>
              )
            }
            return undefined
          }
        ).filter(e => e !== undefined)}
      </Column>
      <Column />
    </Row>
  )
}

export default Arbeidsforhold
