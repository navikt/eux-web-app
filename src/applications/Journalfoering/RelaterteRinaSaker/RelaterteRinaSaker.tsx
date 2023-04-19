import {Heading, Link, Panel} from '@navikt/ds-react'
import {VerticalSeparatorDiv} from '@navikt/hoykontrast'
import { Sak } from 'declarations/types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from "styled-components";
import {HorizontalLineSeparator} from "../../../components/StyledComponents";

export const DocumentList = styled.ul`

`

interface RelaterteRinaSakerProps {
  sak: Sak
}

const RelaterteRinaSaker = ({ sak }: RelaterteRinaSakerProps) => {
  const { t } = useTranslation()

  const gotoSak = (sakId: string) => {
    window.location.href = '/svarsed/view/sak/' + sakId
  }

  return (
    <>
      <Panel border>
        <Heading size='small'>
          { sak.relaterteRinasakIder && sak.relaterteRinasakIder.length > 1 ? t('label:tilknyttede-saker') : t('label:tilknyttet-sak')}
        </Heading>
        <HorizontalLineSeparator />
        <VerticalSeparatorDiv />
            <>
              {sak.relaterteRinasakIder?.map((sakId) => {
                return (<><Link href='#' onClick={() => gotoSak(sakId)}>{sakId}</Link><br/></>)
              })}
            </>
      </Panel>
    </>
  )
}

export default RelaterteRinaSaker
