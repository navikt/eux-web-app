import Tilsette from 'assets/icons/Tilsette'
import Trashcan from 'assets/icons/Trashcan'
import Select from 'components/Select/Select'
import { Option } from 'declarations/app'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Feilmelding, Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  HighContrastFlatknapp,
  HighContrastKnapp,
  HorizontalSeparatorDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

interface PurposeProps {
  feil: FeiloppsummeringFeil | undefined
  highContrast: boolean
  initialPurposes: Array<string>
  onPurposeChange?: (e: Array<string>) => void
}

const Purpose: React.FC<PurposeProps> = ({
  feil,
  highContrast,
  initialPurposes = [],
  onPurposeChange
}: PurposeProps) => {
  const { t } = useTranslation()
  const purposeOptions = [{
    label: t('ui:option-purpose-1'), value: t('ui:option-purpose-1')
  }, {
    label: t('ui:option-purpose-2'), value: t('ui:option-purpose-2')
  }, {
    label: t('ui:option-purpose-3'), value: t('ui:option-purpose-3')
  }, {
    label: t('ui:option-purpose-4'), value: t('ui:option-purpose-4')
  }, {
    label: t('ui:option-purpose-5'), value: t('ui:option-purpose-5')
  }, {
    label: t('ui:option-purpose-6'), value: t('ui:option-purpose-6')
  }, {
    label: t('ui:option-purpose-7'), value: t('ui:option-purpose-7')
  }, {
    label: t('ui:option-purpose-8'), value: t('ui:option-purpose-8')
  }]
  const [_addPurpose, setAddPurpose] = useState<boolean>(false)
  const [_newPurpose, setNewPurpose] = useState<Option | undefined>(undefined)
  const [_purposes, setPurposes] = useState<Array<string>>(initialPurposes)
  const [_purposeValues, setPurposeValues] = useState<Array<Option>>(
    _.filter(purposeOptions, p => initialPurposes.indexOf(p.value) < 0)
  )

  const onRemovePurpose = (f: any) => {
    const newPurpose = _.filter(_purposes, _f => _f !== f)
    const newPurposeValues = _.filter(purposeOptions, p => newPurpose.indexOf(p.value) < 0)
    setPurposes(newPurpose)
    setPurposeValues(newPurposeValues)
    if (onPurposeChange) {
      onPurposeChange(newPurpose)
    }
  }

  const onPurposeChanged = (o: Option) => {
    setNewPurpose(o)
  }

  const onAddPurpose = () => {
    if (_newPurpose) {
      const newPurpose = _purposes.concat(_newPurpose.value)
      const newPurposeValues = _.filter(purposeOptions, p => newPurpose.indexOf(p.value) < 0)
      setPurposes(newPurpose)
      setPurposeValues(newPurposeValues)
      setNewPurpose(undefined)
      if (onPurposeChange) {
        onPurposeChange(newPurpose)
      }
    }
  }

  return (
    <>
      <Undertittel>
        {t('ui:label-choosePurpose')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {_purposes && _purposes.map(f => (
        <FlexDiv
          key={f}
        >
          <Normaltekst>
            {f}
          </Normaltekst>
          <HighContrastFlatknapp
            mini
            kompakt
            onClick={() => onRemovePurpose(f)}
          >
            <Trashcan />
            <HorizontalSeparatorDiv data-size='0.5' />
            {t('ui:label-remove')}
          </HighContrastFlatknapp>
        </FlexDiv>
      ))}
      <VerticalSeparatorDiv />
      {!_addPurpose
        ? (
          <>
            <HighContrastFlatknapp
              mini
              kompakt
              onClick={() => setAddPurpose(!_addPurpose)}
            >
              <Tilsette />
              <HorizontalSeparatorDiv data-size='0.5' />
              {t('ui:label-add-new-purpose')}
            </HighContrastFlatknapp>
          </>
          )
        : (
          <FlexDiv>
            <div style={{ flex: 2 }}>
              <Select
                data-test-id='c-purpose-select'
                id='c-purpose-select'
                highContrast={highContrast}
                value={_newPurpose}
                onChange={onPurposeChanged}
                options={_purposeValues}
              />
            </div>
            <HorizontalSeparatorDiv data-size='0.5' />
            <FlexDiv>
              <HighContrastKnapp
                mini
                kompakt
                onClick={onAddPurpose}
              >
                <Tilsette />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('ui:label-add')}
              </HighContrastKnapp>
              <HorizontalSeparatorDiv data-size='0.5' />
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => setAddPurpose(!_addPurpose)}
              >
                {t('ui:label-cancel')}
              </HighContrastFlatknapp>
            </FlexDiv>
          </FlexDiv>
          )}
      {feil && (
        <div role='alert' aria-live='assertive' className='feilmelding skjemaelement__feilmelding'>
          <Feilmelding>
            {feil.feilmelding}
          </Feilmelding>
        </div>
      )}
    </>
  )
}

export default Purpose
