import DateInput from 'components/Forms/DateInput'
import Input from 'components/Forms/Input'
import TextArea from 'components/Forms/TextArea'
import { AlignStartRow, PaddedDiv, TextAreaDiv } from 'components/StyledComponents'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import CountryData, { Currency } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastRadioPanelGroup, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface SisteAnsettelsesForholdProps {
  highContrast: boolean,
  personID: string
  parentNamespace: string,
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const SisteAnsettelsesForhold: React.FC<SisteAnsettelsesForholdProps> = ({
  highContrast,
  personID,
  parentNamespace,
  replySed,
  resetValidation,
  updateReplySed,
  validation
}:SisteAnsettelsesForholdProps): JSX.Element => {
  const { t } = useTranslation()
  // TODO this
  const target = 'xxx-sisteansettelsesforhold'
  const xxx: any = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-sisteansettelsesforhold`

  const [_typeBeløp, setTypeBeløp] = useState<string | undefined>(undefined)
  const _currencyData = CountryData.getCurrencyInstance('nb')

  const setBeløp = (newBeløp: string) => {
    updateReplySed(`${target}.beloep`, newBeløp)
    if (validation[namespace + '-beloep']) {
      resetValidation(namespace + '-beloep')
    }
  }

  const setValuta = (newValuta: Currency) => {
    updateReplySed(`${target}.valuta`, newValuta?.currencyValue)
    if (validation[namespace + '-valuta']) {
      resetValidation(namespace + '-valuta')
    }
  }

  const setMottakerDato = (dato: string) => {
    updateReplySed(`${target}.mottattdato`, dato.trim())
    if (validation[namespace + '-mottattdato']) {
      resetValidation(namespace + '-mottattdato')
    }
  }

  const setAntallDager = (antallDager: string) => {
    updateReplySed(`${target}.antallDager`, antallDager.trim())
    if (validation[namespace + '-antalldager']) {
      resetValidation(namespace + '-antalldager')
    }
  }

  const setAvkall = (avkall: string) => {
    updateReplySed(`${target}.avkall`, avkall.trim())
    if (validation[namespace + '-avkall']) {
      resetValidation(namespace + '-avkall')
    }
  }

  const setGrunn = (grunn: string) => {
    updateReplySed(`${target}.grunn`, grunn.trim())
    if (validation[namespace + '-grunn']) {
      resetValidation(namespace + '-grunn')
    }
  }

  const setAnnenYtelser = (annenYtelser: string) => {
    updateReplySed(`${target}.annenYtelser`, annenYtelser.trim())
    if (validation[namespace + '-annenytelser']) {
      resetValidation(namespace + '-annenytelser')
    }
  }

  return (
    <PaddedDiv>
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <Undertittel>
            {t('label:siste-ansettelsesforhold')}
          </Undertittel>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv data-size='2' />
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <label className='skjemaelement__label'>
            {t('label:type-beløp')}
          </label>
          <HighContrastRadioPanelGroup
            checked={_typeBeløp}
            data-multiple-line
            data-no-border
            data-test-id={namespace + '-typebeloep'}
            feil={validation[namespace + '-typebeloep']?.feilmelding}
            id={namespace + '-typebeloep'}
            name={namespace + '-typebeloep'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTypeBeløp(e.target.value)}
            radios={[
              { label: t('el:option-typebeløp-1'), value: 'typebeløp-1' },
              { label: t('el:option-typebeløp-2'), value: 'typebeløp-2' },
              { label: t('el:option-typebeløp-3'), value: 'typebeløp-3' }
            ]}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv data-size='2' />

      {!_.isNil(_typeBeløp) && (
        <>
          <Undertittel>
            {t('label:utbetaling')}
          </Undertittel>
          <VerticalSeparatorDiv />
          <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
            <Column>
              <Input
                type='number'
                feil={validation[namespace + '-beloep']?.feilmelding}
                namespace={namespace}
                id='beloep'
                label={t('label:beløp') + ' *'}
                onChanged={setBeløp}
                value={xxx?.beloep ?? ''}
              />
            </Column>
            <Column>
              <CountrySelect
                ariaLabel={t('label:valuta')}
                data-test-id={namespace + '-valuta'}
                error={validation[namespace + '-valuta']?.feilmelding}
                highContrast={highContrast}
                id={namespace + '-valuta'}
                label={t('label:valuta') + ' *'}
                locale='nb'
                menuPortalTarget={document.body}
                onOptionSelected={setValuta}
                type='currency'
                values={xxx?.valuta ? _currencyData.findByValue(xxx?.valuta) : ''}
              />
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
          {_typeBeløp !== 'typebeløp-3' && (
            <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
              <Column>
                {_typeBeløp === 'typebeløp-1' && (
                  <DateInput
                    error={validation[namespace + '-mottattdato']?.feilmelding}
                    namespace={namespace + '-mottattdato'}
                    key={xxx?.mottattDato}
                    label={t('label:mottatt-dato')}
                    setDato={setMottakerDato}
                    value={xxx?.mottattDato}
                  />
                )}
                {_typeBeløp === 'typebeløp-2' && (
                  <Input
                    type='number'
                    feil={validation[namespace + '-antalldager']?.feilmelding}
                    namespace={namespace}
                    id='antalldager'
                    label={t('label:antall-dager') + ' *'}
                    onChanged={setAntallDager}
                    value={xxx?.antallDager ?? ''}
                  />
                )}
              </Column>
              <Column />
            </AlignStartRow>
          )}
          <VerticalSeparatorDiv data-size='2' />
          <Undertittel>
            {t('label:avkall-på-rettigheter')}
          </Undertittel>
          <VerticalSeparatorDiv />
          <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
            <Column>
              <TextAreaDiv>
                <TextArea
                  feil={validation[namespace + '-avkall']?.feilmelding}
                  namespace={namespace}
                  id='avkall'
                  label={t('label:avkall-på-rettigheter')}
                  onChanged={setAvkall}
                  value={xxx?.avkall}
                />
              </TextAreaDiv>
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
          <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
            <Column>
              <TextAreaDiv>
                <TextArea
                  feil={validation[namespace + '-grunn']?.feilmelding}
                  namespace={namespace}
                  id='grunn'
                  label={t('label:grunn')}
                  onChanged={setGrunn}
                  value={xxx?.grunn}
                />
              </TextAreaDiv>
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
          <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
            <Column>
              <TextAreaDiv>
                <TextArea
                  feil={validation[namespace + '-annenytelser']?.feilmelding}
                  namespace={namespace}
                  id='annenytelser'
                  label={t('label:annen-ytelser')}
                  onChanged={setAnnenYtelser}
                  value={xxx?.annenYtelser}
                />
              </TextAreaDiv>
            </Column>
          </AlignStartRow>
        </>
      )}
    </PaddedDiv>
  )
}

export default SisteAnsettelsesForhold
