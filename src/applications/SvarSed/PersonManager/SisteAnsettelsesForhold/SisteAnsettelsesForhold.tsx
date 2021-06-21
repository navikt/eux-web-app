import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import DateInput from 'components/Forms/DateInput'
import Input from 'components/Forms/Input'
import TextArea from 'components/Forms/TextArea'
import { TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { SisteAnsettelse } from 'declarations/sed'
import CountryData, { Currency } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import { AlignStartRow, Column, HighContrastRadioPanelGroup, PaddedDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

interface SisteAnsettelsesForholdSelector extends PersonManagerFormSelector {
  highContrast: boolean
}

const mapState = (state: State): SisteAnsettelsesForholdSelector => ({
  highContrast: state.ui.highContrast,
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const SisteAnsettelsesForhold: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    highContrast,
    replySed,
    validation
  } = useSelector<State, SisteAnsettelsesForholdSelector>(mapState)
  const dispatch = useDispatch()
  const target = 'sisteAnsettelseInfo'
  const sisteAnsettelseInfo: SisteAnsettelse = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-sisteansettelsesforhold`

  const [_typeBeløp, setTypeBeløp] = useState<string | undefined>(undefined)
  const _currencyData = CountryData.getCurrencyInstance('nb')

  const setBeløp = (newBeløp: string) => {
    dispatch(updateReplySed(`${target}.beloep`, newBeløp))
    if (validation[namespace + '-beloep']) {
      dispatch(resetValidation(namespace + '-beloep'))
    }
  }

  const setValuta = (newValuta: Currency) => {
    dispatch(updateReplySed(`${target}.valuta`, newValuta?.value))
    if (validation[namespace + '-valuta']) {
      dispatch(resetValidation(namespace + '-valuta'))
    }
  }

  const setMottakerDato = (dato: string) => {
    dispatch(updateReplySed(`${target}.mottattdato`, dato.trim()))
    if (validation[namespace + '-mottattdato']) {
      dispatch(resetValidation(namespace + '-mottattdato'))
    }
  }

  const setAntallDager = (antallDager: string) => {
    dispatch(updateReplySed(`${target}.antallDager`, antallDager.trim()))
    if (validation[namespace + '-antalldager']) {
      dispatch(resetValidation(namespace + '-antalldager'))
    }
  }

  const setAvkall = (avkall: string) => {
    dispatch(updateReplySed(`${target}.avkall`, avkall.trim()))
    if (validation[namespace + '-avkall']) {
      dispatch(resetValidation(namespace + '-avkall'))
    }
  }

  const setGrunn = (grunn: string) => {
    dispatch(updateReplySed(`${target}.grunn`, grunn.trim()))
    if (validation[namespace + '-grunn']) {
      dispatch(resetValidation(namespace + '-grunn'))
    }
  }

  const setAnnenYtelser = (annenYtelser: string) => {
    dispatch(updateReplySed(`${target}.annenYtelser`, annenYtelser.trim()))
    if (validation[namespace + '-annenytelser']) {
      dispatch(resetValidation(namespace + '-annenytelser'))
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
      <VerticalSeparatorDiv size='2' />
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
      <VerticalSeparatorDiv size='2' />

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
                key={xxx?.valuta ? _currencyData.findByValue(xxx?.valuta) : ''}
                closeMenuOnSelect
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
                    feil={validation[namespace + '-mottattdato']?.feilmelding}
                    namespace={namespace}
                    key={xxx?.mottattDato}
                    id='mottattdato'
                    label={t('label:mottatt-dato')}
                    onChanged={setMottakerDato}
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
          <VerticalSeparatorDiv size='2' />
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
