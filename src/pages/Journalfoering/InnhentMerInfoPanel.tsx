import React, {useState} from "react";
import {Sak} from "../../declarations/types";
import {VerticalSeparatorDiv} from "@navikt/hoykontrast";
import {Button, Heading, Panel, Radio, RadioGroup, Textarea} from "@navikt/ds-react";
import {HorizontalLineSeparator} from "../../components/StyledComponents";
import {useTranslation} from "react-i18next";
import styled from "styled-components";
import _ from "lodash";

const StyledTextarea = styled(Textarea)<{$visible?: boolean}>`
  display: ${props => props.$visible ? "block" : "none"};
`

export interface InnhentMerInfoPanelProps {
  sak: Sak
}

export const InnhentMerInfoPanel = ({ sak }: InnhentMerInfoPanelProps) => {
  const { t } = useTranslation()
  const [_textareaVisible, setTextareaVisible] = useState<boolean>(false);
  const [_textSelected, setTextSelected] = useState(false);
  const [_fritekst, setFritekst] = useState<string>("");

  let standardText = t('journalfoering:standard-tekst')

  if(sak.sakType === "FB_BUC_01"){
    const mottattF001 = _.find(sak.sedListe, (sed) => {
      return sed.sedType === "F001" && sed.status === "received"
    })

    if(mottattF001 && mottattF001.manglerInformasjonOmEktefelleEllerAnnenPerson) standardText = t('journalfoering:standardtekst-fsed-mangler-info')
    if(mottattF001 && !mottattF001.manglerInformasjonOmEktefelleEllerAnnenPerson) standardText = t('journalfoering:standardtekst-fsed-har-info')

  } else if (sak.sakType === "FB_BUC_04"){
    const mottattF003 = _.find(sak.sedListe, (sed) => {
      return sed.sedType === "F003" && sed.status === "received"
    })

    if(mottattF003 && mottattF003.manglerInformasjonOmEktefelleEllerAnnenPerson) standardText = t('journalfoering:standardtekst-fsed-mangler-info')
    if(mottattF003 && !mottattF003.manglerInformasjonOmEktefelleEllerAnnenPerson) standardText = t('journalfoering:standardtekst-fsed-har-info')
  }

  console.log(standardText)

  const onRadioChange = (val: any) => {
    setTextSelected(true)
    if(val === "fritekst"){
      setTextareaVisible(true)
    } else {
      setTextareaVisible(false)
      setFritekst("")
    }
  }

  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFritekst(e.target.value)
  }

  return (
    <Panel border>
      <Heading size='small'>
        {t('label:innhent-mer-info')}
      </Heading>
      <VerticalSeparatorDiv />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      <RadioGroup
        legend={t('label:innhent-mer-info')}
        hideLegend={true}
        onChange={onRadioChange}
      >
        <Radio value="standard">{t('journalfoering:radio-option-standardtekst')}</Radio>
        <Radio value="fritekst">{t('journalfoering:radio-option-fritekst')}</Radio>
      </RadioGroup>
      <StyledTextarea
        label={t('journalfoering:radio-option-fritekst')}
        value={_fritekst}
        hideLabel={true}
        maxLength={255}
        resize={true}
        $visible={_textareaVisible}
        onChange={onTextChange}
      />
      <VerticalSeparatorDiv />
      <Button variant="primary" disabled={!_textSelected || (_fritekst === "" && _textareaVisible)}>
        {t("el:button-send-x", {x: "H001"})}
      </Button>
    </Panel>
  )
}

export default InnhentMerInfoPanel
