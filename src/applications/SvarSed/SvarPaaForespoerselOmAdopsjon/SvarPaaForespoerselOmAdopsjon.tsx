import {VStack, Box, Heading} from '@navikt/ds-react'
import {Column, PaddedDiv, Row} from '@navikt/hoykontrast'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import React from 'react'
import { useAppDispatch, useAppSelector } from 'store'
import {TextAreaDiv} from "../../../components/StyledComponents";
import TextArea from "../../../components/Forms/TextArea";
import {SvarAdopsjon} from "../../../declarations/sed";
import DateField from "../../../components/DateField/DateField";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const SvarPaaForespoerselOmAdopsjon: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  replySed,
  updateReplySed,
  options
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-svarpaaforespoerselomadopsjon`
  const target = `anmodningOmMerInformasjon.svar.adopsjon`
  const svarAdopsjon: SvarAdopsjon | undefined = _.get(replySed, target)

  const setYtterligeInfo = (newInfo: string) => {
    dispatch(updateReplySed(`${target}.ytterligereInformasjon`, newInfo.trim()))
  }

  //TODO: LABELS --> TRANSLATION FILES
  //TODO: SET-METHODS for dates

  return (
    <PaddedDiv>
      <VStack gap="4">
        <Heading size='small'>
          {label} (CDM-{options.cdmVersjon})
        </Heading>
        <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
          <Row>
            <Column flex={1}>
              <DateField
                error={validation[namespace + '-adoptivforeldreOmsorgFradato']?.feilmelding}
                namespace={namespace}
                id='adoptivforeldreOmsorgFradato'
                label={"Dato da adoptivforeldrene fikk omsorg for det adopterte barnet"}
                onChanged={()=>{}}
                dateValue={svarAdopsjon?.adoptivforeldreOmsorgFradato}
              />
            </Column>
            <Column flex={1}>
              <DateField
                error={validation[namespace + '-bevillingRegistreringsdato']?.feilmelding}
                namespace={namespace}
                id='bevillingRegistreringsdato'
                label={"Dato da adopsjonsbevillingen ble offentlig registrert"}
                onChanged={()=>{}}
                dateValue={svarAdopsjon?.bevillingRegistreringsdato}
              />
            </Column>
          </Row>
        </Box>
        <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
          <TextAreaDiv>
            <TextArea
              error={validation[namespace + '-ytterligereInfo']?.feilmelding}
              namespace={namespace}
              id='ytterligereInfo'
              label="Ytterligere informasjon"
              onChanged={setYtterligeInfo}
              value={svarAdopsjon?.ytterligereInformasjon}
            />
          </TextAreaDiv>
        </Box>
      </VStack>
    </PaddedDiv>
  )
}

export default SvarPaaForespoerselOmAdopsjon
