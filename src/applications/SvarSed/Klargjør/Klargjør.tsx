import {Box, Heading, Radio, RadioGroup, VStack} from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Input from 'components/Forms/Input'
import { State } from 'declarations/reducers'
import { X012Sed } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateKlargjør, ValidationKlargjørProps } from './validation'
import commonStyles from "assets/css/common.module.css"

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Klargjør: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-klargjør`

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationKlargjørProps>(
      clonedValidation, namespace, validateKlargjør, {
        replySed: (replySed as X012Sed),
        personName
      }
    )
    dispatch(setValidation(clonedValidation))
  })

  const setDel = (del: string) => {
    dispatch(updateReplySed('klargjoerInfo[0].del', del.trim()))
    if (validation[namespace + '-del']) {
      dispatch(resetValidation(namespace + '-del'))
    }
  }

  const setPunkt = (punkt: string) => {
    dispatch(updateReplySed('klargjoerInfo[0].punkt', punkt.trim()))
    if (validation[namespace + '-punkt']) {
      dispatch(resetValidation(namespace + '-punkt'))
    }
  }

  const setGrunn = (grunn: string) => {
    dispatch(updateReplySed('klargjoerInfo[0].begrunnelseType', grunn.trim()))
    if (grunn !== 'annet') {
      dispatch(updateReplySed('klargjoerInfo[0].begrunnelseAnnen', ''))
    }
    if (validation[namespace + '-grunn']) {
      dispatch(resetValidation(namespace + '-grunn'))
    }
  }

  const setGrunnAnnet = (grunnAnnet: string) => {
    dispatch(updateReplySed('klargjoerInfo[0].begrunnelseAnnen', grunnAnnet.trim()))
    if (validation[namespace + '-grunnAnnet']) {
      dispatch(resetValidation(namespace + '-grunnAnnet'))
    }
  }

  const klargjoerInfoItem = (replySed as X012Sed).klargjoerInfo && (replySed as X012Sed).klargjoerInfo[0];

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        <Input
          error={validation[namespace + '-del']?.feilmelding}
          namespace={namespace}
          id='del'
          label={t('label:del')}
          onChanged={setDel}
          required
          value={klargjoerInfoItem?.del}
        />
        <Input
          error={validation[namespace + '-punkt']?.feilmelding}
          namespace={namespace}
          id='punkt'
          label={t('label:punkt')}
          onChanged={setPunkt}
          required
          value={klargjoerInfoItem?.punkt}
        />
        <RadioGroup
          defaultValue={klargjoerInfoItem?.begrunnelseType}
          data-no-border
          data-testid={namespace + '-grunn'}
          error={validation[namespace + '-grunn']?.feilmelding}
          id={namespace + '-grunn'}
          legend={t('label:grunn')}
          required
          name={namespace + '-grunn'}
          onChange={setGrunn}
        >
          <Radio className={commonStyles.radioPanel} value='informasjon_påkrevd_for_vår_nasjonale_undersøkelse'>{t('el:option-klargjør-01')}</Radio>
          <Radio className={commonStyles.radioPanel} value='informasjon_påkrevd_for_beregning_av_ytelse'>{t('el:option-klargjør-02')}</Radio>
          <Radio className={commonStyles.radioPanel} value='motstridende_informasjon_mottatt'>{t('el:option-klargjør-03')}</Radio>
          <Radio className={commonStyles.radioPanel} value='det_må_vedlegges_støttedokumentasjon_belegg'>{t('el:option-klargjør-04')}</Radio>
          <Radio className={commonStyles.radioPanel} value='annet'>{t('el:option-klargjør-99')}</Radio>
        </RadioGroup>
        {klargjoerInfoItem?.begrunnelseType === 'annet' && (
          <Input
            error={validation[namespace + '-grunnAnnet']?.feilmelding}
            namespace={namespace}
            id='grunnAnnet'
            label={t('label:annet')}
            hideLabel
            onChanged={setGrunnAnnet}
            required
            value={klargjoerInfoItem?.begrunnelseAnnen}
          />
         )
        }
      </VStack>
    </Box>
  )
}

export default Klargjør
