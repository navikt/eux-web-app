import {VStack, Box, Heading} from '@navikt/ds-react'
import {PaddedDiv} from '@navikt/hoykontrast'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import React from 'react'
import {useAppDispatch, useAppSelector} from 'store'
import {SvarYtelseTilForeldreloese_V42} from "../../../declarations/sed";
import {TextAreaDiv} from "../../../components/StyledComponents";
import TextArea from "../../../components/Forms/TextArea";
import {useTranslation} from "react-i18next";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const SvarPaaAnmodningOmBarnepensjon: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed,
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-svarpaaanmodningombarnepensjon`
  const target = `anmodningOmMerInformasjon.svar.ytelseTilForeldreloese`
  const svarYtelseTilForeldreloese: SvarYtelseTilForeldreloese_V42 | undefined = _.get(replySed, target)

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
        <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
          <TextAreaDiv>
            <TextArea
              error={validation[namespace + '-avdoedefritekst']?.feilmelding}
              namespace={namespace}
              id='avdoedefritekst'
              label={t('label:identifisering-av-den-avdoede')}
              onChanged={(v) => setYtelseTilForeldreloeseProperty('identifisering.avdoedefritekst', v)}
              value={svarYtelseTilForeldreloese?.identifisering?.avdoedefritekst ?? ''}
            />
          </TextAreaDiv>
        </Box>
        <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
          <TextAreaDiv>
            <TextArea
              error={validation[namespace + '-barnafritekst']?.feilmelding}
              namespace={namespace}
              id='barnafritekst'
              label={t('label:identifisering-av-de-beroerte-barna')}
              onChanged={(v) => setYtelseTilForeldreloeseProperty('identifisering.barnafritekst', v)}
              value={svarYtelseTilForeldreloese?.identifisering?.barnafritekst ?? ''}
            />
          </TextAreaDiv>
        </Box>
        <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
          <TextAreaDiv>
            <TextArea
              error={validation[namespace + '-andrepersonerfritekst']?.feilmelding}
              namespace={namespace}
              id='andrepersonerfritekst'
              label={t('label:identifikasjon-av-andre-personer')}
              onChanged={(v) => setYtelseTilForeldreloeseProperty('identifisering.andrepersonerfritekst', v)}
              value={svarYtelseTilForeldreloese?.identifisering?.andrepersonerfritekst ?? ''}
            />
          </TextAreaDiv>
        </Box>
        <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
          <TextAreaDiv>
            <TextArea
              error={validation[namespace + '-bostedfritekst']?.feilmelding}
              namespace={namespace}
              id='bostedfritekst'
              label={t('label:den-foreldreloeses-barnets-bosted')}
              onChanged={(v) => setYtelseTilForeldreloeseProperty('barnet.bostedfritekst', v)}
              value={svarYtelseTilForeldreloese?.barnet?.bostedfritekst ?? ''}
            />
          </TextAreaDiv>
        </Box>
        <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
          <TextAreaDiv>
            <TextArea
              error={validation[namespace + '-avdoedefritekst']?.feilmelding}
              namespace={namespace}
              id='avdoedefritekst'
              label={t('label:identifisering-av-den-avdoede')}
              onChanged={(v) => setYtelseTilForeldreloeseProperty('identifisering.avdoedefritekst', v)}
              value={svarYtelseTilForeldreloese?.identifisering?.avdoedefritekst ?? ''}
            />
          </TextAreaDiv>
        </Box>
        <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
          <TextAreaDiv>
            <TextArea
              error={validation[namespace + '-avdoedefritekst']?.feilmelding}
              namespace={namespace}
              id='avdoedefritekst'
              label={t('label:identifisering-av-den-avdoede')}
              onChanged={(v) => setYtelseTilForeldreloeseProperty('identifisering.avdoedefritekst', v)}
              value={svarYtelseTilForeldreloese?.identifisering?.avdoedefritekst ?? ''}
            />
          </TextAreaDiv>
        </Box>
        <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
          <TextAreaDiv>
            <TextArea
              error={validation[namespace + '-avdoedefritekst']?.feilmelding}
              namespace={namespace}
              id='avdoedefritekst'
              label={t('label:identifisering-av-den-avdoede')}
              onChanged={(v) => setYtelseTilForeldreloeseProperty('identifisering.avdoedefritekst', v)}
              value={svarYtelseTilForeldreloese?.identifisering?.avdoedefritekst ?? ''}
            />
          </TextAreaDiv>
        </Box>
        <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
          <TextAreaDiv>
            <TextArea
              error={validation[namespace + '-avdoedefritekst']?.feilmelding}
              namespace={namespace}
              id='avdoedefritekst'
              label={t('label:identifisering-av-den-avdoede')}
              onChanged={(v) => setYtelseTilForeldreloeseProperty('identifisering.avdoedefritekst', v)}
              value={svarYtelseTilForeldreloese?.identifisering?.avdoedefritekst ?? ''}
            />
          </TextAreaDiv>
        </Box>
        <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
          <TextAreaDiv>
            <TextArea
              error={validation[namespace + '-avdoedefritekst']?.feilmelding}
              namespace={namespace}
              id='avdoedefritekst'
              label={t('label:identifisering-av-den-avdoede')}
              onChanged={(v) => setYtelseTilForeldreloeseProperty('identifisering.avdoedefritekst', v)}
              value={svarYtelseTilForeldreloese?.identifisering?.avdoedefritekst ?? ''}
            />
          </TextAreaDiv>
        </Box>
        <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
          <TextAreaDiv>
            <TextArea
              error={validation[namespace + '-avdoedefritekst']?.feilmelding}
              namespace={namespace}
              id='avdoedefritekst'
              label={t('label:identifisering-av-den-avdoede')}
              onChanged={(v) => setYtelseTilForeldreloeseProperty('identifisering.avdoedefritekst', v)}
              value={svarYtelseTilForeldreloese?.identifisering?.avdoedefritekst ?? ''}
            />
          </TextAreaDiv>
        </Box>
        <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
          <TextAreaDiv>
            <TextArea
              error={validation[namespace + '-avdoedefritekst']?.feilmelding}
              namespace={namespace}
              id='avdoedefritekst'
              label={t('label:identifisering-av-den-avdoede')}
              onChanged={(v) => setYtelseTilForeldreloeseProperty('identifisering.avdoedefritekst', v)}
              value={svarYtelseTilForeldreloese?.identifisering?.avdoedefritekst ?? ''}
            />
          </TextAreaDiv>
        </Box>
        <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
          <TextAreaDiv>
            <TextArea
              error={validation[namespace + '-avdoedefritekst']?.feilmelding}
              namespace={namespace}
              id='avdoedefritekst'
              label={t('label:identifisering-av-den-avdoede')}
              onChanged={(v) => setYtelseTilForeldreloeseProperty('identifisering.avdoedefritekst', v)}
              value={svarYtelseTilForeldreloese?.identifisering?.avdoedefritekst ?? ''}
            />
          </TextAreaDiv>
        </Box>
        <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
          <TextAreaDiv>
            <TextArea
              error={validation[namespace + '-avdoedefritekst']?.feilmelding}
              namespace={namespace}
              id='avdoedefritekst'
              label={t('label:identifisering-av-den-avdoede')}
              onChanged={(v) => setYtelseTilForeldreloeseProperty('identifisering.avdoedefritekst', v)}
              value={svarYtelseTilForeldreloese?.identifisering?.avdoedefritekst ?? ''}
            />
          </TextAreaDiv>
        </Box>
      </VStack>
    </PaddedDiv>
  )
}

export default SvarPaaAnmodningOmBarnepensjon
