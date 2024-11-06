import {BodyLong, Box, Button, Heading, HStack, Label, Spacer, VStack} from '@navikt/ds-react'
import React, {useState} from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import {setReplySed} from "../../../actions/svarsed";
import Utdanning from "../Utdanning/Utdanning";
import PeriodeInput from "../../../components/Forms/PeriodeInput";
import _ from "lodash";
import {PlusCircleIcon} from "@navikt/aksel-icons";
import {Periode} from "../../../declarations/sed";
import {useTranslation} from "react-i18next";
import {getIdx} from "../../../utils/namespace";
import {RepeatableBox} from "../../../components/StyledComponents";
import classNames from "classnames";
import PeriodeText from "../../../components/Forms/PeriodeText";
import AddRemovePanel from "../../../components/AddRemovePanel/AddRemovePanel";
import {periodeSort} from "../../../utils/sort";
import {useAppDispatch, useAppSelector} from "../../../store";
import {resetValidation, setValidation} from "../../../actions/validation";
import useLocalValidation from "../../../hooks/useLocalValidation";
import {validatePeriode, ValidationPeriodeProps} from "./validation";
import {State} from "../../../declarations/reducers";
import performValidation from "../../../utils/performValidation";
import {Validation} from "../../../declarations/types";
import {hasNamespaceWithErrors} from "../../../utils/validation";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const SvarOmFremmoeteUtdanning: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed,
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: MainFormSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const namespace = `${parentNamespace}-svaromfremmoeteutdanning`
  const target = 'anmodningOmMerInformasjon.svar'
  const deltakelsePaaUtdanning: Array<Periode> = _.get(replySed, target + '.deltakelsePaaUtdanning')
  const getPeriodeId = (p: Periode | null): string => p ? p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType) : 'new-peridoe'

  const [_newPeriode, _setNewPeriode] = useState<Periode | undefined>(undefined)
  const [_editPeriode, _setEditPeriode] = useState<Periode | undefined>(undefined)

  const [_newPeriodeForm, _setNewPeriodeForm] = useState<boolean>(false)
  const [_editPeriodeIndex, _setEditPeriodeIndex] = useState<number | undefined>(undefined)

  const [_validationPeriode, _resetValidationPeriode, _performValidationPeriode] = useLocalValidation<ValidationPeriodeProps>(validatePeriode, namespace + '-deltakelse-paa-utdanning')

  const addPeriode = () => {
    dispatch(resetValidation(namespace + '-deltakelse-paa-utdanning'))
    _setNewPeriodeForm(true)
  }

  const onClosePeriodeNew = () => {
    _setNewPeriode(undefined)
    _setNewPeriodeForm(false)
    _resetValidationPeriode()
  }

  const onClosePeriodeEdit = (namespace: string) => {
    _setEditPeriode(undefined)
    _setEditPeriodeIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onStartPeriodeEdit = (periode: Periode, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editPeriodeIndex !== undefined) {
      dispatch(resetValidation(namespace + '-deltakelse-paa-utdanning' + getIdx(_editPeriodeIndex)))
    }
    _setEditPeriode(periode)
    _setEditPeriodeIndex(index)
  }

  const onAddPeriodeNew = () => {
    const valid: boolean = _performValidationPeriode({
      periode: _newPeriode,
      perioder: deltakelsePaaUtdanning
    })

    console.log(_validationPeriode)

    if (!!_newPeriode && valid) {
      let newPerioder: Array<Periode> | undefined = _.cloneDeep(deltakelsePaaUtdanning)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      newPerioder.push(_newPeriode)
      newPerioder = newPerioder.sort(periodeSort)
      dispatch(updateReplySed(`${target}.deltakelsePaaUtdanning`, newPerioder))
      onClosePeriodeNew()
    }
  }

  const onSavePeriodeEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationPeriodeProps>(
      clonedValidation, namespace + '-deltakelse-paa-utdanning', validatePeriode, {
        periode: _editPeriode,
        perioder: deltakelsePaaUtdanning,
        index: _editPeriodeIndex
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${target}.deltakelsePaaUtdanning[${_editPeriodeIndex}]`, _editPeriode))
      onClosePeriodeEdit(namespace + '-deltakelse-paa-utdanning' + getIdx(_editPeriodeIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemovePeriode = (removed: Periode) => {
    const newPerioder: Array<Periode> = _.reject(deltakelsePaaUtdanning, (p: Periode) => _.isEqual(removed, p))
    dispatch(updateReplySed(`${target}.deltakelsePaaUtdanning`, newPerioder))
  }

  const setPeriode = (periode: Periode, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      _resetValidationPeriode(namespace + '-deltakelse-paa-utdanning')
      return
    }
    _setEditPeriode(periode)
    dispatch(resetValidation(namespace + '-deltakelse-paa-utdanning' + getIdx(index)))
  }


  const renderPeriodeRow = (periode: Periode | null, index: number) => {
    const _namespace = namespace + '-deltakelse-paa-utdanning' + getIdx(index)
    const _v: Validation = index < 0 ? _validationPeriode : validation
    const inEditMode = index < 0 || _editPeriodeIndex === index
    const _periode = index < 0 ? _newPeriode : (inEditMode ? _editPeriode : periode)

    return (
      <RepeatableBox
        id={'repeatablerow-' + _namespace}
        key={getPeriodeId(periode)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
        padding="4"
      >
        {inEditMode ?
          (
            <HStack gap="4">
              <PeriodeInput
                namespace={_namespace}
                error={{
                  startdato: _v[_namespace + '-startdato']?.feilmelding,
                  sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                }}
                hideLabel={index >= 0}
                setPeriode={(p: Periode) => setPeriode(p, index)}
                value={_periode}
              />
              <AddRemovePanel<Periode>
                item={periode}
                marginTop={false}
                index={index}
                inEditMode={inEditMode}
                onRemove={onRemovePeriode}
                onAddNew={onAddPeriodeNew}
                onCancelNew={onClosePeriodeNew}
                onStartEdit={onStartPeriodeEdit}
                onConfirmEdit={onSavePeriodeEdit}
                onCancelEdit={() => onClosePeriodeEdit(_namespace)}
              />
            </HStack>
          ) :
          (
            <HStack gap="4">
              <PeriodeText
                error={{
                  startdato: _v[_namespace + '-startdato']?.feilmelding,
                  sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                }}
                namespace={_namespace}
                periode={_periode}
              />
              <Spacer/>
              <AddRemovePanel<Periode>
                item={periode}
                marginTop={false}
                index={index}
                inEditMode={inEditMode}
                onRemove={onRemovePeriode}
                onAddNew={onAddPeriodeNew}
                onCancelNew={onClosePeriodeNew}
                onStartEdit={onStartPeriodeEdit}
                onConfirmEdit={onSavePeriodeEdit}
                onCancelEdit={() => onClosePeriodeEdit(_namespace)}
              />
            </HStack>
          )
        }
      </RepeatableBox>
    )
  }

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
          <Utdanning replySed={replySed} setReplySed={setReplySed} parentNamespace={namespace} parentTarget={target} updateReplySed={updateReplySed}/>
        </Box>
        <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
          <Label>{t('label:deltakelse-paa-utdanning')}</Label>
          {_.isEmpty(deltakelsePaaUtdanning)
            ? (
              <BodyLong>
                {t('message:warning-no-periods')}
              </BodyLong>
            )
            : deltakelsePaaUtdanning?.map(renderPeriodeRow)}
          {_newPeriodeForm
            ? renderPeriodeRow(null, -1)
            : (
              <Button
                variant='tertiary'
                onClick={addPeriode}
                icon={<PlusCircleIcon/>}
              >
                {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
              </Button>
            )}
        </Box>
      </VStack>
    </Box>
  )
}

export default SvarOmFremmoeteUtdanning
