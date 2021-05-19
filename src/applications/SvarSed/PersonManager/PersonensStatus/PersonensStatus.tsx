import GrunnlagforBosetting from 'applications/SvarSed/PersonManager/GrunnlagForBosetting/GrunnlagForBosetting'
import Ansatt from 'applications/SvarSed/PersonManager/PersonensStatus/Ansatt'
import Avsenderlandet from 'applications/SvarSed/PersonManager/PersonensStatus/Avsenderlandet'
import NotAnsatt from 'applications/SvarSed/PersonManager/PersonensStatus/NotAnsatt'
import WithSubsidies from 'applications/SvarSed/PersonManager/PersonensStatus/WithSubsidies'
import { PersonManagerFormProps } from 'applications/SvarSed/PersonManager/PersonManager'
import LesMer from 'components/LesMer/LesMer'
import { Undertittel } from 'nav-frontend-typografi'
import { AlignStartRow, Column, HighContrastRadioPanelGroup, PaddedDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const PersonensStatus: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  personName
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const namespace = `${parentNamespace}-${personID}-personensstatus`

  const [_arbeidsforhold, setArbeidsforhold] = useState<string>('')

  return (
    <PaddedDiv>
      <Undertittel>
        {t('label:arbeidsforhold-type')}
      </Undertittel>
      <VerticalSeparatorDiv size='2'/>
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <HighContrastRadioPanelGroup
            checked={_arbeidsforhold}
            data-multiple-line
            data-no-border
            data-test-id={namespace + '-type'}
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
      <VerticalSeparatorDiv size='2' />
      {_arbeidsforhold && (
        <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
          <Column>
            {_arbeidsforhold === 'arbeidsforhold-1'
              ? (
                <Ansatt
                  parentNamespace={namespace}
                  personID={personID}
                  personName={personName}
                />
                )
              : (
                <NotAnsatt
                  parentNamespace={namespace}
                  personID={personID}
                  personName={personName}
                />
                )}
          </Column>
        </AlignStartRow>
      )}
      {_arbeidsforhold && (_arbeidsforhold !== 'arbeidsforhold-1' && _arbeidsforhold !== 'arbeidsforhold-2') && (
        <>
          <VerticalSeparatorDiv size='3' />
          <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
            <Column>
              <WithSubsidies
                parentNamespace={namespace}
                personID={personID}
                personName={personName}
              />
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
        </>
      )}
      {_arbeidsforhold && (
        <>
          <VerticalSeparatorDiv size='2' />
          <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.3s' }}>
            <Column>
              <Avsenderlandet
                parentNamespace={namespace}
                personID={personID}
                personName={personName}
              />
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv size='2' />
          <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.4s' }}>
            <Column>
              <GrunnlagforBosetting
                parentNamespace={namespace}
                personID={personID}
                personName={personName}
              />
            </Column>
          </AlignStartRow>
        </>
      )}
    </PaddedDiv>
  )
}

export default PersonensStatus
