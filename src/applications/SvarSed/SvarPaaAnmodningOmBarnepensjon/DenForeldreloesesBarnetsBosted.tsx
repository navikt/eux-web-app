import {VStack, Box, Heading} from '@navikt/ds-react'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import React from 'react'
import {useAppDispatch, useAppSelector} from 'store'
import {Adresse, SvarYtelseTilForeldreloese_V42, SvarYtelseTilForeldreloese_V43} from "declarations/sed";
import {TextAreaDiv} from "components/StyledComponents";
import TextArea from "components/Forms/TextArea";
import {useTranslation} from "react-i18next";
import {resetValidation, setValidation} from "../../../actions/validation";
import AdresseForm from "../Adresser/AdresseForm";
import useUnmount from "../../../hooks/useUnmount";
import performValidation from "../../../utils/performValidation";
import {
  validateForeldreloesesBarnetsBosted,
  ValidationYtelseTilForeldreloeseProps
} from "./validation";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const DenForeldreloesesBarnetsBosted: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed,
  options
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-ytelsetilforeldreloese-den-foreldreloeses-barnets-bosted`
  const target = `anmodningOmMerInformasjon.svar.ytelseTilForeldreloese.barnet`
  const svarYtelseTilForeldreloeseTarget = `anmodningOmMerInformasjon.svar.ytelseTilForeldreloese`
  const CDM_VERSJON = options.cdmVersjon
  const svarYtelseTilForeldreloese: SvarYtelseTilForeldreloese_V43 | SvarYtelseTilForeldreloese_V42 | undefined = _.get(replySed, svarYtelseTilForeldreloeseTarget)
  const adresse: Adresse = _.get(replySed, `${target}.adresse`)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationYtelseTilForeldreloeseProps>(clonedValidation, namespace, validateForeldreloesesBarnetsBosted, {
      svarYtelseTilForeldreloese,
      CDM_VERSJON
    }, true)
    console.log(clonedValidation)
    dispatch(setValidation(clonedValidation))
  })


  const setYtelseTilForeldreloeseProperty = (property: string, value: string) => {
    dispatch(updateReplySed(`${target}.${property}`, value.trim()))
  }

  const setAdresse = (adresse: Adresse, whatChanged: string | undefined) => {
    dispatch(updateReplySed(`${target}.adresse`, adresse))
    if (whatChanged && validation[namespace + '-' + whatChanged]) {
      dispatch(resetValidation(namespace + '-' + whatChanged))
    }
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
                error={validation[namespace + '-barnet-bosted']?.feilmelding}
                namespace={namespace}
                id='barnet-bosted'
                label={t('label:den-foreldreloeses-barnets-bosted')}
                hideLabel={true}
                onChanged={(v) => setYtelseTilForeldreloeseProperty('bostedfritekst', v)}
                value={(svarYtelseTilForeldreloese as SvarYtelseTilForeldreloese_V42)?.barnet?.bostedfritekst ?? ''}
              />
            </TextAreaDiv>
          </Box>
        }
        {(parseFloat(CDM_VERSJON) >= 4.3) &&
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
            <AdresseForm
              type={false}
              required={['by', 'land']}
              keyForCity='by'
              keyforZipCode='postnummer'
              namespace={namespace}
              adresse={adresse}
              onAdressChanged={setAdresse}
              validation={validation}
            />
          </Box>
        }
      </VStack>
    </Box>
  )
}

export default DenForeldreloesesBarnetsBosted
