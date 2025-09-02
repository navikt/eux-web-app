import {XMarkIcon, PencilIcon, DownloadIcon, PaperplaneIcon, StarIcon, QuestionmarkDiamondIcon, PaperclipIcon} from '@navikt/aksel-icons'
import {BodyLong, Box, Button, Detail, Heading, HelpText, HGrid, HStack, Loader, Spacer, Tag, VStack} from '@navikt/ds-react'
import {
  clarifyingSed,
  deleteSed,
  editSed,
  invalidatingSed,
  rejectingSed,
  remindSed,
  replyToSed,
  previewSed,
} from 'actions/svarsed'
import PreviewSED from 'applications/SvarSed/PreviewSED/PreviewSED'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import {Sak, Sed, SedAction} from 'declarations/types'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'
import {getAllowed} from "utils/allowedFeatures";
import {FeatureToggles} from "../../../declarations/app";
import Modal from "../../../components/Modal/Modal";
import {ModalContent} from "../../../declarations/components";
import AttachmentsFromRinaTable from "../../Vedlegg/Attachments/AttachmentsFromRinaTable";
import { saveAs } from 'file-saver'
import moment from 'moment'
import classNames from "classnames";
import {Dd, Dl, Dt} from "../../../components/StyledComponents";

const SedBox = styled(Box)`
  transition: all 0.15s ease-in-out;
  &.deviation {
    border-left: 5px solid var(--a-surface-warning);
  }
  &:hover {
    color: var(--a-text-default) !important;
    background-color: var(--a-surface-action-subtle-hover) !important;
  }
`

const IconDiv = styled(VStack)`
  align-items: center;
  margin-left: -1rem;
  margin-top: -1rem;
  margin-bottom: -1rem;
  justify-content: center;
  background-color: var(--a-surface-subtle);
  padding: 1rem;
`

const IconSpacerDiv = styled.div`
  margin-bottom: 0.35rem;
`

const AttachmentButton = styled(Button)`
  padding:0
`

const AttachmentIcon = styled(PaperclipIcon)`
  position: relative;
  top: 3px;
`

const MyHelpText = styled(HelpText)`
  & svg {
    width: 0.7em
  }
`

const DeviationHelpText = styled(HelpText)`
  color: var(--a-surface-warning);
  &:hover > svg {
    color: var(--a-surface-warning);
  }
  &.navds-help-text__button[aria-expanded="true"] > svg {
    color: var(--a-surface-warning);
  }
`

interface SEDPanelSelector {
  replySed: ReplySed | null | undefined
  deletedSed: boolean | null | undefined
  featureToggles: FeatureToggles | null | undefined
  gettingPreviewFile: boolean
  previewFile: Blob | null | undefined
}

interface SEDPanelProps {
  currentSak: Sak
  sed: Sed
}

const mapState = (state: State): SEDPanelSelector => ({
  replySed: state.svarsed.replySed,
  deletedSed: state.svarsed.deletedSed,
  featureToggles: state.app.featureToggles,
  gettingPreviewFile: state.loading.gettingPreviewFile,
  previewFile: state.svarsed.previewFile
})

const SEDPanel = ({
  currentSak,
  sed
}: SEDPanelProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { replySed, deletedSed, featureToggles, gettingPreviewFile, previewFile } = useAppSelector(mapState)

  const [_loadingDraftSed, _setLoadingDraftSed] = useState<boolean>(false)
  const [_editingSed, _setEditingSed] = useState<boolean>(false)
  const [_deletingSed, _setDeletingSed] = useState<boolean>(false)
  const [_updatingSed, _setUpdatingSed] = useState<boolean>(false)
  const [_replyingToSed, _setReplyingToSed] = useState<boolean>(false)
  const [_invalidatingSed, _setInvalidatingSed] = useState<boolean>(false)
  const [_rejectingSed, _setRejectingSed] = useState<boolean>(false)
  const [_clarifyingSed, _setClarifyingSed] = useState<boolean>(false)
  const [_reminderSed, _setReminderSed] = useState<boolean>(false)
  const [attachmentModal, setAttachmentModal] = useState<ModalContent | undefined>(undefined)
  const [isDownloadingPDF, setIsDownloadingPDF] = useState<boolean>(false)

  const ALLOWED_SED_HANDLINGER = getAllowed("ALLOWED_SED_HANDLINGER", !!featureToggles?.featureAdmin)
  const ALLOWED_SED_EDIT_AND_UPDATE = getAllowed("ALLOWED_SED_EDIT_AND_UPDATE", !!featureToggles?.featureAdmin)

  const waitingForOperation = _loadingDraftSed || _editingSed || _updatingSed || _replyingToSed || _invalidatingSed || _rejectingSed || _clarifyingSed || _reminderSed || _deletingSed

  /** if we have a reply sed, after clicking to replyToSed, let's go to edit mode */
  useEffect(() => {
    if (!_.isEmpty(replySed) && !_.isEmpty(replySed!.sak) && waitingForOperation) {
      _setLoadingDraftSed(false)
      _setReplyingToSed(false)
      _setUpdatingSed(false)
      _setEditingSed(false)
      _setInvalidatingSed(false)
      _setRejectingSed(false)
      _setClarifyingSed(false)
      _setReminderSed(false)

      navigate({
        pathname: '/svarsed/edit/sak/' + replySed!.sak!.sakId + '/sed/' + (replySed!.sed?.sedId ?? 'new'),
        search: window.location.search
      })
    }
  }, [replySed])

  useEffect(() => {
    if(deletedSed && waitingForOperation){
      _setDeletingSed(false)
    }
  }, [deletedSed])

  const downloadPDF = () => {
    setIsDownloadingPDF(true)
    dispatch(previewSed(sed.sedId, currentSak.sakId))
  }

  // Handle PDF download when preview file is available
  useEffect(() => {
    if (isDownloadingPDF && previewFile && !gettingPreviewFile) {
      const fileName = `SED_${sed.sedId}_${moment(sed.sistEndretDato).format('YYYYMMDD_HHmmss')}.pdf`
      saveAs(previewFile, fileName)
      setIsDownloadingPDF(false)
    }
  }, [isDownloadingPDF, previewFile, gettingPreviewFile, sed.sedId, sed.sistEndretDato])

  const onEditingSedClick = (sed: Sed, sak: Sak) => {
    _setEditingSed(true)
    dispatch(editSed(sed, sak))
  }

  const onUpdatingSedClick = (sed: Sed, sak: Sak) => {
    _setUpdatingSed(true)
    dispatch(editSed(sed, sak))
  }
  const onDeleteSedClick = (sakId: string, sedId: string) => {
    _setDeletingSed(true)
    dispatch(deleteSed(sakId, sedId))
  }

  const onInvalidatingSedClick = (sed: Sed, sak: Sak) => {
    _setInvalidatingSed(true)
    dispatch(invalidatingSed(sed, sak))
  }

  const onRejectingSedClick = (sed: Sed, sak: Sak) => {
    _setRejectingSed(true)
    dispatch(rejectingSed(sed, sak))
  }

  const onClarifyingSedClick = (sed: Sed, sak: Sak) => {
    _setClarifyingSed(true)
    dispatch(clarifyingSed(sed, sak))
  }

  const onRemindSedClick = (sed: Sed, sak: Sak) => {
    _setReminderSed(true)
    dispatch(remindSed(sed, sak))
  }

  const onReplySedClick = (sed: Sed, sak: Sak) => {
    _setReplyingToSed(true)
    dispatch(replyToSed(sed, sak))
  }

  const openAttachmentModal = () => {
    setAttachmentModal({
      closeButton: true,
      modalContent: (
        <div style={{ cursor: 'pointer' }}>
          <AttachmentsFromRinaTable sedId={sed.sedId} rinaSakId={currentSak.sakId} attachmentsFromRina={sed.vedlegg} showHeader={true} hideActions={true}/>
        </div>
      )
    })
  }

  const hasIkkeJournalfoerteSed = !!currentSak.ikkeJournalfoerteSed?.length
  const showEditButton = (sed.sedHandlinger && sed.sedHandlinger?.indexOf('Update') >= 0) && sed.status === 'new' && ALLOWED_SED_EDIT_AND_UPDATE.includes(sed.sedType)
  const showUpdateButton = (sed.sedHandlinger && sed.sedHandlinger?.indexOf('Update') >= 0) && (sed.status === 'sent' || sed.status === 'active') && ALLOWED_SED_EDIT_AND_UPDATE.includes(sed.sedType)
  const showDeleteButton = (sed.sedHandlinger && sed.sedHandlinger?.indexOf('Delete') >= 0) && sed.status === 'new' && ALLOWED_SED_HANDLINGER.includes("Delete")
  const showReplyToSedButton = !!sed.svarsedType && sed.svarsedType !== "X010" && (sed.sedHandlinger && sed.sedHandlinger?.indexOf(sed.svarsedType as SedAction) >= 0) && ALLOWED_SED_HANDLINGER.includes(sed.svarsedType)
  const showInvalidateButton = sed.sedHandlinger && sed.sedHandlinger?.indexOf('X008') >= 0  && ALLOWED_SED_HANDLINGER.includes("X008")
  const showRemindButton = !hasIkkeJournalfoerteSed && sed.sedHandlinger && sed.sedHandlinger?.indexOf('X010') >= 0 && sed.status === 'received'  && ALLOWED_SED_HANDLINGER.includes("X010")
  const showRejectButton = sed.sedHandlinger && sed.sedHandlinger?.indexOf('X011') >= 0  && ALLOWED_SED_HANDLINGER.includes("X011")
  const showClarifyButton = sed.sedHandlinger && sed.sedHandlinger?.indexOf('X012') >= 0  && ALLOWED_SED_HANDLINGER.includes("X012")

  const hasSedHandlinger = sed.sedHandlinger && sed.sedHandlinger.length > 0
  const sedHandlingerRINA = sed.sedHandlinger?.filter((h) => !ALLOWED_SED_HANDLINGER.includes(h))

  const currentFagsak = _.cloneDeep(currentSak.fagsak)
  delete currentFagsak?._id
  const hasDeviatedFagsak = (
    sed.fagsak?.fnr !== currentFagsak?.fnr ||
    sed.fagsak?.tema !== currentFagsak?.tema ||
    sed.fagsak?.nr !== currentFagsak?.nr)
  
  return (
    <SedBox
      borderWidth="1"
      borderRadius="small"
      borderColor="border-default"
      padding="4"
      background="surface-default"
      className={classNames({
        deviation: sed.fagsak && hasDeviatedFagsak
      })}
    >
      <Modal
        open={!_.isNil(attachmentModal)}
        modal={attachmentModal}
        onModalClose={() => setAttachmentModal(undefined)}
      />
      <HStack gap="4" wrap={false}>
        <IconDiv align="center">
          {sed.status === 'received' && <DownloadIcon color='var(--a-surface-action)' width='32' height='32' />}
          {sed.status === 'sent' && <PaperplaneIcon color='green' width='32' height='32' />}
          {sed.status === 'new' && <StarIcon color='orange' width='32' height='32' />}
          {sed.status === 'active' && <PencilIcon width='32' height='32' />}
          {sed.status === 'cancelled' && <XMarkIcon color='red' width='32' height='32' />}
          {!sed.status && <QuestionmarkDiamondIcon color='black' width='32' height='32' />}
          <IconSpacerDiv/>
          <Detail>
            {t('app:status-received-' + (sed.status?.toLowerCase() ?? 'unknown'))}
          </Detail>
          <Detail>
            {sed.sistEndretDato}
          </Detail>
        </IconDiv>
        <VStack gap="2">
          {hasDeviatedFagsak && sed.fagsak &&
            <HStack gap="1">
              {sed.fagsak.fnr !== currentFagsak?.fnr && <Tag size="xsmall" variant={"warning-moderate"}>{sed.fagsak.fnr}</Tag>}
              {sed.fagsak.tema !== currentFagsak?.tema && <Tag size="xsmall" variant={"warning-moderate"}>{t('tema:' + sed.fagsak.tema)}</Tag>}
              {sed.fagsak?.nr && sed.fagsak?.nr !== currentFagsak?.nr && <Tag size="xsmall" variant={"warning-moderate"}>{sed.fagsak?.nr}</Tag>}
              {!sed.fagsak?.nr && sed.fagsak?.type && sed.fagsak?.type !== currentFagsak?.type && <Tag size="xsmall" variant={"warning-moderate"}>{t('journalfoering:' + sed.fagsak?.type)}</Tag>}
              <DeviationHelpText title={t('journalfoering:avvikende-journalfoering')}>
                <VStack gap="2">
                  <Heading size={"xsmall"}>{t('journalfoering:avvikende-journalfoering')}</Heading>
                  <HStack gap="4">

                    <div>
                      <BodyLong size={"small"}>
                        <div>{t('label:person')}:</div>
                        <div>{t('label:tema')}:</div>
                        <div>{t('label:fagsak')}:</div>
                      </BodyLong>
                    </div>
                    <div>
                      <BodyLong size={"small"}>
                        <div>{sed.fagsak?.fnr ? sed.fagsak?.fnr : ""}</div>
                        <div>{sed.fagsak?.tema ? t('tema:' + sed.fagsak.tema) : ""}</div>
                        <div>{sed.fagsak?.nr ? sed.fagsak?.nr : sed.fagsak?.type ? t('journalfoering:' + sed.fagsak?.type) : ""}</div>
                      </BodyLong>
                    </div>

                  </HStack>
                </VStack>
              </DeviationHelpText>
            </HStack>
          }
          <HStack align="center">
            <Heading size='small'>
              {sed.sedType} - {sed.sedTittel}
            </Heading>
            <PreviewSED
              short
              size='small'
              rinaSakId={currentSak.sakId}
              sedId={sed.sedId}
              disabled={!hasSedHandlinger}
            />
            <Button
              variant='tertiary'
              size='small'
              disabled={!hasSedHandlinger || isDownloadingPDF}
              data-amplitude='svarsed.selection.download'
              onClick={downloadPDF}
              icon={<DownloadIcon />}
              loading={isDownloadingPDF}
              title={t('label:last-ned-pdf')}
            >
            </Button>
            {sed.vedlegg && sed.vedlegg.length > 0 && (
              <div className="navds-button navds-button--tertiary navds-button--small navds-button--icon-only">
                <AttachmentButton variant="tertiary" onClick={openAttachmentModal} disabled={!hasSedHandlinger}>
                  <AttachmentIcon/><span>({sed?.vedlegg?.length})</span>
                </AttachmentButton>
              </div>
            )}
            {sedHandlingerRINA && sedHandlingerRINA.length > 0 &&
              <MyHelpText title="Handlinger tilgjengelig i RINA" placement={"right"} wrapperClassName="navds-button navds-button--tertiary navds-button--small navds-button--icon-only">
                <Heading size="xsmall">Handlinger tilgjengelig i RINA</Heading>
                <ul>
                  {sedHandlingerRINA.map((sedhandling) => {
                    return (
                      <li>{t('sedhandlinger:' + sedhandling, t('sedhandlinger:besvar-med', {SED: sedhandling}))}</li>
                    )
                  })}
                </ul>
              </MyHelpText>
            }
          </HStack>

          <HStack gap="2">
            {showEditButton && (
              <>
                <Button
                  variant='secondary'
                  disabled={_editingSed}
                  data-amplitude='svarsed.selection.editsed'
                  onClick={(e: any) => {
                    buttonLogger(e, {
                      type: sed.sedType
                    })
                    onEditingSedClick(sed, currentSak)
                  }}
                >
                  {_editingSed
                    ? (
                      <>
                        {t('message:loading-editing')}
                        <Loader />
                      </>
                      )
                    : t('label:edit-sed')}
                </Button>
              </>
            )}
            {showUpdateButton && (
              <>
                <Button
                  variant='secondary'
                  disabled={_updatingSed}
                  data-amplitude='svarsed.selection.updatesed'
                  onClick={(e: any) => {
                    buttonLogger(e, {
                      type: sed.sedType
                    })
                    onUpdatingSedClick(sed, currentSak)
                  }}
                >
                  {_updatingSed
                    ? (
                      <>
                        {t('message:loading-updating')}
                        <Loader />
                      </>
                      )
                    : t('label:oppdater-sed')}
                </Button>
              </>
            )}
            {showDeleteButton && (
              <>
                <Button
                  variant='secondary'
                  disabled={_deletingSed}
                  data-amplitude='svarsed.selection.deletesed'
                  onClick={(e: any) => {
                    buttonLogger(e, {
                      type: sed.sedType
                    })
                    onDeleteSedClick(currentSak.sakId, sed.sedId)
                  }}
                >
                  {_deletingSed
                    ? (
                      <>
                        {t('message:loading-deleting')}
                        <Loader />
                      </>
                    )
                    : t('label:slett-sed')}
                </Button>
              </>
            )}
            {showInvalidateButton && (
              <>
                <Button
                  variant='secondary'
                  disabled={_invalidatingSed}
                  data-amplitude='svarsed.selection.invalidatesed'
                  onClick={(e: any) => {
                    buttonLogger(e, {
                      type: sed.sedType
                    })
                    onInvalidatingSedClick(sed, currentSak)
                  }}
                >
                  {_invalidatingSed
                    ? (
                      <>
                        {t('message:loading-invalidating')}
                        <Loader />
                      </>
                      )
                    : t('label:invalidate-sed')}
                </Button>
              </>
            )}
            {showRejectButton && (
              <>
                <Button
                  variant='secondary'
                  disabled={_rejectingSed}
                  data-amplitude='svarsed.selection.rejectsed'
                  onClick={(e: any) => {
                    buttonLogger(e, {
                      type: sed.sedType
                    })
                    onRejectingSedClick(sed, currentSak)
                  }}
                >
                  {_rejectingSed
                    ? (
                      <>
                        {t('message:loading-rejecting')}
                        <Loader />
                      </>
                      )
                    : t('label:reject-sed')}
                </Button>
              </>
            )}
            {showClarifyButton && (
              <>
                <Button
                  variant='secondary'
                  disabled={_clarifyingSed}
                  data-amplitude='svarsed.selection.clarifysed'
                  onClick={(e: any) => {
                    buttonLogger(e, {
                      type: sed.sedType
                    })
                    onClarifyingSedClick(sed, currentSak)
                  }}
                >
                  {_clarifyingSed
                    ? (
                      <>
                        {t('message:loading-clarifying')}
                        <Loader />
                      </>
                      )
                    : t('label:klarkjør-sed')}
                </Button>
              </>
            )}
            {showRemindButton && (
              <>
                <Button
                  variant='primary'
                  disabled={_reminderSed}
                  data-amplitude='svarsed.selection.remindsed'
                  onClick={(e: any) => {
                    buttonLogger(e, {
                      type: sed.sedType
                    })
                    onRemindSedClick(sed, currentSak)
                  }}
                >
                  {_reminderSed
                    ? (
                      <>
                        {t('message:loading-remind')}
                        <Loader />
                      </>
                      )
                    : t('label:svar-på-påminnelse')}
                </Button>
              </>
            )}
            {showReplyToSedButton && (
              <>
                <Button
                  variant='primary'
                  disabled={_replyingToSed || !!currentSak.ikkeJournalfoerteSed?.length}
                  data-amplitude='svarsed.selection.replysed'
                  title={!!currentSak.ikkeJournalfoerteSed?.length ? t('message:warning-spørre-sed-not-journalført') : ''}
                  onClick={(e: any) => {
                    buttonLogger(e, {
                      type: sed.svarsedType,
                      parenttype: sed.sedType
                    })
                    onReplySedClick(sed, currentSak)
                  }}
                >
                  {_replyingToSed
                    ? (
                      <>
                        {t('message:loading-replying')}
                        <Loader />
                      </>
                      )
                    : t('label:besvar-med', {
                      sedtype: sed.svarsedType
                    })}
                </Button>
              </>
            )}
          </HStack>
        </VStack>
      </HStack>
    </SedBox>
  )
}

export default SEDPanel
