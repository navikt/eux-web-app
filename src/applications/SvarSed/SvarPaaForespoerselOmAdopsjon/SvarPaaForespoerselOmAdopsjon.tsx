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
import {useTranslation} from "react-i18next";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const SvarPaaForespoerselOmAdopsjon: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  replySed,
  updateReplySed,
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-svarpaaforespoerselomadopsjon`
  const target = `anmodningOmMerInformasjon.svar.adopsjon`
  const svarAdopsjon: SvarAdopsjon | undefined = _.get(replySed, target)

  const setAdopsjonProperty = (property: string, value: string) => {
    dispatch(updateReplySed(`${target}.${property}`, value.trim()))
  }

  //TODO: VALIDATION


  return (
    <PaddedDiv>
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
          <Row>
            <Column flex={1}>
              <DateField
                error={validation[namespace + '-adoptivforeldreOmsorgFradato']?.feilmelding}
                namespace={namespace}
                id='adoptivforeldreOmsorgFradato'
                label={t('dato-adoptivforeldre-omsorg-fradato')}
                onChanged={(v) => setAdopsjonProperty('adoptivforeldreOmsorgFradato', v)}
                dateValue={svarAdopsjon?.adoptivforeldreOmsorgFradato}
              />
            </Column>
            <Column flex={1}>
              <DateField
                error={validation[namespace + '-bevillingRegistreringsdato']?.feilmelding}
                namespace={namespace}
                id='bevillingRegistreringsdato'
                label={t('label:dato-bevilling-registrering')}
                onChanged={(v) => setAdopsjonProperty('bevillingRegistreringsdato', v)}
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
              label={t('label:extra-information')}
              onChanged={(v) => setAdopsjonProperty('ytterligereInformasjon', v)}
              value={svarAdopsjon?.ytterligereInformasjon}
            />
          </TextAreaDiv>
        </Box>
      </VStack>
    </PaddedDiv>
  )
}

export default SvarPaaForespoerselOmAdopsjon
