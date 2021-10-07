import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import classNames from 'classnames'
import TextArea from 'components/Forms/TextArea'
import { TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { F002Sed } from 'declarations/sed'
import { buttonLogger } from 'metrics/loggers'
import { Undertittel } from 'nav-frontend-typografi'
import { AlignStartRow, Column, HighContrastFlatknapp, PaddedDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
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
  const target = 'refusjon_ihht_artikkel_58_i_forordning'
  const refusjonIHenholdTilArtikkel58IForordningen: string | undefined = (replySed as F002Sed).refusjon_ihht_artikkel_58_i_forordning
  const namespace = `${parentNamespace}-refusjon_i_henhold_til_artikkel_58_i_forordningen`

  const setKrav = (newKrav: string) => {
    dispatch(updateReplySed(`${target}`, newKrav.trim()))
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
              value={refusjonIHenholdTilArtikkel58IForordningen ?? ''}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column>
          <HighContrastFlatknapp
            mini
            kompakt
            data-amplitude='svarsed.editor.seekontoopplysning'
            onClick={(e: React.ChangeEvent<HTMLButtonElement>) => {
              buttonLogger(e)
              seeKontoopplysninger()
            }}
          >
            {t('label:oppgi-kontoopplysninger')}
          </HighContrastFlatknapp>
        </Column>
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default KravOmRefusjon
