import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import Period from 'components/Period/Period'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Periode, PeriodeAnnenForsikring, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import { Country } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Normaltekst } from 'nav-frontend-typografi'
import {
  AlignEndRow,
  AlignStartRow,
  Column,
  HighContrastFlatknapp,
  HighContrastRadioPanelGroup,
  HorizontalSeparatorDiv,
  PaddedDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getIdx } from 'utils/namespace'
import { validatePeriodeAnnen, ValidationPeriodeAnnenProps } from './validationPeriodeAnnen'

export interface ArbeidsforholdAnnenSelector extends PersonManagerFormSelector {
  replySed: ReplySed | undefined
  validation: Validation
}

export interface ArbeidsforholdAnnenProps {
  parentNamespace: string
  target: string
  typeTrygdeforhold: string
}

const mapState = (state: State): ArbeidsforholdAnnenSelector => ({
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const ArbeidsforholdAnnen: React.FC<ArbeidsforholdAnnenProps> = ({
  parentNamespace,
  target,
  typeTrygdeforhold
}: ArbeidsforholdAnnenProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    replySed,
    validation
  } = useSelector<State, ArbeidsforholdAnnenSelector>(mapState)
  const dispatch = useDispatch()
  const perioder: Array<PeriodeAnnenForsikring> | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${target}`

  const [_newStartDato, _setNewStartDato] = useState<string>('')
  const [_newSluttDato, _setNewSluttDato] = useState<string>('')

  const [_newInstitutionsId, _setNewInstitutionsId] = useState<string>('')
  const [_newInstitutionsNavn, _setNewInstitutionsNavn] = useState<string>('')
  const [_newInstitutionsType, _setNewInstitutionsType] = useState<string>('')
  const [_newVirksomhetensart, _setNewVirksomhetensart] = useState<string>('')
  const [_newNavn, _setNewNavn] = useState<string>('')
  const [_newGate, _setNewGate] = useState<string>('')
  const [_newPostnummer, _setNewPostnummer] = useState<string>('')
  const [_newBy, _setNewBy] = useState<string>('')
  const [_newBygning, _setNewBygning] = useState<string>('')
  const [_newRegion, _setNewRegion] = useState<string>('')
  const [_newLand, _setNewLand] = useState<string>('')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<PeriodeAnnenForsikring>(
    (p: PeriodeAnnenForsikring) => p.periode.startdato + '-' + (p.periode.sluttdato ?? p.periode.aapenPeriodeType))
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] =
    useValidation<ValidationPeriodeAnnenProps>({}, validatePeriodeAnnen)

  const setInstitutionsId = (newInstitutionsId: string, index: number) => {
    if (index < 0) {
      _setNewInstitutionsId(newInstitutionsId.trim())
      _resetValidation(namespace + '-institutionsid')
    } else {
      dispatch(updateReplySed(`${target}[${index}].institutionsid`, newInstitutionsId.trim()))
      if (validation[namespace + getIdx(index) + '-institutionsid']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-institutionsid'))
      }
    }
  }
  const setInstitutionsNavn = (newInstitutionsNavn: string, index: number) => {
    if (index < 0) {
      _setNewInstitutionsNavn(newInstitutionsNavn.trim())
      _resetValidation(namespace + '-institusjonsnavn')
    } else {
      dispatch(updateReplySed(`${target}[${index}].institusjonsnavn`, newInstitutionsNavn.trim()))
      if (validation[namespace + getIdx(index) + '-institusjonsnavn']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-institusjonsnavn'))
      }
    }
  }

  const setInstitutionsType = (newInstitutionsType: string, index: number) => {
    if (index < 0) {
      _setNewInstitutionsType(newInstitutionsType.trim())
      _resetValidation(namespace + '-institusjonstype')
    } else {
      dispatch(updateReplySed(`${target}[${index}].institusjonstype`, newInstitutionsType.trim()))
      if (validation[namespace + getIdx(index) + '-institusjonstype']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-institusjonstype'))
      }
    }
  }

  const setVirksomhetensart = (newVirksomhetsart: string, index: number) => {
    if (index < 0) {
      _setNewVirksomhetensart(newVirksomhetsart.trim())
      _resetValidation(namespace + '-virksomhetensart')
    } else {
      dispatch(updateReplySed(`${target}[${index}].virksomhetensart`, newVirksomhetsart.trim()))
      if (validation[namespace + getIdx(index) + '-virksomhetensart']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-virksomhetensart'))
      }
    }
  }

  const setNavn = (newNavn: string, index: number) => {
    if (index < 0) {
      _setNewNavn(newNavn.trim())
      _resetValidation(namespace + '-navn')
    } else {
      dispatch(updateReplySed(`${target}[${index}].navn`, newNavn.trim()))
      if (validation[namespace + getIdx(index) + '-navn']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-navn'))
      }
    }
  }

  const setStartDato = (startdato: string, index: number) => {
    if (index < 0) {
      _setNewStartDato(startdato.trim())
      _resetValidation(namespace + '-startdato')
    } else {
      dispatch(updateReplySed(`${target}[${index}].periode.startdato`, startdato.trim()))
      if (validation[namespace + getIdx(index) + '-startdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-startdato'))
      }
    }
  }

  const setSluttDato = (sluttdato: string, index: number) => {
    if (index < 0) {
      _setNewSluttDato(sluttdato.trim())
      _resetValidation(namespace + '-sluttdato')
    } else {
      const newPerioder: Array<PeriodeAnnenForsikring> = _.cloneDeep(perioder) as Array<PeriodeAnnenForsikring>
      if (sluttdato === '') {
        delete newPerioder[index].periode.sluttdato
        newPerioder[index].periode.aapenPeriodeType = 'åpen_sluttdato'
      } else {
        delete newPerioder[index].periode.aapenPeriodeType
        newPerioder[index].periode.sluttdato = sluttdato.trim()
      }
      dispatch(updateReplySed(target, newPerioder))
      if (validation[namespace + getIdx(index) + '-sluttdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-sluttdato'))
      }
    }
  }

  const setGate = (gate: string, index: number) => {
    if (index < 0) {
      _setNewGate(gate.trim())
      _resetValidation(namespace + '-gate')
    } else {
      dispatch(updateReplySed(`${target}[${index}].adresse.gate`, gate.trim()))
      if (validation[namespace + getIdx(index) + '-gate']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-gate'))
      }
    }
  }

  const setPostnummer = (postnummer: string, index: number) => {
    if (index < 0) {
      _setNewPostnummer(postnummer.trim())
      _resetValidation(namespace + '-postnummer')
    } else {
      dispatch(updateReplySed(`${target}[${index}].adresse.postnummer`, postnummer.trim()))
      if (validation[namespace + getIdx(index) + '-postnummer']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-postnummer'))
      }
    }
  }

  const setBy = (by: string, index: number) => {
    if (index < 0) {
      _setNewBy(by.trim())
      _resetValidation(namespace + '-by')
    } else {
      dispatch(updateReplySed(`${target}[${index}].adresse.by`, by.trim()))
      if (validation[namespace + getIdx(index) + '-by']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-by'))
      }
    }
  }

  const setBygning = (bygning: string, index: number) => {
    if (index < 0) {
      _setNewBygning(bygning.trim())
      _resetValidation(namespace + '-bygning')
    } else {
      dispatch(updateReplySed(`${target}[${index}].adresse.bygning`, bygning.trim()))
      if (validation[namespace + getIdx(index) + '-bygning']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-bygning'))
      }
    }
  }

  const setRegion = (region: string, index: number) => {
    if (index < 0) {
      _setNewRegion(region.trim())
      _resetValidation(namespace + '-region')
    } else {
      dispatch(updateReplySed(`${target}[${index}].adresse.region`, region.trim()))
      if (validation[namespace + getIdx(index) + '-region']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-region'))
      }
    }
  }

  const setLand = (land: string, index: number) => {
    if (index < 0) {
      _setNewLand(land.trim())
      _resetValidation(namespace + '-land')
    } else {
      dispatch(updateReplySed(`${target}[${index}].adresse.land`, land.trim()))
      if (validation[namespace + getIdx(index) + '-land']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-land'))
      }
    }
  }

  const resetForm = () => {
    _setNewInstitutionsNavn('')
    _setNewInstitutionsId('')
    _setNewInstitutionsType('')
    _setNewVirksomhetensart('')
    _setNewNavn('')
    _setNewSluttDato('')
    _setNewStartDato('')
    _setNewGate('')
    _setNewPostnummer('')
    _setNewRegion('')
    _setNewBygning('')
    _setNewBy('')
    _setNewLand('')
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (index: number) => {
    const newPerioder: Array<PeriodeAnnenForsikring> = _.cloneDeep(perioder) as Array<PeriodeAnnenForsikring>
    const deletedPerioder: Array<PeriodeAnnenForsikring> = newPerioder.splice(index, 1)
    if (deletedPerioder && deletedPerioder.length > 0) {
      removeFromDeletion(deletedPerioder[0])
    }
    dispatch(updateReplySed(target, newPerioder))
  }

  const onAdd = () => {
    const newPeriode: Periode = {
      startdato: _newStartDato
    }
    if (_newSluttDato) {
      newPeriode.sluttdato = _newSluttDato
    } else {
      newPeriode.aapenPeriodeType = 'åpen_sluttdato'
    }

    const newPeriodeAnnen: PeriodeAnnenForsikring = {
      periode: newPeriode,
      typeTrygdeforhold: typeTrygdeforhold,
      institusjonsnavn: _newInstitutionsNavn.trim(),
      navn: _newNavn.trim(),
      institusjonsid: _newInstitutionsId.trim(),
      institusjonstype: _newInstitutionsType.trim(),
      virksomhetensart: _newVirksomhetensart.trim(),
      adresse: {
        gate: _newGate.trim(),
        postnummer: _newPostnummer.trim(),
        bygning: _newBygning.trim(),
        by: _newBy.trim(),
        region: _newRegion.trim(),
        land: _newLand.trim()
      }
    }

    const valid: boolean = performValidation({
      periodeAnnen: newPeriodeAnnen,
      perioderAnnen: perioder ?? [],
      namespace: namespace
    })
    if (valid) {
      let newPerioderAnnen: Array<PeriodeAnnenForsikring> | undefined = _.cloneDeep(perioder)
      if (_.isNil(newPerioderAnnen)) {
        newPerioderAnnen = []
      }
      newPerioderAnnen = newPerioderAnnen.concat(newPeriodeAnnen)
      dispatch(updateReplySed(target, newPerioderAnnen))
      resetForm()
    }
  }

  const renderRow = (periodeAnnen: PeriodeAnnenForsikring | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periodeAnnen)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
    const startdato = index < 0 ? _newStartDato : periodeAnnen?.periode?.startdato
    const sluttdato = index < 0 ? _newSluttDato : periodeAnnen?.periode?.sluttdato

    return (
      <>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.3) + 's' }}
        >
          <Period
            key={'' + startdato + sluttdato}
            namespace={namespace}
            errorStartDato={getErrorFor(index, 'startdato')}
            errorSluttDato={getErrorFor(index, 'sluttdato')}
            setStartDato={(dato: string) => setStartDato(dato, index)}
            setSluttDato={(dato: string) => setSluttDato(dato, index)}
            valueStartDato={startdato}
            valueSluttDato={sluttdato}
          />
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
          <Column>
            <Input
              feil={getErrorFor(index, 'institusjonsid')}
              namespace={namespace}
              id='institusjonsid'
              key={'institusjonsid-' + (index < 0 ? _newInstitutionsId : periodeAnnen?.institusjonsid ?? '')}
              label={t('label:institusjonens-id')}
              onChanged={(institusjonsid: string) => setInstitutionsId(institusjonsid, index)}
              value={index < 0 ? _newInstitutionsId : periodeAnnen?.institusjonsid ?? ''}
            />
          </Column>
          <Column>
            <Input
              feil={getErrorFor(index, 'institusjonsnavn')}
              namespace={namespace}
              id='institusjonsnavn'
              key={'institusjonsnavn-' + (index < 0 ? _newInstitutionsNavn : periodeAnnen?.institusjonsnavn ?? '')}
              label={t('label:institusjonens-navn')}
              onChanged={(institusjonsnavn: string) => setInstitutionsNavn(institusjonsnavn, index)}
              value={index < 0 ? _newInstitutionsNavn : periodeAnnen?.institusjonsnavn ?? ''}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
          <Column>
            <Input
              feil={getErrorFor(index, 'navn')}
              namespace={namespace}
              id='navn'
              key={'navn-' + (index < 0 ? _newNavn : periodeAnnen?.navn ?? '')}
              label={t('label:navn')}
              onChanged={(navn: string) => setNavn(navn, index)}
              value={index < 0 ? _newNavn : periodeAnnen?.navn ?? ''}
            />
          </Column>
          <Column>
            <Input
              feil={getErrorFor(index, 'virksomhetensart')}
              namespace={namespace}
              id='virksomhetensart'
              key={'virksomhetensart-' + (index < 0 ? _newInstitutionsType : periodeAnnen?.virksomhetensart ?? '')}
              label={t('label:virksomhetens-art')}
              onChanged={(virksomhetensart: string) => setVirksomhetensart(virksomhetensart, index)}
              value={index < 0 ? _newVirksomhetensart : periodeAnnen?.virksomhetensart ?? ''}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='3'>
            <Input
              namespace={namespace}
              feil={getErrorFor(index, 'gate')}
              id='gate'
              key={'gate-' + (index < 0 ? _newGate : periodeAnnen?.adresse?.gate)}
              label={t('label:gateadresse')}
              onChanged={(gate: string) => setGate(gate, index)}
              value={index < 0 ? _newGate : periodeAnnen?.adresse?.gate}
            />
          </Column>
          <Column>
            <Input
              namespace={namespace}
              feil={getErrorFor(index, 'bygning')}
              id='bygning'
              key={'bygning-' + (index < 0 ? _newBygning : periodeAnnen?.adresse?.bygning ?? '')}
              label={t('label:bygning')}
              onChanged={(newBygning: string) => setBygning(newBygning, index)}
              value={index < 0 ? _newBygning : periodeAnnen?.adresse?.bygning ?? ''}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column>
            <Input
              namespace={namespace}
              feil={getErrorFor(index, 'postnummer')}
              id='postnummer'
              key={'postnummer-' + (index < 0 ? _newPostnummer : periodeAnnen?.adresse?.postnummer ?? '')}
              label={t('label:postnummer')}
              onChanged={(newPostnummer: string) => setPostnummer(newPostnummer, index)}
              value={index < 0 ? _newPostnummer : periodeAnnen?.adresse?.postnummer ?? ''}
            />
          </Column>
          <Column flex='3'>
            <Input
              namespace={namespace}
              feil={getErrorFor(index, 'by')}
              id='by'
              key={'by-' + (index < 0 ? _newBy : periodeAnnen?.adresse?.by ?? '')}
              label={t('label:by')}
              onChanged={(newBy: string) => setBy(newBy, index)}
              value={index < 0 ? _newBy : periodeAnnen?.adresse?.by ?? ''}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='2'>
            <Input
              namespace={namespace}
              feil={getErrorFor(index, 'region')}
              id='region'
              key={'region-' + (index < 0 ? _newRegion : periodeAnnen?.adresse?.region ?? '')}
              label={t('label:region')}
              onChanged={(newRegion: string) => setRegion(newRegion, index)}
              value={index < 0 ? _newRegion : periodeAnnen?.adresse?.region ?? ''}
            />
          </Column>
          <Column flex='2'>
            <CountrySelect
              closeMenuOnSelect
              key={'land-' + (index < 0 ? _newLand : periodeAnnen?.adresse?.land ?? '')}
              data-test-id={namespace + '-land'}
              error={getErrorFor(index, 'land')}
              flagWave
              id={namespace + '-land'}
              label={t('label:land') + ' *'}
              menuPortalTarget={document.body}
              onOptionSelected={(e: Country) => setLand(e.value, index)}
              placeholder={t('el:placeholder-select-default')}
              values={index < 0 ? _newLand : periodeAnnen?.adresse?.land ?? ''}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignEndRow>
          <Column flex='2'>
            <HighContrastRadioPanelGroup
              checked={_newInstitutionsType}
              data-multiple-line
              data-no-border
              key={namespace + 'institusjonstype' + _newInstitutionsType}
              data-test-id={namespace + '-institusjonstype'}
              id={namespace + '-institusjonstype'}
              name={namespace + '-institusjonstype'}
              legend={t('label:velg-type') + ' *'}
              radios={[
                { label: t('el:option-institusjonstype-01'), value: 'periode_med_frivillig_uavbrutt_forsikring' },
                { label: t('el:option-institusjonstype-02'), value: 'vederlag_for_ferie_som_ikke_er_tatt_ut' },
                { label: t('el:option-institusjonstype-03'), value: 'annen_periode_behandlet_som_forsikringsperiode' }
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInstitutionsType(e.target.value, index)}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(periodeAnnen)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(periodeAnnen)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignEndRow>
        <VerticalSeparatorDiv />
      </>
    )
  }

  return (
    <PaddedDiv>
      {_.isEmpty(perioder)
        ? (
          <Normaltekst>
            {t('message:warning-no-periods')}
          </Normaltekst>
        )
        : perioder?.map(renderRow)}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv size='2' />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <Row>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
    </PaddedDiv>
  )
}

export default ArbeidsforholdAnnen
