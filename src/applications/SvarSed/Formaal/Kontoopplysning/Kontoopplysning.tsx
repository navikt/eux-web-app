import classNames from 'classnames'
import Input from 'components/Forms/Input'
import TextArea from 'components/Forms/TextArea'
import { AlignStartRow, PileDiv, TextAreaDiv } from 'components/StyledComponents'
import { F002Sed, JaNei, ReplySed, UtbetalingTilInstitusjon } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastPanel,
  HighContrastRadio,
  HighContrastRadioGroup,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'

export interface KravOmRefusjonProps {
  highContrast: boolean
  replySed: ReplySed
  validation: Validation
}

export interface KontoopplysningProps {
  highContrast: boolean
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const Kontoopplysning: React.FC<KontoopplysningProps> = ({
  // highContrast,
  replySed,
  resetValidation,
  updateReplySed,
  validation
}: KontoopplysningProps): JSX.Element => {
  const { t } = useTranslation()
  const target = 'utbetalingTilInstitusjon'
  const utbetalingTilInstitusjon: UtbetalingTilInstitusjon | undefined = (replySed as F002Sed).utbetalingTilInstitusjon
  const namespace = 'kontoopplysninger'

  const setBegrunnelse = (newBegrunnelse: string) => {
    updateReplySed(`${target}.begrunnelse`, newBegrunnelse.trim())
    if (validation[namespace + '-begrunnelse']) {
      resetValidation(namespace + '-begrunnelse')
    }
  }

  const setId = (newId: string) => {
    updateReplySed(`${target}.id`, newId.trim())
    if (validation[namespace + '-id']) {
      resetValidation(namespace + '-id')
    }
  }

  const setNavn = (newNavn: string) => {
    updateReplySed(`${target}.navn`, newNavn.trim())
    if (validation[namespace + '-navn']) {
      resetValidation(namespace + '-navn')
    }
  }

  const setSepaKonto = (newSepaKonto: JaNei) => {
    updateReplySed(`${target}.kontoOrdinaer.sepaKonto`, newSepaKonto.trim())
    if (validation[namespace + '-kontoOrdinaer-sepaKonto']) {
      resetValidation(namespace + '-kontoOrdinaer-sepaKonto')
    }
  }
  const setIban = (newIban: string) => {
    updateReplySed(`${target}.kontoOrdinaer.iban`, newIban.trim())
    if (validation[namespace + '-kontoOrdinaer-iban']) {
      resetValidation(namespace + '-kontoOrdinaer-iban')
    }
  }

  const setSwift = (newSwift: string) => {
    updateReplySed(`${target}.kontoOrdinaer.swift`, newSwift.trim())
    if (validation[namespace + '-kontoOrdinaer-swift']) {
      resetValidation(namespace + '-kontoOrdinaer-swift')
    }
  }

  return (
    <PileDiv id='kontoopplysning'>
      <Undertittel>
        {t('el:title-kontoopplysning')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <HighContrastPanel>
        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
        >
          <Column data-flex='2'>
            <TextAreaDiv>
              <TextArea
                feil={validation[namespace + '-begrunnelse']?.feilmelding}
                namespace={namespace}
                id='begrunnelse'
                label={t('label:begrunnelse-for-myndighetens-krav') + '*'}
                onChanged={setBegrunnelse}
                value={utbetalingTilInstitusjon.begrunnelse ?? ''}
              />
            </TextAreaDiv>
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: '0.1s' }}
        >
          <Column>
            <Input
              feil={validation[namespace + '-id']?.feilmelding}
              namespace={namespace}
              id='id'
              label={t('label:institusjonens-id') + ' *'}
              onChanged={setId}
              value={utbetalingTilInstitusjon.id ?? ''}
            />
          </Column>
          <Column>
            <Input
              feil={validation[namespace + '-navn']?.feilmelding}
              namespace={namespace}
              id='navn'
              label={t('label:institusjonens-navn') + ' *'}
              onChanged={setNavn}
              value={utbetalingTilInstitusjon.navn ?? ''}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv data-size='2' />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: '0.2s' }}
        >
          <Column>
            <HighContrastRadioGroup
              className={classNames('slideInFromLeft')}
              data-test-id={namespace + '-kontoOrdinaer-sepaKonto'}
              feil={validation[namespace + '-kontoOrdinaer-sepaKonto']?.feilmelding}
              id={namespace + '-kontoOrdinaer-sepaKonto'}
              legend={t('label:bankinformasjon')}
            >
              <div>
                <HighContrastRadio
                  name={namespace + '-kontoOrdinaer-sepaKonto'}
                  checked={utbetalingTilInstitusjon.kontoOrdinaer.sepaKonto === 'ja'}
                  label={t('label:sepa-konto-ja')}
                  onClick={() => setSepaKonto('ja')}
                />
                <HighContrastRadio
                  name={namespace + '-kontoOrdinaer-sepaKonto'}
                  checked={utbetalingTilInstitusjon.kontoOrdinaer.sepaKonto === 'nei'}
                  label={t('label:sepa-konto-nei')}
                  onClick={() => setSepaKonto('nei')}
                />
              </div>
            </HighContrastRadioGroup>
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: '0.3s' }}
        >
          <Column data-flex='2'>
            <Input
              feil={validation[namespace + '-kontoOrdinaer-iban']?.feilmelding}
              namespace={namespace}
              id='kontoOrdinaer-iban'
              label={t('label:iban') + ' *'}
              onChanged={setIban}
              value={utbetalingTilInstitusjon.kontoOrdinaer.iban ?? ''}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: '0.4s' }}
        >
          <Column data-flex='2'>
            <Input
              feil={validation[namespace + '-kontoOrdinaer-swift']?.feilmelding}
              namespace={namespace}
              id='kontoOrdinaer-swift'
              label={t('label:swift') + ' *'}
              onChanged={setSwift}
              value={utbetalingTilInstitusjon.kontoOrdinaer.swift ?? ''}
            />
          </Column>
          <Column />
        </AlignStartRow>
      </HighContrastPanel>
    </PileDiv>
  )
}

export default Kontoopplysning
