import Period from 'components/Period/Period'
import Select from 'components/Forms/Select'
import { AlignCenterRow, PaddedDiv } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { Barnetilhoerighet, BarnRelasjon, BarnRelasjonType, JaNei, ReplySed } from 'declarations/sed'
import { Kodeverk, Validation } from 'declarations/types'
import _ from 'lodash'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastRadioPanelGroup, Row, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface RelasjonProps {
  familierelasjonKodeverk: Array<Kodeverk>
  highContrast: boolean
  personID: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const Relasjon: React.FC<RelasjonProps> = ({
  highContrast,
  personID,
  replySed,
  resetValidation,
  updateReplySed,
  validation
}:RelasjonProps): JSX.Element => {
  const { t } = useTranslation()
  const target: string = `${personID}.barnetilhoerigheter[0]`
  const barnetilhoerighet: Barnetilhoerighet | undefined = _.get(replySed, target)
  const namespace = `familymanager-${personID}-relasjon`

  const [_newRelasjon, _setNewRelasjon] = useState<BarnRelasjon | undefined>(barnetilhoerighet?.relasjonTilPerson)
  const [_newRelasjonType, _setNewRelasjonType] = useState<BarnRelasjonType | undefined>(barnetilhoerighet?.relasjonType)
  const [_newSluttDato, _setNewSluttDato] = useState<string>(barnetilhoerighet?.periode.startdato ?? '')
  const [_newStartDato, _setNewStartDato] = useState<string>(barnetilhoerighet?.periode.sluttdato ?? '')
  const [_newErDeltForeldreansvar, _setNewErDeltForeldreansvar] = useState<JaNei | undefined>(barnetilhoerighet?.erDeltForeldreansvar)

  const [_newQuestion1, _setNewQuestion1] = useState<JaNei | undefined>(barnetilhoerighet?.borIBrukersHushold)
  const [_newQuestion2, _setNewQuestion2] = useState<JaNei | undefined>(barnetilhoerighet?.borIEktefellesHushold)
  const [_newQuestion3, _setNewQuestion3] = useState<JaNei | undefined>(barnetilhoerighet?.borIAnnenPersonsHushold)
  const [_newQuestion4, _setNewQuestion4] = useState<JaNei | undefined>(barnetilhoerighet?.borPaaInstitusjon)

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

  const setRelasjon = (barnRelasjon: BarnRelasjon) => {
    _setNewRelasjon(barnRelasjon)
    updateReplySed(`${target}.relasjonTilPerson`, barnRelasjon)
    if (validation[namespace + '-relasjonTilPerson']) {
      resetValidation(namespace + '-relasjonTilPerson')
    }
  }

  const setRelasjonType = (barnRelasjonType: BarnRelasjonType) => {
    _setNewRelasjonType(barnRelasjonType)
    updateReplySed(`${target}.relasjonType`, barnRelasjonType)
    if (validation[namespace + '-relasjonType']) {
      resetValidation(namespace + '-relasjonType')
    }
  }

  const setStartDato = (dato: string) => {
    _setNewStartDato(dato)
    updateReplySed(`${target}.periode.startdato`, dato)
    if (validation[namespace + '-startdato']) {
      resetValidation(namespace + '-startdato')
    }
  }

  const setSluttDato = (dato: string) => {
    _setNewSluttDato(dato)
    let newPerioder: any = _.cloneDeep(barnetilhoerighet?.periode)
    if (!newPerioder) {
      newPerioder = {}
    }
    if (dato === '') {
      delete newPerioder.sluttdato
      newPerioder.aapenPeriodeType = 'åpen_sluttdato'
    } else {
      delete newPerioder.aapenPeriodeType
      newPerioder.sluttdato = dato
    }
    updateReplySed(`${target}.periode`, newPerioder)
    if (validation[namespace + '-sluttdato']) {
      resetValidation(namespace + '-sluttdato')
    }
  }

  const setErDeltForeldreansvar = (erDeltForeldreansvar: JaNei) => {
    _setNewErDeltForeldreansvar(erDeltForeldreansvar)
    updateReplySed(`${target}.erDeltForeldreansvar`, erDeltForeldreansvar)
    if (validation[namespace + '-erDeltForeldreansvar']) {
      resetValidation(namespace + '-erDeltForeldreansvar')
    }
  }

  const setQuestion1 = (svar: JaNei) => {
    _setNewQuestion1(svar)
    updateReplySed(`${target}.borIBrukersHushold`, svar)
    if (validation[namespace + '-borIBrukersHushold']) {
      resetValidation(namespace + '-borIBrukersHushold')
    }
  }

  const setQuestion2 = (svar: JaNei) => {
    _setNewQuestion2(svar)
    updateReplySed(`${target}.borIEktefellesHushold`, svar)
    if (validation[namespace + '-borIEktefellesHushold']) {
      resetValidation(namespace + '-borIEktefellesHushold')
    }
  }

  const setQuestion3 = (svar: JaNei) => {
    _setNewQuestion3(svar)
    updateReplySed(`${target}.borIAnnenPersonsHushold`, svar)
    if (validation[namespace + '-borIAnnenPersonsHushold']) {
      resetValidation(namespace + '-borIAnnenPersonsHushold')
    }
  }

  const setQuestion4 = (svar: JaNei) => {
    _setNewQuestion4(svar)
    updateReplySed(`${target}.borPaaInstitusjon`, svar)
    if (validation[namespace + '-borPaaInstitusjon']) {
      resetValidation(namespace + '-borPaaInstitusjon')
    }
  }

  return (
    <PaddedDiv>
      <Undertittel className='slideInFromLeft'>
        {t('el:title-relasjon-til-barn')}
      </Undertittel>
      <VerticalSeparatorDiv data-size='2' />
      <Row className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column data-flex='2'>
          <HighContrastRadioPanelGroup
            checked={_newRelasjon}
            data-no-border
            data-test-id={'c-' + namespace + '-relasjonTilPerson-text'}
            feil={validation[namespace + '-relasjonTilPerson']?.feilmelding}
            id={'c-' + namespace + '-relasjonTilPerson-text'}
            legend={t('label:relasjon-med') + ' *'}
            name={'c-' + namespace + '-relasjonTilPerson-text'}
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
            data-test-id={'c-' + namespace + '-relasjonTilPerson-text'}
            feil={validation[namespace + '-relasjonTilPerson']?.feilmelding}
            id={'c-' + namespace + '-relasjonTilPerson-text'}
            name={'c-' + namespace + '-relasjonTilPerson-text'}
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
            data-test-id={'c-' + namespace + '-relasjonType-text'}
            feil={validation[namespace + '-relasjonType']?.feilmelding}
            highContrast={highContrast}
            id={'c-' + namespace + '-relasjonType-text'}
            label={t('label:type') + ' *'}
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
      <VerticalSeparatorDiv data-size='2' />
      <Undertittel className='slideInFromLeft' style={{ animationDelay: '0.3s' }}>
        {t('label:relasjonens-varighet')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <Row className='slideInFromLeft' style={{ animationDelay: '0.4s' }}>
        <Period
          key={'' + _newStartDato + _newSluttDato}
          namespace={namespace}
          errorStartDato={validation[namespace + '-startdato']?.feilmelding}
          errorSluttDato={validation[namespace + '-sluttdato']?.feilmelding}
          setStartDato={setStartDato}
          setSluttDato={setSluttDato}
          valueStartDato={_newStartDato}
          valueSluttDato={_newSluttDato}
        />
        <Column />
      </Row>
      <VerticalSeparatorDiv data-size='2' />
      <Row className='slideInFromLeft' style={{ animationDelay: '0.5s' }}>
        <Column>
          <HighContrastRadioPanelGroup
            checked={_newErDeltForeldreansvar}
            data-no-border
            data-test-id={'c-' + namespace + '-erDeltForeldreansvar-text'}
            feil={validation[namespace + '-erDeltForeldreansvar']?.feilmelding}
            id={'c-' + namespace + '-erDeltForeldreansvar-text'}
            legend={t('label:delt-foreldreansvar') + ' *'}
            name={'c-' + namespace + '-erDeltForeldreansvar-text'}
            radios={[
              { label: t('label:ja'), value: 'ja' },
              { label: t('label:nei'), value: 'nei' }
            ]}
            onChange={(e: any) => setErDeltForeldreansvar(e.target.value)}
          />
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv />
      <Undertittel className='slideInFromLeft' style={{ animationDelay: '0.6s' }}>
        {t('label:barn-i-hustand-spørsmål')}
      </Undertittel>
      <AlignCenterRow className='slideInFromLeft' style={{ animationDelay: '0.7s' }}>
        <Column data-flex='2'>
          <Normaltekst>
            {t('label:barn-i-hustand-spørsmål-1') + ' *'}
          </Normaltekst>
        </Column>
        <Column>
          <HighContrastRadioPanelGroup
            checked={_newQuestion1}
            data-no-border
            data-test-id={'c-' + namespace + '-borIBrukersHushold-text'}
            feil={validation[namespace + '-borIBrukersHushold']?.feilmelding}
            id={'c-' + namespace + '-borIBrukersHushold-text'}
            name={namespace + '-borIBrukersHushold'}
            radios={[
              { label: t('label:ja'), value: 'ja' },
              { label: t('label:nei'), value: 'nei' }
            ]}
            onChange={(e: any) => setQuestion1(e.target.value)}
          />
        </Column>
      </AlignCenterRow>
      <VerticalSeparatorDiv data-size='0.2' />
      <AlignCenterRow className='slideInFromLeft' style={{ animationDelay: '0.8s' }}>
        <Column data-flex='2'>
          <Normaltekst>
            {t('label:barn-i-hustand-spørsmål-2') + ' *'}
          </Normaltekst>
        </Column>
        <Column>
          <HighContrastRadioPanelGroup
            checked={_newQuestion2}
            data-no-border
            data-test-id={'c-' + namespace + '-borIEktefellesHushold-text'}
            feil={validation[namespace + '-borIEktefellesHushold']?.feilmelding}
            id={'c-' + namespace + '-borIEktefellesHushold-text'}
            name={namespace + '-borIEktefellesHushold'}
            radios={[
              { label: t('label:ja'), value: 'ja' },
              { label: t('label:nei'), value: 'nei' }
            ]}
            onChange={(e: any) => setQuestion2(e.target.value)}
          />
        </Column>
      </AlignCenterRow>
      <VerticalSeparatorDiv data-size='0.2' />
      <AlignCenterRow className='slideInFromLeft' style={{ animationDelay: '0.9s' }}>
        <Column data-flex='2'>
          <Normaltekst>
            {t('label:barn-i-hustand-spørsmål-3') + ' *'}
          </Normaltekst>
        </Column>
        <Column>
          <HighContrastRadioPanelGroup
            checked={_newQuestion3}
            data-no-border
            data-test-id={'c-' + namespace + '-borIAnnenPersonsHushold-text'}
            feil={validation[namespace + '-borIAnnenPersonsHushold']?.feilmelding}
            id={'c-' + namespace + '-borIAnnenPersonsHushold-text'}
            name={namespace + '-borIAnnenPersonsHushold'}
            radios={[
              { label: t('label:ja'), value: 'ja' },
              { label: t('label:nei'), value: 'nei' }
            ]}
            onChange={(e: any) => setQuestion3(e.target.value)}
          />
        </Column>
      </AlignCenterRow>
      <VerticalSeparatorDiv data-size='0.2' />
      <AlignCenterRow className='slideInFromLeft' style={{ animationDelay: '1.0s' }}>
        <Column data-flex='2'>
          <Normaltekst>
            {t('label:barn-i-hustand-spørsmål-4') + ' *'}
          </Normaltekst>
        </Column>
        <Column>
          <HighContrastRadioPanelGroup
            checked={_newQuestion4}
            data-no-border
            data-test-id={'c-' + namespace + '-borPaaInstitusjon-text'}
            feil={validation[namespace + '-borPaaInstitusjon']?.feilmelding}
            id={'c-' + namespace + '-borPaaInstitusjon-text'}
            name={namespace + '-borPaaInstitusjon'}
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
