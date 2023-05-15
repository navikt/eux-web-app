import {Heading, Loader, Panel} from '@navikt/ds-react'
import {VerticalSeparatorDiv, FlexCenterDiv} from '@navikt/hoykontrast'
import {Sak} from 'declarations/types'
import React, {useEffect} from 'react'
import { useTranslation } from 'react-i18next'

import {HorizontalLineSeparator } from "../../../components/StyledComponents";
import {querySaks} from "../../../actions/svarsed";
import {useAppDispatch, useAppSelector} from "../../../store";
import {State} from "../../../declarations/reducers";
import styled from "styled-components";

export const CenteredDiv = styled(FlexCenterDiv)`
 justify-content: center;
`
interface SedUnderJournalfoeringEllerUkjentStatusProps {
  sak: Sak
}

interface SedUnderJournalfoeringEllerUkjentStatusSelector {
  refreshingSaks: boolean
}

const mapState = (state: State) => ({
  refreshingSaks: state.loading.refreshingSaks
})

const SedUnderJournalfoeringEllerUkjentStatus = ({ sak }: SedUnderJournalfoeringEllerUkjentStatusProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { refreshingSaks }: SedUnderJournalfoeringEllerUkjentStatusSelector = useAppSelector(mapState)

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined
    let runs = 0
    interval = setInterval(() => {
      runs += 1
      if(runs === 60){
        clearInterval(interval)
        return
      } else if (sak.sedUnderJournalfoeringEllerUkjentStatus && (runs === 5 || runs === 10 || runs === 59)) {
        dispatch(querySaks(sak?.sakId, 'timer', runs >= 2))
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [])


  return (
    <>
      <Panel border>
        <Heading size='small'>
          {t('label:under-journalfoering-ukjent-status')}
        </Heading>
        <HorizontalLineSeparator />
        <VerticalSeparatorDiv />
        {sak.sedUnderJournalfoeringEllerUkjentStatus && sak.sedUnderJournalfoeringEllerUkjentStatus.length > 0 &&
          <ul>
            {sak.sedUnderJournalfoeringEllerUkjentStatus.map((sedTitle) => {
              return (<li>{sedTitle}</li>)
            })}
          </ul>
        }
        {refreshingSaks &&
          <CenteredDiv>
            {t('label:sjekker-status')} &nbsp; <Loader/>
          </CenteredDiv>
        }
      </Panel>
    </>
  )
}

export default SedUnderJournalfoeringEllerUkjentStatus
