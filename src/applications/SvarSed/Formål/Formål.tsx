import {Box, Checkbox, Heading, VStack} from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { validateFormål, ValidationFormålProps } from 'applications/SvarSed/Formål/validation'
import { MainFormProps } from 'applications/SvarSed/MainForm'
import ErrorLabel from 'components/Forms/ErrorLabel'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import {Barn, F002Sed, FSed, UtbetalingTilInstitusjon} from 'declarations/sed'
import { Validation } from 'declarations/types'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { isF001Sed } from 'utils/sed'
import {setDeselectedMenu} from "../../../actions/svarsed";

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
  updateReplySed,
  CDM_VERSION
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
    { label: t('el:option-formaal-refusjon'), value: 'refusjon_ih ht_artikkel_58_i_forordning' }
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

    if(!checked){
      if((item === "refusjon_i_henhold_til_artikkel_58_i_forordningen" || item === "refusjon_ihht_artikkel_58_i_forordning") && CDM_VERSION && CDM_VERSION >= 4.4){
        dispatch(setDeselectedMenu("refusjon"))
      } else {
        dispatch(setDeselectedMenu(item))
      }
    } else {
      dispatch(setDeselectedMenu(undefined))
    }

    if(item === "vedtak" && !checked){
      dispatch(updateReplySed('vedtak', null));
      (replySed as F002Sed).barn?.forEach((barn: Barn, barnIndex: number) => {
        dispatch(updateReplySed('barn['+barnIndex+'].ytelser', []))
      })
    }

    if(item === "motregning" && !checked){
      dispatch(updateReplySed('motregninger', null));

      if(!_.find(newFormaals, f => f === "refusjon_i_henhold_til_artikkel_58_i_forordningen")){
        dispatch(updateReplySed('utbetalingTilInstitusjon', null))
      }
    }

    if(item === "motregning" && checked){
      let uti : UtbetalingTilInstitusjon =  {
          begrunnelse: '',
          id: 'NO:889640782',
          navn: 'The Norwegian Labour and Welfare Administration',
          kontoSepa: {
            iban: 'NO6476940520041',
            swift: 'DNBANOKKXXX'
          }
        }
      dispatch(updateReplySed('utbetalingTilInstitusjon', uti));
    }

    if(item === "prosedyre_ved_uenighet" && !checked){
      dispatch(updateReplySed('uenighet', null));
    }

    if((item === "refusjon_i_henhold_til_artikkel_58_i_forordningen" || item === "refusjon_ihht_artikkel_58_i_forordning") && !checked){
      dispatch(updateReplySed('refusjonskrav', null))
      dispatch(updateReplySed('refusjon', null))
      if(!_.find(newFormaals, f => f === "motregning")){
        dispatch(updateReplySed('utbetalingTilInstitusjon', null))
      }
    }

    dispatch(updateReplySed('formaal', newFormaals))
    dispatch(resetValidation(namespace + '-checkbox'))
  }

  return (
    <Box padding="4" background="bg-default">
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        <Box
          tabIndex={0}
          id={namespace + '-checkbox'}
          style={{ columns: '2' }}
        >
          {formaalOptions.map(f => (
            <Checkbox
              error={validation[namespace + '-checkbox']?.feilmelding}
              checked={formaal?.indexOf(f.value) >= 0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormal(f.value, e.target.checked)}
            >
              {f.label}
            </Checkbox>
          ))}
        </Box>
        <ErrorLabel error={validation[namespace + '-checkbox']?.feilmelding} />
      </VStack>
    </Box>
  )
}

export default Formål
