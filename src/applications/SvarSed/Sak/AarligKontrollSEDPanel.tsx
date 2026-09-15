import {DownloadIcon} from '@navikt/aksel-icons'
import {Button, Heading, HStack, VStack} from '@navikt/ds-react'
import {previewSed} from 'actions/svarsed'
import PreviewSED from 'applications/SvarSed/PreviewSED/PreviewSED'
import SEDPanelBase from 'applications/SvarSed/Sak/SEDPanelBase'
import {State} from 'declarations/reducers'
import {F001FilteredResult} from 'declarations/types'
import {saveAs} from 'file-saver'
import moment from 'moment'
import React, {JSX, useEffect, useState} from 'react'
import {useAppDispatch, useAppSelector} from 'store'

interface AarligKontrollSEDPanelProps {
  f001: F001FilteredResult
  mode: 'selected' | 'list'
  onSelect?: () => void
  selected?: boolean
}

const AarligKontrollSEDPanel = ({
  f001,
  mode,
  onSelect,
  selected = false
}: AarligKontrollSEDPanelProps): JSX.Element => {
  const dispatch = useAppDispatch()
  const {gettingPreviewFile, previewFile} = useAppSelector((state: State) => ({
    gettingPreviewFile: state.loading.gettingPreviewFile,
    previewFile: state.svarsed.previewFile
  }))
  const [downloading, setDownloading] = useState(false)
  const sed = f001.sedListe[0]
  const hasSedHandlinger = !!sed.sedHandlinger?.length

  useEffect(() => {
    if (downloading && previewFile && !gettingPreviewFile) {
      saveAs(previewFile, `SED_${sed.sedId}_${moment(sed.sistEndretDato).format('YYYYMMDD_HHmmss')}.pdf`)
      setDownloading(false)
    }
  }, [downloading, gettingPreviewFile, previewFile, sed.sedId, sed.sistEndretDato])

  const downloadPDF = () => {
    setDownloading(true)
    dispatch(previewSed(sed.sedId, f001.sakId))
  }

  return (
  <SEDPanelBase currentFagsak={f001.fagsak} sed={sed} selected={selected}>
    <VStack gap="space-8">
      <HStack align="center">
        <Heading size="small">{sed.sedType} - {sed.sedTittel}</Heading>
        <PreviewSED
          short
          size="small"
          rinaSakId={f001.sakId}
          sedId={sed.sedId}
          disabled={!hasSedHandlinger}
        />
        <Button
          variant="tertiary"
          size="small"
          disabled={!hasSedHandlinger || downloading}
          onClick={downloadPDF}
          icon={<DownloadIcon/>}
          loading={downloading}
          title="Last ned PDF"
        />
      </HStack>
      {mode === 'selected' && (
        <Button variant="primary">Kopier for årlig kontroll</Button>
      )}
      {mode === 'list' && (
        <HStack>
          <Button variant={selected ? 'secondary' : 'primary'} disabled={selected} onClick={onSelect}>
            {selected ? 'Valgt' : 'Velg'}
          </Button>
        </HStack>
      )}
    </VStack>
  </SEDPanelBase>
  )
}

export default AarligKontrollSEDPanel
