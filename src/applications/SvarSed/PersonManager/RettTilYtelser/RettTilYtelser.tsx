import classNames from 'classnames'
import Period from 'components/Period/Period'
import { Periode, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import {
  AlignStartRow, PaddedDiv, PileDiv,
  Column,
  HighContrastRadio,
  HighContrastRadioGroup,
  HorizontalSeparatorDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface RettTilYtelserProps {
  personID: string
  parentNamespace: string,
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const RettTilYtelser: React.FC<RettTilYtelserProps> = ({
  personID,
  parentNamespace,
  replySed,
  resetValidation,
  updateReplySed,
  validation
}:RettTilYtelserProps): JSX.Element => {
  const { t } = useTranslation()
  // TODO this
  const target = 'xxx-retttilytelser'
  const xxx: any = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-retttilytelser`

  const setStartDato = (startdato: string) => {
    updateReplySed(`${target}.startdato`, startdato.trim())
    if (validation[namespace + '-startdato']) {
      resetValidation(namespace + '-startdato')
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
    updateReplySed(target, newAnmodningsperiode)
    if (validation[namespace + '-sluttdato']) {
      resetValidation(namespace + '-sluttdato')
    }
  }

  const setRettTilStonad = (rettTilStand: string) => {
    updateReplySed(`${target}.rettTilStonad`, rettTilStand.trim())
    if (validation[namespace + '-retttilstonad']) {
      resetValidation(namespace + '-retttilstonad')
    }
  }

  const setArtikkelNummer = (artikkelNummer: string) => {
    updateReplySed(`${target}.artikkelNummer`, artikkelNummer.trim())
    if (validation[namespace + '-artikkelnummer']) {
      resetValidation(namespace + '-artikkelnummer')
    }
  }

  const setGrunn = (grunn: string) => {
    updateReplySed(`${target}.grunn`, grunn.trim())
    if (validation[namespace + '-grunn']) {
      resetValidation(namespace + '-grunn')
    }
  }

  return (
    <PaddedDiv>
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
