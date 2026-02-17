import { Alert } from '@navikt/ds-react'
import { State } from 'declarations/reducers'
import React from 'react'
import { useAppSelector } from 'store'
import styles from './MaintenanceBanner.module.css'

const mapState = (state: State) => ({
  featureMaintenanceBanner: state.app.featureToggles?.featureMaintenanceBanner
})

const MaintenanceBanner: React.FC = (): JSX.Element | null => {
  const { featureMaintenanceBanner } = useAppSelector(mapState)

  if (!featureMaintenanceBanner) {
    return null
  }

  return (
    <Alert
      variant='warning'
      className={styles.maintenanceBanner}
    >
      I forbindelse med oppdatering fra CDM versjon 4.3 til versjon 4.4 vil det ikke være mulig å
      opprette nye BUC i nEESSI mellom fredag 20.2.2026 og mandag 23.2.2026
    </Alert>
  )
}

export default MaintenanceBanner
