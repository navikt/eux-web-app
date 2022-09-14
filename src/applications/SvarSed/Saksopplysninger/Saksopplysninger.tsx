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

  const canChangeParticipants = sak.erSakseier === 'ja' &&
    _.find(sak.sedListe, s => s.status === 'received' || s.status === 'sent') === undefined

  return (
    <>
      <Modal
        shouldCloseOnOverlayClick={false}
        open={showAddMottakereModal}
        onModalClose={() => setShowAddMottakereModal(false)}
        modal={{
          closeButton: false,
          modalContent: (
            <AddMottakereModal
              bucType={sak.sakType}
              rinaSakId={sak.sakId}
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
            {t('tema:' + sak.tema)}
          </Dd>
          <Dt>
            {t('label:fagsak')}:
          </Dt>
          <Dd>
            {sak.fagsakId}
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
