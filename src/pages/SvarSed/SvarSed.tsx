import { Button } from '@navikt/ds-react'
import { FlexDiv, HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import {appReset, setStatusParam} from 'actions/app'
import { cleanUpSvarSed, querySaks } from 'actions/svarsed'
import SakBanner from 'applications/SvarSed/Sak/SakBanner'
import Modal from 'components/Modal/Modal'
import TopContainer from 'components/TopContainer/TopContainer'
import { State } from 'declarations/reducers'
import SEDEdit from 'pages/SvarSed/SEDEdit'
import SEDNew from 'pages/SvarSed/SEDNew'
import SEDSearch from 'pages/SvarSed/SEDSearch'
import SEDView from 'pages/SvarSed/SEDView'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'

interface SvarSedSelector {
  replySedChanged: boolean
}

export interface SvarSedPageProps {
  type: 'new' | 'search' | 'edit' | 'view'
}

const mapState = (state: State) => ({
  replySedChanged: state.svarsed.replySedChanged,
})

export const SvarSedPage: React.FC<SvarSedPageProps> = ({
  type
}: SvarSedPageProps): JSX.Element => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [_showSaveModal, _setShowSaveModal] = useState<boolean>(false)
  const params: URLSearchParams = new URLSearchParams(window.location.search)
  const { sakId } = useParams()

  const { replySedChanged }: SvarSedSelector = useAppSelector(mapState)

  const goBack = () => {
    if (type === 'edit') {
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
      dispatch(appReset())
      navigate({
        pathname: '/'
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
    let controller = new AbortController();
    const signal = controller.signal;

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
      dispatch(querySaks((rinasaksnummerParam || fnrParam)!, 'new', signal))
    }

    return () => {
      if(controller){
        controller.abort();
      }
    }
  }, [])

  return (
    <TopContainer
      backButton={type === 'view' || type === 'edit'}
      onGoBackClick={onGoBackClick}
      unsavedDoc={replySedChanged}
      title={type === 'new'
        ? t('app:page-title-opprettnysak')
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
                <FlexDiv>
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
