import {Box, Heading, HGrid, Radio, RadioGroup, VStack} from '@navikt/ds-react'
import { setValidation } from 'actions/validation'
import { MainFormProps } from 'applications/SvarSed/MainForm'
import { State } from 'declarations/reducers'
import {Periode, S046Sed} from 'declarations/sed'
import { Validation } from 'declarations/types'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import {validateVedtakS046, ValidationVedtakS046Props} from "./validation";
import PeriodeInput from "../../../components/Forms/PeriodeInput";

interface VedtakS046Selector {
  validation: Validation
}

const mapState = (state: State): VedtakS046Selector => ({
  validation: state.validation.status
})

const VedtakS046: React.FC<MainFormProps> = ({
   label,
   replySed,
   parentNamespace,
   updateReplySed
 }: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: any = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const informasjonOmUtbetaling: any | undefined = (replySed as S046Sed)?.sykdom.informasjonOmUtbetaling
  const namespace: string = `${parentNamespace}-sykdom-informasjonOmUtbetaling`

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationVedtakS046Props>(clonedValidation, namespace, validateVedtakS046, {
      informasjonOmUtbetaling: (replySed as S046Sed).sykdom.informasjonOmUtbetaling
    }, true)
    dispatch(setValidation(clonedValidation))
  })

  const setInformasjonOmUtbetalingProperty = (prop: string, value: string | Periode) => {
    dispatch(updateReplySed('sykdom.informasjonOmUtbetaling.' + prop, value))
  }

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
          <HGrid columns={2} gap="4">
            <RadioGroup
              value={informasjonOmUtbetaling?.ytelse?.type}
              legend={t('label:type-ytelse-det-gjelder')}
              onChange={(v: string) => setInformasjonOmUtbetalingProperty("ytelse.type", v)}
              id={namespace + '-ytelse-type'}
              error={validation[namespace + '-ytelse-type']?.feilmelding}
            >
              <Radio value="sykdom">{t('label:sykdom')}</Radio>
              <Radio value="foreldrepenger_til_mor">{t('label:foreldrepenger-til-mor')}</Radio>
              <Radio value="foreldrepenger_til_far">{t('label:foreldrepenger-til-far')}</Radio>
            </RadioGroup>
            <RadioGroup
              value={informasjonOmUtbetaling?.vedtak?.type}
              legend={t('label:vedtak')}
              onChange={(v: string) => setInformasjonOmUtbetalingProperty("vedtak.type", v)}
              id={namespace + '-vedtak-type'}
              error={validation[namespace + '-vedtak-type']?.feilmelding}
            >
              <Radio value="utbetale_kontantytelser">{t('label:utbetalte-kontantytelser')}</Radio>
              <Radio value="ikke_utbetale_kontantytelser_kopi_er_vedlagt">{t('label:ikke_utbetale_kontantytelser')}</Radio>
            </RadioGroup>
          </HGrid>
        </Box>
        <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
          <PeriodeInput
            namespace={namespace + '-forespoerselomperiode'}
            periodeType="withcheckbox"
            error={{
              startdato: validation[namespace + '-forespoerselomperiode-startdato']?.feilmelding,
              sluttdato: validation[namespace + '-forespoerselomperiode-sluttdato']?.feilmelding
            }}
            hideLabel={false}
            setPeriode={(p: Periode) => setInformasjonOmUtbetalingProperty("forespoerselomperiode", p)}
            value={informasjonOmUtbetaling?.forespoerselomperiode}
          />
        </Box>
      </VStack>
    </Box>
  )
}

export default VedtakS046
