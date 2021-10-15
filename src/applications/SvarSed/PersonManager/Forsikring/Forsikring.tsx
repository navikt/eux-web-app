import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Periode, PeriodeAnnenForsikring, PeriodeMedForsikring, PeriodeUtenForsikring, U002Sed } from 'declarations/sed'
import { Undertittel } from 'nav-frontend-typografi'
import { FlexCenterDiv, PaddedDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

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
  personID
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    replySed
  } = useSelector<State, ForsikringSelector>(mapState)
  const namespace = `${parentNamespace}-${personID}-forsikring`

  /* const [_allPeriods, _setAllPeriods ] = useState<Array<Periode | PeriodeMedForsikring | PeriodeUtenForsikring | PeriodeAnnenForsikring>>(() =>
      ([] as any).concat(
       (replySed as U002Sed)?.perioderAnsattMedForsikring ?? [] as Array<Periode>,
       (replySed as U002Sed)?.perioderAnsattUtenForsikring ?? [],
       (replySed as U002Sed)?.perioderSelvstendigMedForsikring ?? [],
       (replySed as U002Sed)?.perioderSelvstendigUtenForsikring,
       (replySed as U002Sed)?.perioderFrihetsberoevet,
       (replySed as U002Sed)?.perioderSyk,
       (replySed as U002Sed)?.perioderSvangerskapBarn,
       (replySed as U002Sed)?.perioderUtdanning,
       (replySed as U002Sed)?.perioderMilitaertjeneste,
       (replySed as U002Sed)?.perioderAnnenForsikring,
       (replySed as U002Sed)?.perioderFrivilligForsikring,
       (replySed as U002Sed)?.perioderKompensertFerie
       ).sort((a: Periode, b: Periode) => moment(a.startdato).isSameOrBefore(moment(b.startdato)) ? -1 : 1)
  ) */

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
  ] */

  const renderRow = (periode: Periode | PeriodeMedForsikring | PeriodeUtenForsikring | PeriodeAnnenForsikring,
    index: number,
    type: string) => {
    return (
      <FlexCenterDiv>
        <span>{type}</span>
        <HorizontalLineSeparator />
        <PeriodeInput
          error={{
            startdato: undefined,
            sluttdato: undefined
          }}
          namespace={namespace}
          setPeriode={() => {}}
          value={periode}
        />
      </FlexCenterDiv>
    )
  }

  return (
    <PaddedDiv>
      <Undertittel>
        {t('label:forsikring')}
      </Undertittel>
      <VerticalSeparatorDiv size='2' />
      {(replySed as U002Sed)?.perioderAnsattMedForsikring?.map((periode, index) =>
        renderRow(periode, index, 'perioderAnsattMedForsikring'))}
      {(replySed as U002Sed)?.perioderAnsattUtenForsikring?.map((periode, index) =>
        renderRow(periode, index, 'perioderAnsattUtenForsikring'))}
      {(replySed as U002Sed)?.perioderSelvstendigMedForsikring?.map((periode, index) =>
        renderRow(periode, index, 'perioderSelvstendigMedForsikring'))}
      {(replySed as U002Sed)?.perioderSelvstendigUtenForsikring?.map((periode, index) =>
        renderRow(periode, index, 'perioderSelvstendigUtenForsikring'))}

      {(replySed as U002Sed)?.perioderFrihetsberoevet?.map((periode, index) =>
        renderRow(periode, index, 'perioderFrihetsberoevet'))}
      {(replySed as U002Sed)?.perioderSyk?.map((periode, index) =>
        renderRow(periode, index, 'perioderSyk'))}
      {(replySed as U002Sed)?.perioderSvangerskapBarn?.map((periode, index) =>
        renderRow(periode, index, 'perioderSvangerskapBarn'))}
      {(replySed as U002Sed)?.perioderUtdanning?.map((periode, index) =>
        renderRow(periode, index, 'perioderUtdanning'))}

      {(replySed as U002Sed)?.perioderMilitaertjeneste?.map((periode, index) =>
        renderRow(periode, index, 'perioderMilitaertjeneste'))}
      {(replySed as U002Sed)?.perioderAnnenForsikring?.map((periode, index) =>
        renderRow(periode, index, 'perioderAnnenForsikring'))}
      {(replySed as U002Sed)?.perioderFrivilligForsikring?.map((periode, index) =>
        renderRow(periode, index, 'perioderFrivilligForsikring'))}
      {(replySed as U002Sed)?.perioderKompensertFerie?.map((periode, index) =>
        renderRow(periode, index, 'perioderKompensertFerie'))}
    </PaddedDiv>
  )
}

export default Forsikring
