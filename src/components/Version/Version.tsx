import classnames from 'classnames'
import { State } from 'declarations/reducers'
import { ServerInfo } from 'declarations/types'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Clipboard from './Clipboard'

export interface VersjonSelector {
  serverInfo: ServerInfo | undefined;
}

const mapState = (state: State): VersjonSelector => ({
  serverInfo: state.app.serverinfo
})

const VersionDiv = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  color: #3e3832;
  overflow: hidden;
  max-height: 2.3em;
  margin: 2px;
  padding: 0em 0.5em;
  z-index: 99999;

  dl {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  dt {
    clear:both;
    font-weight: bold;
    padding-right: 3px;
    width: 30%;
  }

  dd {
    margin: 0;
    width: 70%;
  }
  &.App__versjonering--vis {
    max-height: inherit;
    overflow: visible;
    background-color: #cbcbcb;
    border: 1px solid #ababab;
  }

  .App__versjonering__kopierknapp {
    display: block;
    border: 0;
    padding: 0;
    background-color: transparent;
    text-decoration: underline;
  }

  .App__versjonering__spark {
    position: relative;
    display: block;

    &:link,
    &:visited {
      color: #000000;
    }
  }
`
const ExpandButton = styled.button`
  border: 0;
  background-color: transparent;
  outline: none;
  padding: 0;
`

const Version = () => {
  const [visVersjonDetaljer, setVisVersjonDetaljer] = useState(false)
  const { serverInfo } = useSelector<State, VersjonSelector>(mapState)
  const toggleVersjon = () => {
    setVisVersjonDetaljer(!visVersjonDetaljer)
  }

  const versjon = process.env.REACT_APP_VERSION ? `v${process.env.REACT_APP_VERSION}` : '(ukjent)'
  const byggTidspunkt = () => process.env.REACT_APP_BUILD_DATETIME || '(ukjent)'
  const byggVersjon = () => process.env.REACT_APP_BUILD_VERSION || '(ukjent)'
  const branchVersjon = () => process.env.REACT_APP_BRANCH_NAME || '(lokal)'
  const eessiKodeverk = () => process.env.REACT_APP_EESSI_KODEVERK || '(ukjent)'
  const reactLibVersion = () => process.env.REACT_APP_REACT_LIB || '(ukjent)'

  const copyToClipBoard = () => {
    const clientVersionString = `WEB; Versjon: ${versjon}, Byggetidspunkt: ${byggTidspunkt()}, Byggeversjon: ${byggVersjon()}, Branch: ${branchVersjon()}, eessi-kodeverk:${eessiKodeverk()}, React:${reactLibVersion()}`
    const { namespace, cluster, branchName, veraUrl, gosysURL, longVersionHash } = serverInfo!
    const serverVersionString = `SERVER; Namespace: ${namespace}, Cluster: ${cluster} BranchName: ${branchName}, Vera: ${veraUrl}, Gosys: ${gosysURL}, VersionHash: ${longVersionHash}, Branch: ${branchVersjon()}`
    const versionString = clientVersionString + '\n' + serverVersionString
    Clipboard.copy(versionString)
  }

  if (!serverInfo) {
    return null
  }
  return (
    <VersionDiv
      className={classnames({ 'App__versjonering--vis': visVersjonDetaljer })}
      onClick={toggleVersjon}
    >
      <ExpandButton>
        {versjon}
      </ExpandButton>
      {visVersjonDetaljer && serverInfo && (
        <>
          <dl>
            <dt>Web</dt><dd />
            <dt>Build time:</dt><dd>{byggTidspunkt()}</dd>
            <dt>Build version:</dt><dd>{byggVersjon()}</dd>
            <dt>Branch:</dt><dd>{branchVersjon()}</dd>
            <dt>eessi-kodeverk:</dt><dd>{eessiKodeverk()}</dd>
            <dt>React:</dt><dd>{reactLibVersion()}</dd>
            <dt>&nbsp;</dt><dd />
            <dt>Server</dt><dd />
            <dt>Namespace:</dt><dd>{serverInfo.namespace}</dd>
            <dt>Cluster:</dt><dd>{serverInfo.cluster}</dd>
            <dt>BranchName:</dt><dd>{serverInfo.branchName}</dd>
            <dt>Vera:</dt><dd>{serverInfo.veraUrl}</dd>
            <dt>Gosys:</dt><dd>{serverInfo.gosysURL}</dd>
            <dt>VersionHash:</dt><dd>{serverInfo.longVersionHash}</dd>
          </dl>
          <button className='App__versjonering__kopierknapp' onClick={copyToClipBoard}>
            Klikk for å kopiere versjonsinfo
          </button>
        </>
      )}
    </VersionDiv>
  )
}

export default Version
