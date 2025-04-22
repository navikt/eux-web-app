import {Box, Heading, HGrid, Radio, RadioGroup, VStack} from '@navikt/ds-react'
import { setValidation } from 'actions/validation'
import { MainFormProps } from 'applications/SvarSed/MainForm'
import { State } from 'declarations/reducers'
import {Periode, S040Sed} from 'declarations/sed'
import { Validation } from 'declarations/types'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import {validateForespoersel, ValidationForespoerselProps} from "./validation";
import PeriodeInput from "../../../components/Forms/PeriodeInput";

interface ForespoerselSelector {
  validation: Validation
}

const mapState = (state: State): ForespoerselSelector => ({
  validation: state.validation.status
})

const Forespoersel: React.FC<MainFormProps> = ({
   label,
   replySed,
   parentNamespace,
   updateReplySed
 }: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: any = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const sykdom: any | undefined = (replySed as S040Sed)?.sykdom
  const namespace: string = `${parentNamespace}-forespoersel-sykdom`

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationForespoerselProps>(clonedValidation, namespace, validateForespoersel, {
      sykdom: (replySed as S040Sed).sykdom
    }, true)
    dispatch(setValidation(clonedValidation))
  })

  const setSykdomProperty = (prop: string, value: string | Periode) => {
    dispatch(updateReplySed('sykdom.' + prop, value))
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
              value={sykdom?.ytelse?.type}
              legend={t('label:type-ytelse-det-gjelder')}
              onChange={(v: string) => setSykdomProperty("ytelse.type", v)}
              id={namespace + '-ytelse-type'}
              error={validation[namespace + '-ytelse-type']?.feilmelding}
            >
              <Radio value="sykdom">{t('label:sykdom')}</Radio>
              <Radio value="foreldrepenger_til_mor">{t('label:foreldrepenger-til-mor')}</Radio>
              <Radio value="foreldrepenger_til_far">{t('label:foreldrepenger-til-far')}</Radio>
            </RadioGroup>
            <RadioGroup
              value={sykdom?.ytelse?.kontantellernatural}
              legend={t('label:kontant-eller-naturalytelse')}
              onChange={(v: string) => setSykdomProperty("ytelse.kontantellernatural", v)}
              id={namespace + '-ytelse-kontantellernatural'}
              error={validation[namespace + '-ytelse-kontantellernatural']?.feilmelding}
            >
              <Radio value="kontant">{t('label:kontant')}</Radio>
              <Radio value="natural">{t('label:natural')}</Radio>
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
            setPeriode={(p: Periode) => setSykdomProperty("forespoerselomperiode", p)}
            value={sykdom?.forespoerselomperiode}
          />
        </Box>
      </VStack>
    </Box>
  )
}

export default Forespoersel
