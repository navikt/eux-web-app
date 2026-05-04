import {Box, Heading, HGrid, RadioGroup, VStack} from '@navikt/ds-react'
import RadioPanel from 'components/RadioPanel/RadioPanel'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Input from 'components/Forms/Input'
import { State } from 'declarations/reducers'
import { X008Sed } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateUgyldiggjøre, ValidationUgyldiggjøreProps } from './validation'
const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Ugyldiggjøre: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-ugyldiggjøre`

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationUgyldiggjøreProps>(
      clonedValidation, namespace, validateUgyldiggjøre, {
        replySed: (replySed as X008Sed),
        personName
      }
    )
    dispatch(setValidation(clonedValidation))
  })

  const setBegrunnelseType = (begrunnelseType: string) => {
    dispatch(updateReplySed('begrunnelseType', begrunnelseType.trim()))
    if (begrunnelseType !== 'annet') {
      dispatch(updateReplySed('begrunnelseAnnen', ''))
    }
    if (validation[namespace + '-begrunnelseType']) {
      dispatch(resetValidation(namespace + '-begrunnelseType'))
    }
  }

  const setBegrunnelseAnnen = (begrunnelseAnnen: string) => {
    dispatch(updateReplySed('begrunnelseAnnen', begrunnelseAnnen.trim()))
    if (validation[namespace + '-begrunnelseAnnen']) {
      dispatch(resetValidation(namespace + '-begrunnelseAnnen'))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label} ID: {(replySed as X008Sed)?.kansellerSedId} ({(replySed as X008Sed)?.utstedelsesdato})
        </Heading>
        <HGrid columns={"2fr 1fr"} gap="space-16" align="start">
          <RadioGroup
            value={(replySed as X008Sed).begrunnelseType}
            data-testid={namespace + '-begrunnelseType'}
            error={validation[namespace + '-begrunnelseType']?.feilmelding}
            id={namespace + '-begrunnelseType'}
            legend={t('label:begrunnelse')}
            onChange={setBegrunnelseType}
          >
            <VStack gap="space-4">
              <RadioPanel value='personen_er_død'>{t('el:option-ugyldiggjøre-01')}</RadioPanel>
              <RadioPanel value='saken_ble_feilaktig_sendt_til_dere'>{t('el:option-ugyldiggjøre-02')}</RadioPanel>
              <RadioPanel value='feilaktig_informasjon_levert'>{t('el:option-ugyldiggjøre-03')}</RadioPanel>
              <RadioPanel value='saken_ble_revurdert_og_sed_en_er_ikke_lenger_vurdert_som_ugyldig'>{t('el:option-ugyldiggjøre-04')}</RadioPanel>
              <RadioPanel value='det_nasjonale_vedtaket_ble_bestridt_av_kunden_Mer_informasjon_vil_følge_etter_endelig_beslutning_om_bestridelsen'>{t('el:option-ugyldiggjøre-05')}</RadioPanel>
              <RadioPanel value='det_nasjonale_vedtaket_ble_bestridt_av_kunden_Det_vil_ikke_sendes_flere_sed_er'>{t('el:option-ugyldiggjøre-06')}</RadioPanel>
              <RadioPanel value='annet'>{t('el:option-ugyldiggjøre-99')}</RadioPanel>
            </VStack>
          </RadioGroup>
          <div />
        </HGrid>

        {(replySed as X008Sed).begrunnelseType === 'annet' && (
          <Input
            error={validation[namespace + '-begrunnelseAnnen']?.feilmelding}
            namespace={namespace}
            id='begrunnelseAnnen'
            label={t('label:begrunnelseAnnen')}
            hideLabel
            onChanged={setBegrunnelseAnnen}
            required
            value={(replySed as X008Sed).begrunnelseAnnen}
          />
        )}
      </VStack>
    </Box>
  )
}

export default Ugyldiggjøre
