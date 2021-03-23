import Avsenderlandet from 'components/FamilyManager/Arbeidsforhold/Avsenderlandet'
import Op1Ansatt from 'components/FamilyManager/Arbeidsforhold/Op1Ansatt'
import Op2Selvstendig from 'components/FamilyManager/Arbeidsforhold/Op2Selvstendig'
import Op3Other from 'components/FamilyManager/Arbeidsforhold/Op3Other'
import ReasonToCome from 'components/FamilyManager/Arbeidsforhold/ReasonToCome'
import LesMer from 'components/LesMer/LesMer'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastRadioPanelGroup, Row, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface PersonensStatusProps {
  gettingArbeidsforholdList: boolean
  highContrast: boolean
  onValueChanged: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation,

  getArbeidsforholdList: (fnr: string | undefined) => void,
  arbeidsforholdList: any
}
const PersonensStatusDiv = styled.div`
  padding: 1rem;
  fieldset {
    width: 100%;
  }
`

const PersonensStatus: React.FC<PersonensStatusProps> = ({
  // highContrast,
  // onValueChanged,
  validation,
  gettingArbeidsforholdList,
  personID,
  replySed,
  getArbeidsforholdList,
  arbeidsforholdList
}:PersonensStatusProps): JSX.Element => {
  const [_arbeidsforhold, setArbeidsforhold] = useState<string>('')
  const [_isDirty, setIsDirty] = useState<boolean>(false)

  const { t } = useTranslation()

  const onArbeidsforholdChanged = (e: string) => {
    setIsDirty(true)
    setArbeidsforhold(e)
  }

  return (
    <PersonensStatusDiv>
      <Row>
        <Column>
          <Undertittel>
            {t('label:arbeidsforhold-type')}
          </Undertittel>
          <VerticalSeparatorDiv />
          <HighContrastRadioPanelGroup
            data-multiple-line='true'
            data-no-border='true'
            checked={_arbeidsforhold}
            data-test-id='c-familymanager-personenstatus-arbeidsforhold-radiogroup'
            id='c-familymanager-personenstatus-arbeidsforhold-radiogroup'
            feil={undefined}
            name='c-familymanager-personenstatus-arbeidsforhold-radiogroup'
            radios={[
              { label: t('elements:option-personensstatus-1'), value: 'arbeidsforhold-1' },
              { label: t('elements:option-personensstatus-2'), value: 'arbeidsforhold-2' },
              {
                label: (
                  <LesMer
                    visibleText={t('elements:option-personensstatus-3')}
                    invisibleText={t('elements:option-personensstatus-3-more')}
                    moreText={t('label:see-more')}
                    lessText={t('label:see-less')}
                  />),
                value: 'arbeidsforhold-3'
              },
              { label: t('elements:option-personensstatus-4'), value: 'arbeidsforhold-4' },
              {
                label: (
                  <LesMer
                    visibleText={t('elements:option-personensstatus-5')}
                    invisibleText={t('elements:option-personensstatus-5-more')}
                    moreText={t('label:see-more')}
                    lessText={t('label:see-less')}
                  />),
                value: 'arbeidsforhold-5'
              }
            ]}
            onChange={(e: any) => onArbeidsforholdChanged(e.target.value)}
          />
        </Column>
      </Row>
      {_arbeidsforhold === 'arbeidsforhold-1' && (
        <Op1Ansatt
          arbeidsforholdList={arbeidsforholdList}
          getArbeidsforholdList={getArbeidsforholdList}
          gettingArbeidsforholdList={gettingArbeidsforholdList}
          replySed={replySed}
          personID={personID}
          validation={validation}
        />
      )}
      {(_arbeidsforhold !== 'arbeidsforhold-1') && (
        <Op2Selvstendig
          arbeidsforholdList={arbeidsforholdList}
          getArbeidsforholdList={getArbeidsforholdList}
          gettingArbeidsforholdList={gettingArbeidsforholdList}
          replySed={replySed}
          personID={personID}
          validation={validation}
        />
      )}
      {(_arbeidsforhold !== 'arbeidsforhold-1' && _arbeidsforhold !== 'arbeidsforhold-2') && (
        <Op3Other
          arbeidsforholdList={arbeidsforholdList}
          getArbeidsforholdList={getArbeidsforholdList}
          gettingArbeidsforholdList={gettingArbeidsforholdList}
          replySed={replySed}
          personID={personID}
          validation={validation}
        />
      )}
      <>
        <VerticalSeparatorDiv data-size='2' />
        <Avsenderlandet
          personID={personID}
          validation={validation}
        />
        <VerticalSeparatorDiv data-size='2' />
        <ReasonToCome
          personID={personID}
          validation={validation}
        />
      </>

      {_isDirty && '*'}
    </PersonensStatusDiv>
  )
}

export default PersonensStatus
