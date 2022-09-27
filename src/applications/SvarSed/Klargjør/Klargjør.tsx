import { Heading } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  PaddedDiv,
  RadioPanel,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
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
    dispatch(updateReplySed('del', del.trim()))
    if (validation[namespace + '-del']) {
      dispatch(resetValidation(namespace + '-del'))
    }
  }

  const setPunkt = (punkt: string) => {
    dispatch(updateReplySed('punkt', punkt.trim()))
    if (validation[namespace + '-punkt']) {
      dispatch(resetValidation(namespace + '-punkt'))
    }
  }

  const setGrunn = (grunn: string) => {
    dispatch(updateReplySed('grunn', grunn.trim()))
    if (validation[namespace + '-grunn']) {
      dispatch(resetValidation(namespace + '-grunn'))
    }
  }

  const setGrunnAnnet = (grunnAnnet: string) => {
    dispatch(updateReplySed('grunnAnnet', grunnAnnet.trim()))
    if (validation[namespace + '-grunnAnnet']) {
      dispatch(resetValidation(namespace + '-grunnAnnet'))
    }
  }

  return (
    <PaddedDiv>
      <Heading size='small'>
        {label}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column>
          <Input
            error={validation[namespace + '-del']?.feilmelding}
            namespace={namespace}
            id='del'
            label={t('label:del')}
            onChanged={setDel}
            required
            value={(replySed as X012Sed).del}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column>
          <Input
            error={validation[namespace + '-punkt']?.feilmelding}
            namespace={namespace}
            id='punkt'
            label={t('label:punkt')}
            onChanged={setPunkt}
            required
            value={(replySed as X012Sed).punkt}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column flex='2'>
          <RadioPanelGroup
            defaultValue={(replySed as X012Sed).grunn}
            data-no-border
            data-testid={namespace + '-grunn'}
            error={validation[namespace + '-grunn']?.feilmelding}
            id={namespace + '-grunn'}
            legend={t('label:grunn')}
            hideLabel={false}
            required
            name={namespace + '-grunn'}
            onChange={setGrunn}
          >
            <RadioPanel value='01'>{t('el:option-klargjør-01')}</RadioPanel>
            <RadioPanel value='02'>{t('el:option-klargjør-02')}</RadioPanel>
            <RadioPanel value='03'>{t('el:option-klargjør-03')}</RadioPanel>
            <RadioPanel value='04'>{t('el:option-klargjør-04')}</RadioPanel>
            <RadioPanel value='99'>{t('el:option-klargjør-99')}</RadioPanel>
          </RadioPanelGroup>
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      {(replySed as X012Sed).grunn === '99' && (
        <AlignStartRow>
          <Column>
            <Input
              error={validation[namespace + '-grunnAnnet']?.feilmelding}
              namespace={namespace}
              id='grunnAnnet'
              label={t('label:annet')}
              hideLabel
              onChanged={setGrunnAnnet}
              required
              value={(replySed as X012Sed).grunnAnnet}
            />
          </Column>
        </AlignStartRow>
      )}
    </PaddedDiv>
  )
}

export default Klargjør
