import { ActionWithPayload } from '@navikt/fetch'
import { setCurrentEntry } from 'actions/localStorage'
import * as localStorageActions from 'actions/localStorage'
import { getSedStatus } from 'actions/svarsed'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { ChangeModeFunction } from 'components/SlidePage/SlidePage'
import { MyTag } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { PDU1 } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry, StorageTypes } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import { Button, Panel, BodyLong, Detail, Loader } from '@navikt/ds-react'
import {
  FlexBaseSpacedDiv,
  FlexCenterSpacedDiv,
  FlexDiv,
  HorizontalSeparatorDiv,
  PileDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { LocalStorageNamespaces } from 'reducers/localStorage'

const LoadSaveDiv = styled(FlexDiv)`
  width: 100%;
  min-width: 21rem;
  flex-direction: column;
`

interface LoadSaveProps<T> {
  changeMode: ChangeModeFunction
  namespace: LocalStorageNamespaces
  setReplySed: (payload: T) => ActionWithPayload<T>
}

interface LoadSaveSelector {
  entries: Array<LocalStorageEntry<PDU1 | ReplySed>> | null | undefined
  sedStatus: {[k in string]: string | null}
}

const LoadSave = <T extends StorageTypes>({
  changeMode,
  namespace,
  setReplySed
}: LoadSaveProps<T>) => {
  const dispatch = useDispatch()
  const { entries, sedStatus }: LoadSaveSelector =
    useSelector<State, LoadSaveSelector>((state: State) => ({
      entries: state.localStorage[namespace].entries,
      sedStatus: state.svarsed.sedStatus
    }))
  const [loadingSavedItems, setLoadingSavedItems] = useState<boolean>(false)
  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<LocalStorageEntry<ReplySed | PDU1>>(
    (entry: LocalStorageEntry<ReplySed | PDU1>): string => entry.id)
  const [_sedStatusRequested, setSedStatusRequested] = useState<string | undefined>(undefined)

  const { t } = useTranslation()

  const onRemove = (entry: LocalStorageEntry<ReplySed | PDU1>) => {
    standardLogger(namespace + '.sidebar.removedraft', {})
    dispatch(localStorageActions.removeEntry(namespace, entry))
  }

  const onRemoveAll = (e: any) => {
    buttonLogger(e)
    if (window.confirm(t('label:er-du-sikker'))) {
      dispatch(localStorageActions.removeAllEntries(namespace))
    }
  }

  const handleLoadDraft = (e: React.ChangeEvent<HTMLButtonElement>, savedEntry: LocalStorageEntry<ReplySed | PDU1>) => {
    if ((savedEntry.content as ReplySed).sedType) {
      buttonLogger(e, { type: (savedEntry.content as ReplySed).sedType })
      setSedStatusRequested(savedEntry.id)
      dispatch(getSedStatus((savedEntry.content as ReplySed).saksnummer!, savedEntry.id))
    } else {
      // no need to chevk for status on PDU1 for now
      buttonLogger(e, { type: 'pdu1' })
      const entry: LocalStorageEntry<T> | undefined = findSavedEntry(savedEntry.id)
      if (entry && !hasSentStatus(entry.id)) {
        dispatch(setCurrentEntry(namespace, entry))
        dispatch(setReplySed(entry.content))
        changeMode('B', 'forward')
      }
      setSedStatusRequested(undefined)
    }
  }

  const findSavedEntry = (svarsedId: string): LocalStorageEntry | undefined => {
    const x : LocalStorageEntry | undefined = _.find(entries, (e: LocalStorageEntry) => {
      return e.id === svarsedId
    })
    return x
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
        dispatch(setReplySed(entry.content as T))
        changeMode('B', 'forward')
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
    <Panel border style={{ margin: '0.1rem' }}>
      <LoadSaveDiv>
        {loadingSavedItems && (<WaitingPanel />)}
        {entries === null || _.isEmpty(entries)
          ? (
            <BodyLong>
              {t('label:ingen-lagrede-x', { x: t('label:' + namespace) })}
            </BodyLong>
            )
          : (
            <BodyLong>
              {t('label:lagrede-x', { x: t('label:' + namespace) })}
            </BodyLong>
            )}
        <VerticalSeparatorDiv />
        {entries?.map((savedEntry: LocalStorageEntry<PDU1 | ReplySed>) => (
          <div key={savedEntry.id}>
            <MyTag variant='info'>
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
                      {(savedEntry.content as any).saksnummer}
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
                <FlexBaseSpacedDiv>
                  <Button
                    variant='tertiary'
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
                  <AddRemovePanel
                    existingItem
                    candidateForDeletion={isInDeletion(savedEntry)}
                    onBeginRemove={() => addToDeletion(savedEntry)}
                    onConfirmRemove={() => onRemove(savedEntry)}
                    onCancelRemove={() => removeFromDeletion(savedEntry)}
                  />
                </FlexBaseSpacedDiv>
              </PileDiv>
            </MyTag>
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
    </Panel>
  )
}

export default LoadSave