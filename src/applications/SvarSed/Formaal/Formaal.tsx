import { resetValidation } from 'actions/validation'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { FSed, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { standardLogger } from 'metrics/loggers'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Stack from 'components/Stack/Stack'

interface FormaalProps {
  parentNamespace: string
  replySed: ReplySed | null | undefined
  updateReplySed: (needle: string, value: any) => void
}

interface FormaalSelector {
  validation: Validation
}

const mapState = (state: State): FormaalSelector => ({
  validation: state.validation.status
})

const Formaal: React.FC<FormaalProps> = ({
  replySed,
  parentNamespace,
  updateReplySed
}: FormaalProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: any = useSelector<State, FormaalSelector>(mapState)
  const dispatch = useDispatch()
  const formaal: Array<string> = (replySed as FSed)?.formaal
  const namespace: string = `${parentNamespace}-formål`

  const formaalOptions: Options = [
    { label: t('el:option-formaal-1'), value: 'mottak_av_søknad_om_familieytelser' },
    { label: t('el:option-formaal-2'), value: 'informasjon_om_endrede_forhold' },
    { label: t('el:option-formaal-3'), value: 'svar_på_kontroll_eller_årlig_kontroll' },
    { label: t('el:option-formaal-4'), value: 'svar_på_anmodning_om_informasjon' },
    { label: t('el:option-formaal-5'), value: 'vedtak' },
    { label: t('el:option-formaal-6'), value: 'motregning' },
    { label: t('el:option-formaal-7'), value: 'prosedyre_ved_uenighet' },
    { label: t('el:option-formaal-8'), value: 'refusjon_i_henhold_til_artikkel_58_i_forordningen' }
  ]

  const onItemsChanged = (newFormaals: Array<string>, action: 'add' | 'remove', item: string) => {
    dispatch(updateReplySed('formaal', newFormaals))
    standardLogger('svarsed.fsed.formal.' + action, { item: item })
    dispatch(resetValidation(namespace))
  }

  return (
    <div id={namespace}>
      <Stack
        key={namespace}
        error={validation[namespace]?.feilmelding}
        initialValues={formaal}
        itemLabel={t('label:formål')}
        namespace={namespace}
        options={formaalOptions}
        onChange={onItemsChanged}
        title={t('label:velg-formål')}
      />
    </div>
  )
}

export default Formaal
