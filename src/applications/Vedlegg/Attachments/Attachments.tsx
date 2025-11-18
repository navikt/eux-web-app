import {BodyLong, Box, Button, Heading, HStack, Select, TextField, VStack} from '@navikt/ds-react'
import { JoarkBrowser } from 'applications/Vedlegg/JoarkBrowser/JoarkBrowser'
import SEDAttachmentModal from 'applications/Vedlegg/SEDAttachmentModal/SEDAttachmentModal'
import { HorizontalLineSeparator, SpacedHr } from 'components/StyledComponents'
import { JoarkBrowserItem, JoarkBrowserItems } from 'declarations/attachments'
import _ from 'lodash'
import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import {Attachment} from "../../../declarations/types";
import AttachmentsFromRinaTable from "./AttachmentsFromRinaTable";
import {Barn, F001Sed, ReplySed} from "../../../declarations/sed";
import {getFnr} from "../../../utils/fnr";
import {isFSed} from "../../../utils/sed";

export interface AttachmentsProps {
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

  const bFnr = getFnr(replySed, 'bruker')
  const eFnr = getFnr(replySed, 'ektefelle')
  const aFnr = getFnr(replySed, 'annenPerson')

  const [_fnr, setFnr] = useState<string | undefined>(bFnr ? bFnr : eFnr ? eFnr : aFnr ? aFnr : undefined)
  const [_fnrField, setFnrField] = useState<string | undefined>(undefined)

  const sedAttachmentSorter = (a: JoarkBrowserItem, b: JoarkBrowserItem): number => {
    if (b.type === 'joark' && a.type === 'sed') return -1
    if (b.type === 'sed' && a.type === 'joark') return 1
    return b.key.localeCompare(a.key)
  }

  const onJoarkAttachmentsChanged = (jbi: JoarkBrowserItems): void => {
    const newAttachments = _items
      .concat(jbi.filter(attachment => !_items.find(item => item.dokumentInfoId === attachment.dokumentInfoId)))
      .sort(sedAttachmentSorter);

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

  useEffect(() => {
    const bFnr = getFnr(replySed, 'bruker')
    const eFnr = getFnr(replySed, 'ektefelle')
    const aFnr = getFnr(replySed, 'annenPerson')

    setFnr(bFnr ? bFnr : eFnr ? eFnr : aFnr ? aFnr : undefined)
  }, [replySed])

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
          {(replySed as F001Sed).annenPerson?.personInfo.fornavn}&nbsp;
          {(replySed as F001Sed).annenPerson?.personInfo.etternavn}
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
      <Select
        label={t("label:vis-vedlegg-tabell-for")}
        onChange={fnrSelect}
      >
        <option selected={_fnr === ""} value="">
          {t('label:velg-en-person')}
        </option>
        {FNRSelectOptions}
      </Select>
    )
  }

  const fnrSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFnr(e.currentTarget.value);
    setFnrField("")
  }

  return (
    <Box padding="4" borderWidth="1" background="bg-default">
      <VStack gap="4">
        <Heading size='small'>
          {t('label:vedlegg')}
        </Heading>
        <HorizontalLineSeparator />
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
              <HStack gap="4">
                <FNRSelectColumn/>
                {isFSed(replySed) &&
                  <>
                    <span style={{display: 'flex', alignItems: 'center', paddingTop: '1.5rem'}}>evt.</span>
                    <TextField
                      id='fnr'
                      label={t('label:fnr')}
                      hideLabel={false}
                      onChange={(e) => setFnrField(e.target.value)}
                      onBlur={(e) => setFnr(e.target.value)}
                      value={_fnrField}
                    />
                  </>
                }
                <div className='nolabel'>
                  <Button
                    variant='secondary'
                    disabled={_.isNil(_fnr)}
                    onClick={(e: any) => {
                      setAttachmentsTableVisible(!_attachmentsTableVisible)
                    }}
                  >
                    {t('label:vis-vedlegg-tabell')}
                  </Button>
                </div>
              </HStack>
            </>
            )
          : (
            <>
              <Heading size="xsmall">Vedlegg som legges til etter lagring av SED</Heading>
              <JoarkBrowser
                existingItems={_items}
                fnr={_fnr}
                mode='view'
                tableId='vedlegg-view'
                onUpdateAttachmentSensitivt={onUpdateAttachmentSensitivt}
              />
              <HStack gap="4">
                <FNRSelectColumn/>
                {isFSed(replySed) &&
                  <>
                    <span style={{display: 'flex', alignItems: 'center', paddingTop: '1.5rem'}}>evt.</span>
                    <TextField
                    id='fnr'
                    label={t('label:fnr')}
                    hideLabel={false}
                    onChange={(e) => setFnrField(e.target.value)}
                    onBlur={(e) => setFnr(e.target.value)}
                    value={_fnrField}
                    />
                  </>
                }
                <div className='nolabel'>
                  <Button
                    variant='secondary'
                    disabled={_.isNil(_fnr)}
                    onClick={(e: any) => {
                      setAttachmentsTableVisible(!_attachmentsTableVisible)
                    }}
                  >
                    {t('label:vis-vedlegg-tabell')}
                  </Button>
                </div>
              </HStack>
              <Heading size="xsmall">Vedlegg lagret i RINA</Heading>
              <AttachmentsFromRinaTable sedId={sedId} rinaSakId={rinaSakId} attachmentsFromRina={attachmentsFromRina}/>
            </>
            )}
      </VStack>
    </Box>
  )
}

export default Attachments
