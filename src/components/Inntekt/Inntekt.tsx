import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { IInntekt, IInntekter } from 'declarations/types'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  AlignEndRow,
  AlignStartRow,
  Column,
  FlexDiv,
  HighContrastLink,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PileDiv,
  themeKeys,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import Pagination from 'paginering'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { formatterPenger } from 'utils/PengeUtils'

export interface InntektProps {
  inntekter: IInntekter
}

const ArbeidsgiverDiv = styled(FlexDiv)`
 background-color: whitesmoke;
 justify-content: space-between;
 padding: 1rem;
`
const LeftBorderFlexDiv = styled(FlexDiv)`
  border-left: 1px solid ${({ theme }) => theme[themeKeys.MAIN_BORDER_COOLOR]};
`

const Inntekt: React.FC<InntektProps> = ({ inntekter }: InntektProps) => {
  const { t } = useTranslation()

  const [_currentPage, setCurrentPage] = useState<{[k in string]: number}>({})

  if (!inntekter) {
    return <WaitingPanel />
  }

  return (
    <>
      {inntekter?.inntektsperioder?.map((inntekt: IInntekt) => {
        if (!Object.prototype.hasOwnProperty.call(_currentPage, inntekt.orgNr)) {
          setCurrentPage({
            ..._currentPage,
            [inntekt.orgNr]: 1
          })
        }
        const itemsPerPage = 5
        const firstIndex = (_currentPage[inntekt.orgNr] - 1) * itemsPerPage
        const lastIndex = (_currentPage[inntekt.orgNr] - 1) * itemsPerPage + itemsPerPage

        return (
          <div key={inntekt.orgNr}>
            <AlignStartRow>
              <Column>
                <ArbeidsgiverDiv>
                  <PileDiv>
                    <Undertittel>
                      {inntekt.arbeidsgiverNavn}
                    </Undertittel>
                  </PileDiv>
                  <PileDiv>
                    <span><Normaltekst>{t('label:orgnr')}</Normaltekst></span>
                    <span><Normaltekst>{inntekt.orgNr}</Normaltekst></span>
                  </PileDiv>
                  <PileDiv>
                    <span><Normaltekst>{t('label:stillingprosent')}</Normaltekst></span>
                    <span><Normaltekst>{inntekt.stillingsprosent} %</Normaltekst></span>
                  </PileDiv>
                  <PileDiv>
                    <span><Normaltekst>{t('label:siste-lønnsendring')}</Normaltekst></span>
                    <span><Normaltekst>{inntekt.sisteLoennsendring}</Normaltekst></span>
                  </PileDiv>
                </ArbeidsgiverDiv>
                <VerticalSeparatorDiv size='0.5' />
                <FlexDiv>
                  <HorizontalSeparatorDiv />
                  <FlexDiv style={{ flex: '5', justifyContent: 'flex-end', maxWidth: '600px' }}>
                    {Object.keys(inntekt.maanedsinntekt).map((måned: string, index: number) => {
                      return index >= firstIndex && index < lastIndex
                        ? (
                          <PileDiv key={måned} style={{ width: '120px' }}>
                            <PaddedDiv size='0.3'>
                              {måned}
                            </PaddedDiv>
                            <PaddedDiv size='0.3'>
                              {formatterPenger(inntekt.maanedsinntekt[måned])}
                            </PaddedDiv>
                          </PileDiv>
                          )
                        : null
                    })}
                  </FlexDiv>
                  <LeftBorderFlexDiv>
                    <HorizontalSeparatorDiv />
                    <PileDiv>
                      <PaddedDiv size='0.3'>
                        {t('label:gjennomsnitt')}
                      </PaddedDiv>
                      <PaddedDiv size='0.3'>
                        {formatterPenger(inntekt.maanedsinntektSnitt)}
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
                    currentPage={_currentPage[inntekt.orgNr]}
                    itemsPerPage={itemsPerPage}
                    numberOfItems={Object.keys(inntekt.maanedsinntekt).length}
                    onChange={(page: number) => setCurrentPage({
                      ..._currentPage,
                      [inntekt.orgNr]: page
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
