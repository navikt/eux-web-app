import { PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { resetValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector, mapState } from 'applications/SvarSed/MainForm'
import TextArea from 'components/Forms/TextArea'
import { TextAreaDiv } from 'components/StyledComponents'
import { F002Sed } from 'declarations/sed'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'

const KravOmRefusjon: React.FC<MainFormProps> = ({
  parentNamespace,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: MainFormSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target = 'refusjonskrav'
  const refusjonIHenholdTilArtikkel58IForordningen: string | undefined = (replySed as F002Sed).refusjonskrav
  const namespace = `${parentNamespace}-refusjonskrav`

  const setKrav = (newKrav: string) => {
    dispatch(updateReplySed(target, newKrav.trim()))
    if (validation[namespace + '-krav']) {
      dispatch(resetValidation(namespace + '-krav'))
    }
  }

  return (
    <PaddedDiv>
      <VerticalSeparatorDiv />
      <TextAreaDiv>
        <TextArea
          error={validation[namespace + '-krav']?.feilmelding}
          id='krav'
          label={t('label:krav-om-refusjon-under-artikkel')}
          namespace={namespace}
          onChanged={setKrav}
          required
          value={refusjonIHenholdTilArtikkel58IForordningen ?? ''}
        />
      </TextAreaDiv>
    </PaddedDiv>
  )
}

export default KravOmRefusjon
