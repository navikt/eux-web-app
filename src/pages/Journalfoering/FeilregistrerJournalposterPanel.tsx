import React, {useEffect, useState} from "react";
import {FeilregistrerJournalposterLogg, Sak} from "../../declarations/types";
import {VerticalSeparatorDiv} from "@navikt/hoykontrast";
import {Button, Heading, Panel} from "@navikt/ds-react";
import {HorizontalLineSeparator} from "../../components/StyledComponents";
import {useTranslation} from "react-i18next";
import {journalfoeringReset, feilregistrerJournalposter} from "../../actions/journalfoering";
import {useAppDispatch, useAppSelector} from "../../store";
import {State} from "../../declarations/reducers";
import Modal from "../../components/Modal/Modal";

export interface FeilregistrerJournalposterPanelProps {
  sak: Sak
  gotoSak: () => void
  gotoFrontpage: () => void
}

interface FeilregistrerJournalposterPanelSelector {
  isFeilregistreringJournalposter: boolean
  feilregistrerJournalposterLogg: FeilregistrerJournalposterLogg | undefined | null
}

const mapState = (state: State) => ({
  isFeilregistreringJournalposter: state.loading.isFeilregistreringJournalposter,
  feilregistrerJournalposterLogg: state.journalfoering.feilregistrerJournalposterLogg
})

export const FeilregistrerJournalposterPanel = ({ sak, gotoSak, gotoFrontpage }: FeilregistrerJournalposterPanelProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { isFeilregistreringJournalposter, feilregistrerJournalposterLogg }: FeilregistrerJournalposterPanelSelector = useAppSelector(mapState)
  const [_feilregistrerJournalposterModal, setFeilregistrerJournalposterModal] = useState<boolean>(false)

  const onSend = () => {
    dispatch(feilregistrerJournalposter(sak.sakId))
  }

  useEffect(() => {
    if(feilregistrerJournalposterLogg){
      setFeilregistrerJournalposterModal(true)
    }
  }, [feilregistrerJournalposterLogg])

  const onFeilregistrerJournalposterModalClose = () => {
    dispatch(journalfoeringReset())
    setFeilregistrerJournalposterModal(false)
  }


  return (
    <>
      <Modal
        open={_feilregistrerJournalposterModal}
        onModalClose={onFeilregistrerJournalposterModalClose}
        appElementId="root"
        modal={{
          closeButton: false,
          modalContent: (
            <>
              {feilregistrerJournalposterLogg?.bleFeilregistrert &&
                <>
                  <Heading size={"small"}>{t('journalfoering:modal-ble-feilregistrert-title')}</Heading>
                    <VerticalSeparatorDiv/>
                    {feilregistrerJournalposterLogg?.bleFeilregistrert.map((sedTittel) => {
                      return (<>{sedTittel}<br/></>)
                    })}
                    <VerticalSeparatorDiv/>
                </>
              }
              {feilregistrerJournalposterLogg?.bleIkkeFeilregistrert &&
                <>
                  <Heading size={"small"}>{t('journalfoering:modal-ble-ikke-feilregistrert-title')}</Heading>
                  <VerticalSeparatorDiv/>
                    {feilregistrerJournalposterLogg?.bleIkkeFeilregistrert.map((sedTittel) => {
                      return (<>{sedTittel}<br/></>)
                    })}
                  <VerticalSeparatorDiv/>
                </>
              }
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
          {t('label:feilregistrer-og-avslutt')}
        </Heading>
        <VerticalSeparatorDiv />
        <HorizontalLineSeparator />
        <VerticalSeparatorDiv />
        {t('journalfoering:feilregistrering-journalposter-beskrivelse')}
        <VerticalSeparatorDiv />
        <Button variant="secondary" loading={isFeilregistreringJournalposter} onClick={onSend}>
          {t("el:button-feilregistrer-journalposter")}
        </Button>
      </Panel>
    </>
  )
}

export default FeilregistrerJournalposterPanel
