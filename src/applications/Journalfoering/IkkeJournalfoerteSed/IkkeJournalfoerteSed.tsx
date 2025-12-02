import { Button, Heading, Panel } from '@navikt/ds-react'
import {VerticalSeparatorDiv} from '@navikt/hoykontrast'
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
    <>
      <Panel border>
        <Heading size='small'>
          {t('label:ikke-journalfoerte-dokumenter')}
        </Heading>
        <HorizontalLineSeparator />
        <VerticalSeparatorDiv />
        {sak.ikkeJournalfoerteSed && sak.ikkeJournalfoerteSed.length > 0 &&
          <ul>
            {sak.ikkeJournalfoerteSed.map((sedTitle) => {
              return (<li>{sedTitle}</li>)
            })}
          </ul>
        }
        <VerticalSeparatorDiv />
        {harTilgangBuc &&
          <Button
            variant='primary'
            onClick={onJournalFoerClick}
          >
            {t('label:journalfoer')}
          </Button>
        }
      </Panel>
    </>
  )
}

export default IkkeJournalfoerteSed
