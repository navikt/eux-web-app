import React, {useEffect, useState} from "react";
import Modal from "../../../../components/Modal/Modal";
import {Alert, BodyShort, Box, Checkbox, HelpText, HStack, VStack, Tag,} from "@navikt/ds-react";
import {F001Sed, Motregning, Motregninger, MotregningOppsummert} from "../../../../declarations/sed";
import _ from "lodash";
import {useTranslation} from "react-i18next";
import {useAppDispatch} from "../../../../store";
import {updateReplySed} from "../../../../actions/svarsed";
import dayjs from "dayjs";

export interface TransferToMotregningOppsummertModalProps {
  namespace: string
  title: string
  modalOpen: boolean
  setModalOpen: (open: boolean) => void
  target?: any
  motregninger: Array<Motregning> | undefined
  resetWarning?: boolean
}

const TransferToMotregningOppsummertModal: React.FC<TransferToMotregningOppsummertModalProps> = ({
  namespace,
  title,
  modalOpen,
  setModalOpen,
  target,
  motregninger,
  resetWarning
}: TransferToMotregningOppsummertModalProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [_valgteBeloep, _setValgteBeloep] = useState<any>(undefined)
  const [_totalBeloep, _setTotalBeloep] = useState<number>(0)
  const [_valuta, _setValuta] = useState<any>(undefined)
  const [_totalBeloepTekst, _setTotalBeloepTekst] = useState<string>('')
  const [_totalBeloepAlert, _setTotalBeloepAlert] = useState<JSX.Element | undefined>(undefined)
  const warnings: Array<string> = []

  if(resetWarning) warnings.push("OBS! Allerede registrert totalbeløp/valuta vil bli overskrevet!")

  const getId = (m: Motregning | null): string => m ? namespace + '-' + m.startdato + '-' + (m.sluttdato ?? m.aapenPeriodeType) : 'new'

  const onValgteBeloepChanged = (checked: boolean, totalBeloep: number, valuta: string, index: number) => {
    if(checked){
      _setValgteBeloep({
        ..._valgteBeloep,
        ["beloep-" + index]: {
          totalBeloep,
          valuta
        }
      })
      _setTotalBeloep(_totalBeloep + totalBeloep)
    } else {
      let copy = _.cloneDeep(_valgteBeloep)
      copy = _.omit(copy, "beloep-" + index)
      _setValgteBeloep(copy)
      _setTotalBeloep(_totalBeloep - totalBeloep)
    }
  }

  const onTransfer = () => {
    dispatch(updateReplySed(target + ".totalbeloep", _totalBeloep.toFixed(0)))
    dispatch(updateReplySed(target + ".valuta", _valuta))
    _setTotalBeloep(0)
    _setValuta(undefined)
    onModalClose()
  }

  const onModalClose = () => {
    _setValgteBeloep(undefined)
    setModalOpen(false)
  }

  useEffect(() => {
    _setTotalBeloepTekst("")
    if(_valgteBeloep && Object.values(_valgteBeloep).length > 0) {
      const entries: Array<any> = Object.values(_valgteBeloep)
      const valutaer = _.uniq(entries.map(e => e.valuta))
      if(valutaer.length !== 1) {
        _setTotalBeloepTekst("")
        _setTotalBeloepAlert(<Alert variant="error" size="small">Ulike valutaer er valgt</Alert>)
        _setValuta(undefined)
        return
      }
      _setTotalBeloepAlert(undefined)
      _setTotalBeloepTekst(_totalBeloep.toFixed(0) + ' ' + valutaer[0])
      _setValuta(valutaer[0])
    }
  }, [_valgteBeloep])

  const HiddenAlert: React.FC = () => <Alert size="small" variant="info" style={{visibility:"hidden"}}>-</Alert>

  return(
    <Modal
      open={modalOpen}
      description={warnings.length > 0  ? warnings : undefined}
      modal={{
        modalTitle: title,
        modalContent: (
          <Box borderWidth="1" borderColor="border-subtle" padding="4">
            {motregninger?.map((m, i) => {
              const fomDato = _.isString(m.startdato) ?
                dayjs(m.startdato, 'YYYY-MM-DD') :
                dayjs(m.startdato)

              const tomDato = _.isString(m.sluttdato) ?
                  dayjs(m.sluttdato, 'YYYY-MM-DD') :
                  dayjs(m.sluttdato)
              const tomDatoPlusOneDay = tomDato.add(1, 'day') //Include fomDato in count
              const months = tomDatoPlusOneDay.diff(fomDato, 'month')
              const totalMotregningBeloep = m.utbetalingshyppighet === 'Årlig' ? parseFloat(m.beloep) / 12 * months : parseFloat(m.beloep) * months

              return (
                <HStack gap="4" align="center">
                  <Checkbox
                    key={getId(m)}
                    checked={!!(_valgteBeloep && _valgteBeloep["beloep-" + i])}
                    onChange={(e) => onValgteBeloepChanged(e.target.checked, totalMotregningBeloep, m.valuta, i)}
                  >
                    {totalMotregningBeloep.toFixed(0)} {m.valuta}
                  </Checkbox>
                  {m.barnetsNavn ? <Tag size="xsmall" variant={"warning-moderate"}>{m.barnetsNavn}</Tag> : null}
                  <HelpText>
                    <BodyShort size="small">
                    {fomDato.format('DD.MM.YYYY')} - {tomDato.format('DD.MM.YYYY')} ({months} mnd)<br/>
                    {m.utbetalingshyppighet === "Månedlig" &&
                      <>
                        {m.beloep} {m.utbetalingshyppighet.toLowerCase()} * {months} = {totalMotregningBeloep.toFixed(0)} {m.valuta}
                      </>
                    }
                      {m.utbetalingshyppighet === "Årlig" &&
                        <>
                          {m.beloep} {m.utbetalingshyppighet.toLowerCase()}/12 * {months} = {totalMotregningBeloep.toFixed(0)} {m.valuta}
                        </>
                      }
                    </BodyShort>
                  </HelpText>
                </HStack>
              )
            })}
            {!_totalBeloepAlert && <HStack align="center" gap="2"><b>Totalbeløp:</b>{_totalBeloepTekst}<HiddenAlert/></HStack>}
            {_totalBeloepAlert}
          </Box>
        ),
        modalButtons: [
          {
            main: true,
            text: title,
            disabled: !_valgteBeloep || Object.values(_valgteBeloep).length === 0 || (_.uniq(Object.values(_valgteBeloep).map((e: any) => e.valuta))).length !== 1,
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
