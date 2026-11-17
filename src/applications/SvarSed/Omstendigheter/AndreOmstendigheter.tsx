import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons'
import { Box, Button, Heading, HStack, VStack } from '@navikt/ds-react'
import { updateReplySed } from 'actions/svarsed'
import { resetValidation } from 'actions/validation'
import TextArea from 'components/Forms/TextArea'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import { OmstendighetType } from 'declarations/u'
import { U008Sed } from 'declarations/u008'
import { U010Sed } from 'declarations/u010'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { ANDRE_OMSTENDIGHETER, ANDRE_OMSTENDIGHETER_MAX_LENGTH, harAndreOmstendigheterTekst, INGEN_OMSTENDIGHETER } from './validation'

export interface AndreOmstendigheterProps {
  namespace: string
  replySed: ReplySed
}

const AndreOmstendigheter: React.FC<AndreOmstendigheterProps> = ({
  namespace,
  replySed
}: AndreOmstendigheterProps): JSX.Element => {
  const validation = useAppSelector((state: State) => state.validation.status)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const omstendigheter = (replySed as U010Sed | U008Sed).omstendigheter
  const andreOmstendigheter = omstendigheter?.andreOmstendigheter?.length ? omstendigheter.andreOmstendigheter : ['']

  const setAndreOmstendigheter = (nyeAndreOmstendigheter: Array<string>) => {
    dispatch(updateReplySed('omstendigheter.andreOmstendigheter', nyeAndreOmstendigheter.length > 0 ? nyeAndreOmstendigheter : undefined))

    let typer: Array<OmstendighetType> = (omstendigheter?.typer ?? []).filter(type => type !== ANDRE_OMSTENDIGHETER)
    if (harAndreOmstendigheterTekst(nyeAndreOmstendigheter)) {
      // U008: "ingen" cannot be combined with other omstendigheter
      typer = typer.filter(type => type !== INGEN_OMSTENDIGHETER)
      typer.push(ANDRE_OMSTENDIGHETER)
    } else {
      dispatch(resetValidation(namespace))
    }
    dispatch(updateReplySed('omstendigheter.typer', typer.length > 0 ? typer : undefined))
  }

  const setAnnenOmstendighet = (index: number, value: string) => {
    setAndreOmstendigheter(andreOmstendigheter.map((annenOmstendighet, currentIndex) => currentIndex === index ? value.trim() : annenOmstendighet))
    dispatch(resetValidation(`${namespace}-${index}`))
  }

  const leggTilAnnenOmstendighet = () => {
    setAndreOmstendigheter([...andreOmstendigheter, ''])
  }

  const fjernAnnenOmstendighet = (index: number) => {
    setAndreOmstendigheter(andreOmstendigheter.filter((_annenOmstendighet, currentIndex) => currentIndex !== index))
    dispatch(resetValidation(namespace))
  }

  return (
    <Box padding="space-16" borderWidth="1" background="default">
      <VStack gap="space-16">
        <Heading size="small" level="2">{t('label:u010-andre-omstendigheter')}</Heading>
        {andreOmstendigheter.map((annenOmstendighet, index) => (
          <VStack key={`${namespace}-${index}-${andreOmstendigheter.length}`} gap="space-8">
            <TextArea
              namespace={namespace}
              id={`${index}`}
              label={t('label:u010-annen-omstendighet')}
              maxLength={ANDRE_OMSTENDIGHETER_MAX_LENGTH}
              error={validation[`${namespace}-${index}`]?.feilmelding}
              onChanged={(value: string) => setAnnenOmstendighet(index, value)}
              value={annenOmstendighet}
            />
            {andreOmstendigheter.length > 1 && (
              <HStack justify="end">
                <Button variant="tertiary" onClick={() => fjernAnnenOmstendighet(index)} icon={<TrashIcon />}>
                  {t('el:button-remove')}
                </Button>
              </HStack>
            )}
          </VStack>
        ))}
        <HStack>
          <Button variant="tertiary" onClick={leggTilAnnenOmstendighet} icon={<PlusCircleIcon />}>
            {t('el:button-add-new-x', { x: t('label:u010-annen-omstendighet').toLowerCase() })}
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}

export default AndreOmstendigheter
