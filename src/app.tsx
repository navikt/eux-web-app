import {Route, Routes} from "react-router-dom";
import Pages from "pages/index";
import React, {useEffect} from "react";
import {useAppDispatch} from "./store";
import {getEnheter, getSaksbehandler, getServerinfo, getUtgaarDato, preload, setStatusParam} from "actions/app";

export const App = () => {
    const dispatch = useAppDispatch()
    const params: URLSearchParams = new URLSearchParams(window.location.search)

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

    return (
        <Routes>
            <Route path='/vedlegg' element={<Pages.Vedlegg />} />
            <Route path='/svarsed/new' element={<Pages.SvarSed type='new' />} />
            <Route path='/svarsed/search' element={<Pages.SvarSed type='search' />} />
            <Route path='/svarsed/view/sak/:sakId' element={<Pages.SvarSed type='view' />} />
            <Route path='/svarsed/edit/sak/:sakId/sed/:sedId' element={<Pages.SvarSed type='edit' />} />
            <Route path='/pdu1/search' element={<Pages.PDU1 type='search' />} />
            <Route path='/pdu1/edit/postId/:journalpostId/docId/:dokumentInfoId/fagsak/:fagsak' element={<Pages.PDU1 type='edit' />} />
            <Route path='/pdu1/create/fnr/:fnr/fagsak/:fagsak' element={<Pages.PDU1 type='create' />} />
            <Route path='/*' element={<Pages.Forside />} />
            <Route element={<Pages.UkjentSide />} />
        </Routes>
    )
}
