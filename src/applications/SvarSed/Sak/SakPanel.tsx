import { FilesIcon, ExternalLinkIcon } from '@navikt/aksel-icons'
import {Alert, BodyLong, Heading, Link} from '@navikt/ds-react'
import {
  FlexCenterDiv,
  FlexCenterSpacedDiv,
  FlexDiv,
  HorizontalSeparatorDiv,
  PileDiv,
  RadioPanelBorder
} from '@navikt/hoykontrast'

import { Sak } from 'declarations/types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface SakPanelProps {
  sak: Sak
  onSelected: () => void
  onCopy: () => void
}

const RadioPanelBorderWithLinks = styled(RadioPanelBorder)`
  .navds-radio__label:before { display: none; } // hiding the checkbox
  .navds-radio__label {
    padding: 1rem !important;
  }
  .navds-radio__content {
     width: 100%;
  }
  .navds-radio__input:checked + .navds-radio__label .navds-link,
  .navds-radio__input:checked + .navds-radio__label .navds-link svg {
     color: var(--a-text-on-inverted);
  }

  background-color: var(--a-surface-default) !important;
  &:hover {
    background-color: var(--a-surface-action-subtle-hover) !important;
  }
`

const SakPanel = ({
  sak,
  onSelected,
  onCopy
}: SakPanelProps) => {
  const { t } = useTranslation()
  const sakId = sak.sakId + '-' + sak.sakType
  return (
    <RadioPanelBorderWithLinks
      ariaLabel={sak.sakType + ' - ' + sak.sakTittel}
      onChange={onSelected}
      value={sakId}
    >
      <PileDiv>
        <Heading size='small'>
          {sak.sakType + ' - ' + sak.sakTittel}
        </Heading>
        <FlexDiv>
          <BodyLong>
            {t('label:motpart')}:
          </BodyLong>
          <HorizontalSeparatorDiv size='0.35' />
          <BodyLong>
            {sak?.motpart?.join(', ') ?? '-'}
          </BodyLong>
        </FlexDiv>
        <FlexCenterSpacedDiv style={{ width: '100%' }}>
          <BodyLong>
            {t('label:sist-oppdatert') + ': ' + sak.sistEndretDato}
          </BodyLong>
          <FlexCenterDiv>
            <span>
              {t('label:saksnummer') + ': '}
            </span>
            <HorizontalSeparatorDiv />
            <Link target='_blank' href={sak.sakUrl} rel='noreferrer'>
              <span>
                {sak?.sakId}
              </span>
              <HorizontalSeparatorDiv size='0.35' />
              <ExternalLinkIcon />
            </Link>
            <HorizontalSeparatorDiv />
            <Link
              title={t('label:kopiere')} onClick={(e: any) => {
                e.preventDefault()
                e.stopPropagation()
                onCopy()
              }}
            >
              <FilesIcon />
            </Link>
          </FlexCenterDiv>
        </FlexCenterSpacedDiv>
        {sak.sensitiv && (
          <Alert size="small" variant='warning'>
            <span>{t('label:sensitivSak')}</span>
          </Alert>
        )}
      </PileDiv>
    </RadioPanelBorderWithLinks>
  )
}

export default SakPanel
