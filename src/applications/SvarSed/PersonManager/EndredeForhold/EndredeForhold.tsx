import { Heading, Radio, RadioGroup } from '@navikt/ds-react'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import TextArea from 'components/Forms/TextArea'
import { TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { H001YtterligereInfo } from 'declarations/sed'
import _ from 'lodash'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

const mapState = (state: State): PersonManagerFormSelector => ({
  validation: state.validation.status
})

const EndredeForhold: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    validation
  } = useSelector<State, PersonManagerFormSelector>(mapState)
  const dispatch = useDispatch()
  const namespace = `${parentNamespace}-${personID}-endredeforhold`
  const target = 'ytterligereInfo'
  const ytterligereInfo : H001YtterligereInfo | undefined = _.get(replySed, target)

  const setVelg = (newVelg: string) => {
    dispatch(updateReplySed(`${target}.velg`, newVelg))
    if (validation[namespace + '-velg']) {
      dispatch(resetValidation(namespace + '-velg'))
    }
  }

  const setTekst = (newTekst: string) => {
    dispatch(updateReplySed(`${target}.tekst`, newTekst))
    if (validation[namespace + '-tekst']) {
      dispatch(resetValidation(namespace + '-tekst'))
    }
  }

  return (
    <PaddedDiv>
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <Heading size='small'>
            {t('label:ytterligere-informasjon_endrede_forhold')}
          </Heading>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      <RadioGroup
        legend=''
        data-test-id={namespace + 'velg'}
        key={namespace + '-velg-' + ytterligereInfo?.velg}
        id={namespace + '-velg'}
        error={validation[namespace + '-velg']?.feilmelding}
        value={ytterligereInfo?.velg}
        onChange={setVelg}
      >
        <Radio value='01'>
          {t('el:option-ytterligere-1')}
        </Radio>
        <Radio value='02'>
          {t('el:option-ytterligere-2')}
        </Radio>
      </RadioGroup>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.05s' }}>
        <Column>
          <TextAreaDiv>
            <TextArea
              namespace={namespace}
              error={validation[namespace + '-ytterligereInfo']?.feilmelding}
              id='ytterligereInfo'
              label={t('label:ytterligere-informasjon-til-sed')}
              onChanged={setTekst}
              value={ytterligereInfo?.tekst}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
    </PaddedDiv>
  )
}

export default EndredeForhold
