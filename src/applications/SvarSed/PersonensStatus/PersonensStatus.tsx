import GrunnlagforBosetting from 'applications/SvarSed/GrunnlagForBosetting/GrunnlagForBosetting'
import Ansatt from 'applications/SvarSed/PersonensStatus/Ansatt'
import Avsenderlandet from 'applications/SvarSed/PersonensStatus/Avsenderlandet'
import NotAnsatt from 'applications/SvarSed/PersonensStatus/NotAnsatt'
import WithSubsidies from 'applications/SvarSed/PersonensStatus/WithSubsidies'
import { MainFormProps } from 'applications/SvarSed/MainForm'
import LesMer from 'components/LesMer/LesMer'
import { Heading } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  RadioPanelGroup,
  PaddedDiv,
  VerticalSeparatorDiv,
  RadioPanel
} from '@navikt/hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const PersonensStatus: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed,
  setReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const namespace = `${parentNamespace}-${personID}-personensstatus`

  const [_arbeidsforhold, setArbeidsforhold] = useState<string>('')

  return (
    <PaddedDiv>
      <Heading size='small'>
        {t('label:arbeidsforhold-type')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column>
          <RadioPanelGroup
            value={_arbeidsforhold}
            data-multiple-line
            data-no-border
            data-testid={namespace + '-type'}
            id={namespace + '-type'}
            name={namespace + '-type'}
            onChange={setArbeidsforhold}
          >

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

          </RadioPanelGroup>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      {_arbeidsforhold && (
        <AlignStartRow>
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
          <AlignStartRow>
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
          <AlignStartRow>
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
          <AlignStartRow>
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