import { resetValidation } from 'actions/validation'
import classNames from 'classnames'
import TextArea from 'components/Forms/TextArea'
import { TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { F002Sed } from 'declarations/sed'
import { buttonLogger } from 'metrics/loggers'
import { Heading, Button } from '@navikt/ds-react'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { FormålManagerFormProps, FormålManagerFormSelector, mapState } from '../FormålManager'

const KravOmRefusjon: React.FC<FormålManagerFormProps> = ({
  parentNamespace,
  replySed,
  updateReplySed,
  seeKontoopplysninger
}: FormålManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: FormålManagerFormSelector = useSelector<State, FormålManagerFormSelector>(mapState)
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
      <AlignStartRow
        className={classNames('slideInFromLeft')}
      >
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
            data-test-id={namespace + '-konto-button'}
            data-amplitude='svarsed.editor.seekontoopplysning'
            onClick={(e) => {
              buttonLogger(e)
              seeKontoopplysninger()
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
