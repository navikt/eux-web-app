import React, {useEffect, useRef} from "react";
import {FeilregistrerJournalposterLogg, Sak} from "../../declarations/types";
import {Box, Button, Heading, Modal, VStack} from "@navikt/ds-react";
import {HorizontalLineSeparator} from "../../components/StyledComponents";
import {useTranslation} from "react-i18next";
import {journalfoeringReset, feilregistrerJournalposter} from "../../actions/journalfoering";
import {useAppDispatch, useAppSelector} from "../../store";
import {State} from "../../declarations/reducers";;

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
  const refModal = useRef<HTMLDialogElement>(null);

  const onSend = () => {
    dispatch(feilregistrerJournalposter(sak.sakId))
  }

  useEffect(() => {
    if(feilregistrerJournalposterLogg){
      refModal.current?.showModal()
    }
  }, [feilregistrerJournalposterLogg])

  const onFeilregistrerJournalposterModalClose = () => {
    dispatch(journalfoeringReset())
    refModal.current?.close()
  }

  const closeModalAndGotoSak = () => {
    onFeilregistrerJournalposterModalClose()
    gotoSak()
  }

  const closeModalAndGotoFrontpage = () => {
    onFeilregistrerJournalposterModalClose()
    gotoFrontpage()
  }

  return (
    <>
      <Modal ref={refModal} header={{ heading: "Status" }} width="medium" onClose={onFeilregistrerJournalposterModalClose}>
        <Modal.Body>
          <VStack gap="4">
            {feilregistrerJournalposterLogg?.bleFeilregistrert && feilregistrerJournalposterLogg?.bleFeilregistrert?.length > 0 &&
              <VStack gap="4">
                <Heading size={"small"}>{t('journalfoering:modal-ble-feilregistrert-title')}</Heading>
                {feilregistrerJournalposterLogg?.bleFeilregistrert.map((sedTittel) => {
                  return (<>{sedTittel}<br/></>)
                })}
              </VStack>
            }
            {feilregistrerJournalposterLogg?.bleIkkeFeilregistrert && feilregistrerJournalposterLogg?.bleIkkeFeilregistrert?.length > 0 &&
              <VStack gap="4">
                <Heading size={"small"}>{t('journalfoering:modal-ble-ikke-feilregistrert-title')}</Heading>
                {feilregistrerJournalposterLogg?.bleIkkeFeilregistrert.map((sedTittel) => {
                  return (<>{sedTittel}<br/></>)
                })}
              </VStack>
            }
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModalAndGotoFrontpage}>
            {t('el:button-gaa-til-forsiden')}
          </Button>
          <Button variant="secondary" onClick={closeModalAndGotoSak}>
            {t('el:button-gaa-tilbake-til-saken')}
          </Button>
        </Modal.Footer>
      </Modal>
      <Box background="bg-default" padding="4" borderWidth="1" borderColor="border-default" borderRadius="small">
        <VStack gap="4" align="start">
          <Heading size='small'>
            {t('label:feilregistrer-og-avslutt')}
          </Heading>
          <HorizontalLineSeparator />
          {t('journalfoering:feilregistrering-journalposter-beskrivelse')}
          <Button variant="secondary" loading={isFeilregistreringJournalposter} onClick={onSend}>
            {t("el:button-feilregistrer-journalposter")}
          </Button>
        </VStack>
      </Box>
    </>
  )
}

export default FeilregistrerJournalposterPanel
