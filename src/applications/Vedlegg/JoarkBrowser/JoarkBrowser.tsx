import * as icons from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getJoarkItemPreview, listJoarkItems, setJoarkItemPreview } from 'actions/attachments'
import Trashcan from 'assets/icons/Trashcan'
import Modal from 'components/Modal/Modal'
import {
  JoarkBrowserContext,
  JoarkBrowserItem,
  JoarkBrowserItems,
  JoarkBrowserItemWithContent,
  JoarkDoc,
  JoarkFileVariant,
  JoarkPoster
} from 'declarations/attachments'
import { ModalContent } from 'declarations/components'
import { State } from 'declarations/reducers'
import FileFC from 'forhandsvisningsfil'
import _ from 'lodash'
import { Element } from 'nav-frontend-typografi'
import { HighContrastKnapp } from 'nav-hoykontrast'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import Table from 'tabell'
import md5 from 'md5'

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
  previewFile: JoarkBrowserItemWithContent | undefined
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
  previewFile: state.attachments.previewFile
})

export interface JoarkBrowserProps {
  existingItems: JoarkBrowserItems
  fnr: string
  highContrast?: boolean
  onRowSelectChange?: (f: JoarkBrowserItems) => void
  onPreviewFile?: (f: JoarkBrowserItemWithContent) => void
  onRowViewDelete?: (f: JoarkBrowserItems) => void
  mode: JoarkBrowserMode
  tableId: string
}

export const JoarkBrowser: React.FC<JoarkBrowserProps> = ({
  existingItems = [],
  fnr,
  highContrast = false,
  mode,
  onRowSelectChange = () => {},
  onRowViewDelete = () => {},
  onPreviewFile,
  tableId
}: JoarkBrowserProps): JSX.Element => {
  const {
    list, gettingJoarkList, gettingJoarkFile, previewFile
  }: JoarkBrowserSelector = useSelector<State, JoarkBrowserSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [_clickedPreviewItem, setClickedPreviewItem] = useState<JoarkBrowserItem | undefined>(undefined)
  const [_items, setItems] = useState<JoarkBrowserItems | undefined>(undefined)
  const [_mounted, setMounted] = useState<boolean>(false)
  const [_modal, setModal] = useState<ModalContent | undefined>(undefined)
  const [_previewFile, setPreviewFile] = useState<JoarkBrowserItemWithContent | undefined>(undefined)
  const [_tableKey, setTableKey] = useState<string>('')

  const context: JoarkBrowserContext = {
    existingItems: existingItems,
    gettingJoarkFile: gettingJoarkFile,
    previewFile: _previewFile,
    clickedPreviewItem: _clickedPreviewItem,
    mode: mode
  }

  const equalFiles = (a: JoarkBrowserItem | undefined, b: JoarkBrowserItem | undefined): boolean => {
    if (!a && !b) { return true }
    if ((!a && b) || (a && !b)) { return false }

    if (
      (!(a as any).journalpostId && (b as any).journalpostId) ||
      ((a as any).journalpostId && !(b as any).journalpostId)) {
      return false
    }
    return a!.journalpostId === b!.journalpostId &&
      a!.dokumentInfoId === b!.dokumentInfoId &&
      _.isEqual(a!.variant, b!.variant)
  }

  const handleModalClose = useCallback(() => {
    dispatch(setJoarkItemPreview(undefined))
  }, [dispatch])

  const onPreviewItem = (clickedItem: JoarkBrowserItem): void => {
    setClickedPreviewItem(clickedItem)
    dispatch(getJoarkItemPreview(clickedItem))
  }

  const handleDelete = (itemToDelete: JoarkBrowserItem, contextFiles: JoarkBrowserItems | undefined): void => {
    const newExistingItems: JoarkBrowserItems = _.reject(contextFiles, (item: JoarkBrowserItem) => {
      return itemToDelete.journalpostId === item.journalpostId &&
        itemToDelete.dokumentInfoId === item.dokumentInfoId
    })
    if (_.isFunction(onRowViewDelete)) {
      onRowViewDelete(newExistingItems)
    }
  }

  const renderButtonsCell = (item: JoarkBrowserItem, value: any, context: JoarkBrowserContext | undefined): JSX.Element => {
    if (item.hasSubrows) {
      return <div />
    }
    const previewing = context?.gettingJoarkFile
    const spinner = previewing && _.isEqual(item as JoarkBrowserItem, context?.clickedPreviewItem)
    return (
      <ButtonsDiv>
        {item.journalpostId && item.dokumentInfoId && (
          <HighContrastKnapp
            data-tip={t('label:preview')}
            kompakt
            mini
            disabled={previewing}
            spinner={spinner}
            id={'tablesorter__preview-button-' + item.journalpostId + '-' + item.dokumentInfoId}
            className='tablesorter__preview-button'
            onClick={() => onPreviewItem(item as JoarkBrowserItem)}
          >
            {spinner ? '' : <FontAwesomeIcon icon={icons.faEye} />}
          </HighContrastKnapp>
        )}

        {mode === 'view' && item.type === 'joark' && (
          <HighContrastKnapp
            kompakt
            mini
            onClick={(e: any) => {
              e.preventDefault()
              e.stopPropagation()
              handleDelete(item as JoarkBrowserItem, context?.existingItems)
            }}
          >
            <Trashcan />
          </HighContrastKnapp>
        )}
      </ButtonsDiv>
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
      let multipleDocuments: boolean = false

      if (post.dokumenter.length > 1) {
        multipleDocuments = true
        items.push({
          key: 'joark-group-' + post.journalpostId,
          type: 'joark',

          journalpostId: post.journalpostId,
          dokumentInfoId: undefined,
          variant: undefined,

          title: post.tittel,
          tema: post.tema,
          date: new Date(Date.parse(post.datoOpprettet)),

          disabled: false,
          hasSubrows: true
        } as JoarkBrowserItem)
      }

      post.dokumenter.forEach((doc: JoarkDoc) => {
        const variant = getVariantFromJoarkDoc(doc)

        const selected = _.find(selectedItems, {
          dokumentInfoId: doc.dokumentInfoId,
          variant: variant
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
          variant: variant,

          title: doc.tittel || '-',
          tema: post.tema,
          date: new Date(Date.parse(post.datoOpprettet)),

          selected: selected,
          disabled: disabled,
          hasSubrows: false
        }
        if (multipleDocuments) {
          item.parentKey = 'joark-group-' + post.journalpostId
        }
        items.push(item)
      })
    })

    return items
  }

  const getItemsForViewMode = (list: Array<JoarkPoster> | undefined, existingItems: JoarkBrowserItems): JoarkBrowserItems => {
    const items: JoarkBrowserItems = []
    existingItems.forEach((existingItem: JoarkBrowserItem, index: number) => {
      const match = existingItem.title.match(/^(\d+)_ARKIV\.pdf$/)
      if (list && match) {
        const id = match[1]
        let journalpostDoc: JoarkDoc | undefined
        for (const jp of list) {
          for (const doc of jp.dokumenter) {
            if (doc.dokumentInfoId === id) {
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
        key: existingItem.dokumentInfoId ? 'id-' + existingItem.dokumentInfoId : 'id-' + index,
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
    setTableKey(md5(JSON.stringify(list) + JSON.stringify(existingItems)))
  }, [existingItems, list, mode])

  useEffect(() => {
    if (!_mounted && list === undefined && !gettingJoarkList) {
      dispatch(listJoarkItems(fnr))
    }
    setMounted(true)
  }, [fnr, dispatch, list, gettingJoarkList, _mounted])

  useEffect(() => {
    if (!equalFiles(previewFile, _previewFile)) {
      setPreviewFile(previewFile)
      if (!previewFile) {
        return setModal(undefined)
      }
      setModal({
        closeButton: true,
        modalContent: (
          <div
            style={{ cursor: 'pointer' }}
          >

            <FileFC
              file={previewFile}
              width={600}
              height={800}
              tema='simple'
              initialPage={1}
              viewOnePage={false}
              onContentClick={handleModalClose}
            />
          </div>
        )
      })
      if (_.isFunction(onPreviewFile)) {
        onPreviewFile(previewFile)
      }
    }
  }, [handleModalClose, onPreviewFile, previewFile, _previewFile])

  if (!_mounted) {
    return <div />
  }

  return (
    <div data-test-id='joarkBrowser'>
      <Modal
        highContrast={highContrast}
        modal={_modal}
        onModalClose={handleModalClose}
      />
      <Table
        <JoarkBrowserItem, JoarkBrowserContext>
        id={'joarkbrowser-' + tableId}
        key={_tableKey}
        highContrast={highContrast}
        items={_items}
        context={context}
        labels={{
          type: t('label:vedlegg').toLowerCase()
        }}
        animatable={false}
        itemsPerPage={30}
        compact
        searchable={mode === 'select'}
        selectable={mode === 'select'}
        sortable={mode === 'select'}
        summary
        loading={gettingJoarkList}
        columns={[
          {
            id: 'tema',
            label: t('label:tema'),
            type: 'string',
            renderCell: (item: any, value: any) => <Element>{value}</Element>
          }, {
            id: 'title',
            label: t('label:tittel'),
            type: 'string'
          }, {
            id: 'date',
            label: t('label:dato'),
            type: 'date',
            dateFormat: 'DD.MM.YYYY'
          }, {
            id: 'buttons',
            label: '',
            type: 'object',
            renderCell: renderButtonsCell
          }
        ]}
        onRowSelectChange={onRowSelectChange}
      />
    </div>
  )
}

JoarkBrowser.propTypes = {
  // existingItems: PT.arrayOf(JoarkBrowserItemFileType.isRequired).isRequired,
  highContrast: PT.bool,
  onRowSelectChange: PT.func,
  onPreviewFile: PT.func,
  onRowViewDelete: PT.func,
  mode: PT.oneOf<JoarkBrowserMode>(['select', 'view']).isRequired,
  tableId: PT.string.isRequired
}

export default JoarkBrowser
