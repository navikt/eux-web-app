import GrunnlagforBosetting from 'applications/SvarSed/PersonManager/GrunnlagForBosetting/GrunnlagForBosetting'
import Ansatt from 'applications/SvarSed/PersonManager/PersonensStatus/Ansatt'
import Avsenderlandet from 'applications/SvarSed/PersonManager/PersonensStatus/Avsenderlandet'
import NotAnsatt from 'applications/SvarSed/PersonManager/PersonensStatus/NotAnsatt'
import WithSubsidies from 'applications/SvarSed/PersonManager/PersonensStatus/WithSubsidies'
import { PersonManagerFormProps } from 'applications/SvarSed/PersonManager/PersonManager'
import LesMer from 'components/LesMer/LesMer'
import { Heading } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  RadioPanelGroup,
  PaddedDiv,
  VerticalSeparatorDiv,
  FlexRadioPanels, RadioPanel
} from '@navikt/hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const PersonensStatus: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed,
  setReplySed
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const namespace = `${parentNamespace}-${personID}-personensstatus`

  const [_arbeidsforhold, setArbeidsforhold] = useState<string>('')

  return (
    <PaddedDiv>
      <Heading size='small'>
        {t('label:arbeidsforhold-type')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <RadioPanelGroup
            value={_arbeidsforhold}
            data-multiple-line
            data-no-border
            data-test-id={namespace + '-type'}
            id={namespace + '-type'}
            name={namespace + '-type'}
            onChange={setArbeidsforhold}
          >
            <FlexRadioPanels>
              <RadioPanel value='arbeidsforhold-1'>{t('el:option-personensstatus-1')}</RadioPanel>
              <RadioPanel value='arbeidsforhold-2'>{t('el:option-personensstatus-2')}</RadioPanel>
              <RadioPanel value='arbeidsforhold-3'>
                <LesMer
                  visibleText={t('el:option-personensstatus-3')}
                  invisibleText={t('el:option-personensstatus-3-more')}
                  moreText={t('label:vis-mer')}
                  lessText={t('label:se-mindre')}
                />
              </RadioPanel>
              <RadioPanel value='arbeidsforhold-4'>{t('el:option-personensstatus-4')}</RadioPanel>
              <RadioPanel value='arbeidsforhold-5'>
                <LesMer
                  visibleText={t('el:option-personensstatus-5')}
                  invisibleText={t('el:option-personensstatus-5-more')}
                  moreText={t('label:vis-mer')}
                  lessText={t('label:se-mindre')}
                />
              </RadioPanel>
            </FlexRadioPanels>
          </RadioPanelGroup>
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
                  replySed={replySed}
                  updateReplySed={updateReplySed}
                  setReplySed={setReplySed}
                />
                )
              : (
                <NotAnsatt
                  arbeidsforhold={_arbeidsforhold}
                  parentNamespace={namespace}
                  personID={personID}
                  personName={personName}
                  replySed={replySed}
                  updateReplySed={updateReplySed}
                  setReplySed={setReplySed}
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
                replySed={replySed}
                updateReplySed={updateReplySed}
                setReplySed={setReplySed}
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
                replySed={replySed}
                updateReplySed={updateReplySed}
                setReplySed={setReplySed}
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
                replySed={replySed}
                updateReplySed={updateReplySed}
                setReplySed={setReplySed}
                standalone={false}
              />
            </Column>
          </AlignStartRow>
        </>
      )}
    </PaddedDiv>
  )
}

export default PersonensStatus
