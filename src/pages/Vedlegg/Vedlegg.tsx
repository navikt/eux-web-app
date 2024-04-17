import { Alert, Button, Link, Loader } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  Container,
  Content,
  Margin,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import * as vedleggActions from 'actions/vedlegg'
import DocumentSearch from 'applications/Vedlegg/DocumentSearch/DocumentSearch'
import Input from 'components/Forms/Input'
import TopContainer from 'components/TopContainer/TopContainer'
import ValidationBox from 'components/ValidationBox/ValidationBox'
import * as types from 'constants/actionTypes'
import { State } from 'declarations/reducers'
import { Validation, VedleggSendResponse } from 'declarations/types'
import _ from 'lodash'
import performValidation from 'utils/performValidation'
import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'
import { validateVedlegg, ValidationVedleggProps } from './validation'
import SEDAttachmentModal from "applications/Vedlegg/SEDAttachmentModal/SEDAttachmentModal";
import SendAttachmentModal from "applications/Vedlegg/SendAttachmentModal/SendAttachmentModal";
import {JoarkBrowserItem, JoarkBrowserItems} from "declarations/attachments";
import JoarkBrowser from "applications/Vedlegg/JoarkBrowser/JoarkBrowser";
import {alertReset} from "actions/alert";
import {propertySet} from "actions/vedlegg";

export interface VedleggSelector {
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined
  rinadokumentID: string | undefined
  rinasaksnummer: string | undefined
  sendingVedlegg: boolean
  vedleggResponse: VedleggSendResponse | undefined
  validation: Validation
}

const mapState = (state: State): VedleggSelector => ({
  alertMessage: state.alert.stripeMessage,
  alertType: state.alert.type,
  sendingVedlegg: state.loading.sendingVedlegg,
  rinadokumentID: state.vedlegg.rinadokumentID,
  rinasaksnummer: state.vedlegg.rinasaksnummer,
  vedleggResponse: state.vedlegg.vedleggResponse,
  validation: state.validation.status
})

export const MyContent = styled(Content)`
  @media (min-width: 768px) {
   min-width: 600px;
   maxWidth: 800px;
 }
  align-items: center;
`

const Vedlegg: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const namespace = 'vedlegg'
  const { t } = useTranslation()
  const { alertMessage, alertType, rinasaksnummer, rinadokumentID, sendingVedlegg, vedleggResponse, validation }: VedleggSelector = useAppSelector(mapState)

  const [_fnr, setFnr] = useState<string | undefined>(undefined)
  const [_attachmentsTableVisible, setAttachmentsTableVisible] = useState<boolean>(false)
  const [_items, setItems] = useState<JoarkBrowserItems>([])
  const [_viewSendVedleggModal, setViewSendVedleggModal] = useState<boolean>(false)


  useEffect(() => {
    const params: URLSearchParams = new URLSearchParams(window.location.search)
    const rinasaksnummer = params.get('rinasaksnummer')
    if (rinasaksnummer) {
      dispatch(vedleggActions.propertySet('rinasaksnummer', rinasaksnummer))
    }
  }, [])

  const sendSkjema = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationVedleggProps>(clonedValidation, namespace, validateVedlegg, {
      rinasaksnummer,
      rinadokumentID
    })
    dispatch(setValidation(clonedValidation))
    if (!hasErrors) {
      setViewSendVedleggModal(true)
    }
  }

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
  }

  const onUpdateAttachmentSensitivt = (attachment: JoarkBrowserItem, sensitivt: boolean) => {
    const newAttachments = _items.map((att) => {
      if(att.key === attachment.key){
        return {
          ...att,
          sensitivt: sensitivt
        }
      } else {
        return att
      }
    })
    setItems(newAttachments)
  }

  const onRemoveAttachment = (attachment: JoarkBrowserItem) => {
    const newAttachments = _items.filter((att) => {
      return att.key !== attachment.key
    })
    setItems(newAttachments)
  }

  useEffect(() => {
    dispatch(propertySet("attachments", _items))
  }, [_items])

  return (
    <TopContainer title={t('app:page-title-vedlegg')}>
      <SendAttachmentModal
        fnr={_fnr!}
        open={_viewSendVedleggModal}
        onModalClose={() => {
          dispatch(alertReset())
          setViewSendVedleggModal(false)
        }}
      />
      <SEDAttachmentModal
        open={_attachmentsTableVisible}
        fnr={_fnr!}
        onModalClose={() => setAttachmentsTableVisible(false)}
        onFinishedSelection={onJoarkAttachmentsChanged}
        sedAttachments={_items}
        tableId='vedlegg-modal'
      />
      <Container>
        <Margin />
        <MyContent>
          <AlignStartRow>
            <Column>
              <Input
                id="fnr"
                error={validation[namespace + '-fnr']?.feilmelding}
                namespace={namespace}
                label="Fødselsnummer"
                onChanged={(fnr) => setFnr(fnr)}
                value={_fnr}
              />
            </Column>
            <Column>
              <div className='nolabel'>
                <Button
                  variant='secondary'
                  data-amplitude='svarsed.editor.attachments'
                  disabled={_.isNil(_fnr) || _fnr === ''}
                  onClick={() => {
                    setAttachmentsTableVisible(!_attachmentsTableVisible)
                  }}
                >
                  {t('label:vis-vedlegg-tabell')}
                </Button>
              </div>
            </Column>
          </AlignStartRow>
          <JoarkBrowser
            existingItems={_items}
            fnr={_fnr}
            mode='view'
            tableId='vedlegg-view'
            onUpdateAttachmentSensitivt={onUpdateAttachmentSensitivt}
            onRemoveAttachment={onRemoveAttachment}
          />
          <AlignStartRow>
            <DocumentSearch
              parentNamespace={namespace}
              validation={validation}
              resetValidation={resetValidation}
            />
          </AlignStartRow>
          <VerticalSeparatorDiv size='2' />
          <AlignStartRow>
            <Column>
              <Button
                variant='primary'
                onClick={sendSkjema}
                disabled={sendingVedlegg}
              >
                {sendingVedlegg ? t('message:loading-sending-vedlegg') : t('label:send-vedlegg')}
                {sendingVedlegg && <Loader />}
              </Button>
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv size='2' />
          {alertMessage && alertType && [types.VEDLEGG_POST_FAILURE].indexOf(alertType) >= 0 && (
            <>
              <Alert variant='warning'>
                {alertMessage}
              </Alert>
              <VerticalSeparatorDiv size='2' />
            </>
          )}
          <ValidationBox
            heading={t('validation:feiloppsummering')}
            validation={validation}
          />
          <VerticalSeparatorDiv size='2' />
          {vedleggResponse && (
            <Alert variant='success'>
              <div>
                <div>{t('label:vedlagte')}: {vedleggResponse.filnavn || vedleggResponse.vedleggID}</div>
                {vedleggResponse.url && (
                  <Link href={vedleggResponse.url} rel='noreferrer' target='_blank'>
                    {t('label:gå-til-rina')}
                  </Link>
                )}
              </div>
            </Alert>
          )}
        </MyContent>
        <Margin />
      </Container>
    </TopContainer>
  )
}

export default Vedlegg
