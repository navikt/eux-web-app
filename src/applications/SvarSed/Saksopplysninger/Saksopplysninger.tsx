import { ExternalLink } from '@navikt/ds-icons'
import { BodyLong, Heading, Link, Panel } from '@navikt/ds-react'
import { HorizontalSeparatorDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { Dd, Dl, Dt, HorizontalLineSeparator } from 'components/StyledComponents'
import { Sak } from 'declarations/types'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface SaksopplysningerProps {
  sak: Sak
}

const Saksopplysninger = ({ sak }: SaksopplysningerProps) => {
  const { t } = useTranslation()
  return (
    <Panel border>
      <Heading size='small'>
        {t('label:saksopplysninger')}
      </Heading>
      <VerticalSeparatorDiv />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      <Dl>
        <Dt>
          {t('label:rina-saksnr') + ':'}
        </Dt>
        <Dd>
          <Link target='_blank' href={sak?.sakUrl} rel='noreferrer'>
            <span>
              {sak?.sakId}
            </span>
            <HorizontalSeparatorDiv size='0.35' />
            <ExternalLink />
          </Link>
        </Dd>
        <Dt>
          {t('label:vår-rolle')}:
        </Dt>
        <Dd>
          {sak.erSakseier === 'nei' && t('label:sakeier')}
          {sak.erSakseier === 'ja' && t('label:deltaker')}
          {_.isNil(sak.erSakseier) && t('label:unknown')}
        </Dd>
        <Dt>
          {t('label:andre-deltakere')}:
        </Dt>
        <Dd>
          {sak.motpart?.map(m => <BodyLong key={m}>{m}</BodyLong>)}
        </Dd>
      </Dl>
    </Panel>
  )
}

export default Saksopplysninger
