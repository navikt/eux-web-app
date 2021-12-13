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
  Vacation,
  CollapseFilled,
  ExpandFilled
} from '@navikt/ds-icons'
import { resetValidation } from 'actions/validation'
import AdresseForm from 'applications/SvarSed/PersonManager/Adresser/AdresseForm'
import InntektOgTimerFC from 'applications/SvarSed/PersonManager/Forsikring/InntektOgTimer/InntektOgTimer'
import {
  validateForsikringPeriode,
  ValidationForsikringPeriodeProps
} from 'applications/SvarSed/PersonManager/Forsikring/validation'
import IdentifikatorFC from 'applications/SvarSed/PersonManager/Identifikator/Identifikator'
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
import { BodyLong, Detail, Heading, Checkbox, Button } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  FlexCenterDiv,
  FlexEndDiv,
  HorizontalSeparatorDiv,
  PaddedDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getNSIdx } from 'utils/namespace'

const mapState = (state: State): PersonManagerFormSelector => ({
  validation: state.validation.status
})

type Sort = 'time' | 'group'

const Forsikring: React.FC<PersonManagerFormProps> = ({
  options,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: PersonManagerFormSelector = useSelector<State, PersonManagerFormSelector>(mapState)
  const dispatch = useDispatch()
  const namespace = `${parentNamespace}-${personID}-forsikring`

  const getId = (p: ForsikringPeriode | null): string => p ? (p.__type + '-' + p?.startdato ?? '') + '-' + (p?.sluttdato ?? p.aapenPeriodeType) : 'new-forsikring'

  const [_newType, _setNewType] = useState<string | undefined>(undefined)
  const [_allPeriods, _setAllPeriods] = useState<Array<ForsikringPeriode>>([])
  const [_newPeriode, _setNewPeriode] = useState<ForsikringPeriode | undefined>(undefined)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Periode>(getId)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_sort, _setSort] = useState<Sort>('time')
  const [_visible, _setVisible] = useState<{[k in string]: Array<number>| undefined}>({})
  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationForsikringPeriodeProps>({}, validateForsikringPeriode)

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
  ].filter(it => options && options.include ? options.include.indexOf(it.value) >= 0 : true)

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
      _setNewPeriode({
        ..._newPeriode,
        arbeidsgiver: {
          ...(_newPeriode as PeriodeMedForsikring)?.arbeidsgiver,
          navn: newNavn.trim()
        }
      } as PeriodeMedForsikring)
      _resetValidation(namespace + '-arbeidsgiver-navn')
    } else {
      dispatch(updateReplySed(`${type}[${index}].arbeidsgiver.navn`, newNavn.trim()))
      if (validation[namespace + getNSIdx(type, index) + '-arbeidsgiver-navn']) {
        dispatch(resetValidation(namespace + getNSIdx(type, index) + '-arbeidsgiver-navn'))
      }
    }
  }

  const setIdentifikatorer = (newIdentifikatorer: Array<ArbeidsgiverIdentifikator>, whatChanged: string, type: string, index: number) => {
    if (index < 0) {
      _setNewPeriode({
        ..._newPeriode,
        arbeidsgiver: {
          ...(_newPeriode as PeriodeMedForsikring)?.arbeidsgiver,
          identifikatorer: newIdentifikatorer
        }
      } as PeriodeMedForsikring)
      _resetValidation(namespace + '-arbeidsgiver-identifikatorer-' + whatChanged)
    } else {
      dispatch(updateReplySed(`${type}[${index}].arbeidsgiver.identifikatorer`, newIdentifikatorer))
      if (validation[namespace + getNSIdx(type, index) + '-arbeidsgiver-identifikatorer-' + whatChanged]) {
        dispatch(resetValidation(namespace + getNSIdx(type, index) + '-arbeidsgiver-identifikatorer-' + whatChanged))
      }
    }
  }

  const setAdresse = (newAdresse: Adresse, whatChanged: string, type: string, index: number) => {
    if (index < 0) {
      _setNewPeriode({
        ..._newPeriode,
        arbeidsgiver: {
          ...(_newPeriode as PeriodeMedForsikring)?.arbeidsgiver,
          adresse: newAdresse
        }
      } as PeriodeMedForsikring)
      _resetValidation(namespace + '-arbeidsgiver-adresse-' + whatChanged)
    } else {
      dispatch(updateReplySed(`${type}[${index}].arbeidsgiver.adresse`, newAdresse))
      if (validation[namespace + getNSIdx(type, index) + '-arbeidsgiver-adresse-' + whatChanged]) {
        dispatch(resetValidation(namespace + getNSIdx(type, index) + '-arbeidsgiver-adresse-' + whatChanged))
      }
    }
  }

  const setInntektOgTimer = (newInntektOgTimer: Array<InntektOgTime>, whatChanged: string, type: string, index: number) => {
    if (index < 0) {
      _setNewPeriode({
        ..._newPeriode,
        inntektOgTimer: newInntektOgTimer
      } as PeriodeUtenForsikring)
      _resetValidation(namespace + '-' + whatChanged)
    } else {
      dispatch(updateReplySed(`${type}[${index}].inntektOgTimer`, newInntektOgTimer))
      if (validation[namespace + getNSIdx(type, index) + '-' + whatChanged]) {
        dispatch(resetValidation(namespace + getNSIdx(type, index) + '-' + whatChanged))
      }
    }
  }

  const setInntektOgTimerInfo = (newInntektOgTimerInfo: string, type: string, index: number) => {
    if (index < 0) {
      _setNewPeriode({
        ..._newPeriode,
        inntektOgTimerInfo: newInntektOgTimerInfo.trim()
      } as PeriodeUtenForsikring)
      _resetValidation(namespace + '-inntektOgTimerInfo')
    } else {
      dispatch(updateReplySed(`${type}[${index}].inntektOgTimerInfo`, newInntektOgTimerInfo.trim()))
      if (validation[namespace + getNSIdx(type, index) + '-inntektOgTimerInfo']) {
        dispatch(resetValidation(namespace + getNSIdx(type, index) + '-inntektOgTimerInfo'))
      }
    }
  }

  const setAnnenTypeForsikringsperiode = (newAnnenTypeForsikringsperiode: string, type: string, index: number) => {
    if (index < 0) {
      _setNewPeriode({
        ..._newPeriode,
        annenTypeForsikringsperiode: newAnnenTypeForsikringsperiode.trim()
      } as PeriodeAnnenForsikring)
      _resetValidation(namespace + '-annenTypeForsikringsperiode')
    } else {
      dispatch(updateReplySed(`${type}[${index}].annenTypeForsikringsperiode`, newAnnenTypeForsikringsperiode.trim()))
      if (validation[namespace + getNSIdx(type, index) + '-annenTypeForsikringsperiode']) {
        dispatch(resetValidation(namespace + getNSIdx(type, index) + '-annenTypeForsikringsperiode'))
      }
    }
  }

  const setPeriode = (periode: ForsikringPeriode, whatChanged: string, type: string, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      _resetValidation(namespace + '-' + whatChanged)
    } else {
      delete periode.__type
      delete periode.__index
      dispatch(updateReplySed(`${type}[${index}]`, periode))
      if (validation[namespace + getNSIdx(type, index) + '-' + whatChanged]) {
        dispatch(resetValidation(namespace + getNSIdx(type, index) + '-' + whatChanged))
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
    const newPeriodes: Array<ForsikringPeriode> = _.get(replySed, periode.__type!) as Array<ForsikringPeriode>
    newPeriodes.splice(periode.__index!, 1)
    dispatch(updateReplySed(periode.__type!, newPeriodes))
    standardLogger('svarsed.editor.periode.remove', { type: periode.__type! })
  }

  const onAdd = () => {
    let newPeriodes: Array<ForsikringPeriode> | undefined = _.get(replySed, _newType!)
    if (_.isNil(newPeriodes)) {
      newPeriodes = []
    }
    const valid: boolean = _performValidation({
      periode: _newPeriode as ForsikringPeriode,
      type: _newType,
      namespace: namespace,
      personName: personName
    })
    if (valid && _newType) {
      newPeriodes = newPeriodes.concat(_newPeriode!)
      dispatch(updateReplySed(_newType, newPeriodes))
      standardLogger('svarsed.editor.periode.add', { type: _newType })
      onCancel()
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
      {type === 'perioderMilitaertjeneste' && (<Military width={size} height={size} />)}
      {type === 'perioderFrihetsberoevet' && (<Law width={size} height={size} />)}
      {type === 'perioderFrivilligForsikring' && (<ShakeHandsFilled width={size} height={size} />)}
      {type === 'perioderKompensertFerie' && (<Vacation width={size} height={size} />)}
      {type === 'perioderAnnenForsikring' && (<Receipt width={size} height={size} />)}
    </>
  )

  const renderRow = (periode: ForsikringPeriode | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periode)
    const _type: string = index < 0 ? _newType! : periode!.__type!
    const _index: number = index < 0 ? index : periode!.__index! // replace index order from map (which is "ruined" by a sort) with real replySed index
    // namespace for index < 0: personmanager-bruker-forsikring-arbeidsgiver-adresse-gate
    // namespace for index >= 0: personmanager-bruker-forsikring[perioderSyk][2]-arbeidsgiver-adresse-gate
    const idx = getNSIdx(_type, _index)

    const _v: Validation = index < 0 ? _validation : validation
    // __index is the periode's index order in the replysed; index is the order with sort, thus does not tell the real position in the replysed list
    const _periode: ForsikringPeriode = (index < 0 ? _newPeriode : periode) ?? {} as ForsikringPeriode
    const _visible = index >= 0 ? isVisible(_type, _index) : true

    return (
      <RepeatableRow
        className={classNames('slideInFromLeft', { new: index < 0 })}
        key={getId(periode)}
      >
        {index < 0 && (
          <>
            <AlignStartRow>
              <Column>
                <Select
                  closeMenuOnSelect
                  data-test-id={namespace + idx + '-type'}
                  error={_v[namespace + idx + '-type']?.feilmelding}
                  id={namespace + idx + '-type'}
                  key={namespace + idx + '-type-' + _newType}
                  label={t('label:type')}
                  menuPortalTarget={document.body}
                  onChange={(type: any) => setType(type.value)}
                  options={periodeOptions}
                  value={_.find(periodeOptions, o => o.value === _newType)}
                  defaultValue={_.find(periodeOptions, o => o.value === _newType)}
                />
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv />
          </>
        )}
        {_type && (
          <AlignStartRow>
            {index >= 0 && _sort === 'time' && (
              <Column style={{ maxWidth: '40px' }}>
                <div title={_.find(periodeOptions, o => o.value === _type)?.label ?? ''}>
                  {getIcon(_type, '32')}
                </div>
              </Column>
            )}
            <PeriodeInput
              namespace={namespace + idx}
              error={{
                startdato: _v[namespace + '-startdato']?.feilmelding,
                sluttdato: _v[namespace + '-sluttdato']?.feilmelding
              }}
              showLabel={index < 0}
              setPeriode={(p: ForsikringPeriode, whatChanged: string) => setPeriode(p, whatChanged, _type, _index)}
              value={_periode}
            />
            {index >= 0
              ? (
                <Column flex='1.5'>
                  <FlexEndDiv style={{ justifyContent: 'end' }}>
                    {index >= 0 && [
                      'perioderAnsattMedForsikring', 'perioderSelvstendigMedForsikring',
                      'perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring',
                      'perioderAnnenForsikring'
                    ].indexOf(_type) >= 0 && (

                      <Button
                        variant='tertiary'
                        onClick={() => toggleVisibility(_type, _index)}
                      >
                        <FlexCenterDiv>
                          {_visible ? <CollapseFilled /> : <ExpandFilled />}
                          <HorizontalSeparatorDiv size='0.35' />
                          {_visible ? t('label:show-less') : t('label:show-more')}
                        </FlexCenterDiv>
                      </Button>

                    )}
                    <HorizontalSeparatorDiv size='0.5' />
                    <AddRemovePanel
                      candidateForDeletion={candidateForDeletion}
                      existingItem={(index >= 0)}
                      onBeginRemove={() => addToDeletion(periode)}
                      onConfirmRemove={() => onRemove(periode!)}
                      onCancelRemove={() => removeFromDeletion(periode)}
                      onAddNew={onAdd}
                      onCancelNew={onCancel}
                    />
                  </FlexEndDiv>
                </Column>
                )
              : <Column />}
          </AlignStartRow>
        )}
        <VerticalSeparatorDiv />
        {_type && _visible && [
          'perioderAnsattMedForsikring', 'perioderSelvstendigMedForsikring',
          'perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring'
        ].indexOf(_type) >= 0 && (
          <>
            <AlignStartRow>
              {index >= 0 && (<Column style={{ maxWidth: '40px' }} />)}
              <Column>
                <Input
                  error={_v[namespace + idx + '-arbeidsgiver-navn']?.feilmelding}
                  namespace={namespace + idx + '-arbeidsgiver'}
                  id='navn'
                  key={namespace + idx + '-arbeidsgiver-navn-' + ((_periode as PeriodeMedForsikring)?.arbeidsgiver?.navn ?? '')}
                  label={t('label:institusjonens-navn')}
                  onChanged={(newNavn: string) => setNavn(newNavn, _type, _index)}
                  value={(_periode as PeriodeMedForsikring)?.arbeidsgiver?.navn ?? ''}
                />
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv />
            <AlignStartRow>
              <Column>
                <IdentifikatorFC
                  identifikatorer={(_periode as PeriodeMedForsikring)?.arbeidsgiver?.identifikatorer}
                  onIdentifikatorerChanged={(newIdentifikatorer: Array<ArbeidsgiverIdentifikator>, whatChanged: string) => setIdentifikatorer(newIdentifikatorer, whatChanged, _type, _index)}
                  namespace={namespace + idx + '-arbeidsgiver-identifikatorer'}
                  validation={_v}
                  personName={personName}
                />
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv />
            <AlignStartRow>
              {index >= 0 && (<Column style={{ maxWidth: '40px' }} />)}
              <Column>
                <AdresseForm
                  adresse={(_periode as PeriodeMedForsikring).arbeidsgiver?.adresse}
                  onAdressChanged={(newAdresse, whatChanged) => setAdresse(newAdresse, whatChanged, _type, _index)}
                  namespace={namespace + idx + '-arbeidsgiver-adresse'}
                  validation={_v}
                />
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv />
          </>
        )}
        {_type && _visible && ['perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring'].indexOf(_type) >= 0 && (
          <>
            {index >= 0 && (<Column style={{ maxWidth: '40px' }} />)}
            <InntektOgTimerFC
              validation={validation}
              personName={personName}
              parentNamespace={namespace + idx}
              inntektOgTimer={(_periode as PeriodeUtenForsikring).inntektOgTimer}
              onInntektOgTimeChanged={(newInntektOgTimer: Array<InntektOgTime>, whatChanged: string) => setInntektOgTimer(newInntektOgTimer, whatChanged, _type, _index)}
            />
            <VerticalSeparatorDiv />
            <AlignStartRow>
              {index >= 0 && (<Column style={{ maxWidth: '40px' }} />)}
              <Column>
                <Input
                  error={_v[namespace + idx + '-inntektOgTimerInfo']?.feilmelding}
                  namespace={namespace + idx}
                  id='inntektOgTimerInfo'
                  key={namespace + idx + '-inntektOgTimerInfo-' + (_periode as PeriodeMedForsikring).arbeidsgiver?.adresse ?? ''}
                  label={t('label:inntekt-og-time-info')}
                  onChanged={(newInntektOgTimerInfo: string) => setInntektOgTimerInfo(newInntektOgTimerInfo, _type, _index)}
                  value={(_periode as PeriodeUtenForsikring).inntektOgTimerInfo}
                />
              </Column>
            </AlignStartRow>
          </>
        )}
        {_type && _visible && _type === 'perioderAnnenForsikring' && (
          <>
            <AlignStartRow>
              {index >= 0 && (<Column style={{ maxWidth: '40px' }} />)}
              <Column>
                <Input
                  error={_v[namespace + idx + '-annenTypeForsikringsperiode']?.feilmelding}
                  namespace={namespace + idx}
                  id='annenTypeForsikringsperiode'
                  key={namespace + idx + '-annenTypeForsikringsperiode-' + ((_periode as PeriodeAnnenForsikring).annenTypeForsikringsperiode ?? '')}
                  label={t('label:annen-type')}
                  onChanged={(newAnnenTypeForsikringsperiode: string) => setAnnenTypeForsikringsperiode(newAnnenTypeForsikringsperiode, _type, _index)}
                  value={(_periode as PeriodeAnnenForsikring).annenTypeForsikringsperiode ?? ''}
                />
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv />
          </>
        )}
        {index < 0 && (
          <FlexEndDiv style={{ justifyContent: 'end' }}>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(periode)}
              onConfirmRemove={() => onRemove(periode!)}
              onCancelRemove={() => removeFromDeletion(periode)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </FlexEndDiv>
        )}
        <VerticalSeparatorDiv />
      </RepeatableRow>
    )
  }

  return (
    <PaddedDiv>
      <Heading size='small'>
        {t('label:forsikring')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      {!_.isEmpty(_allPeriods) && (
        <>
          <Checkbox
            checked={_sort === 'group'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setSort(e.target.checked ? 'group' : 'time')}
          >
            {t('label:group-by-type')}
          </Checkbox>
          <VerticalSeparatorDiv size='2' />
        </>
      )}
      {_.isEmpty(_allPeriods)
        ? (
          <BodyLong>
            {t('message:warning-no-periods')}
          </BodyLong>
          )
        : _sort === 'time'
          ? (
            <>
              <AlignStartRow>
                <Column style={{ maxWidth: '40px' }} />
                <Column>
                  <label className='navds-text-field__label navds-label'>
                    {t('label:startdato')}
                  </label>
                </Column>
                <Column>
                  <label className='navds-text-field__label navds-label'>
                    {t('label:sluttdato')}
                  </label>
                </Column>
                <Column flex='2' />
              </AlignStartRow>
              {_allPeriods.map(renderRow)}
            </>
            )
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
                      <Detail>
                        {o.label}
                      </Detail>
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
              <Button
                variant='tertiary'
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
              </Button>
            </Column>
          </Row>
          )}
    </PaddedDiv>
  )
}

export default Forsikring
