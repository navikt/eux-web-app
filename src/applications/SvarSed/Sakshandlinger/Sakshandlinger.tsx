import { BodyLong, Heading, Link, Panel, ReadMore } from '@navikt/ds-react'
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

  const _createXSed = (sedType: string) => {
    setWaitingForOperation(true)
    dispatch(createXSed(sedType, sak))
  }

  const _createH001Sed = () => {
    setWaitingForOperation(true)
    dispatch(createH001Sed(sak))
  }

  const createDisabledSakshandlingFragment = (sakshandling: string) => {
    return(
      <>
        <Tooltip label={(
          <div style={{ maxWidth: '400px' }}>
            {t('message:warning-rina')}
          </div>
        )}
        >
          <BodyLong>
            {t('sakshandlinger:' + sakshandling, t('sakshandlinger:opprett', {SED: sakshandling}))}
          </BodyLong>
        </Tooltip>
        <VerticalSeparatorDiv />
      </>
    )
  }

  const createSakshandlingFragment = (sakshandling: string) => {
    let onClickFunction: Function;
    if(sakshandling.startsWith("X")){
      onClickFunction = () => _createXSed(sakshandling);
    } else if (sakshandling === "Delete_Case"){
      onClickFunction = () => deleteCase();
    } else  if (sakshandling === "H001"){
      onClickFunction = () => _createH001Sed()
    }

    return(
      <>
        <Link href='#' onClick={() => onClickFunction()}>
          {t('sakshandlinger:' + sakshandling, t('sakshandlinger:opprett', {SED: sakshandling}))}
        </Link>
        <VerticalSeparatorDiv />
      </>
    )
  }


  const getSakshandlinger = () => {
    let sakshandlinger: JSX.Element[] = [];
    let disabledSakshandlinger: JSX.Element[] = [];
    sak.sakshandlinger.forEach((sakshandling) => {
      if(allowedSakshandlinger.includes(sakshandling)){
        sakshandlinger.push(createSakshandlingFragment(sakshandling))
      } else if (!hiddenSaksbehandlinger.includes(sakshandling)){
        disabledSakshandlinger.push(createDisabledSakshandlingFragment(sakshandling))
      }

    })
    return {sakshandlinger, disabledSakshandlinger};
  }

  const allowedSakshandlinger = ["H001", "X001", "X009", "F001", "F002", "F004", "F022", "F023", "F026", "F027", "F016", "F003", "R001", "R003", "R004", "Delete_Case"]
  const hiddenSaksbehandlinger = ["multipleParticipants", "singleParticipant"]
  const {sakshandlinger, disabledSakshandlinger} = getSakshandlinger();

  return (
    <>
      <Panel border>
        <Heading size='small'>Sakshandlinger</Heading>
        <VerticalSeparatorDiv />
        <HorizontalLineSeparator />
        <VerticalSeparatorDiv />
        {sakshandlinger}
        {disabledSakshandlinger.length > 0 &&
          <ReadMore header="Handlinger tilgjengelig i RINA">
            {disabledSakshandlinger}
          </ReadMore>
        }
      </Panel>
    </>
  )
}

export default Sakshandlinger
