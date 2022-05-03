import { Checkbox } from '@navikt/ds-react'
import { ActionWithPayload } from '@navikt/fetch'
import { PaddedDiv } from '@navikt/hoykontrast'
import { resetValidation } from 'actions/validation'
import { validateFormål, ValidationFormålProps } from 'applications/SvarSed/Formål/validation'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { FSed, ReplySed } from 'declarations/sed'
import { UpdateReplySedPayload, Validation } from 'declarations/types'
import useGlobalValidation from 'hooks/useGlobalValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'

const CheckboxDiv = styled.div`
 display: inline-block;
 width: 100%;
`

interface FormålProps {
  parentNamespace: string
  replySed: ReplySed | null | undefined
  updateReplySed: (needle: string, value: any) => ActionWithPayload<UpdateReplySedPayload>
}

interface FormålSelector {
  validation: Validation
}

const mapState = (state: State): FormålSelector => ({
  validation: state.validation.status
})

const Formål: React.FC<FormålProps> = ({
  replySed,
  parentNamespace,
  updateReplySed
}: FormålProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: any = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const formaal: Array<string> | undefined = (replySed as FSed)?.formaal
  const namespace: string = `${parentNamespace}-formål`
  const performValidation = useGlobalValidation<ValidationFormålProps>(validateFormål, namespace)

  useEffect(() => {
    return () => {
      performValidation({
        formaal: (replySed as FSed).formaal
      })
    }
  }, [])

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

  const onItemsChanged = (item: string, checked: boolean) => {
    let newFormaals: Array<string> | undefined = _.cloneDeep(formaal)
    if (_.isNil(newFormaals)) {
      newFormaals = []
    }
    if (checked) {
      newFormaals.push(item)
    } else {
      newFormaals = _.reject(newFormaals, f => f === item)
    }
    dispatch(updateReplySed('formaal', newFormaals))
    standardLogger('svarsed.fsed.formal.' + checked ? 'add' : 'remove', { item })
    dispatch(resetValidation(namespace))
  }

  return (
    <PaddedDiv style={{ columns: '2' }}>
      {formaalOptions.map(f => (
        <CheckboxDiv key={f.value}>
          <Checkbox
            error={validation[namespace + '-checkbox']?.feilmelding}
            checked={formaal?.indexOf(f.value) >= 0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onItemsChanged(f.value, e.target.checked)}
          >
            {f.label}
          </Checkbox>
        </CheckboxDiv>
      ))}
      {validation[namespace + '-checkbox']?.feilmelding && (
        <div role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium navds-label'>
          {validation[namespace + '-checkbox']?.feilmelding}
        </div>
      )}
    </PaddedDiv>
  )
}

export default Formål
