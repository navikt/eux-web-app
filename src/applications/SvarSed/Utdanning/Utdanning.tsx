import {Label, VStack} from '@navikt/ds-react'
import React from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import TextArea from "../../../components/Forms/TextArea";
import {useAppDispatch, useAppSelector} from "../../../store";
import {useTranslation} from "react-i18next";
import _ from "lodash";
import {State} from "../../../declarations/reducers";
import {FlexRadioPanels, RadioPanel, RadioPanelGroup} from "@navikt/hoykontrast";
import Input from "../../../components/Forms/Input";
import {resetValidation} from "../../../actions/validation";
import {Utdanning as UtdanningDTO} from "../../../declarations/sed";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Utdanning: React.FC<MainFormProps> = ({
  parentNamespace,
  parentTarget,
  replySed,
  updateReplySed,
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}`
  const target = `${parentTarget}.utdanning`
  const utdanning: UtdanningDTO = _.get(replySed, target)

  const setUtdanning = (prop:string, value: string) => {
    dispatch(updateReplySed(`${target}.${prop}`, value))
    if(validation[namespace + '-' + prop.toLowerCase()]){
      dispatch(resetValidation(namespace + '-' + prop.toLowerCase()))
    }
  }

  return (
    <VStack gap="4">
      <RadioPanelGroup
        id={namespace + '-type'}
        value={utdanning?.type}
        legend="Type opplæringsinstitusjon"
        onChange={(v:string)=>setUtdanning("type", v)}
        error={validation[namespace + '-type']?.feilmelding}
      >
        <FlexRadioPanels>
          <RadioPanel value='skole'>Skole</RadioPanel>
          <RadioPanel value='høyskole'>Høyskole</RadioPanel>
          <RadioPanel value='universitet'>Universitet</RadioPanel>
          <RadioPanel value='yrkesrettet_opplæring'>Yrkesrettet opplæring</RadioPanel>
          <RadioPanel value='barnehage_daghjem'>Barnehage/Daghjem</RadioPanel>
        </FlexRadioPanels>
      </RadioPanelGroup>
      <RadioPanelGroup
        id={namespace + '-typedeltakelse'}
        value={utdanning?.typeDeltakelse}
        legend="Type deltakelse"
        onChange={(v:string)=>setUtdanning("typeDeltakelse", v)}
        error={validation[namespace + '-typedeltakelse']?.feilmelding}
      >
        <FlexRadioPanels>
          <RadioPanel value='deltid'>Deltid</RadioPanel>
          <RadioPanel value='heltid'>Heltid</RadioPanel>
        </FlexRadioPanels>
      </RadioPanelGroup>
      <Label>Faktisk deltakelse</Label>
      <RadioPanelGroup
        value={utdanning?.timerPr}
        legend="Timer pr"
        onChange={(v:string)=>setUtdanning("timerPr", v)}
        error={validation[namespace + '-timer-pr']?.feilmelding}
        id={namespace + '-timer-pr'}
      >
        <FlexRadioPanels>
          <RadioPanel value='dag'>Dag</RadioPanel>
          <RadioPanel value='uke'>Uke</RadioPanel>
          <RadioPanel value='maaned'>Måned</RadioPanel>
        </FlexRadioPanels>
      </RadioPanelGroup>
      <Input
        error={validation[namespace + '-timer']?.feilmelding}
        namespace={namespace}
        id={namespace + '-timer'}
        label="Antall timer"
        onChanged={(v: string) => setUtdanning("timer", v)}
        value={utdanning?.timer}
      />
      <TextArea
        maxLength={255}
        error={validation[namespace + '-ytterligereinformasjon']?.feilmelding}
        namespace={namespace}
        id='ytterligereinformasjon'
        label={t('label:ytterligere-informasjon')}
        onChanged={(v) => setUtdanning("ytterligereInformasjon", v)}
        value={utdanning?.ytterligereInformasjon ?? ''}
      />
    </VStack>
  )
}

export default Utdanning
