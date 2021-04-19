import classNames from 'classnames'
import { AlignStartRow, PileDiv, TextAreaDiv } from 'components/StyledComponents'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastPanel, HighContrastTextArea, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface KravOmRefusjonProps {
  highContrast: boolean
  replySed: ReplySed
  validation: Validation
}

const KravOmRefusjon: React.FC<KravOmRefusjonProps> = ({
  // highContrast,
  // replySed,
  validation
}: KravOmRefusjonProps): JSX.Element => {
  const { t } = useTranslation()

  const [_ytterligere, _setYtterligere] = useState<string>('')

  const namespace = 'kravomrefusjon'

  return (
    <PileDiv>
      <Undertittel>
        {t('el:title-krav-om-refusjon')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <HighContrastPanel>
        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
        >
          <Column>
            <TextAreaDiv>
              <HighContrastTextArea
                className={classNames({
                  'skjemaelement__input--harFeil': validation[namespace + '-krav']?.feilmelding
                })}
                data-test-id={'c-' + namespace + '-krav-text'}
                feil={validation[namespace + '-krav']?.feilmelding}
                id={'c-' + namespace + '-krav-text'}
                label={t('label:krav-om-refusjon')}
                maxLength={500}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => _setYtterligere(e.target.value)}
                placeholder={t('el:placeholder-input-default')}
                value={_ytterligere}
              />
            </TextAreaDiv>
          </Column>
        </AlignStartRow>
      </HighContrastPanel>
    </PileDiv>
  )
}

export default KravOmRefusjon
