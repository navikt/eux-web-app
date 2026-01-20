import {HStack, Label, Radio, RadioGroup, VStack} from '@navikt/ds-react'
import React from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import TextArea from "../../../components/Forms/TextArea";
import {useAppDispatch, useAppSelector} from "../../../store";
import {useTranslation} from "react-i18next";
import _ from "lodash";
import {State} from "../../../declarations/reducers";
import Input from "../../../components/Forms/Input";
import {resetValidation} from "../../../actions/validation";
import {Utdanning as UtdanningDTO} from "../../../declarations/sed";
import commonStyles from "../../../assets/css/common.module.css";

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
      <RadioGroup
        id={namespace + '-type'}
        value={utdanning?.type}
        legend="Type opplæringsinstitusjon"
        onChange={(v:string)=>setUtdanning("type", v)}
        error={validation[namespace + '-type']?.feilmelding}
      >
        <HStack gap="2">
          <Radio className={commonStyles.radioPanel} value='skole'>Skole</Radio>
          <Radio className={commonStyles.radioPanel} value='høyskole'>Høyskole</Radio>
          <Radio className={commonStyles.radioPanel} value='universitet'>Universitet</Radio>
          <Radio className={commonStyles.radioPanel} value='yrkesrettet_opplæring'>Yrkesrettet opplæring</Radio>
          <Radio className={commonStyles.radioPanel} value='barnehage_daghjem'>Barnehage/Daghjem</Radio>
        </HStack>
      </RadioGroup>
      <RadioGroup
        id={namespace + '-typedeltakelse'}
        value={utdanning?.typeDeltakelse}
        legend="Type deltakelse"
        onChange={(v:string)=>setUtdanning("typeDeltakelse", v)}
        error={validation[namespace + '-typedeltakelse']?.feilmelding}
      >
        <HStack gap="2">
          <Radio className={commonStyles.radioPanel} value='deltid'>Deltid</Radio>
          <Radio className={commonStyles.radioPanel} value='heltid'>Heltid</Radio>
        </HStack>
      </RadioGroup>
      <Label>Faktisk deltakelse</Label>
      <RadioGroup
        value={utdanning?.timerPr}
        legend="Timer pr"
        onChange={(v:string)=>setUtdanning("timerPr", v)}
        error={validation[namespace + '-timer-pr']?.feilmelding}
        id={namespace + '-timer-pr'}
      >
        <HStack gap="2">
          <Radio className={commonStyles.radioPanel} value='dag'>Dag</Radio>
          <Radio className={commonStyles.radioPanel} value='uke'>Uke</Radio>
          <Radio className={commonStyles.radioPanel} value='maaned'>Måned</Radio>
        </HStack>
      </RadioGroup>
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
