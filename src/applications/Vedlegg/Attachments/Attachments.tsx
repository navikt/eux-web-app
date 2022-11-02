import { BodyLong, Button, Heading, Panel } from '@navikt/ds-react'
import { VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { JoarkBrowser } from 'applications/Vedlegg/JoarkBrowser/JoarkBrowser'
import SEDAttachmentModal from 'applications/Vedlegg/SEDAttachmentModal/SEDAttachmentModal'
import { HorizontalLineSeparator, SpacedHr } from 'components/StyledComponents'
import { JoarkBrowserItem, JoarkBrowserItems } from 'declarations/attachments'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {Attachment, AttachmentTableItem} from "../../../declarations/types";
import Table, {Context} from "@navikt/tabell";

export interface AttachmentsProps {
  fnr: string | undefined
  onAttachmentsChanged: (items: JoarkBrowserItems) => void,
  attachmentsFromRina: Array<Attachment> | undefined
}

const Attachments: React.FC<AttachmentsProps> = ({
  fnr,
  onAttachmentsChanged,
  attachmentsFromRina
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

  const convertFilenameToTitle = (navn: string): string => {
    return navn.replaceAll("_", " ").split(".")[0]
  }

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
            <JoarkBrowser
              existingItems={_items}
              fnr={fnr}
              mode='view'
              tableId='vedlegg-view'
            />
            <Table
              <AttachmentTableItem, Context>
              searchable={false}
              selectable={false}
              sortable={false}
              summary={false}
              showHeader={false}
              striped={false}
              items={attachmentsFromRina ? attachmentsFromRina.map((a)=>{
                return {
                  ...a,
                  navn: convertFilenameToTitle(a.navn),
                  key: a.id,
                }
              }) : []}
              columns={[{id: 'navn', label: 'Tittel', type: 'string'}]}
            />
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
