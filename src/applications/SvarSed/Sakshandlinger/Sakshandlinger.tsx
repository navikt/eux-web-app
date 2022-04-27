import { BodyShort, Heading, Link, Panel } from '@navikt/ds-react'
import { VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import React from 'react'

const Sakshandlinger = () => {
  return (
    <Panel border>
      <Heading size='small'>Sakshandlinger</Heading>
      <VerticalSeparatorDiv />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      <Link href='#'>
        X009 - Påminnelse
      </Link>
      <VerticalSeparatorDiv />
      <Link href='#'>
        H001 - Meddelse av / anmodning om informasjon
      </Link>
      <VerticalSeparatorDiv />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      <BodyShort>
        Ingen flere sakshandlinger er tilgjengelige i nEESSI.
        Åpne sak i RINA for andre mulige handlinger.
      </BodyShort>
    </Panel>
  )
}

export default Sakshandlinger
