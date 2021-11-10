import { setCurrentEntry } from 'actions/localStorage'
import * as localStorageActions from 'actions/localStorage'
import { getSedStatus, setReplySed } from 'actions/svarpased'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { ChangeModeFunction } from 'components/SlidePage/SlidePage'
import { FlexEtikett } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import { Normaltekst, UndertekstBold } from 'nav-frontend-typografi'
import {
  FlexBaseSpacedDiv,
  FlexCenterSpacedDiv,
  FlexDiv,
  HighContrastFlatknapp,
  HighContrastPanel,
  HorizontalSeparatorDiv,
  PileDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

const LoadSaveDiv = styled(FlexDiv)`
  width: 100%;
  min-width: 21rem;
  flex-direction: column;
`

interface SEDLoadSaveProps {
  changeMode: ChangeModeFunction
  storageKey: string
}

interface SEDLoadSaveSelector {
  entries: Array<LocalStorageEntry<ReplySed>> | null | undefined
  sedStatus: {[k in string]: string | null}
}

const mapState = (state: State): SEDLoadSaveSelector => ({
  entries: state.localStorage.entries,
  sedStatus: state.svarpased.sedStatus
})

const SEDLoadSave: React.FC<SEDLoadSaveProps> = ({
  changeMode,
  storageKey
}: SEDLoadSaveProps) => {
  const dispatch = useDispatch()
  const { entries, sedStatus }: SEDLoadSaveSelector = useSelector<State, SEDLoadSaveSelector>(mapState)
  const [loadingSavedItems, setLoadingSavedItems] = useState<boolean>(false)
  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<LocalStorageEntry<ReplySed>>(
    (entry: LocalStorageEntry<ReplySed>): string => entry.id)
  const [_sedStatusRequested, setSedStatusRequested] = useState<string | undefined>(undefined)

  const { t } = useTranslation()

  const onRemove = (entry: LocalStorageEntry<ReplySed>) => {
    standardLogger('svarsed.sidebar.removedraft', {})
    dispatch(localStorageActions.removeEntry(storageKey, entry))
  }

  const onRemoveAll = (e: React.ChangeEvent<HTMLButtonElement>) => {
    buttonLogger(e)
    if (window.confirm(t('label:er-du-sikker'))) {
      dispatch(localStorageActions.removeAll(storageKey))
    }
  }

  const handleLoadDraft = (e: React.ChangeEvent<HTMLButtonElement>, savedEntry: LocalStorageEntry<ReplySed>) => {
    buttonLogger(e, { type: savedEntry.content.sedType })
    setSedStatusRequested(savedEntry.id)
    dispatch(getSedStatus(savedEntry.content.saksnummer!, savedEntry.id))
  }

  const findSavedEntry = (svarsedId: string): LocalStorageEntry<ReplySed> | undefined => (
    _.find(entries, (e: LocalStorageEntry<ReplySed>) => e.id === svarsedId)
  )

  const hasSentStatus = (svarsedId: string): boolean => {
    if (!Object.prototype.hasOwnProperty.call(sedStatus, svarsedId)) {
      return false
    }
    return sedStatus[svarsedId] === 'sent'
  }

  useEffect(() => {
    if (!_.isNil(_sedStatusRequested) && Object.prototype.hasOwnProperty.call(sedStatus, _sedStatusRequested)) {
      const entry: LocalStorageEntry<ReplySed> | undefined = findSavedEntry(_sedStatusRequested)
      if (entry && !hasSentStatus(entry.id)) {
        dispatch(setCurrentEntry(entry))
        dispatch(setReplySed(entry.content))
        changeMode('B', 'forward')
      }
      setSedStatusRequested(undefined)
    }
  }, [_sedStatusRequested, sedStatus])

  useEffect(() => {
    if (!loadingSavedItems && entries === undefined) {
      setLoadingSavedItems(true)
      dispatch(localStorageActions.loadEntries(storageKey))
    }
  }, [entries, loadingSavedItems])

  useEffect(() => {
    if (loadingSavedItems && entries !== undefined) {
      setLoadingSavedItems(false)
    }
  }, [entries, loadingSavedItems])

  return (
    <HighContrastPanel border style={{ margin: '0.1rem' }}>
      <LoadSaveDiv>
        {loadingSavedItems && (<WaitingPanel />)}
        {entries === null || _.isEmpty(entries)
          ? (
            <Normaltekst>
              {t('label:ingen-lagrede-seds')}
            </Normaltekst>
            )
          : (
            <Normaltekst>
              {t('label:lagrede-seds')}
            </Normaltekst>
            )}
        {entries?.map((savedEntry: LocalStorageEntry<ReplySed>) => (
          <div key={savedEntry.id}>
            <FlexEtikett>
              <PileDiv flex='1'>
                <FlexCenterSpacedDiv>
                  <FlexBaseSpacedDiv>
                    <UndertekstBold>
                      {t('label:navn') + ': '}
                    </UndertekstBold>
                    <HorizontalSeparatorDiv size='0.5' />
                    <Normaltekst>
                      {savedEntry.name}
                    </Normaltekst>
                  </FlexBaseSpacedDiv>
                  <HorizontalSeparatorDiv />
                  <FlexBaseSpacedDiv>
                    <UndertekstBold>
                      {t('label:dato') + ': '}
                    </UndertekstBold>
                    <HorizontalSeparatorDiv size='0.5' />
                    <Normaltekst>
                      {savedEntry.date}
                    </Normaltekst>
                  </FlexBaseSpacedDiv>
                </FlexCenterSpacedDiv>
                <FlexCenterSpacedDiv>
                  <FlexBaseSpacedDiv>
                    <UndertekstBold>
                      {t('label:saksnummer') + ': '}
                    </UndertekstBold>
                    <HorizontalSeparatorDiv size='0.5' />
                    <Normaltekst>
                      {(savedEntry.content as any).saksnummer}
                    </Normaltekst>
                  </FlexBaseSpacedDiv>
                  <HorizontalSeparatorDiv />
                  <FlexBaseSpacedDiv>
                    <UndertekstBold>
                      {t('label:type') + ': '}
                    </UndertekstBold>
                    <HorizontalSeparatorDiv size='0.5' />
                    <Normaltekst>
                      {(savedEntry.content as any).sedType}
                    </Normaltekst>
                  </FlexBaseSpacedDiv>
                </FlexCenterSpacedDiv>
                <VerticalSeparatorDiv size='0.5' />
                <FlexBaseSpacedDiv>
                  <HighContrastFlatknapp
                    mini
                    kompakt
                    disabled={_sedStatusRequested === savedEntry.id || hasSentStatus(savedEntry.id)}
                    spinner={_sedStatusRequested === savedEntry.id}
                    data-amplitude='svarsed.sidebar.loaddraft'
                    onClick={(e: any) => handleLoadDraft(e, savedEntry)}
                  >
                    {_sedStatusRequested === savedEntry.id
                      ? t('message:loading-checking-sed-status')
                      : (hasSentStatus(savedEntry.id)
                          ? t('label:sendt')
                          : t('el:button-load'))}
                  </HighContrastFlatknapp>
                  <AddRemovePanel
                    existingItem
                    candidateForDeletion={isInDeletion(savedEntry)}
                    onBeginRemove={() => addToDeletion(savedEntry)}
                    onConfirmRemove={() => onRemove(savedEntry)}
                    onCancelRemove={() => removeFromDeletion(savedEntry)}
                  />
                </FlexBaseSpacedDiv>
              </PileDiv>
            </FlexEtikett>
            <VerticalSeparatorDiv />
          </div>
        ))}
        {!_.isEmpty(entries) && (
          <>
            <VerticalSeparatorDiv />
            <HighContrastFlatknapp
              mini
              kompakt
              data-amplitude='svarsed.sidebar.removeall'
              onClick={onRemoveAll}
            >
              {t('el:button-remove-all')}
            </HighContrastFlatknapp>
          </>
        )}
      </LoadSaveDiv>
    </HighContrastPanel>
  )
}

export default SEDLoadSave
