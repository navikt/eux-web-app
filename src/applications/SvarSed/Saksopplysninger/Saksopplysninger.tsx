import {BodyLong, Box, Button, Dialog, Heading, VStack} from '@navikt/ds-react'
import AddMottakereModal from 'applications/SvarSed/AddMottakereModal/AddMottakereModal'
import { Dd, Dl, Dt, HorizontalLineSeparator } from 'components/StyledComponents'
import { Sak } from 'declarations/types'
import _ from 'lodash'
import React, {useState} from 'react'
import { useTranslation } from 'react-i18next'

interface SaksopplysningerProps {
  sak: Sak
}

const Saksopplysninger = ({ sak }: SaksopplysningerProps) => {
  const { t } = useTranslation()
  const [_dialogOpen, setDialogOpen] = useState<boolean>(false)

  const canChangeParticipants = _.find(sak.sakshandlinger, s => s === "singleParticipant" || s === "multipleParticipants")  !== undefined
  const type = sak.sakshandlinger?.includes("multipleParticipants") ? "multiple" : "single"

  return (
    <>
      <Dialog open={_dialogOpen} onOpenChange={()=> setDialogOpen(!_dialogOpen)}>
        <Dialog.Popup style={{overflow: "visible"}}>
          <Dialog.Header>
            <Dialog.Title>{type === "multiple" ? t('label:add-deltakere-modal') : t('label:add-deltaker-modal')}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body style={{overflow: "visible"}}>
            <AddMottakereModal
              bucType={sak.sakType}
              rinaSakId={sak.sakId}
              sakshandlinger={sak.sakshandlinger}
              onClose={() => setDialogOpen(false)}
            />
          </Dialog.Body>
        </Dialog.Popup>
      </Dialog>
      <Box padding="4" background="bg-default" borderWidth="1" borderColor="border-default" borderRadius="small">
        <VStack>
          <VStack gap="4">
            <Heading size='small'>
              {t('label:saksopplysninger')}
            </Heading>
            <HorizontalLineSeparator />
          </VStack>
          <Dl>
            <Dt>
              {t('label:vår-rolle')}:
            </Dt>
            <Dd>
              {sak.erSakseier && t('label:sakseier')}
              {!sak.erSakseier && t('label:motpart')}
              {_.isNil(sak.erSakseier) && t('label:ukjent')}
            </Dd>
            <Dt>
              {t('label:andre-deltakere')}:
            </Dt>
            <Dd>
              {sak.motpart?.map(m => <BodyLong key={m}>{m}</BodyLong>)}
            </Dd>
          </Dl>
          {canChangeParticipants && (
            <Button
              variant='secondary'
              onClick={() => setDialogOpen(true)}
            >
              {t('el:button-change-participants')}
            </Button>
          )}
        </VStack>
      </Box>
    </>
  )
}

export default Saksopplysninger
