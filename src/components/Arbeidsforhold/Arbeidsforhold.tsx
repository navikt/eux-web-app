import { Cell, HorizontalSeparatorDiv, Row, VerticalSeparatorDiv } from '../StyledComponents'
import { Knapp } from 'nav-frontend-knapper'
import Panel from 'nav-frontend-paneler'
import { Checkbox } from 'nav-frontend-skjema'
import { Systemtittel } from 'nav-frontend-typografi'
import React from 'react'
import { useTranslation } from 'react-i18next'
import IkonArbeidsforhold from '../../resources/images/ikon-arbeidsforhold'
import styled from 'styled-components'
import { formatterDatoTilNorsk } from '../../utils/dato'

export interface ArbeidsforholdProps {
  getArbeidsforholdList: () => void
  valgteArbeidsforhold: any
  arbeidsforholdList: any
  onArbeidsforholdClick: (x: any, y: any) => void
}

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
const Arbeidsforhold: React.FC<ArbeidsforholdProps> = ({
  arbeidsforholdList, getArbeidsforholdList, valgteArbeidsforhold, onArbeidsforholdClick
}: ArbeidsforholdProps) => {
  const { t } = useTranslation()
  return (
    <Row>
      <Cell className='arbeidsforhold'>
        <Row>
          <Cell>
            <Systemtittel>
              {t('ui:label-aaRegistered')}
            </Systemtittel>
          </Cell>
        </Row>
        <Row>
          <Cell>
            <ArbeidsforholdButton>
              <span>
                {t('ui:label-arbeidsforhold')}
              </span>
              <HorizontalSeparatorDiv />
              <Knapp onClick={getArbeidsforholdList}>
                {t('ui:form-search')}
              </Knapp>
            </ArbeidsforholdButton>
          </Cell>
        </Row>
        {arbeidsforholdList &&
        arbeidsforholdList.map(
          (arbeidsforholdet: any, index: number) => {
            const {
              arbeidsforholdIDnav,
              navn,
              orgnr,
              ansettelsesPeriode: { fom, tom }
            } = arbeidsforholdet
            const arbeidsForholdErValgt = valgteArbeidsforhold.find(
              (item: any) =>
                item.arbeidsforholdIDnav === arbeidsforholdIDnav
            )
            return (
              <>
                <VerticalSeparatorDiv data-size='0.5' />
                <Panel key={index} border>
                  <ArbeidsforholdItem>
                    <ArbeidsforholdDesc>
                      <IkonArbeidsforhold />
                      <HorizontalSeparatorDiv />
                      <div>
                        <strong>{navn}</strong>
                        <br />
                        {t('ui:label-orgnummer')}:&nbsp;{orgnr}
                        <br />
                        {t('ui:label-startDate')}:&nbsp;
                        {formatterDatoTilNorsk(fom)}
                        <br />
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
                <VerticalSeparatorDiv data-size='0.5' />
              </>
            )
          }
        )}
      </Cell>
      <Cell />
    </Row>
  )
}

export default Arbeidsforhold
