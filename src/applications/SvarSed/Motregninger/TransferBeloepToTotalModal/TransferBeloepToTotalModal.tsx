import React, {useEffect, useState} from "react";
import Modal from "../../../../components/Modal/Modal";
import {Alert, BodyShort, Box, Checkbox, HelpText, HStack, Tag,} from "@navikt/ds-react";
import {Motregning, RefusjonsKrav} from "../../../../declarations/sed";
import _ from "lodash";
import {useTranslation} from "react-i18next";
import {useAppDispatch} from "../../../../store";
import {updateReplySed} from "../../../../actions/svarsed";
import dayjs from "dayjs";

export interface TransferBeloepToTotalModalProps {
  namespace: string
  title: string
  modalOpen: boolean
  setModalOpen: (open: boolean) => void
  target?: any
  beloepArray: Array<Motregning | RefusjonsKrav> | undefined
  resetWarning?: boolean
}

const TransferBeloepToTotalModal: React.FC<TransferBeloepToTotalModalProps> = ({
  namespace,
  title,
  modalOpen,
  setModalOpen,
  target,
  beloepArray,
  resetWarning
}: TransferBeloepToTotalModalProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [_valgteBeloep, _setValgteBeloep] = useState<any>(undefined)
  const [_totalBeloep, _setTotalBeloep] = useState<number>(0)
  const [_valuta, _setValuta] = useState<any>(undefined)
  const [_totalBeloepTekst, _setTotalBeloepTekst] = useState<string>('')
  const [_totalBeloepAlert, _setTotalBeloepAlert] = useState<JSX.Element | undefined>(undefined)
  const warnings: Array<string> = []

  if(resetWarning) warnings.push("OBS! Allerede registrert totalbeløp/valuta vil bli overskrevet!")

  const getId = (m: Motregning | RefusjonsKrav | null): string => m ? namespace + '-' + m.startdato + '-' + (m.sluttdato ?? m.aapenPeriodeType) : 'new'

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
            {beloepArray?.map((item, i) => {
              let totalBeloep = parseFloat(item.beloep)
              const fomDato = _.isString(item.startdato) ?
                dayjs(item.startdato, 'YYYY-MM-DD') :
                dayjs(item.startdato)

              const tomDato = _.isString(item.sluttdato) ?
                dayjs(item.sluttdato, 'YYYY-MM-DD') :
                dayjs(item.sluttdato)
              const tomDatoPlusOneDay = tomDato.add(1, 'day') //Include fomDato in count
              const months = tomDatoPlusOneDay.diff(fomDato, 'month')

              if("utbetalingshyppighet" in item) {
                totalBeloep = item.utbetalingshyppighet === 'Årlig' ? parseFloat(item.beloep) / 12 * months : parseFloat(item.beloep) * months
              }

              return (
                <HStack gap="4" align="center">
                  <Checkbox
                    key={getId(item)}
                    checked={!!(_valgteBeloep && _valgteBeloep["beloep-" + i])}
                    onChange={(e) => onValgteBeloepChanged(e.target.checked, totalBeloep, item.valuta, i)}
                  >
                    {totalBeloep.toFixed(0)} {item.valuta}
                  </Checkbox>
                  {"barnetsNavn" in item && item.barnetsNavn ? <Tag size="xsmall" variant={"warning-moderate"}>{item.barnetsNavn}</Tag> : null}
                  {"utbetalingshyppighet" in item && item.utbetalingshyppighet &&
                    <HelpText>
                      <BodyShort size="small">
                      {fomDato.format('DD.MM.YYYY')} - {tomDato.format('DD.MM.YYYY')} ({months} mnd)<br/>
                      {item.utbetalingshyppighet === "Månedlig" &&
                        <>
                          {item.beloep} {item.utbetalingshyppighet.toLowerCase()} * {months} = {totalBeloep.toFixed(0)} {item.valuta}
                        </>
                      }
                        {item.utbetalingshyppighet === "Årlig" &&
                          <>
                            {item.beloep} {item.utbetalingshyppighet.toLowerCase()}/12 * {months} = {totalBeloep.toFixed(0)} {item.valuta}
                          </>
                        }
                      </BodyShort>
                    </HelpText>
                  }
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

export default TransferBeloepToTotalModal
