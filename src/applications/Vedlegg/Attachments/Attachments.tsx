import {BodyLong, Button, Heading, Panel, Select} from '@navikt/ds-react'
import { VerticalSeparatorDiv, AlignStartRow, Column } from '@navikt/hoykontrast'
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
import {Barn, F001Sed, ReplySed} from "../../../declarations/sed";
import {getFnr} from "../../../utils/fnr";

export interface AttachmentsProps {
  fnr: string | undefined
  replySed: ReplySed | null | undefined
  onAttachmentsChanged: (items: JoarkBrowserItems) => void,
  onUpdateAttachmentSensitivt: (item: JoarkBrowserItem, sensitivt: boolean) => void,
  attachmentsFromRina: Array<Attachment> | undefined
  sedId: string | undefined
  rinaSakId: string | undefined
  savedVedlegg: JoarkBrowserItem | null | undefined
  setVedleggSensitiv: any | null | undefined,
  attachmentRemoved: JoarkBrowserItem | null | undefined
}

const Attachments: React.FC<AttachmentsProps> = ({
  fnr,
  replySed,
  onAttachmentsChanged,
  onUpdateAttachmentSensitivt,
  attachmentsFromRina,
  sedId,
  rinaSakId,
  savedVedlegg,
  setVedleggSensitiv,
  attachmentRemoved
}: AttachmentsProps): JSX.Element => {
  const { t } = useTranslation()
  const [_attachmentsTableVisible, setAttachmentsTableVisible] = useState<boolean>(false)
  const [_items, setItems] = useState<JoarkBrowserItems>([])
  const [_fnr, setFnr] = useState<string | undefined>(getFnr(replySed, 'bruker'))

  const sedAttachmentSorter = (a: JoarkBrowserItem, b: JoarkBrowserItem): number => {
    if (b.type === 'joark' && a.type === 'sed') return -1
    if (b.type === 'sed' && a.type === 'joark') return 1
    return b.key.localeCompare(a.key)
  }

  const onJoarkAttachmentsChanged = (jbi: JoarkBrowserItems): void => {
    //const sedOriginalAttachments: JoarkBrowserItems = _.filter(_items, (att) => att.type !== 'joark')
    const newAttachments = _items.concat(jbi).sort(sedAttachmentSorter)
    setItems(newAttachments)
    onAttachmentsChanged(newAttachments)
  }

  useEffect(() => {
    const newAttachments = _.reject(_items, (att) => att.key === savedVedlegg?.key)
    setItems(newAttachments)
  }, [savedVedlegg])

  useEffect(() => {
    const newAttachments = _.reject(_items, (att) => att.key === attachmentRemoved?.key)
    setItems(newAttachments)
  }, [attachmentRemoved])

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

  const FNRSelectColumn = () => {
    let FNRSelectOptions = []

    const brukerFnr = getFnr(replySed, 'bruker')
    const ektefelleFnr = getFnr(replySed, 'ektefelle')
    const annenPersonFnr = getFnr(replySed, 'annenPerson')

    if(brukerFnr) {
      FNRSelectOptions.push(
        <option selected={_fnr === brukerFnr} value={brukerFnr}>
          {(replySed as F001Sed).bruker.personInfo.fornavn}&nbsp;
          {(replySed as F001Sed).bruker.personInfo.etternavn}
        </option>
      )
    }

    if(ektefelleFnr) {
      FNRSelectOptions.push(
        <option selected={_fnr === ektefelleFnr} value={ektefelleFnr}>
          {(replySed as F001Sed).ektefelle?.personInfo.fornavn}&nbsp;
          {(replySed as F001Sed).ektefelle?.personInfo.etternavn}
        </option>
      )
    }
    if(annenPersonFnr) {
      FNRSelectOptions.push(
        <option selected={_fnr === annenPersonFnr} value={annenPersonFnr}>
          {(replySed as F001Sed).ektefelle?.personInfo.fornavn}&nbsp;
          {(replySed as F001Sed).ektefelle?.personInfo.etternavn}
        </option>
      )
    }

    if((replySed as F001Sed).barn){
      (replySed as F001Sed).barn?.forEach((b: Barn, idx:number) => {
        const bFnr = getFnr(replySed, 'barn[' + idx + ']')
        if(bFnr) {
          FNRSelectOptions.push(
            <option selected={_fnr === bFnr} value={bFnr}>
              {b.personInfo.fornavn}&nbsp;
              {b.personInfo.etternavn}
            </option>
          )
        }
      })
    }

    if(FNRSelectOptions.length === 0) return null

    return(
      <Column flex="0.5">
        <Select label={t("label:vis-vedlegg-tabell-for")} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFnr(e.currentTarget.value)}>
          <option value="">{t("label:velg-en-person")}</option>
          {FNRSelectOptions}
        </Select>
      </Column>
    )
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
        fnr={_fnr!}
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
            <VerticalSeparatorDiv/>
            <AlignStartRow>
              <FNRSelectColumn/>
              <Column>
                <div className='nolabel'>
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
                </div>
              </Column>
            </AlignStartRow>
          </>
          )
        : (
          <>
            <h4>Vedlegg som legges til etter lagring av SED</h4>
            <JoarkBrowser
              existingItems={_items}
              fnr={_fnr}
              mode='view'
              tableId='vedlegg-view'
              onUpdateAttachmentSensitivt={onUpdateAttachmentSensitivt}
            />
            <VerticalSeparatorDiv />
            <AlignStartRow>
              <FNRSelectColumn/>
              <Column>
                <div className='nolabel'>
                  <Button
                    variant='secondary'
                    data-amplitude='svarsed.editor.attachments'
                    disabled={_.isNil(_fnr)}
                    onClick={(e: any) => {
                      buttonLogger(e)
                      setAttachmentsTableVisible(!_attachmentsTableVisible)
                    }}
                  >
                    {t('label:vis-vedlegg-tabell')}
                  </Button>
                </div>
              </Column>
            </AlignStartRow>
            <h4>Vedlegg lagret i RINA</h4>
            <AttachmentsFromRinaTable sedId={sedId} rinaSakId={rinaSakId} attachmentsFromRina={attachmentsFromRina}/>
          </>
          )}
    </Panel>
  )
}

export default Attachments
