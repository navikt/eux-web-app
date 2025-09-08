import {BodyLong, Button, Heading, Modal, Panel} from '@navikt/ds-react'
import { VerticalSeparatorDiv } from '@navikt/hoykontrast'
import AddMottakereModal from 'applications/SvarSed/AddMottakereModal/AddMottakereModal'
import { Dd, Dl, Dt, HorizontalLineSeparator } from 'components/StyledComponents'
import { Sak } from 'declarations/types'
import _ from 'lodash'
import React, {useRef} from 'react'
import { useTranslation } from 'react-i18next'

interface SaksopplysningerProps {
  sak: Sak
}

const Saksopplysninger = ({ sak }: SaksopplysningerProps) => {
  const { t } = useTranslation()
  const ref = useRef<HTMLDialogElement>(null);

  const canChangeParticipants = _.find(sak.sakshandlinger, s => s === "singleParticipant" || s === "multipleParticipants")  !== undefined
  const type = sak.sakshandlinger?.includes("multipleParticipants") ? "multiple" : "single"

  return (
    <>
      <Modal ref={ref} header={{ heading: type === "multiple" ? t('label:add-deltakere-modal') : t('label:add-deltaker-modal') }} width="medium" style={{overflow: "visible"}}>
        <Modal.Body style={{overflow: "visible"}}>
          <AddMottakereModal
            bucType={sak.sakType}
            rinaSakId={sak.sakId}
            sakshandlinger={sak.sakshandlinger}
            onClose={() => ref.current?.close()}
          />
        </Modal.Body>
      </Modal>
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
        <VerticalSeparatorDiv />
        {canChangeParticipants && (
          <Button
            variant='secondary'
            onClick={() => ref.current?.showModal()}
          >
            {t('el:button-change-participants')}
          </Button>
        )}

      </Panel>
    </>
  )
}

export default Saksopplysninger
