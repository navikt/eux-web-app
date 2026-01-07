import React, {useEffect, useState} from "react";
import {
  Sak,
} from "../../declarations/types";
import {Box, Button, Dialog, Heading, HStack, Link, Loader, Textarea, VStack} from "@navikt/ds-react";
import {HorizontalLineSeparator} from "../../components/StyledComponents";
import {useTranslation} from "react-i18next";
import _ from "lodash";
import {useAppDispatch, useAppSelector} from "../../store";
import {
  addRelatedRinaSak,
  createH001,
  createH001SedInRina,
  createHBUC01,
  journalfoeringReset,
  sendH001SedInRina,
  updateH001SedInRina
} from "../../actions/journalfoering";
import {H001Sed} from "../../declarations/sed";
import {State} from "../../declarations/reducers";

export interface InnhentMerInfoPanelProps {
  sak: Sak
  gotoSak: () => void
  gotoFrontpage: () => void
}

interface InnhentMerInfoPanelSelector {
  H001: H001Sed | undefined | null
  H001Id: string | undefined | null
  sendH001Response: any | undefined | null
  createdHBUC01: any | undefined | null
  isSendingH001: boolean
  isAddingRelatertRinaSak: boolean
  addedRelatertRinaSak: any | undefined | null
  bucer: Array<string> | undefined | null
}

const mapState = (state: State) => ({
  H001: state.journalfoering.H001,
  H001Id: state.journalfoering.H001Id,
  sendH001Response: state.journalfoering.sendH001Response,
  createdHBUC01: state.journalfoering.createdHBUC01,
  isSendingH001: state.loading.isSendingH001,
  isAddingRelatertRinaSak: state.loading.isAddingRelatertRinaSak,
  addedRelatertRinaSak: state.journalfoering.addedRelatertRinaSak,
  bucer: state.app.saksbehandlerBucer
})

export const InnhentMerInfoPanel = ({ sak, gotoSak, gotoFrontpage }: InnhentMerInfoPanelProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { H001, H001Id, sendH001Response, createdHBUC01, isSendingH001, isAddingRelatertRinaSak, addedRelatertRinaSak, bucer }: InnhentMerInfoPanelSelector = useAppSelector(mapState)
  const [_fritekst, setFritekst] = useState<string>("");
  const [_dialogOpen, setDialogOpen] = useState<boolean>(false)

  const harTilgangTilBucType = (saksbehandlerBucer: Array<string> | null | undefined, sakType: string) => {
    if (saksbehandlerBucer && sakType) {
      for (let i = 0; i < saksbehandlerBucer.length; i++) {
        if (sakType.startsWith(saksbehandlerBucer[i])) {
          return true
        }
      }
    }
    return false;
  }

  const harTilgang = harTilgangTilBucType(bucer, sak.sakType)

  const gotoNewSak = (sakId: string) => {
    onSendH001ModalClose()
    window.location.href = '/svarsed/view/sak/' + sakId
  }

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

  useEffect(() => {
    setFritekst(standardText)
  }, [standardText])

  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFritekst(e.target.value)
  }

  const onSendH001 = () => {
    dispatch(journalfoeringReset())
    if(sak.sakshandlinger?.includes("H001")){
      dispatch(createH001(sak, _fritekst !== "" ? _fritekst : standardText))
    } else {
      dispatch(createHBUC01({
        cdmVersjon: sak.cdmVersjon,
        mottakerId: sak.motparter[0].motpartId,
        mottakerlandkode: sak.motparter[0].motpartLandkode
      }))
    }
  }

  useEffect(() => {
    if(createdHBUC01){
      dispatch(createH001(sak, _fritekst !== "" ? _fritekst : standardText, t('label:international-id') + ": " + sak.internasjonalSakId))
    }
  }, [createdHBUC01])

  useEffect(() => {
    if(H001 && !createdHBUC01){
      dispatch(createH001SedInRina(sak.sakId, H001))
    } else if (H001 && createdHBUC01){
      dispatch(updateH001SedInRina(createdHBUC01.sakId, createdHBUC01.sedId, H001))
    }
  }, [H001, createdHBUC01])

  useEffect(() => {
    if(H001Id){
      dispatch(sendH001SedInRina(createdHBUC01 ? createdHBUC01.sakId : sak.sakId, H001Id))
    }
  }, [H001Id])

  useEffect(() => {
    if(sendH001Response){
      setDialogOpen(true)
      if(createdHBUC01){
        dispatch(addRelatedRinaSak(sak.sakId, createdHBUC01.sakId))
      }
    }
  }, [sendH001Response])

  const onSendH001ModalClose = () => {
    dispatch(journalfoeringReset())
    setDialogOpen(false)
  }

  const closeModalAndGotoSak = () => {
    onSendH001ModalClose()
    gotoSak()
  }

  const closeModalAndGotoFrontpage = () => {
    onSendH001ModalClose()
    gotoFrontpage()
  }

  return (
    <>
      <Dialog open={_dialogOpen} onOpenChange={onSendH001ModalClose}>
        <Dialog.Popup>
          <Dialog.Header>
            <Dialog.Title>{t('label:H001-er-sendt')}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <>
              {createdHBUC01 &&
                <>
                  {isAddingRelatertRinaSak ? <Loader/> : addedRelatertRinaSak ?
                    <>{t('label:ny-buc-opprettet')} <Link href='#' onClick={() => gotoNewSak(createdHBUC01.sakId)}>{createdHBUC01.sakId}</Link></> :
                    <>{t('label:ny-buc-opprettet')} <Link href='#' onClick={() => gotoNewSak(createdHBUC01.sakId)}>{createdHBUC01.sakId}</Link> <br/> ({t('label:obs-ta-vare-paa-saksnummeret')})</>
                  }
                </>
              }
            </>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="secondary" onClick={closeModalAndGotoSak} disabled={isAddingRelatertRinaSak}>
              {t('el:button-gaa-tilbake-til-saken')}
            </Button>
            <Button variant="secondary" onClick={closeModalAndGotoFrontpage} disabled={isAddingRelatertRinaSak}>
              {t('el:button-gaa-til-forsiden')}
            </Button>
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog>
      <Box background="bg-default" padding="4" borderWidth="1" borderColor="border-default" borderRadius="small">
        <VStack gap="4">
          <Heading size='small'>
            {t('label:innhent-mer-info')}
          </Heading>
          <HorizontalLineSeparator />
          <Textarea
            label={t('journalfoering:radio-option-fritekst')}
            value={_fritekst}
            hideLabel={true}
            maxLength={255}
            resize={true}
            onChange={onTextChange}
          />
          { harTilgang &&
            <HStack>
              <Button variant="primary" disabled={_fritekst === ""} onClick={onSendH001} loading={isSendingH001}>
                {t("el:button-send-x", {x: "H001"})}
              </Button>
            </HStack>
          }
        </VStack>
      </Box>
    </>
  )
}

export default InnhentMerInfoPanel
