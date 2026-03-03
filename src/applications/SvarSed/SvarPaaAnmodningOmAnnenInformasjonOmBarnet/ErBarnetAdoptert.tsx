import {VStack, Box, Heading, Radio, RadioGroup, HStack} from '@navikt/ds-react'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import React from 'react'
import {useAppDispatch, useAppSelector} from 'store'
import {
  AnnenInformasjonBarnet_V43,
  AnnenInformasjonBarnet_V42, JaNei
} from "declarations/sed";
import TextArea from "components/Forms/TextArea";
import {useTranslation} from "react-i18next";
import useUnmount from "../../../hooks/useUnmount";
import performValidation from "../../../utils/performValidation";
import {
  validateErAdoptert, ValidationAnnenInformasjonBarnetProps
} from "./validation";
import {setValidation} from "../../../actions/validation";
import commonStyles from 'assets/css/common.module.css'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const ErBarnetAdoptert: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed,
  options
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-anneninformasjonbarnet-er-adoptert`
  const target = `anmodningOmMerInformasjon.svar.annenInformasjonBarnet`
  const CDM_VERSJON = options.cdmVersjon
  const annenInformasjonBarnet: AnnenInformasjonBarnet_V43 | AnnenInformasjonBarnet_V42 | undefined = _.get(replySed, target)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationAnnenInformasjonBarnetProps>(clonedValidation, namespace, validateErAdoptert, {
      annenInformasjonBarnet,
      CDM_VERSJON
    }, true)
    dispatch(setValidation(clonedValidation))
  })

  const setAnnenInformasjonBarnetProperty = (property: string, value: string) => {
    dispatch(updateReplySed(`${target}.${property}`, value.trim()))
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>
        {CDM_VERSJON === "4.2" &&
          <Box padding="space-16" background="neutral-soft" borderWidth="1" borderColor="neutral-subtle">
            <TextArea
              error={validation[namespace + '-er-adoptert']?.feilmelding}
              namespace={namespace}
              id='er-adoptert'
              label={t('label:er-barnet-adoptert')}
              hideLabel={true}
              onChanged={(v) => setAnnenInformasjonBarnetProperty('eradoptertfritekst', v)}
              value={(annenInformasjonBarnet as AnnenInformasjonBarnet_V42)?.eradoptertfritekst ?? ''}
            />
          </Box>
        }
        {(parseFloat(CDM_VERSJON) >= 4.3) &&
          <Box padding="space-16" background="neutral-soft" borderWidth="1" borderColor="neutral-subtle">
            <RadioGroup
              legend={t('label:er-barnet-adoptert')}
              hideLegend={true}
              value={(annenInformasjonBarnet as AnnenInformasjonBarnet_V43)?.erAdoptert ?? ''}
              data-testid={namespace}
              error={validation[namespace + '-er-adoptert']?.feilmelding}
              id={namespace + '-er-adoptert'}
              onChange={(e:string) => setAnnenInformasjonBarnetProperty("erAdoptert",  e as JaNei)}
            >
              <HStack gap="space-16">
                <Radio className={commonStyles.radioPanel} value='ja'>
                  Ja
                </Radio>
                <Radio className={commonStyles.radioPanel} value='nei'>
                  Nei
                </Radio>
              </HStack>
            </RadioGroup>
          </Box>
        }
      </VStack>
    </Box>
  );
}

export default ErBarnetAdoptert
