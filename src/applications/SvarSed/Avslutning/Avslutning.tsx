import {Box, Heading, HStack, Radio, RadioGroup, Spacer, VStack} from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { validateAvslutning, ValidationAvslutningProps } from 'applications/SvarSed/Avslutning/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import DateField from 'components/DateField/DateField'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { Option, Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { AvslutningsType, X001Sed } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import commonStyles from "assets/css/common.module.css"

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Avslutning: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-avslutning`

  const begrunnelseOptions: Options = [
    { label: t('el:option-avslutting-begrunnelse-01'), value: 'saken_er_løst' },
    { label: t('el:option-avslutting-begrunnelse-02'), value: 'saken_ble_feilaktig_opprettet' },
    { label: t('el:option-avslutting-begrunnelse-03'), value: 'saken_ble_opprettet_som_følge_av_falske_opplysninger' },
    { label: t('el:option-avslutting-begrunnelse-04'), value: 'personen_er_død' },
    { label: t('el:option-avslutting-begrunnelse-05'), value: 'administrativ_kontroll_estimerte_kostnader_er_for_høye_flere_anmodning_vil_ikke_sendes' },
    { label: t('el:option-avslutting-begrunnelse-06'), value: 'legeundersøkelse_estimerte_kostnader_er_for_høye_flere_forespørsler_vil_ikke_bli_sendt' },
    { label: t('el:option-avslutting-begrunnelse-07'), value: 'gjeldende_lovgivning_det_ble_oppnådd_enighet_om_anmodningen_om_unntak' },
    { label: t('el:option-avslutting-begrunnelse-08'), value: 'gjeldende_lovgivning_fastsettelsen_ble_endelig_ingen_reaksjon_innen_2_måneder' },
    { label: t('el:option-avslutting-begrunnelse-09'), value: 'lovvalg_30_dager_siden_melding_om_relevant_informasjon' },
    { label: t('el:option-avslutting-begrunnelse-10'), value: 'lovvalg_30_dager_siden_melding_om_utstasjonering' },
    { label: t('el:option-avslutting-begrunnelse-11'), value: 'gjeldende_lovgivning_30_dager_siden_kunngjøring_om_gjeldende_lovgivning' },
    { label: t('el:option-avslutting-begrunnelse-12'), value: 'gjeldende_lovgivning_30_dager_siden_svar_på_anmodning_om_mer_informasjon' },
    { label: t('el:option-avslutting-begrunnelse-13'), value: 'innkreving_r005_endelig_forespørsel_om_restanser_etter_2_måneder' },
    { label: t('el:option-avslutting-begrunnelse-99'), value: 'annet' }
  ]

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationAvslutningProps>(
      clonedvalidation, namespace, validateAvslutning, {
        replySed: (replySed as X001Sed),
        personName
      }
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setAvslutningDato = (avslutningDato: string) => {
    dispatch(updateReplySed('avslutningDato', avslutningDato.trim()))
    if (validation[namespace + '-avslutningDato']) {
      dispatch(resetValidation(namespace + '-avslutningDato'))
    }
  }

  const setAvslutningType = (avslutningType: AvslutningsType) => {
    dispatch(updateReplySed('avslutningType', avslutningType.trim()))
    if (validation[namespace + '-avslutningType']) {
      dispatch(resetValidation(namespace + '-avslutningType'))
    }
  }

  const setBegrunnelse = (begrunnelseType: string) => {
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
    <Box padding="4">
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        <HStack>
            <DateField
              error={validation[namespace + '-avslutningDato']?.feilmelding}
              id='avslutningDato'
              namespace={namespace}
              label={t('label:avslutningdato')}
              onChanged={setAvslutningDato}
              required
              dateValue={(replySed as X001Sed).avslutningDato}
            />
        </HStack>
        <RadioGroup
          value={(replySed as X001Sed).avslutningType}
          data-no-border
          data-testid={namespace + '-avslutningType'}
          error={validation[namespace + '-avslutningType']?.feilmelding}
          id={namespace + '-avslutningType'}
          legend={t('label:avslutningtype')}
          required
          name={namespace + '-avslutningType'}
          onChange={setAvslutningType}
        >
          <HStack gap="4">
            <Radio className={commonStyles.radioPanel} value='manuell'>
              {t('label:manuell')}
            </Radio>
            <Radio className={commonStyles.radioPanel} value='automatisk'>
              {t('label:automatisk')}
            </Radio>
            <Spacer/>
            <Spacer/>
          </HStack>
        </RadioGroup>
        <Select
          data-testid={namespace + '-begrunnelse'}
          error={validation[namespace + '-begrunnelse']?.feilmelding}
          id={namespace + '-begrunnelse'}
          label={t('label:begrunnelse')}
          menuPortalTarget={document.body}
          onChange={(o: unknown) => setBegrunnelse((o as Option).value)}
          options={begrunnelseOptions}
          required
          value={_.find(begrunnelseOptions, b => b.value === (replySed as X001Sed).begrunnelseType)}
          defaultValue={_.find(begrunnelseOptions, b => b.value === (replySed as X001Sed).begrunnelseType)}
        />
        {(replySed as X001Sed).begrunnelseType === 'annet' && (
          <Input
            error={validation[namespace + '-begrunnelseAnnen']?.feilmelding}
            namespace={namespace}
            id='begrunnelseAnnen'
            label={t('label:begrunnelseAnnen')}
            hideLabel
            onChanged={setBegrunnelseAnnen}
            required
            value={(replySed as X001Sed).begrunnelseAnnen}
          />
        )}
      </VStack>
    </Box>
  )
}

export default Avslutning
