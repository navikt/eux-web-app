import React, {useState} from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import {useAppDispatch, useAppSelector} from "../../../store";
import useUnmount from "../../../hooks/useUnmount";
import _ from "lodash";
import {setValidation} from "../../../actions/validation";
import {Box, Checkbox, CheckboxGroup, Heading, HStack, VStack} from "@navikt/ds-react";
import {State} from "../../../declarations/reducers";
import {useTranslation} from "react-i18next";
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

  const getAdresseAnmodning = () => {
    const adresseAnmodning: AdresseAnmodning | undefined = _.get(replySed, target)
    if (!adresseAnmodning) {
      const newAdresseAnmodning: AdresseAnmodning = {
        adresseTyper: []
      }
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

  const onAdressetypeChange = (value: any[]) => {
    dispatch(updateReplySed(`${target}.adresseTyper`, value))
  }

  return (
    <>
      <Box padding="4">
        <VStack gap="4">
          <Box>
            <VStack gap="4">
              <Heading size='small'>
                {t('label:anmodning-om-adresse')}
              </Heading>
              <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
                <VStack gap="4">
                    <CheckboxGroup
                      legend={t('label:type-adresse')}
                      error={validation[namespace + '-anmodning-type']?.feilmelding}
                      id={namespace + '-anmodning-type'}
                      name={namespace + '-anmodning-type'}
                      value={adresseAnmodning?.adresseTyper}
                      onChange={(value) => onAdressetypeChange(value)}
                    >
                      <HStack gap="4">
                        <Checkbox value='bosted'>
                          {t('el:radio-adresse-anmodning-type-bosted')}
                        </Checkbox>
                        <Checkbox value='opphold'>
                          {t('el:radio-adresse-anmodning-type-opphold')}
                        </Checkbox>
                        <Checkbox value='kontakt'>
                          {t('el:radio-adresse-anmodning-type-kontakt')}
                        </Checkbox>
                      </HStack>
                    </CheckboxGroup>
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
