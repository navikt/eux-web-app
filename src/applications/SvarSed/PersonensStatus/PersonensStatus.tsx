import { Heading } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  PaddedDiv,
  RadioPanel,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { setValidation } from 'actions/validation'
import GrunnlagforBosetting from 'applications/SvarSed/GrunnlagForBosetting/GrunnlagForBosetting'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Ansatt from 'applications/SvarSed/PersonensStatus/Ansatt/Ansatt'
import Avsenderlandet from 'applications/SvarSed/PersonensStatus/Avsenderlandet/Avsenderlandet'
import NotAnsatt from 'applications/SvarSed/PersonensStatus/NotAnsatt/NotAnsatt'
import {
  validatePersonensStatusPerioder,
  ValidationPersonensStatusProps
} from 'applications/SvarSed/PersonensStatus/validation'
import WithSubsidies from 'applications/SvarSed/PersonensStatus/WithSubsidies/WithSubsidies'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { PersonTypeF001 } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
});

{/*TODO: REMOVE THIS FILE WHEN AKTIVITETOGTRYGDEPERIODER IS DONE*/}
const PersonensStatus: React.FC<MainFormProps> = ({
  label,
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
  const { validation } = useAppSelector(mapState)
  const dispatch = useDispatch()

  useUnmount(() => {
    const person: PersonTypeF001 = _.get(replySed, personID!)
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationPersonensStatusProps>(
      clonedValidation, namespace, validatePersonensStatusPerioder, {
        person,
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  return (
    <>
      <PaddedDiv>
        <Heading size='small'>
          {label}
        </Heading>
      </PaddedDiv>
      <VerticalSeparatorDiv />
      <PaddedDiv>
        <AlignStartRow>
          <Column>
            <RadioPanelGroup
              value={_arbeidsforhold}
              data-multiple-line
              data-no-border
              legend={t('label:arbeidsforhold-type')}
              data-testid={namespace + '-type'}
              id={namespace + '-type'}
              name={namespace + '-type'}
              onChange={setArbeidsforhold}
            >
              <RadioPanel value='arbeidsforhold-1'>{t('el:option-personensstatus-1')}</RadioPanel>
              <RadioPanel value='arbeidsforhold-2'>{t('el:option-personensstatus-2')}</RadioPanel>
              <RadioPanel value='arbeidsforhold-3'>{t('el:option-personensstatus-3')}</RadioPanel>
              <RadioPanel value='arbeidsforhold-4'>{t('el:option-personensstatus-4')}</RadioPanel>
              <RadioPanel value='arbeidsforhold-5'>{t('el:option-personensstatus-5')}</RadioPanel>
            </RadioPanelGroup>
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <HorizontalLineSeparator />
      </PaddedDiv>
      <VerticalSeparatorDiv />
      {_arbeidsforhold && (
        <>
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
          {(_arbeidsforhold !== 'arbeidsforhold-1' && _arbeidsforhold !== 'arbeidsforhold-2') && (
            <>
              <VerticalSeparatorDiv size='3' />

              <WithSubsidies
                parentNamespace={namespace}
                personID={personID}
                personName={personName}
                replySed={replySed}
                updateReplySed={updateReplySed}
                setReplySed={setReplySed}
              />

              <VerticalSeparatorDiv />
            </>
          )}
          <VerticalSeparatorDiv size='2' />

          <Avsenderlandet
            parentNamespace={namespace}
            personID={personID}
            personName={personName}
            replySed={replySed}
            updateReplySed={updateReplySed}
            setReplySed={setReplySed}
          />

          <VerticalSeparatorDiv size='2' />

          <GrunnlagforBosetting
            parentNamespace={namespace}
            personID={personID}
            personName={personName}
            replySed={replySed}
            updateReplySed={updateReplySed}
            setReplySed={setReplySed}
            standalone={false}
          />
        </>
      )}
    </>
  )
}

export default PersonensStatus
