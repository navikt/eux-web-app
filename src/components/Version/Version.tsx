import { Button, Heading, Modal } from '@navikt/ds-react'
import { State } from 'declarations/reducers'
import { ServerInfo } from 'declarations/types'
import React, { useState } from 'react'
import { useAppSelector } from 'store'
import styled from 'styled-components'
import Clipboard from './Clipboard'

export interface VersjonSelector {
  serverInfo: ServerInfo | undefined
}

const mapState = (state: State): VersjonSelector => ({
  serverInfo: state.app.serverinfo
})

const ModalDiv = styled.div`
  dt {
    width: 200px;
    float: left;
    clear: left;
    font-weight: bold;
  }
  dt::after {
     content: ":";
  }
  .odd {
    background: lightgray;
  }
  dd {
   margin-left: 200px;
  }
`

const Version = () => {
  const [visVersjonDetaljer, setVisVersjonDetaljer] = useState(false)
  const { serverInfo } = useAppSelector(mapState)
  const toggleVersjon = () => {
    setVisVersjonDetaljer(!visVersjonDetaljer)
  }

  const versjon = import.meta.env.REACT_APP_VERSION ? `v${import.meta.env.REACT_APP_VERSION}` : '(ukjent)'
  const byggTidspunkt = () => import.meta.env.REACT_APP_BUILD_DATETIME || '(ukjent)'
  const byggVersjon = () => import.meta.env.REACT_APP_BUILD_VERSION || '(ukjent)'
  const branchVersjon = () => import.meta.env.REACT_APP_BRANCH_NAME || '(lokal)'
  const eessiKodeverk = () => import.meta.env.REACT_APP_EESSI_KODEVERK || '(ukjent)'
  const reactLibVersion = () => import.meta.env.REACT_APP_REACT_LIB || '(ukjent)'

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
    <>
      <Modal onClose={() => setVisVersjonDetaljer(false)} open={visVersjonDetaljer && !!serverInfo} header={{heading: "Versjonsinfo"}}>
        <Modal.Body>
          <ModalDiv>
            <dl>
              <Heading size='small'>Web</Heading>
              <dt className='odd'>Build time</dt><dd className='odd'>{byggTidspunkt()}</dd>
              <dt>Build version</dt><dd>{byggVersjon()}</dd>
              <dt className='odd'>Branch</dt><dd className='odd'>{branchVersjon()}</dd>
              <dt>eessi-kodeverk</dt><dd>{eessiKodeverk()}</dd>
              <dt className='odd'>React</dt><dd className='odd'>{reactLibVersion()}</dd>
              <p />
              <Heading size='small'>Server</Heading>
              <dt className='odd'>Namespace</dt><dd className='odd'>{serverInfo.namespace ?? '-'}</dd>
              <dt>Cluster</dt><dd>{serverInfo.cluster ?? '-'}</dd>
              <dt className='odd'>BranchName</dt><dd className='odd'>{serverInfo.branchName ?? '-'}</dd>
              <dt>Vera</dt><dd>{serverInfo.veraUrl ?? '-'}</dd>
              <dt className='odd'>Gosys</dt><dd className='odd'>{serverInfo.gosysURL ?? '-'}</dd>
              <dt>VersionHash</dt><dd>{serverInfo.longVersionHash ?? '-'}</dd>
            </dl>
            <Button onClick={copyToClipBoard}>
              Klikk for å kopiere versjonsinfo
            </Button>
          </ModalDiv>
        </Modal.Body>
      </Modal>
      <div style={{ textAlign: 'right' }}>
        <Button variant='tertiary' size='small' onClick={toggleVersjon}>
          Versjon {versjon}
        </Button>
      </div>
    </>
  )
}

export default Version
