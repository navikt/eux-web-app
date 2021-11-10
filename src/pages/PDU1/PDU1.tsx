import { setStatusParam } from 'actions/app'
import * as svarsedActions from 'actions/svarsed'
import SEDDetails from 'applications/SvarSed/SEDDetails/SEDDetails'
import SEDLoadSave from 'applications/SvarSed/SEDLoadSave/SEDLoadSave'
import SlidePage, { ChangeModeFunction } from 'components/SlidePage/SlidePage'
import { SideBarDiv } from 'components/StyledComponents'
import SEDEditor from 'pages/SvarSed/SEDEditor'
import SEDSelection from 'pages/SvarSed/SEDSelection'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

export const PDU1Page = (): JSX.Element => {
  const storageKey = 'replySed'
  const [_mounted, setMounted] = useState<boolean>(false)
  const dispatch = useDispatch()

  const changeModeFunc = React.useRef<ChangeModeFunction>(null)

  const changeMode = (newPage: string, newDirection: string, newCallback?: () => void) => {
    if (changeModeFunc.current !== null) {
      changeModeFunc.current(newPage, newDirection, newCallback)
    }
  }

  useEffect(() => {
    if (!_mounted) {
      const params: URLSearchParams = new URLSearchParams(location.search)
      const rinasaksnummerParam: string | null = params.get('rinasaksnummer')

      const fnrParam: string | null = params.get('fnr')
      if (rinasaksnummerParam || fnrParam) {
        setStatusParam('rinasaksnummerOrFnr', rinasaksnummerParam || fnrParam || undefined)
        dispatch(svarsedActions.querySaksnummerOrFnr(rinasaksnummerParam || fnrParam || undefined))
      }
      setMounted(true)
    }
  }, [_mounted])

  return (
    <SlidePage
      changeModeFunc={changeModeFunc}
      initialPage='A'
      initialDirection='none'
      divA1={(<SEDSelection changeMode={changeMode} />)}
      divA2={(
        <SideBarDiv>
          <SEDLoadSave
            storageKey={storageKey}
            changeMode={changeMode}
          />
        </SideBarDiv>
      )}
      divB1={(<SEDEditor changeMode={changeMode} />)}
      divB2={(
        <SideBarDiv>
          <SEDDetails />
        </SideBarDiv>
      )}
    />
  )
}

export default PDU1Page
