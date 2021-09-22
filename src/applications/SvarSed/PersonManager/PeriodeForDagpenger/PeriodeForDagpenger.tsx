import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  validatePeriodeDagpenger,
  ValidationPeriodeDagpengerProps
} from './validationPeriodeDagpenger'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import Period from 'components/Period/Period'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Periode, PeriodeDagpenger } from 'declarations/sed'
import { Kodeverk } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import { Country } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
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
    replySed,
    validation
  } = useSelector<State, PeriodeForDagpengerSelector>(mapState)
  const dispatch = useDispatch()
  const target = 'perioderDagpenger'
  const perioder: Array<PeriodeDagpenger> | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-periodefordagpenger`

  const [_newStartDato, _setNewStartDato] = useState<string>('')
  const [_newSluttDato, _setNewSluttDato] = useState<string>('')
  const [_newInstitutionsId, _setNewInstitutionsId] = useState<string>('')
  const [_newInstitutionsNavn, _setNewInstitutionsNavn] = useState<string>('')
  const [_newNavn, _setNewNavn] = useState<string>('')
  const [_newGate, _setNewGate] = useState<string>('')
  const [_newPostnummer, _setNewPostnummer] = useState<string>('')
  const [_newBy, _setNewBy] = useState<string>('')
  const [_newBygning, _setNewBygning] = useState<string>('')
  const [_newRegion, _setNewRegion] = useState<string>('')
  const [_newLand, _setNewLand] = useState<string>('')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<PeriodeDagpenger>(
    (p: PeriodeDagpenger) => p.periode.startdato + '-' + (p.periode.sluttdato ?? p.periode.aapenPeriodeType))
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] =
    useValidation<ValidationPeriodeDagpengerProps>({}, validatePeriodeDagpenger)

  const [cacheForIdMangler, setCacheForIdMangler] = useState<any>({})

  const setInstitutionsId = (newInstitutionsId: string, index: number) => {
    if (index < 0) {
      _setNewInstitutionsId(newInstitutionsId.trim())
      _resetValidation(namespace + '-institution-id')
    } else {
      dispatch(updateReplySed(`${target}[${index}].institution.id`, newInstitutionsId.trim()))
      if (validation[namespace + getIdx(index) + '-institution-id']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-institution-id'))
      }
    }
  }
  const setInstitutionsNavn = (newInstitutionsNavn: string, index: number) => {
    if (index < 0) {
      _setNewInstitutionsNavn(newInstitutionsNavn.trim())
      _resetValidation(namespace + '-institusjon-navn')
    } else {
      dispatch(updateReplySed(`${target}[${index}].institusjon.navn`, newInstitutionsNavn.trim()))
      if (validation[namespace + getIdx(index) + '-institusjon-navn']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-institusjon-navn'))
      }
    }
  }

  const setNewIdMangler = (newIdMangler: boolean, index: number) => {
    if (index < 0) {
      if (!newIdMangler) {
        setCacheForIdMangler({
          ...cacheForIdMangler,
          newitem: {
            navn: _newNavn,
            adresse: {
              gate: _newGate,
              postnummer: _newPostnummer,
              bygning: _newBygning,
              by: _newBy,
              region: _newRegion,
              land: _newLand
            }
          }
        })
        _setNewNavn('')
        _setNewGate('')
        _setNewPostnummer('')
        _setNewBy('')
        _setNewBygning('')
        _setNewRegion('')
        _setNewLand('')
      } else {
        if (Object.prototype.hasOwnProperty.call(cacheForIdMangler, 'newitem')) {
          _setNewNavn(cacheForIdMangler.newitem?.navn ?? '-')
          _setNewGate(cacheForIdMangler.newitem?.adresse.gate ?? '')
          _setNewPostnummer(cacheForIdMangler.newitem?.adresse.postnummer ?? '')
          _setNewBy(cacheForIdMangler.newitem?.adresse.by ?? '')
          _setNewBygning(cacheForIdMangler.newitem?.adresse.bygning ?? '')
          _setNewRegion(cacheForIdMangler.newitem?.adresse.region ?? '')
          _setNewLand(cacheForIdMangler.newitem?.adresse.land ?? '')
          setCacheForIdMangler({
            ...cacheForIdMangler,
            newitem: undefined
          })
        } else {
          // this is for telling render that I need to show the form for address
          _setNewNavn('-')
        }
      }
      _resetValidation(namespace + '-idmangler')
    } else {
      const _index: string = '' + index
      if (!newIdMangler) {
        setCacheForIdMangler({
          ...cacheForIdMangler,
          [_index]: {
            navn: _.get(perioder, `[${index}].institusjon.idmangler.navn`) ?? '',
            adresse: _.get(perioder, `[${index}].institusjon.idmangler.adresse`) ?? {}
          }
        })
        dispatch(updateReplySed(`${target}[${index}].institusjon.idmangler`, {}))
      } else {
        if (Object.prototype.hasOwnProperty.call(cacheForIdMangler, '' + index)) {
          dispatch(updateReplySed(`${target}[${index}].institusjon.idmangler`, {
            navn: cacheForIdMangler['' + index].navn,
            adresse: cacheForIdMangler['' + index].adresse
          }))
          setCacheForIdMangler({
            ...cacheForIdMangler,
            ['' + index]: undefined
          })
        } else {
          dispatch(updateReplySed(`${target}[${index}].institusjon.idmangler`, {
            navn: '-',
            adresse: {}
          }))
        }
      }
      if (validation[namespace + getIdx(index) + '-idmangler']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-idmangler'))
      }
    }
  }

  const setNavn = (newNavn: string, index: number) => {
    if (index < 0) {
      _setNewNavn(newNavn.trim())
      _resetValidation(namespace + '-institusjon-idmangler-navn')
    } else {
      dispatch(updateReplySed(`${target}[${index}].institusjon.idmangler.navn`, newNavn.trim()))
      if (validation[namespace + getIdx(index) + '-institusjon-idmangler-navn']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-institusjon-idmangler-navn'))
      }
    }
  }

  const setStartDato = (startdato: string, index: number) => {
    if (index < 0) {
      _setNewStartDato(startdato.trim())
      _resetValidation(namespace + '-periode-startdato')
    } else {
      dispatch(updateReplySed(`${target}[${index}].periode.startdato`, startdato.trim()))
      if (validation[namespace + getIdx(index) + '-periode-startdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-periode-startdato'))
      }
    }
  }

  const setSluttDato = (sluttdato: string, index: number) => {
    if (index < 0) {
      _setNewSluttDato(sluttdato.trim())
      _resetValidation(namespace + '-periode-sluttdato')
    } else {
      const newPerioder: Array<PeriodeDagpenger> = _.cloneDeep(perioder) as Array<PeriodeDagpenger>
      if (sluttdato === '') {
        delete newPerioder[index].periode.sluttdato
        newPerioder[index].periode.aapenPeriodeType = 'åpen_sluttdato'
      } else {
        delete newPerioder[index].periode.aapenPeriodeType
        newPerioder[index].periode.sluttdato = sluttdato.trim()
      }
      dispatch(updateReplySed(target, newPerioder))
      if (validation[namespace + getIdx(index) + '-periode-sluttdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-periode-sluttdato'))
      }
    }
  }

  const setGate = (gate: string, index: number) => {
    if (index < 0) {
      _setNewGate(gate.trim())
      _resetValidation(namespace + '-institusjon-idmangler-gate')
    } else {
      dispatch(updateReplySed(`${target}[${index}].institusjon.idmangler.gate`, gate.trim()))
      if (validation[namespace + getIdx(index) + '-institusjon-idmangler-gate']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-institusjon-idmangler-gate'))
      }
    }
  }

  const setPostnummer = (postnummer: string, index: number) => {
    if (index < 0) {
      _setNewPostnummer(postnummer.trim())
      _resetValidation(namespace + '-institusjon-idmangler-postnummer')
    } else {
      dispatch(updateReplySed(`${target}[${index}].institusjon.idmangler.postnummer`, postnummer.trim()))
      if (validation[namespace + getIdx(index) + '-institusjon-idmangler-postnummer']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-institusjon-idmangler-postnummer'))
      }
    }
  }

  const setBy = (by: string, index: number) => {
    if (index < 0) {
      _setNewBy(by.trim())
      _resetValidation(namespace + '-institusjon-idmangler-by')
    } else {
      dispatch(updateReplySed(`${target}[${index}].institusjon.idmangler.by`, by.trim()))
      if (validation[namespace + getIdx(index) + '-institusjon-idmangler-by']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-institusjon-idmangler-by'))
      }
    }
  }

  const setBygning = (bygning: string, index: number) => {
    if (index < 0) {
      _setNewBygning(bygning.trim())
      _resetValidation(namespace + '-institusjon-idmangler-bygning')
    } else {
      dispatch(updateReplySed(`${target}[${index}].institusjon.idmangler.bygning`, bygning.trim()))
      if (validation[namespace + getIdx(index) + '-institusjon-idmangler-bygning']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-institusjon-idmangler-bygning'))
      }
    }
  }

  const setRegion = (region: string, index: number) => {
    if (index < 0) {
      _setNewRegion(region.trim())
      _resetValidation(namespace + '-institusjon-idmangler-region')
    } else {
      dispatch(updateReplySed(`${target}[${index}].institusjon.idmangler.region`, region.trim()))
      if (validation[namespace + getIdx(index) + '-institusjon-idmangler-region']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-institusjon-idmangler-region'))
      }
    }
  }

  const setLand = (land: string, index: number) => {
    if (index < 0) {
      _setNewLand(land.trim())
      _resetValidation(namespace + '-institusjon-idmangler-land')
    } else {
      dispatch(updateReplySed(`${target}[${index}].institusjon.idmangler.land`, land.trim()))
      if (validation[namespace + getIdx(index) + '-institusjon-idmangler-land']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-institusjon-idmangler-land'))
      }
    }
  }

  const resetForm = () => {
    _setNewInstitutionsNavn('')
    _setNewInstitutionsId('')
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
    const newPerioder: Array<PeriodeDagpenger> = _.cloneDeep(perioder) as Array<PeriodeDagpenger>
    const deletedPerioder: Array<PeriodeDagpenger> = newPerioder.splice(index, 1)
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

    const newPeriodeDagpenger: PeriodeDagpenger = {
      periode: newPeriode,
      institusjon: {
        navn: _newInstitutionsNavn.trim(),
        id: _newInstitutionsId.trim(),
        idmangler: {
          navn: _newNavn.trim(),
          adresse: {
            gate: _newGate.trim(),
            postnummer: _newPostnummer.trim(),
            bygning: _newBygning.trim(),
            by: _newBy.trim(),
            region: _newRegion.trim(),
            land: _newLand.trim()
          }
        }
      }
    }

    const valid: boolean = performValidation({
      periodeDagpenger: newPeriodeDagpenger,
      perioderDagpenger: perioder ?? [],
      namespace: namespace
    })
    if (valid) {
      let newPerioderDagpenger: Array<PeriodeDagpenger> | undefined = _.cloneDeep(perioder)
      if (_.isNil(newPerioderDagpenger)) {
        newPerioderDagpenger = []
      }
      newPerioderDagpenger = newPerioderDagpenger.concat(newPeriodeDagpenger)
      dispatch(updateReplySed(target, newPerioderDagpenger))
      resetForm()
    }
  }

  const renderRow = (periodeDagpenger: PeriodeDagpenger | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periodeDagpenger)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
    const startdato = index < 0 ? _newStartDato : periodeDagpenger?.periode?.startdato
    const sluttdato = index < 0 ? _newSluttDato : periodeDagpenger?.periode?.sluttdato

    const idmangler = index < 0
      ? !_.isEmpty(_newNavn.trim()) || !_.isEmpty(_newGate.trim()) || !_.isEmpty(_newPostnummer.trim()) ||
        !_.isEmpty(_newBygning.trim()) || !_.isEmpty(_newBy.trim()) || !_.isEmpty(_newRegion.trim()) || !_.isEmpty(_newLand.trim())
      : !_.isEmpty(periodeDagpenger?.institusjon.idmangler?.navn) || !_.isEmpty(periodeDagpenger?.institusjon.idmangler?.adresse)

    const institusjonKjent = !idmangler
    return (
      <>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.3) + 's' }}
        >
          <Period
            key={'' + startdato + sluttdato}
            namespace={namespace}
            errorStartDato={getErrorFor(index, 'periode-startdato')}
            errorSluttDato={getErrorFor(index, 'periode-sluttdato')}
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
              feil={getErrorFor(index, 'institusjon-id')}
              namespace={namespace}
              id='institusjon-id'
              key={'institusjon-id-' + (index < 0 ? _newInstitutionsId : periodeDagpenger?.institusjon.id ?? '')}
              label={t('label:institusjonens-id')}
              onChanged={(institusjonsid: string) => setInstitutionsId(institusjonsid, index)}
              value={index < 0 ? _newInstitutionsId : periodeDagpenger?.institusjon.id ?? ''}
            />
          </Column>
          <Column>
            <Input
              feil={getErrorFor(index, 'institusjon-navn')}
              namespace={namespace}
              id='institusjon-navn'
              key={'institusjon-navn-' + (index < 0 ? _newInstitutionsNavn : periodeDagpenger?.institusjon.navn ?? '')}
              label={t('label:institusjonens-navn')}
              onChanged={(institusjonsnavn: string) => setInstitutionsNavn(institusjonsnavn, index)}
              value={index < 0 ? _newInstitutionsNavn : periodeDagpenger?.institusjon.navn ?? ''}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
          <Column>
            <HighContrastRadioPanelGroup
              checked={institusjonKjent ? 'ja' : 'nei'}
              data-test-id={namespace + idx + '-idmangler'}
              data-no-border
              id={namespace + idx + '-idmangler'}
              feil={getErrorFor(index, 'idmangler')}
              legend={t('label:institusjonens-id-er-kjent') + ' *'}
              name={namespace + idx + '-idmangler'}
              radios={[
                { label: t('label:ja'), value: 'ja' },
                { label: t('label:nei'), value: 'nei' }
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewIdMangler(e.target.value === 'nei', index)}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        {idmangler && (
          <>
            <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
              <Column>
                <Input
                  feil={getErrorFor(index, 'institusjon-idmangler-navn')}
                  namespace={namespace}
                  id='institusjon-idmangler-navn'
                  key={'institusjon-idmangler-navn-' + (index < 0 ? _newNavn : periodeDagpenger?.institusjon.idmangler?.navn ?? '')}
                  label={t('label:navn')}
                  onChanged={(navn: string) => setNavn(navn, index)}
                  value={index < 0 ? _newNavn : periodeDagpenger?.institusjon.idmangler?.navn ?? ''}
                />
              </Column>
              <Column />
            </AlignStartRow>

            <VerticalSeparatorDiv />
            <AlignStartRow>
              <Column flex='3'>
                <Input
                  namespace={namespace}
                  feil={getErrorFor(index, 'institusjon-idmangler-adresse-gate')}
                  id='institusjon-idmangler-adresse-gate'
                  key={'institusjon-idmangler-adresse-gate-' + (index < 0 ? _newGate : periodeDagpenger?.institusjon.idmangler?.adresse.gate)}
                  label={t('label:gateadresse')}
                  onChanged={(gate: string) => setGate(gate, index)}
                  value={index < 0 ? _newGate : periodeDagpenger?.institusjon.idmangler?.adresse.gate}
                />
              </Column>
              <Column>
                <Input
                  namespace={namespace}
                  feil={getErrorFor(index, 'institusjon-idmangler-adresse-bygning')}
                  id='institusjon-idmangler-adresse-bygning'
                  key={'institusjon-idmangler-adresse-bygning-' + (index < 0 ? _newBygning : periodeDagpenger?.institusjon.idmangler?.adresse.bygning ?? '')}
                  label={t('label:bygning')}
                  onChanged={(newBygning: string) => setBygning(newBygning, index)}
                  value={index < 0 ? _newBygning : periodeDagpenger?.institusjon.idmangler?.adresse.bygning ?? ''}
                />
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv />
            <AlignStartRow>
              <Column>
                <Input
                  namespace={namespace}
                  feil={getErrorFor(index, 'institusjon-idmangler-adresse-postnummer')}
                  id='institusjon-idmangler-adresse-postnummer'
                  key={'institusjon-idmangler-adresse-postnummer-' + (index < 0 ? _newPostnummer : periodeDagpenger?.institusjon.idmangler?.adresse.postnummer ?? '')}
                  label={t('label:postnummer')}
                  onChanged={(newPostnummer: string) => setPostnummer(newPostnummer, index)}
                  value={index < 0 ? _newPostnummer : periodeDagpenger?.institusjon.idmangler?.adresse.postnummer ?? ''}
                />
              </Column>
              <Column flex='3'>
                <Input
                  namespace={namespace}
                  feil={getErrorFor(index, 'institusjon-idmangler-adresse-by')}
                  id='institusjon-idmangler-adresse-by'
                  key={'institusjon-idmangler-adresse-by-' + (index < 0 ? _newBy : periodeDagpenger?.institusjon.idmangler?.adresse.by ?? '')}
                  label={t('label:by')}
                  onChanged={(newBy: string) => setBy(newBy, index)}
                  value={index < 0 ? _newBy : periodeDagpenger?.institusjon.idmangler?.adresse.by ?? ''}
                />
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv />
            <AlignStartRow>
              <Column flex='2'>
                <Input
                  namespace={namespace}
                  feil={getErrorFor(index, 'institusjon-idmangler-adresse-region')}
                  id='institusjon-idmangler-adresse-region'
                  key={'institusjon-idmangler-adresse-region-' + (index < 0 ? _newRegion : periodeDagpenger?.institusjon.idmangler?.adresse?.region ?? '')}
                  label={t('label:region')}
                  onChanged={(newRegion: string) => setRegion(newRegion, index)}
                  value={index < 0 ? _newRegion : periodeDagpenger?.institusjon.idmangler?.adresse?.region ?? ''}
                />
              </Column>
              <Column flex='2'>
                <CountrySelect
                  closeMenuOnSelect
                  key={'institusjon-idmangler-land-' + (index < 0 ? _newLand : periodeDagpenger?.institusjon.idmangler?.adresse?.land ?? '')}
                  data-test-id={namespace + '-institusjon-idmangler-adresse-land'}
                  error={getErrorFor(index, 'institusjon-idmangler-adresse-land')}
                  flagWave
                  id={namespace + '-institusjon-idmangler-adresse-land'}
                  label={t('label:land') + ' *'}
                  menuPortalTarget={document.body}
                  onOptionSelected={(e: Country) => setLand(e.value, index)}
                  placeholder={t('el:placeholder-select-default')}
                  values={index < 0 ? _newLand : periodeDagpenger?.institusjon.idmangler?.adresse?.land ?? ''}
                />
              </Column>
            </AlignStartRow>
          </>
        )}
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='2' />
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(periodeDagpenger)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(periodeDagpenger)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </>
    )
  }

  return (
    <PaddedDiv>
      <Undertittel>
        {t('label:periode-for-dagpenger')}
      </Undertittel>
      <VerticalSeparatorDiv size='2' />
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

export default PeriodeForDagpenger
