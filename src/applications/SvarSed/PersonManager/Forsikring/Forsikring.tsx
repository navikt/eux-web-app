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
  Adresse,
  ArbeidsgiverIdentifikator,
  ForsikringPeriode,
  InntektOgTime,
  Periode,
  PeriodeAnnenForsikring,
  PeriodeMedForsikring,
  PeriodeUtenForsikring,
  U002Sed
} from 'declarations/sed'
import { Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import Chevron from 'nav-frontend-chevron'
import { Checkbox } from 'nav-frontend-skjema'
import { Normaltekst, UndertekstBold, Undertittel } from 'nav-frontend-typografi'
import {
  AlignEndRow,
  AlignStartRow,
  Column,
  FlexCenterDiv,
  FlexEndDiv,
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
  const [_allPeriods, _setAllPeriods] = useState<Array<ForsikringPeriode>>([])

  const [_newPeriode, _setNewPeriode] = useState<ForsikringPeriode | undefined>(undefined)
  const [_newNavn, _setNewNavn] = useState<string | undefined>(undefined)
  const [_newAdresse, _setNewAdresse] = useState<Adresse | undefined>(undefined)
  const [_newIdentifikator, _setNewIdentifikator] = useState<Array<ArbeidsgiverIdentifikator> | undefined>(undefined)
  const [_newInntektOgTime, _setNewInntektOgTime] = useState<Array<InntektOgTime> | undefined>(undefined)
  const [_newInntektOgTimeInfo, _setNewInntektOgTimeInfo] = useState<string | undefined>(undefined)
  const [_newAnnenTypeForsikringsperiode, _setNewAnnenTypeForsikringsperiode] = useState<string | undefined>(undefined)

  const getId = (p: ForsikringPeriode | null): string => p ? (p.__type + '-' + p?.startdato ?? '') + '-' + (p?.sluttdato ?? p.aapenPeriodeType) : 'new-forsikring'
  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Periode>(getId)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_visible, _setVisible] = useState<{[k in string]: Array<number>| undefined}>({})
  const [_sort, _setSort] = useState<string>('time')
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationForsikringPeriodeProps>({}, validateForsikringPeriode)

  const isVisible = (type: string, index: number): boolean => Object.prototype.hasOwnProperty.call(_visible, type) && _visible[type]!.indexOf(index) >= 0

  const toggleVisibility = (type: string, index: number) => {
    const visible: boolean = isVisible(type, index)
    const newVisible = _.cloneDeep(_visible)
    newVisible[type] = visible
      ? _.filter(_visible[type], (it) => it !== index)
      : _.isNil(_visible[type])
        ? _visible[type] = [index]
        : _visible[type]!.concat(index)
    _setVisible(newVisible)
  }

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

  const periodeSort = (a: ForsikringPeriode, b: ForsikringPeriode) => moment(a.startdato).isSameOrBefore(moment(b.startdato)) ? -1 : 1

  useEffect(() => {
    const periodes: Array<ForsikringPeriode> = [];
    (replySed as U002Sed)?.perioderAnsattMedForsikring?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderAnsattMedForsikring' }));
    (replySed as U002Sed)?.perioderAnsattUtenForsikring?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderAnsattUtenForsikring' }));
    (replySed as U002Sed)?.perioderSelvstendigMedForsikring?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderSelvstendigMedForsikring' }));
    (replySed as U002Sed)?.perioderSelvstendigUtenForsikring?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderSelvstendigUtenForsikring' }));
    (replySed as U002Sed)?.perioderFrihetsberoevet?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderFrihetsberoevet' }));
    (replySed as U002Sed)?.perioderSyk?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderSyk' }));
    (replySed as U002Sed)?.perioderSvangerskapBarn?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderSvangerskapBarn' }));
    (replySed as U002Sed)?.perioderUtdanning?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderUtdanning' }));
    (replySed as U002Sed)?.perioderMilitaertjeneste?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderMilitaertjeneste' }));
    (replySed as U002Sed)?.perioderAnnenForsikring?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderAnnenForsikring' }));
    (replySed as U002Sed)?.perioderFrivilligForsikring?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderFrivilligForsikring' }));
    (replySed as U002Sed)?.perioderKompensertFerie?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderKompensertFerie' }))
    _setAllPeriods(periodes.sort(periodeSort))
  }, [replySed])

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
      dispatch(updateReplySed(`${type}[${index}].inntektOgTime.`, newInntektOgTime))
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

  const getIcon = (type: string, size: string = '32') => (
    <>
      {type === 'perioderAnsattMedForsikring' && (<Office1 width={size} height={size} />)}
      {type === 'perioderSelvstendigMedForsikring' && (<PensionBag width={size} height={size} />)}
      {type === 'perioderAnsattUtenForsikring' && (<Office2 width={size} height={size} />)}
      {type === 'perioderSelvstendigUtenForsikring' && (<Bag width={size} height={size} />)}
      {type === 'perioderSyk' && (<Hospital width={size} height={size} />)}
      {type === 'perioderSvangerskapBarn' && (<Stroller width={size} height={size} />)}
      {type === 'perioderUtdanning' && (<SchoolBag width={size} height={size} />)}
      {type === 'perioderMilitaertjeneste' && (<Military />)}
      {type === 'perioderFrihetsberoevet' && (<Law width={size} height={size} />)}
      {type === 'perioderFrivilligForsikring' && (<ShakeHandsFilled width={size} height={size} />)}
      {type === 'perioderKompensertFerie' && (<Vacation width={size} height={size} />)}
      {type === 'perioderAnnenForsikring' && (<Receipt width={size} height={size} />)}
    </>
  )

  const renderRow = (periode: ForsikringPeriode | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periode)
    const idx = getIdx(index)
    const v: Validation = index < 0 ? _validation : validation

    const _type: string = index < 0 ? _newType! : periode!.__type!
    // __index is the periode's index order in the replysed; index is the order with sort, thus does not tell the real position in the replysed list
    const _index: number = index < 0 ? -1 : periode!.__index!

    const _periode: ForsikringPeriode = (index < 0 ? _newPeriode : periode) ?? {} as ForsikringPeriode
    const _annenTypeForsikringsperiode: string | undefined = (index < 0 ? _newAnnenTypeForsikringsperiode : (_periode as PeriodeAnnenForsikring)?.annenTypeForsikringsperiode)
    const _navn: string | undefined = (index < 0 ? _newNavn : (_periode as PeriodeMedForsikring | PeriodeUtenForsikring)?.arbeidsgiver?.navn)
    const _orgnr: Array<ArbeidsgiverIdentifikator> | undefined = (index < 0 ? _newIdentifikator : (_periode as PeriodeMedForsikring | PeriodeUtenForsikring)?.arbeidsgiver?.identifikator)
    const _adresse: Adresse | undefined = (index < 0 ? _newAdresse : (_periode as PeriodeMedForsikring | PeriodeUtenForsikring)?.arbeidsgiver?.adresse)
    const _inntektOgTime: Array<InntektOgTime> | undefined = (index < 0 ? _newInntektOgTime : (_periode as PeriodeUtenForsikring)?.inntektOgTimer)
    const _inntektOgTimeInfo: string | undefined = (index < 0 ? _newInntektOgTimeInfo : (_periode as PeriodeUtenForsikring)?.inntektOgTimerInfo)

    const visible = index >= 0 ? isVisible(_type, _index) : true

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
          {index >= 0 && _sort === 'time' && (
            <Column style={{ maxWidth: '40px' }}>
              <div title={_.find(periodeOptions, o => o.value === _type)?.label ?? ''}>
                {getIcon(_type, '32')}
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
            setPeriode={(p: ForsikringPeriode, id: string) => setPeriode(p, id, _index)}
            value={_periode}
          />
          <Column flex='1.5'>
            <FlexEndDiv style={{ justifyContent: 'end' }}>
              {index >= 0 && ['perioderAnsattMedForsikring', 'perioderSelvstendigMedForsikring', 'perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring', 'perioderAnnenForsikring']
                .indexOf(_type) >= 0 && (
                  <div className='nolabel'>
                    <HighContrastFlatknapp
                      mini
                      kompakt
                      onClick={() => toggleVisibility(_type, _index)}
                    >
                      <FlexCenterDiv>
                        <Chevron type={visible ? 'opp' : 'ned'} />
                        <HorizontalSeparatorDiv size='0.35' />
                        {visible ? t('label:show-less') : t('label:show-more')}
                      </FlexCenterDiv>
                    </HighContrastFlatknapp>
                  </div>
              )}
              <HorizontalSeparatorDiv size='0.5' />
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
            </FlexEndDiv>
          </Column>
        </AlignEndRow>
        <VerticalSeparatorDiv />
        {visible && ['perioderAnsattMedForsikring', 'perioderSelvstendigMedForsikring', 'perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring']
          .indexOf(_type) >= 0 && (
            <>
              <AlignStartRow>
                <Column style={{ maxWidth: '40px' }} />
                <Column>
                  <Input
                    feil={validation[namespace + '-navn']?.feilmelding}
                    namespace={namespace}
                    id='navn'
                    key={'navn-' + _navn ?? ''}
                    label={t('label:institusjonens-navn')}
                    onChanged={(v: string) => setNavn(v, _type, _index)}
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
                    onChanged={(v: string) => setIdentifikator(v, _type, _index)}
                    value={_newIdentifikator?.[0].id ?? ''}
                  />
                </Column>
              </AlignStartRow>
              <VerticalSeparatorDiv />
              <AlignStartRow>
                <Column style={{ maxWidth: '40px' }} />
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
                        }, _type, _index)}
                    namespace={namespace + '-adresse'}
                    validation={index < 0 ? _validation : validation}
                    resetValidation={(fullnamespace: string) => resetAdresseValidation(fullnamespace, _index)}
                  />
                </Column>
              </AlignStartRow>
              <VerticalSeparatorDiv />
            </>
        )}
        {visible && ['perioderSelvstendigMedForsikring', 'perioderSelvstendigUtenForsikring'].indexOf(_type) >= 0 && (
          <>
            <Column style={{ maxWidth: '40px' }} />
            <InntektOgTimeFC
              highContrast={highContrast}
              validation={validation}
              personName={personName}
              parentNamespace={namespace}
              inntektOgTime={_inntektOgTime}
              onInntektOgTimeChanged={(i: Array<InntektOgTime>) => setInntektOgTime(i, _type, _index)}
            />
            <VerticalSeparatorDiv />
            <AlignStartRow>
              <Column style={{ maxWidth: '40px' }} />
              <Column>
                <Input
                  feil={validation[namespace + '-inntektogtimeinfo']?.feilmelding}
                  namespace={namespace}
                  id='inntektogtimeinfo'
                  key={'inntektogtimeinfo-' + _inntektOgTimeInfo ?? ''}
                  label={t('label:inntekt-og-time-info')}
                  onChanged={(v: string) => index < 0
                    ? _setNewInntektOgTimeInfo(v)
                    : setPeriode({
                      ..._periode,
                      inntektOgTimerInfo: v.trim()
                    }, _type, _index)}
                  value={_inntektOgTimeInfo ?? ''}
                />
              </Column>
            </AlignStartRow>
          </>
        )}
        {visible && _type === 'perioderAnnenForsikring' && (
          <>
            <AlignStartRow>
              <Column style={{ maxWidth: '40px' }} />
              <Column>
                <Input
                  feil={validation[namespace + '-annenTypeForsikringsperiode']?.feilmelding}
                  namespace={namespace}
                  id='annenTypeForsikringsperiode'
                  key={'annenTypeForsikringsperiode-' + _annenTypeForsikringsperiode ?? ''}
                  label={t('label:virksomhetens-art')}
                  onChanged={(v: string) => index < 0
                    ? _setNewAnnenTypeForsikringsperiode(v)
                    : setPeriode({
                      ..._periode,
                      annenTypeForsikringsperiode: v
                    }, _type, _index)}
                  value={_annenTypeForsikringsperiode ?? ''}
                />
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv />
          </>
        )}
        <VerticalSeparatorDiv />
      </RepeatableRow>
    )
  }

  return (
    <PaddedDiv>
      <Undertittel>
        {t('label:forsikring')}
      </Undertittel>
      <VerticalSeparatorDiv size='2' />
      {!_.isEmpty(_allPeriods) && (
        <>
          <Checkbox
            checked={_sort === 'group'}
            label={t('label:group-by-type')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setSort(e.target.checked ? 'group' : 'time')}
          />
          <VerticalSeparatorDiv size='2' />
        </>
      )}
      {_.isEmpty(_allPeriods)
        ? (
          <Normaltekst>
            {t('message:warning-no-periods')}
          </Normaltekst>
          )
        : _sort === 'time'
          ? _allPeriods.map(renderRow)
          : (
            <>
              {periodeOptions.map(o => {
                const periods: Array<ForsikringPeriode> | undefined = _.get(replySed, o.value) as Array<ForsikringPeriode> | undefined
                if (_.isEmpty(periods)) {
                  return null
                }
                return (
                  <div key={o.value}>
                    <FlexEndDiv>
                      {getIcon(o.value, '20')}
                      <HorizontalSeparatorDiv size='0.35' />
                      <UndertekstBold>
                        {o.label}
                      </UndertekstBold>
                    </FlexEndDiv>
                    <VerticalSeparatorDiv />
                    {periods!.map((p, i) => ({ ...p, __type: o.value, __index: i })).sort(periodeSort).map(renderRow)}
                    <VerticalSeparatorDiv size='2' />
                  </div>
                )
              })}
            </>
            )}
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
