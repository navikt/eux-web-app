import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import classNames from 'classnames'
import TextArea from 'components/Forms/TextArea'
import { TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { F002Sed, FormalKravOmRefusjon } from 'declarations/sed'
import { Undertittel } from 'nav-frontend-typografi'
import { AlignStartRow, Column, HighContrastLink, PaddedDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { FormålManagerFormProps, FormålManagerFormSelector } from '../FormålManager'

const mapState = (state: State): FormålManagerFormSelector => ({
  replySed: state.svarpased.replySed,
  validation: state.validation.status,
  viewValidation: state.validation.view
})

const KravOmRefusjon: React.FC<FormålManagerFormProps> = ({
  parentNamespace,
  seeKontoopplysninger
}: FormålManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    replySed,
    validation
  }: any = useSelector<State, FormålManagerFormSelector>(mapState)
  const dispatch = useDispatch()
  const target = 'formaalx.kravomrefusjon'
  const kravomrefusjon: FormalKravOmRefusjon | undefined = (replySed as F002Sed).formaalx?.kravomrefusjon
  const namespace = `${parentNamespace}-refusjonihenholdtilartikkel58iforordningen`

  const setKrav = (newKrav: string) => {
    dispatch(updateReplySed(`${target}.krav`, newKrav.trim()))
    if (validation[namespace + '-krav']) {
      dispatch(resetValidation(namespace + '-krav'))
    }
  }

  return (
    <PaddedDiv>
      <Undertittel>
        {t('label:krav-om-refusjon')}
      </Undertittel>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
      >
        <Column>
          <TextAreaDiv>
            <TextArea
              feil={validation[namespace + '-krav']?.feilmelding}
              namespace={namespace}
              id='krav'
              label={t('label:krav-om-refusjon-under-artikkel') + ' *'}
              onChanged={setKrav}
              value={kravomrefusjon?.krav}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column>
          <HighContrastLink
            href='#' onClick={(e: any) => {
              e.preventDefault()
              seeKontoopplysninger()
            }}
          >
            {t('label:oppgi-kontoopplysninger')}
          </HighContrastLink>
        </Column>
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default KravOmRefusjon
