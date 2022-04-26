import { Delete } from '@navikt/ds-icons'
import { resetValidation } from 'actions/validation'
import { TwoLevelFormProps, TwoLevelFormSelector } from 'applications/SvarSed/TwoLevelForm'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { Button, Heading } from '@navikt/ds-react'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Option } from 'declarations/app.d'

const mapState = (state: State): TwoLevelFormSelector => ({
  validation: state.validation.status
})

const GrunnTilOpphør: React.FC<TwoLevelFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
}:TwoLevelFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useSelector<State, TwoLevelFormSelector>(mapState)
  const dispatch = useDispatch()
  const target = 'grunntilopphor'
  const grunntilopphor: any = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-grunntilopphør`

  const [_typeGrunnOpphoerAnsatt, _setTypeGrunnOpphoerAnsatt] = useState<string | undefined>(undefined)

  const årsakOptions: Options = [
    { label: t('el:option-grunntilopphør-oppsagt_av_arbeidsgiver'), value: '01' },
    { label: t('el:option-grunntilopphør-arbeidstaker_har_sagt_opp_selv'), value: '02' },
    { label: t('el:option-grunntilopphør-kontrakten_utløpt'), value: '03' },
    { label: t('el:option-grunntilopphør-avsluttet_etter_felles_overenskomst'), value: '04' },
    { label: t('el:option-grunntilopphør-avskjediget_av_disiplinære_grunner'), value: '05' },
    { label: t('el:option-grunntilopphør-overtallighet'), value: '06' },
    { label: t('el:option-grunntilopphør-ukjent'), value: '98' },
    { label: t('el:option-grunntilopphør-annet'), value: '99' }
  ]

  const setTypeGrunnOpphoerAnsatt = (typeGrunnOpphoerAnsatt: string) => {
    _setTypeGrunnOpphoerAnsatt(typeGrunnOpphoerAnsatt)
    dispatch(updateReplySed(`${target}.typeGrunnOpphoerAnsatt`, typeGrunnOpphoerAnsatt))
    if (validation[namespace + '-typeGrunnOpphoerAnsatt']) {
      dispatch(resetValidation(namespace + '-typeGrunnOpphoerAnsatt'))
    }
  }

  const setAnnenGrunnOpphoerAnsatt = (annenGrunnOpphoerAnsatt: string) => {
    dispatch(updateReplySed(`${target}.annenGrunnOpphoerAnsatt`, annenGrunnOpphoerAnsatt))
    if (validation[namespace + '-annenGrunnOpphoerAnsatt']) {
      dispatch(resetValidation(namespace + '-annenGrunnOpphoerAnsatt'))
    }
  }

  const setGrunnOpphoerSelvstendig = (grunnOpphoerSelvstendig: string) => {
    dispatch(updateReplySed(`${target}.grunnOpphoerSelvstendig`, grunnOpphoerSelvstendig))
    if (validation[namespace + '-grunnOpphoerSelvstendig']) {
      dispatch(resetValidation(namespace + '-grunnOpphoerSelvstendig'))
    }
  }

  const value = _.find(årsakOptions, b => b.value === grunntilopphor?.typeGrunnOpphoerAnsatt) || null

  return (
    <PaddedDiv>
      <Heading size='small'>
        {t('label:grunn-til-opphør')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column flex='3'>
          <Select
            data-testid={namespace + '-typeGrunnOpphoerAnsatt'}
            error={validation[namespace + '-typeGrunnOpphoerAnsatt']?.feilmelding}
            id={namespace + '-typeGrunnOpphoerAnsatt'}
            label={t('label:årsak-til-avslutning-av-arbeidsforhold')}
            menuPortalTarget={document.body}
            onChange={(o: unknown) => setTypeGrunnOpphoerAnsatt((o as Option).value)}
            options={årsakOptions}
            value={value}
            defaultValue={value}
          />
        </Column>
        <Column>
          <div style={{paddingTop: '2rem'}}>
          <Button
            variant='tertiary'
            onClick={() => setTypeGrunnOpphoerAnsatt('')}
          >
            <Delete/>
            {t('el:button-clear')}
          </Button>
          </div>
        </Column>

      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      {_typeGrunnOpphoerAnsatt === '99' && (
        <>
          <AlignStartRow>
            <Column>
              <Input
                error={validation[namespace + '-annenGrunnOpphoerAnsatt']?.feilmelding}
                namespace={namespace}
                id='annenGrunnOpphoerAnsatt'
                label={t('label:annet-opphør') + ' *'}
                onChanged={setAnnenGrunnOpphoerAnsatt}
                value={grunntilopphor?.annenGrunnOpphoerAnsatt ?? ''}
              />
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
          <AlignStartRow>
            <Column>
              <Input
                error={validation[namespace + '-årsakselvstendig']?.feilmelding}
                namespace={namespace}
                id='grunnOpphoerSelvstendig'
                label={t('label:årsak-til-avslutning-av-selvstendig-næringsvirksomhet') + ' *'}
                onChanged={setGrunnOpphoerSelvstendig}
                value={grunntilopphor?.grunnOpphoerSelvstendig ?? ''}
              />
            </Column>
          </AlignStartRow>
        </>
      )}
    </PaddedDiv>
  )
}

export default GrunnTilOpphør
