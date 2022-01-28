import { Heading, Radio, RadioGroup } from '@navikt/ds-react'
import { setReplySed } from 'actions/svarsed'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import TextArea from 'components/Forms/TextArea'
import { TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { H001Sed } from 'declarations/sed'
import _ from 'lodash'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

export type Velg = 'anmodning' | 'melding' | undefined

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
  const [_velg, _setVelg] = useState<'anmodning' | 'melding' | undefined>(() => {
    if (!_.isEmpty((replySed as H001Sed).anmodning?.info)) {
      return 'anmodning'
    }
    if (!_.isEmpty((replySed as H001Sed).melding?.info)) {
      return 'melding'
    }
    return undefined
  })

  const setVelg = (newVelg: Velg) => {
    const newReplySed: H001Sed = _.cloneDeep(replySed) as H001Sed
    _setVelg(newVelg)
    if (newVelg === 'anmodning') {
      _.set(newReplySed, 'anmodning.info', _.get(newReplySed, 'melding.info'))
      if (!_.isEmpty(newReplySed?.melding?.info)) {
        delete newReplySed.melding.info
      }
    }
    if (newVelg === 'melding') {
      _.set(newReplySed, 'melding.info', _.get(newReplySed, 'anmodning.info'))
      if (!_.isEmpty(newReplySed?.anmodning?.info)) {
        delete newReplySed.anmodning.info
      }
    }
    dispatch(setReplySed(newReplySed))
    if (validation[namespace + '-velg']) {
      dispatch(resetValidation(namespace + '-velg'))
    }
  }

  const setTekst = (newTekst: string) => {
    dispatch(updateReplySed(`${_velg}.info`, newTekst))
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
        key={namespace + '-velg-' + _velg}
        id={namespace + '-velg'}
        error={validation[namespace + '-velg']?.feilmelding}
        value={_velg}
        onChange={(e: string) => setVelg(e as Velg)}
      >
        <Radio value='melding'>
          {t('el:option-ytterligere-1')}
        </Radio>
        <Radio value='anmodning'>
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
              value={_velg ? _.get(replySed, `${_velg}.info`) : ''}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
    </PaddedDiv>
  )
}

export default EndredeForhold
