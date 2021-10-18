import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { validateForsikring, ValidationForsikringProps } from 'applications/SvarSed/PersonManager/Forsikring/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Select from 'components/Forms/Select'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import {
  Periode,
  PeriodeAnnenForsikring,
  PeriodeMedForsikring,
  PeriodeUtenForsikring,
  U002Sed
} from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
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
import PeriodeMedForsikringFC from './PeriodeMedForsikring'
import PeriodeUtenForsikringFC from './PeriodeUtenForsikring'
import PeriodeAnnenForsikringFC from './PeriodeAnnenForsikring'
import PeriodeSimple from './PeriodeSimple'

interface ForsikringSelector extends PersonManagerFormSelector {
  highContrast: boolean
}

const mapState = (state: State): ForsikringSelector => ({
  highContrast: state.ui.highContrast,
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

type AllPeriode = Periode | PeriodeMedForsikring | PeriodeUtenForsikring | PeriodeAnnenForsikring

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
  const [_newPeriode, _setNewPeriode] = useState<Periode |undefined>(undefined)

  const [_allPeriods, _setAllPeriods ] = useState<Array<AllPeriode>>([])

  const getId = (p: Periode): string => (p?.startdato ?? '') + '-' + (p?.sluttdato ?? p.aapenPeriodeType)
  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Periode>(getId)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationForsikringProps>({}, validateForsikring)

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

  useEffect(() => {
    let periodes: Array<AllPeriode> = [];
    (replySed as U002Sed)?.perioderAnsattMedForsikring?.forEach(p => periodes.push({...p, __type: 'perioderAnsattMedForsikring'}));
    (replySed as U002Sed)?.perioderAnsattUtenForsikring?.forEach(p => periodes.push({...p, __type: 'perioderAnsattUtenForsikring'}));
    (replySed as U002Sed)?.perioderSelvstendigMedForsikring?.forEach(p => periodes.push({...p, __type: 'perioderSelvstendigMedForsikring'}));
    (replySed as U002Sed)?.perioderSelvstendigUtenForsikring?.forEach(p => periodes.push({...p, __type: 'perioderSelvstendigUtenForsikring'}));
    (replySed as U002Sed)?.perioderFrihetsberoevet?.forEach(p => periodes.push({...p, __type: 'perioderFrihetsberoevet'}));
    (replySed as U002Sed)?.perioderSyk?.forEach(p => periodes.push({...p, __type: 'perioderSyk'}));
    (replySed as U002Sed)?.perioderSvangerskapBarn?.forEach(p => periodes.push({...p, __type: 'perioderSvangerskapBarn'}));
    (replySed as U002Sed)?.perioderUtdanning?.forEach(p => periodes.push({...p, __type: 'perioderUtdanning'}));
    (replySed as U002Sed)?.perioderMilitaertjeneste?.forEach(p => periodes.push({...p, __type: 'perioderMilitaertjeneste'}));
    (replySed as U002Sed)?.perioderAnnenForsikring?.forEach(p => periodes.push({...p, __type: 'perioderAnnenForsikring'}));
    (replySed as U002Sed)?.perioderFrivilligForsikring?.forEach(p => periodes.push({...p, __type: 'perioderFrivilligForsikring'}));
    (replySed as U002Sed)?.perioderKompensertFerie?.forEach(p => periodes.push({...p, __type: 'perioderKompensertFerie'}));
    _setAllPeriods(periodes.sort((a: AllPeriode, b: AllPeriode) => moment(a.startdato).isSameOrBefore(moment(b.startdato)) ? -1 : 1))
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

  const setPeriode = (periode: AllPeriode, id: string, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      if (id === 'startdato') {
        _resetValidation(namespace + '-startdato')
      }
      if (id === 'sluttdato') {
        _resetValidation(namespace + '-sluttdato')
      }
    } else {
      const type = periode.__type
      delete periode.__type
      dispatch(updateReplySed(`${type}[${index}]`, periode))
      if (id === 'startdato' && validation[namespace + getIdx(index) + '-startdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-startdato'))
      }
      if (id === 'sluttdato' && validation[namespace + getIdx(index) + '-sluttdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-sluttdato'))
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

  const onRemove = (periode: AllPeriode) => {
    removeFromDeletion(periode)
    let newPeriodes: Array<AllPeriode> = _.get(replySed, periode.__type!) as Array<AllPeriode>
    newPeriodes = _.filter(newPeriodes, p => p.startdato !== periode.startdato && p.sluttdato !== periode.sluttdato)
    dispatch(updateReplySed(periode.__type, newPeriodes))
  }

  const onAdd = () => {
    const valid: boolean = performValidation({
      periode: _newPeriode as Periode,
      type: _newType,
      namespace: namespace,
      personName: personName
    })
    if (valid) {
      let newPeriodes: Array<any> | undefined = _.get(replySed, _newType!)
      if (_.isNil(newPeriodes)) {
        newPeriodes = []
      }
      newPeriodes = newPeriodes.concat(_newPeriode)
      dispatch(updateReplySed(_newType, newPeriodes))
      standardLogger('svarsed.editor.adresse.add')
      resetForm()
    }
  }

  const renderRow = (periode: AllPeriode | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periode)
    const idx = getIdx(index)
    const getErrorFor = (el: string): string | undefined => {
      return index < 0
        ? _validation[namespace + idx + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    }
    const _type: string = index < 0 ? _newType! : periode!.__type!
    const Component = periodeRender[_type]
    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow>
          <Column>
            {index < 0
              ? (<Select
                  closeMenuOnSelect
                  data-test-id={namespace + idx + '-type'}
                  feil={getErrorFor('type')}
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
                  />)
              : <span>{_.find(periodeOptions, {value:periode?.__type})?.label}</span>
            }
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
        <Component
          periode={periode}
          namespace={namespace + idx}
          setPeriode={(p: AllPeriode, id: string) => setPeriode(p, id, index)}
          validation={validation}
          addRemove={(
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
          )}
        />
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
