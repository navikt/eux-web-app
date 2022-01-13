import CreateSak from 'applications/OpprettSak/CreateSak/CreateSak'
import SlidePage, { ChangeModeFunction } from 'components/SlidePage/SlidePage'
import TopContainer from 'components/TopContainer/TopContainer'
import SEDEdit from 'pages/SvarSed/SEDEdit'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const OpprettSakPage = (): JSX.Element => {
  const { t } = useTranslation()
  const changeModeFunc = React.useRef<ChangeModeFunction>(null)

  const changeMode = (newPage: string, newDirection: string, newCallback?: () => void) => {
    if (changeModeFunc.current !== null) {
      changeModeFunc.current(newPage, newDirection, newCallback)
    }
  }

  return (
    <TopContainer title={t('app:page-title-opprettsak')}>
      <SlidePage
        withSidebar={false}
        changeModeFunc={changeModeFunc}
        initialPage='A'
        initialDirection='none'
        divA1={(<CreateSak changeMode={changeMode} />)}
        divB1={(<SEDEdit changeMode={changeMode} />)}
      />
    </TopContainer>
  )
}

export default OpprettSakPage
