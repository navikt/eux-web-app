import classNames from 'classnames'
import Input from 'components/Forms/Input'
import Period from 'components/Period/Period'
import { Periode, ReplySed } from 'declarations/sed'
import { Kodeverk, Validation } from 'declarations/types'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  AlignStartRow, FlexDiv, PaddedDiv,
  HighContrastRadio,
  HighContrastRadioGroup,
  HorizontalSeparatorDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface PeriodeForDagpengerProps {
  landkoderList: Array<Kodeverk>
  personID: string
  parentNamespace: string,
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const PeriodeForDagpenger: React.FC<PeriodeForDagpengerProps> = ({
  landkoderList,
  personID,
  parentNamespace,
  replySed,
  resetValidation,
  updateReplySed,
  validation
}:PeriodeForDagpengerProps): JSX.Element => {
  const { t } = useTranslation()
  // TODO this
  const target = 'xxx-periodefordagpenger'
  const xxx: any = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-periodefordagpenger`

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

  const setKjentInstitusjon = (kjentInstitusjon: string) => {
    updateReplySed(`${target}.kjentInstitusjon`, kjentInstitusjon.trim())
    if (validation[namespace + '-kjentinstitusjon']) {
      resetValidation(namespace + '-kjentinstitusjon')
    }
  }

  const setInstitusjonensNavn = (institusjonensNavn: string) => {
    updateReplySed(`${target}.institusjonensNavn`, institusjonensNavn.trim())
    if (validation[namespace + '-institusjonensnavn']) {
      resetValidation(namespace + '-institusjonensnavn')
    }
  }

  const setInstitusjonensId = (institusjonensId: string) => {
    updateReplySed(`${target}.institusjonensId`, institusjonensId.trim())
    if (validation[namespace + '-institusjonensid']) {
      resetValidation(namespace + '-institusjonensid')
    }
  }

  const setGate = (gate: string) => {
    updateReplySed(`${target}.gate`, gate.trim())
    if (validation[namespace + '-gate']) {
      resetValidation(namespace + +'-gate')
    }
  }

  const setPostnummer = (postnummer: string) => {
    updateReplySed(`${target}.postnummer`, postnummer.trim())
    if (validation[namespace + '-postnummer']) {
      resetValidation(namespace + '-postnummer')
    }
  }

  const setBy = (by: string) => {
    updateReplySed(`${target}.by`, by.trim())
    if (validation[namespace + '-by']) {
      resetValidation(namespace + '-by')
    }
  }

  const setRegion = (region: string) => {
    updateReplySed(`${target}.region`, region.trim())
    if (validation[namespace + '-region']) {
      resetValidation(namespace + '-region')
    }
  }

  const setLand = (land: string) => {
    updateReplySed(`${target}.land`, land.trim())
    if (validation[namespace + '-land']) {
      resetValidation(namespace + '-land')
    }
  }

  return (
    <PaddedDiv>
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <Undertittel>
            {t('label:periode-med-dagpenger')}
          </Undertittel>
        </Column>
      </AlignStartRow>
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
      <AlignStartRow>
        <Column>
          <HighContrastRadioGroup
            id={namespace + '-kjentinstitusjon'}
            className={classNames('slideInFromLeft')}
            data-test-id={namespace + '-kjentinstitusjon'}
            legend={t('label:vedtak-angående-alle-barn') + ' *'}
            feil={validation[namespace + '-kjentinstitusjon']?.feilmelding}
          >
            <VerticalSeparatorDiv size='0.5' />
            <FlexDiv>
              <HorizontalSeparatorDiv size='0.2' />
              <HighContrastRadio
                name={namespace + '-barn'}
                checked={xxx?.kjentInstitusjon === 'ja'}
                label={t('label:ja')}
                onClick={() => setKjentInstitusjon('ja')}
              />
              <HorizontalSeparatorDiv size='2' />
              <HighContrastRadio
                name={namespace + '-barn'}
                checked={xxx?.kjentInstitusjon === 'nei'}
                label={t('label:nei')}
                onClick={() => setKjentInstitusjon('nei')}
              />
            </FlexDiv>
          </HighContrastRadioGroup>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      {!_.isNil(xxx?.kjentInstitusjon) && (
        <>
          <AlignStartRow>
            <Column flex='2'>
              <Input
                feil={validation[namespace + '-institusjonensNavn']?.feilmelding}
                namespace={namespace}
                id='institusjonensNavn'
                label={t('label:institusjonens-navn') + ' *'}
                onChanged={setInstitusjonensNavn}
                value={xxx?.institusjonensNavn ?? ''}
              />
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
        </>
      )}
      {xxx?.kjentInstitusjon === 'ja' && (
        <AlignStartRow>
          <Column flex='2'>
            <Input
              feil={validation[namespace + '-institusjonensId']?.feilmelding}
              namespace={namespace}
              id='institusjonensId'
              label={t('label:institusjonens-id') + ' *'}
              onChanged={setInstitusjonensId}
              value={xxx?.institusjonensId ?? ''}
            />
          </Column>
        </AlignStartRow>
      )}
      {xxx?.kjentInstitusjon === 'nei' && (
        <>
          <Undertittel>
            {t('label:institusjonens-adresse')}
          </Undertittel>
          <VerticalSeparatorDiv />
          <AlignStartRow
            className={classNames('slideInFromLeft')}
          >
            <Column flex='2'>
              <Input
                feil={validation[namespace + '-gate']?.feilmelding}
                namespace={namespace}
                id='gate'
                label={t('label:gateadresse') + ' *'}
                onChanged={setGate}
                value={xxx?.gate}
              />
            </Column>
            <Column />
          </AlignStartRow>
          <VerticalSeparatorDiv />
          <AlignStartRow
            className={classNames('slideInFromLeft')}
          >
            <Column>
              <Input
                feil={validation[namespace + '-postnummer']?.feilmelding}
                namespace={namespace}
                id='postnummer'
                label={t('label:postnummer') + ' *'}
                onChanged={setPostnummer}
                value={xxx?.postnummer}
              />
            </Column>
            <Column flex='2'>
              <Input
                feil={validation[namespace + '-by']?.feilmelding}
                namespace={namespace}
                id='by'
                label={t('label:by') + ' *'}
                onChanged={setBy}
                value={xxx?.by}
              />
            </Column>
            <Column />
          </AlignStartRow>
          <VerticalSeparatorDiv />
          <AlignStartRow
            className={classNames('slideInFromLeft')}
          >
            <Column flex='1.5'>
              <Input
                feil={validation[namespace + '-region']?.feilmelding}
                namespace={namespace}
                id='region'
                label={t('label:region') + ' *'}
                onChanged={setRegion}
                value={xxx?.region}
              />
            </Column>
            <Column flex='1.5'>
              <CountrySelect
                key={xxx?.land}
                closeMenuOnSelect
                data-test-id={namespace + '-land'}
                error={validation[namespace + '-land']?.feilmelding}
                id={namespace + '-land'}
                label={t('label:land') + ' *'}
                menuPortalTarget={document.body}
                includeList={landkoderList ? landkoderList.map((l: Kodeverk) => l.kode) : []}
                onOptionSelected={(e: any) => setLand(e.value)}
                placeholder={t('el:placeholder-select-default')}
                values={xxx?.land}
              />
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv size='2' />
        </>
      )}

    </PaddedDiv>
  )
}

export default PeriodeForDagpenger
