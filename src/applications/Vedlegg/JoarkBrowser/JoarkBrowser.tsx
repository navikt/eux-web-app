import {BodyLong, Button, Checkbox, Label, Loader} from '@navikt/ds-react'
import { VerticalSeparatorDiv } from '@navikt/hoykontrast'
import Table, { RenderOptions } from '@navikt/tabell'
import { getJoarkItemPreview, listJoarkItems, setJoarkItemPreview } from 'actions/attachments'
import Modal from 'components/Modal/Modal'
import {
  JoarkBrowserContext,
  JoarkBrowserItem,
  JoarkBrowserItems,
  JoarkDoc,
  JoarkFileVariant,
  JoarkPoster,
  JoarkRelevantDato
} from 'declarations/attachments'
import { ModalContent } from 'declarations/components'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import md5 from 'md5'
import moment from 'moment'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'
import { blobToBase64 } from 'utils/blob'
import { TrashIcon } from '@navikt/aksel-icons';
import {removeAttachment} from "../../../actions/svarsed";
import PDFViewer from "../../../components/PDFViewer/PDFViewer";

const ButtonsDiv = styled.div`
  display: flex;
  align-items: flex-start;
  padding-top: 0.25rem;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
`

export interface JoarkBrowserSelector {
  list: Array<JoarkPoster> | undefined
  gettingJoarkList: boolean
  gettingJoarkFile: boolean
  previewFileRaw: Blob | null | undefined
}

export type SedType = 'sed'
export type SedNewType = 'sednew'
export type JoarkType = 'joark'
export type JoarkBrowserMode = 'select' | 'view'
export type JoarkBrowserType = SedType | SedNewType | JoarkType

const mapState = /* istanbul ignore next */ (state: State): JoarkBrowserSelector => ({
  list: state.attachments.list,
  gettingJoarkList: state.loading.gettingJoarkList,
  gettingJoarkFile: state.loading.gettingJoarkFile,
  previewFileRaw: state.attachments.previewFileRaw
})

export interface JoarkBrowserProps {
  existingItems: JoarkBrowserItems
  fnr: string | undefined
  onRowSelectChange?: (f: JoarkBrowserItems) => void
  onPreviewFile?: (f: File) => void
  mode: JoarkBrowserMode
  tableId: string
  onUpdateAttachmentSensitivt? : (item: JoarkBrowserItem, sensitivt: boolean) => void
  onRemoveAttachment? : (item: JoarkBrowserItem) => void
}

export const JoarkBrowser: React.FC<JoarkBrowserProps> = ({
  existingItems = [],
  fnr,
  mode,
  onRowSelectChange = () => {},
  onPreviewFile,
  tableId,
  onUpdateAttachmentSensitivt,
  onRemoveAttachment
}: JoarkBrowserProps): JSX.Element => {
  const {
    list, gettingJoarkList, gettingJoarkFile, previewFileRaw
  }: JoarkBrowserSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const [_clickedPreviewItem, setClickedPreviewItem] = useState<JoarkBrowserItem | undefined>(undefined)
  const [_items, setItems] = useState<JoarkBrowserItems | undefined>(undefined)
  const [_modal, setModal] = useState<ModalContent | undefined>(undefined)
  const [_modalInViewMode, setModalInViewMode] = useState<boolean>(false)
  const [_previewFile, setPreviewFile] = useState<any | undefined>(undefined)
  const [_convertingRawToFile, setConvertingRawToFile] = useState<boolean>(false)
  const [_tableKey, setTableKey] = useState<string>('')

  const context: JoarkBrowserContext = {
    existingItems,
    gettingJoarkFile,
    clickedPreviewItem: _clickedPreviewItem,
    mode
  }

  const handleModalClose = useCallback(() => {
    setModalInViewMode(false)
    setPreviewFile(undefined)
    setModal(undefined)
    dispatch(setJoarkItemPreview(undefined))
  }, [dispatch])

  const onPreviewItem = (clickedItem: JoarkBrowserItem): void => {
    setPreviewFile(undefined)
    setClickedPreviewItem(clickedItem)
    if(mode === "view"){
      setModalInViewMode(true)
    }
    dispatch(getJoarkItemPreview(clickedItem))
  }

  const doRemoveAttachment = (clickedItem: JoarkBrowserItem): void => {
    dispatch(removeAttachment(clickedItem))
  }

  const renderTittel = ({ item, value, context }: RenderOptions<JoarkBrowserItem, JoarkBrowserContext, string>) => {
    if (item.hasSubrows) {
      return <BodyLong>{value}</BodyLong>
    }
    const previewing = context?.gettingJoarkFile
    const spinner = previewing && _.isEqual(item as JoarkBrowserItem, context?.clickedPreviewItem)
    return (
      <ButtonsDiv>
        {item.journalpostId && item.dokumentInfoId && (
          <Button
            variant='tertiary'
            size='small'
            data-tip={t('label:preview')}
            disabled={previewing}
            id={'tablesorter__preview-button-' + item.journalpostId + '-' + item.dokumentInfoId}
            className='tablesorter__preview-button'
            onClick={() => onPreviewItem(item as JoarkBrowserItem)}
          >
            {value}
            {spinner && <Loader />}
          </Button>
        )}
      </ButtonsDiv>
    )
  }

  const renderSensitivt = ({ item }: RenderOptions<JoarkBrowserItem, JoarkBrowserContext, string>) => {
    return (
      <ButtonsDiv>
          <Checkbox
            id={'tablesorter__sensitivt-checkbox-' + item.key + '-' + item.navn}
            checked={item.sensitivt}
            onChange={(e) => onUpdateAttachmentSensitivt ? onUpdateAttachmentSensitivt(item as JoarkBrowserItem, e.target.checked) : undefined}
          >
            {"Sensitivt"}
          </Checkbox>
      </ButtonsDiv>
    )
  }

  const renderDeleteButton = ({ item }: RenderOptions<JoarkBrowserItem, JoarkBrowserContext, string>) => {
    return (
      <Button
        variant='tertiary'
        size='small'
        data-tip={t('label:delete')}
        id={'tablesorter__delete-button-' + item.key + '-' + item.navn}
        className='tablesorter__delete-button'
        onClick={() => onRemoveAttachment ? onRemoveAttachment(item as JoarkBrowserItem) : doRemoveAttachment(item as JoarkBrowserItem)}
        icon={<TrashIcon/>}
      />
    )
  }



  const getVariantFromJoarkDoc = (doc: JoarkDoc): JoarkFileVariant | undefined => {
    let variant = _.find(doc.dokumentvarianter, (v: JoarkFileVariant) => v.variantformat === 'SLADDET')
    if (!variant) {
      variant = _.find(doc.dokumentvarianter, (v: JoarkFileVariant) => v.variantformat === 'ARKIV')
    }
    if (!variant) {
      if (!_.isEmpty(doc.dokumentvarianter)) {
        variant = doc.dokumentvarianter[0]
      }
    }
    return variant
  }

  const getItemsForSelectMode = (list: Array<JoarkPoster> | undefined, existingItems: JoarkBrowserItems): JoarkBrowserItems => {
    if (!list) {
      return []
    }

    const items: JoarkBrowserItems = []
    const disabledItems: JoarkBrowserItems = _.filter(existingItems,
      (item: JoarkBrowserItem) => item.type === 'sed')
    const selectedItems: JoarkBrowserItems = _.filter(existingItems,
      (item: JoarkBrowserItem) => item.type === 'joark')

    list.forEach((post: JoarkPoster) => {
      post.dokumenter.forEach((doc: JoarkDoc) => {
        const variant = getVariantFromJoarkDoc(doc)

        const selected = _.find(selectedItems, {
          dokumentInfoId: doc.dokumentInfoId,
          variant
        }) !== undefined

        let disabled = _.find(disabledItems, {
          dokumentInfoId: doc.dokumentInfoId
        }) !== undefined

        if (!variant) {
          disabled = true
        }

        const item: JoarkBrowserItem = {
          key: post.journalpostId + '-' + doc.dokumentInfoId + '-' + variant?.variantformat + '-' + selected,
          type: 'joark',

          journalpostId: post.journalpostId,
          dokumentInfoId: doc.dokumentInfoId,
          variant,

          title: doc.tittel || '-',
          tema: post.tema,
          date: new Date(Date.parse(post.datoOpprettet)),
          status: post?.journalstatus,
          saksid: post?.sak?.arkivsaksnummer,
          regSentDate: getMottattSendtDato(post),

          selected,
          disabled,
          hasSubrows: false
        }
        selected ? items.unshift(item) : items.push(item)

      })
    })

    return items
  }

  const getMottattSendtDato = (journalpost: JoarkPoster) : Date | null => {
    let calMottattSendtDato: Date | null = null;
    let journalposttype = journalpost.journalposttype.toUpperCase();

    switch (journalposttype) {
      case 'I':
        calMottattSendtDato = getRelevantDato(journalpost.relevanteDatoer, 'DATO_REGISTRERT');
        break;
      case 'N':
        if (journalpost.dokumenter.length > 0
          && journalpost.dokumenter[0].datoFerdigstilt) {
          calMottattSendtDato = new Date(Date.parse(journalpost.dokumenter[0].datoFerdigstilt));
        }
        calMottattSendtDato ??= getRelevantDato(journalpost.relevanteDatoer, 'DATO_JOURNALFOERT');
        calMottattSendtDato ??= getRelevantDato(journalpost.relevanteDatoer, 'DATO_DOKUMENT');
        break;
      case 'U':
        calMottattSendtDato = getRelevantDato(journalpost.relevanteDatoer, 'DATO_EKSPEDERT');
        calMottattSendtDato ??= getRelevantDato(journalpost.relevanteDatoer, 'DATO_SENDT_PRINT');
        calMottattSendtDato ??= getRelevantDato(journalpost.relevanteDatoer, 'DATO_JOURNALFOERT');
        calMottattSendtDato ??= getRelevantDato(journalpost.relevanteDatoer, 'DATO_DOKUMENT');
        break;
    }

    return calMottattSendtDato

  }

  const getRelevantDato = (datoer: Array<JoarkRelevantDato> | null | undefined, type: String): Date | null => {
    if (datoer) {
      let relevantDato = datoer.find((d) => d.datotype.toUpperCase() === type);
      if (relevantDato !== undefined) {
        return new Date(Date.parse(relevantDato.dato))
      }
    }
    return null;
  }

  const getItemsForViewMode = (list: Array<JoarkPoster> | undefined, existingItems: JoarkBrowserItems): JoarkBrowserItems => {
    const items: JoarkBrowserItems = []
    existingItems.forEach((existingItem: JoarkBrowserItem) => {
      const match = existingItem.title.match(/^(\d+)_ARKIV\.pdf$/)
      if (list && match) {
        const id = match[1] // number
        let journalpostDoc: JoarkDoc | undefined
        for (const jp of list) { // iterate joarkposts
          for (const doc of jp.dokumenter) { // iterate documents
            if (doc.dokumentInfoId === id) {  // if dokumentInfoId == eksisterende id
              journalpostDoc = doc
              if (doc.tittel) {
                existingItem.title = doc.tittel
                existingItem.dokumentInfoId = doc.dokumentInfoId
                existingItem.journalpostId = jp.journalpostId
                existingItem.variant = getVariantFromJoarkDoc(doc)
                existingItem.tema = jp.tema
              }
              break
            }
          }
          if (journalpostDoc) {
            break
          }
        }
      }
      items.push({
        ...existingItem,
        //key: existingItem.dokumentInfoId ? 'id-' + existingItem.dokumentInfoId : 'id-' + index,
        type: existingItem.type,
        title: (existingItem.type === 'sed' ? '✓ ' : ' ') + existingItem.title,
        visible: true,
        disabled: false,
        hasSubrows: false
      } as JoarkBrowserItem)
    })
    return items
  }

  // this will update when we get updated existingItems
  useEffect(() => {
    let items: JoarkBrowserItems = []
    if (mode === 'select') {
      items = getItemsForSelectMode(list, existingItems)
    }
    if (mode === 'view') {
      items = getItemsForViewMode(list, existingItems)
    }
    setItems(items)
    setTableKey('' + md5(JSON.stringify(list) + JSON.stringify(existingItems)))
  }, [existingItems, list, mode])

  useEffect(() => {
    if (mode === "select" && fnr && !gettingJoarkList) {
      dispatch(listJoarkItems(fnr, ''))
    }
  }, [fnr])

  useEffect(() => {
    if(mode !== "select" && _modalInViewMode){
      if (_.isUndefined(_previewFile) && !_.isUndefined(previewFileRaw) && !_convertingRawToFile) {
        if (!_.isNull(previewFileRaw)) {
          setConvertingRawToFile(true)

          blobToBase64(previewFileRaw).then((base64: any) => {
            const file: any = {
              id: '' + new Date().getTime(),
              size: previewFileRaw.size,
              name: '',
              mimetype: 'application/pdf',
              content: {
                base64: base64.replaceAll('octet-stream', 'pdf')
              }
            }
            setPreviewFile(file)
            setConvertingRawToFile(false)
          })
        }
      }
    }
  }, [mode, _modalInViewMode, _previewFile, previewFileRaw, _convertingRawToFile])

  useEffect(() => {
    if (!_modal && !_convertingRawToFile && !_.isNil(_previewFile)) {
      setModal({
        modalContent: (
          <div
            style={{ cursor: 'pointer' }}
          >
            <PDFViewer
              file={_previewFile.content.base64!}
              name=""
              size={_previewFile.size}
              width={600}
              height={800}
            />
          </div>
        )
      })
      if (_.isFunction(onPreviewFile)) {
        onPreviewFile(_previewFile)
      }
    }
  }, [_modal, _convertingRawToFile, _previewFile])

  return (
    <div data-testid='joarkBrowser' id='joarkBrowser'>
      <VerticalSeparatorDiv size='0.5' />
      {mode !== "select" &&
        <Modal
          open={!_.isNil(_modal)}
          modal={_modal}
          onModalClose={handleModalClose}
        />
      }
      <Table
        <JoarkBrowserItem, JoarkBrowserContext>
        id={'joarkbrowser-' + tableId}
        key={_tableKey}
        items={_items}
        context={context}
        labels={{
          type: t('label:vedlegg').toLowerCase()
        }}
        animatable={false}
        itemsPerPage={30}
        searchable={mode === 'select'}
        selectable={mode === 'select'}
        sortable={mode === 'select'}
        summary={mode === 'select'}
        showHeader={mode === 'select'}
        striped={mode === 'select'}
        loading={gettingJoarkList}
        columns={mode === 'select'
          ? [
              {
                id: 'tema',
                label: t('label:tema'),
                type: 'string',
                render: ({ value }: RenderOptions<JoarkBrowserItem, JoarkBrowserContext, string>) => <Label>{value}</Label>
              }, {
                id: 'title',
                label: t('label:tittel'),
                type: 'string',
                render: renderTittel
              }, {
                id: 'status',
                label: t('label:status'),
                type: 'string',
                render: ({ value }: RenderOptions<JoarkBrowserItem, JoarkBrowserContext, string>) => <Label>{value}</Label>
              }, {
                id: 'saksid',
                label: t('label:saksid'),
                type: 'string',
                render: ({ value }: RenderOptions<JoarkBrowserItem, JoarkBrowserContext, string>) => <Label>{value}</Label>
              }, {
                id: 'date',
                label: t('label:dato'),
                type: 'date',
                render: ({ value }: RenderOptions<JoarkBrowserItem, JoarkBrowserContext, string>) => {
                  return (
                    <Label>{moment(value).format('DD.MM.YYYY') ?? '-'}</Label>
                  )
                },
                dateFormat: 'DD.MM.YYYY'
              }, {
                id: 'regSentDate',
                label: t('label:regSendtDato'),
                type: 'date',
                render: ({ value }: RenderOptions<JoarkBrowserItem, JoarkBrowserContext, string>) => {
                  return (
                    <Label>{moment(value).format('DD.MM.YYYY') ?? '-'}</Label>
                  )
                },
                dateFormat: 'DD.MM.YYYY'
              }
            ]
          : [
              {
                id: 'title',
                label: t('label:tittel'),
                type: 'string',
                render: renderTittel
              },
              {
                id: 'sensitivt',
                label: 'Sensitivt',
                type: 'string',
                render: renderSensitivt
              },
              {
                id: 'id',
                label: '',
                type: 'string',
                render: renderDeleteButton
              }
            ]}
        onRowSelectChange={onRowSelectChange}
      />
    </div>
  )
}

JoarkBrowser.propTypes = {
  // existingItems: PT.arrayOf(JoarkBrowserItemFileType.isRequired).isRequired,
  onRowSelectChange: PT.func,
  onPreviewFile: PT.func,
  mode: PT.oneOf<JoarkBrowserMode>(['select', 'view']).isRequired,
  tableId: PT.string.isRequired
}

export default JoarkBrowser
