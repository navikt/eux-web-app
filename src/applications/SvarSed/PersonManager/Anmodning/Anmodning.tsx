import { Heading } from '@navikt/ds-react'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import TextArea from 'components/Forms/TextArea'
import { TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { H001Svar } from 'declarations/sed'
import _ from 'lodash'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

const mapState = (state: State): PersonManagerFormSelector => ({
  validation: state.validation.status
})

const Anmodning: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
}: PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useSelector<State, PersonManagerFormSelector>(mapState)
  const dispatch = useDispatch()
  const namespace = `${parentNamespace}-${personID}-anmodning`
  const target = 'anmodning'
  const anmodning: H001Svar | undefined = _.get(replySed, target)

  const setDokument = (newDokument: string) => {
    dispatch(updateReplySed('dokumentasjon.dokument', newDokument))
    if (validation[namespace + '-dokument']) {
      dispatch(resetValidation(namespace + '-dokument'))
    }
  }

  const setInformasjon = (newInformasjon: string) => {
    dispatch(updateReplySed('dokumentasjon.informasjon', newInformasjon))
    if (validation[namespace + '-informasjon']) {
      dispatch(resetValidation(namespace + '-informasjon'))
    }
  }

  const setSed = (newSed: string) => {
    dispatch(updateReplySed('dokumentasjon.sed', newSed))
    if (validation[namespace + '-sed']) {
      dispatch(resetValidation(namespace + '-sed'))
    }
  }

  return (
    <PaddedDiv>
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <Heading size='small'>
            {t('label:anmodning-om-informasjon')}
          </Heading>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.05s' }}>
        <Column>
          <TextAreaDiv>
            <TextArea
              maxLength={255}
              error={validation[namespace + '-dokument']?.feilmelding}
              namespace={namespace}
              id='dokument'
              label={t('label:vi-vedlegger-dokumenter')}
              onChanged={setDokument}
              value={anmodning?.dokumentasjon?.dokument ?? ''}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column>
          <TextAreaDiv>
            <TextArea
              maxLength={500}
              error={validation[namespace + '-informasjon']?.feilmelding}
              namespace={namespace}
              id='informasjon'
              label={t('label:vi-sender-informasjon')}
              onChanged={setInformasjon}
              value={anmodning?.dokumentasjon?.informasjon ?? ''}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.15s' }}>
        <Column>
          <TextAreaDiv>
            <TextArea
              maxLength={65}
              error={validation[namespace + '-sed']?.feilmelding}
              namespace={namespace}
              id='sed'
              label={t('label:sed')}
              onChanged={setSed}
              value={anmodning?.dokumentasjon?.sed ?? ''}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
    </PaddedDiv>
  )
}

export default Anmodning
