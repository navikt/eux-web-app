import {Box, Heading, HGrid, Label, RadioGroup, VStack} from '@navikt/ds-react'
import RadioPanel from 'components/RadioPanel/RadioPanel'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import {
  getSvarType,
  SvarType,
  validateSvarPåForespørsel,
  ValidationSvarPåForespørselProps
} from 'applications/SvarSed/SvarPåForespørsel/validation'
import TextArea from 'components/Forms/TextArea'
import { State } from 'declarations/reducers'
import { Bruker, H002Sed, NegativtSvar, PositivtSvar } from 'declarations/h002'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { useState, JSX } from 'react';
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const SvarPåForespørsel: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  setReplySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationSvarPåForespørselProps>(
      clonedValidation, namespace, validateSvarPåForespørsel, {
        replySed,
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const [_svar, _setSvar] = useState<SvarType | undefined>(() => getSvarType(replySed))

  const bruker: Bruker | undefined = (replySed as H002Sed)?.bruker
  const positivtSvar: PositivtSvar | undefined = bruker?.positivtSvar
  const allNegativtSvar: Array<NegativtSvar> = bruker?.negativtSvar ?? []
  // while answering negatively, this editor owns the first negative answer. All other entries are left as they are
  const negativtSvar: NegativtSvar | undefined = _svar === 'negativt' ? allNegativtSvar[0] : undefined

  const switchSvar = (newSvar: SvarType) => {
    const newBruker: Bruker = { ...(bruker as Bruker) }
    if (newSvar === 'positivt') {
      newBruker.positivtSvar = {
        ...positivtSvar,
        informasjon: negativtSvar?.informasjon ?? '',
        dokument: negativtSvar?.dokument ?? '',
        sed: negativtSvar?.sed ?? ''
      }
      // the edited negative answer is moved to the positive one, the other negative answers stay
      const otherNegativtSvar = _svar === 'negativt' ? allNegativtSvar.slice(1) : allNegativtSvar
      if (otherNegativtSvar.length > 0) {
        newBruker.negativtSvar = otherNegativtSvar
      } else {
        delete newBruker.negativtSvar
      }
    } else {
      // the positive answer is moved to a new first negative answer, existing negative answers stay
      newBruker.negativtSvar = [
        {
          informasjon: positivtSvar?.informasjon ?? '',
          dokument: positivtSvar?.dokument ?? '',
          sed: positivtSvar?.sed ?? ''
        },
        ...allNegativtSvar
      ]
      delete newBruker.positivtSvar
    }
    dispatch(setReplySed!({
      ...(replySed as H002Sed),
      bruker: newBruker
    }))
  }

  const syncWithReplySed = (needle: 'informasjon' | 'dokument' | 'sed' | 'grunn', value: string) => {
    const target = _svar === 'positivt' ? 'bruker.positivtSvar' : 'bruker.negativtSvar[0]'
    dispatch(updateReplySed(`${target}.${needle}`, value))
  }

  const namespace = `${parentNamespace}-${personID}-svarpåforespørsel`

  const setSvar = (newSvar: SvarType) => {
    _setSvar(newSvar)
    switchSvar(newSvar)
    if (validation[namespace + '-svar']) {
      dispatch(resetValidation(namespace + '-svar'))
    }
  }

  const setDokument = (newDokument: string) => {
    syncWithReplySed('dokument', newDokument.trim())
    if (validation[namespace + '-dokument']) {
      dispatch(resetValidation(namespace + '-dokument'))
    }
  }

  const setInformasjon = (newInformasjon: string) => {
    syncWithReplySed('informasjon', newInformasjon.trim())
    if (validation[namespace + '-informasjon']) {
      dispatch(resetValidation(namespace + '-informasjon'))
    }
  }

  const setSed = (newSed: string) => {
    syncWithReplySed('sed', newSed.trim())
    if (validation[namespace + '-sed']) {
      dispatch(resetValidation(namespace + '-sed'))
    }
  }

  const setGrunn = (newGrunn: string) => {
    syncWithReplySed('grunn', newGrunn.trim())
    if (validation[namespace + '-grunn']) {
      dispatch(resetValidation(namespace + '-grunn'))
    }
  }

  const data: PositivtSvar | NegativtSvar | undefined = _svar === 'positivt' ? positivtSvar : negativtSvar

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>
        <div>
          <Label>
            {t('label:choose')}
          </Label>
          <RadioGroup
            value={_svar}
            data-testid={namespace + '-svar'}
            error={validation[namespace + '-svar']?.feilmelding}
            id={namespace + '-svar'}
            legend={t('label:choose')}
            hideLegend
            onChange={(e: string) => {
              if (e !== _svar) {
                setSvar(e as SvarType)
              }
            }}
          >
            <HGrid columns={2} gap="space-16" align="start">
              <RadioPanel description={t('message:help-jeg-kan-sende')} value='positivt'>
                {t('el:option-svar-1')}
              </RadioPanel>
              <RadioPanel description={t('message:help-jeg-kan-ikke-sende')} value='negativt'>
                {t('el:option-svar-2')}
              </RadioPanel>
            </HGrid>
          </RadioGroup>
        </div>

        {!_.isNil(_svar) && (
          <>
            <TextArea
              maxLength={255}
              error={validation[namespace + '-dokument']?.feilmelding}
              namespace={namespace}
              id='dokument'
              label={t('label:vi-vedlegger-dokumenter')}
              onChanged={setDokument}
              value={data?.dokument ?? ''}
            />
            <TextArea
              maxLength={255}
              error={validation[namespace + '-informasjon']?.feilmelding}
              namespace={namespace}
              id='informasjon'
              label={t('label:vi-sender-informasjon')}
              onChanged={setInformasjon}
              value={data?.informasjon ?? ''}
            />
           <TextArea
              maxLength={65}
              error={validation[namespace + '-sed']?.feilmelding}
              namespace={namespace}
              id='sed'
              label={t('label:sed')}
              onChanged={setSed}
              value={data?.sed ?? ''}
            />
          </>
        )}

        {_svar === 'negativt' && (
          <TextArea
            maxLength={255}
            error={validation[namespace + '-grunn']?.feilmelding}
            namespace={namespace}
            id='grunn'
            label={t('label:grunn')}
            onChanged={setGrunn}
            value={negativtSvar?.grunn ?? ''}
          />
        )}
      </VStack>
    </Box>
  )
}

export default SvarPåForespørsel
