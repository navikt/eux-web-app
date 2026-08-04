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

interface Row {
  status: Status
  index: number
  punkt?: string
  del?: string
  klargjoering?: string
  grunnType?: string
  grunnAnnet?: string
}

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

  const rows: Array<Row> = [
    ...klargjoeringer.map((k: Klargjoering, index: number): Row => ({
      status: 'klargjor', index, punkt: k.punkt, del: k.del, klargjoering: k.klargjoering
    })),
    ...kanIkkeKlargjoere.map((k: KanIkkeKlargjoere, index: number): Row => ({
      status: 'kanikke', index, punkt: k.punkt, del: k.del, grunnType: k.grunnType, grunnAnnet: k.grunnAnnet
    }))
  ]

  const setPunkt = (status: Status, index: number, punkt: string) => {
    const array = status === 'klargjor' ? 'klargjoeringer' : 'kanIkkeKlargjoere'
    dispatch(updateReplySed(`${array}[${index}].punkt`, punkt.trim()))
  }

  const setDel = (status: Status, index: number, del: string) => {
    const array = status === 'klargjor' ? 'klargjoeringer' : 'kanIkkeKlargjoere'
    dispatch(updateReplySed(`${array}[${index}].del`, del.trim()))
  }

  const setStatus = (row: Row, status: Status) => {
    if (status === row.status) return

    let newKlargjoeringer: Array<Klargjoering> = _.cloneDeep(klargjoeringer)
    let newKanIkke: Array<KanIkkeKlargjoere> = _.cloneDeep(kanIkkeKlargjoere)

    if (status === 'klargjor') {
      newKanIkke = newKanIkke.filter((_x, i) => i !== row.index)
      newKlargjoeringer = [...newKlargjoeringer, { punkt: row.punkt, del: row.del, klargjoering: '' }]
    } else {
      newKlargjoeringer = newKlargjoeringer.filter((_x, i) => i !== row.index)
      newKanIkke = [...newKanIkke, { punkt: row.punkt, del: row.del, grunnType: '', grunnAnnet: '' }]
    }

    dispatch(updateReplySed('klargjoeringer', newKlargjoeringer))
    dispatch(updateReplySed('kanIkkeKlargjoere', newKanIkke))
    dispatch(resetValidation(rowKey(row.status, row.index)))
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

  const onAddPoint = () => {
    dispatch(updateReplySed('klargjoeringer', [
      ...klargjoeringer,
      { punkt: '', del: '', klargjoering: '' }
    ]))
  }

  const onRemovePoint = (row: Row) => {
    const array = row.status === 'klargjor' ? 'klargjoeringer' : 'kanIkkeKlargjoere'
    const source = row.status === 'klargjor' ? klargjoeringer : kanIkkeKlargjoere
    dispatch(updateReplySed(array, source.filter((_x, i) => i !== row.index)))
    dispatch(resetValidation(rowKey(row.status, row.index)))
  }

  const renderRow = (row: Row): JSX.Element => {
    const key = rowKey(row.status, row.index)
    const relKey = `${row.status}-${row.index}`

    return (
      <Box padding="space-16" borderWidth="1" borderColor="neutral" borderRadius="2" key={key}>
        <VStack gap="space-16">
          <HStack gap="space-16" align="end">
            <Input
              error={validation[key + '-punkt']?.feilmelding}
              namespace={namespace}
              id={relKey + '-punkt'}
              label={t('label:punkt')}
              onChanged={(value: string) => setPunkt(row.status, row.index, value)}
              value={row.punkt ?? ''}
            />
            <Input
              error={validation[key + '-del']?.feilmelding}
              namespace={namespace}
              id={relKey + '-del'}
              label={t('label:del')}
              onChanged={(value: string) => setDel(row.status, row.index, value)}
              value={row.del ?? ''}
            />
            <Spacer />
            <Button
              variant='tertiary'
              icon={<TrashIcon aria-hidden />}
              onClick={() => onRemovePoint(row)}
            >
              {t('el:button-remove')}
            </Button>
          </HStack>

          <RadioGroup
            value={row.status}
            data-testid={key + '-status'}
            id={key + '-status'}
            legend={t('label:svarklargjoering-status')}
            onChange={(value: string) => setStatus(row, value as Status)}
          >
            <VStack gap="space-4">
              <RadioPanel value='klargjor'>{t('el:option-svarklargjoering-status-klargjor')}</RadioPanel>
              <RadioPanel value='kanikke'>{t('el:option-svarklargjoering-status-kanikke')}</RadioPanel>
            </VStack>
          </RadioGroup>

          {row.status === 'klargjor' && (
            <Textarea
              error={validation[key + '-klargjoering']?.feilmelding}
              id={key + '-klargjoering'}
              label={t('label:svarklargjoering-klargjoering')}
              maxLength={16500}
              resize
              value={row.klargjoering ?? ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setKlargjoering(row.index, e.target.value)}
            />
          )}

          {row.status === 'kanikke' && (
            <>
              <RadioGroup
                value={row.grunnType ?? ''}
                data-testid={key + '-grunnType'}
                error={validation[key + '-grunnType']?.feilmelding}
                id={key + '-grunnType'}
                legend={t('label:svarklargjoering-grunn')}
                onChange={(value: string) => setGrunnType(row.index, value)}
              >
                <VStack gap="space-4">
                  <RadioPanel value='kan_ikke_fremlegge_etterspurt_støttedokumentasjon_klargjøring'>{t('el:option-kanikkeklargjoere-grunn-01')}</RadioPanel>
                  <RadioPanel value='personen_samarbeidet_ikke'>{t('el:option-kanikkeklargjoere-grunn-02')}</RadioPanel>
                  <RadioPanel value='annet'>{t('el:option-kanikkeklargjoere-grunn-99')}</RadioPanel>
                </VStack>
              </RadioGroup>

              {row.grunnType === 'annet' && (
                <Textarea
                  error={validation[key + '-grunnAnnet']?.feilmelding}
                  id={key + '-grunnAnnet'}
                  label={t('label:svarklargjoering-grunn-annet')}
                  maxLength={255}
                  resize
                  value={row.grunnAnnet ?? ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setGrunnAnnet(row.index, e.target.value)}
                />
              )}
            </>
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

        {rows.map(renderRow)}

        <HStack>
          <Button
            variant='secondary'
            icon={<PlusCircleIcon aria-hidden />}
            onClick={onAddPoint}
          >
            {t('el:button-add-new-x', { x: t('label:punkt').toLowerCase() })}
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}

export default SvarKlargjoering
