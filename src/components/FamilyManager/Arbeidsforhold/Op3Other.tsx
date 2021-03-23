import Add from 'assets/icons/Add'
import Trashcan from 'assets/icons/Trashcan'
import Select from 'components/Select/Select'
import { PensjonPeriode, Periode } from 'declarations/sed'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const AlignEndRow = styled(Row)`
  align-items: flex-end;
`

type PensjonType = 'alderspensjon' | 'uførhet' // | 'enkepensjon' | 'barnepensjon=' | 'etterlattepensjon'

const Op3Other = ({
  highContrast, personID, validation
}: any) => {
  const { t } = useTranslation()
  const [_perioder, setPerioder] = useState<Array<PensjonPeriode>>([])
  const [_currentStartDato, setCurrentStartDato] = useState<string>('')
  const [_currentSluttDato, setCurrentSluttDato] = useState<string>('')
  const [_currentPensjonType, setCurrentPensjonType] = useState<string>('')
  const [_seeNewForm, setSeeNewForm] = useState<boolean>(false)

  const setStartDato = (e: string, i: number) => {
    if (i < 0) {
      setCurrentStartDato(e)
    } else {
      const newPerioder = _.cloneDeep(_perioder)
      newPerioder[i].periode.startdato = e
      setPerioder(newPerioder)
      // onValueChanged(`${personID}.XXX`, newPerioder)
      setCurrentStartDato('')
    }
  }

  const setSluttDato = (e: string, i: number) => {
    if (i < 0) {
      setCurrentSluttDato(e)
    } else {
      const newPerioder = _.cloneDeep(_perioder)
      newPerioder[i].periode.sluttdato = e
      setPerioder(newPerioder)
      // onValueChanged(`${personID}.XXX`, newPerioder)
      setCurrentSluttDato('')
    }
  }

  const setPensjonType = (e: string, i: number) => {
    if (i < 0) {
      setCurrentPensjonType(e)
    } else {
      const newPerioder = _.cloneDeep(_perioder)
      newPerioder[i].pensjonstype = e
      setPerioder(newPerioder)
      // onValueChanged(`${personID}.XXX`, newPerioder)
      setCurrentPensjonType('')
    }
  }

  const onRemove = (i: number) => {
    const newPerioder: Array<PensjonPeriode> = _.cloneDeep(_perioder)
    newPerioder.splice(i, 1)
    setPerioder(newPerioder)
  }

  const onAdd = () => {
    let newPerioder: Array<PensjonPeriode> = _.cloneDeep(_perioder)
    if (_.isNil(newPerioder)) {
      newPerioder = []
    }
    const newPeriode = {
      startdato: _currentStartDato
    } as Periode
    if (_currentSluttDato) {
      newPeriode.sluttdato = _currentSluttDato
    } else {
      newPeriode.aapenPeriodeType = 'åpen_sluttdato'
    }

    newPerioder = newPerioder.concat({
      pensjonstype: _currentPensjonType,
      periode: newPeriode
    })
    setPerioder(newPerioder)
    setSeeNewForm(!_seeNewForm)
  }

  const selectPensjonTypeOptions: Array<{label: string, value: PensjonType}> = [{
    label: t('elements:option-trygdeordning-alderspensjon'), value: 'alderspensjon'
  }, {
    label: t('elements:option-trygdeordning-uførhet'), value: 'uførhet'
  }]

  const getPensjonTypeOption = (value: string | undefined | null) => _.find(selectPensjonTypeOptions, s => s.value === value)

  const renderRow = (p: PensjonPeriode | undefined, i: number) => (
    <AlignEndRow>
      <Column>
        <HighContrastInput
          data-test-id={'c-familymanager-' + personID + '-personensstatus-selvstendig-' + i + '-startdato-input'}
          feil={validation['person-' + personID + '-personensstatus-selvstendig-' + i + '-startdato']
            ? validation['person-' + personID + '-personensstatus-selvstendig-' + i + '-startdato']!.feilmelding
            : undefined}
          id={'c-familymanager-' + personID + '-personensstatus-selvstendig-' + i + '-startdato-input'}
          onChange={(e: any) => setStartDato(e.target.value, i)}
          value={i < 0 ? _currentStartDato : p?.periode.startdato}
          label={t('label:start-date')}
          placeholder={t('elements:placeholder-date-default')}
        />
      </Column>
      <Column>
        <HighContrastInput
          data-test-id={'c-familymanager-' + personID + '-personensstatus-selvstendig-' + i + '-sluttdato-input'}
          feil={validation['person-' + personID + '-personensstatus-selvstendig-' + i + '-sluttdato']
            ? validation['person-' + personID + '-personensstatus-selvstendig-' + i + '-sluttdato']!.feilmelding
            : undefined}
          id={'c-familymanager-' + personID + '-personensstatus-selvstendig-' + i + '-sluttdato-input'}
          onChange={(e: any) => setSluttDato(e.target.value, i)}
          value={i < 0 ? _currentSluttDato : p?.periode.sluttdato}
          label={t('label:end-date')}
          placeholder={t('elements:placeholder-date-default')}
        />
      </Column>
      <Column>
        <Select
          data-test-id={'c-familymanager-' + personID + '-personensstatus-selvstendig-' + '-' + i + '-pensjontype-select'}
          error={validation['person-' + personID + '-personensstatus-selvstendig-' + '-' + i + '-pensjontype']
            ? validation['person-' + personID + '-personensstatus-selvstendig-' + '-' + i + '-pensjontype']!.feilmelding
            : undefined}
          highContrast={highContrast}
          id={'c-familymanager-' + personID + '-personensstatus-selvstendig-' + i + '-pensjontype-select'}
          onChange={(e: any) => setPensjonType(e.value, i)}
          options={selectPensjonTypeOptions}
          placeholder={t('elements:placeholder-select-default')}
          selectedValue={getPensjonTypeOption(i < 0 ? _currentPensjonType : (p as PensjonPeriode)?.pensjonstype)}
          defaultValue={getPensjonTypeOption(i < 0 ? _currentPensjonType : (p as PensjonPeriode)?.pensjonstype)}
        />
      </Column>
      <Column>
        <HighContrastFlatknapp
          mini
          kompakt
          onClick={() => i < 0 ? onAdd() : onRemove(i)}
        >
          {i < 0 ? <Add /> : <Trashcan />}
          <HorizontalSeparatorDiv data-size='0.5' />
          {i < 0 ? t('label:add') : t('label:remove')}
        </HighContrastFlatknapp>
      </Column>
    </AlignEndRow>
  )

  return (
    <>
      <Undertittel>
        {t('label:period-with-received-pension-from-sender-country')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {_perioder.map(renderRow)}
      <hr />
      {_seeNewForm && renderRow(undefined, -1)}
      <VerticalSeparatorDiv />
      <Row>
        <Column>
          <HighContrastFlatknapp
            mini
            kompakt
            onClick={() => setSeeNewForm(!_seeNewForm)}
          >
            <Add />
            <HorizontalSeparatorDiv data-size='0.5' />
            {t('label:add-new-periode')}
          </HighContrastFlatknapp>
        </Column>
      </Row>
    </>
  )
}

export default Op3Other
