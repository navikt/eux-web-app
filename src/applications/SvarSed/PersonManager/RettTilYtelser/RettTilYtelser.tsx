import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { State } from 'declarations/reducers'
import { JaNei, Periode, RettTilYtelse } from 'declarations/sed'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column,
  HighContrastRadio,
  HighContrastRadioGroup,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PileDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

const mapState = (state: State): PersonManagerFormSelector => ({
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const RettTilYtelser: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    replySed,
    validation
  } = useSelector<State, PersonManagerFormSelector>(mapState)
  const dispatch = useDispatch()
  const target = 'rettTilYtelse'
  const rettTilYtelse: RettTilYtelse | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-retttilytelser`

  const [_rettTilStonad, _setRettTilStonad] = useState<JaNei | undefined>(() => {
    if (!_.isEmpty(rettTilYtelse?.bekreftelsesgrunn)) {
      return 'ja'
    }
    if (!_.isEmpty(rettTilYtelse?.avvisningsgrunn)) {
      return 'nei'
    }
    return undefined
  })

  const setStartDato = (startdato: string) => {
    dispatch(updateReplySed(`${target}.periode.startdato`, startdato.trim()))
    if (validation[namespace + '-periode-startdato']) {
      dispatch(resetValidation(namespace + '-periode-startdato'))
    }
  }

  const setSluttDato = (sluttdato: string) => {
    let newRettTilYtelse: Periode | undefined = _.cloneDeep(rettTilYtelse?.periode)
    if (!newRettTilYtelse) {
      newRettTilYtelse = {} as Periode
    }
    if (sluttdato === '') {
      delete newRettTilYtelse.sluttdato
      newRettTilYtelse.aapenPeriodeType = 'åpen_sluttdato'
    } else {
      delete newRettTilYtelse.aapenPeriodeType
      newRettTilYtelse.sluttdato = sluttdato.trim()
    }
    dispatch(updateReplySed(`${target}.periode`, newRettTilYtelse))
    if (validation[namespace + '-periode-sluttdato']) {
      dispatch(resetValidation(namespace + '-periode-sluttdato'))
    }
  }

  const setRettTilStonad = (rettTilStonad: JaNei) => {
    _setRettTilStonad(rettTilStonad)
    if (validation[namespace + '-retttilstonad']) {
      dispatch(resetValidation(namespace + '-retttilstonad'))
    }
  }

  const setBekreftelsesgrunn = (bekreftelsesgrunn: string) => {
    let newRettTilYtelse: RettTilYtelse = _.cloneDeep(rettTilYtelse) as RettTilYtelse
    if (!newRettTilYtelse) {
      newRettTilYtelse = {} as RettTilYtelse
    }
    newRettTilYtelse.bekreftelsesgrunn = bekreftelsesgrunn.trim()
    delete newRettTilYtelse.avvisningsgrunn
    dispatch(updateReplySed(target, newRettTilYtelse))
    if (validation[namespace + '-bekreftelsesgrunn']) {
      dispatch(resetValidation(namespace + '-bekreftelsesgrunn'))
    }
  }

  const setAvvisningsGrunn = (avvisningsgrunn: string) => {
    let newRettTilYtelse: RettTilYtelse = _.cloneDeep(rettTilYtelse) as RettTilYtelse
    if (!newRettTilYtelse) {
      newRettTilYtelse = {} as RettTilYtelse
    }
    newRettTilYtelse.avvisningsgrunn = avvisningsgrunn.trim()
    delete newRettTilYtelse.bekreftelsesgrunn
    dispatch(updateReplySed(target, newRettTilYtelse))
    if (validation[namespace + '-avvisningsgrunn']) {
      dispatch(resetValidation(namespace + '-avvisningsgrunn'))
    }
  }

  return (
    <PaddedDiv>
      <Undertittel>
        {t('label:rett-til-ytelser')}
      </Undertittel>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column>
          <HighContrastRadioGroup
            id={namespace + '-retttilstønad'}
            data-test-id={namespace + '-retttilstønad'}
            legend={t('label:rett-til-stønad') + ' *'}
            key={'rett-til-stonad-' + _rettTilStonad}
            feil={validation[namespace + '-retttilstønad']?.feilmelding}
          >
            <VerticalSeparatorDiv size='0.5' />
            <PileDiv>
              <HorizontalSeparatorDiv size='0.2' />
              <HighContrastRadio
                name={namespace + '-retttilstønad'}
                checked={_rettTilStonad === 'ja'}
                label={t('label:ja')}
                onClick={() => setRettTilStonad('ja')}
              />
              <HorizontalSeparatorDiv size='2' />
              <HighContrastRadio
                name={namespace + '-retttilstønad'}
                checked={_rettTilStonad === 'nei'}
                label={t('label:nei')}
                onClick={() => setRettTilStonad('nei')}
              />
            </PileDiv>
          </HighContrastRadioGroup>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      {_rettTilStonad === 'ja' && (
        <AlignStartRow>
          <Column>
            <HighContrastRadioGroup
              id={namespace + '-bekreftelsesgrunn'}
              data-test-id={namespace + '-bekreftelsesgrunn'}
              legend={t('label:artikkelnummer') + ' *'}
              key={'bekreftelsesgrunn-' + rettTilYtelse?.bekreftelsesgrunn}
              feil={validation[namespace + '-bekreftelsesgrunn']?.feilmelding}
            >
              <VerticalSeparatorDiv size='0.5' />
              <PileDiv>
                <HorizontalSeparatorDiv size='0.2' />
                <HighContrastRadio
                  name={namespace + '-bekreftelsesgrunn'}
                  checked={rettTilYtelse?.bekreftelsesgrunn === 'artikkel_64_i_forordningen_EF_nr._883/2004'}
                  label={t('label:artikkel-64')}
                  onClick={() => setBekreftelsesgrunn('artikkel_64_i_forordningen_EF_nr._883/2004')}
                />
                <HorizontalSeparatorDiv size='2' />
                <HighContrastRadio
                  name={namespace + '-bekreftelsesgrunn'}
                  checked={rettTilYtelse?.bekreftelsesgrunn === 'artikkel_65_1_i_forordningen_EF_nr._883/2004'}
                  label={t('label:artikkel-65')}
                  onClick={() => setBekreftelsesgrunn('artikkel_65_1_i_forordningen_EF_nr._883/2004')}
                />
              </PileDiv>
            </HighContrastRadioGroup>
          </Column>
        </AlignStartRow>
      )}
      {_rettTilStonad === 'nei' && (
        <AlignStartRow>
          <Column>
            <HighContrastRadioGroup
              id={namespace + '-avvisningsgrunn'}
              data-test-id={namespace + '-avvisningsgrunn'}
              legend={t('label:grunn') + ' *'}
              key={'avvisningsgrunn-' + rettTilYtelse?.avvisningsgrunn}
              feil={validation[namespace + '-avvisningsgrunn']?.feilmelding}
            >
              <VerticalSeparatorDiv size='0.5' />
              <PileDiv>
                <HorizontalSeparatorDiv size='0.2' />
                <HighContrastRadio
                  name={namespace + '-avvisningsgrunn'}
                  checked={rettTilYtelse?.avvisningsgrunn === 'ingen_rett_til_stønad_i_henhold_til_lovgivningen_til_institusjonen_som_utsteder_denne_meldingen'}
                  label={t('label:grunn-ingen-rett')}
                  onClick={() => setAvvisningsGrunn('ingen_rett_til_stønad_i_henhold_til_lovgivningen_til_institusjonen_som_utsteder_denne_meldingen')}
                />
                <HorizontalSeparatorDiv size='2' />
                <HighContrastRadio
                  name={namespace + '-avvisningsgrunn'}
                  checked={rettTilYtelse?.avvisningsgrunn === 'personen_søkte_ikke_om_eksport_av_stønad_på_riktig_måte'}
                  label={t('label:grunn-personen')}
                  onClick={() => setAvvisningsGrunn('personen_søkte_ikke_om_eksport_av_stønad_på_riktig_måte')}
                />
              </PileDiv>
            </HighContrastRadioGroup>
          </Column>
        </AlignStartRow>
      )}
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <PeriodeInput
          key={'' + rettTilYtelse?.periode?.startdato + rettTilYtelse?.periode?.sluttdato}
          namespace={namespace}
          errorStartDato={validation[namespace + '-periode-startdato']?.feilmelding}
          errorSluttDato={validation[namespace + '-periode-sluttdato']?.feilmelding}
          setStartDato={setStartDato}
          setSluttDato={setSluttDato}
          valueStartDato={rettTilYtelse?.periode?.startdato ?? ''}
          valueSluttDato={rettTilYtelse?.periode?.sluttdato ?? ''}
        />
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
    </PaddedDiv>
  )
}

export default RettTilYtelser
