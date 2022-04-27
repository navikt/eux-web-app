import { Heading, Panel } from '@navikt/ds-react'
import { VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { Dd, Dl, Dt, HorizontalLineSeparator } from 'components/StyledComponents'
import { Sak } from 'declarations/types'
import React from 'react'

interface SaksopplysningerProps {
  sak: Sak | undefined
}

const Saksopplysninger = ({ sak }: SaksopplysningerProps) => {
  console.log(sak?.sakId)
  return (
    <Panel border style={{ margin: '0.1rem' }}>
      <Heading size='small'>Saksopplysninger</Heading>
      <VerticalSeparatorDiv />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      <Dl>
        <Dt>
          Vår rolle:
        </Dt>
        <Dd>
          Sakseier
        </Dd>
        <Dt>
          Andre deltakere:
        </Dt>
        <Dd>
          XXX
        </Dd>
        <Dt>
          Parter i saken:
        </Dt>
        <Dd>
          XXX
        </Dd>
        <Dt>
          Periode:
        </Dt>
        <Dd>
          01.01.1970 - 01.01.1970
        </Dd>
      </Dl>

    </Panel>
  )
}

export default Saksopplysninger
