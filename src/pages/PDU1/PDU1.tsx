import TopContainer from 'components/TopContainer/TopContainer'
import { Systemtittel } from 'nav-frontend-typografi'
import { Container, Content, Margin } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'

const PDU1 = () => {

  const {t} = useTranslation()
   return (
    <TopContainer>
      <Container>
        <Margin />
        <Content>
          <Systemtittel>
            {t('label:opprett-sak')}
          </Systemtittel>
        </Content>
        <Margin/>
      </Container>
    </TopContainer>
   )
}


export default PDU1
