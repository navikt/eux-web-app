import {Button, Loader, Panel} from '@navikt/ds-react'
import { ActionWithPayload } from '@navikt/fetch'
import * as localStorageActions from 'actions/localStorage'
import { setCurrentEntry } from 'actions/localStorage'
import { getSedStatus } from 'actions/svarsed'
import { PDU1 } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry, StorageTypes } from 'declarations/types'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { LocalStorageNamespaces } from 'reducers/localStorage'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'
import {ReactComponent as LocalItemIcon} from 'assets/icons/LocalItem.svg'
import {Delete} from "@navikt/ds-icons";
import WaitingPanel from "../WaitingPanel/WaitingPanel";


const StyledPanel = styled(Panel)`
  border: 1px #D8D8D8 solid;
  border-bottom-width: 0px;
  border-radius: 0px;
  &:last-child{
   border-bottom-width: 1px;
  }
`

const SavedItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
`

const ItemContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: flex-start;
  margin-left: 16px;
  padding-left: 16px;
  border-left: 1px #D8D8D8 solid;
`

const ItemInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`

const ItemData = styled.div`
  flex:1;
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`

interface LoadSaveProps<T> {
  namespace: LocalStorageNamespaces
  loadReplySed: (payload: T) => ActionWithPayload<T>
}

interface LoadSaveSelector {
  entries: Array<LocalStorageEntry<PDU1 | ReplySed>> | null | undefined
  sedStatus: {[k in string]: string | null}
}

const LoadSave = <T extends StorageTypes>({
  namespace,
  loadReplySed
}: LoadSaveProps<T>) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { entries, sedStatus }: LoadSaveSelector =
    useAppSelector((state: State) => ({
      entries: state.localStorage[namespace].entries,
      sedStatus: state.svarsed.sedStatus
    }))
  const [loadingSavedItems, setLoadingSavedItems] = useState<boolean>(false)
  const [_sedStatusRequested, setSedStatusRequested] = useState<string | undefined>(undefined)

  const { t } = useTranslation()

  const onRemove = (entry: LocalStorageEntry<ReplySed | PDU1>) => {
    standardLogger(namespace + '.sidebar.removedraft', {})
    dispatch(localStorageActions.removeEntry(namespace, entry))
  }

/*  const onRemoveAll = (e: any) => {
    buttonLogger(e)
    if (window.confirm(t('label:er-du-sikker'))) {
      dispatch(localStorageActions.removeAllEntries(namespace))
    }
  }*/

  const handleLoadDraft = (e: React.ChangeEvent<HTMLButtonElement>, savedEntry: LocalStorageEntry<ReplySed | PDU1>) => {
    // for svarSed, we must check validity before loading
    if ((savedEntry.content as ReplySed).sedType) {
      buttonLogger(e, { type: (savedEntry.content as ReplySed).sedType })
      setSedStatusRequested(savedEntry.id)
      dispatch(getSedStatus((savedEntry.content as ReplySed).sak!.sakId!, savedEntry.id))
    } else {
      // no need to check for status on PDU1, for now
      buttonLogger(e, { type: 'pdu1' })
      const entry: LocalStorageEntry<T> | undefined = findSavedEntry(savedEntry.id)
      if (entry && !hasSentStatus(entry.id)) {
        dispatch(setCurrentEntry(namespace, entry))
        let url: string = '/pdu1'
        if (!_.isEmpty((entry.content as PDU1).__fnr)) {
          url += '/create/fnr/' + (entry.content as PDU1).__fnr + '/fagsak/' + encodeURIComponent((entry.content as PDU1).__fagsak!)
        } else {
          url += '/edit/postId/' + (entry.content as PDU1).__journalpostId +
            '/docId/' + (entry.content as PDU1).__dokumentId +
            '/fagsak/' + encodeURIComponent((entry.content as PDU1).__fagsak!)
        }
        dispatch(loadReplySed(entry.content))
        navigate({
          pathname: url,
          search: window.location.search
        })
      }
      setSedStatusRequested(undefined)
    }
  }

  const findSavedEntry = (svarsedId: string): LocalStorageEntry | undefined => {
    const entry : LocalStorageEntry | undefined = _.find(entries, (e: LocalStorageEntry) => {
      return e.id === svarsedId
    })
    return entry
  }

  const hasSentStatus = (svarsedId: string): boolean => {
    if (!Object.prototype.hasOwnProperty.call(sedStatus, svarsedId)) {
      return false
    }
    return sedStatus[svarsedId] === 'sent'
  }

  useEffect(() => {
    if (!_.isNil(_sedStatusRequested) && Object.prototype.hasOwnProperty.call(sedStatus, _sedStatusRequested)) {
      const entry: LocalStorageEntry<T> | undefined = findSavedEntry(_sedStatusRequested)
      if (entry && !hasSentStatus(entry.id)) {
        dispatch(setCurrentEntry(namespace, entry))
        dispatch(loadReplySed(entry.content as T))
        navigate({
          pathname: '/svarsed/edit/sak/' + (entry.content! as ReplySed).sak!.sakId + '/sed/' + ((entry.content! as ReplySed).sed?.sedId ?? 'new'),
          search: window.location.search
        })
      }
      setSedStatusRequested(undefined)
    }
  }, [_sedStatusRequested, sedStatus])

  useEffect(() => {
    if (!loadingSavedItems && entries === undefined) {
      setLoadingSavedItems(true)
      dispatch(localStorageActions.loadEntries(namespace))
    }
  }, [entries, loadingSavedItems])

  useEffect(() => {
    if (loadingSavedItems && entries !== undefined) {
      setLoadingSavedItems(false)
    }
  }, [entries, loadingSavedItems])

  return (
    <>
      {loadingSavedItems && (<WaitingPanel />)}

      {entries?.map((savedEntry: LocalStorageEntry<PDU1 | ReplySed>) => {
        const savedDate = new Date(savedEntry.date);
        const savedType = (savedEntry.content as any).sedType ? (savedEntry.content as any).sedType : namespace.toUpperCase();
        const savedSaksnr = namespace === "pdu1" ? (savedEntry.content as any).saksreferanse : (savedEntry.content as any).sak?.sakId
        return (
            <StyledPanel key={savedEntry.id}>
              <SavedItem>
                <LocalItemIcon/>
                <ItemContainer>
                  <div><b>{savedEntry.name}</b></div>
                  <ItemInfo>
                    <ItemData>Saksnr: {savedSaksnr}</ItemData>
                    <ItemData>Type: {savedType}</ItemData>
                    <ItemData>Dato: {savedDate.toLocaleDateString("no-NO")}</ItemData>
                  </ItemInfo>
                </ItemContainer>
                <ButtonContainer>
                  <Button
                    variant='secondary'
                    disabled={(savedEntry.id && _sedStatusRequested === savedEntry.id) || hasSentStatus(savedEntry.id)}
                    data-amplitude={namespace + '.sidebar.loaddraft'}
                    onClick={(e: any) => handleLoadDraft(e, savedEntry)}
                  >
                    {savedEntry.id && _sedStatusRequested === savedEntry.id && <Loader/>}
                    {savedEntry.id && _sedStatusRequested === savedEntry.id
                      ? t('message:loading-checking-sed-status')
                      : (hasSentStatus(savedEntry.id)
                        ? t('label:sendt')
                        : t('el:button-load'))}
                  </Button>
                  <Button
                    variant='tertiary'
                    onClick={() => onRemove(savedEntry)}
                  >
                    <Delete/>
                    {t('el:button-slett')}
                  </Button>
                </ButtonContainer>
              </SavedItem>
            </StyledPanel>
          )
        }
      )}


{/*    <VerticalSeparatorDiv/>
    <Panel border style={{ margin: '0.1rem' }}>
      <LoadSaveDiv>
        {loadingSavedItems && (<WaitingPanel />)}
        {entries === null || _.isEmpty(entries)
          ? (
            <BodyLong>
              {t('label:ingen-lokalt-lagrede-x', { x: t('label:' + namespace) })}
            </BodyLong>
            )
          : (
            <BodyLong>
              {t('label:lokalt-lagrede-x', { x: t('label:' + namespace) })}
            </BodyLong>
            )}
        <VerticalSeparatorDiv />
        {entries?.map((savedEntry: LocalStorageEntry<PDU1 | ReplySed>, index: number) => (
          <div key={savedEntry.id}>
            <GrayPanel>
              <PileDiv flex='1'>
                <FlexCenterSpacedDiv>
                  <FlexBaseSpacedDiv>
                    <Detail>
                      {t('label:navn') + ': '}
                    </Detail>
                    <HorizontalSeparatorDiv size='0.5' />
                    <BodyLong>
                      {savedEntry.name}
                    </BodyLong>
                  </FlexBaseSpacedDiv>
                  <HorizontalSeparatorDiv />
                  <FlexBaseSpacedDiv>
                    <Detail>
                      {t('label:dato') + ': '}
                    </Detail>
                    <HorizontalSeparatorDiv size='0.5' />
                    <BodyLong>
                      {savedEntry.date}
                    </BodyLong>
                  </FlexBaseSpacedDiv>
                </FlexCenterSpacedDiv>
                <FlexCenterSpacedDiv>
                  <FlexBaseSpacedDiv>
                    <Detail>
                      {t('label:saksnummer') + ': '}
                    </Detail>
                    <HorizontalSeparatorDiv size='0.5' />
                    <BodyLong>
                      {(savedEntry.content as any).sak?.sakId}
                    </BodyLong>
                  </FlexBaseSpacedDiv>
                  <HorizontalSeparatorDiv />
                  <FlexBaseSpacedDiv>
                    <Detail>
                      {t('label:type') + ': '}
                    </Detail>
                    <HorizontalSeparatorDiv size='0.5' />
                    <BodyLong>
                      {(savedEntry.content as any).sedType}
                    </BodyLong>
                  </FlexBaseSpacedDiv>
                </FlexCenterSpacedDiv>
                <VerticalSeparatorDiv size='0.5' />
                <FlexCenterSpacedDiv>
                  <Button
                    variant='tertiary'
                    size='small'
                    disabled={(savedEntry.id && _sedStatusRequested === savedEntry.id) || hasSentStatus(savedEntry.id)}
                    data-amplitude={namespace + '.sidebar.loaddraft'}
                    onClick={(e: any) => handleLoadDraft(e, savedEntry)}
                  >
                    {savedEntry.id && _sedStatusRequested === savedEntry.id && <Loader />}
                    {savedEntry.id && _sedStatusRequested === savedEntry.id
                      ? t('message:loading-checking-sed-status')
                      : (hasSentStatus(savedEntry.id)
                          ? t('label:sendt')
                          : t('el:button-load'))}
                  </Button>
                  <AddRemovePanel<LocalStorageEntry<PDU1 | ReplySed>>
                    item={savedEntry}
                    marginTop={false}
                    index={index}
                    allowEdit={false}
                    onRemove={onRemove}
                  />
                </FlexCenterSpacedDiv>
              </PileDiv>
            </GrayPanel>
            <VerticalSeparatorDiv />
          </div>
        ))}
        {!_.isEmpty(entries) && (
          <>
            <VerticalSeparatorDiv />
            <Button
              variant='tertiary'
              data-amplitude={namespace + '.sidebar.removeall'}
              onClick={onRemoveAll}
            >
              {t('el:button-remove-all')}
            </Button>
          </>
        )}
      </LoadSaveDiv>
    </Panel>*/}
    </>
  )
}

export default LoadSave
