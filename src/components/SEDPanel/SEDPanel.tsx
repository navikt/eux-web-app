import { HighContrastPanel } from 'components/StyledComponents'
import { ReplySed } from 'declarations/types'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import { themeKeys } from 'nav-styled-component-theme'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const Dd = styled.dd`
  width: 50%;
  padding-bottom: 0.25rem;
  padding-top: 0.25rem;
  margin-bottom: 0;
  margin-inline-start: 0;
`
const Dt = styled.dt`
  width: 50%;
  padding-bottom: 0.25rem;
  padding-top: 0.25rem;
  .typo-element {
    margin-left: 0.5rem;
  }
`
const Dl = styled.dl`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .odd {
    background-color: ${({ theme }) => theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
  }
`
interface SEDPanelProps {
  replysed: ReplySed
}

const SEDPanel = ({ replysed }: SEDPanelProps) => {
  const { t } = useTranslation()
  return (
    <HighContrastPanel>
      <Undertittel>
        {replysed.sedType} v{replysed.sedVersjon}
      </Undertittel>
      <Dl>
        <Dt>Periode:</Dt>
        <Dd />

      </Dl>
      <Normaltekst>
        {t('ui:label-userInSed')}:
      </Normaltekst>
      <Dl>
        <Dt>{t('ui:label-name')}</Dt>
        <Dd>{replysed.bruker.personInfo.fornavn} {replysed.bruker.personInfo.etternavn} ({replysed.bruker.personInfo.kjoenn})</Dd>
        <Dt>{t('ui:label-birthDate')}</Dt>
        <Dd>{replysed.bruker.personInfo.foedselsdato}</Dd>
      </Dl>

    </HighContrastPanel>
  )
}

export default SEDPanel
