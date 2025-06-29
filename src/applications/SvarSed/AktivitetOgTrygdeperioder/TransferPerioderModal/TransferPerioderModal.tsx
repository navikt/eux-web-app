import React, {useState} from "react";
import Modal from "../../../../components/Modal/Modal";
import {Box, Checkbox, HStack, Radio, RadioGroup, Spacer} from "@navikt/ds-react";
import PeriodeText from "../../../../components/Forms/PeriodeText";
import {PensjonPeriode, Periode} from "../../../../declarations/sed";
import _ from "lodash";
import {useTranslation} from "react-i18next";
import {useAppDispatch} from "../../../../store";
import {updateReplySed} from "../../../../actions/svarsed";
import moment from "moment";

export interface TransferPerioderModalProps {
  namespace: string
  title: string
  modalOpen: boolean
  setModalOpen: (open: boolean) => void
  target?: any
  perioder: Array<Periode> | undefined
  periodeType?: string
  resetPerioder?: Array<string>
  resetWarning?: boolean
  closedPeriodsWarning?: boolean
}

const TransferPerioderModal: React.FC<TransferPerioderModalProps> = ({
  namespace,
  title,
  modalOpen,
  setModalOpen,
  target,
  perioder,
  periodeType = undefined,
  resetPerioder,
  resetWarning,
  closedPeriodsWarning
}: TransferPerioderModalProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const getId = (p: Periode | null): string => p ? namespace + '-' + p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType) : 'new'
  const [_valgtePerioder, _setValgtePerioder] = useState<any>(undefined)
  const warnings: Array<string> = []

  if(resetWarning) warnings.push("OBS! Allerede overførte perioder vil bli overskrevet!")
  if(closedPeriodsWarning) warnings.push("OBS! Åpne perioder vil få satt sluttdato til dagens dato!")


  const onValgtePerioderChanged = (checked: boolean, periode: Periode, index: number) => {
    if(checked){
      const valgtPeriode = {
        periode: {
          ...periode,
        },
        ...(periodeType && periodeType === "pensjon" && {pensjonstype: undefined}),
        ...(periodeType && periodeType === "dekketUdekket" && {dekketUdekket: undefined})
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
  const isAllPropertiesDefined = (arr: any): boolean => {
    return arr.every((obj:any) =>{
        if(Object.hasOwn(obj, "dekketUdekket")){
          return true
        } else {
          return Object.values(obj).every(value => value !== undefined)
        }
    }
    );
  }

  const onTransferPerioder = () => {
    resetPerioder?.forEach((target) => {
      dispatch(updateReplySed(`${target}`, undefined))
    })

    if(periodeType && periodeType === "pensjon") {
      const perioderMedPensjon: Array<PensjonPeriode> = Object.values(_valgtePerioder)
      dispatch(updateReplySed(`${target}`, perioderMedPensjon))
    } else if(periodeType && periodeType === "dekketUdekket") {
      const perioderMedRettTilFamilieytelser: Array<Periode> = []
      const dekket: Array<Periode> = []
      const udekket: Array<Periode> = []

      Object.values(_valgtePerioder).forEach((p: any) => {
        let lukketPeriode: Periode = _.cloneDeep(p.periode)
        if(lukketPeriode.aapenPeriodeType){
          const today = new Date()
          delete lukketPeriode.aapenPeriodeType
          lukketPeriode.sluttdato = moment(today).format('YYYY-MM-DD')
        }
        perioderMedRettTilFamilieytelser.push(lukketPeriode)
        if(p.dekketUdekket === "dekket") dekket.push(lukketPeriode)
        if(p.dekketUdekket === "udekket") udekket.push(lukketPeriode)
      })
      dispatch(updateReplySed(`${target}.perioderMedRettTilFamilieytelser`, perioderMedRettTilFamilieytelser))
      dispatch(updateReplySed(`${target}.dekkedePerioder`, dekket))
      dispatch(updateReplySed(`${target}.udekkedePerioder`, udekket))
    } else {
      const perioder: Array<Periode> = []
      Object.values(_valgtePerioder).forEach((p: any) => {
        perioder.push(p.periode)
      })
      dispatch(updateReplySed(`${target}`, perioder))
    }

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
      description={warnings.length > 0  ? warnings : undefined}
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
                        <Radio value="dekket">{t('el:option-trygdeordning-dekket')}</Radio>
                        <Radio value="udekket">{t('el:option-trygdeordning-udekket')}</Radio>
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
            disabled: !_valgtePerioder || Object.values(_valgtePerioder).length === 0 || !isAllPropertiesDefined(Object.values(_valgtePerioder)),
            onClick: () => onTransferPerioder()
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

export default TransferPerioderModal
