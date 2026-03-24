import React from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import {useAppDispatch, useAppSelector} from "../../../store";
import useUnmount from "../../../hooks/useUnmount";
import _ from "lodash";
import {setValidation} from "../../../actions/validation";
import {Box, Checkbox, CheckboxGroup, Heading, HStack, VStack} from "@navikt/ds-react";
import {State} from "../../../declarations/reducers";
import {useTranslation} from "react-i18next";
import {AdresseAnmodning} from "../../../declarations/sed";
import performValidation from "../../../utils/performValidation";
import {validateAnmodningOmAdresse} from "./validation";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const AnmodningOmAdresse: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed,
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-adresseAnmodning`
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

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<any>(clonedValidation, namespace, validateAnmodningOmAdresse, {}, true)
    dispatch(setValidation(clonedValidation))
  })

  const onAdressetypeChange = (value: any[]) => {
    dispatch(updateReplySed(`${target}.adresseTyper`, value))
  }

  return (
    <>
      <Box padding="space-16">
        <VStack gap="space-16">
          <Box>
            <VStack gap="space-16">
              <Heading size='small'>
                {t('label:anmodning-om-adresse')}
              </Heading>
              <Box padding="space-16" background="neutral-soft" borderWidth="1" borderColor="neutral-subtle">
                <VStack gap="space-16">
                    <CheckboxGroup
                      legend={t('label:type-adresse')}
                      error={validation[namespace + '-anmodning-type']?.feilmelding}
                      id={namespace + '-anmodning-type'}
                      name={namespace + '-anmodning-type'}
                      value={adresseAnmodning?.adresseTyper}
                      onChange={(value) => onAdressetypeChange(value)}
                    >
                      <HStack gap="space-16">
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
  );
}

export default AnmodningOmAdresse
