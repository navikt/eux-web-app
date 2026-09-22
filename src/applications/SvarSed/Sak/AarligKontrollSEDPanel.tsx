import {DownloadIcon} from '@navikt/aksel-icons'
import {Alert, Button, Heading, HStack, VStack} from '@navikt/ds-react'
import {previewSed} from 'actions/svarsed'
import PreviewSED from 'applications/SvarSed/PreviewSED/PreviewSED'
import SEDPanelBase from 'applications/SvarSed/Sak/SEDPanelBase'
import {State} from 'declarations/reducers'
import {Fagsak, Sed} from 'declarations/types'
import {saveAs} from 'file-saver'
import moment from 'moment'
import React, {JSX, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useAppDispatch, useAppSelector} from 'store'

interface AarligKontrollSEDPanelSelector {
  gettingPreviewFile: boolean
  previewFile: Blob | null | undefined
}

interface AarligKontrollSEDPanelProps {
  copying?: boolean
  fagsak: Fagsak
  mode: 'selected' | 'list'
  onCopy?: () => void
  onSelect?: () => void
  sakId: string
  sed: Sed
  selected?: boolean
}

const mapState = (state: State): AarligKontrollSEDPanelSelector => ({
  gettingPreviewFile: state.loading.gettingPreviewFile,
  previewFile: state.svarsed.previewFile
})

const AarligKontrollSEDPanel = ({
  copying = false,
  fagsak,
  mode,
  onCopy,
  onSelect,
  sakId,
  sed,
  selected = false
}: AarligKontrollSEDPanelProps): JSX.Element => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const {gettingPreviewFile, previewFile} = useAppSelector(mapState)
  const [downloading, setDownloading] = useState(false)
  const [downloadFailed, setDownloadFailed] = useState(false)
  const hasSedHandlinger = !!sed.sedHandlinger?.length

  useEffect(() => {
    if (!downloading || gettingPreviewFile) {
      return
    }
    if (previewFile) {
      saveAs(previewFile, `SED_${sed.sedId}_${moment(sed.sistEndretDato).format('YYYYMMDD_HHmmss')}.pdf`)
      setDownloading(false)
    } else if (previewFile === null) {
      setDownloading(false)
      setDownloadFailed(true)
    }
  }, [downloading, gettingPreviewFile, previewFile, sed.sedId, sed.sistEndretDato])

  const downloadPDF = () => {
    setDownloading(true)
    setDownloadFailed(false)
    dispatch(previewSed(sed.sedId, sakId))
  }

  return (
  <SEDPanelBase currentFagsak={fagsak} sed={sed} selected={selected}>
    <VStack gap="space-8">
      <HStack align="center">
        <Heading size="small">{sed.sedType} - {sed.sedTittel}</Heading>
        <PreviewSED
          short
          size="small"
          rinaSakId={sakId}
          sedId={sed.sedId}
          disabled={!hasSedHandlinger || downloading}
        />
        <Button
          variant="tertiary"
          size="small"
          disabled={!hasSedHandlinger || downloading || gettingPreviewFile}
          onClick={downloadPDF}
          icon={<DownloadIcon/>}
          loading={downloading}
          title={t('el:button-download-pdf')}
        />
      </HStack>
      {downloadFailed && (
        <Alert variant="error" size="small">{t('message:error-aarlig-kontroll-pdf-download')}</Alert>
      )}
      {mode === 'selected' && (
        <HStack>
          <Button variant="primary" loading={copying} disabled={copying} onClick={onCopy}>
            {t('el:button-aarlig-kontroll-kopier')}
          </Button>
        </HStack>
      )}
      {mode === 'list' && (
        <HStack>
          <Button variant={selected ? 'secondary' : 'primary'} disabled={selected} onClick={onSelect}>
            {selected ? t('label:valgt') : t('label:velg')}
          </Button>
        </HStack>
      )}
    </VStack>
  </SEDPanelBase>
  )
}

export default AarligKontrollSEDPanel
