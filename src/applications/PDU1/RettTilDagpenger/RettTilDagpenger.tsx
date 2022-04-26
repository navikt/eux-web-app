import { Checkbox, Heading, Radio, RadioGroup } from '@navikt/ds-react'
import { resetValidation } from 'actions/validation'
import { TwoLevelFormProps, TwoLevelFormSelector } from 'applications/SvarSed/TwoLevelForm'
import Input from 'components/Forms/Input'
import { IkkeRettTilDagpenger, PDU1, RettTilDagpenger } from 'declarations/pd'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { AlignStartRow, Column, FlexEndDiv, PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'

type RettTilDagpengerRadio = 'rettTilDagpenger' | 'ikkeRettTilDagpenger' | undefined

const mapState = (state: State): TwoLevelFormSelector => ({
  validation: state.validation.status
})

const RettTilDagpengerFC: React.FC<TwoLevelFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  setReplySed
}: TwoLevelFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const rettTilDagpenger: RettTilDagpenger | undefined = _.get(replySed, 'rettTilDagpenger')
  const ikkeRettTilDagpenger: IkkeRettTilDagpenger | undefined = _.get(replySed, 'ikkeRettTilDagpenger')
  const namespace = `${parentNamespace}-${personID}-rettTilDagpenger`

  const [rettTilDagpengerRadio, setRettTilDagpengerRadio] = useState<RettTilDagpengerRadio>(() =>
    !_.isEmpty(rettTilDagpenger) ? 'rettTilDagpenger' : !_.isEmpty(ikkeRettTilDagpenger) ? 'ikkeRettTilDagpenger' : undefined
  )

  const onRettTilDagpengerRadioChange = (value: string | number | boolean) => {
    const newReplySed: PDU1 = _.cloneDeep(replySed) as PDU1
    if (value as string === 'rettTilDagpenger') {
      delete newReplySed.ikkeRettTilDagpenger
      newReplySed.rettTilDagpenger = {
        ihhTilArtikkel64: 'nei',
        ihhTilArtikkel65: 'nei'
      }
    } else {
      delete newReplySed.rettTilDagpenger
      newReplySed.ikkeRettTilDagpenger = {
        ihhTilLovgivning: 'nei',
        ikkeSoekt: 'nei'
      }
    }
    setRettTilDagpengerRadio(value as RettTilDagpengerRadio)
    dispatch(setReplySed!(newReplySed))
  }

  const onStartdatoChange = (newStartdato: string) => {
    const newReplySed: PDU1 = _.cloneDeep(replySed) as PDU1
    delete newReplySed.ikkeRettTilDagpenger
    setRettTilDagpengerRadio('rettTilDagpenger')
    _.set(newReplySed, 'rettTilDagpenger.startdato', newStartdato.trim())
    dispatch(setReplySed!(newReplySed))
    if (validation[namespace + '-rettTilDagpenger-startdato']) {
      dispatch(resetValidation(namespace + '-rettTilDagpenger-startdato'))
    }
  }

  const onSluttdatoChange = (newSluttdato: string) => {
    const newReplySed: PDU1 = _.cloneDeep(replySed) as PDU1
    delete newReplySed.ikkeRettTilDagpenger
    setRettTilDagpengerRadio('rettTilDagpenger')
    _.set(newReplySed, 'rettTilDagpenger.sluttdato', newSluttdato.trim())
    dispatch(setReplySed!(newReplySed))
    if (validation[namespace + '-rettTilDagpenger-sluttdato']) {
      dispatch(resetValidation(namespace + '-rettTilDagpenger-sluttdato'))
    }
  }

  const onIhhTilArtikkel64Change = (ihhTilArtikkel64: boolean) => {
    const newReplySed: PDU1 = _.cloneDeep(replySed) as PDU1
    delete newReplySed.ikkeRettTilDagpenger
    setRettTilDagpengerRadio('rettTilDagpenger')
    _.set(newReplySed, 'rettTilDagpenger.ihhTilArtikkel64', ihhTilArtikkel64 ? 'ja' : 'nei')
    dispatch(setReplySed!(newReplySed))
    if (validation[namespace + '-rettTilDagpenger-ihhTilArtikkel64']) {
      dispatch(resetValidation(namespace + '-rettTilDagpenger-ihhTilArtikkel64'))
    }
  }

  const onIhhTilArtikkel65Change = (ihhTilArtikkel65: boolean) => {
    const newReplySed: PDU1 = _.cloneDeep(replySed) as PDU1
    delete newReplySed.ikkeRettTilDagpenger
    setRettTilDagpengerRadio('rettTilDagpenger')
    _.set(newReplySed, 'rettTilDagpenger.ihhTilArtikkel65', ihhTilArtikkel65 ? 'ja' : 'nei')
    dispatch(setReplySed!(newReplySed))
    if (validation[namespace + '-rettTilDagpenger-ihhTilArtikkel65']) {
      dispatch(resetValidation(namespace + '-rettTilDagpenger-ihhTilArtikkel65'))
    }
  }

  // Ikke rett til dagpenger

  const onIhhTilLovgivningChange = (ihhTilLovgivning: boolean) => {
    const newReplySed: PDU1 = _.cloneDeep(replySed) as PDU1
    delete newReplySed.rettTilDagpenger
    setRettTilDagpengerRadio('ikkeRettTilDagpenger')
    _.set(newReplySed, 'ikkeRettTilDagpenger.ihhTilLovgivning', ihhTilLovgivning ? 'ja' : 'nei')
    dispatch(setReplySed!(newReplySed))
    if (validation[namespace + '-rettTilDagpenger-ihhTilLovgivning']) {
      dispatch(resetValidation(namespace + '-rettTilDagpenger-ihhTilLovgivning'))
    }
  }

  const onIkkeSoektChange = (ikkeSoekt: boolean) => {
    const newReplySed: PDU1 = _.cloneDeep(replySed) as PDU1
    delete newReplySed.rettTilDagpenger
    setRettTilDagpengerRadio('ikkeRettTilDagpenger')
    _.set(newReplySed, 'ikkeRettTilDagpenger.ikkeSoekt', ikkeSoekt ? 'ja' : 'nei')
    dispatch(setReplySed!(newReplySed))
    if (validation[namespace + '-rettTilDagpenger-ikkeSoekt']) {
      dispatch(resetValidation(namespace + '-rettTilDagpenger-ikkeSoekt'))
    }
  }

  return (
    <PaddedDiv key={namespace + '-div'}>
      <Heading size='medium'>
        {t('label:rett-til-dagpenger')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <RadioGroup
        value={rettTilDagpengerRadio}
        data-testid={namespace + '-rettTilDagpengerRadio'}
        error={!!validation[namespace + '-rettTilDagpengerRadio']?.feilmelding}
        id={namespace + '-rettTilDagpengerRadio'}
        key={namespace + '-rettTilDagpengerRadio-' + rettTilDagpengerRadio}
        legend={t('label:rett-til-dagpenger')}
        name={namespace + '-rettTilDagpengerRadio'}
        onChange={onRettTilDagpengerRadioChange}
      >
        <AlignStartRow>
          <Column>
            <Radio value='rettTilDagpenger'>
              {t('el:checkbox-pdu1-6.1')}
            </Radio>
          </Column>
        </AlignStartRow>
        <AlignStartRow>
          <Column style={{ maxWidth: '40px' }} />
          <Column>
            <Checkbox
              checked={rettTilDagpenger?.ihhTilArtikkel64 === 'ja'}
              data-testid={namespace + '-ihhTilArtikkel64'}
              key={namespace + '-ihhTilArtikkel64-' + (rettTilDagpenger?.ihhTilArtikkel64 ?? '')}
              error={!!validation[namespace + '-ihhTilArtikkel64']?.feilmelding}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onIhhTilArtikkel64Change(e.target.checked)
              }}
            >
              {t('el:checkbox-pdu1-6.1.1')}
            </Checkbox>
          </Column>
        </AlignStartRow>
        <AlignStartRow>
          <Column style={{ maxWidth: '40px' }} />
          <Column>
            <Checkbox
              checked={rettTilDagpenger?.ihhTilArtikkel65 === 'ja'}
              data-testid={namespace + '-ihhTilArtikkel65'}
              key={namespace + '-ihhTilArtikkel65-' + (rettTilDagpenger?.ihhTilArtikkel65 ?? '')}
              error={!!validation[namespace + '-ihhTilArtikkel65']?.feilmelding}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onIhhTilArtikkel65Change(e.target.checked)
              }}
            >
              {t('el:checkbox-pdu1-6.1.2')}
            </Checkbox>
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column>
            <FlexEndDiv>
              <PaddedDiv size='0.5'>
                {t('label:for-perioden-fra')}
              </PaddedDiv>
              <Input
                ariaLabel={t('label:startdato')}
                error={validation[namespace + '-startdato']?.feilmelding}
                id='startdato'
                key={namespace + '-startdato-' + rettTilDagpenger?.startdato}
                label={t('label:startdato')}
                namespace={namespace}
                onChanged={onStartdatoChange}
                value={rettTilDagpenger?.startdato}
              />
              <PaddedDiv size='0.5'>{t('label:til').toLowerCase()}</PaddedDiv>
              <Input
                ariaLabel={t('label:sluttdato')}
                error={validation[namespace + '-sluttdato']?.feilmelding}
                id='sluttdato'
                key={namespace + '-sluttdato-' + rettTilDagpenger?.sluttdato}
                label={t('label:sluttdato')}
                namespace={namespace}
                onChanged={onSluttdatoChange}
                value={rettTilDagpenger?.sluttdato}
              />
            </FlexEndDiv>
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv size='2' />
        <AlignStartRow>
          <Column>
            <Radio value='ikkeRettTilDagpenger'>
              {t('el:checkbox-pdu1-6.2')}
            </Radio>
          </Column>
        </AlignStartRow>
        <AlignStartRow>
          <Column style={{ maxWidth: '40px' }} />
          <Column>
            <Checkbox
              checked={ikkeRettTilDagpenger?.ihhTilLovgivning === 'ja'}
              data-testid={namespace + '-ihhTilLovgivning'}
              key={namespace + '-ihhTilLovgivning-' + (ikkeRettTilDagpenger?.ihhTilLovgivning ?? '')}
              error={!!validation[namespace + '-ihhTilLovgivning']?.feilmelding}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onIhhTilLovgivningChange(e.target.checked)
              }}
            >
              {t('el:checkbox-pdu1-6.2.1')}
            </Checkbox>
          </Column>
        </AlignStartRow>
        <AlignStartRow>
          <Column style={{ maxWidth: '40px' }} />
          <Column>
            <Checkbox
              checked={ikkeRettTilDagpenger?.ikkeSoekt === 'ja'}
              data-testid={namespace + '-ikkeSoekt'}
              key={namespace + '-ikkeSoekt-' + (ikkeRettTilDagpenger?.ikkeSoekt ?? '')}
              error={!!validation[namespace + '-ikkeSoekt']?.feilmelding}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onIkkeSoektChange(e.target.checked)
              }}
            >
              {t('el:checkbox-pdu1-6.2.2')}
            </Checkbox>
          </Column>
        </AlignStartRow>
      </RadioGroup>
    </PaddedDiv>
  )
}

export default RettTilDagpengerFC
