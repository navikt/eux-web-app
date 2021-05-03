import GrunnlagforBosetting from 'applications/SvarSed/PersonManager/GrunnlagForBosetting/GrunnlagForBosetting'
import Ansatt from 'applications/SvarSed/PersonManager/PersonensStatus/Ansatt'
import Avsenderlandet from 'applications/SvarSed/PersonManager/PersonensStatus/Avsenderlandet'
import NotAnsatt from 'applications/SvarSed/PersonManager/PersonensStatus/NotAnsatt'
import WithSubsidies from 'applications/SvarSed/PersonManager/PersonensStatus/WithSubsidies'
import LesMer from 'components/LesMer/LesMer'
import { AlignStartRow, PaddedDiv } from 'components/StyledComponents'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastRadioPanelGroup, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface PersonensStatusProps {
  arbeidsperioder: any
  getArbeidsperioder: () => void,
  gettingArbeidsperioder: boolean
  highContrast: boolean
  parentNamespace: string,
  personID: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const PersonensStatus: React.FC<PersonensStatusProps> = ({
  arbeidsperioder,
  getArbeidsperioder,
  gettingArbeidsperioder,
  highContrast,
  parentNamespace,
  personID,
  replySed,
  resetValidation,
  updateReplySed,
  validation
}:PersonensStatusProps): JSX.Element => {
  const { t } = useTranslation()
  const namespace = `${parentNamespace}-${personID}-personensstatus`

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
            data-test-id={namespace + '-type'}
            feil={validation[namespace + '-type']?.feilmelding}
            id={namespace + '-type'}
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArbeidsforhold(e.target.value)}
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
                  arbeidsperioder={arbeidsperioder}
                  getArbeidsperioder={getArbeidsperioder}
                  gettingArbeidsperioder={gettingArbeidsperioder}
                  parentNamespace={namespace}
                  replySed={replySed}
                  personID={personID}
                  updateReplySed={updateReplySed}
                />
                )
              : (
                <NotAnsatt
                  personID={personID}
                  replySed={replySed}
                  parentNamespace={namespace}
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
          <VerticalSeparatorDiv data-size='3' />
          <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
            <Column>
              <WithSubsidies
                highContrast={highContrast}
                parentNamespace={namespace}
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
          <VerticalSeparatorDiv data-size='3' />
          <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.3s' }}>
            <Column>
              <Avsenderlandet
                parentNamespace={namespace}
                personID={personID}
                replySed={replySed}
                resetValidation={resetValidation}
                updateReplySed={updateReplySed}
                validation={validation}
              />
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv data-size='3' />
          <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.4s' }}>
            <Column>
              <GrunnlagforBosetting
                parentNamespace={namespace}
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
