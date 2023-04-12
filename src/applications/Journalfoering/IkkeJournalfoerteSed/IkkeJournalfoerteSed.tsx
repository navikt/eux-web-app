import { Button, Heading, Panel } from '@navikt/ds-react'
import {VerticalSeparatorDiv} from '@navikt/hoykontrast'
import { Sak } from 'declarations/types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import {HorizontalLineSeparator} from "../../../components/StyledComponents";

export const DocumentList = styled.ul`

`

interface IkkeJournalfoerteSedProps {
  sak: Sak
}

const IkkeJournalfoerteSed = ({ sak }: IkkeJournalfoerteSedProps) => {
  const { t } = useTranslation()
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
          <DocumentList>
            {sak.ikkeJournalfoerteSed.map((sedTitle) => {
              return (<li>{sedTitle}</li>)
            })}
          </DocumentList>
        }
        <VerticalSeparatorDiv />
        <Button
          variant='primary'
          onClick={onJournalFoerClick}
        >
          {t('label:journalfoer')}
        </Button>
      </Panel>
    </>
  )
}

export default IkkeJournalfoerteSed
