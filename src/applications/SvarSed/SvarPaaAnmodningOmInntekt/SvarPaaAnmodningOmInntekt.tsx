import {VStack, Box, Heading, Radio, RadioGroup, Label, HGrid} from '@navikt/ds-react'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import React from 'react'
import { useAppDispatch, useAppSelector } from 'store'
import TextArea from "../../../components/Forms/TextArea";
import {SvarInntekt} from "../../../declarations/sed";
import {useTranslation} from "react-i18next";
import Input from "../../../components/Forms/Input";
import DateField from "../../../components/DateField/DateField";
import CountrySelect from "@navikt/landvelger";
import {Currency} from "@navikt/land-verktoy";
import useUnmount from "../../../hooks/useUnmount";
import performValidation from "../../../utils/performValidation";
import {setValidation} from "../../../actions/validation";
import {validateInntekt, ValidationInntektProps} from "./validation";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const SvarPaaAnmodningOmInntekt: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed,
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-inntekt`
  const target = `anmodningOmMerInformasjon.svar.inntekt`
  const svarInntekt: SvarInntekt | undefined = _.get(replySed, target)

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationInntektProps>(
      clonedvalidation, namespace, validateInntekt, {
        svarInntekt: svarInntekt,
        label: label
      }, true)

    dispatch(setValidation(clonedvalidation))
  })

  const setInntektProperty = (property: string, value: string) => {
    dispatch(updateReplySed(`${target}.${property}`, value.trim()))
    if(property === "inntektskilde" && value !== "annet" && svarInntekt?.annenkilde){
      dispatch(updateReplySed(`${target}.annenkilde`, undefined))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>
        <Box padding="space-16" background="neutral-soft" borderWidth="1" borderColor="neutral-subtle">
          <VStack gap="space-4">
            <RadioGroup
              value={svarInntekt?.inntektskilde}
              legend={t('inntektskilde')}
              onChange={(v:string)=>setInntektProperty("inntektskilde", v)}
            >
                <Radio value='loenn_eller_naering'>Ytelse fra arbeid eller selvstendig næringsinntekt</Radio>
                <Radio value='eiendom_eller_bidrag'>Fra eiendom, verdivurdering av tomt/eiendom, ektefellebidrag/barnebidrag</Radio>
                <Radio value='annet'>Annet</Radio>
            </RadioGroup>
            {svarInntekt?.inntektskilde === "annet" &&
              <TextArea
                error={validation[namespace + '-annenkilde']?.feilmelding}
                id='annenkilde'
                label={t('label:annet')}
                namespace={namespace}
                onChanged={(v: string) => setInntektProperty("annenkilde", v)}
                value={svarInntekt?.annenkilde ?? ''}
              />
            }
          </VStack>
        </Box>
        <Box padding="space-16" background="neutral-soft" borderWidth="1" borderColor="neutral-subtle">
          <VStack gap="space-16">
            <Label>{t('label:periode-det-kreves-opplysninger-om')}</Label>
            <HGrid columns={2} gap="space-16" align="start">
              <DateField
                error={validation[namespace + '-periode-startdato']?.feilmelding}
                namespace={namespace}
                id='periode-startdato'
                label={t('label:startdato')}
                onChanged={(v) => setInntektProperty('periode.startdato', v)}
                dateValue={svarInntekt?.periode?.startdato}
              />
              <DateField
                error={validation[namespace + '-periode-sluttdato']?.feilmelding}
                namespace={namespace}
                id='periode-sluttdato'
                label={t('label:sluttdato')}
                onChanged={(v) => setInntektProperty('periode.sluttdato', v)}
                dateValue={svarInntekt?.periode?.sluttdato}
              />
            </HGrid>
          </VStack>
        </Box>
        <Box padding="space-16" background="neutral-soft" borderWidth="1" borderColor="neutral-subtle">
          <VStack gap="space-16">
            <Label>{t('label:årlig-inntekt')}</Label>
            <HGrid columns={2} gap="space-16" align="start">
              <Input
                error={validation[namespace + '-aarlig-beloep']?.feilmelding}
                namespace={namespace}
                id='aarlig-beloep'
                label={t('label:beløp')}
                onChanged={(v) => setInntektProperty('aarlig.beloep', v)}
                value={svarInntekt?.aarlig?.beloep}
              />
              <CountrySelect
                closeMenuOnSelect
                ariaLabel={t('label:valuta')}
                error={validation[namespace + '-aarlig-valuta']?.feilmelding}
                id={namespace + '-aarlig-valuta'}
                label={t('label:valuta')}
                locale='nb'
                menuPortalTarget={document.body}
                onOptionSelected={(valuta: Currency) => setInntektProperty('aarlig.valuta', valuta.value)}
                type='currency'
                sort="noeuFirst"
                values={svarInntekt?.aarlig?.valuta}
              />
            </HGrid>
          </VStack>
        </Box>
        <Box padding="space-16" background="neutral-soft" borderWidth="1" borderColor="neutral-subtle">
          <TextArea
            error={validation[namespace + '-ytterligereInfo']?.feilmelding}
            namespace={namespace}
            id='ytterligereInfo'
            label={t('label:extra-information')}
            onChanged={(v) => setInntektProperty('ytterligereInformasjon', v)}
            value={svarInntekt?.ytterligereInformasjon}
          />
        </Box>
      </VStack>
    </Box>
  );
}

export default SvarPaaAnmodningOmInntekt
