import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import Period from 'components/Period/Period'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { JaNei, Periode, PeriodeSykSvangerskapOmsorg, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import { Country } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Normaltekst } from 'nav-frontend-typografi'
import {
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
import { validatePeriodeSvangerskap, ValidationPeriodeSvangerskapProps } from './validationPeriodeSvangerskap'

export interface ArbeidsforholdSvangerskapSelector extends PersonManagerFormSelector {
  replySed: ReplySed | undefined
  validation: Validation
}

export interface ArbeidsforholdSvangerskapProps {
  parentNamespace: string
  target: string
  typeTrygdeforhold: string
}

const mapState = (state: State): ArbeidsforholdSvangerskapSelector => ({
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const ArbeidsforholdSvangerskap: React.FC<ArbeidsforholdSvangerskapProps> = ({
  parentNamespace,
  target,
  typeTrygdeforhold
}: ArbeidsforholdSvangerskapProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    replySed,
    validation
  } = useSelector<State, ArbeidsforholdSvangerskapSelector>(mapState)
  const dispatch = useDispatch()
  const perioder: Array<PeriodeSykSvangerskapOmsorg> | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${target}`

  const [_newStartDato, _setNewStartDato] = useState<string>('')
  const [_newSluttDato, _setNewSluttDato] = useState<string>('')

  const [_newInstitutionsId, _setNewInstitutionsId] = useState<string>('')
  const [_newInstitutionsNavn, _setNewInstitutionsNavn] = useState<string>('')
  const [_newErInstitusjonsIdKjent, _setNewErInstitusjonsIdKjent] = useState<JaNei | undefined>(undefined)
  const [_newNavn, _setNewNavn] = useState<string>('')
  const [_newGate, _setNewGate] = useState<string>('')
  const [_newPostnummer, _setNewPostnummer] = useState<string>('')
  const [_newBy, _setNewBy] = useState<string>('')
  const [_newBygning, _setNewBygning] = useState<string>('')
  const [_newRegion, _setNewRegion] = useState<string>('')
  const [_newLand, _setNewLand] = useState<string>('')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<PeriodeSykSvangerskapOmsorg>(
    (p: PeriodeSykSvangerskapOmsorg) => p.periode.startdato + '-' + (p.periode.sluttdato ?? p.periode.aapenPeriodeType))
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] =
    useValidation<ValidationPeriodeSvangerskapProps>({}, validatePeriodeSvangerskap)

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

  const setErInstitusjonsIdKjent = (newErInstitusjonsIdKjent: JaNei, index: number) => {
    if (index < 0) {
      _setNewErInstitusjonsIdKjent(newErInstitusjonsIdKjent)
      _resetValidation(namespace + '-erinstitusjonsidkjent')
    } else {
      dispatch(updateReplySed(`${target}[${index}].erinstitusjonsidkjent`, newErInstitusjonsIdKjent))
      if (validation[namespace + getIdx(index) + '-erinstitusjonsidkjent']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-erinstitusjonsidkjent'))
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
      const newPerioder: Array<PeriodeSykSvangerskapOmsorg> = _.cloneDeep(perioder) as Array<PeriodeSykSvangerskapOmsorg>
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
    _setNewErInstitusjonsIdKjent(undefined)
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
    const newPerioder: Array<PeriodeSykSvangerskapOmsorg> = _.cloneDeep(perioder) as Array<PeriodeSykSvangerskapOmsorg>
    const deletedPerioder: Array<PeriodeSykSvangerskapOmsorg> = newPerioder.splice(index, 1)
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

    const newPeriodeSvangerskap: PeriodeSykSvangerskapOmsorg = {
      periode: newPeriode,
      typeTrygdeforhold: typeTrygdeforhold,
      institusjonsnavn: _newInstitutionsNavn.trim(),
      navn: _newNavn.trim(),
      institusjonsid: _newInstitutionsId.trim(),
      erinstitusjonsidkjent: _newErInstitusjonsIdKjent as JaNei,
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
      periodeSvangerskap: newPeriodeSvangerskap,
      perioderSvangerskap: perioder ?? [],
      namespace: namespace
    })
    if (valid) {
      let newPerioderSvangerskap: Array<PeriodeSykSvangerskapOmsorg> | undefined = _.cloneDeep(perioder)
      if (_.isNil(newPerioderSvangerskap)) {
        newPerioderSvangerskap = []
      }
      newPerioderSvangerskap = newPerioderSvangerskap.concat(newPeriodeSvangerskap)
      dispatch(updateReplySed(target, newPerioderSvangerskap))
      resetForm()
    }
  }

  const renderRow = (periodeSvangerskap: PeriodeSykSvangerskapOmsorg | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periodeSvangerskap)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
    const startdato = index < 0 ? _newStartDato : periodeSvangerskap?.periode?.startdato
    const sluttdato = index < 0 ? _newSluttDato : periodeSvangerskap?.periode?.sluttdato

    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
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
              key={'institusjonsid-' + (index < 0 ? _newInstitutionsId : periodeSvangerskap?.institusjonsid ?? '')}
              label={t('label:institusjonens-id')}
              onChanged={(institusjonsid: string) => setInstitutionsId(institusjonsid, index)}
              value={index < 0 ? _newInstitutionsId : periodeSvangerskap?.institusjonsid ?? ''}
            />
          </Column>
          <Column>
            <Input
              feil={getErrorFor(index, 'institusjonsnavn')}
              namespace={namespace}
              id='institusjonsnavn'
              key={'institusjonsnavn-' + (index < 0 ? _newInstitutionsNavn : periodeSvangerskap?.institusjonsnavn ?? '')}
              label={t('label:institusjonens-navn')}
              onChanged={(institusjonsnavn: string) => setInstitutionsNavn(institusjonsnavn, index)}
              value={index < 0 ? _newInstitutionsNavn : periodeSvangerskap?.institusjonsnavn ?? ''}
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
              key={'navn-' + (index < 0 ? _newNavn : periodeSvangerskap?.navn ?? '')}
              label={t('label:navn')}
              onChanged={(navn: string) => setNavn(navn, index)}
              value={index < 0 ? _newNavn : periodeSvangerskap?.navn ?? ''}
            />
          </Column>
          <Column>
            <HighContrastRadioPanelGroup
              checked={index < 0 ? _newErInstitusjonsIdKjent : periodeSvangerskap?.erinstitusjonsidkjent ?? ''}
              data-test-id={namespace + idx + '-erinstitusjonsidkjent'}
              data-no-border
              id={namespace + idx + '-erinstitusjonsidkjent'}
              feil={getErrorFor(index, 'erinstitusjonsidkjent')}
              legend={t('label:institusjonens-id-er-kjent') + ' *'}
              name={namespace + idx + '-erinstitusjonsidkjent'}
              radios={[
                { label: t('label:ja'), value: 'ja' },
                { label: t('label:nei'), value: 'nei' }
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setErInstitusjonsIdKjent(e.target.value as JaNei, index)}
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
              key={'gate-' + (index < 0 ? _newGate : periodeSvangerskap?.adresse?.gate)}
              label={t('label:gateadresse')}
              onChanged={(gate: string) => setGate(gate, index)}
              value={index < 0 ? _newGate : periodeSvangerskap?.adresse?.gate}
            />
          </Column>
          <Column>
            <Input
              namespace={namespace}
              feil={getErrorFor(index, 'bygning')}
              id='bygning'
              key={'bygning-' + (index < 0 ? _newBygning : periodeSvangerskap?.adresse?.bygning ?? '')}
              label={t('label:bygning')}
              onChanged={(newBygning: string) => setBygning(newBygning, index)}
              value={index < 0 ? _newBygning : periodeSvangerskap?.adresse?.bygning ?? ''}
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
              key={'postnummer-' + (index < 0 ? _newPostnummer : periodeSvangerskap?.adresse?.postnummer ?? '')}
              label={t('label:postnummer')}
              onChanged={(newPostnummer: string) => setPostnummer(newPostnummer, index)}
              value={index < 0 ? _newPostnummer : periodeSvangerskap?.adresse?.postnummer ?? ''}
            />
          </Column>
          <Column flex='3'>
            <Input
              namespace={namespace}
              feil={getErrorFor(index, 'by')}
              id='by'
              key={'by-' + (index < 0 ? _newBy : periodeSvangerskap?.adresse?.by ?? '')}
              label={t('label:by')}
              onChanged={(newBy: string) => setBy(newBy, index)}
              value={index < 0 ? _newBy : periodeSvangerskap?.adresse?.by ?? ''}
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
              key={'region-' + (index < 0 ? _newRegion : periodeSvangerskap?.adresse?.region ?? '')}
              label={t('label:region')}
              onChanged={(newRegion: string) => setRegion(newRegion, index)}
              value={index < 0 ? _newRegion : periodeSvangerskap?.adresse?.region ?? ''}
            />
          </Column>
          <Column flex='2'>
            <CountrySelect
              closeMenuOnSelect
              key={'land-' + (index < 0 ? _newLand : periodeSvangerskap?.adresse?.land ?? '')}
              data-test-id={namespace + '-land'}
              error={getErrorFor(index, 'land')}
              flagWave
              id={namespace + '-land'}
              label={t('label:land') + ' *'}
              menuPortalTarget={document.body}
              onOptionSelected={(e: Country) => setLand(e.value, index)}
              placeholder={t('el:placeholder-select-default')}
              values={index < 0 ? _newLand : periodeSvangerskap?.adresse?.land ?? ''}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='2' />
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(periodeSvangerskap)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(periodeSvangerskap)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </RepeatableRow>
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

export default ArbeidsforholdSvangerskap
