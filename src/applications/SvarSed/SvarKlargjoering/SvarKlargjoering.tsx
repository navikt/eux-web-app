import { BodyShort, Box, Heading, Label, RadioGroup, Textarea, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
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

interface Point {
  punkt?: string
  del?: string
  status: 'klargjor' | 'kanikke'
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

  const samePoint = (x: Klargjoering | KanIkkeKlargjoere, punkt?: string, del?: string): boolean =>
    x.punkt === punkt && x.del === del

  const points: Array<Point> = _.orderBy([
    ...klargjoeringer.map((k: Klargjoering): Point => ({ punkt: k.punkt, del: k.del, status: 'klargjor' })),
    ...kanIkkeKlargjoere.map((k: KanIkkeKlargjoere): Point => ({ punkt: k.punkt, del: k.del, status: 'kanikke' }))
  ], ['punkt', 'del'])

  const pointKey = (punkt?: string, del?: string): string => `${namespace}-${punkt ?? ''}-${del ?? ''}`

  const setStatus = (punkt: string | undefined, del: string | undefined, status: string) => {
    let newKlargjoeringer: Array<Klargjoering> = _.cloneDeep(klargjoeringer)
    let newKanIkke: Array<KanIkkeKlargjoere> = _.cloneDeep(kanIkkeKlargjoere)

    if (status === 'klargjor') {
      newKanIkke = newKanIkke.filter((x: KanIkkeKlargjoere) => !samePoint(x, punkt, del))
      if (_.findIndex(newKlargjoeringer, (x: Klargjoering) => samePoint(x, punkt, del)) < 0) {
        newKlargjoeringer.push({ punkt, del, klargjoering: '' })
      }
    } else {
      newKlargjoeringer = newKlargjoeringer.filter((x: Klargjoering) => !samePoint(x, punkt, del))
      if (_.findIndex(newKanIkke, (x: KanIkkeKlargjoere) => samePoint(x, punkt, del)) < 0) {
        newKanIkke.push({ punkt, del, grunnType: '', grunnAnnet: '' })
      }
    }

    dispatch(updateReplySed('klargjoeringer', newKlargjoeringer))
    dispatch(updateReplySed('kanIkkeKlargjoere', newKanIkke))
    dispatch(resetValidation(pointKey(punkt, del)))
  }

  const setKlargjoering = (punkt: string | undefined, del: string | undefined, klargjoering: string) => {
    const idx = _.findIndex(klargjoeringer, (x: Klargjoering) => samePoint(x, punkt, del))
    if (idx >= 0) {
      dispatch(updateReplySed(`klargjoeringer[${idx}].klargjoering`, klargjoering))
    }
    if (validation[pointKey(punkt, del) + '-klargjoering']) {
      dispatch(resetValidation(pointKey(punkt, del) + '-klargjoering'))
    }
  }

  const setGrunnType = (punkt: string | undefined, del: string | undefined, grunnType: string) => {
    const idx = _.findIndex(kanIkkeKlargjoere, (x: KanIkkeKlargjoere) => samePoint(x, punkt, del))
    if (idx >= 0) {
      dispatch(updateReplySed(`kanIkkeKlargjoere[${idx}].grunnType`, grunnType.trim()))
      if (grunnType !== 'annet') {
        dispatch(updateReplySed(`kanIkkeKlargjoere[${idx}].grunnAnnet`, ''))
      }
    }
    if (validation[pointKey(punkt, del) + '-grunnType']) {
      dispatch(resetValidation(pointKey(punkt, del) + '-grunnType'))
    }
  }

  const setGrunnAnnet = (punkt: string | undefined, del: string | undefined, grunnAnnet: string) => {
    const idx = _.findIndex(kanIkkeKlargjoere, (x: KanIkkeKlargjoere) => samePoint(x, punkt, del))
    if (idx >= 0) {
      dispatch(updateReplySed(`kanIkkeKlargjoere[${idx}].grunnAnnet`, grunnAnnet))
    }
    if (validation[pointKey(punkt, del) + '-grunnAnnet']) {
      dispatch(resetValidation(pointKey(punkt, del) + '-grunnAnnet'))
    }
  }

  const renderPoint = (point: Point): JSX.Element => {
    const key = pointKey(point.punkt, point.del)
    const klargjoering: Klargjoering | undefined = _.find(klargjoeringer, (x: Klargjoering) => samePoint(x, point.punkt, point.del))
    const kanIkke: KanIkkeKlargjoere | undefined = _.find(kanIkkeKlargjoere, (x: KanIkkeKlargjoere) => samePoint(x, point.punkt, point.del))

    return (
      <Box padding="space-16" borderWidth="1" borderColor="neutral" borderRadius="2" key={key}>
        <VStack gap="space-16">
          <Label>
            {t('label:punkt')}: {point.punkt} — {t('label:del')}: {point.del}
          </Label>

          <RadioGroup
            value={point.status}
            data-testid={key + '-status'}
            id={key + '-status'}
            legend={t('label:svarklargjoering-status')}
            onChange={(value: string) => setStatus(point.punkt, point.del, value)}
          >
            <VStack gap="space-4">
              <RadioPanel value='klargjor'>{t('el:option-svarklargjoering-status-klargjor')}</RadioPanel>
              <RadioPanel value='kanikke'>{t('el:option-svarklargjoering-status-kanikke')}</RadioPanel>
            </VStack>
          </RadioGroup>

          {point.status === 'klargjor' && (
            <Textarea
              error={validation[key + '-klargjoering']?.feilmelding}
              id={key + '-klargjoering'}
              label={t('label:svarklargjoering-klargjoering')}
              maxLength={16500}
              resize
              value={klargjoering?.klargjoering ?? ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setKlargjoering(point.punkt, point.del, e.target.value)}
            />
          )}

          {point.status === 'kanikke' && (
            <>
              <RadioGroup
                value={kanIkke?.grunnType ?? ''}
                data-testid={key + '-grunnType'}
                error={validation[key + '-grunnType']?.feilmelding}
                id={key + '-grunnType'}
                legend={t('label:svarklargjoering-grunn')}
                onChange={(value: string) => setGrunnType(point.punkt, point.del, value)}
              >
                <VStack gap="space-4">
                  <RadioPanel value='kan_ikke_fremlegge_etterspurt_støttedokumentasjon_klargjøring'>{t('el:option-kanikkeklargjoere-grunn-01')}</RadioPanel>
                  <RadioPanel value='personen_samarbeidet_ikke'>{t('el:option-kanikkeklargjoere-grunn-02')}</RadioPanel>
                  <RadioPanel value='annet'>{t('el:option-kanikkeklargjoere-grunn-99')}</RadioPanel>
                </VStack>
              </RadioGroup>

              {kanIkke?.grunnType === 'annet' && (
                <Textarea
                  error={validation[key + '-grunnAnnet']?.feilmelding}
                  id={key + '-grunnAnnet'}
                  label={t('label:svarklargjoering-grunn-annet')}
                  maxLength={255}
                  resize
                  value={kanIkke?.grunnAnnet ?? ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setGrunnAnnet(point.punkt, point.del, e.target.value)}
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

        {_.isEmpty(points)
          ? (
            <BodyShort>
              {t('label:svarklargjoering-ingen-punkter')}
            </BodyShort>
            )
          : points.map(renderPoint)}
      </VStack>
    </Box>
  )
}

export default SvarKlargjoering
