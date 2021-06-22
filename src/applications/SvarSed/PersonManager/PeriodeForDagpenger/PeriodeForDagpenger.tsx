import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import classNames from 'classnames'
import Input from 'components/Forms/Input'
import Period from 'components/Period/Period'
import { State } from 'declarations/reducers'
import { Periode } from 'declarations/sed'
import { Kodeverk } from 'declarations/types'
import { Country } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column,
  FlexDiv,
  HighContrastRadio,
  HighContrastRadioGroup,
  HorizontalSeparatorDiv,
  PaddedDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

interface PeriodeForDagpengerSelector extends PersonManagerFormSelector {
  landkoderList: Array<Kodeverk> | undefined
}

const mapState = (state: State): PeriodeForDagpengerSelector => ({
  landkoderList: state.app.landkoder,
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const PeriodeForDagpenger: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    landkoderList,
    replySed,
    validation
  } = useSelector<State, PeriodeForDagpengerSelector>(mapState)
  const dispatch = useDispatch()
  // TODO this
  const target = 'xxxperiodefordagpenger'
  const xxx: any = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-periodefordagpenger`

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

  const setKjentInstitusjon = (kjentInstitusjon: string) => {
    dispatch(updateReplySed(`${target}.kjentInstitusjon`, kjentInstitusjon.trim()))
    if (validation[namespace + '-kjentinstitusjon']) {
      dispatch(resetValidation(namespace + '-kjentinstitusjon'))
    }
  }

  const setInstitusjonensNavn = (institusjonensNavn: string) => {
    dispatch(updateReplySed(`${target}.institusjonensNavn`, institusjonensNavn.trim()))
    if (validation[namespace + '-institusjonensnavn']) {
      dispatch(resetValidation(namespace + '-institusjonensnavn'))
    }
  }

  const setInstitusjonensId = (institusjonensId: string) => {
    dispatch(updateReplySed(`${target}.institusjonensId`, institusjonensId.trim()))
    if (validation[namespace + '-institusjonensid']) {
      dispatch(resetValidation(namespace + '-institusjonensid'))
    }
  }

  const setGate = (gate: string) => {
    dispatch(updateReplySed(`${target}.gate`, gate.trim()))
    if (validation[namespace + '-gate']) {
      dispatch(resetValidation(namespace + +'-gate'))
    }
  }

  const setPostnummer = (postnummer: string) => {
    dispatch(updateReplySed(`${target}.postnummer`, postnummer.trim()))
    if (validation[namespace + '-postnummer']) {
      dispatch(resetValidation(namespace + '-postnummer'))
    }
  }

  const setBy = (by: string) => {
    dispatch(updateReplySed(`${target}.by`, by.trim()))
    if (validation[namespace + '-by']) {
      dispatch(resetValidation(namespace + '-by'))
    }
  }

  const setRegion = (region: string) => {
    dispatch(updateReplySed(`${target}.region`, region.trim()))
    if (validation[namespace + '-region']) {
      dispatch(resetValidation(namespace + '-region'))
    }
  }

  const setLand = (land: string) => {
    dispatch(updateReplySed(`${target}.land`, land.trim()))
    if (validation[namespace + '-land']) {
      dispatch(resetValidation(namespace + '-land'))
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
                onOptionSelected={(e: Country) => setLand(e.value)}
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
