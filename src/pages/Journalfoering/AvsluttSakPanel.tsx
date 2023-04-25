import React, {useEffect, useState} from "react";
import {FeilregistreringLogg, Sak} from "../../declarations/types";
import {VerticalSeparatorDiv} from "@navikt/hoykontrast";
import {Button, Heading, Panel} from "@navikt/ds-react";
import {HorizontalLineSeparator} from "../../components/StyledComponents";
import {useTranslation} from "react-i18next";
import {journalfoeringReset, sendSedAndCloseCase} from "../../actions/journalfoering";
import {useAppDispatch, useAppSelector} from "../../store";
import {State} from "../../declarations/reducers";
import Modal from "../../components/Modal/Modal";

export interface AvsluttSakPanelProps {
  sak: Sak
  gotoSak: () => void
  gotoFrontpage: () => void
}

interface AvsluttSaksPanelSelector {
  isSendingSedAndClosingSak: boolean
  feilregistreringLogg: FeilregistreringLogg | undefined | null
}

const mapState = (state: State) => ({
  isSendingSedAndClosingSak: state.loading.isSendingSedAndClosingSak,
  feilregistreringLogg: state.journalfoering.feilregistreringLogg
})

export const AvsluttSakPanel = ({ sak, gotoSak, gotoFrontpage }: AvsluttSakPanelProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { isSendingSedAndClosingSak, feilregistreringLogg }: AvsluttSaksPanelSelector = useAppSelector(mapState)
  const [_sendAndCloseModal, setSendAndCloseModal] = useState<boolean>(false)

  const onSend = () => {
    dispatch(sendSedAndCloseCase(sak.sakId))
  }

  useEffect(() => {
    if(feilregistreringLogg){
      setSendAndCloseModal(true)
    }
  }, [feilregistreringLogg])

  const onSendAndCloseModalClose = () => {
    dispatch(journalfoeringReset())
    setSendAndCloseModal(false)
  }


  return (
    <>
      <Modal
        open={_sendAndCloseModal}
        onModalClose={onSendAndCloseModalClose}
        appElementId="root"
        modal={{
          closeButton: false,
          modalContent: (
            <>
              <Heading size={"small"}>Følgende dokumenter er avsluttet</Heading>
              {feilregistreringLogg?.bleFeilregistrert}
              <Heading size={"small"}>Følgende dokumenter må journalføres i Gosys</Heading>
              {feilregistreringLogg?.bleIkkeFeilregistrert}
              {feilregistreringLogg?.varAlleredeFeilregistrert}
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
          {t('label:avslutt-sak')}
        </Heading>
        <VerticalSeparatorDiv />
        <HorizontalLineSeparator />
        <VerticalSeparatorDiv />
        <Button variant="secondary" loading={isSendingSedAndClosingSak} onClick={onSend}>
          {t("el:button-send-sed-og-avslutt-sak")}
        </Button>
      </Panel>
    </>
  )
}

export default AvsluttSakPanel
