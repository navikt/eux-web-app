import Select from 'components/Select/Select'
import { AlignCenterRow, PaddedDiv } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { BarnRelasjon, BarnRelasjonType, JaNei, ReplySed } from 'declarations/sed'
import { Kodeverk, Validation } from 'declarations/types'
import _ from 'lodash'
import { Normaltekst, UndertekstBold, Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastInput, HighContrastRadioPanelGroup, Row, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface RelasjonProps {
  familierelasjonKodeverk: Array<Kodeverk>
  highContrast: boolean
  updateReplySed: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation
}

const Relasjon: React.FC<RelasjonProps> = ({
  highContrast,
  // updateReplySed,
  personID,
  // replySed,
  validation
}:RelasjonProps): JSX.Element => {
  const [_newRelasjon, setNewRelasjon] = useState<BarnRelasjon | undefined>(undefined)
  const [_newRelasjonType, setNewRelasjonType] = useState<BarnRelasjonType | undefined>(undefined)
  const [_newSluttDato, setNewSluttDato] = useState<string>('')
  const [_newStartDato, setNewStartDato] = useState<string>('')
  const [_newForeldreansvar, setNewForeldreansvar] = useState<JaNei | undefined>(undefined)

  const [_newQuestion1, setNewQuestion1] = useState<JaNei | undefined>(undefined)
  const [_newQuestion2, setNewQuestion2] = useState<JaNei | undefined>(undefined)
  const [_newQuestion3, setNewQuestion3] = useState<JaNei | undefined>(undefined)
  const [_newQuestion4, setNewQuestion4] = useState<JaNei | undefined>(undefined)

  const { t } = useTranslation()
  const namespace = 'familymanager-' + personID + '-relasjon'

  const relasjonTypeOptions: Options = [
    { label: t('el:option-relasjon-1'), value: '01' },
    { label: t('el:option-relasjon-2'), value: '02' },
    { label: t('el:option-relasjon-3'), value: '03' },
    { label: t('el:option-relasjon-4'), value: '04' },
    { label: t('el:option-relasjon-5'), value: '05' },
    { label: t('el:option-relasjon-6'), value: '06' },
    { label: t('el:option-relasjon-7'), value: '07' },
    { label: t('el:option-relasjon-8'), value: '08' }
  ]

  const setRelasjon = (e: BarnRelasjon) => {
    setNewRelasjon(e)
  }

  const setRelasjonType = (e: BarnRelasjonType) => {
    setNewRelasjonType(e)
  }

  const setSluttDato = (e: string) => {
    setNewSluttDato(e)
  }

  const setStartDato = (e: string) => {
    setNewStartDato(e)
  }

  const setForeldreansvar = (e: JaNei) => {
    setNewForeldreansvar(e)
  }

  const setQuestion1 = (e: JaNei) => {
    setNewQuestion1(e)
  }

  const setQuestion2 = (e: JaNei) => {
    setNewQuestion2(e)
  }

  const setQuestion3 = (e: JaNei) => {
    setNewQuestion3(e)
  }

  const setQuestion4 = (e: JaNei) => {
    setNewQuestion4(e)
  }

  return (
    <PaddedDiv>
      <Undertittel className='slideInFromLeft'>
        {t('el:title-relasjon-til-barn')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <Row className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column data-flex='2'>
          <HighContrastRadioPanelGroup
            checked={_newRelasjon}
            data-no-border
            data-test-id={'c-' + namespace + '-med-text'}
            feil={validation[namespace + '-relasjon']?.feilmelding}
            id={'c-' + namespace + '-relasjon-text'}
            legend={t('label:relasjon-med')}
            name={'c-' + namespace + '-relasjon-text'}
            radios={[
              { label: t('label:søker'), value: '01' },
              { label: t('label:avdød'), value: '02' }
            ]}
            onChange={(e: any) => setRelasjon(e.target.value)}
          />
          <VerticalSeparatorDiv data-size='0.25' />
          <HighContrastRadioPanelGroup
            checked={_newRelasjon}
            data-no-border
            data-test-id={'c-' + namespace + '-med-text'}
            feil={validation[namespace + '-relasjon']?.feilmelding}
            id={'c-' + namespace + '-relasjon-text'}
            name={'c-' + namespace + '-relasjon-text'}
            radios={[
              { label: t('label:partner'), value: '03' },
              { label: t('label:annen-person'), value: '04' }
            ]}
            onChange={(e: any) => setRelasjon(e.target.value)}
          />
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv />
      <Row style={{ animationDelay: '0.2s' }}>
        <Column>
          <Select
            data-test-id={'c-' + namespace + '-type-text'}
            feil={validation[namespace + '-type']?.feilmelding}
            highContrast={highContrast}
            id={'c-' + namespace + '-type-text'}
            label={t('label:type')}
            menuPortalTarget={document.body}
            onChange={(e) => setRelasjonType(e.value)}
            options={relasjonTypeOptions}
            placeholder={t('el:placeholder-select-default')}
            selectedValue={_.find(relasjonTypeOptions, b => b.value === _newRelasjonType)}
            defaultValue={_.find(relasjonTypeOptions, b => b.value === _newRelasjonType)}
          />
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv />
      <UndertekstBold className='slideInFromLeft' style={{ animationDelay: '0.3s' }}>
        {t('label:relasjonens-varighet')}
      </UndertekstBold>
      <VerticalSeparatorDiv />
      <Row className='slideInFromLeft' style={{ animationDelay: '0.4s' }}>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-startdato-date'}
            feil={validation[namespace + '-startdato']?.feilmelding}
            id={'c-' + namespace + '-startdato-date'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDato(e.target.value)}
            value={_newStartDato}
            label={t('label:startdato')}
            placeholder={t('el:placeholder-date-default')}
          />
        </Column>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-sluttdato-date'}
            feil={validation[namespace + '-sluttdato']?.feilmelding}
            id={'c-' + namespace + '-sluttdato-date'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSluttDato(e.target.value)}
            value={_newSluttDato}
            label={t('label:sluttdato')}
            placeholder={t('el:placeholder-date-default')}
          />
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv />
      <Row className='slideInFromLeft' style={{ animationDelay: '0.5s' }}>
        <Column>
          <HighContrastRadioPanelGroup
            checked={_newForeldreansvar}
            data-no-border
            data-test-id={'c-' + namespace + '-foreldreansvar-text'}
            feil={validation[namespace + '-foreldreansvar']?.feilmelding}
            id={'c-' + namespace + '-foreldreansvar-text'}
            legend={t('label:delt-foreldreansvar')}
            name={'c-' + namespace + '-foreldreansvar-text'}
            radios={[
              { label: t('label:ja'), value: 'ja' },
              { label: t('label:nei'), value: 'nei' }
            ]}
            onChange={(e: any) => setForeldreansvar(e.target.value)}
          />
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv />
      <UndertekstBold className='slideInFromLeft' style={{ animationDelay: '0.6s' }}>
        {t('label:barn-i-hustand')}
      </UndertekstBold>
      <AlignCenterRow className='slideInFromLeft' style={{ animationDelay: '0.7s' }}>
        <Column data-flex='2'>
          <Normaltekst>
            {t('label:barn-i-hustand-spørsmål-1')}
          </Normaltekst>
        </Column>
        <Column>
          <HighContrastRadioPanelGroup
            checked={_newQuestion1}
            data-no-border
            data-test-id={'c-' + namespace + '-bomedsokeren-text'}
            feil={validation[namespace + '-bomedsokeren']?.feilmelding}
            id={'c-' + namespace + '-bomedsokeren-text'}
            name={namespace + '-bomedsokeren'}
            radios={[
              { label: t('label:ja'), value: 'ja' },
              { label: t('label:nei'), value: 'nei' }
            ]}
            onChange={(e: any) => setQuestion1(e.target.value)}
          />
        </Column>
      </AlignCenterRow>
      <AlignCenterRow className='slideInFromLeft' style={{ animationDelay: '0.8s' }}>
        <Column data-flex='2'>
          <Normaltekst>
            {t('label:barn-i-hustand-spørsmål-2')}
          </Normaltekst>
        </Column>
        <Column>
          <HighContrastRadioPanelGroup
            checked={_newQuestion2}
            data-no-border
            data-test-id={'c-' + namespace + '-bomedektefellen-text'}
            feil={validation[namespace + '-bomedektefellenp']?.feilmelding}
            id={'c-' + namespace + '-bomedektefellen-text'}
            name={namespace + '-bomedektefellen'}
            radios={[
              { label: t('label:ja'), value: 'ja' },
              { label: t('label:nei'), value: 'nei' }
            ]}
            onChange={(e: any) => setQuestion2(e.target.value)}
          />
        </Column>
      </AlignCenterRow>
      <AlignCenterRow className='slideInFromLeft' style={{ animationDelay: '0.9s' }}>
        <Column data-flex='2'>
          <Normaltekst>
            {t('label:barn-i-hustand-spørsmål-3')}
          </Normaltekst>
        </Column>
        <Column>
          <HighContrastRadioPanelGroup
            checked={_newQuestion3}
            data-no-border
            data-test-id={'c-' + namespace + '-bomedaktuelle-text'}
            feil={validation[namespace + '-bomedaktuelle']?.feilmelding}
            id={'c-' + namespace + '-bomedaktuelle-text'}
            name={namespace + '-bomedaktuelle'}
            radios={[
              { label: t('label:ja'), value: 'ja' },
              { label: t('label:nei'), value: 'nei' }
            ]}
            onChange={(e: any) => setQuestion3(e.target.value)}
          />
        </Column>
      </AlignCenterRow>
      <AlignCenterRow className='slideInFromLeft' style={{ animationDelay: '1.0s' }}>
        <Column data-flex='2'>
          <Normaltekst>
            {t('label:barn-i-hustand-spørsmål-4')}
          </Normaltekst>
        </Column>
        <Column>
          <HighContrastRadioPanelGroup
            checked={_newQuestion4}
            data-no-border
            data-test-id={'c-' + namespace + '-boiinstitusjon-text'}
            feil={validation[namespace + '-boiinstitusjon']?.feilmelding}
            id={'c-' + namespace + '-boiinstitusjon-text'}
            name={namespace + '-boiinstitusjon'}
            radios={[
              { label: t('label:ja'), value: 'ja' },
              { label: t('label:nei'), value: 'nei' }
            ]}
            onChange={(e: any) => setQuestion4(e.target.value)}
          />
        </Column>
      </AlignCenterRow>
    </PaddedDiv>
  )
}

export default Relasjon
