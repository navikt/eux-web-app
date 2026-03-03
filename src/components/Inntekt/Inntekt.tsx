import { ExternalLinkIcon } from '@navikt/aksel-icons'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { IInntekt, IInntekter } from 'declarations/types'
import {BodyLong, Link, Heading, VStack, HStack, Box, Spacer} from '@navikt/ds-react'
import { Pagination } from "@navikt/ds-react";
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatterPenger } from 'utils/PengeUtils'

export interface InntektProps {
  inntekter: IInntekter
}

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
          <VStack gap="space-16" key={inntekt.orgNr}>
            <HStack width="100%" gap="space-16">
              <VStack width="100%" gap="space-8">
                <Box padding="space-16" background="neutral-soft">
                  <HStack justify="space-between" align="start">
                    <Heading size='small'>
                      {inntekt.arbeidsgiverNavn}
                    </Heading>
                    <VStack>
                      <BodyLong>{t('label:orgnr')}</BodyLong>
                      <BodyLong>{inntekt.orgNr}</BodyLong>
                    </VStack>
                    <VStack>
                      <BodyLong>{t('label:stillingprosent')}</BodyLong>
                      <BodyLong>{inntekt.stillingsprosent} %</BodyLong>
                    </VStack>
                    <VStack>
                      <BodyLong>{t('label:siste-lønnsendring')}</BodyLong>
                      <BodyLong>{inntekt.sisteLoennsendring}</BodyLong>
                    </VStack>
                  </HStack>
                </Box>
                <HStack>
                  <Spacer />
                  <HStack justify="space-evenly" maxWidth="500px">
                    {Object.keys(inntekt.maanedsinntekter)?.map((måned: string, index: number) => {
                      return index >= firstIndex && index < lastIndex
                        ? (
                          <VStack width="100px" key={måned}>
                            <Box padding="space-4">
                              {måned}
                            </Box>
                            <Box padding="space-4">
                              {formatterPenger(inntekt.maanedsinntekter[måned])}
                            </Box>
                          </VStack>
                          )
                        : null
                    })}
                  </HStack>
                  <Box style={{borderLeft: "1px solid var(--ax-border-neutral-strong)"}} paddingInline="space-8">
                    <HStack gap="space-8">
                      <Spacer />
                      <VStack>
                        <Box padding="space-4">
                          {t('label:gjennomsnitt')}
                        </Box>
                        <Box padding="space-4">
                          {formatterPenger(inntekt.maanedsinntektSnitt)}
                        </Box>
                      </VStack>
                      <Spacer/>
                    </HStack>
                  </Box>
                </HStack>
              </VStack>
            </HStack>
            <HStack>
              <Link target='_blank' href={inntekter.uriInntektRegister} rel='noreferrer'>
                <HStack gap="space-8" align="start">
                  {t('label:gå-til-A-inntekt')}
                  <ExternalLinkIcon />
                </HStack>
              </Link>
              <Spacer/>
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
            </HStack>
          </VStack>
        );
      }
      )}
    </>
  );
}

export default Inntekt
