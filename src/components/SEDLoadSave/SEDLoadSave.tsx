import { setReplySed } from 'actions/svarpased'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { FlexDiv } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { ReplySed } from 'declarations/sed'
import { ReplySedEntry } from 'declarations/types'
import _ from 'lodash'
import { Normaltekst } from 'nav-frontend-typografi'
import NavHighContrast, { HighContrastFlatknapp, HighContrastPanel, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

interface SEDLoadSaveProps {
  highContrast: boolean
  setMode: (mode: string, from: string, callback?: () => void) => void
}

const SEDLoadSave: React.FC<SEDLoadSaveProps> = ({
  highContrast,
  setMode
}: SEDLoadSaveProps) => {

  const [_replySeds, setReplySeds] = useState<Array<ReplySedEntry> | null | undefined>(undefined)
  const [_loadingSavedItems, setLoadingSavedItems] = useState<boolean>(false)
  const [_confirmDelete, setConfirmDelete] = useState<Array<string>>([])
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const loadReplySeds = async () => {
    setLoadingSavedItems(true)
    let items: string | null = await window.localStorage.getItem('replysed')
    let replySeds: Array<ReplySedEntry> | null | undefined = undefined
    if (_.isString(items)) {
      replySeds = JSON.parse(items)
    } else {
      replySeds = null
    }
    setReplySeds(replySeds)
    setLoadingSavedItems(false)
  }

  const onLoad = (replySed: ReplySed) => {
    dispatch(setReplySed(replySed))
    setMode('2', 'forward')
  }

  const onRemove = async (i: number) => {
    let newReplySeds = _.cloneDeep(_replySeds)
    if (!_.isNil(newReplySeds)) {
      newReplySeds.splice(i, 1)
      setReplySeds(newReplySeds)
      await window.localStorage.setItem('replysed', JSON.stringify(newReplySeds))
    }
  }

  const onDownload = async (replySed: ReplySedEntry) => {
    const fileName = replySed!.name + '.json'
    const json = JSON.stringify(replySed.replySed)
    const blob = new Blob([json],{type:'application/json'})
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
    if (_replySeds === undefined && !_loadingSavedItems) {
      loadReplySeds()
      setLoadingSavedItems(true)
    }
  }, [_replySeds, _loadingSavedItems])

  return (
    <NavHighContrast highContrast={highContrast}>
      <HighContrastPanel>
        <FlexDiv>
          {_loadingSavedItems && (<WaitingPanel />)}
          {_replySeds === null || _.isEmpty(_replySeds) && (
            <Normaltekst>
              {t('label:no-saved-replyseds')}
            </Normaltekst>

          )}
          {_replySeds && _replySeds.map((replySed: ReplySedEntry, i: number) => {

            const candidateForDeletion = _confirmDelete.indexOf(replySed.name) >= 0

            return (
           <div>
             <Normaltekst>
               {t('label:name') + ': ' + replySed.name}
             </Normaltekst>
             <VerticalSeparatorDiv data-size='0.5'/>
             <Normaltekst>
               {t('label:date') + ': ' + replySed.date}
             </Normaltekst>
             <VerticalSeparatorDiv data-size='0.5'/>
             <HighContrastFlatknapp
               mini
               kompakt
               onClick={() => onLoad(replySed.replySed)}
             >
               {t('label:load')}
             </HighContrastFlatknapp>
             <HighContrastFlatknapp
               mini
               kompakt
               onClick={() => onDownload(replySed)}
             >
               {t('label:download')}
             </HighContrastFlatknapp>
             <AddRemovePanel
               existingItem={true}
               candidateForDeletion={candidateForDeletion}
               onBeginRemove={() => addCandidateForDeletion(replySed.name)}
               onConfirmRemove={() => onRemove(i)}
               onCancelRemove={() => removeCandidateForDeletion(replySed.name!)}
             />
           </div>
          )})}
        </FlexDiv>
      </HighContrastPanel>
    </NavHighContrast>
  )
}

export default SEDLoadSave
