import { PlusCircleIcon, Buildings3Icon } from '@navikt/aksel-icons'
import {BodyLong, Box, Button, HStack, Spacer, VStack} from '@navikt/ds-react'
import { updateArbeidsperioder } from 'actions/arbeidsperioder'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import ArbeidsperioderSøk from 'components/Arbeidsperioder/ArbeidsperioderSøk'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import ForsikringPeriodeBox from 'components/ForsikringPeriodeBox/ForsikringPeriodeBox'
import {RepeatableBox, SpacedHr} from 'components/StyledComponents'
import { ErrorElement } from 'declarations/app.d'
import { State } from 'declarations/reducers'
import { ForsikringPeriode, Periode, PeriodeMedForsikring } from 'declarations/sed'
import { ArbeidsperiodeFraAA, ArbeidsperioderFraAA, Validation } from 'declarations/types'
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
import { hasNamespaceWithErrors } from 'utils/validation'
import { validateAnsattPeriode, ValidationAnsattPeriodeProps } from './validation'

interface AnsattSelector extends MainFormSelector {
  arbeidsperioder: ArbeidsperioderFraAA | null | undefined,
}

const mapState = (state: State): AnsattSelector => ({
  arbeidsperioder: state.arbeidsperioder,
  validation: state.validation.status
})

export interface AnsattProps extends MainFormProps {
  onPerioderEdited?: () => void
}

const Ansatt: React.FC<AnsattProps> = ({
  parentNamespace,
  parentTarget,
  personID,
  personName,
  replySed,
  updateReplySed,
  onPerioderEdited
}:AnsattProps): JSX.Element => {
  const { t } = useTranslation()
  const { arbeidsperioder, validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}`
  const target = `${personID}.${parentTarget}`
  const perioder: Array<Periode> | undefined = _.get(replySed, target)
  const fnr = getFnr(replySed, personID)
  const getId = (item: PlanItem<Periode | ForsikringPeriode> | null): string => (item
    ? item.type + '-' + (item.item as Periode | ForsikringPeriode)?.startdato + '-' + (item.item as Periode | ForsikringPeriode).sluttdato
    : 'new-periode')

  const [_plan, _setPlan] = useState<Array<PlanItem<Periode>> | undefined>(undefined)
  const [_newPeriode, _setNewPeriode] = useState<Periode | undefined>(undefined)
  const [_editPeriode, _setEditPeriode] = useState<Periode | undefined>(undefined)

  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationAnsattPeriodeProps>(validateAnsattPeriode, namespace)

  useEffect(() => {
    const spikedPeriods: Array<Periode> | undefined = perioder?.map((p, index) => ({ ...p, __index: index }))
    const plan: Array<PlanItem<Periode>> = makeRenderPlan<Periode>({
      perioder: spikedPeriods,
      arbeidsperioder,
      sort: "time"
    } as RenderPlanProps<Periode>)
    _setPlan(plan)
  }, [replySed, arbeidsperioder])

  const onPeriodeChanged = (periode: Periode, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      _resetValidation(namespace)
      return
    }
    _setEditPeriode(periode)
    if (hasNamespaceWithErrors(validation, namespace + getIdx(index))) {
      dispatch(resetValidation(namespace + getIdx(index)))
    }
  }

  const onCloseEdit = (namespace: string) => {
    _setEditPeriode(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewPeriode(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (p: Periode, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditPeriode(p)
    _setEditIndex(index)
  }

  const onSaveEdit = (editPeriode ?: Periode, editIndex ?: number) => {
    // if editPeriode is not null, it comes from arbeidsgiver; if not, from existing typed periode
    const __editPeriode = !_.isUndefined(editPeriode) ? editPeriode : _editPeriode
    const __editIndex = !_.isUndefined(editIndex) ? editIndex : _editIndex
    delete __editPeriode?.__index
    delete __editPeriode?.__type
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationAnsattPeriodeProps>(
      clonedValidation, namespace, validateAnsattPeriode, {
        periode: __editPeriode,
        perioder: perioder,
        index: __editIndex,
        personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${target}[${__editIndex}]`, __editPeriode))
      onCloseEdit(namespace + getIdx(__editIndex))
      if(onPerioderEdited) onPerioderEdited()
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (deletedPeriode: Periode) => {
    const index: number | undefined = deletedPeriode.__index
    if (index !== undefined && index >= 0) {
      const newPerioder = _.cloneDeep(perioder) as Array<Periode>
      newPerioder.splice(index, 1)
      dispatch(updateReplySed(target, newPerioder))
      standardLogger('svarsed.editor.periode.remove', { type: 'perioderSomAnsatt' })
      if(onPerioderEdited) onPerioderEdited()
    }
  }

  const onAddNew = (newPeriode?: Periode) => {
    // if newPeriode is not null, it comes from arbeidsgiver; if not, from newly typed periode

    const __newPeriode = !_.isUndefined(newPeriode) ? newPeriode : _newPeriode
    delete __newPeriode?.__index
    delete __newPeriode?.__type

    const valid: boolean = _performValidation({
      periode: __newPeriode,
      perioder: perioder,
      personName
    })

    if (!!__newPeriode && valid) {
      let newPerioder: Array<Periode> | undefined = _.cloneDeep(perioder)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      newPerioder.push(__newPeriode)
      newPerioder = newPerioder.sort(periodeSort)
      dispatch(updateReplySed(target, newPerioder))
      standardLogger('svarsed.editor.periode.add', { type: 'perioderSomAnsatt' })
      onCloseNew()
      if(onPerioderEdited) onPerioderEdited()
    }
  }

  const onRemoveFromArbeidsgiver = (deletedArbeidsgiver: PeriodeMedForsikring) => {
    onRemove(deletedArbeidsgiver)
  }

  const onAddNewFromArbeidsgiver = (selectedArbeidsgiver: PeriodeMedForsikring) => {
    const newPeriode = selectedArbeidsgiver.sluttdato
      ? {
          startdato: selectedArbeidsgiver.startdato,
          sluttdato: selectedArbeidsgiver.sluttdato
        }
      : {
          startdato: selectedArbeidsgiver.startdato,
          aapenPeriodeType: selectedArbeidsgiver.aapenPeriodeType
        }
    onAddNew(newPeriode)
  }

  const onArbeidsgiverSelect = (arbeidsgiver: PeriodeMedForsikring, checked: boolean) => {
    if (checked) {
      onAddNewFromArbeidsgiver(arbeidsgiver)
    } else {
      onRemoveFromArbeidsgiver(arbeidsgiver)
    }
  }

  const onArbeidsgiverEdit = (newArbeidsgiver: ForsikringPeriode, oldArbeidsgiver: ForsikringPeriode) => {
    // if selected, let's find the same period.
    const selectedIndex: number | undefined = _.findIndex(perioder, p => p.startdato === oldArbeidsgiver.startdato && p.sluttdato === oldArbeidsgiver.sluttdato)

    if (selectedIndex !== undefined && selectedIndex >= 0) {
      onSaveEdit({
        startdato: newArbeidsgiver.startdato,
        sluttdato: newArbeidsgiver.sluttdato,
        aapenPeriodeType: newArbeidsgiver.aapenPeriodeType
      }, selectedIndex)
    }

    // this is the index of this arbeidsgiver in the arbeidsperioder?.arbeidsperioder list
    // it is stored in __type, as the __index is already busy with the one above
    const changedArbeidsgiverIndex: number = parseInt(newArbeidsgiver.__type!)

    const newArbeidsperioder: Array<ArbeidsperiodeFraAA> | undefined = _.cloneDeep(arbeidsperioder?.arbeidsperioder) as Array<ArbeidsperiodeFraAA>
    newArbeidsperioder[changedArbeidsgiverIndex].fraDato = newArbeidsgiver.startdato
    newArbeidsperioder[changedArbeidsgiverIndex].tilDato = newArbeidsgiver.sluttdato
    dispatch(updateArbeidsperioder({
      ...arbeidsperioder,
      arbeidsperioder: newArbeidsperioder
    }))
  }

  const renderPlan = (item: PlanItem<Periode | ForsikringPeriode>, index: number, previousItem: PlanItem<Periode | ForsikringPeriode> | undefined) => {
    return (
      <div key={getId(item)}>
        {renderPlanItem(item)}
      </div>
    )
  }

  const renderPlanItem = (item: PlanItem<Periode | PeriodeMedForsikring> | null) => {
    if (item === null) {
      return renderRowPeriode(null)
    }
    if (item.type === 'periode') {
      return renderRowPeriode(item.item as Periode)
    }
    if (item.type === 'forsikringPeriode') {
      return renderRowArbeidsperiode(item.item as PeriodeMedForsikring)
    }
  }

  const doResetValidation = (namespace: string) => dispatch(resetValidation(namespace))
  const doSetValidation = (validation: Validation) => dispatch(setValidation(validation))

  const renderRowArbeidsperiode = (periode: PeriodeMedForsikring) => {
    // periode.__type! is the index for arbeidsperiode list, periode.__index! is index for perioderMedAnsatt list
    const _namespace = namespace + '-' +
      (periode.__type ? 'AA' + getIdx(periode.__type) : '') +
      (periode.__index ? 'periode' + getIdx(periode.__index) : '')

    return (
      <ForsikringPeriodeBox
        forsikringPeriode={periode}
        allowEdit
        icon={<Buildings3Icon width='20' height='20' />}
        editable='only_period'
        showArbeidsgiver
        showAddress={false}
        selectable
        onForsikringPeriodeSelect={onArbeidsgiverSelect}
        onForsikringPeriodeEdit={onArbeidsgiverEdit}
        namespace={_namespace}
        validation={validation}
        resetValidation={doResetValidation}
        setValidation={doSetValidation}
      />
    )
  }

  const renderRowPeriode = (p: Periode | null) => {
    const index: number = p ? p.__index! : -1
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _periode = index < 0 ? _newPeriode : (inEditMode ? _editPeriode : p)

    return (
      <RepeatableBox
        padding="2"
        id={'repeatablerow-' + _namespace}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <HStack gap="4" wrap={false}>
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
                value={_periode}
              />
              )
            : (
                <PeriodeText
                  error={{
                    startdato: _v[_namespace + '-startdato']?.feilmelding,
                    sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                  }}
                  namespace={_namespace}
                  periode={_periode}
                />
              )
          }
          <Spacer/>
          <div className="navds-button--small"/> {/* Prevent height flicker on hover */}
          <AddRemovePanel<Periode>
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
        </HStack>
      </RepeatableBox>
    )
  }

  return (
    <VStack gap="4">
      <BodyLong>
        {t('label:hent-perioder-fra-aa-registeret-og-a-inntekt')}
      </BodyLong>
      <ArbeidsperioderSøk
        amplitude='svarsed.editor.personensstatus.ansatt.arbeidsgiver.search'
        fnr={fnr}
        fillOutFnr={() => {
          document.dispatchEvent(new CustomEvent('feillenke', {
            detail: {
              skjemaelementId: `MainForm-${personID}-personopplysninger-norskpin`,
              feilmelding: ''
            } as ErrorElement
          }))
        }}
        namespace={namespace}
      />
      {_.isEmpty(_plan)
        ? (
          <Box>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-periods')}
            </BodyLong>
            <SpacedHr />
          </Box>
          )
        : (
          <VStack gap="4">
            {_plan?.map((item, index) => renderPlan(item, index, (index > 0 ? _plan![index - 1] : undefined)))}
          </VStack>
          )}
      {_newForm
        ? renderPlanItem(null)
        : (
          <Box>
            <Button
              variant='tertiary'
              size="small"
              onClick={() => _setNewForm(true)}
              icon={<PlusCircleIcon/>}
            >
              {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
            </Button>
          </Box>
          )}
    </VStack>
  )
}

export default Ansatt
