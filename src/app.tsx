import {Route, Routes} from "react-router-dom";
import Pages from "pages/index";
import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "./store";
import {
  getEnheter,
  getSaksbehandler,
  getServerinfo,
  getUtgaarDato,
  preload,
  resetLoginRedirect,
  setStatusParam
} from "actions/app";
import {State} from "./declarations/reducers";
import {ReplySed} from "./declarations/sed";
import {Sak} from "./declarations/types";


export interface AppSelector {
  loginRedirect: boolean | undefined
  replySed: ReplySed | null | undefined
  currentSak:  Sak | null | undefined
}
const mapState = (state: State): AppSelector => ({
  loginRedirect: state.app.loginRedirect,
  replySed: state.svarsed.replySed,
  currentSak: state.svarsed.currentSak
})

export const App = () => {
    const dispatch = useAppDispatch()
    const { loginRedirect, currentSak, replySed } = useAppSelector(mapState)
    const params: URLSearchParams = new URLSearchParams(window.location.search)
    const isNewSed = window.location.pathname.indexOf("/sed/new") > 0

    useEffect(() => {
      params.forEach((value, key) => {
          dispatch(setStatusParam(key, value))
      })
      dispatch(preload())
      dispatch(getSaksbehandler())
      dispatch(getEnheter())
      dispatch(getServerinfo())
      dispatch(getUtgaarDato())
    }, [])

    useEffect(() => {
      let redirect = window.location.pathname
      if(loginRedirect) {
        if (isNewSed && replySed && replySed.sed?.sedId) {
          redirect = redirect.replace("new", replySed.sed?.sedId)
        } else if (isNewSed && currentSak) {
          redirect = "/svarsed/view/sak/" + currentSak.sakId
        }
        dispatch(resetLoginRedirect())
        window.location.href = "/oauth2/login?redirect=" + window.location.origin + redirect
      }
    },[loginRedirect, replySed, currentSak])


    return (
        <Routes>
            <Route path='/vedlegg' element={<Pages.Vedlegg />} />
            <Route path='/svarsed/new' element={<Pages.SvarSed type='new' />} />
            <Route path='/svarsed/search' element={<Pages.SvarSed type='search' />} />
            <Route path='/svarsed/view/sak/:sakId' element={<Pages.SvarSed type='view' />} />
            <Route path='/svarsed/edit/sak/:sakId/sed/:sedId' element={<Pages.SvarSed type='edit' />} />
            <Route path='/journalfoering/sak/:sakId' element={<Pages.JournalFoering/>} />
            <Route path='/pdu1/search' element={<Pages.PDU1 type='search' />} />
            <Route path='/pdu1/edit/postId/:journalpostId/docId/:dokumentInfoId/fagsak/:fagsak' element={<Pages.PDU1 type='edit' />} />
            <Route path='/pdu1/create/fnr/:fnr/fagsak/:fagsak/saksreferanse/:saksreferanse' element={<Pages.PDU1 type='create' />} />
            <Route path='/*' element={<Pages.Forside />} />
            <Route element={<Pages.UkjentSide />} />
        </Routes>
    )
}
