import {HStack, Page, Spacer} from '@navikt/ds-react'
import {appReset} from 'actions/app'
import TopContainer from 'components/TopContainer/TopContainer'
import React, { JSX } from 'react';
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from 'store'


export const AarligKontrollPage: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const gotoFrontpage = () => {
    dispatch(appReset())
    navigate({
      pathname: '/',
    })
  }



  return (
    <Page>
      <TopContainer
        onGoBackClick={gotoFrontpage}
        title={t('app:page-title-aarlig-kontroll')}
      >
        <Page.Block width="2xl" gutters as="main">
          <HStack padding="space-48" width="100%">
            <Spacer/>
            SØK
            <Spacer/>
          </HStack>
        </Page.Block>
      </TopContainer>
    </Page>
  )
}

export default AarligKontrollPage
