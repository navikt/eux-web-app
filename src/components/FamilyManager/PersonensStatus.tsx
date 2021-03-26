import Ansatt from 'components/FamilyManager/Arbeidsforhold/Ansatt'
import Avsenderlandet from 'components/FamilyManager/Arbeidsforhold/Avsenderlandet'
import NotAnsatt from 'components/FamilyManager/Arbeidsforhold/NotAnsatt'
import ReasonToCome from 'components/FamilyManager/Arbeidsforhold/ReasonToCome'
import WithSubsidies from 'components/FamilyManager/Arbeidsforhold/WithSubsidies'
import LesMer from 'components/LesMer/LesMer'
import { PaddedDiv } from 'components/StyledComponents'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastRadioPanelGroup, Row, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

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

const PersonensStatus: React.FC<PersonensStatusProps> = ({
  highContrast,
  // onValueChanged,
  validation,
  gettingArbeidsforholdList,
  personID,
  replySed,
  getArbeidsforholdList,
  arbeidsforholdList
}:PersonensStatusProps): JSX.Element => {
  const [_arbeidsforhold, setArbeidsforhold] = useState<string>('')
  const { t } = useTranslation()
  const namespace = 'familymanager-' + personID + '-personensstatus'
  return (
    <PaddedDiv>
      <Row className='slideInFromLeft'>
        <Column>
          <Undertittel>
            {t('el:title-arbeidsforhold-type')}
          </Undertittel>
          <VerticalSeparatorDiv />
          <HighContrastRadioPanelGroup
            checked={_arbeidsforhold}
            data-multiple-line
            data-no-border
            data-test-id={'c-' + namespace + '-type-text'}
            feil={validation[namespace + '-type']?.feilmelding}
            id={'c-' + namespace + '-type-text'}
            name={namespace + '-type'}
            radios={[
              { label: t('el:option-personensstatus-1'), value: 'arbeidsforhold-1' },
              { label: t('el:option-personensstatus-2'), value: 'arbeidsforhold-2' },
              {
                label: (
                  <LesMer
                    visibleText={t('el:option-personensstatus-3')}
                    invisibleText={t('el:option-personensstatus-3-more')}
                    moreText={t('label:see-more')}
                    lessText={t('label:see-less')}
                  />),
                value: 'arbeidsforhold-3'
              },
              { label: t('el:option-personensstatus-4'), value: 'arbeidsforhold-4' },
              {
                label: (
                  <LesMer
                    visibleText={t('el:option-personensstatus-5')}
                    invisibleText={t('el:option-personensstatus-5-more')}
                    moreText={t('label:see-more')}
                    lessText={t('label:see-less')}
                  />),
                value: 'arbeidsforhold-5'
              }
            ]}
            onChange={(e: any) => setArbeidsforhold(e.target.value)}
          />
        </Column>
      </Row>
      {_arbeidsforhold === 'arbeidsforhold-1' && (
        <Ansatt
          arbeidsforholdList={arbeidsforholdList}
          getArbeidsforholdList={getArbeidsforholdList}
          gettingArbeidsforholdList={gettingArbeidsforholdList}
          replySed={replySed}
          personID={personID}
        />
      )}
      {(_arbeidsforhold !== 'arbeidsforhold-1') && (
        <NotAnsatt
          personID={personID}
          validation={validation}
        />
      )}
      {(_arbeidsforhold !== 'arbeidsforhold-1' && _arbeidsforhold !== 'arbeidsforhold-2') && (
        <WithSubsidies
          highContrast={highContrast}
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
    </PaddedDiv>
  )
}

export default PersonensStatus
