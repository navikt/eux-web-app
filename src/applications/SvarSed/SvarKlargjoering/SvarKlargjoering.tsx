import { Box, Button, Heading, HStack, RadioGroup, Spacer, Textarea, VStack } from '@navikt/ds-react'
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Input from 'components/Forms/Input'
import RadioPanel from 'components/RadioPanel/RadioPanel'
import { State } from 'declarations/reducers'
import { Klargjoering, KanIkkeKlargjoere, X013Sed } from 'declarations/x013'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateSvarKlargjoering, ValidationSvarKlargjoeringProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

type Status = 'klargjor' | 'kanikke'

const SvarKlargjoering: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-svarklargjoering`
  const sed = replySed as X013Sed

  const klargjoeringer: Array<Klargjoering> = sed.klargjoeringer ?? []
  const kanIkkeKlargjoere: Array<KanIkkeKlargjoere> = sed.kanIkkeKlargjoere ?? []

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationSvarKlargjoeringProps>(
      clonedValidation, namespace, validateSvarKlargjoering, {
        replySed: sed,
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const rowKey = (status: Status, index: number): string => `${namespace}-${status}-${index}`

  const setPunkt = (status: Status, index: number, punkt: string) => {
    const array = status === 'klargjor' ? 'klargjoeringer' : 'kanIkkeKlargjoere'
    dispatch(updateReplySed(`${array}[${index}].punkt`, punkt.trim()))
  }

  const setDel = (status: Status, index: number, del: string) => {
    const array = status === 'klargjor' ? 'klargjoeringer' : 'kanIkkeKlargjoere'
    dispatch(updateReplySed(`${array}[${index}].del`, del.trim()))
  }

  const setKlargjoering = (index: number, klargjoering: string) => {
    dispatch(updateReplySed(`klargjoeringer[${index}].klargjoering`, klargjoering))
    const id = rowKey('klargjor', index) + '-klargjoering'
    if (validation[id]) {
      dispatch(resetValidation(id))
    }
  }

  const setGrunnType = (index: number, grunnType: string) => {
    dispatch(updateReplySed(`kanIkkeKlargjoere[${index}].grunnType`, grunnType.trim()))
    if (grunnType !== 'annet') {
      dispatch(updateReplySed(`kanIkkeKlargjoere[${index}].grunnAnnet`, ''))
    }
    const id = rowKey('kanikke', index) + '-grunnType'
    if (validation[id]) {
      dispatch(resetValidation(id))
    }
  }

  const setGrunnAnnet = (index: number, grunnAnnet: string) => {
    dispatch(updateReplySed(`kanIkkeKlargjoere[${index}].grunnAnnet`, grunnAnnet))
    const id = rowKey('kanikke', index) + '-grunnAnnet'
    if (validation[id]) {
      dispatch(resetValidation(id))
    }
  }

  const onAddKlargjoering = () => {
    dispatch(updateReplySed('klargjoeringer', [
      ...klargjoeringer,
      { punkt: '', del: '', klargjoering: '' }
    ]))
  }

  const onAddKanIkke = () => {
    dispatch(updateReplySed('kanIkkeKlargjoere', [
      ...kanIkkeKlargjoere,
      { punkt: '', del: '', grunnType: '', grunnAnnet: '' }
    ]))
  }

  const onRemove = (status: Status, index: number) => {
    const array = status === 'klargjor' ? 'klargjoeringer' : 'kanIkkeKlargjoere'
    const source = status === 'klargjor' ? klargjoeringer : kanIkkeKlargjoere
    dispatch(updateReplySed(array, source.filter((_x, i) => i !== index)))
    dispatch(resetValidation(rowKey(status, index)))
  }

  const renderPunktDel = (status: Status, index: number, punkt?: string, del?: string): JSX.Element => {
    const key = rowKey(status, index)
    const relKey = `${status}-${index}`
    return (
      <HStack gap="space-16" align="end">
        <Input
          error={validation[key + '-punkt']?.feilmelding}
          namespace={namespace}
          id={relKey + '-punkt'}
          label={t('label:punkt')}
          onChanged={(value: string) => setPunkt(status, index, value)}
          value={punkt ?? ''}
        />
        <Input
          error={validation[key + '-del']?.feilmelding}
          namespace={namespace}
          id={relKey + '-del'}
          label={t('label:del')}
          onChanged={(value: string) => setDel(status, index, value)}
          value={del ?? ''}
        />
        <Spacer />
        <Button
          variant='tertiary'
          icon={<TrashIcon aria-hidden />}
          onClick={() => onRemove(status, index)}
        >
          {t('el:button-remove')}
        </Button>
      </HStack>
    )
  }

  const renderKlargjoeringRow = (k: Klargjoering, index: number): JSX.Element => {
    const key = rowKey('klargjor', index)
    return (
      <Box padding="space-16" borderWidth="1" borderColor="neutral" borderRadius="2" key={key}>
        <VStack gap="space-16">
          {renderPunktDel('klargjor', index, k.punkt, k.del)}
          <Textarea
            error={validation[key + '-klargjoering']?.feilmelding}
            id={key + '-klargjoering'}
            label={t('label:svarklargjoering-klargjoering')}
            maxLength={255}
            resize
            value={k.klargjoering ?? ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setKlargjoering(index, e.target.value)}
          />
        </VStack>
      </Box>
    )
  }

  const renderKanIkkeRow = (k: KanIkkeKlargjoere, index: number): JSX.Element => {
    const key = rowKey('kanikke', index)
    return (
      <Box padding="space-16" borderWidth="1" borderColor="neutral" borderRadius="2" key={key}>
        <VStack gap="space-16">
          {renderPunktDel('kanikke', index, k.punkt, k.del)}
          <RadioGroup
            value={k.grunnType ?? ''}
            data-testid={key + '-grunnType'}
            error={validation[key + '-grunnType']?.feilmelding}
            id={key + '-grunnType'}
            legend={t('label:svarklargjoering-grunn')}
            onChange={(value: string) => setGrunnType(index, value)}
          >
            <VStack gap="space-4">
              <RadioPanel value='kan_ikke_fremlegge_etterspurt_støttedokumentasjon_klargjøring'>{t('el:option-kanikkeklargjoere-grunn-01')}</RadioPanel>
              <RadioPanel value='personen_samarbeidet_ikke'>{t('el:option-kanikkeklargjoere-grunn-02')}</RadioPanel>
              <RadioPanel value='annet'>{t('el:option-kanikkeklargjoere-grunn-99')}</RadioPanel>
            </VStack>
          </RadioGroup>
          {k.grunnType === 'annet' && (
            <Textarea
              error={validation[key + '-grunnAnnet']?.feilmelding}
              id={key + '-grunnAnnet'}
              label={t('label:svarklargjoering-grunn-annet')}
              maxLength={255}
              resize
              value={k.grunnAnnet ?? ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setGrunnAnnet(index, e.target.value)}
            />
          )}
        </VStack>
      </Box>
    )
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <Heading size='xsmall'>
          {t('label:svarklargjoering-klargjor-heading')}
        </Heading>
        {klargjoeringer.map(renderKlargjoeringRow)}
        <HStack>
          <Button
            variant='secondary'
            icon={<PlusCircleIcon aria-hidden />}
            onClick={onAddKlargjoering}
          >
            {t('el:button-add-new-x2', { x: t('label:punkt').toLowerCase() })}
          </Button>
        </HStack>

        <Heading size='xsmall'>
          {t('label:svarklargjoering-kanikke-heading')}
        </Heading>
        {kanIkkeKlargjoere.map(renderKanIkkeRow)}
        <HStack>
          <Button
            variant='secondary'
            icon={<PlusCircleIcon aria-hidden />}
            onClick={onAddKanIkke}
          >
            {t('el:button-add-new-x2', { x: t('label:punkt').toLowerCase() })}
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}

export default SvarKlargjoering
