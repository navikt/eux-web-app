import React, {useState} from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import {useAppDispatch, useAppSelector} from "../../../store";
import {useTranslation} from "react-i18next";
import useUnmount from "../../../hooks/useUnmount";
import _ from "lodash";
import performValidation from "../../../utils/performValidation";
import {PensjonPeriode, Periode, ReplySed} from "../../../declarations/sed";
import {setValidation} from "../../../actions/validation";
import {Box, Button, Checkbox, CheckboxGroup, Heading, HStack, Radio, RadioGroup, Spacer, VStack} from "@navikt/ds-react";
import {State} from "../../../declarations/reducers";
import {validateAktivitetOgTrygdeperioder, ValidateAktivitetOgTrygdeperioderProps} from "./validation";
import {Aktivtitet} from "../../../declarations/sed";
import Ansatt from "./Ansatt/Ansatt";
import AktivitetPerioder from "./AktivitetPerioder/AktivitetPerioder";
import {ArrowRightLeftIcon} from "@navikt/aksel-icons";
import Modal from "../../../components/Modal/Modal";
import PeriodeText from "../../../components/Forms/PeriodeText";
import PerioderMedPensjon from "./PerioderMedPensjon/PerioderMedPensjon";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})


const AktivitetOgTrygdeperioder: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed,
  setReplySed
}:MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-aktivitetogtrygdeperioder`
  const getId = (p: Periode | null): string => p ? parentNamespace + '-' + p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType) : 'new'

  const targetAktivitet = `${personID}.aktivitet`
  const aktivitet: Aktivtitet | undefined = _.get(replySed, targetAktivitet)

  const targetTrygdeperioder = `${personID}.trygdeperioder`
  const trygdeperioder: Array<Periode> | undefined = _.get(replySed, targetTrygdeperioder)

  const targetPerioderMedPensjon = `${personID}.perioderMedPensjon`
  const perioderMedPensjon: Array<PensjonPeriode> | undefined = _.get(replySed, targetPerioderMedPensjon)

  const [_showTransferTrygdePerioderModal, _setShowTransferTrygdePerioderModal] = useState<boolean>(false)
  const [_valgteTrygdePerioder, _setValgteTrygdeperioder] = useState<Array<Periode>>([])

  const [_showTransferPerioderMedPensjonModal, _setShowTransferPerioderMedPensjonModal] = useState<boolean>(false)
  const [_valgtePerioderMedPensjon, _setValgtePerioderMedPensjon] = useState<any>(undefined)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidateAktivitetOgTrygdeperioderProps>(
      clonedValidation, namespace, validateAktivitetOgTrygdeperioder, {
        // clone it, or we can have some state inconsistences between dispatches
        replySed: _.cloneDeep(replySed as ReplySed),
        personID: personID!,
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const onAktivitetChange = (property: string, value: string) => {
    dispatch(updateReplySed(`${targetAktivitet}.${property}`, value.trim()))
    if(property === "status"){
      dispatch(updateReplySed(`${targetAktivitet}.type`, undefined))
    }
  }

  const onTrygdePerioderModalClose = () => {
    _setValgteTrygdeperioder([])
    _setShowTransferTrygdePerioderModal(false)
  }

  const onValgteTrygdePerioderChanged = (valgtePerioder: Array<Periode>) => {
    _setValgteTrygdeperioder(valgtePerioder)
  }

  const onTransferTrygdeperioder = () => {
    dispatch(updateReplySed(`${targetTrygdeperioder}`, undefined))
    dispatch(updateReplySed(`${targetTrygdeperioder}`, _valgteTrygdePerioder))
    onTrygdePerioderModalClose()
  }

  const onPerioderMedPensjonModalClose = () => {
    _setValgtePerioderMedPensjon(undefined)
    _setShowTransferPerioderMedPensjonModal(false)
  }

  const onValgtePerioderMedPensjonChanged = (checked: boolean, valgtPeriode: Periode, index: number) => {
    if(checked){
      const valgtPensjonsPeriode = {
        periode: {
          ...valgtPeriode
        },
        pensjonstype: undefined
      }
      _setValgtePerioderMedPensjon({
        ..._valgtePerioderMedPensjon,
        ["periode-" + index]: valgtPensjonsPeriode
      })
    } else {
      let copy = _.cloneDeep(_valgtePerioderMedPensjon)
      copy = _.omit(copy, "periode-" + index)
      _setValgtePerioderMedPensjon(copy)
    }
  }

  const onSetPensjonstype = (pensjonstype: string, index: number) => {
    _setValgtePerioderMedPensjon({
      ..._valgtePerioderMedPensjon,
      ["periode-" + index]: {
        ..._valgtePerioderMedPensjon["periode-" + index],
        pensjonstype: pensjonstype
      }
    })
  }

  const onTransferPerioderMedPensjon = () => {
    const perioderMedPensjon = Object.values(_valgtePerioderMedPensjon)
    dispatch(updateReplySed(`${targetPerioderMedPensjon}`, undefined))
    dispatch(updateReplySed(`${targetPerioderMedPensjon}`, perioderMedPensjon))
    onPerioderMedPensjonModalClose()
  }



  return (
    <>
      <Modal
        open={_showTransferTrygdePerioderModal}
        modal={{
          modalTitle: "Overfør til trygdeperioder",
          modalContent: (
            <Box borderWidth="1" borderColor="border-subtle" padding="4">
              <CheckboxGroup legend={""} hideLegend={true} onChange={onValgteTrygdePerioderChanged} value={_valgteTrygdePerioder}>
                {aktivitet?.perioder?.map((p) => {
                  return (
                    <Checkbox value={p} key={getId(p)}>
                      <PeriodeText
                        periode={p}
                        namespace={namespace + 'overfør'}
                        error={{
                          startdato: undefined,
                          sluttdato: undefined
                       }}
                      />
                    </Checkbox>
                  )
              })}
              </CheckboxGroup>
            </Box>
          ),
          modalButtons: [
            {
              main: true,
              text: 'Overfør til trygdeperioder',
              onClick: () => onTransferTrygdeperioder()
            },
            {
              text: 'Lukk',
              onClick: () => onTrygdePerioderModalClose()
            },
          ]
        }}
        width="medium"
        onModalClose={() => onTrygdePerioderModalClose()}
      />
      <Modal
        open={_showTransferPerioderMedPensjonModal}
        modal={{
          modalTitle: "Overfør til perioder med pensjon",
          modalContent: (
            <Box borderWidth="1" borderColor="border-subtle" padding="4">
              {trygdeperioder?.map((p, i) => {
                return (
                  <HStack gap="4" align={"start"}>
                    <Checkbox
                      key={getId(p)}
                      checked={!!(_valgtePerioderMedPensjon && _valgtePerioderMedPensjon["periode-" + i])}
                      onChange={(e) => onValgtePerioderMedPensjonChanged(e.target.checked, p, i)}
                    >
                      <PeriodeText
                        periode={p}
                        namespace={namespace + 'overfør'}
                        error={{
                          startdato: undefined,
                          sluttdato: undefined
                        }}
                      />
                    </Checkbox>
                    <Spacer/>
                    {_valgtePerioderMedPensjon && _valgtePerioderMedPensjon["periode-" + i] &&
                      <RadioGroup legend="Grunnlag" hideLegend={true} onChange={(pensjonsType: string) => onSetPensjonstype(pensjonsType, i)}>
                        <HStack gap="4">
                          <Radio value="alderspensjon">{t('el:option-trygdeordning-alderspensjon')}</Radio>
                          <Radio value="uførhet">{t('el:option-trygdeordning-uførhet')}</Radio>
                        </HStack>
                      </RadioGroup>
                    }
                  </HStack>
                )
              })}
            </Box>
          ),
          modalButtons: [
            {
              main: true,
              text: 'Overfør til perioder med pensjon',
              onClick: () => onTransferPerioderMedPensjon()
            },
            {
              text: 'Lukk',
              onClick: () => onPerioderMedPensjonModalClose()
            },
          ]
        }}
        width="medium"
        onModalClose={() => onPerioderMedPensjonModalClose()}
      />
      <Box padding="4">
        <VStack gap="4">
          <Box>
            <VStack gap="4">
              <Heading size='small'>
                Aktivitet
              </Heading>
              <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
                <VStack gap="4">
                  <RadioGroup
                    legend="Personens status"
                    value={aktivitet?.status}
                    error={validation[namespace + '-aktivitet-status']?.feilmelding}
                    id={namespace + '-aktivitet-status'}
                    name={namespace + '-aktivitet-status'}
                    onChange={(value) => onAktivitetChange("status", value)}
                  >
                    <Radio value='aktiv'>
                      Personen betraktes som aktiv
                    </Radio>
                    <Radio value='inaktiv'>
                      Personen betraktes som inaktiv
                    </Radio>
                    <Radio value='ingeninfo'>
                      Ingen informasjon om personens aktivitet
                    </Radio>
                  </RadioGroup>
                  {aktivitet?.status && aktivitet?.status === 'aktiv' &&
                    <RadioGroup
                      legend="Type arbeidsforhold"
                      value={aktivitet?.type}
                      error={validation[namespace + '-aktivitet-type']?.feilmelding}
                      id={namespace + '-aktivitet-type'}
                      name={namespace + '-aktivitet-type'}
                      onChange={(value) => onAktivitetChange("type", value)}
                    >
                      <Radio value='ansatt'>
                        Ansatt
                      </Radio>
                      <Radio value='selvstendig_næringsdrivende'>
                        Selvstendig næringsdrivende
                      </Radio>
                      <Radio value='opphør_aktivitet_sykdom_med_lønn'>
                        Personen mottar lønn eller ytelser, unntatt pensjon, i en periode med opphør i aktivitet for
                        ansatt eller selvstendig næringsdrivende på grunn av sykdom, omsorg for barn, arbeidsulykke,
                        yrkessykdom eller arbeidsledighet.
                      </Radio>
                      <Radio value='permisjon_med_lønnn'>
                        Personen har permisjon med lønn, er i streik eller lockout.
                      </Radio>
                      <Radio value='permisjon_uten_lønnn'>
                        Personen har permisjon uten lønn på grunn av omsorg for barn eller en tilsvarende periode i
                        samsvar med lovgivningen i avsenderlandet.
                      </Radio>
                    </RadioGroup>
                  }
                  {aktivitet?.status && aktivitet?.status === 'inaktiv' &&
                    <RadioGroup
                      legend="Inaktiv person"
                      value={aktivitet?.type}
                      error={validation[namespace + '-aktivitet-type']?.feilmelding}
                      id={namespace + '-aktivitet-type'}
                      name={namespace + '-aktivitet-type'}
                      onChange={(value) => onAktivitetChange("type", value)}
                    >
                      <HStack gap="4">
                        <Radio value='inaktiv'>
                          Personen er inaktiv
                        </Radio>
                        <Radio value='inaktiv_rett_til_familieytelse'>
                          Personen er inaktiv og har rett til familieytelser
                        </Radio>
                        <Radio value='annet'>
                          Annet
                        </Radio>
                      </HStack>
                    </RadioGroup>
                  }
                </VStack>
              </Box>
              {aktivitet?.status && aktivitet?.type && aktivitet?.status === 'aktiv' &&
                <Box padding="4" borderWidth="1" borderColor="border-subtle">
                  <VStack gap="4">
                    <Heading size='xsmall'>
                      <HStack gap="4" align="center">
                        Ansettelsesperioder
                        <Button
                          size={"xsmall"}
                          variant='tertiary'
                          onClick={() => _setShowTransferTrygdePerioderModal(true)}
                          icon={<ArrowRightLeftIcon/>}
                          disabled={!aktivitet?.perioder || aktivitet?.perioder.length === 0}
                        >
                          Overfør til trygdeperioder
                        </Button>
                      </HStack>
                    </Heading>
                    {aktivitet?.type === 'ansatt' &&
                      <Ansatt
                        parentNamespace={namespace}
                        personID={personID}
                        personName={personName}
                        replySed={replySed}
                        updateReplySed={updateReplySed}
                        setReplySed={setReplySed}
                      />
                    }
                    {aktivitet?.type !== 'ansatt' &&
                      <AktivitetPerioder
                        parentNamespace={namespace + '-' + aktivitet?.type}
                        parentTarget={"aktivitet.perioder"}
                        personID={personID}
                        personName={personName}
                        replySed={replySed}
                        updateReplySed={updateReplySed}
                        setReplySed={setReplySed}
                      />
                    }
                  </VStack>
                </Box>
              }
              {aktivitet?.status && ((aktivitet?.status === 'inaktiv' && aktivitet?.type) || (aktivitet?.status === "ingeninfo")) &&
                <Box padding="4" borderWidth="1" borderColor="border-subtle">
                  <VStack gap="4">
                    <Heading size='xsmall'>
                      <HStack gap="4" align="center">
                        Perioder uten aktivitet
                        <Button
                          size={"xsmall"}
                          variant='tertiary'
                          onClick={() => _setShowTransferTrygdePerioderModal(true)}
                          icon={<ArrowRightLeftIcon/>}
                          disabled={!aktivitet?.perioder || aktivitet?.perioder.length === 0}
                        >
                          Overfør til trygdeperioder
                        </Button>
                      </HStack>
                    </Heading>
                    <AktivitetPerioder
                      parentNamespace={namespace + '-' + aktivitet?.type}
                      parentTarget={"aktivitet.perioder"}
                      personID={personID}
                      personName={personName}
                      replySed={replySed}
                      updateReplySed={updateReplySed}
                      setReplySed={setReplySed}
                    />
                  </VStack>
                </Box>
              }
            </VStack>
          </Box>
          <Box>
            <VStack gap="4">
              {trygdeperioder && trygdeperioder.length > 0 &&
                <Box padding="4" borderWidth="1" borderColor="border-subtle">
                  <VStack gap="4">
                    <Heading size='xsmall'>
                      <HStack gap="4" align="center">
                        Trygdeperioder
                        {aktivitet?.status && aktivitet?.status !== 'aktiv' &&
                          <Button
                            size={"xsmall"}
                            variant='tertiary'
                            onClick={() => _setShowTransferPerioderMedPensjonModal(true)}
                            icon={<ArrowRightLeftIcon/>}
                            disabled={!trygdeperioder || trygdeperioder?.length === 0}
                          >
                            Overfør til perioder med pensjon
                          </Button>
                        }
                      </HStack>
                    </Heading>
                    <AktivitetPerioder
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
                      Perioder med pensjon
                    </Heading>
                    <PerioderMedPensjon
                      parentNamespace={namespace}
                      personID={personID}
                      personName={personName}
                      replySed={replySed}
                      updateReplySed={updateReplySed}
                      setReplySed={setReplySed}
                    />
                  </VStack>
                </Box>
              }

            </VStack>
          </Box>
        </VStack>
      </Box>
    </>
  )
}

export default AktivitetOgTrygdeperioder
