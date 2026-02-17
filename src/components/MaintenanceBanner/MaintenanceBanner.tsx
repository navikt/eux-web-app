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
      Pga. oppdatering fra CDM versjon 4.3 til versjon 4.4 vil det ikke være mulig å opprette nye SED i nEESSI mellom fredag 13.2 og mandag 16.2.
    </Alert>
  )
}

export default MaintenanceBanner
