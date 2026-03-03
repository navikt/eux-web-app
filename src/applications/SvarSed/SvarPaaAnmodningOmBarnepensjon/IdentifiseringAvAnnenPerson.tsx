import {VStack, Box, Heading} from '@navikt/ds-react'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import React from 'react'
import {useAppDispatch, useAppSelector} from 'store'
import {SvarYtelseTilForeldreloese_V42, SvarYtelseTilForeldreloese_V43} from "declarations/sed";
import TextArea from "components/Forms/TextArea";
import {useTranslation} from "react-i18next";
import {setReplySed} from "../../../actions/svarsed";
import PersonBasic from "../PersonBasic/PersonBasic";
import useUnmount from "../../../hooks/useUnmount";
import performValidation from "../../../utils/performValidation";
import {
  validateIdentifiseringAvAnnenPerson,
  ValidationYtelseTilForeldreloeseProps
} from "./validation";
import {setValidation} from "../../../actions/validation";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const IdentifiseringAvDenAvdoede: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed,
  options
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-ytelsetilforeldreloese-identifikasjon-av-andre-personer`
  const target = `anmodningOmMerInformasjon.svar.ytelseTilForeldreloese.annenPerson`
  const svarYtelseTilForeldreloeseTarget = `anmodningOmMerInformasjon.svar.ytelseTilForeldreloese`
  const CDM_VERSJON = options.cdmVersjon
  const svarYtelseTilForeldreloese: SvarYtelseTilForeldreloese_V43 | SvarYtelseTilForeldreloese_V42 | undefined = _.get(replySed, svarYtelseTilForeldreloeseTarget)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationYtelseTilForeldreloeseProps>(clonedValidation, namespace, validateIdentifiseringAvAnnenPerson, {
      svarYtelseTilForeldreloese,
      CDM_VERSJON
    }, true)
    dispatch(setValidation(clonedValidation))
  })

  const setYtelseTilForeldreloeseProperty = (property: string, value: string) => {
    dispatch(updateReplySed(`${target}.${property}`, value.trim()))
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>
        {CDM_VERSJON === "4.2" &&
          <Box padding="space-16" background="neutral-soft" borderWidth="1" borderColor="neutral-subtle">
            <TextArea
              error={validation[namespace + '-annen-person-identifisering']?.feilmelding}
              namespace={namespace}
              id='barnet-identifisering'
              label={t('label:identifisering-av-annen-person')}
              hideLabel={true}
              onChanged={(v) => setYtelseTilForeldreloeseProperty('identifiseringFritekst', v)}
              value={(svarYtelseTilForeldreloese as SvarYtelseTilForeldreloese_V42)?.annenPerson?.identifiseringFritekst ?? ''}
            />
          </Box>
        }
        {(parseFloat(CDM_VERSJON) >= 4.3) &&
          <Box padding="space-16" background="neutral-soft" borderWidth="1" borderColor="neutral-subtle">
            <PersonBasic
              setReplySed={setReplySed}
              replySed={replySed}
              personID={target}
              parentNamespace={namespace}
              updateReplySed={updateReplySed}
            />
          </Box>
        }
      </VStack>
    </Box>
  );
}

export default IdentifiseringAvDenAvdoede
