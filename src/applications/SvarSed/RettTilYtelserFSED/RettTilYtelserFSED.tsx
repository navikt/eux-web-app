import {BodyLong, Button, Heading} from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  FlexRadioPanels,
  PaddedDiv, PaddedVerticallyDiv,
  RadioPanel,
  RadioPanelGroup,
  Row,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import {resetValidation, setValidation} from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { State } from 'declarations/reducers'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import {JaNei, Periode} from 'declarations/sed'
import {PlusCircleIcon} from "@navikt/aksel-icons";
import styled from "styled-components";
import {getIdx} from "../../../utils/namespace";
import {Validation} from "../../../declarations/types";
import {RepeatablePeriodeRow, TextAreaDiv} from "../../../components/StyledComponents";
import classNames from "classnames";
import {hasNamespaceWithErrors} from "../../../utils/validation";
import PeriodeInput from "../../../components/Forms/PeriodeInput";
import PeriodeText from "../../../components/Forms/PeriodeText";
import AddRemovePanel from "../../../components/AddRemovePanel/AddRemovePanel";
import useLocalValidation from "../../../hooks/useLocalValidation";

import {
  validateFamilieYtelsePeriode, validateTrygdeOrdninger,
  ValidationFamilieYtelsePeriodeProps,
  ValidationTrygdeOrdningerProps
} from "./validation";
import {periodeSort} from "../../../utils/sort";
import ErrorLabel from "../../../components/Forms/ErrorLabel";
import TextArea from "../../../components/Forms/TextArea";
import {isF026Sed} from "../../../utils/sed";

const GreyBoxWithBorder = styled.div`
  background-color: var(--a-surface-subtle);
  border: 1px solid var(--a-border-default);
  padding: 0 1rem;

  &.error {
    background-color: rgba(255, 0, 0, 0.2);
  };
`

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const RettTilYtelserFSED: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed,
  //setReplySed
}: MainFormProps): JSX.Element => {
  const namespace = `${parentNamespace}-${personID}-retttilytelserfsed`
  const target = `${personID}`
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const perioderMedYtelser: Array<Periode> | undefined = _.get(replySed, `${target}.perioderMedYtelser`)
  const ikkeRettTilYtelser: any | undefined = _.get(replySed, `${target}.ikkeRettTilYtelser`)
  const getPeriodeId = (p: Periode | null): string => p ? p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType) : 'new-periode'

  const [_newPeriode, _setNewPeriode] = useState<Periode | undefined>(undefined)
  const [_editPeriode, _setEditPeriode] = useState<Periode | undefined>(undefined)


  const [_rettTilFamilieYtelser, _setRettTilFamilieYtelser] = useState<string>("")
  const [_newPeriodeForm, _setNewPeriodeForm] = useState<boolean>(false)
  const [_editPeriodeIndex, _setEditPeriodeIndex] = useState<number | undefined>(undefined)

  const [_validationPeriode, _resetValidationPeriode, _performValidationPeriode] = useLocalValidation<ValidationFamilieYtelsePeriodeProps>(validateFamilieYtelsePeriode, namespace)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationTrygdeOrdningerProps>(
      clonedValidation, namespace, validateTrygdeOrdninger, {
        perioderMedYtelser,
        ikkeRettTilYtelser,
        rettTilFamilieYtelser: _rettTilFamilieYtelser,
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  useEffect(() => {
    if(perioderMedYtelser && perioderMedYtelser.length >= 0){
      dispatch(updateReplySed(`${target}.ikkeRettTilYtelser`, undefined))
      _setRettTilFamilieYtelser("ja")
    } else if(ikkeRettTilYtelser){
      dispatch(updateReplySed(`${target}.perioderMedYtelser`, undefined))
      _setRettTilFamilieYtelser("nei")
    }
  }, [])

  const setRettTilFamilieYtelser = (value: string) => {
    if(value === "ja"){
      dispatch(updateReplySed(`${target}.ikkeRettTilYtelser`, undefined))
      dispatch(updateReplySed(`${target}.perioderMedYtelser`, []))
    } else {
      dispatch(updateReplySed(`${target}.perioderMedYtelser`, undefined))
      dispatch(updateReplySed(`${target}.ikkeRettTilYtelser`, {}))
    }
    _setRettTilFamilieYtelser(value)
  }
  const setTypeGrunnAnnen = (value: string) => {
    dispatch(updateReplySed(`${target}.ikkeRettTilYtelser.typeGrunnAnnen`, value))
  }

  const setIkkeRettTilFamilieYtelser = (value: string) => {
    dispatch(resetValidation(namespace + '-ikkeRettTilYtelser'))
    dispatch(updateReplySed(`${target}.ikkeRettTilYtelser.typeGrunnForVedtak`, value))
    if(value !== "annen_grunn"){
      dispatch(updateReplySed(`${target}.ikkeRettTilYtelser.typeGrunnAnnen`, undefined))
    }
  }

  const setPeriode = (periode: Periode, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      _resetValidationPeriode(namespace + '-perioderMedYtelser')
      return
    }
    _setEditPeriode(periode)
    dispatch(resetValidation(namespace + '-perioderMedYtelser' + getIdx(index)))
  }

  const onAddPeriodeNew = () => {
    const valid: boolean = _performValidationPeriode({
      periode: _newPeriode,
      perioder: perioderMedYtelser,
      personName
    })
    dispatch(resetValidation(namespace + '-perioderMedYtelser'))

    if (!!_newPeriode && valid) {
      let newPerioder: Array<Periode> | undefined = _.cloneDeep(perioderMedYtelser)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      newPerioder.push(_newPeriode)
      newPerioder = newPerioder.sort(periodeSort)
      dispatch(updateReplySed(`${target}.perioderMedYtelser`, newPerioder))
      onClosePeriodeNew()
    }
  }

  const onSavePeriodeEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationFamilieYtelsePeriodeProps>(
      clonedValidation, namespace, validateFamilieYtelsePeriode, {
        periode: _editPeriode,
        perioder: perioderMedYtelser,
        index: _editPeriodeIndex,
        personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${target}.perioderMedYtelser[${_editPeriodeIndex}]`, _editPeriode))
      onClosePeriodeEdit(namespace + '-perioderMedYtelser' + getIdx(_editPeriodeIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onClosePeriodeNew = () => {
    _setNewPeriode(undefined)
    _setNewPeriodeForm(false)
    _resetValidationPeriode()
  }

  const onRemovePeriode = (removed: Periode) => {
    const newPerioder: Array<Periode> = _.reject(perioderMedYtelser, (p: Periode) => _.isEqual(removed, p))
    dispatch(updateReplySed(`${target}.perioderMedYtelser`, newPerioder))
  }

  const onStartPeriodeEdit = (periode: Periode, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editPeriodeIndex !== undefined) {
      dispatch(resetValidation(namespace + '-perioderMedYtelser' + getIdx(_editPeriodeIndex)))
    }
    _setEditPeriode(periode)
    _setEditPeriodeIndex(index)
  }

  const onClosePeriodeEdit = (namespace: string) => {
    _setEditPeriode(undefined)
    _setEditPeriodeIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const addTrygdeordningPeriode = () => {
    dispatch(resetValidation(namespace + '-perioderMedYtelser'))
    _setNewPeriodeForm(true)
  }

  const renderPeriodeRow = (periode: Periode | null, index: number) => {
    const _namespace = namespace + '-perioderMedYtelser' + getIdx(index)
    const _v: Validation = index < 0 ? _validationPeriode : validation
    const inEditMode = index < 0 || _editPeriodeIndex === index
    const _periode = index < 0 ? _newPeriode : (inEditMode ? _editPeriode : periode)
    return (
      <RepeatablePeriodeRow
        id={'repeatablerow-' + _namespace}
        key={getPeriodeId(periode)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <AlignStartRow>
          {inEditMode
            ? (
              <PeriodeInput
                namespace={_namespace}
                error={{
                  startdato: _v[_namespace + '-startdato']?.feilmelding,
                  sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                }}
                breakInTwo
                hideLabel={index >= 0}
                setPeriode={(p: Periode) => setPeriode(p, index)}
                value={_periode}
              />
            )
            : (
              <Column>
                <PeriodeText
                  error={{
                    startdato: _v[_namespace + '-startdato']?.feilmelding,
                    sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                  }}
                  namespace={_namespace}
                  periode={_periode}
                />
              </Column>
            )}
          <AlignEndColumn>
            <AddRemovePanel<Periode>
              item={periode}
              marginTop={index < 0}
              index={index}
              inEditMode={inEditMode}
              onRemove={onRemovePeriode}
              onAddNew={onAddPeriodeNew}
              onCancelNew={onClosePeriodeNew}
              onStartEdit={onStartPeriodeEdit}
              onConfirmEdit={onSavePeriodeEdit}
              onCancelEdit={() => onClosePeriodeEdit(_namespace)}
            />
          </AlignEndColumn>
        </AlignStartRow>
      </RepeatablePeriodeRow>
    )
  }

  return (
    <>
      <PaddedDiv>
        <Heading size='small'>
          Rett til ytelser
        </Heading>
        <VerticalSeparatorDiv size='2' />
        <Row>
          <Column flex='2'>
            <RadioPanelGroup
              value={_rettTilFamilieYtelser}
              data-no-border
              data-testid={namespace + '-rettTilFamilieYtelser'}
              error={validation[namespace + '-rettTilFamilieYtelser']?.feilmelding}
              id={namespace + '-rettTilFamilieYtelser'}
              legend={t('label:rett-til-familieytelser')}
              name={namespace + '-rettTilFamilieYtelser'}
              onChange={(e: string) => setRettTilFamilieYtelser(e as JaNei)}
            >
              <FlexRadioPanels>
                <RadioPanel value='ja'>{t('label:ja')}</RadioPanel>
                <RadioPanel value='nei'>{t('label:nei')}</RadioPanel>
              </FlexRadioPanels>
            </RadioPanelGroup>
          </Column>
          <Column />
        </Row>
        <VerticalSeparatorDiv />
        {_rettTilFamilieYtelser && _rettTilFamilieYtelser === "ja" &&
          <>
          <GreyBoxWithBorder
            id={namespace + '-perioderMedYtelser'}
            className={classNames({
              error: hasNamespaceWithErrors(validation, namespace + "-perioderMedYtelser")
            })}
          >
            {_.isEmpty(perioderMedYtelser)
              ? (
                <PaddedVerticallyDiv>
                  <BodyLong>
                    {t('message:warning-no-periods')}
                  </BodyLong>
                </PaddedVerticallyDiv>
              )
              : perioderMedYtelser?.map(renderPeriodeRow)}
            {_newPeriodeForm
              ? renderPeriodeRow(null, -1)
              : (
                <Button
                  variant='tertiary'
                  onClick={addTrygdeordningPeriode}
                  icon={<PlusCircleIcon/>}
                >
                  {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
                </Button>
              )}
            <VerticalSeparatorDiv/>
          </GreyBoxWithBorder>
          {validation[namespace + '-perioderMedYtelser']?.feilmelding &&
            <ErrorLabel error={validation[namespace + '-perioderMedYtelser']?.feilmelding}/>
          }
          </>
        }
        {_rettTilFamilieYtelser && _rettTilFamilieYtelser === "nei" &&
          <>
          <Row>
            <Column flex='2'>
              <RadioPanelGroup
                value={ikkeRettTilYtelser?.typeGrunnForVedtak}
                data-no-border
                data-testid={namespace + '-ikkeRettTilYtelser'}
                error={validation[namespace + '-ikkeRettTilYtelser']?.feilmelding}
                id={namespace + '-ikkeRettTilYtelser'}
                legend={t('label:begrunnelse-for-manglende-rettigheter')}
                name={namespace + '-ikkeRettTilYtelser'}
                onChange={setIkkeRettTilFamilieYtelser}
              >
                <FlexRadioPanels>
                  {isF026Sed(replySed) && <RadioPanel value='krav_ikke_framsatt'>{t('label:krav-ikke-framsatt')}</RadioPanel>}
                  <RadioPanel value='for_høy_inntekt'>{t('label:for-hoy-inntekt')}</RadioPanel>
                  <RadioPanel value='annen_grunn'>{t('label:annet')}</RadioPanel>
                </FlexRadioPanels>
              </RadioPanelGroup>
            </Column>
            <Column/>
          </Row>
          <Row>
            <Column>
              {ikkeRettTilYtelser?.typeGrunnForVedtak === "annen_grunn" &&
                <TextAreaDiv>
                  <TextArea
                    id={"ikkeRettTilYtelser-typeGrunnAnnen"}
                    error={validation[namespace + '-ikkeRettTilYtelser-typeGrunnAnnen']?.feilmelding}
                    namespace={namespace}
                    label={t("label:begrunnelse")}
                    onChanged={setTypeGrunnAnnen}
                    value={ikkeRettTilYtelser?.typeGrunnAnnen ?? ''}
                  />
                </TextAreaDiv>
              }
            </Column>
          </Row>
          </>
        }
      </PaddedDiv>
    </>
  )
}

export default RettTilYtelserFSED
