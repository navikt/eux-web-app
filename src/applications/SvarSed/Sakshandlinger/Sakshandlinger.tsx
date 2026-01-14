import {BodyLong, Box, Heading, Link, ReadMore, Tooltip, VStack} from '@navikt/ds-react'
import {createF002Sed, createFSed, createH001Sed, createXSed, deleteSak} from 'actions/svarsed'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import {Sak, Sed} from 'declarations/types'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'
import {getAllowed, HIDDEN_SAKSHANDLINGER} from "utils/allowedFeatures";

export interface SakshandlingerProps {
  sak: Sak,
}

const Sakshandlinger: React.FC<SakshandlingerProps> = ({sak}: SakshandlingerProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const replySed = useAppSelector(state => state.svarsed.replySed)
  const featureToggles = useAppSelector(state => state.app.featureToggles)

  const ALLOWED_SAKSHANDLINGER = getAllowed("ALLOWED_SAKSHANDLINGER", !!featureToggles?.featureAdmin)

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

  const _createFSed = (sedType: string) => {
    setWaitingForOperation(true)
    dispatch(createFSed(sedType, sak))
  }

  const _createF002Sed = (sedType: string) => {
    setWaitingForOperation(true)
    const connectedSed: Sed = sak.sedListe.find((s: Sed) => s.sedType === 'F001')!
    dispatch(createF002Sed(connectedSed, sedType, sak))
  }

  const createDisabledSakshandlingFragment = (sakshandling: string) => {
    return(
      <>
        <Tooltip content={t('message:warning-rina')}>
          <Box paddingBlock="2">
            <BodyLong>
              {t('sakshandlinger:' + sakshandling, t('sakshandlinger:opprett', {SED: sakshandling}))}
            </BodyLong>
          </Box>
        </Tooltip>
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
    } else  if (sakshandling === "F026" || sakshandling === "F027"){
      onClickFunction = () => _createFSed(sakshandling)
    } else if (sakshandling === "F002"){
      onClickFunction = () => _createF002Sed(sakshandling)
    }

    return(
      <>
        <Link href='#' onClick={() => onClickFunction()}>
          {t('sakshandlinger:' + sakshandling, t('sakshandlinger:opprett', {SED: sakshandling}))}
        </Link>
      </>
    )
  }


  const getSakshandlinger = () => {
    let sakshandlinger: JSX.Element[] = [];
    let disabledSakshandlinger: JSX.Element[] = [];
    sak.sakshandlinger?.forEach((sakshandling) => {
      if(ALLOWED_SAKSHANDLINGER.includes(sakshandling)){
        sakshandlinger.push(createSakshandlingFragment(sakshandling))
      } else if (!HIDDEN_SAKSHANDLINGER.includes(sakshandling)){
        disabledSakshandlinger.push(createDisabledSakshandlingFragment(sakshandling))
      }

    })
    return {sakshandlinger, disabledSakshandlinger};
  }

  const {sakshandlinger, disabledSakshandlinger} = getSakshandlinger();

  return (
    <>
      <Box padding="4" background="bg-default" borderWidth="1" borderColor="border-default" borderRadius="small">
        <VStack gap="4">
          <Heading size='small'>Sakshandlinger</Heading>
          <HorizontalLineSeparator />
          {sakshandlinger}
          {disabledSakshandlinger.length > 0 &&
            <ReadMore header="Handlinger tilgjengelig i RINA">
              {disabledSakshandlinger}
            </ReadMore>
          }
        </VStack>
      </Box>
    </>
  )
}

export default Sakshandlinger
