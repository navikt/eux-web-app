import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import classNames from 'classnames'
import Period from 'components/Period/Period'
import { State } from 'declarations/reducers'
import { Periode } from 'declarations/sed'
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
import React from 'react'
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
  // TODO this
  const target = 'xxx-retttilytelser'
  const xxx: any = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-retttilytelser`

  const setStartDato = (startdato: string) => {
    dispatch(updateReplySed(`${target}.startdato`, startdato.trim()))
    if (validation[namespace + '-startdato']) {
      dispatch(resetValidation(namespace + '-startdato'))
    }
  }

  const setSluttDato = (sluttdato: string) => {
    const newAnmodningsperiode: Periode = _.cloneDeep(xxx)
    if (sluttdato === '') {
      delete newAnmodningsperiode.sluttdato
      newAnmodningsperiode.aapenPeriodeType = 'åpen_sluttdato'
    } else {
      delete newAnmodningsperiode.aapenPeriodeType
      newAnmodningsperiode.sluttdato = sluttdato.trim()
    }
    dispatch(updateReplySed(target, newAnmodningsperiode))
    if (validation[namespace + '-sluttdato']) {
      dispatch(resetValidation(namespace + '-sluttdato'))
    }
  }

  const setRettTilStonad = (rettTilStand: string) => {
    dispatch(updateReplySed(`${target}.rettTilStonad`, rettTilStand.trim()))
    if (validation[namespace + '-retttilstonad']) {
      dispatch(resetValidation(namespace + '-retttilstonad'))
    }
  }

  const setArtikkelNummer = (artikkelNummer: string) => {
    dispatch(updateReplySed(`${target}.artikkelNummer`, artikkelNummer.trim()))
    if (validation[namespace + '-artikkelnummer']) {
      dispatch(resetValidation(namespace + '-artikkelnummer'))
    }
  }

  const setGrunn = (grunn: string) => {
    dispatch(updateReplySed(`${target}.grunn`, grunn.trim()))
    if (validation[namespace + '-grunn']) {
      dispatch(resetValidation(namespace + '-grunn'))
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
            className={classNames('slideInFromLeft')}
            data-test-id={namespace + '-retttilstønad'}
            legend={t('label:rett-til-stønad') + ' *'}
            feil={validation[namespace + '-retttilstønad']?.feilmelding}
          >
            <VerticalSeparatorDiv size='0.5' />
            <PileDiv>
              <HorizontalSeparatorDiv size='0.2' />
              <HighContrastRadio
                name={namespace + '-retttilstønad'}
                checked={xxx?.rettTilStonad === 'ja'}
                label={t('label:ja')}
                onClick={() => setRettTilStonad('ja')}
              />
              <HorizontalSeparatorDiv size='2' />
              <HighContrastRadio
                name={namespace + '-retttilstønad'}
                checked={xxx?.rettTilStonad === 'nei'}
                label={t('label:nei')}
                onClick={() => setRettTilStonad('nei')}
              />
            </PileDiv>
          </HighContrastRadioGroup>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      {xxx?.rettTilStonad === 'ja' && (
        <AlignStartRow>
          <Column>
            <HighContrastRadioGroup
              id={namespace + '-artikkelNummer'}
              className={classNames('slideInFromLeft')}
              data-test-id={namespace + '-artikkelnummer'}
              legend={t('label:artikkelnummer') + ' *'}
              feil={validation[namespace + '-artikkelnummer']?.feilmelding}
            >
              <VerticalSeparatorDiv size='0.5' />
              <PileDiv>
                <HorizontalSeparatorDiv size='0.2' />
                <HighContrastRadio
                  name={namespace + '-artikkelnummer'}
                  checked={xxx?.artikkelnummer === 'ja'}
                  label={t('label:artikkel-64')}
                  onClick={() => setArtikkelNummer('ja')}
                />
                <HorizontalSeparatorDiv size='2' />
                <HighContrastRadio
                  name={namespace + '-artikkelnummer'}
                  checked={xxx?.artikkelnummer === 'nei'}
                  label={t('label:artikkel-65')}
                  onClick={() => setArtikkelNummer('nei')}
                />
              </PileDiv>
            </HighContrastRadioGroup>
          </Column>
        </AlignStartRow>
      )}
      {xxx?.rettTilStonad === 'nei' && (
        <AlignStartRow>
          <Column>
            <HighContrastRadioGroup
              id={namespace + '-grunn'}
              className={classNames('slideInFromLeft')}
              data-test-id={namespace + '-grunn'}
              legend={t('label:grunn') + ' *'}
              feil={validation[namespace + '-grunn']?.feilmelding}
            >
              <VerticalSeparatorDiv size='0.5' />
              <PileDiv>
                <HorizontalSeparatorDiv size='0.2' />
                <HighContrastRadio
                  name={namespace + '-grunn'}
                  checked={xxx?.grunn === 'grunn-1'}
                  label={t('label:grunn-ingen-rett')}
                  onClick={() => setGrunn('grunn-1')}
                />
                <HorizontalSeparatorDiv size='2' />
                <HighContrastRadio
                  name={namespace + '-artikkelnummer'}
                  checked={xxx?.grunn === 'grunn-2'}
                  label={t('label:grunn-personen')}
                  onClick={() => setGrunn('grunn-2')}
                />
              </PileDiv>
            </HighContrastRadioGroup>
          </Column>
        </AlignStartRow>
      )}
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Period
          key={'' + xxx?.startdato + xxx?.sluttdato}
          namespace={namespace}
          errorStartDato={validation[namespace + '-startdato']?.feilmelding}
          errorSluttDato={validation[namespace + '-sluttdato']?.feilmelding}
          setStartDato={setStartDato}
          setSluttDato={setSluttDato}
          valueStartDato={xxx?.startdato ?? ''}
          valueSluttDato={xxx?.sluttdato ?? ''}
        />
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
    </PaddedDiv>
  )
}

export default RettTilYtelser
