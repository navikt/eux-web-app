import { BodyShort, Heading, Link, Panel } from '@navikt/ds-react'
import { VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { loadReplySed } from 'actions/svarsed'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import { XSed, Kjoenn } from 'declarations/sed'
import { Sak } from 'declarations/types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'store'

export interface SakshandlingerProps {
  sak: Sak
  changeMode: (newPage: string) => void
}

const Sakshandlinger: React.FC<SakshandlingerProps> = ({
  sak,
  changeMode
}: SakshandlingerProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const createSed = (sedType: string) => {
    const replySed: XSed = {
      sedType,
      sedVersjon: '1',
      bruker: {
        fornavn: sak?.fornavn ?? '',
        etternavn: sak?.etternavn ?? '',
        kjoenn: (sak?.kjoenn ?? 'U') as Kjoenn,
        foedselsdato: sak?.foedselsdato ?? '',
        statsborgerskap: [{ land: 'NO' }],
        pin: [{
          land: 'NO',
          identifikator: sak?.fnr
        }]
      }
    }

    dispatch(loadReplySed(replySed))
    changeMode('B')
  }

  return (
    <Panel border>
      <Heading size='small'>Sakshandlinger</Heading>
      <VerticalSeparatorDiv />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      <Link href='#' onClick={() => createSed('X001')}>
        X001 - {t('el:option-mainform-avslutning')}
      </Link>
      <VerticalSeparatorDiv />
      <Link href='#' onClick={() => createSed('X009')}>
        X009 - {t('el:option-mainform-påminnelse')}
      </Link>
      <VerticalSeparatorDiv />
      <Link href='#' onClick={() => createSed('X011')}>
        X011 - {t('buc:X011')}
      </Link>
      <VerticalSeparatorDiv />
      <Link href='#' onClick={() => createSed('X012')}>
        X012 - {t('buc:X012')}
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
