import {VStack, Box, Heading} from '@navikt/ds-react'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import React from 'react'
import {useAppDispatch, useAppSelector} from 'store'
import {
  AnnenInformasjonBarnet_V43,
  AnnenInformasjonBarnet_V42
} from "declarations/sed";
import {useTranslation} from "react-i18next";
import DateField from "../../../components/DateField/DateField";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const DatoEndredeForhold: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed,
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-annenInformasjonBarnet-datoendredeforhold`
  const target = `anmodningOmMerInformasjon.svar.annenInformasjonBarnet`
  const annenInformasjonBarnet: AnnenInformasjonBarnet_V43 | AnnenInformasjonBarnet_V42 | undefined = _.get(replySed, target)


  const setAnnenInformasjonBarnetProperty = (property: string, value: string) => {
    dispatch(updateReplySed(`${target}.${property}`, value.trim()))
  }

  //TODO: VALIDATION

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
          <DateField
            error={validation[namespace + '-dato-for-endrede-forhold']?.feilmelding}
            namespace={namespace}
            id='dato-for-endrede-forhold'
            label={t('label:dato-for-endrede-forhold')}
            hideLabel={true}
            onChanged={(v) => setAnnenInformasjonBarnetProperty('datoEndredeForhold', v)}
            dateValue={(annenInformasjonBarnet as AnnenInformasjonBarnet_V42)?.datoEndredeForhold ?? ''}
          />
        </Box>
      </VStack>
    </Box>
  )
}

export default DatoEndredeForhold
