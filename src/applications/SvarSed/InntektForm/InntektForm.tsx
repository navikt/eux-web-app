import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyLong, Box, Button, Heading, HGrid, HStack, Ingress, Label, Spacer, VStack } from '@navikt/ds-react'
import { fetchInntekt } from 'actions/inntekt'
import { resetValidation, setValidation } from 'actions/validation'
import Inntekter from 'applications/SvarSed/Inntekter/Inntekter'
import InntektSearch from 'applications/SvarSed/InntektSearch/InntektSearch'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import ArbeidsperioderSøk from 'components/Arbeidsperioder/ArbeidsperioderSøk'
import FormText from 'components/Forms/FormText'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import Select from 'components/Forms/Select'
import ForsikringPeriodeBox from 'components/ForsikringPeriodeBox/ForsikringPeriodeBox'
import InntektFC from 'components/Inntekt/Inntekt'
import { HorizontalLineSeparator, RepeatableBox, SpacedHr } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { State } from 'declarations/reducers'
import {Loennsopplysning, Periode, PeriodeMedForsikring, AnsettelsesType, USed} from 'declarations/sed'
import { Inntekt } from 'declarations/sed.d'
import { ArbeidsperioderFraAA, IInntekter, Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { arbeidsperioderFraAAToForsikringPeriode, getOrgnr } from 'utils/arbeidsperioder'
import { getFnr } from 'utils/fnr'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { hasNamespaceWithErrors } from 'utils/validation'
import {
  validateLoennsopplysning,
  validateLoennsopplysninger,
  ValidationLoennsopplysningerProps,
  ValidationLoennsopplysningProps
} from './validation'
import {getSedCategory} from "../../../utils/sed";

interface InntektFormSelector extends MainFormSelector {
  arbeidsperioder: ArbeidsperioderFraAA | null | undefined
  gettingInntekter: boolean
  inntekter: IInntekter | null | undefined
}

const mapState = (state: State): InntektFormSelector => ({
  arbeidsperioder: state.arbeidsperioder,
  gettingInntekter: state.loading.gettingInntekter,
  inntekter: state.inntekt.inntekter,
  validation: state.validation.status
})

const InntektForm: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    arbeidsperioder,
    gettingInntekter,
    inntekter,
    validation
  } = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const CDM_VERSJON: number = parseFloat((replySed as USed)?.sak?.cdmVersjon!)
  const namespace = `${parentNamespace}-${personID}-inntekt`
  const target = 'loennsopplysninger'
  const loennsopplysninger: Array<Loennsopplysning> | undefined = _.get(replySed, target)
  const fnr: string | undefined = getFnr(replySed, personID)
  const getId = (l: Loennsopplysning |null |undefined) => l ? l.periode?.startdato + '-' + l.periode?.sluttdato : 'new'
  const getIdInntekt = (inntekt: Inntekt | null | undefined) => inntekt ? inntekt.type + '-' + inntekt.typeAnnen + '-' + inntekt.beloep : 'new'

  const [_newLoennsopplysning, _setNewLoennsopplysning] = useState<Loennsopplysning | undefined>(undefined)
  const [_editLoennsopplysning, _setEditLoennsopplysning] = useState<Loennsopplysning | undefined>(undefined)

  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationLoennsopplysningProps>(validateLoennsopplysning, namespace)
  const arbeidsperioderSøkType = getSedCategory(replySed)

  const ansettelsesTypeOptions = [
    { label: t('el:option-ansettelsestype-ansettelsesforhold'), value: 'ansettelsesforhold' },
    { label: t('el:option-ansettelsestype-selvstendig-næringsvirksomhet'), value: 'selvstendig_næringsvirksomhet' }
  ]

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationLoennsopplysningerProps>(
      clonedValidation, namespace, validateLoennsopplysninger, {
        loennsopplysninger,
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const setPeriode = (periode: Periode, index: number) => {
    if (index < 0) {
      _setNewLoennsopplysning({
        ..._newLoennsopplysning,
        periode
      } as Loennsopplysning)
      _resetValidation(namespace + '-periode')
      return
    }
    _setEditLoennsopplysning({
      ..._editLoennsopplysning,
      periode
    } as Loennsopplysning)
    dispatch(resetValidation(namespace + getIdx(index) + '-periode'))
  }

  const setAnsettelsesType = (ansettelsestype: AnsettelsesType, index: number) => {
    if (index < 0) {
      _setNewLoennsopplysning({
        ..._newLoennsopplysning,
        ansettelsestype: ansettelsestype.trim()
      } as Loennsopplysning)
      _resetValidation(namespace + '-ansettelsestype')
      return
    }
    _setEditLoennsopplysning({
      ..._editLoennsopplysning,
      ansettelsestype: ansettelsestype.trim()
    } as Loennsopplysning)
    dispatch(resetValidation(namespace + getIdx(index) + '-ansettelsestype'))
  }

  const setInntekter = (inntekter: Array<Inntekt>, index: number) => {
    if (index < 0) {
      _setNewLoennsopplysning({
        ..._newLoennsopplysning,
        inntekter
      } as Loennsopplysning)
      _resetValidation(namespace + '-inntekter')
      return
    }
    _setEditLoennsopplysning({
      ..._editLoennsopplysning,
      inntekter
    } as Loennsopplysning)
    dispatch(resetValidation(namespace + getIdx(index) + '-inntekter'))
  }

  const setArbeidsDager = (arbeidsdager: string, index: number) => {
    if (index < 0) {
      _setNewLoennsopplysning({
        ..._newLoennsopplysning,
        arbeidsdager: arbeidsdager.trim()
      } as Loennsopplysning)
      _resetValidation(namespace + '-arbeidsdager')
      return
    }
    _setEditLoennsopplysning({
      ..._editLoennsopplysning,
      arbeidsdager: arbeidsdager.trim()
    } as Loennsopplysning)
    dispatch(resetValidation(namespace + getIdx(index) + '-arbeidsdager'))
  }

  const setArbeidsTimer = (arbeidstimer: string, index: number) => {
    const aTimer = arbeidstimer.trim().replace(",", ".")
    if (index < 0) {
      _setNewLoennsopplysning({
        ..._newLoennsopplysning,
        arbeidstimer: aTimer
      } as Loennsopplysning)
      _resetValidation(namespace + '-arbeidstimer')
      return
    }
    _setEditLoennsopplysning({
      ..._editLoennsopplysning,
      arbeidstimer: aTimer
    } as Loennsopplysning)
    dispatch(resetValidation(namespace + getIdx(index) + '-arbeidstimer'))
  }

  const onCloseEdit = (namespace: string) => {
    _setEditLoennsopplysning(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewLoennsopplysning(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (l: Loennsopplysning, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditLoennsopplysning(l)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationLoennsopplysningProps>(
      clonedValidation, namespace, validateLoennsopplysning, {
        loennsopplysning: _editLoennsopplysning,
        loennsopplysninger,
        index: _editIndex,
        personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editLoennsopplysning))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removed: Loennsopplysning) => {
    const newLoennsopplysning: Array<Loennsopplysning> = _.reject(loennsopplysninger,
      (l: Loennsopplysning) => _.isEqual(removed, l))
    dispatch(updateReplySed(target, newLoennsopplysning))
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      loennsopplysning: _newLoennsopplysning,
      loennsopplysninger
    })
    if (!!_newLoennsopplysning && valid) {
      let newLoennsopplysninger: Array<Loennsopplysning> | undefined = _.cloneDeep(loennsopplysninger)
      if (_.isNil(newLoennsopplysninger)) {
        newLoennsopplysninger = []
      }
      newLoennsopplysninger.push(_newLoennsopplysning)
      dispatch(updateReplySed(target, newLoennsopplysninger))
      onCloseNew()
    }
  }

  const renderRow = (loennsopplysning: Loennsopplysning | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _loennsopplysning = index < 0 ? _newLoennsopplysning : (inEditMode ? _editLoennsopplysning : loennsopplysning)
    return (
      <RepeatableBox
        id={'repeatablerow-' + _namespace}
        key={getId(loennsopplysning)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
        padding="2 4"
      >
        <VStack gap="4">
          <HGrid columns={"2fr 1fr"} gap="4" align="start">
            {inEditMode
              ? (
                <PeriodeInput
                  namespace={_namespace + '-periode'}
                  error={{
                    startdato: _v[_namespace + '-startdato']?.feilmelding,
                    sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                  }}
                  hideLabel={false}
                  label={{
                    startdato: t('label:fra') + ' (DD.MM.ÅÅÅÅ)',
                    sluttdato: t('label:til') + ' (DD.MM.ÅÅÅÅ)'
                  }}
                  setPeriode={(p: Periode) => setPeriode(p, index)}
                  value={_loennsopplysning?.periode}
                />
                )
              : (
                <PeriodeText
                  error={{
                    startdato: _v[_namespace + '-periode-startdato']?.feilmelding,
                    sluttdato: _v[_namespace + '-periode-sluttdato']?.feilmelding
                  }}
                  namespace={_namespace + '-periode'}
                  periode={_loennsopplysning?.periode}
                />
              )
            }
            <HStack>
              <Spacer/>
              <AddRemovePanel<Loennsopplysning>
                item={loennsopplysning}
                marginTop={inEditMode}
                index={index}
                inEditMode={inEditMode}
                onRemove={onRemove}
                onAddNew={onAddNew}
                onCancelNew={onCloseNew}
                onStartEdit={onStartEdit}
                onConfirmEdit={onSaveEdit}
                onCancelEdit={() => onCloseEdit(_namespace)}
              />
            </HStack>
          </HGrid>
          {inEditMode
            ? (
              <HGrid columns={3} gap="4" align="start">
                <Input
                  error={_v[_namespace + '-arbeidsdager']?.feilmelding}
                  namespace={namespace}
                  id='arbeidsdager'
                  label={t('label:arbeidsdager')}
                  onChanged={(arbeidsdager: string) => setArbeidsDager(arbeidsdager, index)}
                  value={_loennsopplysning?.arbeidsdager}
                />
                <Input
                  error={_v[_namespace + '-arbeidstimer']?.feilmelding}
                  namespace={namespace}
                  id='arbeidstimer'
                  label={t('label:arbeidstimer')}
                  onChanged={(arbeidstimer: string) => setArbeidsTimer(arbeidstimer, index)}
                  value={_loennsopplysning?.arbeidstimer ? parseFloat(_loennsopplysning?.arbeidstimer).toLocaleString('nb-NO') : undefined}
                />
                <Select
                  closeMenuOnSelect
                  data-testid={_namespace + '-ansettelsestype'}
                  error={_v[_namespace + '-ansettelsestype']?.feilmelding}
                  id={_namespace + '-ansettelsestype'}
                  label={t('label:type-periode')}
                  menuPortalTarget={document.body}
                  onChange={(e: any) => setAnsettelsesType(e.value, index)}
                  options={ansettelsesTypeOptions}
                  required
                  value={_.find(ansettelsesTypeOptions, b => b.value === _loennsopplysning?.ansettelsestype)}
                  defaultValue={_.find(ansettelsesTypeOptions, b => b.value === _loennsopplysning?.ansettelsestype)}
                />
              </HGrid>
              )
            : (
              <HGrid columns={3} gap="4">
                <FormText
                  error={_v[_namespace + '-arbeidsdager']?.feilmelding}
                  id={_namespace + '-arbeidsdager'}
                >
                  <HStack gap="2">
                    <Label>{t('label:arbeidsdager') + ':'}</Label>
                    {_loennsopplysning?.arbeidsdager}
                  </HStack>
                </FormText>
                <FormText
                  error={_v[_namespace + '-arbeidstimer']?.feilmelding}
                  id={_namespace + '-arbeidstimer'}
                >
                  <HStack gap="2">
                    <Label>{t('label:arbeidstimer') + ':'}</Label>
                    {_loennsopplysning?.arbeidstimer ? parseFloat(_loennsopplysning?.arbeidstimer).toLocaleString('nb-NO') : undefined}
                  </HStack>
                </FormText>
                <FormText
                  error={_v[_namespace + '-ansettelsestype']?.feilmelding}
                  id={_namespace + '-ansettelsestype'}
                >
                  <HStack gap="2">
                    <Label>{t('label:type-periode') + ':'}</Label>
                    {_loennsopplysning?.ansettelsestype}
                  </HStack>
                </FormText>
              </HGrid>
              )}
          {inEditMode
            ? (
              <VStack gap="2">
                <Heading size='small'>
                  {t('label:inntekter')}
                </Heading>
                {_.isEmpty(_loennsopplysning?.inntekter) &&
                  <FormText
                    error={_v[_namespace + '-inntekter']?.feilmelding}
                    id={_namespace + '-inntekter'}
                  >
                    Ingen inntekter registrert
                  </FormText>
                }
                <Inntekter
                  inntekter={_loennsopplysning?.inntekter}
                  onInntekterChanged={(inntekter: Array<Inntekt>) => setInntekter(inntekter, index)}
                  parentNamespace={namespace + '-inntekter'}
                  validation={_v}
                  personName={personName}
                  CDM_VERSJON={CDM_VERSJON}
                />
              </VStack>
              )
            : (
              <VStack gap="2">
                {_loennsopplysning?.inntekter?.map((inntekt: Inntekt, index: number) => {
                  let inntektTypeLabel = ""
                  if(CDM_VERSJON >= 4.3 && inntekt?.type === "nettoinntekt_under_ansettelsesforhold_eller_selvstendig_næringsvirksomhet") {
                    inntektTypeLabel = t('el:option-inntekttype-netto_gjennomsnittlig_inntekt_under_ansettelsesforhold_eller_selvstendig_næringsvirksomhet')
                  } else if (CDM_VERSJON >= 4.3 && inntekt?.type === "bruttoinntekt_under_ansettelsesforhold_eller_selvstendig_næringsvirksomhet") {
                    inntektTypeLabel = t('el:option-inntekttype-brutto_gjennomsnittlig_inntekt_under_ansettelsesforhold_eller_selvstendig_næringsvirksomhet')
                  } else {
                    inntektTypeLabel = t('el:option-inntekttype-' + inntekt?.type)
                  }

                  return (
                    <Box key={getIdInntekt(inntekt)}>
                      <VStack gap="2">
                        <BodyLong>
                          {inntektTypeLabel + (inntekt.typeAnnen ? ': ' + inntekt.typeAnnen : '')}
                        </BodyLong>
                        <HStack gap="2">
                          <Label>{t('label:beløp') + ':'}</Label>
                          <HStack gap="2">
                            <FormText
                              error={_v[_namespace + '-inntekter' + getIdx(index) + '-beloep']?.feilmelding}
                              id={_namespace + '-inntekter' + getIdx(index) + '-beloep'}
                            >
                              {inntekt?.beloep ? inntekt?.beloep.replace('.', ',') : '-'}
                            </FormText>
                            <FormText
                              error={_v[_namespace + '-inntekter' + getIdx(index) + '-valuta']?.feilmelding}
                              id={_namespace + '-inntekter' + getIdx(index) + '-valuta'}
                            >
                              {inntekt?.valuta}
                            </FormText>
                          </HStack>
                        </HStack>
                      </VStack>
                      <HorizontalLineSeparator size='0.5' />
                    </Box>
                  )
                })}
              </VStack>
            )
          }
        </VStack>
      </RepeatableBox>
    )
  }

  const onInntektSearch = (fnr: string, fom: string, tom: string, inntektsliste: string) => {
    dispatch(fetchInntekt(fnr, fom, tom, inntektsliste))
  }

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        {_.isEmpty(loennsopplysninger)
          ? (
            <Box>
              <SpacedHr />
              <FormText
                error={validation[namespace + '-ingen-loennsopplysninger']?.feilmelding}
                id={namespace + '-ingen-loennsopplysninger'}
              >
                {t('message:warning-no-inntekt')}
              </FormText>
              <SpacedHr />
            </Box>
            )
          : loennsopplysninger?.map(renderRow)}
        {_newForm
          ? renderRow(null, -1)
          : (
            <Box>
              <Button
                variant='tertiary'
                onClick={() => _setNewForm(true)}
                icon={<PlusCircleIcon/>}
              >
                {t('el:button-add-new-xs', { x: t('label:loennsopplysninger').toLowerCase() })}
              </Button>
            </Box>
            )}

        <Heading size='small'>
          {t('label:inntekt-fra-komponent')}
        </Heading>
        <InntektSearch
          fnr={fnr!}
          onInntektSearch={onInntektSearch}
          gettingInntekter={gettingInntekter}
        />
        {gettingInntekter && <WaitingPanel />}
        {inntekter && (
          <InntektFC inntekter={inntekter} />
        )}
        <HorizontalLineSeparator />
        <BodyLong size="large">
          {t('label:hent-perioder-fra-aa-registeret-og-a-inntekt')}
        </BodyLong>
        <ArbeidsperioderSøk
          fnr={fnr}
          namespace={namespace}
          type={arbeidsperioderSøkType}
        />
        {arbeidsperioder?.arbeidsperioder && (
          <VStack gap="4">
            <Heading size='small'>
              {t('label:arbeidsperioder')}
            </Heading>
            {arbeidsperioder?.arbeidsperioder?.map((a, index) => {
              const period: PeriodeMedForsikring = arbeidsperioderFraAAToForsikringPeriode(a)
              return (
                <ForsikringPeriodeBox
                  key={getOrgnr(period, 'organisasjonsnummer') + '_' + index}
                  forsikringPeriode={period}
                  showArbeidsgiver
                  namespace={namespace}
                />
              )
            })}
          </VStack>
        )}
      </VStack>
    </Box>
  )
}

export default InntektForm
