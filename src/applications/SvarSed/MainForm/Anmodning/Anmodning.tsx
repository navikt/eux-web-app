import { Heading } from '@navikt/ds-react'
import { resetValidation } from 'actions/validation'
import { TwoLevelFormProps, TwoLevelFormSelector } from 'applications/SvarSed/TwoLevelForm'
import TextArea from 'components/Forms/TextArea'
import { TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { H001Svar, ReplySed } from 'declarations/sed'
import _ from 'lodash'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'

const mapState = (state: State): TwoLevelFormSelector => ({
  validation: state.validation.status
})

const Anmodning: React.FC<TwoLevelFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
}: TwoLevelFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-anmodning`
  const target = 'anmodning'
  const anmodning: H001Svar | undefined = _.get(replySed, target)

  const setDokument = (newDokument: string) => {
    dispatch(updateReplySed(`${target}.dokumentasjon.dokument`, newDokument))
    if (validation[namespace + '-dokument']) {
      dispatch(resetValidation(namespace + '-dokument'))
    }
  }

  const setInformasjon = (newInformasjon: string) => {
    dispatch(updateReplySed(`${target}.dokumentasjon.informasjon`, newInformasjon))
    if (validation[namespace + '-informasjon']) {
      dispatch(resetValidation(namespace + '-informasjon'))
    }
  }

  const setSed = (newSed: string) => {
    dispatch(updateReplySed(`${target}.dokumentasjon.sed`, newSed))
    if (validation[namespace + '-sed']) {
      dispatch(resetValidation(namespace + '-sed'))
    }
  }

  return (
    <PaddedDiv>
      <AlignStartRow>
        <Column>
          <Heading size='small'>
            {t('label:anmodning-om-informasjon')}
          </Heading>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column>
          <TextAreaDiv>
            <TextArea
              maxLength={255}
              error={validation[namespace + '-dokument']?.feilmelding}
              namespace={namespace}
              id='dokument'
              label={t('label:vennligst-send-oss-folgende-dokumenter')}
              onChanged={setDokument}
              value={anmodning?.dokumentasjon?.dokument ?? ''}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column>
          <TextAreaDiv>
            <TextArea
              maxLength={(replySed as ReplySed)?.sedType === 'H001' ? 255 : 500}
              error={validation[namespace + '-informasjon']?.feilmelding}
              namespace={namespace}
              id='informasjon'
              label={t('label:vennligst-send-oss-folgende-informasjon')}
              onChanged={setInformasjon}
              value={anmodning?.dokumentasjon?.informasjon ?? ''}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column>
          <TextAreaDiv>
            <TextArea
              maxLength={65}
              error={validation[namespace + '-sed']?.feilmelding}
              namespace={namespace}
              id='sed'
              label={t('label:vennligst-send-oss-folgende-sed-er')}
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
