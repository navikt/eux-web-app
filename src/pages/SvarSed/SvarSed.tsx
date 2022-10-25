import { Button } from '@navikt/ds-react'
import { FlexDiv, HorizontalSeparatorDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { alertSuccess } from 'actions/alert'
import { setStatusParam } from 'actions/app'
import { resetCurrentEntry, setCurrentEntry } from 'actions/localStorage'
import { cleanUpSvarSed, querySaks, setReplySed } from 'actions/svarsed'
import SakBanner from 'applications/SvarSed/Sak/SakBanner'
import SaveSEDModal from 'applications/SvarSed/SaveSEDModal/SaveSEDModal'
import Modal from 'components/Modal/Modal'
import TopContainer from 'components/TopContainer/TopContainer'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry } from 'declarations/types'
import _ from 'lodash'
import SEDEdit from 'pages/SvarSed/SEDEdit'
import SEDNew from 'pages/SvarSed/SEDNew'
import SEDSearch from 'pages/SvarSed/SEDSearch'
import SEDView from 'pages/SvarSed/SEDView'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'

interface SvarSedSelector {
  entries: Array<LocalStorageEntry<ReplySed>> | null | undefined
  replySedChanged: boolean
  replySed: ReplySed | null | undefined
}

export interface SvarSedPageProps {
  type: 'new' | 'search' | 'edit' | 'view'
}

const mapState = (state: State) => ({
  entries: state.localStorage.svarsed.entries,
  replySedChanged: state.svarsed.replySedChanged,
  replySed: state.svarsed.replySed
})

export const SvarSedPage: React.FC<SvarSedPageProps> = ({
  type
}: SvarSedPageProps): JSX.Element => {
  const [mounted, setMounted] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [_showSaveModal, _setShowSaveModal] = useState<boolean>(false)
  const [_showSaveSedModal, _setShowSaveSedModal] = useState<boolean>(false)
  const params: URLSearchParams = new URLSearchParams(window.location.search)
  const { sakId } = useParams()

  const { entries, replySed, replySedChanged }: SvarSedSelector = useAppSelector(mapState)

  const goBack = () => {
    if (type === 'edit') {
      dispatch(resetCurrentEntry('svarsed'))
      setTimeout(() =>
        dispatch(cleanUpSvarSed())
      , 200)
      const params: URLSearchParams = new URLSearchParams(window.location.search)
      const q = params.get('q')
      const search = '?refresh=true' + (q ? '&q=' + q : '')

      navigate({
        pathname: '/svarsed/view/sak/' + sakId,
        search
      })
    }
    if (type === 'view') {
      navigate({
        pathname: '/svarsed/search',
        search: window.location.search
      })
    }
  }

  const onGoBackClick = () => {
    if (!replySedChanged) {
      goBack()
    } else {
      _setShowSaveModal(true)
    }
  }

  useEffect(() => {
    const rinasaksnummerParam: string | null = params.get('rinasaksnummer')
    const fnrParam: string | null = params.get('fnr')
    const temaParam: string | null = params.get('tema')
    const dokumenttypeParam: string | null = params.get('dokumenttype')
    if (fnrParam) {
      dispatch(setStatusParam('fnr', fnrParam))
    }
    if (temaParam) {
      dispatch(setStatusParam('tema', temaParam))
    }
    if (dokumenttypeParam) {
      dispatch(setStatusParam('dokumenttype', dokumenttypeParam))
    }
    if (!!rinasaksnummerParam || !!fnrParam) {
      dispatch(setStatusParam('rinasaksnummerOrFnr', rinasaksnummerParam || fnrParam))
      dispatch(querySaks((rinasaksnummerParam || fnrParam)!, 'new'))
    }
  }, [])

  useEffect(() => {
    if (!mounted) {
      // Load SvarSED from localStorage if I see a GET param - used for token renew
      // I have to wait until localStorage is loaded
      if (entries !== undefined) {
        const name: string | null = params.get('name')
        if (name) {
          const entry: LocalStorageEntry<ReplySed> | undefined =
            _.find(entries, (e: LocalStorageEntry<ReplySed>) => e.name === name)
          if (entry) {
            dispatch(setCurrentEntry('svarsed', entry))
            dispatch(setReplySed(entry.content, false))
            navigate({
              pathname: '/svarsed/edit/sak/' + (entry.content as ReplySed).sak!.sakId + '/sed/' + (entry.content as ReplySed).sed!.sedId,
              search: window.location.search
            })
            dispatch(alertSuccess(t('message:success-svarsed-reloaded-after-token', { name })))
          }
        }
        setMounted(true)
      }
    }
  }, [entries])

  return (
    <TopContainer
      backButton={type === 'view' || type === 'edit'}
      onGoBackClick={onGoBackClick}
      unsavedDoc={replySedChanged}
      title={type === 'new'
        ? t('app:page-title-opprettsak')
        : t('app:page-title-svarsed')}
    >
      <>
        <Modal
          open={_showSaveModal}
          onModalClose={() => _setShowSaveModal(false)}
          modal={{
            modalTitle: t('message:warning-x-not-saved', { x: 'SED' }),
            modalContent: (
              <>
                <div>
                  {t('message:warning-x-save', { x: 'SEDen' })}
                </div>
                <VerticalSeparatorDiv />
                <FlexDiv>
                  <Button
                    variant='primary' onClick={() => {
                      _setShowSaveModal(false)
                      _setShowSaveSedModal(true)
                    }}
                  >
                    {t('el:button-save-draft-x', { x: t('label:sed') })}
                  </Button>
                  <HorizontalSeparatorDiv />
                  <Button
                    variant='secondary' onClick={() => {
                      _setShowSaveModal(false)
                      goBack()
                    }}
                  >
                    {t('el:button-discard-changes')}
                  </Button>
                  <HorizontalSeparatorDiv />
                  <Button variant='tertiary' onClick={() => _setShowSaveModal(false)}>
                    {t('el:button-cancel')}
                  </Button>
                </FlexDiv>
              </>
            )
          }}
        />
        <Modal
          open={_showSaveSedModal}
          onModalClose={() => _setShowSaveSedModal(false)}
          modal={{
            closeButton: false,
            modalContent: (
              <SaveSEDModal
                replySed={replySed!}
                onSaved={() => _setShowSaveSedModal(false)}
                onCancelled={() => _setShowSaveSedModal(false)}
              />
            )
          }}
        />
        <SakBanner />
        {type === 'new' && (<SEDNew />)}
        {type === 'search' && (<SEDSearch />)}
        {type === 'view' && (<SEDView />)}
        {type === 'edit' && (<SEDEdit />)}
      </>
    </TopContainer>
  )
}

export default SvarSedPage
