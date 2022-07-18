import { BodyLong, Heading, Link, Panel } from '@navikt/ds-react'
import { VerticalSeparatorDiv } from '@navikt/hoykontrast'
import Tooltip from '@navikt/tooltip'
import { createH001Sed, createXSed, deleteSak } from 'actions/svarsed'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import { Sak } from 'declarations/types'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'

export interface SakshandlingerProps {
  sak: Sak
}

const Sakshandlinger: React.FC<SakshandlingerProps> = ({
  sak
}: SakshandlingerProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const replySed = useAppSelector(state => state.svarsed.replySed)

  const closeCase = () => {
    if (sak.sakId && window.confirm('message:warning-are-you-sure-close-case')) {
      dispatch(deleteSak(sak.sakId))
    }
  }

  const [waitingForOperation, setWaitingForOperation] = useState<boolean>(false)

  /** if we have a replysed, from an operation staeted here, let's move to edit */
  useEffect(() => {
    if (!_.isEmpty(replySed) && !_.isEmpty(replySed!.sak) && waitingForOperation) {
      setWaitingForOperation(false)
      navigate('/svarsed/edit/sak/' + replySed!.sak!.sakId + '/sed/new')
    }
  }, [replySed])

  let disableCloseCase: string | undefined
  if (sak.erSakseier !== 'ja') {
    disableCloseCase = t('message:warning-no-sakseier')
  } else {
    if (_.find(sak.sedListe, s => s.status === 'received' || s.status === 'sent') !== undefined) {
      disableCloseCase = t('message:warning-case-has-received-sent-cases')
    }
  }

  const _createXSed = (sedType: string) => {
    setWaitingForOperation(true)
    dispatch(createXSed(sedType, sak))
  }

  const _createH001Sed = () => {
    setWaitingForOperation(true)
    dispatch(createH001Sed(sak))
  }

  return (
    <Panel border>
      <Heading size='small'>Sakshandlinger</Heading>
      <VerticalSeparatorDiv />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {sak.erSakseier === 'ja' && (
        <>
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
        </>
      )}
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
      {sak.sakshandlinger?.indexOf('Close_Case') >= 0
        ? disableCloseCase
            ? (
              <>
                <Tooltip label={disableCloseCase}>
                  <Link href='javascript:void(0);'>
                    {t('label:close-case')}
                  </Link>
                </Tooltip>
                <VerticalSeparatorDiv />
              </>
              )
            : (
              <>
                <Link href='#' onClick={closeCase}>
                  {t('label:close-case')}
                </Link>
                <VerticalSeparatorDiv />
              </>
              )
        : null}
      {sak.sakshandlinger?.indexOf('H001') >= 0 && (
        <>
          <Link href='#' onClick={() => _createH001Sed()}>
            {t('label:create-H001')}
          </Link>
          <VerticalSeparatorDiv />
        </>
      )}
      {sak.sakshandlinger?.indexOf('X009') >= 0 && (
        <>
          <Link href='#' onClick={() => _createXSed('X009')}>
            {t('label:create-X009')}
          </Link>
          <VerticalSeparatorDiv />
        </>
      )}
      {sak.sakshandlinger?.indexOf('X012') >= 0 && (
        <>
          <Link href='#' onClick={() => _createXSed('X012')}>
            {t('buc:X012')}
          </Link>
          <VerticalSeparatorDiv />
        </>
      )}
    </Panel>
  )
}

export default Sakshandlinger
