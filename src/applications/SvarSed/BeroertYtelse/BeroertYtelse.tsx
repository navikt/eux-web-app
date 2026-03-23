import { Box, Heading, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { validateBeroertYtelse, ValidationBeroertYtelseProps } from 'applications/SvarSed/BeroertYtelse/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Select from 'components/Forms/Select'
import { Option, Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { H120Sed } from 'declarations/h120'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const BeroertYtelse: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-beroertytelse`
  const sed = replySed as H120Sed

  const beroertYtelseOptions: Options = [
    { label: t('el:option-h120-beroertytelse-sykepenger_som_kontantytelse_i_forbindelse_med_arbeidsuførhet'), value: 'sykepenger_som_kontantytelse_i_forbindelse_med_arbeidsuførhet' },
    { label: t('el:option-h120-beroertytelse-foreldrepenger_til_mor_eller_far'), value: 'foreldrepenger_til_mor_eller_far' },
    { label: t('el:option-h120-beroertytelse-kontantytelser_ved_langtidspleie'), value: 'kontantytelser_ved_langtidspleie' },
    { label: t('el:option-h120-beroertytelse-uførepensjon'), value: 'uførepensjon' },
    { label: t('el:option-h120-beroertytelse-alderspensjon'), value: 'alderspensjon' },
    { label: t('el:option-h120-beroertytelse-etterlattepensjon'), value: 'etterlattepensjon' },
    { label: t('el:option-h120-beroertytelse-kontantytelser_ved_yrkesskade_eller_yrkessykdom_som_nevnt_i_artikkel_33_1_nr_987_2009'), value: 'kontantytelser_ved_yrkesskade_eller_yrkessykdom_som_nevnt_i_artikkel_33_1_nr_987_2009' },
    { label: t('el:option-h120-beroertytelse-adre_kontantytelser_ved_yrkesskade_eller_yrkessykdom'), value: 'adre_kontantytelser_ved_yrkesskade_eller_yrkessykdom' },
    { label: t('el:option-h120-beroertytelse-dagpenger'), value: 'dagpenger' },
    { label: t('el:option-h120-beroertytelse-førtidspensjon'), value: 'førtidspensjon' },
    { label: t('el:option-h120-beroertytelse-familieytelse'), value: 'familieytelse' },
    { label: t('el:option-h120-beroertytelse-spesiell_innskuddsfri_kontantytelse'), value: 'spesiell_innskuddsfri_kontantytelse' },
    { label: t('el:option-h120-beroertytelse-sykepenger_kontantytelser'), value: 'sykepenger_kontantytelser' }
  ]

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationBeroertYtelseProps>(
      clonedvalidation, namespace, validateBeroertYtelse, {
        replySed: sed,
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const isAWODYtelse = (ytelse: string) =>
    ytelse === 'kontantytelser_ved_yrkesskade_eller_yrkessykdom_som_nevnt_i_artikkel_33_1_nr_987_2009' ||
    ytelse === 'adre_kontantytelser_ved_yrkesskade_eller_yrkessykdom'

  const setBeroertYtelse = (value: string) => {
    const trimmed = value.trim()
    dispatch(updateReplySed('beroertYtelse', trimmed))
    if (trimmed !== 'familieytelse' && sed.familie) {
      dispatch(updateReplySed('familie', undefined))
    }
    if (!isAWODYtelse(trimmed) && sed.arbeidsulykkeyrkessykdom) {
      dispatch(updateReplySed('arbeidsulykkeyrkessykdom', undefined))
    }
    if (validation[namespace + '-beroertYtelse']) {
      dispatch(resetValidation(namespace + '-beroertYtelse'))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <Select
          data-testid={namespace + '-beroertYtelse'}
          error={validation[namespace + '-beroertYtelse']?.feilmelding}
          id={namespace + '-beroertYtelse'}
          label={t('label:type-ytelse-medisinsk-informasjon')}
          menuPortalTarget={document.body}
          onChange={(o: unknown) => setBeroertYtelse((o as Option).value)}
          options={beroertYtelseOptions}
          required
          value={_.find(beroertYtelseOptions, o => o.value === sed.beroertYtelse)}
          defaultValue={_.find(beroertYtelseOptions, o => o.value === sed.beroertYtelse)}
        />
      </VStack>
    </Box>
  )
}

export default BeroertYtelse
