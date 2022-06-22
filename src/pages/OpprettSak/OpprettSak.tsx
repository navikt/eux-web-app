import { Container, Content, Margin } from '@navikt/hoykontrast'
import { updateReplySed } from 'actions/svarsed'
import CreateSak from 'applications/OpprettSak/CreateSak/CreateSak'
import SakSidebar from 'applications/OpprettSak/SakSidebar/SakSidebar'
import SEDDetails from 'applications/SvarSed/SEDDetails/SEDDetails'
import TopContainer from 'components/TopContainer/TopContainer'
import SEDEdit from 'pages/SvarSed/SEDEdit'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const OpprettSakPage = (): JSX.Element => {
  const { t } = useTranslation()

  const [_currentPage, _setCurrentPage] = useState<string>('A')

  const changeMode = (newPage: string) => {
    _setCurrentPage(newPage)
  }

  return (
    <TopContainer title={t('app:page-title-opprettsak')}>
      <Container>
        <Margin />
        <Content style={{ flex: 6 }}>
          {_currentPage === 'A' && (
            <CreateSak changeMode={changeMode} />
          )}
          {_currentPage === 'B' && (
            <SEDEdit changeMode={changeMode}/>
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
