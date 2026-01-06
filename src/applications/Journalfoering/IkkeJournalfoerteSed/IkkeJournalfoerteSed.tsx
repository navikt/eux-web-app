import {Box, Button, Heading, VStack} from '@navikt/ds-react'
import { Sak } from 'declarations/types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {useNavigate} from "react-router-dom";
import {HorizontalLineSeparator} from "../../../components/StyledComponents";

interface IkkeJournalfoerteSedProps {
  sak: Sak
  bucer: Array<string> | undefined | null

}

const IkkeJournalfoerteSed = ({ sak, bucer }: IkkeJournalfoerteSedProps) => {
  const { t } = useTranslation()
  const harTilgangTilBucType = (saksbehandlerBucer: Array<string> | null | undefined, sakType: string) => {
    if (saksbehandlerBucer && sakType) {
      for (let i = 0; i < saksbehandlerBucer.length; i++) {
        if (sakType.startsWith(saksbehandlerBucer[i])) {
          return true
        }
      }
    }
    return false;
  }

  const harTilgangBuc = harTilgangTilBucType(bucer, sak.sakType)

  const navigate = useNavigate()

  const onJournalFoerClick = () => {
    navigate({
      pathname: '/journalfoering/sak/' + sak.sakId,
      search: window.location.search
    })
  }

  return (

      <Box background="bg-default" padding="4" borderWidth="1" borderColor="border-default" borderRadius="small">
        <VStack gap="4">
          <Heading size='small'>
            {t('label:ikke-journalfoerte-dokumenter')}
          </Heading>
          <HorizontalLineSeparator />
          {sak.ikkeJournalfoerteSed && sak.ikkeJournalfoerteSed.length > 0 &&
            <ul>
              {sak.ikkeJournalfoerteSed.map((sedTitle) => {
                return (<li>{sedTitle}</li>)
              })}
            </ul>
          }
          {harTilgangBuc &&
            <Button
              variant='primary'
              onClick={onJournalFoerClick}
            >
              {t('label:journalfoer')}
            </Button>
          }
        </VStack>
      </Box>
  )
}

export default IkkeJournalfoerteSed
