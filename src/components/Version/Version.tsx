import { Button, Heading, Modal } from '@navikt/ds-react'
import { State } from 'declarations/reducers'
import { ServerInfo } from 'declarations/types'
import React, { useState } from 'react'
import { useAppSelector } from 'store'
import Clipboard from './Clipboard'
import {APP_BRANCH_NAME, APP_BUILD_DATETIME, APP_BUILD_VERSION, APP_EESSI_KODEVERK, APP_REACT_LIB, APP_VERSION} from "../../constants/environment"
import styles from './Version.module.css'

export interface VersjonSelector {
  serverInfo: ServerInfo | undefined
}

const mapState = (state: State): VersjonSelector => ({
  serverInfo: state.app.serverinfo
})

const Version = () => {
  const [visVersjonDetaljer, setVisVersjonDetaljer] = useState(false)
  const { serverInfo } = useAppSelector(mapState)
  const toggleVersjon = () => {
    setVisVersjonDetaljer(!visVersjonDetaljer)
  }

  const versjon = APP_VERSION ? `v${APP_VERSION}` : '(ukjent)'
  const byggTidspunkt = () => APP_BUILD_DATETIME || '(ukjent)'
  const byggVersjon = () => APP_BUILD_VERSION || '(ukjent)'
  const branchVersjon = () => APP_BRANCH_NAME || '(lokal)'
  const eessiKodeverk = () => APP_EESSI_KODEVERK || '(ukjent)'
  const reactLibVersion = () => APP_REACT_LIB || '(ukjent)'

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
          <div className={styles.modalContent}>
            <dl>
              <Heading size='small'>Web</Heading>
              <dt className={styles.odd}>Build time</dt><dd className={styles.odd}>{byggTidspunkt()}</dd>
              <dt>Build version</dt><dd>{byggVersjon()}</dd>
              <dt className={styles.odd}>Branch</dt><dd className={styles.odd}>{branchVersjon()}</dd>
              <dt>eessi-kodeverk</dt><dd>{eessiKodeverk()}</dd>
              <dt className={styles.odd}>React</dt><dd className={styles.odd}>{reactLibVersion()}</dd>
              <p />
              <Heading size='small'>Server</Heading>
              <dt className={styles.odd}>Namespace</dt><dd className={styles.odd}>{serverInfo.namespace ?? '-'}</dd>
              <dt>Cluster</dt><dd>{serverInfo.cluster ?? '-'}</dd>
              <dt className={styles.odd}>BranchName</dt><dd className={styles.odd}>{serverInfo.branchName ?? '-'}</dd>
              <dt>Vera</dt><dd>{serverInfo.veraUrl ?? '-'}</dd>
              <dt className={styles.odd}>Gosys</dt><dd className={styles.odd}>{serverInfo.gosysURL ?? '-'}</dd>
              <dt>VersionHash</dt><dd>{serverInfo.longVersionHash ?? '-'}</dd>
            </dl>
            <Button onClick={copyToClipBoard}>
              Klikk for å kopiere versjonsinfo
            </Button>
          </div>
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
