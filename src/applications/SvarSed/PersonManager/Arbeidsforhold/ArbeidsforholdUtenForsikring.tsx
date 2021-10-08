import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { JaNei, Periode, PeriodeUtenForsikring, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import { Country } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
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
import { getOrgnr } from 'utils/arbeidsgiver'
import { getIdx } from 'utils/namespace'
import { validatePeriodeUtenForsikring, ValidationPeriodeUtenForsikringProps } from './validationPeriodeUtenForsikring'

export interface ArbeidsforholdUtenForsikringSelector extends PersonManagerFormSelector {
  replySed: ReplySed | null | undefined
  validation: Validation
}

export interface ArbeidsforholdUtenForsikringProps {
  parentNamespace: string
  target: string
  typeTrygdeforhold: string
}

const mapState = (state: State): ArbeidsforholdUtenForsikringSelector => ({
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const ArbeidsforholdUtenForsikring: React.FC<ArbeidsforholdUtenForsikringProps> = ({
  parentNamespace,
  target,
  typeTrygdeforhold
}: ArbeidsforholdUtenForsikringProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    replySed,
    validation
  } = useSelector<State, ArbeidsforholdUtenForsikringSelector>(mapState)
  const dispatch = useDispatch()
  const perioder: Array<PeriodeUtenForsikring> | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${target}`

  const [_newPeriode, _setNewPeriode] = useState<Periode>({ startdato: '' })
  const [_newOrgnr, _setNewOrgnr] = useState<string>('')
  const [_newNavn, _setNewNavn] = useState<string>('')
  const [_newGate, _setNewGate] = useState<string>('')
  const [_newPostnummer, _setNewPostnummer] = useState<string>('')
  const [_newBy, _setNewBy] = useState<string>('')
  const [_newBygning, _setNewBygning] = useState<string>('')
  const [_newRegion, _setNewRegion] = useState<string>('')
  const [_newLand, _setNewLand] = useState<string>('')
  const [_newKreverinformasjonomtypearberidsforhold, _setNewKreverinformasjonomtypearberidsforhold] = useState<string>('')
  const [_newKreverinformasjonomantallarbeidstimer, _setNewKreverinformasjonomantallarbeidstimer] = useState<string>('')
  const [_newKreverinformasjonominntekt, _setNewKreverinformasjonominntekt] = useState<string>('')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<PeriodeUtenForsikring>(
    (p: PeriodeUtenForsikring) => p.periode.startdato + '-' + (p.periode.sluttdato ?? p.periode.aapenPeriodeType))
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] =
    useValidation<ValidationPeriodeUtenForsikringProps>({}, validatePeriodeUtenForsikring)

  const setNavn = (newNavn: string, index: number) => {
    if (index < 0) {
      _setNewNavn(newNavn.trim())
      _resetValidation(namespace + '-navn')
    } else {
      dispatch(updateReplySed(`${target}[${index}].arbeidsgiver.navn`, newNavn.trim()))
      if (validation[namespace + getIdx(index) + '-navn']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-navn'))
      }
    }
  }

  const setOrgnr = (newOrgnr: string, index: number) => {
    if (index < 0) {
      _setNewOrgnr(newOrgnr.trim())
      _resetValidation(namespace + '-orgnr')
    } else {
      dispatch(updateReplySed(`${target}[${index}].identifikator`, [
        { type: 'registrering', id: newOrgnr.trim() }
      ]))
      if (validation[namespace + getIdx(index) + '-orgnr']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-orgnr'))
      }
    }
  }

  const setPeriode = (periode: Periode, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      _resetValidation(namespace + '-startdato')
      _resetValidation(namespace + '-sluttdato')
    } else {
      dispatch(updateReplySed(`${target}[${index}].periode`, periode))
      if (validation[namespace + getIdx(index) + '-startdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-startdato'))
      }
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
      dispatch(updateReplySed(`${target}[${index}].gate`, gate.trim()))
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
      dispatch(updateReplySed(`${target}[${index}].postnummer`, postnummer.trim()))
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
      dispatch(updateReplySed(`${target}[${index}].by`, by.trim()))
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
      dispatch(updateReplySed(`${target}[${index}].bygning`, bygning.trim()))
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
      dispatch(updateReplySed(`${target}[${index}].region`, region.trim()))
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
      dispatch(updateReplySed(`${target}[${index}].land`, land.trim()))
      if (validation[namespace + getIdx(index) + '-land']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-land'))
      }
    }
  }

  const setKreverinformasjonomtypearberidsforhold = (newKreverinformasjonomtypearberidsforhold: string, index: number) => {
    if (index < 0) {
      _setNewKreverinformasjonomtypearberidsforhold(newKreverinformasjonomtypearberidsforhold.trim() as JaNei)
      _resetValidation(namespace + '-kreverinformasjonomtypearberidsforhold')
    } else {
      dispatch(updateReplySed(`${target}[${index}].kreverinformasjonomtypearberidsforhold`, newKreverinformasjonomtypearberidsforhold.trim()))
      if (validation[namespace + getIdx(index) + '-kreverinformasjonomtypearberidsforhold']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-kreverinformasjonomtypearberidsforhold'))
      }
    }
  }

  const setKreverinformasjonomantallarbeidstimer = (newKreverinformasjonomantallarbeidstimer: string, index: number) => {
    if (index < 0) {
      _setNewKreverinformasjonomantallarbeidstimer(newKreverinformasjonomantallarbeidstimer.trim() as JaNei)
      _resetValidation(namespace + '-kreverinformasjonomantallarbeidstimer')
    } else {
      dispatch(updateReplySed(`${target}[${index}].kreverinformasjonomantallarbeidstimer`, newKreverinformasjonomantallarbeidstimer.trim()))
      if (validation[namespace + getIdx(index) + '-kreverinformasjonomantallarbeidstimer']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-kreverinformasjonomantallarbeidstimer'))
      }
    }
  }

  const setKreverinformasjonominntekt = (newKreverinformasjonominntekt: string, index: number) => {
    if (index < 0) {
      _setNewKreverinformasjonominntekt(newKreverinformasjonominntekt.trim() as JaNei)
      _resetValidation(namespace + '-kreverinformasjonominntekt')
    } else {
      dispatch(updateReplySed(`${target}[${index}].kreverinformasjonominntekt`, newKreverinformasjonominntekt.trim()))
      if (validation[namespace + getIdx(index) + '-kreverinformasjonominntekt']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-kreverinformasjonominntekt'))
      }
    }
  }

  const resetForm = () => {
    _setNewNavn('')
    _setNewOrgnr('')
    _setNewPeriode({ startdato: '' })
    _setNewRegion('')
    _setNewBygning('')
    _setNewPostnummer('')
    _setNewGate('')
    _setNewBy('')
    _setNewLand('')
    _setNewKreverinformasjonomantallarbeidstimer('')
    _setNewKreverinformasjonomtypearberidsforhold('')
    _setNewKreverinformasjonominntekt('')
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (index: number) => {
    const newPerioder: Array<PeriodeUtenForsikring> = _.cloneDeep(perioder) as Array<PeriodeUtenForsikring>
    const deletedPerioder: Array<PeriodeUtenForsikring> = newPerioder.splice(index, 1)
    if (deletedPerioder && deletedPerioder.length > 0) {
      removeFromDeletion(deletedPerioder[0])
    }
    dispatch(updateReplySed(target, newPerioder))
    standardLogger('svarsed.editor.periode.remove', { type: target })
  }

  const onAdd = () => {
    const newPeriodeUtenForsikring: PeriodeUtenForsikring = {
      periode: _newPeriode,
      typeTrygdeforhold: typeTrygdeforhold,
      arbeidsgiver: {
        navn: _newNavn.trim(),
        identifikator: [{ type: 'registrering', id: _newOrgnr.trim() }],
        adresse: {
          gate: _newGate.trim(),
          postnummer: _newPostnummer.trim(),
          bygning: _newBygning.trim(),
          by: _newBy.trim(),
          region: _newRegion.trim(),
          land: _newLand.trim()
        }
      },
      kreverinformasjonomtypearberidsforhold: _newKreverinformasjonomtypearberidsforhold as JaNei,
      kreverinformasjonomantallarbeidstimer: _newKreverinformasjonomantallarbeidstimer as JaNei,
      kreverinformasjonominntekt: _newKreverinformasjonominntekt as JaNei
    }

    const valid: boolean = performValidation({
      periodeUtenForsikring: newPeriodeUtenForsikring,
      perioderUtenForsikring: perioder ?? [],
      namespace: namespace
    })
    if (valid) {
      let newPerioderUtenForsikring: Array<PeriodeUtenForsikring> | undefined = _.cloneDeep(perioder)
      if (_.isNil(newPerioderUtenForsikring)) {
        newPerioderUtenForsikring = []
      }
      newPerioderUtenForsikring = newPerioderUtenForsikring.concat(newPeriodeUtenForsikring)
      dispatch(updateReplySed(target, newPerioderUtenForsikring))
      standardLogger('svarsed.editor.periode.add', { type: target })
      resetForm()
    }
  }

  const renderRow = (periodeUtenForsikring: PeriodeUtenForsikring | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periodeUtenForsikring)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
    const _periode = index < 0 ? _newPeriode : periodeUtenForsikring?.periode

    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.3) + 's' }}
        >
          <PeriodeInput
            key={'' + _periode?.startdato + _periode?.sluttdato}
            namespace={namespace}
            error={{
              startdato: getErrorFor(index, 'startdato'),
              sluttdato: getErrorFor(index, 'sluttdato')
            }}
            setPeriode={(p: Periode) => setPeriode(p, index)}
            value={_periode}
          />
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
          <Column>
            <Input
              feil={getErrorFor(index, 'orgnr')}
              namespace={namespace}
              id='orgnr'
              key={'orgnr-' + (index < 0 ? _newOrgnr : getOrgnr(periodeUtenForsikring!))}
              label={t('label:orgnr')}
              onChanged={(orgnr: string) => setOrgnr(orgnr, index)}
              value={index < 0 ? _newOrgnr : getOrgnr(periodeUtenForsikring!)}
            />
          </Column>
          <Column>
            <Input
              feil={getErrorFor(index, 'navn')}
              namespace={namespace}
              id='navn'
              key={'navn-' + (index < 0 ? _newNavn : periodeUtenForsikring?.arbeidsgiver?.navn)}
              label={t('label:navn')}
              onChanged={(navn: string) => setNavn(navn, index)}
              value={index < 0 ? _newNavn : periodeUtenForsikring?.arbeidsgiver?.navn ?? ''}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='3'>
            <Input
              namespace={namespace}
              feil={getErrorFor(index, 'gate')}
              id='gate'
              key={'gate-' + (index < 0 ? _newGate : periodeUtenForsikring?.arbeidsgiver?.adresse?.gate)}
              label={t('label:gateadresse')}
              onChanged={(gate: string) => setGate(gate, index)}
              value={index < 0 ? _newGate : periodeUtenForsikring?.arbeidsgiver?.adresse?.gate}
            />
          </Column>
          <Column>
            <Input
              namespace={namespace}
              feil={getErrorFor(index, 'bygning')}
              id='bygning'
              key={'bygning-' + (index < 0 ? _newBygning : periodeUtenForsikring?.arbeidsgiver?.adresse?.bygning)}
              label={t('label:bygning')}
              onChanged={(newBygning: string) => setBygning(newBygning, index)}
              value={index < 0 ? _newBygning : periodeUtenForsikring?.arbeidsgiver?.adresse?.bygning}
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
              key={'postnummer-' + (index < 0 ? _newPostnummer : periodeUtenForsikring?.arbeidsgiver?.adresse?.postnummer)}
              label={t('label:postnummer')}
              onChanged={(newPostnummer: string) => setPostnummer(newPostnummer, index)}
              value={index < 0 ? _newPostnummer : periodeUtenForsikring?.arbeidsgiver?.adresse?.postnummer}
            />
          </Column>
          <Column flex='3'>
            <Input
              namespace={namespace}
              feil={getErrorFor(index, 'by')}
              id='by'
              key={'by-' + (index < 0 ? _newBy : periodeUtenForsikring?.arbeidsgiver?.adresse?.by)}
              label={t('label:by')}
              onChanged={(newBy: string) => setBy(newBy, index)}
              value={index < 0 ? _newBy : periodeUtenForsikring?.arbeidsgiver?.adresse?.by}
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
              key={'region-' + (index < 0 ? _newRegion : periodeUtenForsikring?.arbeidsgiver?.adresse?.region)}
              label={t('label:region')}
              onChanged={(newRegion: string) => setRegion(newRegion, index)}
              value={index < 0 ? _newRegion : periodeUtenForsikring?.arbeidsgiver?.adresse?.region}
            />
          </Column>
          <Column flex='2'>
            <CountrySelect
              closeMenuOnSelect
              key={'land-' + (index < 0 ? _newLand : periodeUtenForsikring?.arbeidsgiver?.adresse?.land)}
              data-test-id={namespace + '-land'}
              error={getErrorFor(index, 'land')}
              flagWave
              id={namespace + '-land'}
              label={t('label:land') + ' *'}
              menuPortalTarget={document.body}
              onOptionSelected={(e: Country) => setLand(e.value, index)}
              placeholder={t('el:placeholder-select-default')}
              values={index < 0 ? _newLand : periodeUtenForsikring?.arbeidsgiver?.adresse?.land}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='2'>
            <HighContrastRadioPanelGroup
              checked={index < 0 ? _newKreverinformasjonomtypearberidsforhold : periodeUtenForsikring?.kreverinformasjonomtypearberidsforhold}
              data-test-id={namespace + idx + '-kreverinformasjonomtypearberidsforhold'}
              data-no-border
              id={namespace + idx + '-kreverinformasjonomtypearberidsforhold'}
              feil={getErrorFor(index, 'kreverinformasjonomtypearberidsforhold')}
              legend={t('label:kreverinformasjonomtypearberidsforhold') + ' *'}
              name={namespace + idx + '-kreverinformasjonomtypearberidsforhold'}
              radios={[
                { label: t('label:ja'), value: 'ja' },
                { label: t('label:nei'), value: 'nei' }
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKreverinformasjonomtypearberidsforhold(e.target.value as JaNei, index)}
            />
          </Column>
          <Column flex='2' />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='2'>
            <HighContrastRadioPanelGroup
              checked={index < 0 ? _newKreverinformasjonomantallarbeidstimer : periodeUtenForsikring?.kreverinformasjonomantallarbeidstimer}
              data-test-id={namespace + idx + '-kreverinformasjonomantallarbeidstimer'}
              data-no-border
              id={namespace + idx + '-kreverinformasjonomantallarbeidstimer'}
              feil={getErrorFor(index, 'kreverinformasjonomantallarbeidstimer')}
              legend={t('label:kreverinformasjonomantallarbeidstimer') + ' *'}
              name={namespace + idx + '-kreverinformasjonomantallarbeidstimer'}
              radios={[
                { label: t('label:ja'), value: 'ja' },
                { label: t('label:nei'), value: 'nei' }
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKreverinformasjonomantallarbeidstimer(e.target.value as JaNei, index)}
            />
          </Column>
          <Column flex='2' />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='2'>
            <HighContrastRadioPanelGroup
              checked={index < 0 ? _newKreverinformasjonominntekt : periodeUtenForsikring?.kreverinformasjonominntekt}
              data-test-id={namespace + idx + '-kreverinformasjonominntekt'}
              data-no-border
              id={namespace + idx + '-kreverinformasjonominntekt'}
              feil={getErrorFor(index, 'kreverinformasjonominntekt')}
              legend={t('label:kreverinformasjonominntekt') + ' *'}
              name={namespace + idx + '-kreverinformasjonominntekt'}
              radios={[
                { label: t('label:ja'), value: 'ja' },
                { label: t('label:nei'), value: 'nei' }
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKreverinformasjonominntekt(e.target.value as JaNei, index)}
            />
          </Column>
          <Column flex='2'>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(periodeUtenForsikring)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(periodeUtenForsikring)}
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

export default ArbeidsforholdUtenForsikring
