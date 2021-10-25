import {
  Add,
  Bag,
  Hospital,
  Law,
  Office1,
  Office2,
  PensionBag,
  Receipt,
  SchoolBag,
  ShakeHandsFilled,
  Stroller,
  Vacation
} from '@navikt/ds-icons'
import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import AdresseFC from 'applications/SvarSed/PersonManager/Adresser/Adresse'
import InntektOgTimeFC from 'applications/SvarSed/PersonManager/Forsikring/InntektOgTime'
import {
  validateForsikringPeriode,
  ValidationForsikringPeriodeProps
} from 'applications/SvarSed/PersonManager/Forsikring/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Military from 'assets/icons/Military'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import Select from 'components/Forms/Select'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import {
  Adresse, ArbeidsgiverIdentifikator,
  ForsikringPeriode, InntektOgTime,
  Periode,
  PeriodeAnnenForsikring,
  PeriodeMedForsikring, PeriodeUtenForsikring,
  U002Sed
} from 'declarations/sed'
import { Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import Chevron from 'nav-frontend-chevron'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  AlignEndRow,
  AlignStartRow,
  Column, FlexCenterDiv,
  HighContrastFlatknapp,
  HorizontalSeparatorDiv,
  PaddedDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getIdx } from 'utils/namespace'

interface ForsikringSelector extends PersonManagerFormSelector {
  highContrast: boolean
}

const mapState = (state: State): ForsikringSelector => ({
  highContrast: state.ui.highContrast,
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const Forsikring: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  personName
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    highContrast,
    replySed,
    validation
  } = useSelector<State, ForsikringSelector>(mapState)
  const dispatch = useDispatch()
  const namespace = `${parentNamespace}-${personID}-forsikring`

  const [_newType, _setNewType] = useState<string>('perioderAnsattMedForsikring')
  const [_newPeriode, _setNewPeriode] = useState<ForsikringPeriode |undefined>(undefined)
  const [_allPeriods, _setAllPeriods] = useState<Array<ForsikringPeriode>>([])

  const [_newNavn, _setNewNavn] = useState<string | undefined>(undefined)
  const [_newAdresse, _setNewAdresse] = useState<Adresse | undefined>(undefined)
  const [_newIdentifikator, _setNewIdentifikator] = useState<Array<ArbeidsgiverIdentifikator> | undefined>(undefined)
  const [_newInntektOgTime, _setNewInntektOgTime] = useState<Array<InntektOgTime> | undefined>(undefined)
  const [_newInntektOgTimeInfo, _setNewInntektOgTimeInfo] = useState<string | undefined>(undefined)
  const [_newAnnenTypeForsikringsperiode, _setNewAnnenTypeForsikringsperiode] = useState<string | undefined>(undefined)

  const getId = (p: ForsikringPeriode): string => (p.__type + '-' + p?.startdato ?? '') + '-' + (p?.sluttdato ?? p.aapenPeriodeType)
  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Periode>(getId)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_visible, _setVisible] = useState<{[k in string]: Array<number>| undefined}>({})
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationForsikringPeriodeProps>({}, validateForsikringPeriode)

  const isVisible = (type: string, index: number): boolean => Object.prototype.hasOwnProperty.call(_visible, type) && _visible[type]!.indexOf(index) >= 0

  const toggleVisibility = (type: string, index: number) => {
    const visible: boolean = isVisible(type, index)
    let newVisible = _.cloneDeep(_visible)
    newVisible[type] = visible
      ? _.filter(_visible[type], (it) => it !== index)
      : _.isNil(_visible[type])
        ? _visible[type] = [index]
        : _visible[type]!.concat(index)
    _setVisible(newVisible)
  }

  useEffect(() => {
    const periodes: Array<ForsikringPeriode> = [];
    (replySed as U002Sed)?.perioderAnsattMedForsikring?.forEach(p => periodes.push({ ...p, __type: 'perioderAnsattMedForsikring' }));
    (replySed as U002Sed)?.perioderAnsattUtenForsikring?.forEach(p => periodes.push({ ...p, __type: 'perioderAnsattUtenForsikring' }));
    (replySed as U002Sed)?.perioderSelvstendigMedForsikring?.forEach(p => periodes.push({ ...p, __type: 'perioderSelvstendigMedForsikring' }));
    (replySed as U002Sed)?.perioderSelvstendigUtenForsikring?.forEach(p => periodes.push({ ...p, __type: 'perioderSelvstendigUtenForsikring' }));
    (replySed as U002Sed)?.perioderFrihetsberoevet?.forEach(p => periodes.push({ ...p, __type: 'perioderFrihetsberoevet' }));
    (replySed as U002Sed)?.perioderSyk?.forEach(p => periodes.push({ ...p, __type: 'perioderSyk' }));
    (replySed as U002Sed)?.perioderSvangerskapBarn?.forEach(p => periodes.push({ ...p, __type: 'perioderSvangerskapBarn' }));
    (replySed as U002Sed)?.perioderUtdanning?.forEach(p => periodes.push({ ...p, __type: 'perioderUtdanning' }));
    (replySed as U002Sed)?.perioderMilitaertjeneste?.forEach(p => periodes.push({ ...p, __type: 'perioderMilitaertjeneste' }));
    (replySed as U002Sed)?.perioderAnnenForsikring?.forEach(p => periodes.push({ ...p, __type: 'perioderAnnenForsikring' }));
    (replySed as U002Sed)?.perioderFrivilligForsikring?.forEach(p => periodes.push({ ...p, __type: 'perioderFrivilligForsikring' }));
    (replySed as U002Sed)?.perioderKompensertFerie?.forEach(p => periodes.push({ ...p, __type: 'perioderKompensertFerie' }))
    _setAllPeriods(periodes.sort((a: ForsikringPeriode, b: ForsikringPeriode) => moment(a.startdato).isSameOrBefore(moment(b.startdato)) ? -1 : 1))
  }, [replySed])

  const periodeOptions: Options = [
    { label: t('el:option-forsikring-ANSATTPERIODE_FORSIKRET'), value: 'perioderAnsattMedForsikring' },
    { label: t('el:option-forsikring-SELVSTENDIG_FORSIKRET'), value: 'perioderSelvstendigMedForsikring' },
    { label: t('el:option-forsikring-ANSATTPERIODE_UFORSIKRET'), value: 'perioderAnsattUtenForsikring' },
    { label: t('el:option-forsikring-SELVSTENDIG_UFORSIKRET'), value: 'perioderSelvstendigUtenForsikring' },
    { label: t('el:option-forsikring-SYKDOMSPERIODE'), value: 'perioderSyk' },
    { label: t('el:option-forsikring-SVANGERSKAP_OMSORGSPERIODE'), value: 'perioderSvangerskapBarn' },
    { label: t('el:option-forsikring-FRIHETSBEROEVETPERIODE'), value: 'perioderFrihetsberoevet' },
    { label: t('el:option-forsikring-UTDANNINGSPERIODE'), value: 'perioderUtdanning' },
    { label: t('el:option-forsikring-MILITAERTJENESTE'), value: 'perioderMilitaertjeneste' },
    { label: t('el:option-forsikring-ANNENPERIODE'), value: 'perioderAnnenForsikring' },
    { label: t('el:option-forsikring-FRIVILLIG'), value: 'perioderFrivilligForsikring' },
    { label: t('el:option-forsikring-FERIE'), value: 'perioderKompensertFerie' }
  ]

  const setType = (type: string) => {
    _setNewType(type)
    _resetValidation(namespace + '-type')
  }

  const setNavn = (newNavn: string, type: string, index: number) => {
    if (index < 0) {
      _setNewNavn(newNavn.trim)
      _resetValidation(namespace + '-navn')
    } else {
      dispatch(updateReplySed(`${type}[${index}].arbeidsgiver.navn`, newNavn.trim()))
      if (validation[namespace + getIdx(index) + '-navn']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-navn'))
      }
    }
  }

  const setIdentifikator = (newOrgnr: string, type: string, index: number) => {
    if (index < 0) {
      _setNewIdentifikator([{ type: 'registrering', id: newOrgnr.trim() }])
      _resetValidation(namespace + '-identifikator')
    } else {
      dispatch(updateReplySed(`${type}[${index}].arbeidsgiver.identifikator`, [{ type: 'registrering', id: newOrgnr.trim() }]))
      if (validation[namespace + getIdx(index) + '-identifikator']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-identifikator'))
      }
    }
  }

  const setInntektOgTime = (newInntektOgTime: Array<InntektOgTime>, type: string, index: number) => {
    if (index < 0) {
      _setNewInntektOgTime(newInntektOgTime)
      _resetValidation(namespace + '-inntektogtime')
    } else {
      dispatch(updateReplySed(`${type}[${index}].inntektOgTime.`,newInntektOgTime ))
      if (validation[namespace + getIdx(index) + '-identifikator']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-identifikator'))
      }
    }
  }

  const setPeriode = (periode: ForsikringPeriode, id: string, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      _resetValidation(namespace + '-' + id)
    } else {
      const type = periode.__type
      delete periode.__type
      dispatch(updateReplySed(`${type}[${index}]`, periode))
      if (validation[namespace + getIdx(index) + '-' + id]) {
        dispatch(resetValidation(namespace + getIdx(index) + '-' + id))
      }
    }
  }

  const resetAdresseValidation = (fullnamespace: string, index: number) => {
    if (index < 0) {
      _resetValidation(fullnamespace)
    } else {
      if (validation[fullnamespace]) {
        dispatch(resetValidation(fullnamespace))
      }
    }
  }


  const resetForm = () => {
    _setNewPeriode(undefined)
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (periode: ForsikringPeriode) => {
    removeFromDeletion(periode)
    let newPeriodes: Array<ForsikringPeriode> = _.get(replySed, periode.__type!) as Array<ForsikringPeriode>
    newPeriodes = _.filter(newPeriodes, p => p.startdato !== periode.startdato && p.sluttdato !== periode.sluttdato)
    dispatch(updateReplySed(periode.__type, newPeriodes))
  }

  const onAdd = () => {
    let newPeriodes: Array<any> | undefined = _.get(replySed, _newType!)
    if (_.isNil(newPeriodes)) {
      newPeriodes = []
    }
    const valid: boolean = performValidation({
      periode: _newPeriode as Periode,
      perioder: newPeriodes,
      type: _newType,
      namespace: namespace,
      personName: personName
    })
    if (valid) {
      newPeriodes = newPeriodes.concat(_newPeriode)
      dispatch(updateReplySed(_newType, newPeriodes))
      standardLogger('svarsed.editor.adresse.add')
      resetForm()
    }
  }

  const renderRow = (periode: ForsikringPeriode | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periode)
    const idx = getIdx(index)
    const v: Validation = index < 0 ? _validation : validation

    const _type: string = index < 0 ? _newType! : periode!.__type!
    const _periode: ForsikringPeriode = (index < 0 ? _newPeriode : periode) ?? {} as ForsikringPeriode
    const _annenTypeForsikringsperiode: string | undefined = (index < 0 ? _newAnnenTypeForsikringsperiode : (_periode as PeriodeAnnenForsikring)?.annenTypeForsikringsperiode)
    const _navn: string | undefined = (index < 0 ? _newNavn : (_periode as PeriodeMedForsikring | PeriodeUtenForsikring)?.arbeidsgiver.navn)
    const _orgnr: Array<ArbeidsgiverIdentifikator> | undefined = (index < 0 ? _newIdentifikator : (_periode as PeriodeMedForsikring | PeriodeUtenForsikring)?.arbeidsgiver.identifikator)
    const _adresse: Adresse | undefined = (index < 0 ? _newAdresse : (_periode as PeriodeMedForsikring | PeriodeUtenForsikring)?.arbeidsgiver.adresse)
    const _inntektOgTime: Array<InntektOgTime> | undefined = (index < 0 ? _newInntektOgTime : (_periode as PeriodeUtenForsikring)?.inntektOgTimer)
    const _inntektOgTimeInfo: string | undefined = (index < 0 ? _newInntektOgTimeInfo : (_periode as PeriodeUtenForsikring)?.inntektOgTimerInfo)

    const visible = index >= 0 ? isVisible(_type, index) : true

    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        {index < 0 && (
          <>
            <AlignStartRow>
              <Column>
                <Select
                  closeMenuOnSelect
                  data-test-id={namespace + idx + '-type'}
                  feil={v[namespace + idx + '-type']?.feilmelding}
                  highContrast={highContrast}
                  id={namespace + idx + '-type'}
                  key={namespace + idx + '-type-' + _newType}
                  label={t('label:type')}
                  menuPortalTarget={document.body}
                  onChange={(type: any) => setType(type.value)}
                  options={periodeOptions}
                  placeholder={t('el:placeholder-select-default')}
                  value={_.find(periodeOptions, o => o.value === _newType)}
                  defaultValue={_.find(periodeOptions, o => o.value === _newType)}
                />
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv />
          </>
        )}
        <AlignEndRow>
          {index >= 0 && (
            <Column style={{ maxWidth: '40px' }}>
              <div title={_.find(periodeOptions, o => o.value === _type)?.label ?? ''}>
                {_type === 'perioderAnsattMedForsikring' && (<Office1 width='32' height='32' />)}
                {_type === 'perioderSelvstendigMedForsikring' && (<PensionBag width='32' height='32' />)}
                {_type === 'perioderAnsattUtenForsikring' && (<Office2 width='32' height='32' />)}
                {_type === 'perioderSelvstendigUtenForsikring' && (<Bag width='32' height='32' />)}
                {_type === 'perioderSyk' && (<Hospital width='32' height='32' />)}
                {_type === 'perioderSvangerskapBarn' && (<Stroller width='32' height='32' />)}
                {_type === 'perioderUtdanning' && (<SchoolBag width='32' height='32' />)}
                {_type === 'perioderMilitaertjeneste' && (<Military />)}
                {_type === 'perioderFrihetsberoevet' && (<Law width='32' height='32' />)}
                {_type === 'perioderFrivilligForsikring' && (<ShakeHandsFilled width='32' height='32' />)}
                {_type === 'perioderKompensertFerie' && (<Vacation width='32' height='32' />)}
                {_type === 'perioderAnnenForsikring' && (<Receipt width='32' height='32' />)}
              </div>
            </Column>
          )}
          <PeriodeInput
            key={'' + _periode?.startdato + _periode?.sluttdato}
            namespace={namespace}
            error={{
              startdato: v[namespace + '-startdato']?.feilmelding,
              sluttdato: v[namespace + '-sluttdato']?.feilmelding
            }}
            setPeriode={(p: ForsikringPeriode, id: string) => setPeriode(p, id, index)}
            value={_periode}
          />
            {index >= 0 && ['perioderAnsattMedForsikring', 'perioderSelvstendigMedForsikring', 'perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring']
              .indexOf(_type) >= 0 && (
              <Column>
                <div className='nolabel'>
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={() => toggleVisibility(_type, index)}
                >
                  <FlexCenterDiv>
                    <Chevron type={visible ? 'opp' : 'ned'} />
                    <HorizontalSeparatorDiv size='0.35' />
                    {visible ? t('label:show-less') : t('label:show-more')}
                  </FlexCenterDiv>
                </HighContrastFlatknapp>
              </div>
              </Column>
            )}
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(periode)}
              onConfirmRemove={() => onRemove(periode!)}
              onCancelRemove={() => removeFromDeletion(periode)}
              onAddNew={() => onAdd()}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignEndRow>
        <VerticalSeparatorDiv />
        {visible && ['perioderAnsattMedForsikring', 'perioderSelvstendigMedForsikring', 'perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring']
          .indexOf(_type) >= 0 && (
          <>
            <AlignStartRow>
              <Column>
                <Input
                  feil={validation[namespace + '-navn']?.feilmelding}
                  namespace={namespace}
                  id='navn'
                  key={'navn-' + _navn ?? ''}
                  label={t('label:navn')}
                  onChanged={(v: string) => setNavn(v, _type, index)}
                  value={_type ?? ''}
                />
              </Column>
              <Column>
                <Input
                  feil={validation[namespace + '-orgnr']?.feilmelding}
                  namespace={namespace}
                  id='orgnr'
                  key={'orgnr-' + JSON.stringify(_orgnr) ?? ''}
                  label={t('label:orgnr')}
                  onChanged={(v: string) => setIdentifikator(v, _type, index)}
                  value={_newIdentifikator?.[0].id ?? ''}
                />
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv/>
            <AlignStartRow>
              <Column>
                <AdresseFC
                  adresse={_adresse}
                  onAdressChanged={(a) =>
                    index < 0
                      ? _setNewAdresse(a)
                      : setPeriode({
                    ..._periode,
                    arbeidsgiver: {
                      ...(_periode as PeriodeMedForsikring).arbeidsgiver,
                      adresse: a
                    }
                  }, _type, index)}
                  namespace={namespace + '-adresse'}
                  validation={index < 0 ? _validation : validation}
                  resetValidation={(fullnamespace: string) => resetAdresseValidation(fullnamespace, index)}
                />
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv />
          </>
        )}
        {visible && ['perioderSelvstendigMedForsikring', 'perioderSelvstendigUtenForsikring'].indexOf(_type) >= 0 && (
          <>
            <InntektOgTimeFC
                highContrast={highContrast}
                validation={validation}
                personName={personName}
                parentNamespace={namespace}
                inntektOgTime={_inntektOgTime}
                onInntektOgTimeChanged={(i: Array<InntektOgTime>) => setInntektOgTime(i, _type, index)}
            />
            <VerticalSeparatorDiv/>
            <AlignStartRow>
              <Column>
                <Input
                  feil={validation[namespace + '-inntektogtimeinfo']?.feilmelding}
                  namespace={namespace}
                  id='inntektogtimeinfo'
                  key={'inntektogtimeinfo-' + _inntektOgTimeInfo ?? ''}
                  label={t('label:inntekt-og-time-info')}
                  onChanged={(v: string) => index < 0 ?
                    _setNewInntektOgTimeInfo(v)
                    : setPeriode({
                      ..._periode,
                      inntektOgTimerInfo: v.trim()
                    }, _type, index)}
                  value={_inntektOgTimeInfo ?? ''}
                />
              </Column>
            </AlignStartRow>
          </>
          )}
        {_type === 'perioderAnnenForsikring' && (
          <>
            <AlignStartRow>
              <Column>
                <Input
                  feil={validation[namespace + '-annenTypeForsikringsperiode']?.feilmelding}
                  namespace={namespace}
                  id='annenTypeForsikringsperiode'
                  key={'annenTypeForsikringsperiode-' + _annenTypeForsikringsperiode ?? ''}
                  label={t('label:virksomhetens-art')}
                  onChanged={(v: string) => index < 0 ?
                    _setNewAnnenTypeForsikringsperiode(v)
                    : setPeriode({
                    ..._periode,
                    annenTypeForsikringsperiode: v
                  }, _type, index)}
                  value={_annenTypeForsikringsperiode ?? ''}
                />
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv />
          </>
        )}

      </RepeatableRow>
    )
  }

  return (
    <PaddedDiv>
      <Undertittel>
        {t('label:forsikring')}
      </Undertittel>
      <VerticalSeparatorDiv size='2' />
      {_.isEmpty(_allPeriods)
        ? (
          <Normaltekst>
            {t('message:warning-no-periods')}
          </Normaltekst>
          )
        : _allPeriods.map(renderRow)}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
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

export default Forsikring

/* const periodeTypeHash: {[k in string]: string} = {
  perioderAnsattMedForsikring: 'ansettelsesforhold_som_utgjør_forsikringsperiode',
  perioderAnsattUtenForsikring: 'ansettelsesforhold_som_ikke_utgjør_forsikringsperiode',
  perioderSelvstendigMedForsikring: 'selvstendig_næringsvirksomhet_som_utgjør_forsikringsperiode',
  perioderSelvstendigUtenForsikring: 'selvstendig_næringsvirksomhet_som_ikke_utgjør_forsikringsperiode',
  perioderFrihetsberoevet: 'frihetsberøvelse_som_utgjør_eller_behandles_som_forsikringsperiode',
  perioderSyk: 'sykdomsperiode_som_utgjør_eller_behandles_som_forsikringsperiode',
  perioderSvangerskapBarn: 'svangerskapsperiode_eller_omsorg_for_barn_som_utgjør_forsikringsperiode_eller_behandles_som_forsikringsperiode',
  perioderUtdanning: 'utdanningsperiode_som_utgjør_eller_behandles_som_forsikringsperiode',
  perioderMilitaertjeneste: 'militærtjeneste_eller_alternativ_tjeneste_som_utgjør_forsikringsperiode_eller_behandles_som_forsikringsperiode',
  perioderAnnenForsikring: 'annen_periode_behandlet_som_forsikringsperiode',
  perioderFrivilligForsikring: 'periode_med_frivillig_uavbrutt_forsikring',
  perioderKompensertFerie: 'vederlag_for_ferie_som_ikke_er_tatt_ut'
}
*/
