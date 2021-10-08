import { updateReplySed } from 'actions/svarpased'
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
}

interface FormaalSelector {
  highContrast: boolean
  replySed: ReplySed | null | undefined
  validation: Validation
}

const mapState = (state: State): FormaalSelector => ({
  highContrast: state.ui.highContrast,
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const Formaal: React.FC<FormaalProps> = ({
  parentNamespace
}: FormaalProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    highContrast,
    replySed,
    validation
  }: any = useSelector<State, FormaalSelector>(mapState)
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
        feil={validation[namespace]?.feilmelding}
        highContrast={highContrast}
        initialValues={formaal}
        itemLabel={t('label:formål')}
        namespace={namespace}
        options={formaalOptions}
        onChange={onItemsChanged}
        title={t('label:velg-formaal')}
      />
    </div>
  )
}

export default Formaal
