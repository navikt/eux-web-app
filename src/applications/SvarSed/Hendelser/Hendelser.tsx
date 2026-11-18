import { Box, Checkbox, CheckboxGroup, Heading, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { State } from 'declarations/reducers'
import { Periode } from 'declarations/sed'
import { HendelseType } from 'declarations/u'
import { U008Sed } from 'declarations/u008'
import { U010Sed } from 'declarations/u010'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { isU008Sed } from 'utils/sed'
import {
  ANDRE_HENDELSER,
  INGEN_HENDELSER,
  validateHendelser,
  ValidationHendelserProps
} from './validation'

const HENDELSE_TYPER: Array<HendelseType> = [
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

const Hendelser: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-bruker-hendelser`
  const sed = replySed as U010Sed | U008Sed
  const hendelser = sed.hendelser
  // U008 (3.2.2) has no periode, but an extra "ingen" option
  const erU008 = isU008Sed(sed)
  const hendelseTyper: Array<HendelseType> = erU008 ? [...HENDELSE_TYPER, INGEN_HENDELSER] : HENDELSE_TYPER
  const harAndreHendelser = hendelser?.typer?.includes(ANDRE_HENDELSER) ?? false

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationHendelserProps>(
      clonedValidation, namespace, validateHendelser, { replySed: sed }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const setPeriode = (periode: Periode, id: string) => {
    dispatch(updateReplySed('hendelser.periode', periode))
    if (validation[`${namespace}-periode-${id}`]) {
      dispatch(resetValidation(`${namespace}-periode-${id}`))
    }
  }

  const setTyper = (nyeTyper: Array<HendelseType>) => {
    const forrigeTyper: Array<HendelseType> = hendelser?.typer ?? []
    const ingenValgtNaa = nyeTyper.includes(INGEN_HENDELSER) && !forrigeTyper.includes(INGEN_HENDELSER)
    // "ingen" excludes all other hendelser
    if (ingenValgtNaa) {
      dispatch(updateReplySed('hendelser.typer', [INGEN_HENDELSER]))
      dispatch(updateReplySed('hendelser.andreHendelser', undefined))
      if (validation[`${namespace}-typer`]) {
        dispatch(resetValidation(`${namespace}-typer`))
      }
      return
    }
    const valgteTyper = nyeTyper.filter(type => type !== INGEN_HENDELSER)
    // andre_omstendigheter is controlled by the separate AndreHendelser component
    const typer: Array<HendelseType> = harAndreHendelser ? [...valgteTyper, ANDRE_HENDELSER] : valgteTyper
    dispatch(updateReplySed('hendelser.typer', typer.length > 0 ? typer : undefined))
    if (validation[`${namespace}-typer`]) {
      dispatch(resetValidation(`${namespace}-typer`))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size="small">{label}</Heading>
        {!erU008 && (
          <>
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
              value={(hendelser as U010Sed['hendelser'])?.periode}
            />
          </>
        )}
        <CheckboxGroup
          id={`${namespace}-typer`}
          legend={t('label:hendelser')}
          error={validation[`${namespace}-typer`]?.feilmelding}
          value={(hendelser?.typer ?? []).filter(type => type !== ANDRE_HENDELSER)}
          onChange={setTyper}
        >
          {hendelseTyper.map((type) => (
            <Checkbox key={type} value={type}>
              {t(`el:option-hendelse-${type}`)}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </VStack>
    </Box>
  )
}

export default Hendelser
