import Ansatt from 'applications/SvarSed/FamilyManager/Arbeidsforhold/Ansatt'
import Avsenderlandet from 'applications/SvarSed/FamilyManager/Arbeidsforhold/Avsenderlandet'
import NotAnsatt from 'applications/SvarSed/FamilyManager/Arbeidsforhold/NotAnsatt'
import WithSubsidies from 'applications/SvarSed/FamilyManager/Arbeidsforhold/WithSubsidies'
import GrunnlagforBosetting from 'applications/SvarSed/FamilyManager/GrunnlagForBosetting/GrunnlagForBosetting'
import LesMer from 'components/LesMer/LesMer'
import { AlignStartRow, PaddedDiv } from 'components/StyledComponents'
import { Periode, ReplySed } from 'declarations/sed'
import { Arbeidsforholdet, Validation } from 'declarations/types'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastRadioPanelGroup, VerticalSeparatorDiv } from 'nav-hoykontrast'
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
  onValueChanged,
  validation,
  gettingArbeidsforholdList,
  personID,
  replySed,
  getArbeidsforholdList,
  arbeidsforholdList
}:PersonensStatusProps): JSX.Element => {
  const [_arbeidsforhold, setArbeidsforhold] = useState<string>('')
  const { t } = useTranslation()

  const namespace = `familymanager-${personID}-personensstatus`
  const target = `${personID}.aktivitet.perioderMedAktivitet.perioder`

  const onArbeidsforholdSelectionChange = (selectedArbeidsforhold: Array<Arbeidsforholdet>) => {
    const perioder: Array<Periode> = selectedArbeidsforhold.map(a => {
      return {
        startdato: a.fraDato,
        sluttdato: a.tilDato
      }
    })
    onValueChanged(target, {
      type: 'ansatt',
      perioder: perioder
    })
  }

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
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column>
          {_arbeidsforhold === 'arbeidsforhold-1'
            ? (
              <Ansatt
                arbeidsforholdList={arbeidsforholdList}
                getArbeidsforholdList={getArbeidsforholdList}
                gettingArbeidsforholdList={gettingArbeidsforholdList}
                onArbeidsforholdSelectionChange={onArbeidsforholdSelectionChange}
                replySed={replySed}
                personID={personID}
              />
              )
            : (
              <NotAnsatt
                personID={personID}
                validation={validation}
              />
              )}
        </Column>
      </AlignStartRow>
      {(_arbeidsforhold !== 'arbeidsforhold-1' && _arbeidsforhold !== 'arbeidsforhold-2') && (
        <>
          <VerticalSeparatorDiv data-size='2' />
          <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
            <Column>
              <WithSubsidies
                highContrast={highContrast}
                personID={personID}
                validation={validation}
              />
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
        </>
      )}
      <VerticalSeparatorDiv data-size='2' />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.3s' }}>
        <Column>
          <Avsenderlandet
            personID={personID}
            replySed={replySed}
            validation={validation}
            onValueChanged={onValueChanged}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv data-size='2' />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.4s' }}>
        <Column>
          <GrunnlagforBosetting
            personID={personID}
            replySed={replySed}
            validation={validation}
            onValueChanged={onValueChanged}
          />
        </Column>
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default PersonensStatus
