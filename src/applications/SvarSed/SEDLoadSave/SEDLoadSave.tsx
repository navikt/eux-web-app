import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { FlexEtikett } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { LocalStorageEntry } from 'declarations/types'
import _ from 'lodash'
import { Normaltekst, UndertekstBold } from 'nav-frontend-typografi'
import { FlexCenterSpacedDiv, FlexDiv, FlexBaseSpacedDiv, PileDiv, HighContrastFlatknapp, HighContrastPanel, VerticalSeparatorDiv, HorizontalSeparatorDiv } from 'nav-hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const LoadSaveDiv = styled(FlexDiv)`
  width: 100%;
  min-width: 21rem;
  flex-direction: column;
`

interface SEDLoadSaveProps {
  onLoad: (content: any) => void
  storageKey: string
}

const SEDLoadSave: React.FC<SEDLoadSaveProps> = <CustomLocalStorageContent extends any>({
  onLoad,
  storageKey
}: SEDLoadSaveProps) => {
  const [_savedEntries, setSavedEntries] = useState<Array<LocalStorageEntry<CustomLocalStorageContent>> | null | undefined>(undefined)
  const [_loadingSavedItems, setLoadingSavedItems] = useState<boolean>(false)
  const [_confirmDelete, setConfirmDelete] = useState<Array<string>>([])
  const { t } = useTranslation()

  const loadReplySeds = async () => {
    setLoadingSavedItems(true)
    const items: string | null = await window.localStorage.getItem(storageKey)
    let savedEntries: Array<LocalStorageEntry<CustomLocalStorageContent>> | null | undefined
    if (_.isString(items)) {
      savedEntries = JSON.parse(items)
    } else {
      savedEntries = null
    }
    setSavedEntries(savedEntries)
    setLoadingSavedItems(false)
  }

  const onRemove = async (i: number) => {
    const newSavedEntries = _.cloneDeep(_savedEntries)
    if (!_.isNil(newSavedEntries)) {
      newSavedEntries.splice(i, 1)
      setSavedEntries(newSavedEntries)
      await window.localStorage.setItem(storageKey, JSON.stringify(newSavedEntries))
    }
  }

  const addCandidateForDeletion = (key: string) => {
    setConfirmDelete(_confirmDelete.concat(key))
  }

  const removeCandidateForDeletion = (key: string) => {
    setConfirmDelete(_.filter(_confirmDelete, it => it !== key))
  }

  useEffect(() => {
    if (_savedEntries === undefined && !_loadingSavedItems) {
      loadReplySeds()
      setLoadingSavedItems(true)
    }
  }, [_savedEntries, _loadingSavedItems])

  return (

      <HighContrastPanel border>
        <LoadSaveDiv>
          {_loadingSavedItems && (<WaitingPanel />)}
          {_savedEntries === null || _.isEmpty(_savedEntries)
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
          {_savedEntries && _savedEntries.map((savedEntry: LocalStorageEntry<CustomLocalStorageContent>, i: number) => {
            const candidateForDeletion = _confirmDelete.indexOf(savedEntry.name) >= 0
            return (
              <div key={savedEntry.name}>
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
                        onClick={() => onLoad(savedEntry.content)}
                      >
                        {t('el:button-load')}
                      </HighContrastFlatknapp>
                      <AddRemovePanel
                        existingItem
                        candidateForDeletion={candidateForDeletion}
                        onBeginRemove={() => addCandidateForDeletion(savedEntry.name)}
                        onConfirmRemove={() => onRemove(i)}
                        onCancelRemove={() => removeCandidateForDeletion(savedEntry.name!)}
                      />
                    </FlexBaseSpacedDiv>
                  </PileDiv>
                </FlexEtikett>
                <VerticalSeparatorDiv />
              </div>
            )
          })}
        </LoadSaveDiv>
      </HighContrastPanel>
  )
}

export default SEDLoadSave
