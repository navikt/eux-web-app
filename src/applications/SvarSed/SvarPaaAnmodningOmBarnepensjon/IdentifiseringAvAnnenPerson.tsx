import {VStack, Box, Heading} from '@navikt/ds-react'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import React from 'react'
import {useAppDispatch, useAppSelector} from 'store'
import {SvarYtelseTilForeldreloese_V42, SvarYtelseTilForeldreloese_V43} from "declarations/sed";
import {TextAreaDiv} from "components/StyledComponents";
import TextArea from "components/Forms/TextArea";
import {useTranslation} from "react-i18next";
import {setReplySed} from "../../../actions/svarsed";
import PersonBasic from "../PersonBasic/PersonBasic";

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
  const namespace = `${parentNamespace}-ytelsetilforeldreloese-identifiseringavannenperson`
  const target = `anmodningOmMerInformasjon.svar.ytelseTilForeldreloese.annenPerson`
  const svarYtelseTilForeldreloeseTarget = `anmodningOmMerInformasjon.svar.ytelseTilForeldreloese`
  const CDM_VERSJON = options.cdmVersjon
  const svarYtelseTilForeldreloese: SvarYtelseTilForeldreloese_V43 | SvarYtelseTilForeldreloese_V42 | undefined = _.get(replySed, svarYtelseTilForeldreloeseTarget)


  const setYtelseTilForeldreloeseProperty = (property: string, value: string) => {
    dispatch(updateReplySed(`${target}.${property}`, value.trim()))
  }


  console.log(validation)
  console.log(namespace)
  console.log(svarYtelseTilForeldreloese)


  //TODO: VALIDATION


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
                error={validation[namespace + '-barnet-identifisering']?.feilmelding}
                namespace={namespace}
                id='barnet-identifisering'
                label={t('label:identifisering-av-de-beroerte-barna')}
                hideLabel={true}
                onChanged={(v) => setYtelseTilForeldreloeseProperty('identifiseringFritekst', v)}
                value={(svarYtelseTilForeldreloese as SvarYtelseTilForeldreloese_V42)?.annenPerson?.identifiseringFritekst ?? ''}
              />
            </TextAreaDiv>
          </Box>
        }
        {CDM_VERSJON === "4.3" &&
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
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
  )
}

export default IdentifiseringAvDenAvdoede
