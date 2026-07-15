import { Box, Heading, HGrid, RadioGroup, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import {
  validateTypeInformasjon,
  ValidationTypeInformasjonProps
} from 'applications/SvarSed/TypeInformasjon/validation'
import CountryDropdown from 'components/CountryDropdown/CountryDropdown'
import DateField from 'components/DateField/DateField'
import TextArea from 'components/Forms/TextArea'
import { Country } from 'components/land-verktoy'
import RadioPanel from 'components/RadioPanel/RadioPanel'
import { H003Sed, TypeInformasjon as TypeInformasjonValg } from 'declarations/h003'
import { State } from 'declarations/reducers'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const TypeInformasjon: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-typeinformasjon`
  const sed = replySed as H003Sed

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationTypeInformasjonProps>(
      clonedValidation, namespace, validateTypeInformasjon, {
        replySed: sed,
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const setTypeInformasjon = (value: TypeInformasjonValg) => {
    dispatch(updateReplySed('typeInformasjon', value))
    // Kun den valgte typen skal sendes til RINA – rydd opp motsatt seksjon.
    dispatch(updateReplySed(value === 'fremlegg_om_bostedsland' ? 'varsel' : 'fremlegg', undefined))
    if (validation[namespace + '-typeInformasjon']) {
      dispatch(resetValidation(namespace + '-typeInformasjon'))
    }
  }

  const setFremleggLandkode = (value: string) => {
    dispatch(updateReplySed('fremlegg.landkode', value.trim() || undefined))
    if (validation[namespace + '-fremlegg-landkode']) {
      dispatch(resetValidation(namespace + '-fremlegg-landkode'))
    }
  }

  const setFremleggStartdato = (value: string) => {
    dispatch(updateReplySed('fremlegg.startdato', value.trim() || undefined))
    if (validation[namespace + '-fremlegg-startdato']) {
      dispatch(resetValidation(namespace + '-fremlegg-startdato'))
    }
  }

  const setFremleggBegrunnelse = (value: string) => {
    dispatch(updateReplySed('fremlegg.begrunnelse', value.trim() || undefined))
    if (validation[namespace + '-fremlegg-begrunnelse']) {
      dispatch(resetValidation(namespace + '-fremlegg-begrunnelse'))
    }
  }

  const setVarselLandkode = (value: string) => {
    dispatch(updateReplySed('varsel.landkode', value.trim() || undefined))
    if (validation[namespace + '-varsel-landkode']) {
      dispatch(resetValidation(namespace + '-varsel-landkode'))
    }
  }

  const setVarselStartdato = (value: string) => {
    dispatch(updateReplySed('varsel.startdato', value.trim() || undefined))
    if (validation[namespace + '-varsel-startdato']) {
      dispatch(resetValidation(namespace + '-varsel-startdato'))
    }
  }

  const setVarselBegrunnelse = (value: string) => {
    dispatch(updateReplySed('varsel.begrunnelse', value.trim() || undefined))
    if (validation[namespace + '-varsel-begrunnelse']) {
      dispatch(resetValidation(namespace + '-varsel-begrunnelse'))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <RadioGroup
          value={sed.typeInformasjon ?? ''}
          data-testid={namespace + '-typeInformasjon'}
          error={validation[namespace + '-typeInformasjon']?.feilmelding}
          id={namespace + '-typeInformasjon'}
          legend={t('el:option-mainform-typeinformasjon')}
          hideLegend
          onChange={(e: string) => {
            if (e !== sed.typeInformasjon) {
              setTypeInformasjon(e as TypeInformasjonValg)
            }
          }}
        >
          <HGrid columns={2} gap="space-16" align="start">
            <RadioPanel value='fremlegg_om_bostedsland'>
              {t('el:option-h003-typeinformasjon-fremlegg')}
            </RadioPanel>
            <RadioPanel value='varsel_om_bostedsland'>
              {t('el:option-h003-typeinformasjon-varsel')}
            </RadioPanel>
          </HGrid>
        </RadioGroup>

        {sed.typeInformasjon === 'fremlegg_om_bostedsland' && (
          <VStack gap="space-16">
            <Heading size='xsmall'>
              {t('el:option-h003-typeinformasjon-fremlegg')}
            </Heading>
            <CountryDropdown
              closeMenuOnSelect
              countryCodeListName='euEftaLand'
              data-testid={namespace + '-fremlegg-landkode'}
              error={validation[namespace + '-fremlegg-landkode']?.feilmelding}
              flagWave
              id={namespace + '-fremlegg-landkode'}
              label={t('label:fremlagt-bostedsland')}
              menuPortalTarget={document.body}
              onOptionSelected={(e: Country) => setFremleggLandkode(e.value3)}
              values={sed.fremlegg?.landkode}
            />
            <DateField
              error={validation[namespace + '-fremlegg-startdato']?.feilmelding}
              id='fremlegg-startdato'
              namespace={namespace}
              label={t('label:startdato')}
              onChanged={setFremleggStartdato}
              dateValue={sed.fremlegg?.startdato}
            />
            <TextArea
              error={validation[namespace + '-fremlegg-begrunnelse']?.feilmelding}
              namespace={namespace}
              id='fremlegg-begrunnelse'
              label={t('label:begrunnelse-for-fremlegget')}
              maxLength={255}
              onChanged={setFremleggBegrunnelse}
              value={sed.fremlegg?.begrunnelse}
            />
          </VStack>
        )}

        {sed.typeInformasjon === 'varsel_om_bostedsland' && (
          <VStack gap="space-16">
            <Heading size='xsmall'>
              {t('el:option-h003-typeinformasjon-varsel')}
            </Heading>
            <CountryDropdown
              closeMenuOnSelect
              countryCodeListName='euEftaLand'
              data-testid={namespace + '-varsel-landkode'}
              error={validation[namespace + '-varsel-landkode']?.feilmelding}
              flagWave
              id={namespace + '-varsel-landkode'}
              label={t('label:bostedsland')}
              menuPortalTarget={document.body}
              onOptionSelected={(e: Country) => setVarselLandkode(e.value3)}
              values={sed.varsel?.landkode}
            />
            <DateField
              error={validation[namespace + '-varsel-startdato']?.feilmelding}
              id='varsel-startdato'
              namespace={namespace}
              label={t('label:startdato')}
              onChanged={setVarselStartdato}
              dateValue={sed.varsel?.startdato}
            />
            <TextArea
              error={validation[namespace + '-varsel-begrunnelse']?.feilmelding}
              namespace={namespace}
              id='varsel-begrunnelse'
              label={t('label:begrunnelse-for-meldingen')}
              maxLength={255}
              onChanged={setVarselBegrunnelse}
              value={sed.varsel?.begrunnelse}
            />
          </VStack>
        )}
      </VStack>
    </Box>
  )
}

export default TypeInformasjon
