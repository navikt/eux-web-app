import { Heading } from '@navikt/ds-react'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { resetValidation } from 'actions/validation'
import { mapState, TwoLevelFormProps, TwoLevelFormSelector } from 'applications/SvarSed/TwoLevelForm'
import TextArea from 'components/Forms/TextArea'
import { TextAreaDiv } from 'components/StyledComponents'
import { F002Sed } from 'declarations/sed'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'

const KravOmRefusjon: React.FC<TwoLevelFormProps> = ({
  parentNamespace,
  replySed,
  updateReplySed
}: TwoLevelFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: TwoLevelFormSelector = useAppSelector(mapState)
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
      <Heading size='small'>
        {t('label:krav-om-refusjon')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column>
          <TextAreaDiv>
            <TextArea
              error={validation[namespace + '-krav']?.feilmelding}
              key={namespace + '-krav-' + (refusjonIHenholdTilArtikkel58IForordningen ?? '')}
              id='krav'
              label={t('label:krav-om-refusjon-under-artikkel')}
              namespace={namespace}
              onChanged={setKrav}
              required
              value={refusjonIHenholdTilArtikkel58IForordningen ?? ''}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default KravOmRefusjon
