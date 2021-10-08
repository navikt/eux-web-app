import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { FlexEtikett } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { State } from 'declarations/reducers'
import { LocalStorageEntry } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import { Normaltekst, UndertekstBold } from 'nav-frontend-typografi'
import { FlexCenterSpacedDiv, FlexDiv, FlexBaseSpacedDiv, PileDiv, HighContrastFlatknapp, HighContrastPanel, VerticalSeparatorDiv, HorizontalSeparatorDiv } from 'nav-hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import * as localStorageActions from 'actions/localStorage'
import { ReplySed } from 'declarations/sed'

const LoadSaveDiv = styled(FlexDiv)`
  width: 100%;
  min-width: 21rem;
  flex-direction: column;
`

interface SEDLoadSaveProps {
  onLoad: (content: any) => void
  storageKey: string
}

interface SEDLoadSaveSelector {
  entries: Array<LocalStorageEntry<ReplySed>> | null | undefined
}

const mapState = (state: State): SEDLoadSaveSelector => ({
  entries: state.localStorage.entries
})

const SEDLoadSave: React.FC<SEDLoadSaveProps> = ({
  onLoad,
  storageKey
}: SEDLoadSaveProps) => {
  const dispatch = useDispatch()
  const { entries }: SEDLoadSaveSelector = useSelector<State, SEDLoadSaveSelector>(mapState)
  const [loadingSavedItems, setLoadingSavedItems] = useState<boolean>(false)
  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<LocalStorageEntry<ReplySed>>(
    (entry: LocalStorageEntry<ReplySed>): string => entry.id)

  const { t } = useTranslation()

  const onRemove = (entry: LocalStorageEntry<ReplySed>) => {
    standardLogger('svarsed.sidebar.removedraft', {})
    dispatch(localStorageActions.removeEntry(storageKey, entry))
  }

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
        <VerticalSeparatorDiv />
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
                    data-amplitude='svarsed.sidebar.loaddraft'
                    onClick={(e: React.ChangeEvent<HTMLButtonElement>) => {
                      buttonLogger(e, {
                        type: savedEntry.content.sedType
                      })
                      onLoad(savedEntry)
                    }}
                  >
                    {t('el:button-load')}
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
      </LoadSaveDiv>
    </HighContrastPanel>
  )
}

export default SEDLoadSave
