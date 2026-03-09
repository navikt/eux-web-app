import {BodyLong, Box, Button, Dialog, Heading, VStack} from '@navikt/ds-react'
import AddMottakereModal from 'applications/SvarSed/AddMottakereModal/AddMottakereModal'
import { Sak } from 'declarations/types'
import _ from 'lodash'
import React, {useState} from 'react'
import { useTranslation } from 'react-i18next'
import commonStyles from 'assets/css/common.module.css'

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
      <Box padding="space-16" background="default" borderWidth="1" borderColor="neutral" borderRadius="2">
        <VStack>
          <VStack gap="space-16">
            <Heading size='small'>
              {t('label:saksopplysninger')}
            </Heading>
            <div className={commonStyles.horizontalLineSeparator} />
          </VStack>
          <dl className={commonStyles.definitionList}>
            <dt className={commonStyles.definitionTerm}>
              {t('label:vår-rolle')}:
            </dt>
            <dd className={commonStyles.definitionDescription}>
              {sak.erSakseier && t('label:sakseier')}
              {!sak.erSakseier && t('label:motpart')}
              {_.isNil(sak.erSakseier) && t('label:ukjent')}
            </dd>
            <dt className={commonStyles.definitionTerm}>
              {t('label:andre-deltakere')}:
            </dt>
            <dd className={commonStyles.definitionDescription}>
              {sak.motpart?.map(m => <BodyLong key={m}>{m}</BodyLong>)}
            </dd>
          </dl>
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
  );
}

export default Saksopplysninger
