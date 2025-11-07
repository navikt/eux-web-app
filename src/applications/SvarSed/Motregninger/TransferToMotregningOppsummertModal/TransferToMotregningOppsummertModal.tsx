import React, {useState} from "react";
import Modal from "../../../../components/Modal/Modal";
import {Box, Checkbox, HStack, Radio, RadioGroup, Spacer, Tag} from "@navikt/ds-react";
import PeriodeText from "../../../../components/Forms/PeriodeText";
import {Motregning, PensjonPeriode, Periode, PeriodePeriode} from "../../../../declarations/sed";
import _ from "lodash";
import {useTranslation} from "react-i18next";
import {useAppDispatch} from "../../../../store";
import {updateReplySed} from "../../../../actions/svarsed";
import moment from "moment";
import replySed from "../../../../mocks/svarsed/replySed";

export interface TransferToMotregningOppsummertModalProps {
  namespace: string
  title: string
  modalOpen: boolean
  setModalOpen: (open: boolean) => void
  target?: any
  motregninger: Array<Motregning> | undefined
}

const TransferToMotregningOppsummertModal: React.FC<TransferToMotregningOppsummertModalProps> = ({
  namespace,
  title,
  modalOpen,
  setModalOpen,
  target,
  motregninger
}: TransferToMotregningOppsummertModalProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [_valgteBeloep, _setValgteBeloep] = useState<any>(undefined)
  const warnings: Array<string> = []

  const getId = (m: Motregning | null): string => m ? namespace + '-' + m.startdato + '-' + (m.sluttdato ?? m.aapenPeriodeType) : 'new'

  const onValgteBeloepChanged = (checked: boolean, motregning: Motregning, index: number) => {
    if(checked){
    } else {
    }
  }

  const onTransfer = () => {
    onModalClose()
  }

  const onModalClose = () => {
    _setValgteBeloep(undefined)
    setModalOpen(false)
  }

  return(
    <Modal
      open={modalOpen}
      description={warnings.length > 0  ? warnings : undefined}
      modal={{
        modalTitle: title,
        modalContent: (
          <Box borderWidth="1" borderColor="border-subtle" padding="4">
            {motregninger?.map((m, i) => {
              return (
                <HStack gap="4" align="center">
                  <Checkbox
                    key={getId(m)}
                    checked={!!(_valgteBeloep && _valgteBeloep["beloep-" + i])}
                    onChange={(e) => onValgteBeloepChanged(e.target.checked, m, i)}
                  >
                    {m.beloep} {m.valuta} ({m.utbetalingshyppighet})
                  </Checkbox>
                  <Tag size="xsmall" variant={"warning-moderate"}>{m.barnetsNavn ? m.barnetsNavn : m.antallPersoner + " personer"}</Tag>
                </HStack>
              )
            })}
          </Box>
        ),
        modalButtons: [
          {
            main: true,
            text: title,
            disabled: !_valgteBeloep || Object.values(_valgteBeloep).length === 0,
            onClick: () => onTransfer()
          },
          {
            text: t('el:button-close'),
            onClick: () => onModalClose()
          },
        ]
      }}
      width="medium"
      onModalClose={() => onModalClose()}
    />
  )
}

export default TransferToMotregningOppsummertModal
