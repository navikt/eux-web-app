import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Checkbox, Heading, Ingress, Label } from '@navikt/ds-react'
import { ActionWithPayload } from '@navikt/fetch'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  FlexDiv,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PaddedHorizontallyDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { updateArbeidsperioder } from 'actions/arbeidsperioder'
import { fetchInntekt } from 'actions/inntekt'
import { resetValidation, setValidation } from 'actions/validation'
import AdresseForm from 'applications/SvarSed/Adresser/AdresseForm'
import IdentifikatorFC from 'applications/SvarSed/Identifikator/Identifikator'
import InntektSearch from 'applications/SvarSed/InntektSearch/InntektSearch'
import { MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel2 from 'components/AddRemovePanel/AddRemovePanel2'
import AdresseBox from 'components/AdresseBox/AdresseBox'
import ArbeidsperioderBox from 'components/Arbeidsperioder/ArbeidsperioderBox'
import ArbeidsperioderSøk from 'components/Arbeidsperioder/ArbeidsperioderSøk'
import FormText from 'components/Forms/FormText'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import Inntekt from 'components/Inntekt/Inntekt'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import {
  Adresse,
  ArbeidsgiverIdentifikator,
  Periode,
  PeriodeMedForsikring,
  PeriodeSort,
  ReplySed
} from 'declarations/sed'
import {
  ArbeidsperiodeFraAA,
  ArbeidsperioderFraAA,
  IInntekter,
  UpdateReplySedPayload,
  Validation
} from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getFnr } from 'utils/fnr'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import makeRenderPlan, { PlanItem, RenderPlanProps } from 'utils/renderPlan'
import { periodeSort } from 'utils/sort'
import { hasNamespace } from 'utils/validation'
import { validatePeriodeMedForsikring, ValidationPeriodeMedForsikringProps } from './validation'

export interface ArbeidsforholdSelector extends MainFormSelector {
  arbeidsperioder: ArbeidsperioderFraAA | null | undefined
  inntekter: IInntekter | null | undefined
  gettingInntekter: boolean
  validation: Validation
}

export interface ArbeidsforholdProps {
  parentNamespace: string
  personID: string | undefined
  personName: string | undefined
  target: string
  replySed: ReplySed | null | undefined
  updateReplySed: (needle: string, value: any) => ActionWithPayload<UpdateReplySedPayload>
}

const mapState = (state: State): ArbeidsforholdSelector => ({
  arbeidsperioder: state.arbeidsperioder,
  inntekter: state.inntekt.inntekter,
  gettingInntekter: state.loading.gettingInntekter,
  validation: state.validation.status
})

const ArbeidsperioderFC: React.FC<ArbeidsforholdProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:ArbeidsforholdProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    arbeidsperioder,
    inntekter,
    gettingInntekter,
    validation
  } = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const namespace = `${parentNamespace}-${personID}-arbeidsforhold`
  const target = 'perioderAnsattMedForsikring'
  const perioder: Array<PeriodeMedForsikring> | undefined = _.get(replySed, target)
  const includeAddress = true
  const fnr = getFnr(replySed, personID)
  const getId = (p: PlanItem<PeriodeMedForsikring> | null | undefined) => p ? p.type + '-' + (p.item.arbeidsgiver?.navn ?? '') + '-' + p.item.startdato + '-' + (p.item.sluttdato ?? '') : 'new'

  const [_plan, _setPlan] = useState<Array<PlanItem<PeriodeMedForsikring>> | undefined>(undefined)
  const [_newPeriodeMedForsikring, _setNewPeriodeMedForsikring] = useState<PeriodeMedForsikring | undefined>(undefined)
  const [_editPeriodeMedForsikring, _setEditPeriodeMedForsikring] = useState<PeriodeMedForsikring | undefined>(undefined)

  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationPeriodeMedForsikringProps>(validatePeriodeMedForsikring, namespace)

  const [_sort, _setSort] = useState<PeriodeSort>('time')

  const onInntektSearch = (fnr: string, fom: string, tom: string, inntektsliste: string) => {
    dispatch(fetchInntekt(fnr, fom, tom, inntektsliste))
  }

  useEffect(() => {
    const spikedPeriods: Array<PeriodeMedForsikring> | undefined = perioder?.map((p, index) => ({ ...p, __index: index }))
    const plan: Array<PlanItem<PeriodeMedForsikring>> = makeRenderPlan<PeriodeMedForsikring>({
      perioder: spikedPeriods,
      arbeidsperioder,
      addedArbeidsperioder: [],
      sort: _sort
    } as RenderPlanProps<PeriodeMedForsikring>)
    _setPlan(plan)
  }, [replySed, _sort, arbeidsperioder])

  const onPeriodeChanged = (p: Periode, index: number) => {
    if (index < 0) {
      _setNewPeriodeMedForsikring({
        ..._newPeriodeMedForsikring,
        ...p
      } as PeriodeMedForsikring)
      _resetValidation(namespace + '-startdato')
      _resetValidation(namespace + '-sluttdato')
      return
    }
    _setEditPeriodeMedForsikring({
      ..._editPeriodeMedForsikring,
      ...p
    } as PeriodeMedForsikring)
    dispatch(resetValidation(namespace + getIdx(index) + '-startdato'))
    dispatch(resetValidation(namespace + getIdx(index) + '-sluttdato'))
  }

  const onNavnChanged = (navn: string, index: number) => {
    if (index < 0) {
      _setNewPeriodeMedForsikring({
        ..._newPeriodeMedForsikring,
        arbeidsgiver: {
          ..._newPeriodeMedForsikring?.arbeidsgiver,
          navn
        }
      } as PeriodeMedForsikring)
      _resetValidation(namespace + '-arbeidsgiver-navn')
      return
    }
    _setEditPeriodeMedForsikring({
      ..._editPeriodeMedForsikring,
      arbeidsgiver: {
        ..._newPeriodeMedForsikring?.arbeidsgiver,
        navn
      }
    } as PeriodeMedForsikring)
    dispatch(resetValidation(namespace + getIdx(index) + '-arbeidsgiver-navn'))
  }

  const onIdentifikatorerChanged = (identifikatorer: Array<ArbeidsgiverIdentifikator>, index: number) => {
    if (index < 0) {
      _setNewPeriodeMedForsikring({
        ..._newPeriodeMedForsikring,
        arbeidsgiver: {
          ..._newPeriodeMedForsikring?.arbeidsgiver,
          identifikatorer
        }
      } as PeriodeMedForsikring)
      _resetValidation(namespace + '-arbeidsgiver-identifikatorer')
      return
    }
    _setEditPeriodeMedForsikring({
      ..._editPeriodeMedForsikring,
      arbeidsgiver: {
        ..._newPeriodeMedForsikring?.arbeidsgiver,
        identifikatorer
      }
    } as PeriodeMedForsikring)
    dispatch(resetValidation(namespace + getIdx(index) + '-arbeidsgiver-identifikatorer'))
  }

  const onAdresseChanged = (adresse: Adresse, index: number) => {
    if (index < 0) {
      _setNewPeriodeMedForsikring({
        ..._newPeriodeMedForsikring,
        arbeidsgiver: {
          ..._newPeriodeMedForsikring?.arbeidsgiver,
          adresse
        }
      } as PeriodeMedForsikring)
      _resetValidation(namespace + '-arbeidsgiver-adresse')
      return
    }
    _setEditPeriodeMedForsikring({
      ..._editPeriodeMedForsikring,
      arbeidsgiver: {
        ..._newPeriodeMedForsikring?.arbeidsgiver,
        adresse
      }
    } as PeriodeMedForsikring)
    dispatch(resetValidation(namespace + getIdx(index) + '-arbeidsgiver-adresse'))
  }

  const onCloseEdit = (namespace: string) => {
    _setEditPeriodeMedForsikring(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewPeriodeMedForsikring(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (p: PeriodeMedForsikring, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditPeriodeMedForsikring(p)
    _setEditIndex(index)
  }

  const onSaveEdit = (editPeriodeMedForsikring ?: PeriodeMedForsikring, editIndex ?: number) => {
    // if editPeriode is not null, it comes from arbeidsgiver; if not, from existing typed periode
    const __editPeriodeMedForsikring = !_.isUndefined(editPeriodeMedForsikring) ? editPeriodeMedForsikring : _editPeriodeMedForsikring
    const __editIndex = !_.isUndefined(editIndex) ? editIndex : _editIndex

    const [valid, newValidation] = performValidation<ValidationPeriodeMedForsikringProps>(
      validation, namespace, validatePeriodeMedForsikring, {
        periodeMedForsikring: __editPeriodeMedForsikring,
        index: __editIndex,
        personName
      })
    if (valid) {
      dispatch(updateReplySed(`${target}[${__editIndex}]`, __editPeriodeMedForsikring))
      onCloseEdit(namespace + getIdx(__editIndex))
    } else {
      dispatch(setValidation(newValidation))
    }
  }

  const onRemove = (removed: PeriodeMedForsikring) => {
    const index: number | undefined = removed.__index
    if (index !== undefined && index >= 0) {
      const newPerioder = _.cloneDeep(perioder) as Array<PeriodeMedForsikring>
      newPerioder.splice(index, 1)
      dispatch(updateReplySed(target, newPerioder))
      standardLogger('svarsed.editor.periode.remove', { type: 'perioderAnsattMedForsikring' })
    }
  }

  const onAddNew = (newPeriodeMedForsikring?: PeriodeMedForsikring) => {
    // if newPeriode is not null, it comes from arbeidsgiver; if not, from newly typed periode

    const __newPeriodeMedForsikring = !_.isUndefined(newPeriodeMedForsikring) ? newPeriodeMedForsikring : _newPeriodeMedForsikring
    const valid: boolean = _performValidation({
      periodeMedForsikring: __newPeriodeMedForsikring,
      personName
    })

    if (!!__newPeriodeMedForsikring && valid) {
      let newPerioderMedforsikring: Array<PeriodeMedForsikring> | undefined = _.cloneDeep(perioder)
      if (_.isNil(newPerioderMedforsikring)) {
        newPerioderMedforsikring = []
      }
      delete __newPeriodeMedForsikring.__index
      delete __newPeriodeMedForsikring.__type
      newPerioderMedforsikring.push(__newPeriodeMedForsikring)
      newPerioderMedforsikring = newPerioderMedforsikring.sort(periodeSort)
      dispatch(updateReplySed(target, newPerioderMedforsikring))
      standardLogger('svarsed.editor.periode.add', { type: 'perioderAnsattMedForsikring' })
      onCloseNew()
    }
  }

  const onRemoveFromArbeidsgiver = (deletedArbeidsgiver: PeriodeMedForsikring) => {
    onRemove(deletedArbeidsgiver)
  }

  const onAddNewFromArbeidsgiver = (selectedArbeidsgiver: PeriodeMedForsikring) => {
    onAddNew(selectedArbeidsgiver)
  }

  const onArbeidsgiverSelect = (arbeidsgiver: PeriodeMedForsikring, checked: boolean) => {
    if (checked) {
      onAddNewFromArbeidsgiver(arbeidsgiver)
    } else {
      onRemoveFromArbeidsgiver(arbeidsgiver)
    }
  }

  const onArbeidsgiverEdit = (newArbeidsgiver: PeriodeMedForsikring, oldArbeidsgiver: PeriodeMedForsikring, selected: boolean) => {
    // if selected, let's find the same period.
    let selectedIndex: number | undefined
    if (selected) {
      selectedIndex = _.findIndex(perioder, p =>
        p.startdato === oldArbeidsgiver.startdato && p.sluttdato === oldArbeidsgiver.sluttdato && p.arbeidsgiver.navn === oldArbeidsgiver.arbeidsgiver.navn)
    }

    if (selected && selectedIndex !== undefined && selectedIndex >= 0) {
      onSaveEdit(newArbeidsgiver, selectedIndex)
    }

    // this is the index of this arbeidsgiver in the arbeidsperioder?.arbeidsperioder list
    // it is stored in __type, as the __index is already busy with the one above
    const changedArbeidsgiverIndex: number = newArbeidsgiver.__type!

    const newArbeidsperioder: Array<ArbeidsperiodeFraAA> | undefined = _.cloneDeep(arbeidsperioder?.arbeidsperioder) as Array<ArbeidsperiodeFraAA>
    newArbeidsperioder[changedArbeidsgiverIndex].fraDato = newArbeidsgiver.startdato
    newArbeidsperioder[changedArbeidsgiverIndex].tilDato = newArbeidsgiver.sluttdato
    newArbeidsperioder[changedArbeidsgiverIndex].arbeidsgiversNavn = newArbeidsgiver.arbeidsgiver.navn
    dispatch(updateArbeidsperioder({
      ...arbeidsperioder,
      arbeidsperioder: newArbeidsperioder
    }))
  }

  const renderPlan = (item: PlanItem<PeriodeMedForsikring>, index: number, previousItem: PlanItem<Periode | PeriodeMedForsikring> | undefined) => {
    return (
      <div key={getId(item)}>
        {_sort === 'group' && (previousItem === undefined || previousItem.type !== item.type) && (
          <PaddedHorizontallyDiv>
            <Label>{t('label:' + item.type)}</Label>
          </PaddedHorizontallyDiv>
        )}
        {renderPlanItem(item)}
        <VerticalSeparatorDiv />
      </div>
    )
  }

  const renderPlanItem = (item: PlanItem<PeriodeMedForsikring> | null) => {
    if (item === null) {
      return renderRowPeriodeMedForsikring(null)
    }
    if (item.type === 'periode') {
      return renderRowPeriodeMedForsikring(item.item)
    }
    if (item.type === 'arbeidsperiode') {
      return renderRowArbeidsperiode(item.item)
    }
  }

  const renderRowArbeidsperiode = (a: PeriodeMedForsikring) => {
    const index: number = a ? a.__index! : -1
    return (
      <Column>
        <ArbeidsperioderBox
          periodeMedForsikring={a}
          editable='full'
          includeAddress={includeAddress}
          selected={!_.isNil(index) && index >= 0}
          onPeriodeMedForsikringSelect={onArbeidsgiverSelect}
          onPeriodeMedForsikringEdit={onArbeidsgiverEdit}
          namespace={namespace}
        />
      </Column>
    )
  }

  const renderRowPeriodeMedForsikring = (p: PeriodeMedForsikring | null) => {
    const index: number = p ? p.__index! : -1
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _periodeMedForsikring = index < 0 ? _newPeriodeMedForsikring : (inEditMode ? _editPeriodeMedForsikring : p)

    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        className={classNames({
          new: index < 0,
          error: hasNamespace(_v, _namespace)
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow>
          {inEditMode
            ? (
              <PeriodeInput
                namespace={_namespace}
                error={{
                  startdato: _v[_namespace + '-startdato']?.feilmelding,
                  sluttdato: _v[_namespace + '-sluttdato']?.feilmelding,
                  aapenPeriodeType: _v[_namespace + '-aapenPeriodeType']?.feilmelding
                }}
                hideLabel={false}
                setPeriode={(p: Periode) => onPeriodeChanged(p, index!)}
                value={_periodeMedForsikring}
              />
              )
            : (
              <>
                <PeriodeText
                  error={{
                    startdato: _v[_namespace + '-startdato'],
                    sluttdato: _v[_namespace + '-sluttdato']
                  }}
                  periode={_periodeMedForsikring}
                />
                <FormText error={_v[_namespace + '-arbeidsgiver-navn']}>
                  <FlexDiv>
                    <Label>{t('label:institusjonens-navn') + ':'}</Label>
                    <HorizontalSeparatorDiv size='0.5' />
                    {_periodeMedForsikring?.arbeidsgiver.navn}
                  </FlexDiv>
                </FormText>
              </>
              )}
        </AlignStartRow>
        {inEditMode && (
          <AlignStartRow>
            <Column>

              <Input
                error={_v[_namespace + '-arbeidsgiver-navn']?.feilmelding}
                namespace={_namespace + '-arbeidsgiver'}
                id='navn'
                key={_namespace + '-arbeidsgiver-navn' + _periodeMedForsikring?.arbeidsgiver.navn}
                label={t('label:institusjonens-navn')}
                onChanged={(navn: string) => onNavnChanged(navn, index)}
                value={_periodeMedForsikring?.arbeidsgiver.navn}
              />

            </Column>
            <Column />
          </AlignStartRow>
        )}
        {inEditMode
          ? (
            <IdentifikatorFC
              identifikatorer={_periodeMedForsikring?.arbeidsgiver.identifikatorer}
              onIdentifikatorerChanged={(identifikatorer: Array<ArbeidsgiverIdentifikator>) => onIdentifikatorerChanged(identifikatorer, index)}
              namespace={namespace + '-arbeidsgiver-identifikatorer'}
              validation={_v}
              personName={personName}
            />
            )
          : _periodeMedForsikring?.arbeidsgiver.identifikatorer?.map((id, i) => {
            const idx = getIdx(i)
            return (
              <FormText key={id.type} error={_v[_namespace + idx + '-identifikatorer']}>
                <FlexDiv>
                  <Label>{t('label:' + id.type) + ':'}</Label>
                  <HorizontalSeparatorDiv size='0.5' />
                  {id?.id}
                </FlexDiv>
              </FormText>
            )
          })}
        <VerticalSeparatorDiv />
        {inEditMode
          ? (
            <AdresseForm
              adresse={_periodeMedForsikring?.arbeidsgiver.adresse}
              onAdressChanged={(a: Adresse) => onAdresseChanged(a, index)}
              namespace={namespace + '-arbeidsgiver-adresse'}
              validation={_v}
            />
            )
          : (
            <AdresseBox adresse={_periodeMedForsikring?.arbeidsgiver.adresse} seeType />
            )}
        <AlignStartRow>
          <AlignEndColumn>
            <AddRemovePanel2<PeriodeMedForsikring>
              item={p}
              marginTop={inEditMode}
              index={index}
              inEditMode={inEditMode}
              onRemove={onRemove}
              onAddNew={() => onAddNew()}
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

  return (
    <>
      <PaddedDiv>
        <Heading size='small'>
          {t('label:oversikt-brukers-arbeidsperioder')}
        </Heading>
        <VerticalSeparatorDiv size='2' />
        <Ingress>
          {t('label:hent-perioder-fra-aa-registeret-og-a-inntekt')}
        </Ingress>
        <VerticalSeparatorDiv />
        <ArbeidsperioderSøk
          amplitude='svarsed.editor.arbeidsforholdmedforsikring.arbeidsgiver.search'
          fnr={fnr}
          namespace={namespace}
        />
      </PaddedDiv>
      <VerticalSeparatorDiv size='2' />
      {_.isEmpty(_plan)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-periods-med-forsikring')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : (
          <>
            <PaddedHorizontallyDiv>
              <Checkbox
                checked={_sort === 'group'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setSort(e.target.checked ? 'group' : 'time')}
              >
                {t('label:group-by-type')}
              </Checkbox>
            </PaddedHorizontallyDiv>
            <VerticalSeparatorDiv />
            {_plan?.map((item, index) => renderPlan(item, index, (index > 0 ? _plan![index - 1] : undefined)))}
          </>
          )}

      <VerticalSeparatorDiv />
      {_newForm
        ? renderPlanItem(null)
        : (
          <PaddedDiv>
            <Button
              variant='tertiary'
              onClick={() => _setNewForm(true)}
            >
              <AddCircle />
              {t('el:button-add-new-x', { x: t('label:arbeidperioder').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}

      <VerticalSeparatorDiv />
      <Ingress>
        {t('label:hent-inntekt-i-A-inntekt')}
      </Ingress>
      <VerticalSeparatorDiv />
      <InntektSearch
        amplitude='svarsed.editor.inntekt.search'
        fnr={fnr!}
        onInntektSearch={onInntektSearch}
        gettingInntekter={gettingInntekter}
      />
      <VerticalSeparatorDiv />
      {inntekter && <Inntekt inntekter={inntekter} />}
    </>
  )
}

export default ArbeidsperioderFC
