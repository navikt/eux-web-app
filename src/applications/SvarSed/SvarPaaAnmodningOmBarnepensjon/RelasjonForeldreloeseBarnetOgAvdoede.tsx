import {State} from "../../../declarations/reducers";
import {MainFormProps, MainFormSelector} from "../MainForm";
import React from "react";
import {useAppDispatch, useAppSelector} from "../../../store";
import {useTranslation} from "react-i18next";
import { SvarYtelseTilForeldreloese_V42, SvarYtelseTilForeldreloese_V43} from "../../../declarations/sed";
import _ from "lodash";
import {Box, Heading, VStack} from "@navikt/ds-react";
import {TextAreaDiv} from "../../../components/StyledComponents";
import TextArea from "../../../components/Forms/TextArea";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const RelasjonForeldreloeseBarnetOgAvdoede: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed,
  options
}: MainFormProps): JSX.Element => {
  const {validation} = useAppSelector(mapState)
  const {t} = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-ytelsetilforeldreloese-relasjonforeldreloesebarnetogavdoede`
  const target = `anmodningOmMerInformasjon.svar.ytelseTilForeldreloese.barnet`
  const svarYtelseTilForeldreloeseTarget = `anmodningOmMerInformasjon.svar.ytelseTilForeldreloese`
  const CDM_VERSJON = options.cdmVersjon
  const svarYtelseTilForeldreloese: SvarYtelseTilForeldreloese_V43 | SvarYtelseTilForeldreloese_V42 | undefined = _.get(replySed, svarYtelseTilForeldreloeseTarget)

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
                error={validation[namespace + '-barnet-relasjoner']?.feilmelding}
                namespace={namespace}
                id='barnet-relasjoner'
                label={t('label:relasjon-mellom-den-foreldreloese-barnet-og-avdoede')}
                hideLabel={true}
                onChanged={(v) => setYtelseTilForeldreloeseProperty('relasjontilavdoedefritekst', v)}
                value={(svarYtelseTilForeldreloese as SvarYtelseTilForeldreloese_V42)?.barnet?.relasjontilavdoedefritekst ?? ''}
              />
            </TextAreaDiv>
          </Box>
        }
      </VStack>
    </Box>
  )
}

export default RelasjonForeldreloeseBarnetOgAvdoede
