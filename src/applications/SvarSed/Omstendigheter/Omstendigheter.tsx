import { Box, Checkbox, CheckboxGroup, Heading, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { State } from 'declarations/reducers'
import { Periode } from 'declarations/sed'
import { OmstendighetType, U010Sed } from 'declarations/u010'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import {
  ANDRE_OMSTENDIGHETER,
  validateOmstendigheter,
  ValidationOmstendigheterProps
} from './validation'

const OMSTENDIGHET_TYPER: Array<OmstendighetType> = [
  'den_arbeidsledige_får_jobb_eller_blir_selvstendig_næringsdrivende',
  'den_arbeidsledige_får_inntekt_fra_en_annen_yrkesaktivitet_enn_de_ovennevnte',
  'den_arbeidsledige_avslår_et_jobbtilbud',
  'den_arbeidsledige_avslår_å_delta_i_en_samtale_hos_arbeidsformidlingen',
  'den_arbeidsledige_avslår_å_delta_i_arbeidsavklaring',
  'den_arbeidsledige_er_arbeidsufør',
  'den_arbeidsledige_følger_ikke_kontrollprosedyrene',
  'den_arbeidsledige_er_ikke_tilgjengelig_for_arbeidsformidlingen'
]

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Omstendigheter: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-bruker-omstendigheter`
  const sed = replySed as U010Sed
  const omstendigheter = sed.omstendigheter
  const harAndreOmstendigheter = omstendigheter?.typer?.includes(ANDRE_OMSTENDIGHETER) ?? false

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationOmstendigheterProps>(
      clonedValidation, namespace, validateOmstendigheter, { replySed: sed }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const setPeriode = (periode: Periode, id: string) => {
    dispatch(updateReplySed('omstendigheter.periode', periode))
    if (validation[`${namespace}-periode-${id}`]) {
      dispatch(resetValidation(`${namespace}-periode-${id}`))
    }
  }

  const setTyper = (valgteTyper: Array<OmstendighetType>) => {
    // andre_omstendigheter is controlled by the separate AndreOmstendigheter component
    const typer: Array<OmstendighetType> = harAndreOmstendigheter ? [...valgteTyper, ANDRE_OMSTENDIGHETER] : valgteTyper
    dispatch(updateReplySed('omstendigheter.typer', typer.length > 0 ? typer : undefined))
    if (validation[`${namespace}-typer`]) {
      dispatch(resetValidation(`${namespace}-typer`))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size="small">{label}</Heading>
        <Heading size="xsmall" level="3">{t('label:periode')}</Heading>
        <PeriodeInput
          namespace={`${namespace}-periode`}
          error={{
            startdato: validation[`${namespace}-periode-startdato`]?.feilmelding,
            sluttdato: validation[`${namespace}-periode-sluttdato`]?.feilmelding,
            aapenPeriodeType: validation[`${namespace}-periode-aapenPeriodeType`]?.feilmelding
          }}
          hideLabel={false}
          setPeriode={setPeriode}
          value={omstendigheter?.periode}
        />
        <CheckboxGroup
          id={`${namespace}-typer`}
          legend={t('label:u010-omstendigheter')}
          error={validation[`${namespace}-typer`]?.feilmelding}
          value={(omstendigheter?.typer ?? []).filter(type => type !== ANDRE_OMSTENDIGHETER)}
          onChange={setTyper}
        >
          {OMSTENDIGHET_TYPER.map((type) => (
            <Checkbox key={type} value={type}>
              {t(`el:option-u010-omstendighet-${type}`)}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </VStack>
    </Box>
  )
}

export default Omstendigheter
