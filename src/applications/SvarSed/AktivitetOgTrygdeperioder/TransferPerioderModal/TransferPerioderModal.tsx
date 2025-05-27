import React, {useState} from "react";
import Modal from "../../../../components/Modal/Modal";
import {Box, Checkbox, HStack, Radio, RadioGroup, Spacer} from "@navikt/ds-react";
import PeriodeText from "../../../../components/Forms/PeriodeText";
import {PensjonPeriode, Periode} from "../../../../declarations/sed";
import _ from "lodash";
import {useTranslation} from "react-i18next";
import {useAppDispatch} from "../../../../store";
import {updateReplySed} from "../../../../actions/svarsed";

export interface TransferPerioderModalProps {
  namespace: string
  title: string
  modalOpen: boolean
  setModalOpen: (open: boolean) => void
  target?: any
  perioder: Array<Periode> | undefined
  periodeType?: string
}

const TransferPerioderModal: React.FC<TransferPerioderModalProps> = ({
  namespace,
  title,
  modalOpen,
  setModalOpen,
  target,
  perioder,
  periodeType = undefined
}: TransferPerioderModalProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const getId = (p: Periode | null): string => p ? namespace + '-' + p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType) : 'new'
  const [_valgtePerioder, _setValgtePerioder] = useState<any>(undefined)

  const onValgtePerioderChanged = (checked: boolean, periode: Periode, index: number) => {
    if(checked){
      const valgtPeriode = {
        periode: {
          ...periode
        }
      }

      _setValgtePerioder({
        ..._valgtePerioder,
        ["periode-" + index]: valgtPeriode
      })
    } else {
      let copy = _.cloneDeep(_valgtePerioder)
      copy = _.omit(copy, "periode-" + index)
      _setValgtePerioder(copy)
    }
  }

  const onTransferPerioder = () => {
    let perioder: Array<Periode | PensjonPeriode> = []

    if(periodeType && periodeType === "pensjon") {
      perioder = Object.values(_valgtePerioder)
    } else if(periodeType && periodeType === "dekketUdekket") {
      const dekket: Array<Periode> = []
      const udekket: Array<Periode> = []

      Object.values(_valgtePerioder).forEach((p: any) => {
        p.dekketUdekket === "dekket" ? dekket.push(p.periode) : udekket.push(p.periode)
      })

      dispatch(updateReplySed(`${target}.dekkedePerioder`, undefined))
      dispatch(updateReplySed(`${target}.udekkedePerioder`, undefined))
      dispatch(updateReplySed(`${target}.dekkedePerioder`, dekket))
      dispatch(updateReplySed(`${target}.udekkedePerioder`, udekket))
      onModalClose()
      return
    } else {
      Object.values(_valgtePerioder).forEach((p: any) => {
        perioder.push(p.periode)
      })
    }
    dispatch(updateReplySed(`${target}`, undefined))
    dispatch(updateReplySed(`${target}`, perioder))
    onModalClose()
  }

  const onModalClose = () => {
    _setValgtePerioder(undefined)
    setModalOpen(false)
  }

  const onSetPensjonstype = (pensjonstype: string, index: number) => {
    _setValgtePerioder({
      ..._valgtePerioder,
      ["periode-" + index]: {
        ..._valgtePerioder["periode-" + index],
        pensjonstype: pensjonstype
      }
    })
  }

  const onSetDekketUdekketPeriode = (dekketUdekket: string, index: number) => {
    _setValgtePerioder({
      ..._valgtePerioder,
      ["periode-" + index]: {
        ..._valgtePerioder["periode-" + index],
        dekketUdekket: dekketUdekket
      }
    })
  }

  return(
    <Modal
      open={modalOpen}
      modal={{
        modalTitle: title,
        modalContent: (
          <Box borderWidth="1" borderColor="border-subtle" padding="4">
            {perioder?.map((p, i) => {
              return (
                <HStack gap="4" align={"start"}>
                  <Checkbox
                    key={getId(p)}
                    checked={!!(_valgtePerioder && _valgtePerioder["periode-" + i])}
                    onChange={(e) => onValgtePerioderChanged(e.target.checked, p, i)}
                  >
                    <PeriodeText
                      periode={p}
                      namespace={namespace + 'transferperioder'}
                      error={{
                        startdato: undefined,
                        sluttdato: undefined
                      }}
                    />
                  </Checkbox>
                  <Spacer/>
                  {periodeType && periodeType === "pensjon" && _valgtePerioder && _valgtePerioder["periode-" + i] &&
                    <RadioGroup legend="Grunnlag" hideLegend={true} onChange={(pensjonsType: string) => onSetPensjonstype(pensjonsType, i)}>
                      <HStack gap="4">
                        <Radio value="alderspensjon">{t('el:option-trygdeordning-alderspensjon')}</Radio>
                        <Radio value="uførhet">{t('el:option-trygdeordning-uførhet')}</Radio>
                      </HStack>
                    </RadioGroup>
                  }
                  {periodeType && periodeType === "dekketUdekket" && _valgtePerioder && _valgtePerioder["periode-" + i] &&
                    <RadioGroup legend="Dekket/Udekket" hideLegend={true} onChange={(dekketUdekket: string) => onSetDekketUdekketPeriode(dekketUdekket, i)}>
                      <HStack gap="4">
                        <Radio value="dekket">Dekket</Radio>
                        <Radio value="udekket">Udekket</Radio>
                      </HStack>
                    </RadioGroup>
                  }
                </HStack>
              )
            })}
          </Box>
        ),
        modalButtons: [
          {
            main: true,
            text: title,
            onClick: () => onTransferPerioder()
          },
          {
            text: 'Lukk',
            onClick: () => onModalClose()
          },
        ]
      }}
      width="medium"
      onModalClose={() => onModalClose()}
    />
  )
}

export default TransferPerioderModal
