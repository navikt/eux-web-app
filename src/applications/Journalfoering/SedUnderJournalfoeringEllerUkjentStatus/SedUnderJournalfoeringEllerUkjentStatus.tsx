import {Box, Heading, HStack, Loader, Spacer, VStack} from '@navikt/ds-react'
import {Sak} from 'declarations/types'
import React, {useEffect} from 'react'
import { useTranslation } from 'react-i18next'

import commonStyles from 'assets/css/common.module.css'
import {querySaks} from "../../../actions/svarsed";
import {useAppDispatch, useAppSelector} from "../../../store";
import {State} from "../../../declarations/reducers";

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
    let controller = new AbortController();
    const signal = controller.signal;

    let interval: string | number | NodeJS.Timeout | undefined
    let runs = 0
    interval = setInterval(() => {
      runs += 1
      if(runs === 60){
        clearInterval(interval)
        return
      } else if (sak.sedUnderJournalfoeringEllerUkjentStatus && (runs === 5 || runs === 10 || runs === 59)) {
        dispatch(querySaks(sak?.sakId, 'timer', runs >= 2, signal))
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      if(controller){
        controller.abort();
      }
    }
  }, [])


  return (
    <Box background="default" padding="space-16" borderWidth="1" borderColor="neutral" borderRadius="2">
      <VStack gap="space-16">
        <Heading size='small'>
          {t('label:under-journalfoering-ukjent-status')}
        </Heading>
        <div className={commonStyles.horizontalLineSeparator} />
        {sak.sedUnderJournalfoeringEllerUkjentStatus && sak.sedUnderJournalfoeringEllerUkjentStatus.length > 0 &&
          <ul>
            {sak.sedUnderJournalfoeringEllerUkjentStatus.map((sedTitle) => {
              return (<li>{sedTitle}</li>)
            })}
          </ul>
        }
        {refreshingSaks &&
          <HStack>
            <Spacer/>
            {t('label:sjekker-status')} &nbsp; <Loader/>
            <Spacer/>
          </HStack>
        }
      </VStack>
    </Box>
  );
}

export default SedUnderJournalfoeringEllerUkjentStatus
