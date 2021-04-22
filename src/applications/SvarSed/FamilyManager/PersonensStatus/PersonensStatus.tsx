import GrunnlagforBosetting from 'applications/SvarSed/FamilyManager/GrunnlagForBosetting/GrunnlagForBosetting'
import Ansatt from 'applications/SvarSed/FamilyManager/PersonensStatus/Ansatt'
import Avsenderlandet from 'applications/SvarSed/FamilyManager/PersonensStatus/Avsenderlandet'
import NotAnsatt from 'applications/SvarSed/FamilyManager/PersonensStatus/NotAnsatt'
import WithSubsidies from 'applications/SvarSed/FamilyManager/PersonensStatus/WithSubsidies'
import LesMer from 'components/LesMer/LesMer'
import { AlignStartRow, PaddedDiv } from 'components/StyledComponents'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastRadioPanelGroup, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface PersonensStatusProps {
  arbeidsforholdList: any
  getArbeidsforholdList: (fnr: string | undefined) => void,
  gettingArbeidsforholdList: boolean
  highContrast: boolean
  personID: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const PersonensStatus: React.FC<PersonensStatusProps> = ({
  arbeidsforholdList,
  getArbeidsforholdList,
  gettingArbeidsforholdList,
  highContrast,
  personID,
  replySed,
  resetValidation,
  updateReplySed,
  validation
}:PersonensStatusProps): JSX.Element => {
  const { t } = useTranslation()
  const namespace = `familymanager-${personID}-personensstatus`

  const [_arbeidsforhold, setArbeidsforhold] = useState<string>('')

  return (
    <PaddedDiv>
      <AlignStartRow className='slideInFromLeft'>
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
                    moreText={t('label:vis-mer')}
                    lessText={t('label:se-mindre')}
                  />),
                value: 'arbeidsforhold-3'
              },
              { label: t('el:option-personensstatus-4'), value: 'arbeidsforhold-4' },
              {
                label: (
                  <LesMer
                    visibleText={t('el:option-personensstatus-5')}
                    invisibleText={t('el:option-personensstatus-5-more')}
                    moreText={t('label:vis-mer')}
                    lessText={t('label:se-mindre')}
                  />),
                value: 'arbeidsforhold-5'
              }
            ]}
            onChange={(e: any) => setArbeidsforhold(e.target.value)}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      {_arbeidsforhold && (
        <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
          <Column>
            {_arbeidsforhold === 'arbeidsforhold-1'
              ? (
                <Ansatt
                  arbeidsforholdList={arbeidsforholdList}
                  getArbeidsforholdList={getArbeidsforholdList}
                  gettingArbeidsforholdList={gettingArbeidsforholdList}
                  replySed={replySed}
                  personID={personID}
                  updateReplySed={updateReplySed}
                />
                )
              : (
                <NotAnsatt
                  personID={personID}
                  replySed={replySed}
                  resetValidation={resetValidation}
                  updateReplySed={updateReplySed}
                  validation={validation}
                />
                )}
          </Column>
        </AlignStartRow>
      )}
      {_arbeidsforhold && (_arbeidsforhold !== 'arbeidsforhold-1' && _arbeidsforhold !== 'arbeidsforhold-2') && (
        <>
          <VerticalSeparatorDiv data-size='2' />
          <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
            <Column>
              <WithSubsidies
                highContrast={highContrast}
                personID={personID}
                replySed={replySed}
                resetValidation={resetValidation}
                updateReplySed={updateReplySed}
                validation={validation}
              />
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
        </>
      )}
      {_arbeidsforhold && (
        <>
          <VerticalSeparatorDiv data-size='2' />
          <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.3s' }}>
            <Column>
              <Avsenderlandet
                personID={personID}
                replySed={replySed}
                resetValidation={resetValidation}
                updateReplySed={updateReplySed}
                validation={validation}
              />
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv data-size='2' />
          <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.4s' }}>
            <Column>
              <GrunnlagforBosetting
                personID={personID}
                replySed={replySed}
                resetValidation={resetValidation}
                updateReplySed={updateReplySed}
                validation={validation}
              />
            </Column>
          </AlignStartRow>
        </>
      )}
    </PaddedDiv>
  )
}

export default PersonensStatus
