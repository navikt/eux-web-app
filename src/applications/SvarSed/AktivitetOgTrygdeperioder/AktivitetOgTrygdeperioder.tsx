import React from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import {useAppDispatch, useAppSelector} from "../../../store";
import {useTranslation} from "react-i18next";
import useUnmount from "../../../hooks/useUnmount";
import _ from "lodash";
import performValidation from "../../../utils/performValidation";
import {ReplySed} from "../../../declarations/sed";
import {resetValidation, setValidation} from "../../../actions/validation";
import {Box, Heading, HStack, Radio, RadioGroup, VStack} from "@navikt/ds-react";
import {State} from "../../../declarations/reducers";
import {validateAktivitetOgTrygdeperioder, ValidateAktivitetOgTrygdeperioderProps} from "./validation";
import {Aktivtitet} from "../../../declarations/sed";
import Ansatt from "./Ansatt/Ansatt";
import AktivitetPerioder from "./AktivitetPerioder/AktivitetPerioder";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})


const AktivitetOgTrygdeperioder: React.FC<MainFormProps> = ({
  label,
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

  const targetAktivitet = `${personID}.aktivitet`
  const aktivitet: Aktivtitet | undefined = _.get(replySed, targetAktivitet)

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

  return (
    <Box padding="4">
      <VStack gap="8">
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
              <Box padding="4"   borderWidth="1" borderColor="border-subtle">
                <Heading size='xsmall'>
                  Ansettelsesperioder
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
                    personID={personID}
                    personName={personName}
                    replySed={replySed}
                    updateReplySed={updateReplySed}
                    setReplySed={setReplySed}
                  />
                }
              </Box>
            }
            {aktivitet?.status && ((aktivitet?.status === 'inaktiv' && aktivitet?.type) || (aktivitet?.status === "ingeninfo")) &&
              <Box padding="4" borderWidth="1" borderColor="border-subtle">
                <Heading size='xsmall'>
                  Perioder uten aktivitet
                </Heading>
                <AktivitetPerioder
                  parentNamespace={namespace + '-' + aktivitet?.type}
                  personID={personID}
                  personName={personName}
                  replySed={replySed}
                  updateReplySed={updateReplySed}
                  setReplySed={setReplySed}
                />
              </Box>
            }
          </VStack>
        </Box>

        <Box>
          <VStack gap="4">
            <Heading size='small'>
              Trygdeperioder
            </Heading>
            <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
              <VStack gap="4">
              </VStack>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}

export default AktivitetOgTrygdeperioder
