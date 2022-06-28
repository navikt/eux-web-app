import { Container, Content, Margin } from '@navikt/hoykontrast'
import { updateReplySed } from 'actions/svarsed'
import CreateSak from 'applications/OpprettSak/CreateSak/CreateSak'
import SakSidebar from 'applications/OpprettSak/SakSidebar/SakSidebar'
import SakBanner from 'applications/SvarSed/Sak/SakBanner'
import SEDDetails from 'applications/SvarSed/SEDDetails/SEDDetails'
import TopContainer from 'components/TopContainer/TopContainer'
import { State } from 'declarations/reducers'
import { Sak } from 'declarations/types'
import SEDEdit from 'pages/SvarSed/SEDEdit'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'store'

interface OpprettSakSelector {
  currentSak: Sak | undefined
}

const mapState = (state: State) => ({
  currentSak: state.svarsed.currentSak
})

export const OpprettSakPage = (): JSX.Element => {
  const { t } = useTranslation()
  const { currentSak }: OpprettSakSelector = useAppSelector(mapState)

  const [_currentPage, _setCurrentPage] = useState<string>('A')

  const changeMode = (newPage: string) => {
    _setCurrentPage(newPage)
  }

  return (
    <TopContainer title={t('app:page-title-opprettsak')}>
      <SakBanner sak={currentSak} />
      <Container>
        <Margin />
        <Content style={{ flex: 6 }}>
          {_currentPage === 'A' && (
            <CreateSak changeMode={changeMode} />
          )}
          {_currentPage === 'B' && (
            <SEDEdit changeMode={changeMode} />
          )}
        </Content>
        <Content style={{ flex: 2 }}>
          {_currentPage === 'A' && (
            <SakSidebar />
          )}
          {_currentPage === 'B' && (
            <SEDDetails
              updateReplySed={updateReplySed}
            />
          )}
        </Content>
        <Margin />
      </Container>
    </TopContainer>
  )
}

export default OpprettSakPage
