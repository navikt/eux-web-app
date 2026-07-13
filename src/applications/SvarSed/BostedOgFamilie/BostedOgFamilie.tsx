import { Box, Heading, HGrid, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Input from 'components/Forms/Input'
import TextArea from 'components/Forms/TextArea'
import { H005InformasjonFastslaaBosted, H005Sed } from 'declarations/h005'
import { State } from 'declarations/reducers'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateBostedOgFamilie, ValidationBostedOgFamilieProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const BostedOgFamilie: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-bostedogfamilie`
  const sed = replySed as H005Sed
  const informasjonFastslaaBosted: H005InformasjonFastslaaBosted | undefined = sed.informasjonFastslaaBosted

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationBostedOgFamilieProps>(
      clonedvalidation, namespace, validateBostedOgFamilie, {
        replySed: sed,
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setField = (target: string, id: string, value: string) => {
    dispatch(updateReplySed(`informasjonFastslaaBosted.${target}`, value.trim() || undefined))
    if (validation[namespace + '-' + id]) {
      dispatch(resetValidation(namespace + '-' + id))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <HGrid columns={{ xs: 1, md: 2 }} gap="space-16" align="start">
          <Input
            error={validation[namespace + '-inntektskildeStudenter']?.feilmelding}
            namespace={namespace}
            id='inntektskildeStudenter'
            label={t('label:inntektskilde-studenter')}
            onChanged={(value: string) => setField('inntektskildeStudenter', 'inntektskildeStudenter', value)}
            value={informasjonFastslaaBosted?.inntektskildeStudenter}
          />
          <Input
            error={validation[namespace + '-bosituasjonHvorPermanent']?.feilmelding}
            namespace={namespace}
            id='bosituasjonHvorPermanent'
            label={t('label:bosituasjon-hvor-permanent')}
            onChanged={(value: string) => setField('bosituasjonHvorPermanent', 'bosituasjonHvorPermanent', value)}
            value={informasjonFastslaaBosted?.bosituasjonHvorPermanent}
          />
          <Input
            error={validation[namespace + '-permanentOppholdSkattemessig']?.feilmelding}
            namespace={namespace}
            id='permanentOppholdSkattemessig'
            label={t('label:permanent-opphold-skattemessig')}
            onChanged={(value: string) => setField('permanentOppholdSkattemessig', 'permanentOppholdSkattemessig', value)}
            value={informasjonFastslaaBosted?.permanentOppholdSkattemessig}
          />
        </HGrid>

        <TextArea
          error={validation[namespace + '-grunnForFlytting']?.feilmelding}
          namespace={namespace}
          id='grunnForFlytting'
          label={t('label:grunn-for-flytting')}
          maxLength={155}
          onChanged={(value: string) => setField('grunnForFlytting', 'grunnForFlytting', value)}
          value={informasjonFastslaaBosted?.grunnForFlytting}
        />

        <Heading size='xsmall'>
          {t('label:familiestatus')}
        </Heading>

        <HGrid columns={{ xs: 1, md: 2 }} gap="space-16" align="start">
          <Input
            error={validation[namespace + '-ektefelleFamiliemedlem']?.feilmelding}
            namespace={namespace}
            id='ektefelleFamiliemedlem'
            label={t('label:familiemedlem-ektefelle')}
            onChanged={(value: string) => setField('familiestatus.ektefelle.familiemedlem', 'ektefelleFamiliemedlem', value)}
            value={informasjonFastslaaBosted?.familiestatus?.ektefelle?.familiemedlem}
          />
          <Input
            error={validation[namespace + '-ektefelleBosted']?.feilmelding}
            namespace={namespace}
            id='ektefelleBosted'
            label={t('label:bosted-ektefelle')}
            onChanged={(value: string) => setField('familiestatus.ektefelle.bosted', 'ektefelleBosted', value)}
            value={informasjonFastslaaBosted?.familiestatus?.ektefelle?.bosted}
          />
          <Input
            error={validation[namespace + '-barnFamiliemedlem']?.feilmelding}
            namespace={namespace}
            id='barnFamiliemedlem'
            label={t('label:familiemedlem-barn')}
            onChanged={(value: string) => setField('familiestatus.barn.familiemedlem', 'barnFamiliemedlem', value)}
            value={informasjonFastslaaBosted?.familiestatus?.barn?.familiemedlem}
          />
          <Input
            error={validation[namespace + '-barnBosted']?.feilmelding}
            namespace={namespace}
            id='barnBosted'
            label={t('label:bosted-barn')}
            onChanged={(value: string) => setField('familiestatus.barn.bosted', 'barnBosted', value)}
            value={informasjonFastslaaBosted?.familiestatus?.barn?.bosted}
          />
          <Input
            error={validation[namespace + '-barnSkolekrets']?.feilmelding}
            namespace={namespace}
            id='barnSkolekrets'
            label={t('label:skolekrets-barn')}
            onChanged={(value: string) => setField('familiestatus.barn.skolekrets', 'barnSkolekrets', value)}
            value={informasjonFastslaaBosted?.familiestatus?.barn?.skolekrets}
          />
        </HGrid>
      </VStack>
    </Box>
  )
}

export default BostedOgFamilie
