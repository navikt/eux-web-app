import { Heading } from '@navikt/ds-react'
import { PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import { validateKravOmRefusjon, ValidationKravOmRefusjonProps } from 'applications/SvarSed/KravOmRefusjon/validation'
import { MainFormProps, MainFormSelector, mapState } from 'applications/SvarSed/MainForm'
import TextArea from 'components/Forms/TextArea'
import { TextAreaDiv } from 'components/StyledComponents'
import { F002Sed } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const KravOmRefusjon: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  personName,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: MainFormSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target = 'refusjonskrav'
  const refusjonIHenholdTilArtikkel58IForordningen: string | undefined = _.get((replySed as F002Sed), target)
  const namespace = `${parentNamespace}-refusjon_i_henhold_til_artikkel_58_i_forordningen`

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationKravOmRefusjonProps>(
      clonedValidation, namespace, validateKravOmRefusjon, {
        kravOmRefusjon: refusjonIHenholdTilArtikkel58IForordningen,
        formalName: personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const setKrav = (newKrav: string) => {
    dispatch(updateReplySed(target, newKrav.trim()))
    if (validation[namespace + '-krav']) {
      dispatch(resetValidation(namespace + '-krav'))
    }
  }

  return (
    <PaddedDiv>
      <Heading size='small'>
        {label}
      </Heading>
      <VerticalSeparatorDiv size='2' />
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
