import React, {useState} from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import {useAppDispatch, useAppSelector} from "../../../store";
import useUnmount from "../../../hooks/useUnmount";
import _ from "lodash";
import performValidation from "../../../utils/performValidation";
import {PensjonPeriode, Periode, PersonTypeF001, ReplySed} from "../../../declarations/sed";
import {setValidation} from "../../../actions/validation";
import {Box, Button, Heading, HStack, Radio, RadioGroup, VStack} from "@navikt/ds-react";
import {State} from "../../../declarations/reducers";
import {validateAktivitetOgTrygdeperioder, ValidateAktivitetOgTrygdeperioderProps} from "./validation";
import {Aktivtitet} from "../../../declarations/sed";
import Ansatt from "./Ansatt/Ansatt";
import Perioder from "./Perioder/Perioder";
import {ArrowRightLeftIcon} from "@navikt/aksel-icons";
import PerioderMedPensjon from "./PerioderMedPensjon/PerioderMedPensjon";
import TransferPerioderModal from "./TransferPerioderModal/TransferPerioderModal";
import {useTranslation} from "react-i18next";

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
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-aktivitetogtrygdeperioder`

  const targetAktivitet = `${personID}.aktivitet`
  const aktivitet: Aktivtitet | undefined = _.get(replySed, targetAktivitet)

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


  const [_showTransferTrygdePerioderModal, _setShowTransferTrygdePerioderModal] = useState<boolean>(false)
  const [_showTransferPerioderMedPensjonModal, _setShowTransferPerioderMedPensjonModal] = useState<boolean>(false)
  const [_showTransferPerioderMedRettTilFamilieytelserModal, _setShowTransferPerioderMedRettTilFamilieytelserModal] = useState<boolean>(false)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    const person: PersonTypeF001 = _.get(replySed, personID!)
    performValidation<ValidateAktivitetOgTrygdeperioderProps>(
      clonedValidation, namespace, validateAktivitetOgTrygdeperioder, {
        person,
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const onAktivitetChange = (property: string, value: string) => {
    if(property === "status"){
      dispatch(updateReplySed(`${targetAktivitet}.perioder`, undefined))
      dispatch(updateReplySed(`${targetTrygdeperioder}`, undefined))
      dispatch(updateReplySed(`${targetPerioderMedPensjon}`, undefined))
      dispatch(updateReplySed(`${targetPerioderMedRettTilFamilieytelser}`, undefined))
      dispatch(updateReplySed(`${targetDekkedePerioder}`, undefined))
      dispatch(updateReplySed(`${targetUdekkedePerioder}`, undefined))
    }

    dispatch(updateReplySed(`${targetAktivitet}.${property}`, value.trim()))
    if(property === "status"){
      dispatch(updateReplySed(`${targetAktivitet}.type`, undefined))
    }
  }

  const hasOpenPeriods = (periods: Array<Periode> | undefined) => {
    return periods?.find((p) => p.aapenPeriodeType)
  }

  return (
    <>
      <TransferPerioderModal
        namespace={namespace}
        title={t('label:overfør-perioder-til', {periodeType: "trygdeperioder"})}
        modalOpen={_showTransferTrygdePerioderModal}
        setModalOpen={_setShowTransferTrygdePerioderModal}
        target={targetTrygdeperioder}
        perioder={aktivitet?.perioder}
        resetPerioder={[targetTrygdeperioder, targetPerioderMedPensjon, targetPerioderMedRettTilFamilieytelser, targetDekkedePerioder, targetUdekkedePerioder]}
        resetWarning={trygdeperioder && trygdeperioder.length > 0}
      />
      <TransferPerioderModal
        namespace={namespace}
        title={t('label:overfør-perioder-til', {periodeType: "perioder med pensjon"})}
        modalOpen={_showTransferPerioderMedPensjonModal}
        setModalOpen={_setShowTransferPerioderMedPensjonModal}
        target={targetPerioderMedPensjon}
        perioder={trygdeperioder}
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
          <Box>
            <VStack gap="4">
              <Heading size='small'>
                {t('label:aktivitet-og-trygdeperioder')}
              </Heading>
              <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
                <VStack gap="4">
                  <RadioGroup
                    legend={t('label:personens-status')}
                    value={aktivitet?.status}
                    error={validation[namespace + '-aktivitet-status']?.feilmelding}
                    id={namespace + '-aktivitet-status'}
                    name={namespace + '-aktivitet-status'}
                    onChange={(value) => onAktivitetChange("status", value)}
                  >
                    <Radio value='aktiv'>
                      {t('el:radio-aktivitet-status-aktiv')}
                    </Radio>
                    <Radio value='inaktiv'>
                      {t('el:radio-aktivitet-status-inaktiv')}
                    </Radio>
                    <Radio value='ingeninfo'>
                      {t('el:radio-aktivitet-status-ingeninfo')}
                    </Radio>
                  </RadioGroup>
                  {aktivitet?.status && aktivitet?.status === 'aktiv' &&
                    <RadioGroup
                      legend={t('label:arbeidsforhold-type')}
                      value={aktivitet?.type}
                      error={validation[namespace + '-aktivitet-type']?.feilmelding}
                      id={namespace + '-aktivitet-type'}
                      name={namespace + '-aktivitet-type'}
                      onChange={(value) => onAktivitetChange("type", value)}
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
                  }
                  {aktivitet?.status && aktivitet?.status === 'inaktiv' &&
                    <RadioGroup
                      legend={t('label:inaktiv-person')}
                      value={aktivitet?.type}
                      error={validation[namespace + '-aktivitet-type']?.feilmelding}
                      id={namespace + '-aktivitet-type'}
                      name={namespace + '-aktivitet-type'}
                      onChange={(value) => onAktivitetChange("type", value)}
                    >
                      <HStack gap="4">
                        <Radio value='inaktiv'>
                          {t('el:radio-aktivitet-type-inaktiv')}
                        </Radio>
                        <Radio value='inaktiv_rett_til_familieytelse'>
                          {t('el:radio-aktivitet-type-inaktiv-rett-til-familieytelser')}
                        </Radio>
                        <Radio value='annet'>
                          {t('el:radio-aktivitet-type-annet')}
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
                        {t('label:ansettelsesperioder')}
                        <Button
                          size={"xsmall"}
                          variant='tertiary'
                          onClick={() => _setShowTransferTrygdePerioderModal(true)}
                          icon={<ArrowRightLeftIcon/>}
                          disabled={!aktivitet?.perioder || aktivitet?.perioder.length === 0}
                        >
                          {t('label:overfør-perioder-til', {periodeType: "trygdeperioder"})}
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
                      <Perioder
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
                        {t('label:perioder-uten-aktivitet')}
                        <Button
                          size={"xsmall"}
                          variant='tertiary'
                          onClick={() => _setShowTransferTrygdePerioderModal(true)}
                          icon={<ArrowRightLeftIcon/>}
                          disabled={!aktivitet?.perioder || aktivitet?.perioder.length === 0}
                        >
                          {t('label:overfør-perioder-til', {periodeType: "trygdeperioder"})}
                        </Button>
                      </HStack>
                    </Heading>
                    <Perioder
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
                          {t('label:trygdeperioder')}
                          {aktivitet?.status && aktivitet?.status === 'aktiv' &&
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
                    {aktivitet?.status && aktivitet?.status !== 'aktiv' &&
                      <HStack gap="4" align="center">
                        <Button
                          size={"xsmall"}
                          variant='tertiary'
                          onClick={() => _setShowTransferPerioderMedPensjonModal(true)}
                          icon={<ArrowRightLeftIcon/>}
                          disabled={!trygdeperioder || trygdeperioder?.length === 0}
                        >
                          {t('label:overfør-perioder-til', {periodeType: "perioder med pensjon"})}
                        </Button>
                        <Button
                          size={"xsmall"}
                          variant='tertiary'
                          onClick={() => _setShowTransferPerioderMedRettTilFamilieytelserModal(true)}
                          icon={<ArrowRightLeftIcon/>}
                          disabled={!trygdeperioder || trygdeperioder?.length === 0}
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
        </VStack>
      </Box>
    </>
  )
}

export default AktivitetOgTrygdeperioder
