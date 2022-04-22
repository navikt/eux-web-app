import { Button, Heading } from '@navikt/ds-react'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { resetValidation } from 'actions/validation'
import { mapState, OneLevelFormProps, OneLevelFormSelector } from 'applications/SvarSed/OneLevelForm'
import TextArea from 'components/Forms/TextArea'
import { TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { F002Sed } from 'declarations/sed'
import { buttonLogger } from 'metrics/loggers'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

const KravOmRefusjon: React.FC<OneLevelFormProps> = ({
  parentNamespace,
  replySed,
  updateReplySed,
  seeKontoopplysninger
}: OneLevelFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: OneLevelFormSelector = useSelector<State, OneLevelFormSelector>(mapState)
  const dispatch = useDispatch()
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
              label={t('label:krav-om-refusjon-under-artikkel') + ' *'}
              namespace={namespace}
              onChanged={setKrav}
              required
              value={refusjonIHenholdTilArtikkel58IForordningen ?? ''}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column>
          <Button
            variant='tertiary'
            data-testid={namespace + '-konto-button'}
            data-amplitude='svarsed.editor.seekontoopplysning'
            onClick={(e) => {
              buttonLogger(e)
              if (seeKontoopplysninger) seeKontoopplysninger()
            }}
          >
            {t('label:oppgi-kontoopplysninger')}
          </Button>
        </Column>
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default KravOmRefusjon
