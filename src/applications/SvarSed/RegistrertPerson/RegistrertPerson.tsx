import { Box, Heading, Radio, RadioGroup, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import TextArea from 'components/Forms/TextArea'
import { JaNei } from 'declarations/sed'
import { U013Sed } from 'declarations/u013'
import { State } from 'declarations/reducers'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateRegistrertPerson, ValidationRegistrertPersonProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const RegistrertPerson: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-bruker-registrertperson`
  const sed = replySed as U013Sed
  const registrertPerson = sed.registrertPerson

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationRegistrertPersonProps>(
      clonedValidation, namespace, validateRegistrertPerson, { replySed: sed }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const setField = (field: keyof NonNullable<U013Sed['registrertPerson']>, value?: string) => {
    dispatch(updateReplySed(`registrertPerson.${field}`, value))
    if (validation[`${namespace}-${field}`]) {
      dispatch(resetValidation(`${namespace}-${field}`))
    }
  }

  const setOverholdtProsedyrer = (value: JaNei) => {
    setField('overholdtProsedyrer', value)
    if (value === 'ja') {
      setField('somRapportertIU10', undefined)
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size="small">{label}</Heading>
        <RadioGroup
          value={registrertPerson?.overholdtProsedyrer ?? ''}
          id={`${namespace}-overholdtProsedyrer`}
          legend={t('label:u013-overholdt-prosedyrer')}
          error={validation[`${namespace}-overholdtProsedyrer`]?.feilmelding}
          onChange={(value: string) => setOverholdtProsedyrer(value as JaNei)}
        >
          <Radio value="ja">{t('label:ja')}</Radio>
          <Radio value="nei">{t('label:nei')}</Radio>
        </RadioGroup>
        {registrertPerson?.overholdtProsedyrer === 'nei' && (
          <RadioGroup
            value={registrertPerson.somRapportertIU10 ?? ''}
            id={`${namespace}-somRapportertIU10`}
            legend={t('label:u013-som-rapportert-i-u010')}
            error={validation[`${namespace}-somRapportertIU10`]?.feilmelding}
            onChange={(value: string) => setField('somRapportertIU10', value as JaNei)}
          >
            <Radio value="ja">{t('label:ja')}</Radio>
            <Radio value="nei">{t('label:nei')}</Radio>
          </RadioGroup>
        )}
        <TextArea
          namespace={namespace}
          id="ytterligereInfo"
          label={t('label:ytterligere-informasjon-til-sed')}
          maxLength={500}
          error={validation[`${namespace}-ytterligereInfo`]?.feilmelding}
          onChanged={(value: string) => setField('ytterligereInfo', value.trim() || undefined)}
          value={registrertPerson?.ytterligereInfo ?? ''}
        />
      </VStack>
    </Box>
  )
}

export default RegistrertPerson
