import {VStack, Box, Heading, HGrid, TextField, Label, Select} from '@navikt/ds-react'
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
import {RadioPanel, RadioPanelGroup} from '@navikt/hoykontrast'
import useUnmount from "../../../hooks/useUnmount";
import performValidation from "../../../utils/performValidation";
import {
  validateInformasjonOmBarnehage,
  ValidationAnnenInformasjonBarnetProps
} from "./validation";
import {setValidation} from "../../../actions/validation";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const InformasjonOmBarnehage: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed,
  options
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-anneninformasjonbarnet-informasjon-om-barnehage`
  const target = `anmodningOmMerInformasjon.svar.annenInformasjonBarnet`
  const CDM_VERSJON = options.cdmVersjon
  const annenInformasjonBarnet: AnnenInformasjonBarnet_V43 | AnnenInformasjonBarnet_V42 | undefined = _.get(replySed, target)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationAnnenInformasjonBarnetProps>(clonedValidation, namespace, validateInformasjonOmBarnehage, {
      annenInformasjonBarnet,
      CDM_VERSJON
    }, true)
    dispatch(setValidation(clonedValidation))
  })

  const setAnnenInformasjonBarnetProperty = (property: string, value: string) => {
    if(property === 'barnehage.gaarIBarnehage' && value === 'nei'){
      dispatch(updateReplySed(`${target}.barnehage`, undefined))
    }
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
                error={validation[namespace + '-informasjon-om-barnehage']?.feilmelding}
                namespace={namespace}
                id='informasjon-om-barnehage'
                label={t('label:informasjon-om-barnehage')}
                hideLabel={true}
                onChanged={(v) => setAnnenInformasjonBarnetProperty('informasjonombarnehagefritekst', v)}
                value={(annenInformasjonBarnet as AnnenInformasjonBarnet_V42)?.informasjonombarnehagefritekst ?? ''}
              />
            </TextAreaDiv>
          </Box>
        }
        {(parseFloat(CDM_VERSJON) >= 4.3) &&
          <>
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
            <RadioPanelGroup
              legend={t('label:gaar-barnet-i-barnehage')}
              value={(annenInformasjonBarnet as AnnenInformasjonBarnet_V43)?.barnehage?.gaarIBarnehage ?? ''}
              error={validation[namespace + '-informasjon-om-barnehage']?.feilmelding}
              id={namespace + '-informasjon-om-barnehage'}
              name={namespace + '-informasjon-om-barnehage'}
              onChange={(e:string) => setAnnenInformasjonBarnetProperty('barnehage.gaarIBarnehage', e as JaNei)}
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
          {(annenInformasjonBarnet as AnnenInformasjonBarnet_V43)?.barnehage?.gaarIBarnehage && (annenInformasjonBarnet as AnnenInformasjonBarnet_V43)?.barnehage?.gaarIBarnehage === 'ja' &&
            <>
              <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
                <RadioPanelGroup
                  legend={t('label:mottar-barnehagen-offentlig-stoette')}
                  value={(annenInformasjonBarnet as AnnenInformasjonBarnet_V43)?.barnehage?.mottarOffentligStoette ?? ''}
                  error={validation[namespace + '-mottar-offentlig-stoette']?.feilmelding}
                  id='mottar-offentlig-stoette'
                  name={namespace + '-mottar-offentlig-stoette'}
                  onChange={(e:string) => setAnnenInformasjonBarnetProperty('barnehage.mottarOffentligStoette', e as JaNei)}
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
              <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
                <Label>
                  Antallet timer barnet går i barnehage
                </Label>
                <HGrid gap="2" columns={2}>
                  <Select
                    id={namespace + '-timer-pr'}
                    name={namespace + '-timer-pr'}
                    error={validation[namespace + '-timer-pr']?.feilmelding}
                    label={t('label:timer-pr')}
                    value={(annenInformasjonBarnet as AnnenInformasjonBarnet_V43)?.barnehage?.timerPr ?? ''}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAnnenInformasjonBarnetProperty('barnehage.timerPr', e.target.value)}
                  >
                    <option value="" key="">{t('el:placeholder-select-default')}</option>
                    <option value="dag">Dag</option>
                    <option value="uke">Uke</option>
                    <option value="maaned">Måned</option>
                  </Select>
                  <TextField
                    id={namespace + '-timer'}
                    error={validation[namespace + '-timer']?.feilmelding}
                    label={t('label:antall-timer')}
                    value={(annenInformasjonBarnet as AnnenInformasjonBarnet_V43)?.barnehage?.timer ?? ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnnenInformasjonBarnetProperty('barnehage.timer', e.target.value)}
                  />
                </HGrid>
              </Box>
            </>
          }
          </>
        }
      </VStack>
    </Box>
  )
}

export default InformasjonOmBarnehage
