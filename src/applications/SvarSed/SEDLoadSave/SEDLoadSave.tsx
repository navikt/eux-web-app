import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { FlexEtikett } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { State } from 'declarations/reducers'
import { LocalStorageEntry } from 'declarations/types'
import _ from 'lodash'
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
  savedEntries: Array<LocalStorageEntry<ReplySed>> | null | undefined
}

const mapState = (state: State): SEDLoadSaveSelector => ({
  savedEntries: state.localStorage.savedEntries
})

const SEDLoadSave: React.FC<SEDLoadSaveProps> = ({
  onLoad,
  storageKey
}: SEDLoadSaveProps) => {

  const dispatch = useDispatch()
  const {savedEntries}: SEDLoadSaveSelector = useSelector<State,SEDLoadSaveSelector>(mapState)
  const [loadingSavedItems, setLoadingSavedItems] = useState<boolean>(false)
  const [_confirmDelete, setConfirmDelete] = useState<Array<string>>([])
  const { t } = useTranslation()

  const onRemove = async (i: number) => {
    let newSavedEntries = _.cloneDeep(savedEntries) as Array<LocalStorageEntry<ReplySed>>
    if (!_.isNil(newSavedEntries)) {
      newSavedEntries.splice(i, 1)
      dispatch(localStorageActions.saveEntries(storageKey, newSavedEntries))
    }
  }

  const addCandidateForDeletion = (key: string) => {
    setConfirmDelete(_confirmDelete.concat(key))
  }

  const removeCandidateForDeletion = (key: string) => {
    setConfirmDelete(_.filter(_confirmDelete, it => it !== key))
  }

  useEffect(() => {
    if (!loadingSavedItems && savedEntries === undefined) {
      setLoadingSavedItems(true)
      dispatch(localStorageActions.loadEntries(storageKey))
    }
  }, [savedEntries, loadingSavedItems])

  useEffect(() => {
    if (loadingSavedItems && savedEntries !== undefined) {
      setLoadingSavedItems(false)
    }
  }, [savedEntries, loadingSavedItems])

  return (

    <HighContrastPanel border>
      <LoadSaveDiv>
        {loadingSavedItems && (<WaitingPanel />)}
        {savedEntries === null || _.isEmpty(savedEntries)
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
        {savedEntries?.map((savedEntry: LocalStorageEntry<ReplySed>, i: number) => {
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
