import { ExternalLinkIcon } from '@navikt/aksel-icons'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { IInntekt, IInntekter } from 'declarations/types'
import { BodyLong, Link, Heading } from '@navikt/ds-react'
import {
  AlignEndRow,
  AlignStartRow,
  Column,
  FlexDiv,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PileDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { Pagination } from "@navikt/ds-react";
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
  border-left: 1px solid var(--a-border-strong);
`

const Inntekt: React.FC<InntektProps> = ({ inntekter }: InntektProps) => {
  const { t } = useTranslation()

  const [_currentPage, setCurrentPage] = useState<{[k in string]: number}>({})

  if (!inntekter) {
    return <WaitingPanel />
  }

  if (inntekter?.inntektsperioder?.length === 0) {
    return <BodyLong>{t('message:warning-no-inntekt-found')}</BodyLong>
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
                    <Heading size='small'>
                      {inntekt.arbeidsgiverNavn}
                    </Heading>
                  </PileDiv>
                  <PileDiv>
                    <span><BodyLong>{t('label:orgnr')}</BodyLong></span>
                    <span><BodyLong>{inntekt.orgNr}</BodyLong></span>
                  </PileDiv>
                  <PileDiv>
                    <span><BodyLong>{t('label:stillingprosent')}</BodyLong></span>
                    <span><BodyLong>{inntekt.stillingsprosent} %</BodyLong></span>
                  </PileDiv>
                  <PileDiv>
                    <span><BodyLong>{t('label:siste-lønnsendring')}</BodyLong></span>
                    <span><BodyLong>{inntekt.sisteLoennsendring}</BodyLong></span>
                  </PileDiv>
                </ArbeidsgiverDiv>
                <VerticalSeparatorDiv size='0.5' />
                <FlexDiv>
                  <HorizontalSeparatorDiv />
                  <FlexDiv style={{ flex: '5', justifyContent: 'space-evenly', maxWidth: '600px' }}>
                    {Object.keys(inntekt.maanedsinntekter)?.map((måned: string, index: number) => {
                      return index >= firstIndex && index < lastIndex
                        ? (
                          <PileDiv key={måned} style={{ width: '100px' }}>
                            <PaddedDiv size='0.3'>
                              {måned}
                            </PaddedDiv>
                            <PaddedDiv size='0.3'>
                              {formatterPenger(inntekt.maanedsinntekter[måned])}
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
                <Link target='_blank' href={inntekter.uriInntektRegister} rel='noreferrer'>
                  {t('label:gå-til-A-inntekt')}
                  <HorizontalSeparatorDiv size='0.35' />
                  <ExternalLinkIcon />
                </Link>
              </Column>
              <Column>
                <FlexDiv style={{ flexDirection: 'row-reverse' }}>
                  {Object.keys(inntekt.maanedsinntekter).length >= itemsPerPage &&
                    <Pagination
                      page={_currentPage[inntekt.orgNr]}
                      count={Math.ceil(Object.keys(inntekt.maanedsinntekter).length/itemsPerPage)}
                      siblingCount={2}
                      size="xsmall"
                      onPageChange={(page: number) => setCurrentPage({
                        ..._currentPage,
                        [inntekt.orgNr]: page
                      })}
                    />
                  }
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
