import Tilsette from 'assets/icons/Tilsette'
import Trashcan from 'assets/icons/Trashcan'
import _ from 'lodash'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  HighContrastFlatknapp,
  HighContrastInput,
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
  initialPurposes: Array<string>
  onPurposeChange?: (e: Array<string>) => void
}

const Purpose: React.FC<PurposeProps> = ({
  initialPurposes = [],
  onPurposeChange
}: PurposeProps) => {
  const [_addFormal, setAddFormal] = useState<boolean>(false)
  const [_newFormal, setNewFormal] = useState<string>('')
  const [_formal, setFormal] = useState<Array<string>>(initialPurposes)
  const { t } = useTranslation()

  const onRemoveFormal = (f: any) => {
    const newFormal = _.filter(_formal, _f => _f !== f)
    setFormal(newFormal)
    if (onPurposeChange) {
      onPurposeChange(newFormal)
    }
  }

  const onAddFormal = () => {
    const newFormal = _formal.concat(_newFormal)
    setFormal(newFormal)
    setNewFormal('')
    if (onPurposeChange) {
      onPurposeChange(newFormal)
    }
  }

  return (
    <>
      <Undertittel>
        {t('ui:label-choosePurpose')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {_formal && _formal.map(f => (
        <FlexDiv
          key={f}
        >
          <Normaltekst>
            {f}
          </Normaltekst>
          <HighContrastFlatknapp
            mini
            kompakt
            onClick={() => onRemoveFormal(f)}
          >
            <Trashcan />
            <HorizontalSeparatorDiv data-size='0.5' />
            {t('ui:form-remove')}
          </HighContrastFlatknapp>
        </FlexDiv>
      ))}
      {!_addFormal
        ? (
          <>
            <HighContrastFlatknapp
              onClick={() => setAddFormal(!_addFormal)}
            >
              <Tilsette />
              <HorizontalSeparatorDiv data-size='0.5' />
              {t('ui:form-addPurpose')}
            </HighContrastFlatknapp>
          </>
        )
        : (
          <FlexDiv>
            <div style={{ flex: 2 }}>
              <HighContrastInput
                bredde='fullbredde'
                value={_newFormal}
                onChange={(e: any) => setNewFormal(e.target.value)}
              />
            </div>
            <HorizontalSeparatorDiv data-size='0.5' />
            <FlexDiv>
              <HighContrastKnapp
                mini
                kompakt
                onClick={onAddFormal}
              >
                <Tilsette />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('ui:form-add')}
              </HighContrastKnapp>
              <HorizontalSeparatorDiv data-size='0.5' />
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => setAddFormal(!_addFormal)}
              >
                {t('ui:form-cancel')}
              </HighContrastFlatknapp>
            </FlexDiv>
          </FlexDiv>
        )}
      </>
  )
}

export default Purpose
