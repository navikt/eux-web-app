import {VStack, Box, Heading, HGrid} from '@navikt/ds-react'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import React from 'react'
import {useAppDispatch, useAppSelector} from 'store'
import {
  AnnenInformasjonBarnet_V43,
  AnnenInformasjonBarnet_V42, JaNei
} from "declarations/sed";
import {TextAreaDiv} from "components/StyledComponents";
import TextArea from "components/Forms/TextArea";
import {useTranslation} from "react-i18next";
import {RadioPanel, RadioPanelGroup} from "@navikt/hoykontrast";
import useUnmount from "../../../hooks/useUnmount";
import performValidation from "../../../utils/performValidation";
import {
  validateForsoergesAvDetOffentlige, ValidationAnnenInformasjonBarnetProps,
} from "./validation";
import {setValidation} from "../../../actions/validation";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const ForsoergesAvDetOffentlige: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed,
  options
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-anneninformasjonbarnet-forsoerges-av-det-offentlige`
  const target = `anmodningOmMerInformasjon.svar.annenInformasjonBarnet`
  const CDM_VERSJON = options.cdmVersjon
  const annenInformasjonBarnet: AnnenInformasjonBarnet_V43 | AnnenInformasjonBarnet_V42 | undefined = _.get(replySed, target)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationAnnenInformasjonBarnetProps>(clonedValidation, namespace, validateForsoergesAvDetOffentlige, {
      annenInformasjonBarnet,
      CDM_VERSJON
    }, true)
    dispatch(setValidation(clonedValidation))
  })

  const setAnnenInformasjonBarnetProperty = (property: string, value: string) => {
    dispatch(updateReplySed(`${target}.${property}`, value.trim()))
  }

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
                error={validation[namespace + '-forsoerges-av-det-offentlige']?.feilmelding}
                namespace={namespace}
                id='forsoerges-av-det-offentlige'
                label={t('label:forsoerges-av-det-offentlige')}
                hideLabel={true}
                onChanged={(v) => setAnnenInformasjonBarnetProperty('forsoergesavdetoffentligefritekst', v)}
                value={(annenInformasjonBarnet as AnnenInformasjonBarnet_V42)?.forsoergesavdetoffentligefritekst ?? ''}
              />
            </TextAreaDiv>
          </Box>
        }
        {(parseFloat(CDM_VERSJON) >= 4.3) &&
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
            <RadioPanelGroup
              value={(annenInformasjonBarnet as AnnenInformasjonBarnet_V43)?.forsoergesAvDetOffentlige ?? ''}
              data-no-border
              data-testid={namespace}
              error={validation[namespace + '-forsoerges-av-det-offentlige']?.feilmelding}
              id={namespace + '-forsoerges-av-det-offentlige'}
              name={namespace}
              onChange={(e:string) => setAnnenInformasjonBarnetProperty("forsoergesAvDetOffentlige",  e as JaNei)}
            >
              <HGrid gap="1" columns={2}>
                <RadioPanel value='ja'>
                  Ja
                </RadioPanel>
                <RadioPanel value='nei'>
                  Nei
                </RadioPanel>
              </HGrid>
            </RadioPanelGroup>
          </Box>
        }
      </VStack>
    </Box>
  )
}

export default ForsoergesAvDetOffentlige
