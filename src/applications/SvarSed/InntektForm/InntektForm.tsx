import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Heading, Ingress, Label } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  FlexCenterSpacedDiv,
  FlexDiv,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PaddedHorizontallyDiv,
  PileDiv,
  Row,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { fetchInntekt } from 'actions/inntekt'
import { resetValidation, setValidation } from 'actions/validation'
import Inntekter from 'applications/SvarSed/Inntekter/Inntekter'
import InntektSearch from 'applications/SvarSed/InntektSearch/InntektSearch'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel2 from 'components/AddRemovePanel/AddRemovePanel2'
import ArbeidsperioderBox from 'components/Arbeidsperioder/ArbeidsperioderBox'
import ArbeidsperioderSøk from 'components/Arbeidsperioder/ArbeidsperioderSøk'
import FormText from 'components/Forms/FormText'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import Select from 'components/Forms/Select'
import InntektFC from 'components/Inntekt/Inntekt'
import { HorizontalLineSeparator, RepeatableRow, SpacedHr } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { State } from 'declarations/reducers'
import { Loennsopplysning, Periode, PeriodeMedForsikring, PeriodeType } from 'declarations/sed'
import { Inntekt } from 'declarations/sed.d'
import { ArbeidsperioderFraAA, IInntekter, Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { arbeidsperioderFraAAToPeriodeMedForsikring, getOrgnr } from 'utils/arbeidsperioder'
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

interface InntektFormSelector extends MainFormSelector {
  arbeidsperioder: ArbeidsperioderFraAA | null | undefined
  gettingInntekter: boolean
  inntekter: IInntekter | undefined
}

const mapState = (state: State): InntektFormSelector => ({
  arbeidsperioder: state.arbeidsperioder,
  gettingInntekter: state.loading.gettingInntekter,
  inntekter: state.inntekt.inntekter,
  validation: state.validation.status
})

const InntektForm: React.FC<MainFormProps> = ({
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

  const namespace = `${parentNamespace}-${personID}-inntekt`
  const target = 'loennsopplysninger'
  const loennsopplysninger: Array<Loennsopplysning> = _.get(replySed, target)
  const fnr: string | undefined = getFnr(replySed, personID)
  const getId = (l: Loennsopplysning |null |undefined) => l ? l.periode?.startdato + '-' + l.periode?.sluttdato : 'new'
  const getIdInntekt = (inntekt: Inntekt | null | undefined) => inntekt ? inntekt.type + '-' + inntekt.typeAnnen + '-' + inntekt.beloep : 'new'

  const [_newLoennsopplysning, _setNewLoennsopplysning] = useState<Loennsopplysning | undefined>(undefined)
  const [_editLoennsopplysning, _setEditLoennsopplysning] = useState<Loennsopplysning | undefined>(undefined)

  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationLoennsopplysningProps>(validateLoennsopplysning, namespace)

  const periodeTypeOptions = [
    { label: t('el:option-periodetype-ansettelsesforhold'), value: 'ansettelsesforhold' },
    { label: t('el:option-periodetype-selvstendig-næringsvirksomhet'), value: 'selvstendig-næringsvirksomhet' }
  ]

  useUnmount(() => {
    const [, newValidation] = performValidation<ValidationLoennsopplysningerProps>(
      validation, namespace, validateLoennsopplysninger, {
        loennsopplysninger,
        personName
      }
    )
    dispatch(setValidation(newValidation))
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

  const setPeriodeType = (periodetype: PeriodeType, index: number) => {
    if (index < 0) {
      _setNewLoennsopplysning({
        ..._newLoennsopplysning,
        periodetype
      } as Loennsopplysning)
      _resetValidation(namespace + '-periodetype')
      return
    }
    _setEditLoennsopplysning({
      ..._editLoennsopplysning,
      periodetype
    } as Loennsopplysning)
    dispatch(resetValidation(namespace + getIdx(index) + '-periodetype'))
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
        arbeidsdager
      } as Loennsopplysning)
      _resetValidation(namespace + '-arbeidsdager')
      return
    }
    _setEditLoennsopplysning({
      ..._editLoennsopplysning,
      arbeidsdager
    } as Loennsopplysning)
    dispatch(resetValidation(namespace + getIdx(index) + '-arbeidsdager'))
  }

  const setArbeidsTimer = (arbeidstimer: string, index: number) => {
    if (index < 0) {
      _setNewLoennsopplysning({
        ..._newLoennsopplysning,
        arbeidstimer
      } as Loennsopplysning)
      _resetValidation(namespace + '-arbeidstimer')
      return
    }
    _setEditLoennsopplysning({
      ..._editLoennsopplysning,
      arbeidstimer
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
    const [valid, newValidation] = performValidation<ValidationLoennsopplysningProps>(
      validation, namespace, validateLoennsopplysning, {
        loennsopplysning: _editLoennsopplysning,
        loennsopplysninger,
        index: _editIndex,
        personName
      })
    if (valid) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editLoennsopplysning))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(newValidation))
    }
  }

  const onRemove = (removed: Loennsopplysning) => {
    const newLoennsopplysning: Array<Loennsopplysning> = _.reject(loennsopplysninger,
      (l: Loennsopplysning) => _.isEqual(removed, l))
    dispatch(updateReplySed(target, newLoennsopplysning))
    standardLogger('svarsed.editor.loennsopplysning.remove')
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
      standardLogger('svarsed.editor.loennsopplysning.add')
      onCloseNew()
    }
  }

  const renderRow = (loennsopplysning: Loennsopplysning | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _loennsopplysning = index < 0 ? _newLoennsopplysning : (inEditMode ? _editLoennsopplysning : loennsopplysning)
    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getId(loennsopplysning)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow>
          {inEditMode
            ? (
              <>
                <PeriodeInput
                  namespace={_namespace}
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
                <Column>
                  <Select
                    closeMenuOnSelect
                    data-testid={_namespace + '-periodetype'}
                    error={_v[_namespace + '-periodetype']?.feilmelding}
                    id={_namespace + '-periodetype'}
                    key={_namespace + '-periodetype-' + _loennsopplysning?.periodetype}
                    label={t('label:type-periode')}
                    menuPortalTarget={document.body}
                    onChange={(e: any) => setPeriodeType(e.value, index)}
                    options={periodeTypeOptions}
                    required
                    value={_.find(periodeTypeOptions, b => b.value === _loennsopplysning?.periodetype)}
                    defaultValue={_.find(periodeTypeOptions, b => b.value === _loennsopplysning?.periodetype)}
                  />
                </Column>
              </>
              )
            : (
              <>
                <PeriodeText
                  error={{
                    startdato: _v[_namespace + '-periode-startdato'],
                    sluttdato: _v[_namespace + '-periode-sluttdato']
                  }}
                  periode={_loennsopplysning?.periode}
                />
                <Column>
                  <FormText error={_v[_namespace + '-periodetype']}>
                    {_loennsopplysning?.periodetype}
                  </FormText>
                </Column>
              </>
              )}
        </AlignStartRow>
        <VerticalSeparatorDiv />
        {inEditMode
          ? (
            <>
              <Heading size='small'>
                {t('label:inntekter')}
              </Heading>
              <VerticalSeparatorDiv />
              <Inntekter
                inntekter={_loennsopplysning?.inntekter}
                onInntekterChanged={(inntekter: Array<Inntekt>) => setInntekter(inntekter, index)}
                parentNamespace={namespace + '-inntekter'}
                validation={_v}
                personName={personName}
              />
            </>
            )
          : _loennsopplysning?.inntekter?.map((inntekt: Inntekt, index: number) => (
            <PileDiv key={getIdInntekt(inntekt)}>
              <FlexCenterSpacedDiv>
                <BodyLong>
                  {t('el:option-inntekttype-' + inntekt.type)}
                </BodyLong>
                <BodyLong>
                  {inntekt.typeAnnen}
                </BodyLong>
              </FlexCenterSpacedDiv>
              <FlexDiv>
                <FlexDiv>
                  <Label>{t('label:beløp') + ':'}</Label>
                  <HorizontalSeparatorDiv size='0.5' />
                  <FlexDiv>
                    <FormText error={_v[_namespace + '-inntekter' + getIdx(index) + '-beloep']}>
                      {inntekt?.beloep}
                    </FormText>
                    <HorizontalSeparatorDiv size='0.5' />
                    <FormText error={_v[_namespace + '-inntekter' + getIdx(index) + '-valuta']}>
                      {inntekt?.valuta}
                    </FormText>
                  </FlexDiv>
                </FlexDiv>
              </FlexDiv>
            </PileDiv>
          ))}
        <VerticalSeparatorDiv />
        <AlignStartRow>
          {inEditMode
            ? (
              <>
                <Column>
                  <Input
                    error={_v[_namespace + '-arbeidsdager']?.feilmelding}
                    namespace={namespace}
                    id='arbeidsdager'
                    key={'arbeidsdager' + _loennsopplysning?.arbeidsdager}
                    label={t('label:arbeidsdager')}
                    onChanged={(arbeidsdager: string) => setArbeidsDager(arbeidsdager, index)}
                    value={_loennsopplysning?.arbeidsdager}
                  />
                </Column>
                <Column>
                  <Input
                    error={_v[_namespace + '-arbeidstimer']?.feilmelding}
                    namespace={namespace}
                    id='arbeidstimer'
                    key={'arbeidstimer' + _loennsopplysning?.arbeidstimer}
                    label={t('label:arbeidstimer')}
                    onChanged={(arbeidstimer: string) => setArbeidsTimer(arbeidstimer, index)}
                    value={_loennsopplysning?.arbeidstimer}
                  />
                </Column>
              </>
              )
            : (
              <>
                <Column>
                  <FormText error={_v[_namespace + '-arbeidsdager']}>
                    <FlexDiv>
                      <Label>{t('label:arbeidsdager') + ':'}</Label>
                      <HorizontalSeparatorDiv size='0.5' />
                      {_loennsopplysning?.arbeidsdager}
                    </FlexDiv>
                  </FormText>
                </Column>
                <Column>
                  <FormText error={_v[_namespace + '-arbeidstimer']}>
                    <FlexDiv>
                      <Label>{t('label:arbeidstimer') + ':'}</Label>
                      <HorizontalSeparatorDiv size='0.5' />
                      {_loennsopplysning?.arbeidstimer}
                    </FlexDiv>
                  </FormText>
                </Column>
              </>
              )}
          <AlignEndColumn>
            <AddRemovePanel2<Loennsopplysning>
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
          </AlignEndColumn>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  const onInntektSearch = (fnr: string, fom: string, tom: string, inntektsliste: string) => {
    dispatch(fetchInntekt(fnr, fom, tom, inntektsliste))
  }

  return (
    <>
      <VerticalSeparatorDiv />
      {_.isEmpty(loennsopplysninger)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-inntekt')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : loennsopplysninger?.map(renderRow)}
      <VerticalSeparatorDiv />
      {_newForm
        ? renderRow(null, -1)
        : (
          <Row>
            <Column>
              <Button
                variant='tertiary'
                onClick={() => _setNewForm(true)}
              >
                <AddCircle />
                {t('el:button-add-new-xs', { x: t('label:loennsopplysninger').toLowerCase() })}
              </Button>
            </Column>
          </Row>
          )}
      <VerticalSeparatorDiv size='2' />
      <PaddedDiv>
        <Heading size='small'>
          {t('label:inntekt-fra-komponent')}
        </Heading>
        <VerticalSeparatorDiv />
        <InntektSearch
          fnr={fnr!}
          onInntektSearch={onInntektSearch}
          gettingInntekter={gettingInntekter}
        />
        <VerticalSeparatorDiv />
        {gettingInntekter && <WaitingPanel />}
        {inntekter && (
          <InntektFC inntekter={inntekter} />
        )}
        <VerticalSeparatorDiv size='2' />
        <HorizontalLineSeparator />
        <VerticalSeparatorDiv size='2' />
        <Ingress>
          {t('label:hent-perioder-fra-aa-registeret-og-a-inntekt')}
        </Ingress>
        <VerticalSeparatorDiv />
        <ArbeidsperioderSøk
          amplitude='svarsed.editor.inntekt.arbeidsgiver.search'
          fnr={fnr}
          namespace={namespace}
        />
        <VerticalSeparatorDiv size='2' />
        {arbeidsperioder?.arbeidsperioder && (
          <>
            <Heading size='small'>
              {t('label:arbeidsperioder')}
            </Heading>
            <VerticalSeparatorDiv size='2' />
            {arbeidsperioder?.arbeidsperioder?.map(a => {
              const period: PeriodeMedForsikring = arbeidsperioderFraAAToPeriodeMedForsikring(a)
              return (
                <ArbeidsperioderBox
                  periodeMedForsikring={period}
                  editable='no'
                  showAddress={false}
                  key={getOrgnr(period, 'organisasjonsnummer')}
                  namespace={namespace}
                  selectable={false}
                />
              )
            })}
          </>
        )}
      </PaddedDiv>
    </>
  )
}

export default InntektForm
