import { HighContrastPanel } from 'components/StyledComponents'
import { SvarSed } from 'declarations/types'
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
  svarSed: SvarSed
}

const SEDPanel = ({svarSed}: SEDPanelProps) => {

  const { t } = useTranslation()
  return (
    <HighContrastPanel>
      <Undertittel>
        {svarSed.sedType} v{svarSed.sedVersjon}
      </Undertittel>
      <Dl>
        <Dt>Periode:</Dt>
        <Dd></Dd>

      </Dl>
      <Normaltekst>
        {t('ui:label-userInSed')}:
      </Normaltekst>
      <Dl>
        <Dt>{t('ui:label-name')}</Dt>
        <Dd>{svarSed.bruker.personInfo.fornavn} {svarSed.bruker.personInfo.etternavn} ({svarSed.bruker.personInfo.kjoenn})</Dd>
        <Dt>{t('ui:label-birthDate')}</Dt>
        <Dd>{svarSed.bruker.personInfo.foedselsdato}</Dd>
     </Dl>

    </HighContrastPanel>
  )

}


export default SEDPanel
