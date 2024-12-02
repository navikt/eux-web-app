import {VStack, Box, Heading, Select} from '@navikt/ds-react'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import React from 'react'
import {useAppDispatch, useAppSelector} from 'store'
import {
  AnnenInformasjonBarnet_V43,
  AnnenInformasjonBarnet_V42
} from "declarations/sed";
import {TextAreaDiv} from "components/StyledComponents";
import TextArea from "components/Forms/TextArea";
import {useTranslation} from "react-i18next";
import {Options} from "../../../declarations/app";
import useUnmount from "../../../hooks/useUnmount";
import performValidation from "../../../utils/performValidation";
import {validateBarnetsSivilstand, validateErAdoptert, ValidationAnnenInformasjonBarnetProps} from "./validation";
import {setValidation} from "../../../actions/validation";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const BarnetsSivilstand: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed,
  options
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-anneninformasjonbarnet-barnets-sivilstand`
  const target = `anmodningOmMerInformasjon.svar.annenInformasjonBarnet`
  const CDM_VERSJON = options.cdmVersjon
  const annenInformasjonBarnet: AnnenInformasjonBarnet_V43 | AnnenInformasjonBarnet_V42 | undefined = _.get(replySed, target)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationAnnenInformasjonBarnetProps>(clonedValidation, namespace, validateBarnetsSivilstand, {
      annenInformasjonBarnet,
      CDM_VERSJON
    }, true)
    dispatch(setValidation(clonedValidation))
  })

  const setAnnenInformasjonBarnetProperty = (property: string, value: string) => {
    dispatch(updateReplySed(`${target}.${property}`, value.trim()))
  }

  const sivilstandOptions: Options = [
    { label: t('el:option-familierelasjon-gift'), value: 'gift' },
    { label: t('el:option-familierelasjon-samboer'), value: 'samboer' },
    { label: t('el:option-familierelasjon-registrert_partnerskap'), value: 'registrert_partnerskap' },
    { label: t('el:option-familierelasjon-skilt'), value: 'skilt' },
    { label: t('el:option-familierelasjon-aleneforelder'), value: 'aleneforelder' },
    { label: t('el:option-familierelasjon-annet'), value: 'annet' }
  ]

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        {CDM_VERSJON === "4.2" &&
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
            <TextAreaDiv>
              <TextArea
                error={validation[namespace + '-barnets-sivilstand']?.feilmelding}
                namespace={namespace}
                id='barnets-sivilstand'
                label={t('label:barnets-sivilstand')}
                hideLabel={true}
                onChanged={(v) => setAnnenInformasjonBarnetProperty('sivilstandfritekst', v)}
                value={(annenInformasjonBarnet as AnnenInformasjonBarnet_V42)?.sivilstandfritekst ?? ''}
              />
            </TextAreaDiv>
          </Box>
        }
        {CDM_VERSJON === "4.3" &&
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
            <Select
              id={namespace + '-barnets-sivilstand'}
              name={namespace + '-barnets-sivilstand'}
              error={validation[namespace + '-barnets-sivilstand']?.feilmelding}
              label={t('label:barnets-sivilstand')}
              hideLabel={true}
              value={(annenInformasjonBarnet as AnnenInformasjonBarnet_V43)?.sivilstand ?? ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAnnenInformasjonBarnetProperty('sivilstand', e.target.value)}
            >
              <option value="" key="">{t('el:placeholder-select-default')}</option>
              {sivilstandOptions.map((o) => {
                return <option value={o.value} key={o.value}>{o.label}</option>
              })}
            </Select>
          </Box>
        }
      </VStack>
    </Box>
  )
}

export default BarnetsSivilstand
