import React, {useEffect, useState} from 'react'
import { MainFormProps, MainFormSelector } from '../MainForm'
import {useAppDispatch, useAppSelector} from '../../../store'
import { State } from '../../../declarations/reducers'
import {Box, Checkbox, Heading, HStack, VStack} from "@navikt/ds-react";
import PeriodePerioder from "../AktivitetOgTrygdeperioder/PeriodePerioder/PeriodePerioder";
import {useTranslation} from "react-i18next";
import {RettIkkeRettTilFamilieYtelse} from "../../../declarations/sed";
import _ from "lodash";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const PerioderMedRettTilYtelser: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed,
  setReplySed
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const target: string = `${personID}.perioderMedRettTilYtelser`
  const perioderMedRettTilYtelser: Array<RettIkkeRettTilFamilieYtelse> | undefined = _.get(replySed, target)

  const [_rettTilFamilieytelserIndex, _setRettTilFamilieytelserIndex] = useState<number>(-1)
  const [_ikkeRettTilFamilieytelserIndex, _setIkkeRettTilFamilieytelserIndex] = useState<number>(-1)

  const [_rettTilFamilieytelser, _setRettTilFamilieytelser] = useState<boolean>(false)
  const [_ikkeRettTilFamilieytelser, _setIkkeRettTilFamilieytelser] = useState<boolean>(false)


  useEffect(() => {
    if(perioderMedRettTilYtelser && perioderMedRettTilYtelser.length >= 0){
      const rettTilFamilieytelserIndex = perioderMedRettTilYtelser.findIndex((o => o.rettTilFamilieytelser !== undefined))
      const ikkeRettTilFamilieytelserIndex = perioderMedRettTilYtelser.findIndex((o => o.ikkeRettTilFamilieytelser !== undefined))

      if(rettTilFamilieytelserIndex === -1 && ikkeRettTilFamilieytelserIndex === -1){
        _setRettTilFamilieytelser(false)
        _setIkkeRettTilFamilieytelser(false)
      } else if(rettTilFamilieytelserIndex === -1 && ikkeRettTilFamilieytelserIndex === 0){
        _setRettTilFamilieytelser(false)
        _setIkkeRettTilFamilieytelser(true)
      } else if (ikkeRettTilFamilieytelserIndex === -1 && rettTilFamilieytelserIndex === 0){
        _setRettTilFamilieytelser(true)
        _setIkkeRettTilFamilieytelser(false)
      } else {
        _setRettTilFamilieytelser(true)
        _setIkkeRettTilFamilieytelser(true)
      }
      _setRettTilFamilieytelserIndex(rettTilFamilieytelserIndex)
      _setIkkeRettTilFamilieytelserIndex(ikkeRettTilFamilieytelserIndex)
    }
  }, [])

  const setRettTilFamilieytelser = (value: boolean) => {
    const perioderMedRettTilYtelserCopy = perioderMedRettTilYtelser ? [...perioderMedRettTilYtelser] : []
    _setRettTilFamilieytelser(value)
    if(value){
      perioderMedRettTilYtelserCopy.push({rettTilFamilieytelser: []})
      _setRettTilFamilieytelserIndex(perioderMedRettTilYtelserCopy.length-1)
    } else {
      perioderMedRettTilYtelserCopy.splice(_rettTilFamilieytelserIndex, 1);
      _setRettTilFamilieytelserIndex(-1)
      _ikkeRettTilFamilieytelserIndex !== -1 ? _setIkkeRettTilFamilieytelserIndex(0) : _setIkkeRettTilFamilieytelserIndex(-1)
    }
    dispatch(updateReplySed(target, perioderMedRettTilYtelserCopy))
  }

  const setIkkeRettTilFamilieytelser = (value: boolean) => {
    const perioderMedRettTilYtelserCopy = perioderMedRettTilYtelser ? [...perioderMedRettTilYtelser] : []
    _setIkkeRettTilFamilieytelser(value)
    if(value){
      perioderMedRettTilYtelserCopy.push({ikkeRettTilFamilieytelser: []})
      _setIkkeRettTilFamilieytelserIndex(perioderMedRettTilYtelserCopy.length-1)
    } else {
      perioderMedRettTilYtelserCopy.splice(_ikkeRettTilFamilieytelserIndex, 1);
      _setIkkeRettTilFamilieytelserIndex(-1)
      _rettTilFamilieytelserIndex !== -1 ? _setRettTilFamilieytelserIndex(0) : _setRettTilFamilieytelserIndex(-1)
    }
    dispatch(updateReplySed(target, perioderMedRettTilYtelserCopy))
  }

  return (
    <VStack gap="4" padding="4">
      <Heading size='small'>
        {t('label:rett-til-ytelser')}
      </Heading>
      <Box borderWidth="1" borderColor="border-subtle" background="surface-subtle" padding="4">
        <HStack gap="4">
          <Checkbox
            checked={_rettTilFamilieytelser}
            onChange= {(e: React.ChangeEvent<HTMLInputElement>) => setRettTilFamilieytelser(e.target.checked)}
          >
            {t('label:rett-til-familieytelser')} ({_rettTilFamilieytelserIndex})
          </Checkbox>
          <Checkbox
            checked={_ikkeRettTilFamilieytelser}
            onChange= {(e: React.ChangeEvent<HTMLInputElement>) => setIkkeRettTilFamilieytelser(e.target.checked)}
          >
            {t('label:ikke-rett-til-familieytelser')} ({_ikkeRettTilFamilieytelserIndex})
          </Checkbox>
        </HStack>
      </Box>
      {_rettTilFamilieytelser &&
        <Box padding="4" borderWidth="1" borderColor="border-subtle">
          <Heading size='xsmall'>
            {t('label:perioder-med-rett-til-familieytelser')}
          </Heading>
          <PeriodePerioder
            parentNamespace={parentNamespace + '-periodermedretttilfamilieytelser'}
            parentTarget={"perioderMedRettTilYtelser[" + _rettTilFamilieytelserIndex + "].rettTilFamilieytelser"}
            personID={personID}
            personName={personName}
            replySed={replySed}
            updateReplySed={updateReplySed}
            setReplySed={setReplySed}
            options={{
              periodeType: "simple",
              requiredSluttDato: true
            }}
          />
        </Box>
      }
      {_ikkeRettTilFamilieytelser &&
        <Box padding="4" borderWidth="1" borderColor="border-subtle">
          <Heading size='xsmall'>
            {t('label:perioder-uten-rett-til-familieytelser')}
          </Heading>

          {/** CREATE NEW COMPONENT FOR IKKE RETT TIL FAMILIE YTELSER**/}
          <PeriodePerioder
            parentNamespace={parentNamespace + '-periodermedikkeretttilfamilieytelser'}
            parentTarget={"perioderMedRettTilYtelser[" + _ikkeRettTilFamilieytelserIndex + "].ikkeRettTilFamilieytelser"}
            personID={personID}
            personName={personName}
            replySed={replySed}
            updateReplySed={updateReplySed}
            setReplySed={setReplySed}
            options={{
              periodeType: "simple",
              requiredSluttDato: true
            }}
          />
        </Box>
      }
    </VStack>
  )
}

export default PerioderMedRettTilYtelser

