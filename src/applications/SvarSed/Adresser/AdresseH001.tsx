import React, {useState} from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import {useAppDispatch, useAppSelector} from "../../../store";
import useUnmount from "../../../hooks/useUnmount";
import _ from "lodash";
import performValidation from "../../../utils/performValidation";
import { H001Svar, PensjonPeriode, Periode, PersonTypeF001} from "../../../declarations/sed";
import {resetValidation, setValidation} from "../../../actions/validation";
import {Box, Button, Heading, HStack, Radio, RadioGroup, VStack} from "@navikt/ds-react";
import {State} from "../../../declarations/reducers";
import {Aktivtitet} from "../../../declarations/sed";
import {ArrowRightLeftIcon} from "@navikt/aksel-icons";
import {useTranslation} from "react-i18next";
import TextArea from "../../../components/Forms/TextArea";
import ErrorLabel from "../../../components/Forms/ErrorLabel";
import Adresser from "./Adresser";
import {setReplySed} from "../../../actions/svarsed";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})


const AdresseH001: React.FC<MainFormProps> = ({
                                                label,
                                                parentNamespace,
                                                personID,
                                                personName,
                                                replySed,
                                                updateReplySed,
                                                options
                                              }: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-adresseH001`
  const target = 'anmodningOmAdresse'
//  const anmodningOmAdresse: H001AnmodningOmAdresse | undefined = _.get(replySed, target)
/*
  const targetYtterligereInfo = `${personID}.ytterligereInfo`
  const ytterligereInfo: string | undefined = _.get(replySed, targetYtterligereInfo)

  const targetIngenInfoBegrunnelse = `${personID}.aktivitet.begrunnelse`
  const ingenInfoBegrunnelse: string | undefined = _.get(replySed, targetIngenInfoBegrunnelse)

  const targetAktivitet = `${personID}.aktivitet`
  const aktivitet: Aktivtitet | undefined = _.get(replySed, targetAktivitet)

  const targetPerioderMedAktivitetForInaktivPerson = `${personID}.perioderMedAktivitetForInaktivPerson`

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

  const typeAdresse = 'test'

  const [_showTransferTrygdePerioderModal, _setShowTransferTrygdePerioderModal] = useState<boolean>(false)
  const [_showTransferPerioderMedPensjonModal, _setShowTransferPerioderMedPensjonModal] = useState<boolean>(false)
  const [_showTransferPerioderMedRettTilFamilieytelserModal, _setShowTransferPerioderMedRettTilFamilieytelserModal] = useState<boolean>(false)
*/
  useUnmount(() => {

    const clonedValidation = _.cloneDeep(validation)
    /*
    const person: PersonTypeF001 = _.get(replySed, personID!)
    performValidation<ValidateAktivitetOgTrygdeperioderProps>(
      clonedValidation, namespace, validateAktivitetOgTrygdeperioder, {
        person,
        personName
      }, true
    )

     */
    dispatch(setValidation(clonedValidation))
  })

  const onAktivitetChange = (property: string, value: string) => {
    if (property === "status") {
      /*
      dispatch(updateReplySed(`${targetAktivitet}.perioder`, undefined))
      dispatch(updateReplySed(`${targetAktivitet}.begrunnelse`, undefined))
      dispatch(updateReplySed(`${targetPerioderMedAktivitetForInaktivPerson}`, undefined))
      dispatch(updateReplySed(`${targetTrygdeperioder}`, undefined))
      dispatch(updateReplySed(`${targetPerioderMedPensjon}`, undefined))
      dispatch(updateReplySed(`${targetPerioderMedRettTilFamilieytelser}`, undefined))
      dispatch(updateReplySed(`${targetDekkedePerioder}`, undefined))
      dispatch(updateReplySed(`${targetUdekkedePerioder}`, undefined))

       */
    }
  }
  /*
  const onAnmodningMeldingChange = (property: string, value: string) => {
    if(property === "anmodning"){
      dispatch(updateReplySed(`${targetAktivitet}.perioder`, undefined))
      dispatch(updateReplySed(`${targetAktivitet}.begrunnelse`, undefined))
      dispatch(updateReplySed(`${targetPerioderMedAktivitetForInaktivPerson}`, undefined))
      dispatch(updateReplySed(`${targetTrygdeperioder}`, undefined))
      dispatch(updateReplySed(`${targetPerioderMedPensjon}`, undefined))
      dispatch(updateReplySed(`${targetPerioderMedRettTilFamilieytelser}`, undefined))
      dispatch(updateReplySed(`${targetDekkedePerioder}`, undefined))
      dispatch(updateReplySed(`${targetUdekkedePerioder}`, undefined))

    } else if (property === "melding"){

    }
    dispatch(updateReplySed(`${targetAktivitet}.${property}`, value.trim()))
    if(property === "status"){
      dispatch(updateReplySed(`${targetAktivitet}.type`, undefined))
    }
  }

  const onAdressetypeChange = (property: string, value: string) => {
//    if(property === "anmodning"){
      dispatch(updateReplySed(`${targetAktivitet}.perioder`, undefined))
      dispatch(updateReplySed(`${targetAktivitet}.begrunnelse`, undefined))
      dispatch(updateReplySed(`${targetPerioderMedAktivitetForInaktivPerson}`, undefined))
      dispatch(updateReplySed(`${targetTrygdeperioder}`, undefined))
      dispatch(updateReplySed(`${targetPerioderMedPensjon}`, undefined))
      dispatch(updateReplySed(`${targetPerioderMedRettTilFamilieytelser}`, undefined))
      dispatch(updateReplySed(`${targetDekkedePerioder}`, undefined))
      dispatch(updateReplySed(`${targetUdekkedePerioder}`, undefined))


    dispatch(updateReplySed(`${targetAktivitet}.${property}`, value.trim()))
  }

   */
  /*

  const hasOpenPeriods = (periods: Array<Periode> | undefined) => {
    return periods?.find((p) => p.aapenPeriodeType)
  }

  const setYtterligereInfo = (ytterligereInfo: string) => {
    dispatch(updateReplySed(`${targetYtterligereInfo}`, ytterligereInfo))
    if (validation[namespace + '-ytterligereInfo']) {
      dispatch(resetValidation(namespace + '-ytterligereInfo'))
    }
  }

  const setIngenInfoBegrunnelse = (begrunnelse: string) => {
    dispatch(updateReplySed(`${targetIngenInfoBegrunnelse}`, begrunnelse))
    if (validation[namespace + '-ingeninfo-begrunnelse']) {
      dispatch(resetValidation(namespace + '-ingeninfo-begrunnelse'))
    }
  }
*/
  return (
    <>
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
//                    value={aktivitet?.status}
                    value={'anmodning'}
                    error={validation[namespace + '-aktivitet-status']?.feilmelding}
                    id={namespace + '-aktivitet-status'}
                    name={namespace + '-aktivitet-status'}
//                    onChange={(value) => onAktivitetChange("status", value)}
                  >
                    <Radio value='anmodning'>
                      {t('el:option-adresse-anmodning')}
                    </Radio>
                    <Radio value='melding'>
                      {t('el:option-adresse-melding')}
                    </Radio>
                  </RadioGroup>
                  {false &&
                    <Adresser
                      parentNamespace={parentNamespace}
                      personID={personID}
                      personName={personName}
                      replySed={replySed}
                      updateReplySed={updateReplySed}
                      options={options}
                      setReplySed={setReplySed}
                    />
                  }
                  {true &&
                    <RadioGroup
                      legend={t('label:anmodning-om-adresse')}
                      error={validation[namespace + '-anmodning-type']?.feilmelding}
                      id={namespace + '-anmodning-type'}
                      name={namespace + '-anmodning-type'}
//                      onChange={(value) => onAktivitetChange("type", value)}
                    >
                      <HStack gap="4">
                        <Radio value='bosted'>
                          {t('el:radio-adresse-anmodning-type-bosted')}
                        </Radio>
                        <Radio value='opphold'>
                          {t('el:radio-adresse-anmodning-type-opphold')}
                        </Radio>
                        <Radio value='kontakt'>
                          {t('el:radio-adresse-anmodning-type-kontakt')}
                        </Radio>
                      </HStack>
                    </RadioGroup>
                  }
                </VStack>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </>
  )
}

export default AdresseH001
