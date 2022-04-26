import { ActionWithPayload } from '@navikt/fetch'
import { resetValidation } from 'actions/validation'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { FSed, ReplySed } from 'declarations/sed'
import { UpdateReplySedPayload, Validation } from 'declarations/types'
import { standardLogger } from 'metrics/loggers'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Stack from 'components/Stack/Stack'
import { useAppDispatch, useAppSelector } from 'store'

interface FormaalProps {
  parentNamespace: string
  replySed: ReplySed | null | undefined
  updateReplySed: (needle: string, value: any) => ActionWithPayload<UpdateReplySedPayload>
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
  const { validation }: any = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const formaal: Array<string> = (replySed as FSed)?.formaal
  const namespace: string = `${parentNamespace}-formål`

  const formaalOptions: Options = [
    { label: t('el:option-formaal-mottak'), value: 'mottak_av_søknad_om_familieytelser' },
    { label: t('el:option-formaal-informasjon'), value: 'informasjon_om_endrede_forhold' },
    { label: t('el:option-formaal-kontroll'), value: 'svar_på_kontroll_eller_årlig_kontroll' },
    { label: t('el:option-formaal-anmodning'), value: 'svar_på_anmodning_om_informasjon' },
    { label: t('el:option-formaal-vedtak'), value: 'vedtak' },
    { label: t('el:option-formaal-motregning'), value: 'motregning' },
    { label: t('el:option-formaal-prosedyre'), value: 'prosedyre_ved_uenighet' },
    { label: t('el:option-formaal-refusjon'), value: 'refusjon_i_henhold_til_artikkel_58_i_forordningen' }
  ]

  const onItemsChanged = (newFormaals: Array<string>, action: 'add' | 'remove', item: string) => {
    dispatch(updateReplySed('formaal', newFormaals))
    standardLogger('svarsed.fsed.formal.' + action, { item })
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
