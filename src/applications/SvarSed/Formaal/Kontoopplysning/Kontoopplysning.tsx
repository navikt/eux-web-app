import classNames from 'classnames'
import { AlignStartRow, PileDiv } from 'components/StyledComponents'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastPanel, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'

export interface KravOmRefusjonProps {
  highContrast: boolean
  replySed: ReplySed
  validation: Validation
}

const Kontoopplysning: React.FC<KravOmRefusjonProps> = ({
  // highContrast,
  // replySed,
  //validation
}: KravOmRefusjonProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <PileDiv id='xxx'>
      <Undertittel>
        {t('el:title-kontoopplysning')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <HighContrastPanel>
        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
        >
          <Column>
           <div>
             dfgfdg
           </div>
          </Column>
        </AlignStartRow>
      </HighContrastPanel>
    </PileDiv>
  )
}

export default Kontoopplysning
