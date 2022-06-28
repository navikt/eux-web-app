import { BodyLong, Heading, Link, Panel } from '@navikt/ds-react'
import { VerticalSeparatorDiv } from '@navikt/hoykontrast'
import Tooltip from '@navikt/tooltip'
import { deleteSak, loadReplySed } from 'actions/svarsed'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import { XSed, Kjoenn, H001Sed } from 'declarations/sed'
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
  changeMode,
}: SakshandlingerProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()


  const closeCase = () => {
    if (sak.sakId && window.confirm('message:warning-are-you-sure-close-case')) {
      dispatch(deleteSak(sak.sakId))
    }
  }

  const createH001Sed = () => {
    const h001sed: H001Sed = {
      sedType: 'H001',
      sedVersjon: '4.2',
      sak,
      bruker: {
        personInfo: {
          fornavn: sak.fornavn,
          etternavn: sak.etternavn,
          kjoenn: sak.kjoenn.toUpperCase() as Kjoenn,
          foedselsdato: sak.foedselsdato,
          statsborgerskap: [{ land: 'NO' }],
          pin: [{
            land: 'NO',
            identifikator: sak.fnr
          }]
        }
      }
    }
    dispatch(loadReplySed(h001sed))
    changeMode('B')
  }

  const createXSed = (sedType: string) => {
    const replySed: XSed = {
      sedType,
      sak,
      sedVersjon: '1',
      bruker: {
        fornavn: sak?.fornavn ?? '',
        etternavn: sak?.etternavn ?? '',
        kjoenn: (sak?.kjoenn.toUpperCase() ?? 'U') as Kjoenn,
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
      <Tooltip label={(
        <div style={{ maxWidth: '400px' }}>
          {t('message:warning-rina')}
        </div>
        )}
      >
        <BodyLong>
          {t('label:legg-til-deltaker')}
        </BodyLong>
      </Tooltip>
      <VerticalSeparatorDiv />
      <Tooltip label={(
        <div style={{ maxWidth: '400px' }}>
          {t('message:warning-rina')}
        </div>
      )}
      >
        <BodyLong>
          {t('label:lukk-sak-lokakt')}
        </BodyLong>
      </Tooltip>
      <VerticalSeparatorDiv />
      <Tooltip label={(
        <div style={{ maxWidth: '400px' }}>
          {t('message:warning-rina')}
        </div>
      )}
      >
        <BodyLong>
          {t('label:videresend-sak')}
        </BodyLong>
      </Tooltip>
      <VerticalSeparatorDiv />
      {sak.sakshandlinger?.indexOf('Close_Case') >= 0 && (
        <>
          <Link href='#' onClick={closeCase}>
            {t('label:close-case')}
          </Link>
          <VerticalSeparatorDiv />
        </>
      )}
      {sak.sakshandlinger?.indexOf('H001') >= 0 && (
        <>
          <Link href='#' onClick={() => createH001Sed()}>
            {t('label:create-H001')}
          </Link>
          <VerticalSeparatorDiv />
        </>
      )}
      {sak.sakshandlinger?.indexOf('X009') >= 0 && (
        <>
          <Link href='#' onClick={() => createXSed('X009')}>
            {t('label:create-X009')}
          </Link>
          <VerticalSeparatorDiv />
        </>
      )}
      {sak.sakshandlinger?.indexOf('X012') >= 0 && (
        <>
          <Link href='#' onClick={() => createXSed('X012')}>
            {t('buc:X012')}
          </Link>
          <VerticalSeparatorDiv />
        </>
      )}
    </Panel>
  )
}

export default Sakshandlinger
