import {Box, Heading, HGrid, VStack} from '@navikt/ds-react'
import React from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import {TextAreaDiv} from "../../../components/StyledComponents";
import TextArea from "../../../components/Forms/TextArea";
import {useAppDispatch, useAppSelector} from "../../../store";
import {useTranslation} from "react-i18next";
import _ from "lodash";
import {State} from "../../../declarations/reducers";
import {SvarYtelseTilForeldreloese_V42, SvarYtelseTilForeldreloese_V43} from "../../../declarations/sed";
import Input from "../../../components/Forms/Input";
import CountrySelect from "@navikt/landvelger";
import {Currency} from "@navikt/land-verktoy";
import useUnmount from "../../../hooks/useUnmount";
import performValidation from "../../../utils/performValidation";
import {
  validateInntektForeldreloesesBarnet,
  ValidationYtelseTilForeldreloeseProps
} from "./validation";
import {setValidation} from "../../../actions/validation";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const InntektForeldreloeseBarnet: React.FC<MainFormProps> = ({
 label,
 parentNamespace,
 replySed,
 updateReplySed,
 options
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-ytelsetilforeldreloese-inntekt-til-den-foreldreloese-barnet`
  const target = `anmodningOmMerInformasjon.svar.ytelseTilForeldreloese.barnet`
  const svarYtelseTilForeldreloeseTarget = `anmodningOmMerInformasjon.svar.ytelseTilForeldreloese`
  const svarYtelseTilForeldreloese: SvarYtelseTilForeldreloese_V43 | SvarYtelseTilForeldreloese_V42 | undefined = _.get(replySed, svarYtelseTilForeldreloeseTarget)
  const CDM_VERSJON = options.cdmVersjon

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationYtelseTilForeldreloeseProps>(clonedValidation, namespace, validateInntektForeldreloesesBarnet, {
      svarYtelseTilForeldreloese,
      CDM_VERSJON
    }, true)
    dispatch(setValidation(clonedValidation))
  })

  const setYtelseTilForeldreloeseProperty = (property: string, value: string) => {
    dispatch(updateReplySed(`${target}.${property}`, value.trim()))
  }

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        {CDM_VERSJON === "4.2" &&
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
            <TextAreaDiv>
              <TextArea
                error={validation[namespace + '-barnet-inntekt']?.feilmelding}
                namespace={namespace}
                id='barnet-inntekt'
                label={t('label:inntekt-foreldreløse-barnet')}
                hideLabel={true}
                onChanged={(v) => setYtelseTilForeldreloeseProperty('inntektfritekst', v)}
                value={(svarYtelseTilForeldreloese as SvarYtelseTilForeldreloese_V42)?.barnet?.inntektfritekst ?? ''}
              />
            </TextAreaDiv>
          </Box>
        }
        {(parseFloat(CDM_VERSJON) >= 4.3) &&
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
            <HGrid gap="4" columns={2}>
              <Input
                error={validation[namespace + '-beloep']?.feilmelding}
                id='beloep'
                label={t('label:beløp')}
                namespace={namespace}
                onChanged={(v) => setYtelseTilForeldreloeseProperty('inntekt.beloep', v)}
                value={(svarYtelseTilForeldreloese as SvarYtelseTilForeldreloese_V43)?.barnet?.inntekt?.beloep ?? ''}
              />
              <CountrySelect
                closeMenuOnSelect
                ariaLabel={t('label:valuta')}
                data-testid={namespace + '-valuta'}
                error={validation[namespace + '-valuta']?.feilmelding}
                id={namespace + '-valuta'}
                label={t('label:valuta')}
                locale='nb'
                menuPortalTarget={document.body}
                onOptionSelected={(c: Currency) => setYtelseTilForeldreloeseProperty('inntekt.valuta', c.value)}
                type='currency'
                values={(svarYtelseTilForeldreloese as SvarYtelseTilForeldreloese_V43)?.barnet?.inntekt?.valuta}
              />
            </HGrid>
          </Box>
        }
      </VStack>
    </Box>
  )
}

export default InntektForeldreloeseBarnet
