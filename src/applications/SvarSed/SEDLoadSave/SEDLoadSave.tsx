import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { Etikett, FlexCenterDiv, FlexDiv, FlexBaseDiv, PileDiv } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { LocalStorageEntry } from 'declarations/types'
import _ from 'lodash'
import { Normaltekst, UndertekstBold } from 'nav-frontend-typografi'
import NavHighContrast, { HighContrastFlatknapp, HighContrastPanel, VerticalSeparatorDiv, HorizontalSeparatorDiv } from 'nav-hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const LoadSaveDiv = styled(FlexDiv)`
  width: 100%;
  min-width: 21rem;
  flex-direction: column;
`

interface SEDLoadSaveProps {
  highContrast: boolean
  onLoad: (content: any) => void
  storageKey: string
}

const SEDLoadSave: React.FC<SEDLoadSaveProps> = <CustomLocalStorageContent extends any>({
  highContrast,
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

  const onDownload = async (entry: LocalStorageEntry<CustomLocalStorageContent>) => {
    const fileName = entry!.name + '.json'
    const json = JSON.stringify(entry.content)
    const blob = new Blob([json], { type: 'application/json' })
    const href = await URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = href
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
    <NavHighContrast highContrast={highContrast}>
      <HighContrastPanel>
        <LoadSaveDiv>
          {_loadingSavedItems && (<WaitingPanel />)}
          {_savedEntries === null || _.isEmpty(_savedEntries)
            ? (
              <Normaltekst>
                {t('label:no-saved-replyseds')}
              </Normaltekst>
              )
            : (
              <Normaltekst>
                {t('label:saved-replyseds')}
              </Normaltekst>
              )}
          <VerticalSeparatorDiv />
          {_savedEntries && _savedEntries.map((savedEntry: LocalStorageEntry<CustomLocalStorageContent>, i: number) => {
            const candidateForDeletion = _confirmDelete.indexOf(savedEntry.name) >= 0
            return (
              <div key={savedEntry.name}>
                <Etikett style={{ padding: '0.5rem' }}>
                  <PileDiv>
                    <FlexCenterDiv>
                      <FlexBaseDiv>
                        <UndertekstBold>
                          {t('label:name') + ': '}
                        </UndertekstBold>
                        <HorizontalSeparatorDiv data-size='0.5' />
                        <Normaltekst>
                          {savedEntry.name}
                        </Normaltekst>
                      </FlexBaseDiv>
                      <HorizontalSeparatorDiv />
                      <FlexBaseDiv>
                        <UndertekstBold>
                          {t('label:date') + ': '}
                        </UndertekstBold>
                        <HorizontalSeparatorDiv data-size='0.5' />
                        <Normaltekst>
                          {savedEntry.date}
                        </Normaltekst>
                      </FlexBaseDiv>
                    </FlexCenterDiv>
                    <FlexCenterDiv>
                      <FlexBaseDiv>
                        <UndertekstBold>
                          {t('label:saksnummer') + ': '}
                        </UndertekstBold>
                        <HorizontalSeparatorDiv data-size='0.5' />
                        <Normaltekst>
                          {(savedEntry.content as any).saksnummer}
                        </Normaltekst>
                      </FlexBaseDiv>
                      <HorizontalSeparatorDiv />
                      <FlexBaseDiv>
                        <UndertekstBold>
                          {t('label:type') + ': '}
                        </UndertekstBold>
                        <HorizontalSeparatorDiv data-size='0.5' />
                        <Normaltekst>
                          {(savedEntry.content as any).sedType}
                        </Normaltekst>
                      </FlexBaseDiv>
                    </FlexCenterDiv>
                    <VerticalSeparatorDiv data-size='0.5' />
                    <FlexBaseDiv>
                      <HighContrastFlatknapp
                        mini
                        kompakt
                        onClick={() => onLoad(savedEntry.content)}
                      >
                        {t('el:button-load')}
                      </HighContrastFlatknapp>
                      <HighContrastFlatknapp
                        mini
                        kompakt
                        onClick={() => onDownload(savedEntry)}
                      >
                        {t('el:button-download')}
                      </HighContrastFlatknapp>
                      <AddRemovePanel
                        existingItem
                        candidateForDeletion={candidateForDeletion}
                        onBeginRemove={() => addCandidateForDeletion(savedEntry.name)}
                        onConfirmRemove={() => onRemove(i)}
                        onCancelRemove={() => removeCandidateForDeletion(savedEntry.name!)}
                      />
                    </FlexBaseDiv>
                  </PileDiv>
                </Etikett>
                <VerticalSeparatorDiv />
              </div>
            )
          })}
        </LoadSaveDiv>
      </HighContrastPanel>
    </NavHighContrast>
  )
}

export default SEDLoadSave
