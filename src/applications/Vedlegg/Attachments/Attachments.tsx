import { BodyLong, Button, Heading, Panel } from '@navikt/ds-react'
import { VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { JoarkBrowser } from 'applications/Vedlegg/JoarkBrowser/JoarkBrowser'
import SEDAttachmentModal from 'applications/Vedlegg/SEDAttachmentModal/SEDAttachmentModal'
import { HorizontalLineSeparator, SpacedHr } from 'components/StyledComponents'
import { JoarkBrowserItem, JoarkBrowserItems } from 'declarations/attachments'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import {Attachment} from "../../../declarations/types";
import AttachmentsFromRinaTable from "./AttachmentsFromRinaTable";

export interface AttachmentsProps {
  fnr: string | undefined
  onAttachmentsChanged: (items: JoarkBrowserItems) => void,
  onUpdateAttachmentSensitivt: (item: JoarkBrowserItem, sensitivt: boolean) => void,
  attachmentsFromRina: Array<Attachment> | undefined
  sedId: string | undefined
  rinaSakId: string | undefined
  savedVedlegg: JoarkBrowserItem | null | undefined
  setVedleggSensitiv: any | null | undefined
}

const Attachments: React.FC<AttachmentsProps> = ({
  fnr,
  onAttachmentsChanged,
  onUpdateAttachmentSensitivt,
  attachmentsFromRina,
  sedId,
  rinaSakId,
  savedVedlegg,
  setVedleggSensitiv
}: AttachmentsProps): JSX.Element => {
  const { t } = useTranslation()
  const [_attachmentsTableVisible, setAttachmentsTableVisible] = useState<boolean>(false)
  const [_items, setItems] = useState<JoarkBrowserItems>([])

  const sedAttachmentSorter = (a: JoarkBrowserItem, b: JoarkBrowserItem): number => {
    if (b.type === 'joark' && a.type === 'sed') return -1
    if (b.type === 'sed' && a.type === 'joark') return 1
    return b.key.localeCompare(a.key)
  }

  const onJoarkAttachmentsChanged = (jbi: JoarkBrowserItems): void => {
    const sedOriginalAttachments: JoarkBrowserItems = _.filter(_items, (att) => att.type !== 'joark')
    const newAttachments = sedOriginalAttachments.concat(jbi).sort(sedAttachmentSorter)
    setItems(newAttachments)
    onAttachmentsChanged(newAttachments)
  }

  useEffect(() => {
    const newAttachments = _.reject(_items, (att) => att.key === savedVedlegg?.key)
    setItems(newAttachments)
  }, [savedVedlegg])

  useEffect(() => {
    const newAttachments = _items.map((att) => {
      if(att.key === setVedleggSensitiv.attachmentKey){
        return {
          ...att,
          sensitivt: setVedleggSensitiv.sensitivt
        }
      } else {
        return att
      }
    })
    setItems(newAttachments)
  }, [setVedleggSensitiv])



  return (
    <Panel border>
      <Heading size='small'>
        {t('label:vedlegg')}
      </Heading>
      <VerticalSeparatorDiv />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      <SEDAttachmentModal
        open={_attachmentsTableVisible}
        fnr={fnr!}
        onModalClose={() => setAttachmentsTableVisible(false)}
        onFinishedSelection={onJoarkAttachmentsChanged}
        sedAttachments={_items}
        tableId='vedlegg-modal'
      />
      {_.isEmpty(_items) && _.isEmpty(attachmentsFromRina)
        ? (
          <>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-attachments')}
            </BodyLong>
            <SpacedHr />
          </>
          )
        : (
          <>
            <h4>Vedlegg som legges til etter lagring av SED</h4>
            <JoarkBrowser
              existingItems={_items}
              fnr={fnr}
              mode='view'
              tableId='vedlegg-view'
              onUpdateAttachmentSensitivt={onUpdateAttachmentSensitivt}
            />
            <h4>Vedlegg lagret i RINA</h4>
            <AttachmentsFromRinaTable sedId={sedId} rinaSakId={rinaSakId} attachmentsFromRina={attachmentsFromRina}/>
          </>
          )}
      <VerticalSeparatorDiv />
      <Button
        variant='secondary'
        data-amplitude='svarsed.editor.attachments'
        disabled={_.isNil(fnr)}
        onClick={(e: any) => {
          buttonLogger(e)
          setAttachmentsTableVisible(!_attachmentsTableVisible)
        }}
      >
        {t('label:vis-vedlegg-tabell')}
      </Button>
    </Panel>
  )
}

export default Attachments
