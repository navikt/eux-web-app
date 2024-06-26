import { BodyLong, Button, Heading, Panel } from '@navikt/ds-react'
import { VerticalSeparatorDiv } from '@navikt/hoykontrast'
import AddMottakereModal from 'applications/SvarSed/AddMottakereModal/AddMottakereModal'
import Modal from 'components/Modal/Modal'
import { Dd, Dl, Dt, HorizontalLineSeparator } from 'components/StyledComponents'
import { Sak } from 'declarations/types'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface SaksopplysningerProps {
  sak: Sak
}

const Saksopplysninger = ({ sak }: SaksopplysningerProps) => {
  const { t } = useTranslation()

  const [showAddMottakereModal, setShowAddMottakereModal] = useState<boolean>(false)

  const canChangeParticipants = _.find(sak.sakshandlinger, s => s === "singleParticipant" || s === "multipleParticipants")  !== undefined
  const type = sak.sakshandlinger?.includes("multipleParticipants") ? "multiple" : "single"

  return (
    <>
      <Modal
        open={showAddMottakereModal}
        onModalClose={() => setShowAddMottakereModal(false)}
        modal={{
          modalTitle: type === "multiple" ? t('label:add-deltakere-modal') : t('label:add-deltaker-modal'),
          modalContent: (
            <AddMottakereModal
              bucType={sak.sakType}
              rinaSakId={sak.sakId}
              sakshandlinger={sak.sakshandlinger}
              onClose={() => setShowAddMottakereModal(false)}
            />
          )
        }}
      />
      <Panel border>
        <Heading size='small'>
          {t('label:saksopplysninger')}
        </Heading>
        <VerticalSeparatorDiv />
        <HorizontalLineSeparator />
        <VerticalSeparatorDiv />
        <Dl>
          <Dt>
            {t('label:vår-rolle')}:
          </Dt>
          <Dd>
            {sak.erSakseier === 'ja' && t('label:sakseier')}
            {sak.erSakseier === 'nei' && t('label:motpart')}
            {_.isNil(sak.erSakseier) && t('label:ukjent')}
          </Dd>
          <Dt>
            {t('label:andre-deltakere')}:
          </Dt>
          <Dd>
            {sak.motpart?.map(m => <BodyLong key={m}>{m}</BodyLong>)}
          </Dd>
          <Dt>
            {t('label:tema')}:
          </Dt>
          <Dd>
            {sak.fagsak?.tema ? t('tema:' + sak.fagsak.tema) : ""}
          </Dd>
          <Dt>
            {t('label:fagsak')}:
          </Dt>
          <Dd>
            {sak.fagsak?.nr ? sak.fagsak?.nr : sak.fagsak?.id}
          </Dd>
          <Dt>
            {t('label:journalfoert-paa')}:
          </Dt>
          <Dd>
            {sak.fagsak?.fnr ? sak.fagsak?.fnr : ""}
          </Dd>
        </Dl>
        <VerticalSeparatorDiv />
        {canChangeParticipants && (
          <Button
            variant='secondary'
            onClick={() => setShowAddMottakereModal(true)}
          >
            {t('el:button-change-participants')}
          </Button>
        )}

      </Panel>
    </>
  )
}

export default Saksopplysninger
