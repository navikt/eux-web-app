import { updateReplySed } from 'actions/svarpased'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Select from 'components/Forms/Select'
import Period from 'components/Period/Period'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { Barnetilhoerighet, BarnRelasjon, BarnRelasjonType, JaNei } from 'declarations/sed'
import _ from 'lodash'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  AlignCenterRow,
  Column,
  HighContrastRadioPanelGroup,
  PaddedDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

interface RelasjonSelector extends PersonManagerFormSelector {
  highContrast: boolean
}

const mapState = (state: State): RelasjonSelector => ({
  highContrast: state.ui.highContrast,
  replySed: state.svarpased.replySed,
  resetValidation: state.validation.resetValidation,
  validation: state.validation.status
})

const Relasjon: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    highContrast,
    replySed,
    resetValidation,
    validation
  } = useSelector<State, RelasjonSelector>(mapState)
  const dispatch = useDispatch()
  const target: string = `${personID}.barnetilhoerigheter[0]`
  const barnetilhoerighet: Barnetilhoerighet | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-relasjon[0]`

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
    dispatch(updateReplySed(`${target}.relasjonTilPerson`, barnRelasjon))
    if (validation[namespace + '-relasjonTilPerson']) {
      resetValidation(namespace + '-relasjonTilPerson')
    }
  }

  const setRelasjonType = (barnRelasjonType: BarnRelasjonType) => {
    dispatch(updateReplySed(`${target}.relasjonType`, barnRelasjonType))
    if (validation[namespace + '-relasjonType']) {
      resetValidation(namespace + '-relasjonType')
    }
  }

  const setStartDato = (dato: string) => {
    dispatch(updateReplySed(`${target}.periode.startdato`, dato))
    if (validation[namespace + '-periode-startdato']) {
      resetValidation(namespace + '-periode-startdato')
    }
  }

  const setSluttDato = (dato: string) => {
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
    dispatch(updateReplySed(`${target}.periode`, newPerioder))
    if (validation[namespace + '-periode-sluttdato']) {
      resetValidation(namespace + '-periode-sluttdato')
    }
  }

  const setErDeltForeldreansvar = (erDeltForeldreansvar: JaNei) => {
    dispatch(updateReplySed(`${target}.erDeltForeldreansvar`, erDeltForeldreansvar))
    if (validation[namespace + '-erDeltForeldreansvar']) {
      resetValidation(namespace + '-erDeltForeldreansvar')
    }
  }

  const setQuestion1 = (svar: JaNei) => {
    dispatch(updateReplySed(`${target}.borIBrukersHushold`, svar))
    if (validation[namespace + '-borIBrukersHushold']) {
      resetValidation(namespace + '-borIBrukersHushold')
    }
  }

  const setQuestion2 = (svar: JaNei) => {
    dispatch(updateReplySed(`${target}.borIEktefellesHushold`, svar))
    if (validation[namespace + '-borIEktefellesHushold']) {
      resetValidation(namespace + '-borIEktefellesHushold')
    }
  }

  const setQuestion3 = (svar: JaNei) => {
    dispatch(updateReplySed(`${target}.borIAnnenPersonsHushold`, svar))
    if (validation[namespace + '-borIAnnenPersonsHushold']) {
      resetValidation(namespace + '-borIAnnenPersonsHushold')
    }
  }

  const setQuestion4 = (svar: JaNei) => {
    dispatch(updateReplySed(`${target}.borPaaInstitusjon`, svar))
    if (validation[namespace + '-borPaaInstitusjon']) {
      resetValidation(namespace + '-borPaaInstitusjon')
    }
  }

  return (
    <PaddedDiv>
      <Undertittel className='slideInFromLeft'>
        {t('label:relasjon-til-barn')}
      </Undertittel>
      <VerticalSeparatorDiv size='2' />
      <Row className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column flex='2'>
          <HighContrastRadioPanelGroup
            checked={barnetilhoerighet?.relasjonTilPerson}
            data-no-border
            data-test-id={namespace + '-relasjonTilPerson'}
            feil={validation[namespace + '-relasjonTilPerson']?.feilmelding}
            id={namespace + '-relasjonTilPerson'}
            legend={t('label:relasjon-med') + ' *'}
            name={namespace + '-relasjonTilPerson'}
            radios={[
              { label: t('label:søker'), value: '01' },
              { label: t('label:avdød'), value: '02' }
            ]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRelasjon(e.target.value as BarnRelasjon)}
          />
          <VerticalSeparatorDiv size='0.25' />
          <HighContrastRadioPanelGroup
            checked={barnetilhoerighet?.relasjonTilPerson}
            data-no-border
            data-test-id={namespace + '-relasjonTilPerson'}
            feil={validation[namespace + '-relasjonTilPerson']?.feilmelding}
            id={namespace + '-relasjonTilPerson'}
            name={namespace + '-relasjonTilPerson'}
            radios={[
              { label: t('label:partner'), value: '03' },
              { label: t('label:annen-person'), value: '04' }
            ]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRelasjon(e.target.value as BarnRelasjon)}
          />
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv />
      <Row style={{ animationDelay: '0.2s' }}>
        <Column flex={2}>
          <Select
            data-test-id={namespace + '-relasjonType'}
            feil={validation[namespace + '-relasjonType']?.feilmelding}
            highContrast={highContrast}
            id={namespace + '-relasjonType'}
            label={t('label:type') + ' *'}
            menuPortalTarget={document.body}
            onChange={(e) => setRelasjonType(e.value)}
            options={relasjonTypeOptions}
            placeholder={t('el:placeholder-select-default')}
            selectedValue={_.find(relasjonTypeOptions, b => b.value === barnetilhoerighet?.relasjonType)}
            defaultValue={_.find(relasjonTypeOptions, b => b.value === barnetilhoerighet?.relasjonType)}
          />
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv size='2' />
      <Undertittel className='slideInFromLeft' style={{ animationDelay: '0.3s' }}>
        {t('label:relasjonens-varighet')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <Row className='slideInFromLeft' style={{ animationDelay: '0.4s' }}>
        <Period
          key={'' + barnetilhoerighet?.periode.startdato + barnetilhoerighet?.periode.startdato}
          namespace={namespace + '-periode'}
          errorStartDato={validation[namespace + '-periode-startdato']?.feilmelding}
          errorSluttDato={validation[namespace + '-periode-sluttdato']?.feilmelding}
          setStartDato={setStartDato}
          setSluttDato={setSluttDato}
          valueStartDato={barnetilhoerighet?.periode.startdato ?? ''}
          valueSluttDato={barnetilhoerighet?.periode.startdato ?? ''}
        />
        <Column />
      </Row>
      <VerticalSeparatorDiv size='2' />
      <Row className='slideInFromLeft' style={{ animationDelay: '0.5s' }}>
        <Column flex={2}>
          <HighContrastRadioPanelGroup
            checked={barnetilhoerighet?.erDeltForeldreansvar}
            data-no-border
            data-test-id={namespace + '-erDeltForeldreansvar'}
            feil={validation[namespace + '-erDeltForeldreansvar']?.feilmelding}
            id={namespace + '-erDeltForeldreansvar'}
            legend={t('label:delt-foreldreansvar') + ' *'}
            name={namespace + '-erDeltForeldreansvar'}
            radios={[
              { label: t('label:ja'), value: 'ja' },
              { label: t('label:nei'), value: 'nei' }
            ]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setErDeltForeldreansvar(e.target.value as JaNei)}
          />
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv />
      <Undertittel className='slideInFromLeft' style={{ animationDelay: '0.6s' }}>
        {t('label:barn-i-hustand-spørsmål')}
      </Undertittel>
      <AlignCenterRow className='slideInFromLeft' style={{ animationDelay: '0.7s' }}>
        <Column flex='2'>
          <Normaltekst>
            {t('label:barn-i-hustand-spørsmål-1') + ' *'}
          </Normaltekst>
        </Column>
        <Column>
          <HighContrastRadioPanelGroup
            checked={barnetilhoerighet?.borIBrukersHushold}
            data-no-border
            data-test-id={namespace + '-borIBrukersHushold'}
            feil={validation[namespace + '-borIBrukersHushold']?.feilmelding}
            id={namespace + '-borIBrukersHushold'}
            name={namespace + '-borIBrukersHushold'}
            radios={[
              { label: t('label:ja'), value: 'ja' },
              { label: t('label:nei'), value: 'nei' }
            ]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion1(e.target.value as JaNei)}
          />
        </Column>
      </AlignCenterRow>
      <VerticalSeparatorDiv size='0.2' />
      <AlignCenterRow className='slideInFromLeft' style={{ animationDelay: '0.8s' }}>
        <Column flex='2'>
          <Normaltekst>
            {t('label:barn-i-hustand-spørsmål-2') + ' *'}
          </Normaltekst>
        </Column>
        <Column>
          <HighContrastRadioPanelGroup
            checked={barnetilhoerighet?.borIEktefellesHushold}
            data-no-border
            data-test-id={namespace + '-borIEktefellesHushold'}
            feil={validation[namespace + '-borIEktefellesHushold']?.feilmelding}
            id={namespace + '-borIEktefellesHushold'}
            name={namespace + '-borIEktefellesHushold'}
            radios={[
              { label: t('label:ja'), value: 'ja' },
              { label: t('label:nei'), value: 'nei' }
            ]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion2(e.target.value as JaNei)}
          />
        </Column>
      </AlignCenterRow>
      <VerticalSeparatorDiv size='0.2' />
      <AlignCenterRow className='slideInFromLeft' style={{ animationDelay: '0.9s' }}>
        <Column flex='2'>
          <Normaltekst>
            {t('label:barn-i-hustand-spørsmål-3') + ' *'}
          </Normaltekst>
        </Column>
        <Column>
          <HighContrastRadioPanelGroup
            checked={barnetilhoerighet?.borIAnnenPersonsHushold}
            data-no-border
            data-test-id={namespace + '-borIAnnenPersonsHushold'}
            feil={validation[namespace + '-borIAnnenPersonsHushold']?.feilmelding}
            id={namespace + '-borIAnnenPersonsHushold'}
            name={namespace + '-borIAnnenPersonsHushold'}
            radios={[
              { label: t('label:ja'), value: 'ja' },
              { label: t('label:nei'), value: 'nei' }
            ]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion3(e.target.value as JaNei)}
          />
        </Column>
      </AlignCenterRow>
      <VerticalSeparatorDiv size='0.2' />
      <AlignCenterRow className='slideInFromLeft' style={{ animationDelay: '1.0s' }}>
        <Column flex='2'>
          <Normaltekst>
            {t('label:barn-i-hustand-spørsmål-4') + ' *'}
          </Normaltekst>
        </Column>
        <Column>
          <HighContrastRadioPanelGroup
            checked={barnetilhoerighet?.borPaaInstitusjon}
            data-no-border
            data-test-id={namespace + '-borPaaInstitusjon'}
            feil={validation[namespace + '-borPaaInstitusjon']?.feilmelding}
            id={namespace + '-borPaaInstitusjon'}
            name={namespace + '-borPaaInstitusjon'}
            radios={[
              { label: t('label:ja'), value: 'ja' },
              { label: t('label:nei'), value: 'nei' }
            ]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion4(e.target.value as JaNei)}
          />
        </Column>
      </AlignCenterRow>
    </PaddedDiv>
  )
}

export default Relasjon
