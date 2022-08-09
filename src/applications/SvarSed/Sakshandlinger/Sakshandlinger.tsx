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

const Sakshandlinger: React.FC<SakshandlingerProps> = ({sak}: SakshandlingerProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const replySed = useAppSelector(state => state.svarsed.replySed)

  const deleteCase = () => {
    if (sak.sakId && window.confirm(t('message:warning-are-you-sure-close-case'))) {
      dispatch(deleteSak(sak.sakId))
    }
  }

  const [waitingForOperation, setWaitingForOperation] = useState<boolean>(false)

  /** if we have a replied, from an operation started here, let's move to edit */
  useEffect(() => {
    if (!_.isEmpty(replySed) && !_.isEmpty(replySed!.sak) && waitingForOperation) {
      setWaitingForOperation(false)
      navigate({
        pathname: '/svarsed/edit/sak/' + replySed!.sak!.sakId + '/sed/new',
        search: window.location.search
      })
    }
  }, [replySed])

  let disableDeleteCase: string | undefined
  if (sak.erSakseier !== 'ja') {
    disableDeleteCase = t('message:warning-no-sakseier')
  } else {
    if (_.find(sak.sedListe, s => s.status === 'received' || s.status === 'sent') !== undefined) {
      disableDeleteCase = t('message:warning-case-has-received-sent-cases')
    }
  }
  const canCloseCase = sak.sakType !== 'H_BUC_01'

  const _createXSed = (sedType: string) => {
    setWaitingForOperation(true)
    dispatch(createXSed(sedType, sak))
  }

  const _createH001Sed = () => {
    setWaitingForOperation(true)
    dispatch(createH001Sed(sak))
  }

  let disabledSakshandlinger: JSX.Element[] = [];
  const addDisabledSakshandling = (sakshandlingFragment: JSX.Element) => {
    disabledSakshandlinger.push(sakshandlingFragment);
    return null;
  }

  const createDisabledSakshandlingFragment = (tooltipLabel: string, label: string) => {
    return(
      <>
        <Tooltip label={(
          <div style={{ maxWidth: '400px' }}>
            {tooltipLabel}
          </div>
        )}
        >
          <BodyLong>
            {label}
          </BodyLong>
        </Tooltip>
        <VerticalSeparatorDiv />
      </>
    )
  }

  return (

    <Panel border>
      <Heading size='small'>Sakshandlinger</Heading>
      <VerticalSeparatorDiv />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {sak.erSakseier === 'ja' && (
        <>
          {addDisabledSakshandling(createDisabledSakshandlingFragment(t('message:warning-rina'), t('label:legg-til-deltaker')))}
          {canCloseCase && (
            <>
              <Link href='#' onClick={() => _createXSed('X001')}>
                {t('label:lukk-sak-global')}
              </Link>
              <VerticalSeparatorDiv />
            </>
          )}
        </>
      )}
      {addDisabledSakshandling(createDisabledSakshandlingFragment(t('message:warning-rina'),t('label:lukk-sak-lokalt')))}
      {addDisabledSakshandling(createDisabledSakshandlingFragment(t('message:warning-rina'),t('label:videresend-sak')))}
      {sak.sakshandlinger?.indexOf('Delete_Case') >= 0
        ? disableDeleteCase
          ? addDisabledSakshandling(createDisabledSakshandlingFragment(disableDeleteCase, t('label:slett-sak')))
          : (
            <>
              <Link href='#' onClick={deleteCase}>
                {t('label:slett-sak')}
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
      {disabledSakshandlinger}
    </Panel>
  )
}

export default Sakshandlinger
