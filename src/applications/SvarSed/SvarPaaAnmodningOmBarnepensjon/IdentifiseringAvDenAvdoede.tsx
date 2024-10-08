import {VStack, Box, Heading} from '@navikt/ds-react'
import {PaddedDiv} from '@navikt/hoykontrast'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import React from 'react'
import {useAppDispatch, useAppSelector} from 'store'
import {SvarYtelseTilForeldreloese_V42, SvarYtelseTilForeldreloese_V43} from "declarations/sed";
import {TextAreaDiv} from "components/StyledComponents";
import TextArea from "components/Forms/TextArea";
import {useTranslation} from "react-i18next";
import PersonOpplysninger from "../PersonOpplysninger/PersonOpplysninger";
import {setReplySed} from "../../../actions/svarsed";

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
  const namespace = `${parentNamespace}-ytelsetilforeldreloese-identifiseringavavdoede`
  const target = `anmodningOmMerInformasjon.svar.ytelseTilForeldreloese.avdoede`
  const CDM_VERSJON = options.cdmVersjon
  const svarYtelseTilForeldreloese: SvarYtelseTilForeldreloese_V43 | SvarYtelseTilForeldreloese_V42 | undefined = _.get(replySed, target)


  const setYtelseTilForeldreloeseProperty = (property: string, value: string) => {
    dispatch(updateReplySed(`${target}.${property}`, value.trim()))
  }


  console.log(validation)
  console.log(namespace)
  console.log(svarYtelseTilForeldreloese)


  //TODO: VALIDATION


  return (
    <PaddedDiv>
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        {CDM_VERSJON === "4.2" &&
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
            <TextAreaDiv>
              <TextArea
                error={validation[namespace + '-avdoede-identifisering']?.feilmelding}
                namespace={namespace}
                id='avdoede-identifisering'
                label={t('label:identifisering-av-den-avdoede')}
                hideLabel={true}
                onChanged={(v) => setYtelseTilForeldreloeseProperty('identifiseringFritekst', v)}
                value={(svarYtelseTilForeldreloese as SvarYtelseTilForeldreloese_V42)?.avdoede?.identifiseringFritekst ?? ''}
              />
            </TextAreaDiv>
          </Box>
        }
        {CDM_VERSJON === "4.3" &&
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
            <PersonOpplysninger
              label={"Personopplysninger"}
              setReplySed={setReplySed}
              replySed={replySed}
              personID={target}
              parentNamespace={namespace}
              updateReplySed={updateReplySed}
              options={{showFoedested: false}}
            />
          </Box>
        }
      </VStack>
    </PaddedDiv>
  )
}

export default IdentifiseringAvDenAvdoede
