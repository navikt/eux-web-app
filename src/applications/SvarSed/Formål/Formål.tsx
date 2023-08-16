import { Checkbox, Heading } from '@navikt/ds-react'
import { PaddedDiv } from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import { validateFormål, ValidationFormålProps } from 'applications/SvarSed/Formål/validation'
import { MainFormProps } from 'applications/SvarSed/MainForm'
import ErrorLabel from 'components/Forms/ErrorLabel'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { FSed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'
import performValidation from 'utils/performValidation'
import { isF001Sed } from 'utils/sed'

const CheckboxDiv = styled.div`
 display: inline-block;
 width: 100%;
`

interface FormålSelector {
  validation: Validation
}

const mapState = (state: State): FormålSelector => ({
  validation: state.validation.status
})

const Formål: React.FC<MainFormProps> = ({
  label,
  replySed,
  parentNamespace,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: any = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const formaal: Array<string> | undefined = (replySed as FSed)?.formaal
  const namespace: string = `${parentNamespace}-formål`

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationFormålProps>(clonedValidation, namespace, validateFormål, {
      formaal: (replySed as FSed).formaal
    }, true)
    dispatch(setValidation(clonedValidation))
  })

  let formaalOptions: Options = [
    { label: t('el:option-formaal-mottak'), value: 'mottak_av_søknad_om_familieytelser' },
    { label: t('el:option-formaal-informasjon'), value: 'informasjon_om_endrede_forhold' },
    { label: t('el:option-formaal-kontroll'), value: 'svar_på_kontroll_eller_årlig_kontroll' },
    { label: t('el:option-formaal-anmodning'), value: 'svar_på_anmodning_om_informasjon' },
    { label: t('el:option-formaal-vedtak'), value: 'vedtak' },
    { label: t('el:option-formaal-motregning'), value: 'motregning' },
    { label: t('el:option-formaal-prosedyre'), value: 'prosedyre_ved_uenighet' },
    { label: t('el:option-formaal-refusjon'), value: 'refusjon_i_henhold_til_artikkel_58_i_forordningen' }
  ]

  let formaalOptionsF001: Options = [
    { label: t('el:option-formaal-mottak'), value: 'mottak_av_søknad_om_familieytelser' },
    { label: t('el:option-formaal-informasjon'), value: 'informasjon_om_endrede_forhold' },
    { label: t('el:option-formaal-anmodning-om-kontroll'), value: 'anmodning_om_kontroll_eller_årlig_kontroll' },
    { label: t('el:option-formaal-anmodning-om-informasjon'), value: 'anmodning_om_informasjon' },
    { label: t('el:option-formaal-vedtak'), value: 'vedtak' },
    { label: t('el:option-formaal-motregning'), value: 'motregning' },
    { label: t('el:option-formaal-refusjon'), value: 'refusjon_i_henhold_til_artikkel_58_i_forordningen' }
  ]

  if (isF001Sed(replySed)) {
    formaalOptions = formaalOptionsF001
  }

  const setFormal = (item: string, checked: boolean) => {
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
    dispatch(resetValidation(namespace + '-checkbox'))
  }

  return (
    <>
      <PaddedDiv>
        <Heading size='small'>
          {label}
        </Heading>
      </PaddedDiv>
      <PaddedDiv
        tabIndex={0}
        id={namespace + '-checkbox'}
        style={{ columns: '2' }}
      >
        {formaalOptions.map(f => (
          <CheckboxDiv key={f.value}>
            <Checkbox
              error={validation[namespace + '-checkbox']?.feilmelding}
              checked={formaal?.indexOf(f.value) >= 0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormal(f.value, e.target.checked)}
            >
              {f.label}
            </Checkbox>
          </CheckboxDiv>
        ))}
        <ErrorLabel error={validation[namespace + '-checkbox']?.feilmelding} />
      </PaddedDiv>
    </>
  )
}

export default Formål
