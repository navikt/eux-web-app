import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons'
import { Box, Button, Heading, HStack, VStack } from '@navikt/ds-react'
import { updateReplySed } from 'actions/svarsed'
import { resetValidation } from 'actions/validation'
import TextArea from 'components/Forms/TextArea'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import { HendelseType } from 'declarations/u'
import { U008Sed } from 'declarations/u008'
import { U010Sed } from 'declarations/u010'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { ANDRE_HENDELSER, ANDRE_HENDELSER_MAX_LENGTH, harAndreHendelserTekst, INGEN_HENDELSER } from './validation'

export interface AndreHendelserProps {
  namespace: string
  replySed: ReplySed
}

const AndreHendelser: React.FC<AndreHendelserProps> = ({
  namespace,
  replySed
}: AndreHendelserProps): JSX.Element => {
  const validation = useAppSelector((state: State) => state.validation.status)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const hendelser = (replySed as U010Sed | U008Sed).hendelser
  const andreHendelser = hendelser?.andreHendelser?.length ? hendelser.andreHendelser : ['']

  const setAndreHendelser = (nyeAndreHendelser: Array<string>) => {
    dispatch(updateReplySed('hendelser.andreHendelser', nyeAndreHendelser.length > 0 ? nyeAndreHendelser : undefined))

    let typer: Array<HendelseType> = (hendelser?.typer ?? []).filter(type => type !== ANDRE_HENDELSER)
    if (harAndreHendelserTekst(nyeAndreHendelser)) {
      // U008: "ingen" cannot be combined with other hendelser
      typer = typer.filter(type => type !== INGEN_HENDELSER)
      typer.push(ANDRE_HENDELSER)
    } else {
      dispatch(resetValidation(namespace))
    }
    dispatch(updateReplySed('hendelser.typer', typer.length > 0 ? typer : undefined))
  }

  const setAnnenHendelse = (index: number, value: string) => {
    setAndreHendelser(andreHendelser.map((annenHendelse, currentIndex) => currentIndex === index ? value.trim() : annenHendelse))
    dispatch(resetValidation(`${namespace}-${index}`))
  }

  const leggTilAnnenHendelse = () => {
    setAndreHendelser([...andreHendelser, ''])
  }

  const fjernAnnenHendelse = (index: number) => {
    setAndreHendelser(andreHendelser.filter((_annenHendelse, currentIndex) => currentIndex !== index))
    dispatch(resetValidation(namespace))
  }

  return (
    <Box padding="space-16" borderWidth="1" background="default">
      <VStack gap="space-16">
        <Heading size="small" level="2">{t('label:andre-hendelser')}</Heading>
        {andreHendelser.map((annenHendelse, index) => (
          <VStack key={`${namespace}-${index}-${andreHendelser.length}`} gap="space-8">
            <TextArea
              namespace={namespace}
              id={`${index}`}
              label={t('label:annen-hendelse')}
              maxLength={ANDRE_HENDELSER_MAX_LENGTH}
              error={validation[`${namespace}-${index}`]?.feilmelding}
              onChanged={(value: string) => setAnnenHendelse(index, value)}
              value={annenHendelse}
            />
            {andreHendelser.length > 1 && (
              <HStack justify="end">
                <Button variant="tertiary" onClick={() => fjernAnnenHendelse(index)} icon={<TrashIcon />}>
                  {t('el:button-remove')}
                </Button>
              </HStack>
            )}
          </VStack>
        ))}
        <HStack>
          <Button variant="tertiary" onClick={leggTilAnnenHendelse} icon={<PlusCircleIcon />}>
            {t('el:button-add-new-x', { x: t('label:annen-hendelse').toLowerCase() })}
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}

export default AndreHendelser
