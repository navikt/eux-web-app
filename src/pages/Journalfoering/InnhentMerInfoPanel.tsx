import React, {useEffect, useState} from "react";
import {
  Sak,
} from "../../declarations/types";
import {VerticalSeparatorDiv} from "@navikt/hoykontrast";
import {Button, Heading, Panel, Radio, RadioGroup, Textarea} from "@navikt/ds-react";
import {HorizontalLineSeparator} from "../../components/StyledComponents";
import {useTranslation} from "react-i18next";
import styled from "styled-components";
import _ from "lodash";
import {useAppDispatch, useAppSelector} from "../../store";
import {createH001, createH001SedInRina, journalfoeringReset, sendH001SedInRina} from "../../actions/journalfoering";
import {H001Sed} from "../../declarations/sed";
import {State} from "../../declarations/reducers";
import Modal from "../../components/Modal/Modal";

const StyledTextarea = styled(Textarea)<{$visible?: boolean}>`
  display: ${props => props.$visible ? "block" : "none"};
`
export interface InnhentMerInfoPanelProps {
  sak: Sak
  gotoSak: () => void
  gotoFrontpage: () => void
}

interface InnhentMerInfoPanelSelector {
  H001: H001Sed | undefined | null
  H001Id: string | undefined | null
  sendH001Response: any | undefined | null
  isSendingH001: boolean
}

const mapState = (state: State) => ({
  H001: state.journalfoering.H001,
  H001Id: state.journalfoering.H001Id,
  sendH001Response: state.journalfoering.sendH001Response,
  isSendingH001: state.loading.isSendingH001
})

export const InnhentMerInfoPanel = ({ sak, gotoSak, gotoFrontpage }: InnhentMerInfoPanelProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { H001, H001Id, sendH001Response, isSendingH001 }: InnhentMerInfoPanelSelector = useAppSelector(mapState)
  const [_textareaVisible, setTextareaVisible] = useState<boolean>(false);
  const [_textSelected, setTextSelected] = useState(false);
  const [_fritekst, setFritekst] = useState<string>("");
  const [_sendH001Modal, setSendH001Modal] = useState<boolean>(false)

  let standardText = t('journalfoering:standardtekst')

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

  const onSendH001 = () => {
    if(sak.sakshandlinger.includes("H001")){
      dispatch(createH001(sak, _fritekst !== "" ? _fritekst : standardText))
    } else {
      console.log("Opprett H001 i NY sak")
    }
  }

  useEffect(() => {
    if(H001){
      dispatch(createH001SedInRina(sak.sakId, H001))
    }
  }, [H001])

  useEffect(() => {
    if(H001Id){
      dispatch(sendH001SedInRina(sak.sakId, H001Id))
    }
  }, [H001Id])

  useEffect(() => {
    if(sendH001Response){
      setSendH001Modal(true)
    }
  }, [sendH001Response])

  const onSendH001ModalClose = () => {
    dispatch(journalfoeringReset())
    setSendH001Modal(false)
  }

  return (
    <>
      <Modal
        open={_sendH001Modal}
        onModalClose={onSendH001ModalClose}
        appElementId="root"
        modal={{
          closeButton: false,
          modalTitle: t('label:sed-er-sendt'),
          modalContent: (
            <>

            </>
          ),
          modalButtons: [
            {
              text: t('el:button-gaa-tilbake-til-saken'),
              onClick: gotoSak
            },
            {
              text: t('el:button-gaa-til-forsiden'),
              onClick: gotoFrontpage
            }]
        }}
      />
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
        <Button variant="primary" disabled={!_textSelected || (_fritekst === "" && _textareaVisible)} onClick={onSendH001} loading={isSendingH001}>
          {t("el:button-send-x", {x: "H001"})}
        </Button>
      </Panel>
    </>
  )
}

export default InnhentMerInfoPanel
