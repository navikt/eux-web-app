import React, {useEffect, useState, useRef} from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import {useAppDispatch, useAppSelector} from "../../../store";
import _ from "lodash";
import {Aktivitet, AktivitetStatus, PensjonPeriode, Periode} from "../../../declarations/sed";
import {Alert, Box, Button, Heading, HStack, Label, Radio, RadioGroup, Spacer, Tabs, VStack} from "@navikt/ds-react";
import {State} from "../../../declarations/reducers";
import {PlusCircleIcon, ArrowRightLeftIcon, PencilIcon} from "@navikt/aksel-icons";
import {useTranslation} from "react-i18next";
import styles from "./AktivitetStatusOgTrygdeperioder.module.css";
import Perioder from "./Perioder/Perioder";
import Ansatt from "./Ansatt/Ansatt";
import TransferPerioderModal from "./TransferPerioderModal/TransferPerioderModal";
import {periodeSort} from "../../../utils/sort";
import AddRemove from "../../../components/AddRemovePanel/AddRemove";
import TextArea from "../../../components/Forms/TextArea";
import {resetValidation} from "../../../actions/validation";
import PerioderMedPensjon from "./PerioderMedPensjon/PerioderMedPensjon";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})


const AktivitetStatusOgTrygdeperioder: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed,
  setReplySed
}: MainFormProps): JSX.Element => {
  const {t} = useTranslation()
  const {validation} = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-aktivitetstatusogtrygdeperioder`

  const targetYtterligereInfo = `${personID}.ytterligereInfo`
  const ytterligereInfo: string | undefined = _.get(replySed, targetYtterligereInfo)

  const targetAktivitetStatuser = `${personID}.aktivitetStatuser`
  const aktivitetStatuser: Array<AktivitetStatus> | undefined = _.get(replySed, targetAktivitetStatuser)
  const prevAktivitetStatuserRef = useRef<Array<AktivitetStatus> | undefined>(undefined);

  const targetTrygdeperioder = `${personID}.trygdeperioder`
  const trygdeperioder: Array<Periode> | undefined = _.get(replySed, targetTrygdeperioder)

  const targetPerioderMedPensjon = `${personID}.perioderMedPensjon`
  const perioderMedPensjon: Array<PensjonPeriode> | undefined = _.get(replySed, targetPerioderMedPensjon)

  const targetPerioderMedRettTilFamilieytelser = `${personID}.perioderMedRettTilFamilieytelser`
  const targetDekkedePerioder = `${personID}.dekkedePerioder`
  const targetUdekkedePerioder = `${personID}.udekkedePerioder`
  const perioderMedRettTilFamilieytelser: Array<Periode> | undefined = _.get(replySed, targetPerioderMedRettTilFamilieytelser)
  const dekkedePerioder: Array<Periode> | undefined = _.get(replySed, targetDekkedePerioder)
  const udekkedePerioder: Array<Periode> | undefined = _.get(replySed, targetUdekkedePerioder)

  const [_showAddStatus, _setShowShowAddStatus] = useState<boolean>(false)
  const [_currentStatus, _setCurrentStatus] = useState<string>("")
  const [_selectedStatus, _setSelectedStatus] = useState<string>("")

  const [_showAddActivityType, _setShowShowAddActivityType] = useState<boolean>(false)
  const [_editActivityIndex, _setEditActivityIndex] = useState<number | undefined>(undefined)
  const [_selectedActivityType, _setSelectedActivityType] = useState<string>("")

  const [_showTransferTrygdePerioderModal, _setShowTransferTrygdePerioderModal] = useState<boolean>(false)
  const [_showTransferPerioderMedPensjonModal, _setShowTransferPerioderMedPensjonModal] = useState<boolean>(false)
  const [_showTransferPerioderMedRettTilFamilieytelserModal, _setShowTransferPerioderMedRettTilFamilieytelserModal] = useState<boolean>(false)

  const [_transferToTrygdeperioderPeriods, _setTransferToTrygdeperioderPeriods] = useState<Array<Periode> | undefined>(undefined)

  const getTransferToTrygdeperioderPeriods = (aktivitetStatuser: Array<AktivitetStatus>) => {
    if(aktivitetStatuser && aktivitetStatuser?.length > 0) {
      const transferToTrygdeperioderPeriods = aktivitetStatuser.map((aktivitetStatus: AktivitetStatus) => {
        return aktivitetStatus.aktiviteter.flatMap(((aktivitet: Aktivitet) => {
          return aktivitet.perioder ? aktivitet.perioder.map((periode: Periode) => {
            return {
              ...periode,
              __type: aktivitetStatus.status
            }
          }) : []
        }))
      })
      return transferToTrygdeperioderPeriods.flat(1).sort(periodeSort)
    }
    return []
  }

  const setYtterligereInfo = (ytterligereInfo: string) => {
    dispatch(updateReplySed(`${targetYtterligereInfo}`, ytterligereInfo))
    if (validation[namespace + '-ytterligereInfo']) {
      dispatch(resetValidation(namespace + '-ytterligereInfo'))
    }
  }

  const addStatus = () => {
    _setShowShowAddStatus(true)
  }

  const addActivityType = () => {
    _setEditActivityIndex(undefined)
    _setSelectedActivityType("")
    _setShowShowAddActivityType(true)
  }

  const removeStatus = (index: number) => {
    const newAktivitetStatuser = aktivitetStatuser ? [...aktivitetStatuser] : []
    newAktivitetStatuser?.splice(index, 1)
    dispatch(updateReplySed(`${targetAktivitetStatuser}`, newAktivitetStatuser))
  }

  const onStatusAdd = (status: string) => {
    let aktiviteter: Array<Aktivitet> = []

    if(status === "ingenInfo"){
      const aktivitet: Aktivitet = {
        perioder: []
      }
      aktiviteter.push(aktivitet)
    }

    const aktivitetStatus: AktivitetStatus = {
      status: status,
      aktiviteter
    }

    const newAktivitetStatuser = aktivitetStatuser ? [...aktivitetStatuser, aktivitetStatus] : [aktivitetStatus]
    dispatch(updateReplySed(`${targetAktivitetStatuser}`, newAktivitetStatuser))
    _setSelectedStatus("")
    _setShowShowAddStatus(false)
  }

  const allStatusesAdded = aktivitetStatuser && aktivitetStatuser.length >= 3 && ['aktiv', 'inaktiv', 'ingenInfo'].every(status => aktivitetStatuser.some(as => as.status === status));
  const hasStatus = (status: string) => {
    return aktivitetStatuser && aktivitetStatuser.some(as => as.status === status);
  }

  const hasOpenPeriods = (periods: Array<Periode> | undefined) => {
    return periods?.find((p) => p.aapenPeriodeType)
  }

  const getInaktivPeriods = (periods: Array<Periode> | undefined) => {
    let inaktivPeriods: Array<Periode> | undefined = periods?.filter((p) => p.__type === "inaktiv")
    return inaktivPeriods ? inaktivPeriods : []
  }

  const onActivityTypeAdd = (activityType: string, statusIdx: number) => {
    const newAktivitetStatuser = aktivitetStatuser ? [...aktivitetStatuser] : []

    const aktivitet: Aktivitet = {
      type: activityType,
      perioder: []
    }

    // Create a deep copy of the specific status to avoid mutation
    const updatedStatus = {
      ...newAktivitetStatuser[statusIdx],
      aktiviteter: [...newAktivitetStatuser[statusIdx].aktiviteter, aktivitet]
    }

    // Create a new array with the updated status
    newAktivitetStatuser[statusIdx] = updatedStatus

    dispatch(updateReplySed(`${targetAktivitetStatuser}`, newAktivitetStatuser))
    _setSelectedActivityType("")
    _setShowShowAddActivityType(false)
  }

  const onActivityTypeChange = (statusIdx: number) => {
    const aktivitetStatuserCopy = _.cloneDeep(aktivitetStatuser)
    const aktivitet = aktivitetStatuserCopy ? aktivitetStatuserCopy[statusIdx].aktiviteter[_editActivityIndex!] : undefined

    if(aktivitet) {
      aktivitet.type = _selectedActivityType
      dispatch(updateReplySed(`${targetAktivitetStatuser}`, aktivitetStatuserCopy))
    }

    _setSelectedActivityType("")
    _setEditActivityIndex(undefined)
    _setShowShowAddActivityType(false)
  }

  const deleteActivity = (statusIdx: number, activityIdx: number) => {
    const aktivitetStatuserCopy = _.cloneDeep(aktivitetStatuser)
    if(aktivitetStatuserCopy) {
      aktivitetStatuserCopy[statusIdx].aktiviteter.splice(activityIdx, 1)
      dispatch(updateReplySed(`${targetAktivitetStatuser}`, aktivitetStatuserCopy))
    }
  }

  const onTabChange = (status: string) => {
    _setSelectedActivityType("")
    _setShowShowAddActivityType(false)
    _setCurrentStatus(status)
  }

  const hasTransferedPeriods = () => {
    return (trygdeperioder && trygdeperioder.length > 0) ||
      (perioderMedPensjon && perioderMedPensjon.length > 0) ||
      (perioderMedRettTilFamilieytelser && perioderMedRettTilFamilieytelser.length > 0) ||
      (dekkedePerioder && dekkedePerioder.length > 0) ||
      (udekkedePerioder && udekkedePerioder.length > 0)
  }

  const resetAllPeriods = () => {
    dispatch(updateReplySed(`${targetTrygdeperioder}`, undefined))
    dispatch(updateReplySed(`${targetPerioderMedPensjon}`, undefined))
    dispatch(updateReplySed(`${targetPerioderMedRettTilFamilieytelser}`, undefined))
    dispatch(updateReplySed(`${targetDekkedePerioder}`, undefined))
    dispatch(updateReplySed(`${targetUdekkedePerioder}`, undefined))
  }

  const getAktivitetTyper = (status: string, hideLegend: boolean = false) => {
    if(status === "aktiv"){
      return (
        <RadioGroup
          legend={t('label:arbeidsforhold-type')}
          hideLegend={hideLegend}
          value={_selectedActivityType}
          error={validation[namespace + '-aktivitet-type']?.feilmelding}
          id={namespace + '-aktivitet-type'}
          name={namespace + '-aktivitet-type'}
          onChange={(value) => _setSelectedActivityType(value)}
        >
          <Radio value='ansatt'>
            {t('el:radio-aktivitet-type-ansatt')}
          </Radio>
          <Radio value='selvstendig_næringsdrivende'>
            {t('el:radio-aktivitet-type-selvstendig-naeringsdrivende')}
          </Radio>
          <Radio value='opphør_aktivitet_sykdom_med_lønn'>
            {t('el:radio-aktivitet-type-mottar-loenn')}
          </Radio>
          <Radio value='permisjon_med_lønnn'>
            {t('el:radio-aktivitet-type-permisjon-med-loenn')}
          </Radio>
          <Radio value='permisjon_uten_lønnn'>
            {t('el:radio-aktivitet-type-permisjon-uten-loenn')}
          </Radio>
        </RadioGroup>

      )
    } else if (status === "inaktiv") {
      return (
        <RadioGroup
          legend={t('label:inaktiv-person')}
          hideLegend={true}
          value={_selectedActivityType}
          error={validation[namespace + '-aktivitet-type']?.feilmelding}
          id={namespace + '-aktivitet-type'}
          name={namespace + '-aktivitet-type'}
          onChange={(value) => _setSelectedActivityType(value)}
        >
          <HStack gap="4">
            <Radio value='inaktiv'>
              {t('el:radio-aktivitet-type-inaktiv')}
            </Radio>
            <Radio value='inaktiv_rett_til_familieytelse'>
              {t('el:radio-aktivitet-type-inaktiv-rett-til-familieytelser')}
            </Radio>
          </HStack>
        </RadioGroup>
      )
    }

  }

  useEffect(() => {
    const prevAktivitetStatuser = prevAktivitetStatuserRef.current;

    if(!aktivitetStatuser || aktivitetStatuser.length === 0) {
      _setShowShowAddStatus(true)
    }

    if(aktivitetStatuser && aktivitetStatuser?.length > 0) {
      _setTransferToTrygdeperioderPeriods(getTransferToTrygdeperioderPeriods(aktivitetStatuser))

      // Only set current status if:
      // 1. There was no previous aktivitetStatuser (first item)
      // 2. Current length is greater than previous length (item was added)
      const statusAdded = !prevAktivitetStatuser || (prevAktivitetStatuser.length < aktivitetStatuser.length);
      if (statusAdded) {
        _setCurrentStatus(aktivitetStatuser[aktivitetStatuser?.length-1].status + '-' + (aktivitetStatuser?.length - 1))
      }
    }

    const statusRemoved = prevAktivitetStatuser && (!aktivitetStatuser || prevAktivitetStatuser.length > aktivitetStatuser.length);
    if(statusRemoved) {
      resetAllPeriods()
      _setCurrentStatus(aktivitetStatuser && aktivitetStatuser.length > 0 ? aktivitetStatuser[0].status + '-0' : "")
    }



    // Store current value as previous for next comparison
    prevAktivitetStatuserRef.current = aktivitetStatuser;
  }, [aktivitetStatuser]);

  return (
    <>
      <TransferPerioderModal
        namespace={namespace}
        title={t('label:overfør-perioder-til', {periodeType: "trygdeperioder"})}
        modalOpen={_showTransferTrygdePerioderModal}
        setModalOpen={_setShowTransferTrygdePerioderModal}
        target={targetTrygdeperioder}
        perioder={_transferToTrygdeperioderPeriods}
        resetPerioder={[targetTrygdeperioder, targetPerioderMedPensjon, targetPerioderMedRettTilFamilieytelser, targetDekkedePerioder, targetUdekkedePerioder]}
        resetWarning={trygdeperioder && trygdeperioder.length > 0}
      />
      <TransferPerioderModal
        namespace={namespace}
        title={t('label:overfør-perioder-til', {periodeType: "perioder med pensjon"})}
        modalOpen={_showTransferPerioderMedPensjonModal}
        setModalOpen={_setShowTransferPerioderMedPensjonModal}
        target={targetPerioderMedPensjon}
        perioder={getInaktivPeriods(trygdeperioder)}
        periodeType="pensjon"
        resetPerioder={[targetPerioderMedPensjon]}
        resetWarning={perioderMedPensjon && perioderMedPensjon.length > 0}
      />
      <TransferPerioderModal
        namespace={namespace}
        title={t('label:overfør-perioder-til', {periodeType: "perioder med rett til familieytelser"})}
        modalOpen={_showTransferPerioderMedRettTilFamilieytelserModal}
        setModalOpen={_setShowTransferPerioderMedRettTilFamilieytelserModal}
        perioder={trygdeperioder}
        target={personID}
        periodeType="dekketUdekket"
        resetPerioder={[targetPerioderMedRettTilFamilieytelser, targetDekkedePerioder, targetUdekkedePerioder]}
        resetWarning={perioderMedRettTilFamilieytelser && perioderMedRettTilFamilieytelser.length > 0}
        closedPeriodsWarning={!!hasOpenPeriods(trygdeperioder)}
      />
      <Box padding="4">
        <VStack gap="4">
          <Box padding="4" borderWidth="1" borderColor="border-subtle" background="surface-subtle">
            <VStack gap="4">
              <Heading size='small'>
                <HStack gap="4" align="center">
                  Aktivitet
                  <Spacer/>
                  <Button
                    size={"xsmall"}
                    variant='tertiary'
                    onClick={() => _setShowTransferTrygdePerioderModal(true)}
                    icon={<ArrowRightLeftIcon/>}
                    disabled={!_transferToTrygdeperioderPeriods || _transferToTrygdeperioderPeriods.length === 0}
                  >
                    {t('label:overfør-perioder-til', {periodeType: "trygdeperioder"})}
                  </Button>
                </HStack>
              </Heading>

              {_showAddStatus &&
                <Box padding="4" borderWidth="1" borderColor="border-subtle" className={styles.statusBoxOpen}>
                  <VStack gap="4">
                    <RadioGroup
                      legend={"Status"}
                      value={_selectedStatus}
                      onChange={(value) => _setSelectedStatus(value)}
                    >
                      <Radio value='aktiv' disabled={hasStatus("aktiv")}>
                        {t('el:radio-aktivitet-status-aktiv')}
                      </Radio>
                      <Radio value='inaktiv' disabled={hasStatus("inaktiv")}>
                        {t('el:radio-aktivitet-status-inaktiv')}
                      </Radio>
                      <Radio value='ingenInfo' disabled={hasStatus("ingenInfo")}>
                        {t('el:radio-aktivitet-status-ingeninfo')}
                      </Radio>
                    </RadioGroup>
                    <HStack gap="4">
                      <Button
                        variant='primary'
                        onClick={() => onStatusAdd(_selectedStatus)}
                        disabled={_selectedStatus === ""}
                      >
                        Legg til status
                      </Button>
                      <Button
                        variant='secondary'
                        onClick={() => {
                          _setSelectedStatus("");
                          _setShowShowAddStatus(false)
                        }}
                        disabled={!aktivitetStatuser || aktivitetStatuser.length === 0}
                      >
                        Lukk
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              }
              <Tabs value={_currentStatus} onChange={(value) => onTabChange(value)}>
                <Tabs.List>
                  <HStack align="center" width="100%">
                    {aktivitetStatuser?.map((aktivitetStatus: AktivitetStatus, idx: number) => {
                      return <Tabs.Tab value={aktivitetStatus.status + '-' + idx} label={t('label:status-'+aktivitetStatus.status)}/>
                    })}
                    <Spacer/>
                    <HStack gap="2">
                      {!allStatusesAdded && !_showAddStatus &&
                      <Button
                        size={"xsmall"}
                        variant='tertiary'
                        onClick={addStatus}
                        icon={<PlusCircleIcon/>}
                      >
                        Legg til status
                      </Button>
                    }
                    </HStack>
                  </HStack>
                </Tabs.List>
                {aktivitetStatuser?.map((aktivitetStatus: AktivitetStatus, idx: number) => {
                  return (
                    <Tabs.Panel value={aktivitetStatus.status + '-' + idx}>
                      <VStack gap="4" marginBlock="4" align="start">
                        <HStack padding="0">
                          <AddRemove<AktivitetStatus>
                            item={aktivitetStatus}
                            index={idx}
                            onRemove={() => removeStatus(idx)}
                            allowEdit={false}
                            labels={{remove: "Fjern status"}}
                            alertOnDelete={hasTransferedPeriods() ? t('message:info-trygdeperioder-maa-overfoeres-paa-nytt') : undefined}
                          />
                          <div className="navds-button--small" style={{minHeight:"2.8rem"}}/> {/* Prevent height flicker on hover */}
                        </HStack>
                        <Box padding="4" background="surface-neutral-moderate" borderWidth="1" borderColor="border-subtle" width="100%">
                          <VStack gap="4">
                            <HStack gap="4">
                              <b>Status:</b>{t('label:status-' + aktivitetStatus.status)}
                              <Spacer/>
                              {aktivitetStatus.status !== "ingenInfo" &&
                                <Button
                                  size={"xsmall"}
                                  variant='tertiary'
                                  onClick={addActivityType}
                                  icon={<PlusCircleIcon/>}
                                >
                                  Legg til aktivitet
                                </Button>
                              }
                            </HStack>

                          </VStack>
                        </Box>
                        {_showAddActivityType && aktivitetStatus.status !== "ingenInfo" &&
                          <Box padding="4" borderWidth="1" borderColor="border-subtle" width="100%" className={styles.statusBoxOpen}>
                            <VStack>
                              {getAktivitetTyper(aktivitetStatus.status)}
                              <HStack gap="4">
                                <Button
                                  variant='primary'
                                  onClick={() => onActivityTypeAdd(_selectedActivityType, idx)}
                                >
                                  Legg til aktivitet
                                </Button>
                                <Button
                                  variant='secondary'
                                  onClick={() => {
                                    _setSelectedActivityType("");
                                    _setShowShowAddActivityType(false)
                                  }}
                                >
                                  Lukk
                                </Button>
                              </HStack>
                            </VStack>
                          </Box>
                        }
                        {aktivitetStatus.aktiviteter.map((aktivitet: Aktivitet, aktivitetIdx: number) => {
                          let title = t('label:perioder-uten-aktivitet')
                          let type
                          let typeLabel
                          if(aktivitetStatus.status === "aktiv"){
                            title = t('label:ansettelsesperioder')
                            typeLabel = "Type arbeidsforhold"
                            type = t('label:aktivitet-type-' + aktivitet.type)
                          }

                          if(aktivitetStatus.status === "inaktiv") {
                            typeLabel = "Type inaktivitet"
                            type = t('label:aktivitet-type-' + aktivitet.type)
                          }

                          return (
                            <VStack width="100%">
                              <HStack paddingBlock="0 1" paddingInline="0">
                                <AddRemove<Aktivitet>
                                  item={aktivitet}
                                  index={idx}
                                  onRemove={() => deleteActivity(idx, aktivitetIdx)}
                                  allowEdit={false}
                                  labels={{remove: "Fjern aktivitet"}}
                                  alertOnDelete={hasTransferedPeriods() ? t('message:info-trygdeperioder-maa-overfoeres-paa-nytt') : undefined}
                                />
                                <div className="navds-button--small" style={{minHeight:"2.8rem"}}/> {/* Prevent height flicker on hover */}
                              </HStack>
                              <Box padding="4" borderWidth="1" borderColor="border-subtle" width="100%">
                                <VStack gap="4" width="100%">
                                  {aktivitetStatus.status !== "ingenInfo" &&
                                    <VStack>
                                      <HStack gap="4" width="100%" align="start">
                                        {typeLabel && <Label>{typeLabel}:</Label>}
                                        <Button
                                          variant='tertiary'
                                          size="xsmall"
                                          onClick={() => {
                                            _setSelectedActivityType(aktivitet.type!)
                                            _setEditActivityIndex(aktivitetIdx)
                                          }}
                                          icon={<PencilIcon/>}
                                        >
                                          Endre
                                        </Button>
                                      </HStack>
                                      {aktivitetIdx !== _editActivityIndex && type}
                                    </VStack>
                                  }
                                  {aktivitetIdx === _editActivityIndex &&
                                    <Box className={styles.statusBoxOpen}>
                                      <VStack>
                                        {getAktivitetTyper(aktivitetStatus.status, true)}
                                        <HStack gap="4">
                                          <Button
                                            variant='primary'
                                            onClick={() => onActivityTypeChange(idx)}
                                          >
                                            Endre type
                                          </Button>
                                          <Button
                                            variant='secondary'
                                            onClick={() => {
                                              _setSelectedActivityType("");
                                              _setEditActivityIndex(undefined)
                                            }}
                                          >
                                            Lukk
                                          </Button>
                                        </HStack>
                                      </VStack>
                                    </Box>
                                  }
                                  <Heading size='xsmall'>
                                    {title}
                                  </Heading>
                                  {aktivitet.type && aktivitet.type === "ansatt" &&
                                    <Ansatt
                                      parentNamespace={namespace + '-' + aktivitet?.type}
                                      parentTarget={"aktivitetStatuser[" + idx + "].aktiviteter[" + aktivitetIdx + "].perioder"}
                                      personID={personID}
                                      personName={personName}
                                      replySed={replySed}
                                      updateReplySed={updateReplySed}
                                      setReplySed={setReplySed}
                                    />
                                  }
                                  {(aktivitetStatus.status === 'aktiv' && aktivitet.type && aktivitet.type !== "ansatt" || aktivitetStatus.status === "inaktiv" || aktivitetStatus.status === "ingenInfo") &&
                                    <Perioder
                                      parentNamespace={namespace + '-' + aktivitet?.type}
                                      parentTarget={"aktivitetStatuser[" + idx + "].aktiviteter[" + aktivitetIdx + "].perioder"}
                                      personID={personID}
                                      personName={personName}
                                      replySed={replySed}
                                      updateReplySed={updateReplySed}
                                      setReplySed={setReplySed}
                                    />
                                  }
                                  {1!==1 &&
                                    <Alert  variant="info" size="small">
                                      Trygdeperioder må overføres på nytt ved endring.
                                    </Alert>
                                  }
                                </VStack>
                              </Box>
                            </VStack>
                          )}
                        )}
                      </VStack>
                    </Tabs.Panel>
                  )
                })}
              </Tabs>
            </VStack>
          </Box>
          <Box padding="4" borderWidth="1" borderColor="border-subtle" background="surface-default">
            <VStack gap="4">
              <Heading size={"small"}>{t('label:ytterligere-informasjon')}</Heading>
              <TextArea
                namespace={namespace}
                error={validation[namespace + '-ytterligereInfo']?.feilmelding}
                id='ytterligereInfo'
                label={t('label:ytterligere-informasjon')}
                hideLabel={true}
                onChanged={setYtterligereInfo}
                value={ytterligereInfo}
              />
            </VStack>
          </Box>
          {hasTransferedPeriods() &&
            <Box padding="4" borderWidth="1" borderColor="border-subtle" background="surface-default">
              <VStack gap="4">
                <Heading size={"small"}>Trygdeperioder</Heading>
                {trygdeperioder && trygdeperioder.length > 0 &&
                  <Box padding="4" borderWidth="1" borderColor="border-subtle">
                    <VStack gap="4">
                      <Heading size='xsmall'>
                        <HStack gap="4" align="center">
                          {t('label:trygdeperioder')}
                          {getInaktivPeriods(trygdeperioder).length === 0 &&
                            <Button
                              size={"xsmall"}
                              variant='tertiary'
                              onClick={() => _setShowTransferPerioderMedRettTilFamilieytelserModal(true)}
                              icon={<ArrowRightLeftIcon/>}
                              disabled={!trygdeperioder || trygdeperioder?.length === 0}
                            >
                              {t('label:overfør-perioder-til', {periodeType: "perioder med rett til familieytelser"})}
                            </Button>
                          }
                        </HStack>
                      </Heading>
                      {getInaktivPeriods(trygdeperioder).length > 0 &&
                        <HStack gap="4" align="center">
                          <Button
                            size={"xsmall"}
                            variant='tertiary'
                            onClick={() => _setShowTransferPerioderMedPensjonModal(true)}
                            icon={<ArrowRightLeftIcon/>}
                          >
                            {t('label:overfør-perioder-til', {periodeType: "perioder med pensjon"})}
                          </Button>
                          <Button
                            size={"xsmall"}
                            variant='tertiary'
                            onClick={() => _setShowTransferPerioderMedRettTilFamilieytelserModal(true)}
                            icon={<ArrowRightLeftIcon/>}
                          >
                            {t('label:overfør-perioder-til', {periodeType: "perioder med rett til familieytelser"})}
                          </Button>
                        </HStack>
                      }
                      <Perioder
                        parentNamespace={namespace + '-trygdeperioder'}
                        parentTarget={"trygdeperioder"}
                        personID={personID}
                        personName={personName}
                        replySed={replySed}
                        updateReplySed={updateReplySed}
                        setReplySed={setReplySed}
                      />
                    </VStack>
                  </Box>
                }
                {perioderMedPensjon && perioderMedPensjon.length > 0 &&
                  <Box padding="4" borderWidth="1" borderColor="border-subtle">
                    <VStack gap="4">
                      <Heading size='xsmall'>
                        {t('label:perioder-med-pensjon')}
                      </Heading>
                      <PerioderMedPensjon
                        parentNamespace={namespace + '-periodermedpensjon'}
                        personID={personID}
                        personName={personName}
                        replySed={replySed}
                        updateReplySed={updateReplySed}
                        setReplySed={setReplySed}
                      />
                    </VStack>
                  </Box>
                }

                {perioderMedRettTilFamilieytelser && perioderMedRettTilFamilieytelser.length > 0 &&
                  <Box padding="4" borderWidth="1" borderColor="border-subtle">
                    <VStack gap="4">
                      <Heading size='xsmall'>
                        {t('label:perioder-med-rett-til-familieytelser')}
                      </Heading>
                      <Perioder
                        parentNamespace={namespace + '-periodermedretttilfamilieytelser'}
                        parentTarget={"perioderMedRettTilFamilieytelser"}
                        personID={personID}
                        personName={personName}
                        replySed={replySed}
                        updateReplySed={updateReplySed}
                        setReplySed={setReplySed}
                        options={{
                          periodeType: "simple",
                          requiredSluttDato: true
                        }}
                      />
                    </VStack>
                  </Box>
                }

                {dekkedePerioder && dekkedePerioder.length > 0 &&
                  <Box padding="4" borderWidth="1" borderColor="border-subtle">
                    <VStack gap="4">
                      <Heading size='xsmall'>
                        {t('label:dekkede-perioder')}
                      </Heading>
                      <Perioder
                        parentNamespace={namespace + '-dekkedeperioder'}
                        parentTarget={"dekkedePerioder"}
                        personID={personID}
                        personName={personName}
                        replySed={replySed}
                        updateReplySed={updateReplySed}
                        setReplySed={setReplySed}
                        options={{
                          periodeType: "simple",
                          requiredSluttDato: true
                        }}
                      />
                    </VStack>
                  </Box>
                }

                {udekkedePerioder && udekkedePerioder.length > 0 &&
                  <Box padding="4" borderWidth="1" borderColor="border-subtle">
                    <VStack gap="4">
                      <Heading size='xsmall'>
                        {t('label:udekkede-perioder')}
                      </Heading>
                      <Perioder
                        parentNamespace={namespace + '-udekkedeperioder'}
                        parentTarget={"udekkedePerioder"}
                        personID={personID}
                        personName={personName}
                        replySed={replySed}
                        updateReplySed={updateReplySed}
                        setReplySed={setReplySed}
                        options={{
                          periodeType: "simple",
                          requiredSluttDato: true
                        }}
                      />
                    </VStack>
                  </Box>
                }
              </VStack>
            </Box>
          }
        </VStack>
      </Box>
    </>
  )
}

export default AktivitetStatusOgTrygdeperioder
