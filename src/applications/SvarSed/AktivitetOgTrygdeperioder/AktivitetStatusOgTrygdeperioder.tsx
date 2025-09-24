import React, {useEffect, useState, useRef} from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import {useAppDispatch, useAppSelector} from "../../../store";
import _ from "lodash";
import {Aktivitet, AktivtitetStatus} from "../../../declarations/sed";
import {Box, Button, Heading, HStack, Label, Radio, RadioGroup, Spacer, Tabs, VStack} from "@navikt/ds-react";
import {State} from "../../../declarations/reducers";
import {PlusCircleIcon, MinusCircleIcon, ArrowRightLeftIcon, TrashIcon, PencilIcon} from "@navikt/aksel-icons";
import {useTranslation} from "react-i18next";
import styles from "./AktivitetStatusOgTrygdeperioder.module.css";
import Perioder from "./Perioder/Perioder";
import Ansatt from "./Ansatt/Ansatt";

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

  const targetAktivitetStatuser = `${personID}.aktivitetStatuser`
  const aktivitetStatuser: Array<AktivtitetStatus> | undefined = _.get(replySed, targetAktivitetStatuser)
  const prevAktivitetStatuserRef = useRef<Array<AktivtitetStatus> | undefined>(undefined);

  const [_showAddStatus, _setShowShowAddStatus] = useState<boolean>(false)
  const [_currentStatus, _setCurrentStatus] = useState<string>("")
  const [_selectedStatus, _setSelectedStatus] = useState<string>("")

  const [_showAddActivityType, _setShowShowAddActivityType] = useState<boolean>(false)
  const [_editActivityIndex, _setEditActivityIndex] = useState<number | undefined>(undefined)
  const [_selectedActivityType, _setSelectedActivityType] = useState<string>("")

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

    const aktivitetStatus: AktivtitetStatus = {
      status: status,
      aktiviteter
    }

    const newAktivitetStatuser = aktivitetStatuser ? [...aktivitetStatuser, aktivitetStatus] : [aktivitetStatus]
    dispatch(updateReplySed(`${targetAktivitetStatuser}`, newAktivitetStatuser))
    _setSelectedStatus("")
    _setShowShowAddStatus(false)
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

  const onTabChange = (status: string) => {
    _setSelectedActivityType("")
    _setShowShowAddActivityType(false)
    _setCurrentStatus(status)
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

    // Only set current status if:
    // 1. There was no previous aktivitetStatuser (first item)
    // 2. Current length is greater than previous length (item was added)
    if(aktivitetStatuser && aktivitetStatuser?.length > 0) {
      const shouldSetCurrentStatus = !prevAktivitetStatuser || (prevAktivitetStatuser.length < aktivitetStatuser.length);

      if (shouldSetCurrentStatus) {
        _setCurrentStatus(aktivitetStatuser[aktivitetStatuser?.length-1].status + '-' + (aktivitetStatuser?.length - 1))
      }
    }

    // Store current value as previous for next comparison
    prevAktivitetStatuserRef.current = aktivitetStatuser;
  }, [aktivitetStatuser]);

  return (
    <>
      <Box padding="4">
        <VStack gap="4">
          <Box>
            <VStack gap="4">
              <Heading size='small'>
                <HStack gap="4" align="center">
                  {t('label:aktivitet-og-trygdeperioder')}
                  <Button
                    size={"xsmall"}
                    variant='tertiary'
                    onClick={addStatus}
                    icon={<PlusCircleIcon/>}
                  >
                    Legg til status
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
                      <Radio value='aktiv'>
                        {t('el:radio-aktivitet-status-aktiv')}
                      </Radio>
                      <Radio value='inaktiv'>
                        {t('el:radio-aktivitet-status-inaktiv')}
                      </Radio>
                      <Radio value='ingenInfo'>
                        {t('el:radio-aktivitet-status-ingeninfo')}
                      </Radio>
                    </RadioGroup>
                    <HStack gap="4">
                      <Button
                        variant='primary'
                        onClick={() => onStatusAdd(_selectedStatus)}
                      >
                        Legg til status
                      </Button>
                      <Button
                        variant='secondary'
                        onClick={() => {
                          _setSelectedStatus("");
                          _setShowShowAddStatus(false)
                        }}
                      >
                        Lukk
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              }
              <Tabs value={_currentStatus} onChange={(value) => onTabChange(value)}>
                <Tabs.List>
                  {aktivitetStatuser?.map((aktivitetStatus: AktivtitetStatus, idx: number) => {
                    return <Tabs.Tab value={aktivitetStatus.status + '-' + idx} label={t('label:status-'+aktivitetStatus.status)}/>
                  })}
                </Tabs.List>
                {aktivitetStatuser?.map((aktivitetStatus: AktivtitetStatus, idx: number) => {
                  return (
                    <Tabs.Panel value={aktivitetStatus.status + '-' + idx}>
                      <VStack gap="4" marginBlock="4" align="start">
                        <Button
                          size={"xsmall"}
                          variant='tertiary'
                          onClick={() => removeStatus(idx)}
                          icon={<MinusCircleIcon/>}
                        >
                          Fjern status
                        </Button>
                        <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle" width="100%">
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
                            <Box padding="4" borderWidth="1" borderColor="border-subtle" width="100%">
                              <VStack gap="4" width="100%">
                                <VStack>
                                  <HStack gap="4" width="100%" align="start">
                                    {typeLabel && <Label>{typeLabel}:</Label>}
                                    <Spacer/>
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
                                    <Button
                                      variant='tertiary'
                                      size="xsmall"
                                      onClick={() => {}}
                                      icon={<TrashIcon/>}
                                    >
                                      Slett
                                    </Button>
                                  </HStack>
                                  {aktivitetIdx !== _editActivityIndex && type}
                                </VStack>
                                {aktivitetIdx === _editActivityIndex &&
                                  <>
                                    {getAktivitetTyper(aktivitetStatus.status, true)}
                                    <HStack gap="4">
                                      <Button
                                        variant='primary'
                                        onClick={() => {}}
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
                                  </>
                                }
                                <Heading size='xsmall'>
                                  <HStack gap="4" align="center">
                                    {title}
                                    <Button
                                      size={"xsmall"}
                                      variant='tertiary'
                                      onClick={() => {}}
                                      icon={<ArrowRightLeftIcon/>}
                                      disabled={!aktivitet?.perioder || aktivitet?.perioder.length === 0}
                                    >
                                      {t('label:overfør-perioder-til', {periodeType: "trygdeperioder"})}
                                    </Button>
                                  </HStack>
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
                                {(aktivitetStatus.status === 'aktiv' && aktivitet.type && aktivitet.type !== "ansatt" ||aktivitetStatus.status === "inaktiv" || aktivitetStatus.status === "ingenInfo") &&
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
                              </VStack>
                            </Box>
                          )}
                        )}
                      </VStack>
                    </Tabs.Panel>
                  )
                })}
              </Tabs>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </>
  )
}

export default AktivitetStatusOgTrygdeperioder
