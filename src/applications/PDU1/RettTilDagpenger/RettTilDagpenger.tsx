import { Checkbox, Heading, Radio, RadioGroup } from '@navikt/ds-react'
import { AlignStartRow, Column, FlexStartDiv, PaddedDiv, VerticalSeparatorDiv, HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import {
  validateRettTilDagpenger,
  ValidationRettTilDagpengerProps
} from 'applications/PDU1/RettTilDagpenger/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { IkkeRettTilDagpenger, PDU1, RettTilDagpenger } from 'declarations/pd'
import { State } from 'declarations/reducers'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import DateField from "components/DateField/DateField";
import styled from "styled-components";

type RettTilDagpengerRadio = 'rettTilDagpenger' | 'ikkeRettTilDagpenger' | undefined

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

export const FullWidthFlexStart = styled(FlexStartDiv)`
  width: 100%;
  margin-right: 3.5rem;
`


const RettTilDagpengerFC: React.FC<MainFormProps> = ({
  parentNamespace,
  replySed,
  setReplySed
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const rettTilDagpenger: RettTilDagpenger | undefined = _.get(replySed, 'rettTilDagpenger')
  const ikkeRettTilDagpenger: IkkeRettTilDagpenger | undefined = _.get(replySed, 'ikkeRettTilDagpenger')
  const namespace = `${parentNamespace}-retttildagpenger`
  const [_toggleDateError, _setToggleDateError] = useState<boolean>(false)

  const [rettTilDagpengerRadio, setRettTilDagpengerRadio] = useState<RettTilDagpengerRadio>(() =>
    !_.isEmpty(rettTilDagpenger) ? 'rettTilDagpenger' : !_.isEmpty(ikkeRettTilDagpenger) ? 'ikkeRettTilDagpenger' : undefined
  )

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationRettTilDagpengerProps>(
      clonedvalidation, namespace, validateRettTilDagpenger, {
        rettTilDagpenger,
        ikkeRettTilDagpenger
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const onRettTilDagpengerRadioChange = (value: string | number | boolean) => {
    const newReplySed: PDU1 = _.cloneDeep(replySed) as PDU1
    _setToggleDateError(!_toggleDateError)
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
          <HorizontalSeparatorDiv size={"3.5"}/>
          <FullWidthFlexStart>
            <Column>
              <DateField
                error={validation[namespace + '-startdato']?.feilmelding}
                namespace={namespace}
                id='startdato'
                label={t('label:startdato')}
                onChanged={onStartdatoChange}
                dateValue={rettTilDagpenger?.startdato}
                finalFormat={"DD.MM.YYYY"}
                resetError={_toggleDateError}
              />
            </Column>
            <Column>
              <DateField
                error={validation[namespace + '-sluttdato']?.feilmelding}
                id='sluttdato'
                namespace={namespace}
                label={t('label:sluttdato')}
                onChanged={onSluttdatoChange}
                dateValue={rettTilDagpenger?.sluttdato}
                finalFormat={"DD.MM.YYYY"}
                resetError={_toggleDateError}
              />
            </Column>
          </FullWidthFlexStart>
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
