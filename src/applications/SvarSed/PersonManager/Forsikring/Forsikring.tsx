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
import { ForsikringPeriode, Periode, PeriodeAnnenForsikring, U002Sed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  AlignEndRow,
  AlignStartRow,
  Column,
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

  const getId = (p: ForsikringPeriode): string => (p.__type + '-' + p?.startdato ?? '') + '-' + (p?.sluttdato ?? p.aapenPeriodeType)
  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Periode>(getId)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationForsikringPeriodeProps>({}, validateForsikringPeriode)

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
        {/**

        const periodeRender: {[k in string]: any} = {
        perioderAnsattMedForsikring: PeriodeMedForsikringFC,
        perioderSelvstendigMedForsikring : PeriodeMedForsikringFC,
        perioderAnsattUtenForsikring : PeriodeUtenForsikringFC,
        perioderSelvstendigUtenForsikring: PeriodeUtenForsikringFC,
        perioderSyk: PeriodeSimple,
        perioderSvangerskapBarn : PeriodeSimple,
        perioderUtdanning : PeriodeSimple,
        perioderMilitaertjeneste: PeriodeSimple,
        perioderFrihetsberoevet: PeriodeSimple,
        perioderFrivilligForsikring: PeriodeSimple,
        perioderKompensertFerie: PeriodeSimple,
        perioderAnnenForsikring: PeriodeAnnenForsikringFC
      }

        */}
        {_type === 'perioderAnnenForsikring' && (
          <>
            <AlignStartRow>
              <Column>
                <Input
                  feil={validation[namespace + '-annenTypeForsikringsperiode']?.feilmelding}
                  namespace={namespace}
                  id='annenTypeForsikringsperiode'
                  key={'annenTypeForsikringsperiode-' + (_periode as PeriodeAnnenForsikring)?.annenTypeForsikringsperiode ?? ''}
                  label={t('label:virksomhetens-art')}
                  onChanged={(v: string) => setPeriode({
                    ..._periode,
                    annenTypeForsikringsperiode: v
                  }, _type, index)}
                  value={(_periode as PeriodeAnnenForsikring)?.annenTypeForsikringsperiode ?? ''}
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
