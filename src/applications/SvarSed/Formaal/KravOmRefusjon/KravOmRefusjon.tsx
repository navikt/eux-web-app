import classNames from 'classnames'
import TextArea from 'components/Forms/TextArea'
import { AlignStartRow, FormaalPanel, PileDiv, TextAreaDiv } from 'components/StyledComponents'
import { F002Sed, FormalKravOmRefusjon, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastLink, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'

export interface KravOmRefusjonProps {
  highContrast: boolean
  replySed: ReplySed
  resetValidation: (key?: string) => void
  seeKontoopplysninger: () => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const KravOmRefusjon: React.FC<KravOmRefusjonProps> = ({
   //highContrast,
   replySed,
   resetValidation,
   seeKontoopplysninger,
   updateReplySed,
   validation
}: KravOmRefusjonProps): JSX.Element => {
  const { t } = useTranslation()
  const target = 'formaalx.kravomrefusjon'
  const kravomrefusjon: FormalKravOmRefusjon | undefined = (replySed as F002Sed).formaalx?.kravomrefusjon
  const namespace = 'kravomrefusjon'

  const setKrav = (newKrav: string) => {
    updateReplySed(`${target}.krav`, newKrav.trim())
    if (validation[namespace + '-krav']) {
      resetValidation(namespace + '-krav')
    }
  }

  return (
    <PileDiv>
      <Undertittel>
        {t('el:title-krav-om-refusjon')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <FormaalPanel className={classNames({feil: validation[namespace]?.feilmelding})}>
        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
        >
          <Column>
            <TextAreaDiv>
              <TextArea
                feil={validation[namespace + '-krav']?.feilmelding}
                namespace={namespace}
                id='krav'
                label={t('label:krav-om-refusjon-under-artikkel') + ' *'}
                onChanged={setKrav}
                value={kravomrefusjon?.krav}
              />
            </TextAreaDiv>
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
        <AlignStartRow>
          <Column>
            <HighContrastLink href='#' onClick={(e: any) => {
              e.preventDefault()
              seeKontoopplysninger()
              // have to wait 0.1 seconds so it comes to DOM first
              setTimeout(() => {
                document.getElementById("kontoopplysning")?.scrollIntoView({
                  behavior: 'smooth'
                })
              }, 100)
            }}>
              {t('label:oppgi-kontoopplysninger')}
            </HighContrastLink>
          </Column>
        </AlignStartRow>
      </FormaalPanel>
    </PileDiv>
  )
}

export default KravOmRefusjon
