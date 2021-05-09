import { IInntekt, IInntekter } from 'declarations/types'
import moment from 'moment'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  AlignEndRow,
  AlignStartRow,
  Column,
  FlexDiv,
  HighContrastLink,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PileDiv, themeKeys,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import Pagination from 'paginering'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { formatterPenger } from 'utils/PengeUtils'

export interface InntektProps {
  highContrast: boolean
  inntekter: IInntekter
  personID: string
}

const ArbeidsgiverDiv = styled(FlexDiv)`
 background-color: whitesmoke;
 justify-content: space-between;
 padding: 1rem;
`
const LeftBorderFlexDiv = styled(FlexDiv)`
  border-left: 1px solid ${({ theme }) => theme[themeKeys.MAIN_BORDER_COOLOR]};
`

const Inntekt: React.FC<InntektProps> = ({
  // highContrast,
  inntekter
  // personID
}:InntektProps) => {
  const { t } = useTranslation()

  const data: {[k in string]: Array<IInntekt>} = {}
  const [_currentPage, setCurrentPage] = useState<{[k in string]: number}>({})

  inntekter?.inntektsmaaneder?.forEach((inntekt: IInntekt) => {
    if (Object.prototype.hasOwnProperty.call(data, inntekt.orgNr)) {
      data[inntekt.orgNr] = data[inntekt.orgNr].concat(inntekt).sort((a: IInntekt, b: IInntekt) => (
        moment(a.aarMaaned, 'YYYY-MM').isBefore(moment(b.aarMaaned, 'YYYY-MM')) ? -1 : 1))
    } else {
      data[inntekt.orgNr] = [inntekt]
    }
  })

  return (
    <>
      {Object.keys(data).map((orgnr: string) => {
        if (!Object.prototype.hasOwnProperty.call(_currentPage, orgnr)) {
          setCurrentPage({
            ..._currentPage,
            [orgnr]: 1
          })
        }
        let average = 0
        let total = 0
        const number = data[orgnr].length
        let lastMonth = ''
        const itemsPerPage = 5
        const firstIndex = (_currentPage[orgnr] - 1) * itemsPerPage
        const lastIndex = (_currentPage[orgnr] - 1) * itemsPerPage + itemsPerPage

        const elements: any = []
        data[orgnr].forEach((inntekt: IInntekt, index: number) => {
          total += inntekt.beloep
          if (index >= firstIndex && index < lastIndex) {
            elements.push({
              header: inntekt.aarMaaned,
              value: formatterPenger(inntekt.beloep)
            })
          }
        })
        average = total / number
        lastMonth = data[orgnr][number - 1].aarMaaned
        return (
          <div key={data[orgnr][0].arbeidsgiverNavn}>
            <AlignStartRow>
              <Column>
                <ArbeidsgiverDiv>
                  <PileDiv>
                    <Undertittel>
                      {data[orgnr][0].arbeidsgiverNavn}
                    </Undertittel>
                  </PileDiv>
                  <PileDiv>
                    <span><Normaltekst>{t('label:orgnr')}</Normaltekst></span>
                    <span><Normaltekst>{orgnr}</Normaltekst></span>
                  </PileDiv>
                  <PileDiv>
                    <span><Normaltekst>{t('label:stillingprosent')}</Normaltekst></span>
                    <span><Normaltekst>-</Normaltekst></span>
                  </PileDiv>
                  <PileDiv>
                    <span><Normaltekst>{t('label:siste-lønnsendring')}</Normaltekst></span>
                    <span><Normaltekst>{lastMonth}</Normaltekst></span>
                  </PileDiv>
                </ArbeidsgiverDiv>
                <VerticalSeparatorDiv size='0.5' />
                <FlexDiv>
                  <HorizontalSeparatorDiv />
                  <FlexDiv style={{ flex: '5', justifyContent: 'flex-end', maxWidth: '600px' }}>
                    {elements.map((x: any) => (
                      <PileDiv key={x.header} style={{ width: '120px' }}>
                        <PaddedDiv size='0.3'>
                          {x.header}
                        </PaddedDiv>
                        <PaddedDiv size='0.3'>
                          {x.value}
                        </PaddedDiv>
                      </PileDiv>
                    ))}
                  </FlexDiv>
                  <LeftBorderFlexDiv>
                    <HorizontalSeparatorDiv />
                    <PileDiv>
                      <PaddedDiv size='0.3'>
                        {t('label:gjennomsnitt')}
                      </PaddedDiv>
                      <PaddedDiv size='0.3'>
                        {formatterPenger(average)}
                      </PaddedDiv>
                    </PileDiv>
                  </LeftBorderFlexDiv>
                  <HorizontalSeparatorDiv />

                </FlexDiv>
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv size='0.5' />
            <AlignEndRow>
              <Column>
                <HighContrastLink href={inntekter.uriInntektRegister}>
                  {t('label:gå-til-A-inntekt')}
                </HighContrastLink>
              </Column>
              <Column>
                <FlexDiv style={{ flexDirection: 'row-reverse' }}>
                  <Pagination
                    currentPage={_currentPage[orgnr]}
                    itemsPerPage={itemsPerPage}
                    numberOfItems={number}
                    onChange={(page: number) => setCurrentPage({
                      ..._currentPage,
                      [orgnr]: page
                    })}
                  />
                </FlexDiv>
              </Column>
            </AlignEndRow>
            <VerticalSeparatorDiv size='2' />
          </div>
        )
      }
      )}
    </>
  )
}

export default Inntekt
