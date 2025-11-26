import {BodyLong, Box, Button, Heading, HGrid, HStack, Label, Spacer, VStack} from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import {validateRefusjon, validateRefusjonsKrav, ValidationRefusjonProps, ValidationRefusjonsKravProps} from 'applications/SvarSed/KravOmRefusjon/validation'
import { MainFormProps, MainFormSelector, mapState } from 'applications/SvarSed/MainForm'
import {F002Sed, Refusjon, RefusjonsKrav, ReplySed} from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, {useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import {ArrowRightLeftIcon, PlusCircleIcon} from "@navikt/aksel-icons";
import Input from "../../../components/Forms/Input";
import CountrySelect from "@navikt/landvelger";
import {Currency} from "@navikt/land-verktoy";
import {Validation} from "../../../declarations/types";
import {getIdx} from "../../../utils/namespace";
import useLocalValidation from "../../../hooks/useLocalValidation";
import AddRemove from "../../../components/AddRemovePanel/AddRemove";
import classNames from "classnames";
import {hasNamespaceWithErrors} from "../../../utils/validation";
import PeriodeInput from "../../../components/Forms/PeriodeInput";
import styles from "./Refusjon.module.css";
import {periodeSort} from "../../../utils/sort";
import PeriodeText from "../../../components/Forms/PeriodeText";
import TextArea from "../../../components/Forms/TextArea";
import TransferBeloepToTotalModal from "../Motregninger/TransferBeloepToTotalModal/TransferBeloepToTotalModal";
import performValidation from "../../../utils/performValidation";
import ErrorLabel from "../../../components/Forms/ErrorLabel";

const RefusjonFC: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  personName,
  updateReplySed,
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: MainFormSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target = 'refusjon'
  const refusjon: Refusjon | undefined = _.get((replySed as F002Sed), target)
  const namespace = `${parentNamespace}-refusjon`

  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationRefusjonsKravProps>(validateRefusjonsKrav, namespace)

  const [_newRefusjonsKrav, _setNewRefusjonsKrav] = useState<RefusjonsKrav | undefined>(undefined)
  const [_editRefusjonsKrav, _setEditRefusjonsKrav] = useState<RefusjonsKrav | undefined>(undefined)

  const [_newRefusjonsKravForm, _setNewRefusjonsKravForm] = useState<boolean>(false)
  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_showTransferBeloepToTotalModal, _setShowTransferBeloepToTotalModal] = useState<boolean>(false)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationRefusjonProps>(
      clonedValidation, namespace, validateRefusjon, {
        replySed: _.cloneDeep(replySed as ReplySed),
        formalName: personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const setRefusjonProp = (prop: string, value: string | undefined) => {
    dispatch(updateReplySed("refusjon." + prop, value))
    dispatch(resetValidation(namespace + '-' + prop))
  }

  const setPeriode = (refusjonsKrav: RefusjonsKrav, index: number) => {
    if (index < 0) {
      _setNewRefusjonsKrav(refusjonsKrav)
      _resetValidation([namespace + '-startdato', namespace + '-sluttdato'])
      return
    }
    _setEditRefusjonsKrav(refusjonsKrav)
    dispatch(resetValidation([
      namespace + '[' + index + ']-startdato',
      namespace + '[' + index + ']-sluttdato'
    ]))
  }

  const setRefusjonsKravProp = (prop: string, value: string, index: number) => {
    if (index < 0) {
      _setNewRefusjonsKrav({
        ..._newRefusjonsKrav,
        [prop]: value.trim()
      } as RefusjonsKrav)
      _resetValidation(namespace + '-' + prop)
      return
    }
    _setEditRefusjonsKrav({
      ..._editRefusjonsKrav,
      [prop]: value.trim()
    } as RefusjonsKrav)
    dispatch(resetValidation(namespace + '[' + index + ']-' + prop))
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      refusjonsKrav: _newRefusjonsKrav,
      formalName: personName
    })

    if (!!_newRefusjonsKrav && valid) {
      let clonedNewRefusjonsKrav = _.cloneDeep(_newRefusjonsKrav)
      let newKravliste: Array<RefusjonsKrav> = _.cloneDeep(refusjon?.kravListe)
      if (_.isNil(newKravliste)) {
        newKravliste = []
      }

      newKravliste.push(clonedNewRefusjonsKrav)
      newKravliste = newKravliste.sort(periodeSort)

      dispatch(updateReplySed("refusjon.kravListe", newKravliste))
      onCloseNew()
    }
  }

  const onCloseNew = () => {
    _setNewRefusjonsKrav(undefined)
    _setNewRefusjonsKravForm(false)
    _resetValidation()
  }

  const onRemove = (index: number) => {
    let newKravliste: Array<RefusjonsKrav> | undefined = _.cloneDeep(refusjon?.kravListe)
    if (!_.isNil(newKravliste)) {
      newKravliste.splice(index, 1)
      dispatch(updateReplySed("refusjon.kravListe", newKravliste))
    }
    if(_.isNil(newKravliste) || newKravliste.length === 0) {
      setRefusjonProp("totalbeloep", undefined)
      setRefusjonProp("valuta", undefined)
      setRefusjonProp("betalingsreferanse", undefined)
      setRefusjonProp("melding", undefined)
    }
  }

  const onStartEdit = (refusjonsKrav: RefusjonsKrav, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + _editIndex))
    }
    _setEditRefusjonsKrav(refusjonsKrav)
    _setEditIndex(index)
  }

  const onCloseEdit = (namespace: string) => {
    _setEditRefusjonsKrav(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onSaveEdit = (index: number) => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationRefusjonsKravProps>(
      clonedValidation, namespace, validateRefusjonsKrav, {
        refusjonsKrav: _editRefusjonsKrav,
        nsIndex: _editIndex,
        formalName: personName
      })

    if (!!_editRefusjonsKrav && !hasErrors) {
      const newEditRefusjonsKrav = _.cloneDeep(_editRefusjonsKrav)
      let newKravliste: Array<RefusjonsKrav> | undefined = _.cloneDeep(refusjon?.kravListe)
      if (_.isNil(newKravliste)) {
        newKravliste = []
      }

      newKravliste.splice(index, 1, newEditRefusjonsKrav)
      newKravliste = newKravliste.sort(periodeSort)

      dispatch(updateReplySed("refusjon.kravListe", newKravliste))
      onCloseEdit(namespace)
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }


  const renderTotalBeloep = () => {
    return (
      <Box borderWidth="1" borderColor="border-subtle" padding="4">
        <VStack gap="4">
          <HGrid columns={2} gap="4" align="start">
            <Input
              error={validation[namespace + '-totalbeloep']?.feilmelding}
              id= {'totalbeloep'}
              label={t('label:totalbeloep')}
              namespace={namespace}
              onChanged={(value: string) => setRefusjonProp("totalbeloep", value)}
              value={refusjon?.totalbeloep || ''}
            />
            <CountrySelect
              ariaLabel={t('label:valuta')}
              closeMenuOnSelect
              error={validation[namespace + '-valuta']?.feilmelding}
              id={namespace + '-valuta'}
              label={t('label:valuta')}
              locale='nb'
              menuPortalTarget={document.body}
              onOptionSelected={(currency: Currency) => setRefusjonProp("valuta", currency.value)}
              type='currency'
              values={refusjon?.valuta}
            />
          </HGrid>
          <HGrid columns={2} gap="4" align="start">
            <Input
              error={validation[namespace + '-betalingsreferanse']?.feilmelding}
              id={'betalingsreferanse'}
              label={t('label:betalingsref')}
              namespace={namespace}
              onChanged={(value: string) => setRefusjonProp("betalingsreferanse", value)}
              value={refusjon?.betalingsreferanse || ''}
            />
            <Input
              error={validation[namespace + '-melding']?.feilmelding}
              id={'melding'}
              label={t('label:melding-til-mottaker')}
              namespace={namespace}
              onChanged={(value: string) => setRefusjonProp("melding", value)}
              value={refusjon?.melding || ''}
            />
          </HGrid>
        </VStack>
      </Box>
    )
  }

  const renderRefusjonsKrav = (refusjonskrav: RefusjonsKrav | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _refusjonskrav = index < 0 ? _newRefusjonsKrav : (inEditMode ? _editRefusjonsKrav : refusjonskrav)

    const addRemove = (
      <AddRemove<RefusjonsKrav>
        item={refusjonskrav}
        index={index}
        inEditMode={inEditMode}
        onRemove={()=>onRemove(index)}
        onAddNew={() => onAddNew()}
        onCancelNew={() => onCloseNew()}
        onStartEdit={(item: RefusjonsKrav) => onStartEdit(item, index)}
        onConfirmEdit={()=>onSaveEdit(index)}
        onCancelEdit={() => onCloseEdit(_namespace)}
        labels={{remove: "Fjern krav"}}
      />
    )

    if (inEditMode) {
      return (
        <Box
          padding="4"
          background="surface-subtle"
          borderColor="border-subtle"
          borderWidth="1"
          className={classNames(
            styles.refusjonsKravBox,
            {
              [styles.new]: index < 0,
              [styles.error]: hasNamespaceWithErrors(_v, _namespace),
            }
          )}
        >
          <VStack gap="4">
            <HGrid columns={2} gap="4" align="start">
              <Input
                error={_v[_namespace + '-beloep']?.feilmelding}
                id='beloep'
                label={t('label:beløp')}
                namespace={_namespace}
                required={true}
                onChanged={(value: string) => setRefusjonsKravProp("beloep", value, index)}
                value={_refusjonskrav?.beloep}
              />
              <CountrySelect
                ariaLabel={t('label:valuta')}
                closeMenuOnSelect
                data-testid={_namespace + '-valuta'}
                error={_v[_namespace + '-valuta']?.feilmelding}
                id={_namespace + '-valuta'}
                label={t('label:valuta')}
                locale='nb'
                menuPortalTarget={document.body}
                onOptionSelected={(currency: Currency) => setRefusjonsKravProp("valuta", currency.value, index)}
                type='currency'
                required={true}
                values={_refusjonskrav?.valuta}
              />
            </HGrid>
            <PeriodeInput
              asGrid={true}
              namespace={_namespace}
              error={{
                startdato: _v[_namespace + '-startdato']?.feilmelding,
                sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
              }}
              label={{
                startdato: t('label:startdato') + ' (' + t('label:innvilgelse').toLowerCase() + ')',
                sluttdato: t('label:sluttdato') + ' (' + t('label:innvilgelse').toLowerCase() + ')'
              }}
              hideLabel={false}
              periodeType='simple'
              requiredStartDato
              requiredSluttDato
              setPeriode={(rk: RefusjonsKrav)=> setPeriode(rk, index)}
              value={_refusjonskrav}
            />
            <TextArea
              error={_v[_namespace + '-ytterligereinformasjon']?.feilmelding}
              namespace={_namespace}
              id='ytterligereinformasjon'
              label={t('label:ytterligere-informasjon')}
              onChanged={(value: string) => setRefusjonsKravProp("ytterligereinformasjon", value, index)}
              value={_refusjonskrav?.ytterligereinformasjon}
            />
            <HStack>
              <Spacer/>
              {addRemove}
            </HStack>
          </VStack>
        </Box>
      )
    }

    return (
      <Box padding="4" background="surface-subtle" borderColor="border-subtle" borderWidth="1">
        <VStack gap="4">
          <HGrid columns={3} gap="8" align="start">
            <VStack><Label>{t('label:beløp')}</Label>{_refusjonskrav?.beloep} {_refusjonskrav?.valuta}</VStack>
            <VStack>
              <Label>Periode</Label>
              <PeriodeText
                error={{
                  startdato: _v[_namespace + '-startdato']?.feilmelding,
                  sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                }}
                namespace={_namespace}
                periode={_refusjonskrav}
              />
            </VStack>
            {addRemove}
          </HGrid>
          <VStack>
            <Label>{t('label:ytterligere-informasjon')}</Label>
            {_refusjonskrav?.ytterligereinformasjon}
          </VStack>
        </VStack>
      </Box>
    )
  }

  return (
    <>
      <TransferBeloepToTotalModal
        namespace={namespace}
        title="Overføre til totalbeløp"
        modalOpen={_showTransferBeloepToTotalModal}
        setModalOpen={_setShowTransferBeloepToTotalModal}
        target={target}
        beloepArray={refusjon?.kravListe}
        resetWarning={!!refusjon?.totalbeloep || !!refusjon?.valuta}
      />
      <Box padding="4">
        <VStack gap="4">
          <HStack>
            <Heading size='small'>
              {label}
            </Heading>
            <Spacer/>
            {!_.isEmpty(refusjon?.kravListe) &&
              <Button
                size={"xsmall"}
                variant='tertiary'
                onClick={() => _setShowTransferBeloepToTotalModal(true)}
                icon={<ArrowRightLeftIcon/>}
                disabled={!refusjon?.kravListe || refusjon?.kravListe.length === 0}
              >
                Overfør til totalbeløp
              </Button>
            }
          </HStack>

            {_.isEmpty(refusjon?.kravListe) && !_newRefusjonsKravForm
              ? (
                <>
                  <Box padding="4" borderWidth="1" borderColor="border-subtle" background="bg-subtle">
                    <BodyLong>
                      {t('message:warning-no-refusjonskrav')}
                    </BodyLong>
                  </Box>
                  <ErrorLabel error={validation[namespace + '-refusjon']?.feilmelding}/>
                </>
              )
              : refusjon?.kravListe?.map((rk: RefusjonsKrav, i: number) => {
                return renderRefusjonsKrav(rk, i)
              })
            }
            {_newRefusjonsKravForm
              ? renderRefusjonsKrav(null, -1)
              : (
                <Box>
                  <Button
                    variant='tertiary'
                    size="small"
                    onClick={() => _setNewRefusjonsKravForm(true)}
                    icon={<PlusCircleIcon/>}
                  >
                    {t('el:button-add-new-x2', { x: t('label:refusjonskrav').toLowerCase() })}
                  </Button>
                </Box>
              )}
            {!_.isEmpty(refusjon?.kravListe) && renderTotalBeloep()}
        </VStack>
      </Box>
    </>
  )
}

export default RefusjonFC
