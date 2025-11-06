import React, {useState} from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import {useAppDispatch, useAppSelector} from "../../../store";
import useUnmount from "../../../hooks/useUnmount";
import _ from "lodash";
import {setValidation} from "../../../actions/validation";
import {Box, Heading, HStack, Radio, RadioGroup, VStack} from "@navikt/ds-react";
import {State} from "../../../declarations/reducers";
import {useTranslation} from "react-i18next";
import Adresser from "./Adresser";
import {setReplySed} from "../../../actions/svarsed";
import {AdresseAnmodning} from "../../../declarations/sed";
import useLocalValidation from "../../../hooks/useLocalValidation";
import {validateAdresserH001, ValidationAdresserH001Props} from "./validationH001";

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
  const namespaceAdresse = `${parentNamespace}-${personID}-adresser`
  const target = 'anmodning.adresse'
  const targetAdresser = `${personID}.adresser`

  const getAdresseAnmodning = () => {
    const adresseAnmodning: AdresseAnmodning | undefined = _.get(replySed, target)
    if (!adresseAnmodning) {
      const newAdresseAnmodning: AdresseAnmodning = {
        anmodningMeldingType: 'melding'
      }
      dispatch(updateReplySed(`${target}.anmodningMeldingType`, 'melding'))

      return newAdresseAnmodning
    }
    return adresseAnmodning
  }

  const adresseAnmodning: AdresseAnmodning | undefined = getAdresseAnmodning()

  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationAdresserH001Props>(validateAdresserH001, namespaceAdresse)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
      dispatch(setValidation(clonedValidation))
    })

  const onAdressetypeChange = (value: string) => {
    dispatch(updateReplySed(`${target}.adresseType`, value.trim()))
  }

  const onAnmodningMeldingChange = (value: string) => {
    dispatch(updateReplySed(`${target}.anmodningMeldingType`, value.trim()))
    if(value === "anmodning"){
      dispatch(updateReplySed(targetAdresser, undefined))
      dispatch(updateReplySed(`${target}.adresseType`, 'bosted'))
    } else if (value === "melding"){
      dispatch(updateReplySed(`${target}.adresseType`, undefined))
    }
  }

  return (
    <>
      <Box padding="4">
        <VStack gap="4">
          <Box>
            <VStack gap="4">
              <Heading size='small'>
                {t('label:adresser')}
              </Heading>
              <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
                <VStack gap="4">
                  <RadioGroup
                    legend={t('label:anmodning-melding-om-adresse')}
                    value={adresseAnmodning?.anmodningMeldingType}
                    error={validation[namespace + '-anmodning-melding-type']?.feilmelding}
                    id={namespace + '-anmodning-melding-type'}
                    name={namespace + '-anmodning-melding-type'}
                    onChange={(value) => onAnmodningMeldingChange(value)}
                  >
                    <Radio value='melding'>
                      {t('el:option-adresse-melding')}
                    </Radio>
                    <Radio value='anmodning'>
                      {t('el:option-adresse-anmodning')}
                    </Radio>
                  </RadioGroup>
                  {((adresseAnmodning?.anmodningMeldingType) === 'melding') &&
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
                  {((adresseAnmodning?.anmodningMeldingType) === 'anmodning') &&
                    <RadioGroup
                      legend={t('label:anmodning-om-adresse')}
                      error={validation[namespace + '-anmodning-type']?.feilmelding}
                      id={namespace + '-anmodning-type'}
                      name={namespace + '-anmodning-type'}
                      value={adresseAnmodning?.adresseType ?? ''}
                      onChange={(value) => onAdressetypeChange(value)}
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
