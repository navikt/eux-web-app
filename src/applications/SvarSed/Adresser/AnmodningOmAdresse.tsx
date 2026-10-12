import { Box, Checkbox, CheckboxGroup, Heading, HStack, VStack } from '@navikt/ds-react'
import { setValidation } from 'actions/validation'
import {
  validateAnmodningOmAdresse,
  ValidationAnmodningOmAdresseProps
} from 'applications/SvarSed/Adresser/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { Anmodning } from 'declarations/h001'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const AnmodningOmAdresse: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed,
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-adresseAnmodning`
  const target = 'bruker.anmodning.adresseTyper'
  const adresseTyper: Anmodning['adresseTyper'] = _.get(replySed, target) ?? []

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationAnmodningOmAdresseProps>(
      clonedValidation, namespace, validateAnmodningOmAdresse, {
        replySed: (replySed as ReplySed),
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const onAdressetypeChange = (value: Array<string>) => {
    dispatch(updateReplySed(target, value))
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
                      value={adresseTyper}
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
