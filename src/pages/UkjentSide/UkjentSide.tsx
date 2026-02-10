import TopContainer from 'components/TopContainer/TopContainer'
import {Page, Box, Alert, Link, Heading, HStack,Spacer} from '@navikt/ds-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

const UkjentSide: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Page>
      <TopContainer title={t('app:page-title-unknown')}>
        <Page.Block width="2xl" as="main">
          <HStack>
            <Spacer/>
            <Box paddingBlock="12">
              <Alert variant='warning'>
                <Heading size='medium'>
                  {t('message:error-unknownPage-cantFindRoute', { pathname: window.location.pathname })}
                </Heading>
              </Alert>
              <p>{t('message:error-unknownPage-description')}</p>
              <Link
                href='/'
                aria-label={t('message:error-unknownPage-linkToRoot-ariaLabel')}
              >
                {t('message:error-unknownPage-linkToRoot')}
              </Link>
            </Box>
            <Spacer/>
          </HStack>
        </Page.Block>
      </TopContainer>
    </Page>
  )
}

export default UkjentSide
