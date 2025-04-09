import {Box, Heading, VStack} from '@navikt/ds-react'
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
  const forespoersel: any | undefined = (replySed as S040Sed)?.forespoersel
  const namespace: string = `${parentNamespace}-forespoersel`

  console.log(forespoersel)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationForespoerselProps>(clonedValidation, namespace, validateForespoersel, {
      forespoersel: (replySed as S040Sed).forespoersel
    }, true)
    dispatch(setValidation(clonedValidation))
  })

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
          <PeriodeInput
            namespace={namespace + '-periode'}
            periodeType="withcheckbox"
            error={{
              startdato: validation[namespace + '-periode-startdato']?.feilmelding,
              sluttdato: validation[namespace + '-periode-sluttdato']?.feilmelding
            }}
            hideLabel={false}
            setPeriode={(p: Periode) => {console.log(p)}}
            value={forespoersel?.periode}
          />
        </Box>
      </VStack>
    </Box>
  )
}

export default Forespoersel
