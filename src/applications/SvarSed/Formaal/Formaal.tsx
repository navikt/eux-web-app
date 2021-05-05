import { setReplySed } from 'actions/svarpased'
import { Options } from 'declarations/app'
import { FSed, ReplySed } from 'declarations/sed'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema/lib/feiloppsummering'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import Stack from 'components/Stack/Stack'

interface FormaalProps {
  feil: FeiloppsummeringFeil | undefined
  highContrast: boolean
  replySed: ReplySed
}

const Formaal: React.FC<FormaalProps> = ({
  feil,
  highContrast,
  replySed
}: FormaalProps) => {
  const { t } = useTranslation()
  const formaal: Array<string> = (replySed as FSed)?.formaal
  const dispatch = useDispatch()
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

  const saveChanges = (newFormaals: Array<string>) => {
    dispatch(setReplySed({
      ...replySed,
      formaal: newFormaals
    }))
  }

  return (
    <Stack
      feil={feil}
      highContrast={highContrast}
      initialValues={formaal}
      itemLabel={t('label:formål')}
      namespace='formål'
      options={formaalOptions}
      onChange={saveChanges}
      title={t('label:velg-formaal')}
    />
  )
}

export default Formaal
