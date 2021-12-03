import { Add } from '@navikt/ds-icons'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { Inntekt } from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import { Currency } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Button, Heading } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { getIdx } from 'utils/namespace'
import { validateInntekt, ValidationInntekterProps } from './validationInntekter'

const MyPaddedDiv = styled.div`
  padding: 0.5rem 0.5rem 0.5rem 2rem;
`

const Inntekter: React.FC<any> = ({
  highContrast,
  inntekter,
  onInntekterChanged,
  parentNamespace,
  validation
}:any): JSX.Element => {
  const { t } = useTranslation()

  const dispatch = useDispatch()

  const namespace = `${parentNamespace}-inntekt`

  const [_newInntektType, _setNewInntektType] = useState<string | undefined>(undefined)
  const [_newInformasjonOmVederlag, _setNewInformasjonOmVederlag] = useState<string | undefined>(undefined)
  const [_newBeløp, _setNewBeløp] = useState<string | undefined>(undefined)
  const [_newValuta, _setNewValuta] = useState<string | undefined>(undefined)

  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Inntekt>((it: Inntekt): string => it.type + '-' + it.beloep)
  const [_validation, resetValidation, performValidation] = useValidation<ValidationInntekterProps>({}, validateInntekt)

  const inntektTypeOptions = [
    { label: t('el:option-inntekttype-nettoinntekt'), value: 'nettoinntekt_under_ansettelsesforhold_eller_selvstendig_næringsvirksomhet' },
    { label: t('el:option-inntekttype-bruttoinntekt'), value: 'bruttoinntekt_under_ansettelsesforhold_eller_selvstendig_næringsvirksomhet' },
    { label: t('el:option-inntekttype-en-enkelt-utbetaling'), value: 'en_enkelt_utbetaling' },
    { label: t('el:option-inntekttype-overtidsgodtgjørelse'), value: 'overtidsgodtgjørelse' },
    { label: t('el:option-inntekttype-vederlag'), value: 'vederlag_for_ferie_som_ikke_er_tatt_ut' },
    { label: t('el:option-inntekttype-annet-vederlag'), value: 'annet_vederlag' }
  ]

  const onInntektTypeChanged = (type: string, index: number) => {
    if (index < 0) {
      _setNewInntektType(type.trim())
      resetValidation(namespace + '-type')
    } else {
      const newInntekter: Array<Inntekt> = _.cloneDeep(inntekter)
      newInntekter[index].type = type.trim()
      onInntekterChanged(newInntekter)
      if (validation[namespace + getIdx(index) + '-type']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-type'))
      }
    }
  }

  const onInformasjonOmVederlagChanged = (newInformasjonOmVederlag: string, index: number) => {
    if (index < 0) {
      _setNewInformasjonOmVederlag(newInformasjonOmVederlag.trim())
      resetValidation(namespace + '-informasjonOmVederlag')
    } else {
      const newInntekter: Array<Inntekt> = _.cloneDeep(inntekter)
      newInntekter[index].typeAnnen = newInformasjonOmVederlag.trim()
      onInntekterChanged(newInntekter)
      if (validation[namespace + getIdx(index) + '-informasjonOmVederlag']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-informasjonOmVederlag'))
      }
    }
  }

  const setBeløp = (newBeløp: string, index: number) => {
    if (index < 0) {
      _setNewBeløp(newBeløp.trim())
      resetValidation(namespace + '-beloep')
      if (_.isNil(_newValuta)) {
        setValuta({ value: 'NOK' } as Currency, index)
      }
    } else {
      const newInntekter: Array<Inntekt> = _.cloneDeep(inntekter)
      newInntekter[index].beloep = newBeløp.trim()
      onInntekterChanged(newInntekter)
      if (validation[namespace + '-beloep']) {
        dispatch(resetValidation(namespace + '-beloep'))
      }
      if (_.isNil(newInntekter[index]?.valuta)) {
        setValuta({ value: 'NOK' } as Currency, index)
      }
    }
  }

  const setValuta = (newValuta: Currency, index: number) => {
    if (index < 0) {
      _setNewValuta(newValuta.value)
      resetValidation(namespace + '-valuta')
    } else {
      const newInntekter: Array<Inntekt> = _.cloneDeep(inntekter)
      newInntekter[index].valuta = newValuta?.value
      onInntekterChanged(newInntekter)
      if (validation[namespace + '-valuta']) {
        dispatch(resetValidation(namespace + '-valuta'))
      }
    }
  }

  const resetForm = () => {
    _setNewInntektType(undefined)
    _setNewInformasjonOmVederlag(undefined)
    _setNewBeløp(undefined)
    _setNewValuta('NOK')
    resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemoved = (index: number) => {
    const newInntekter = _.cloneDeep(inntekter)
    const deletedInntekter: Array<Inntekt> = newInntekter.splice(index, 1)
    if (deletedInntekter && deletedInntekter.length > 0) {
      removeFromDeletion(deletedInntekter[0])
    }
    onInntekterChanged(newInntekter)
  }

  const onAdd = () => {
    const newInntekt: Inntekt = {
      type: _newInntektType?.trim() as string,
      typeAnnen: _newInformasjonOmVederlag?.trim() as string,
      beloep: _newBeløp?.trim() as string,
      valuta: _newValuta as string
    }

    const valid: boolean = performValidation({
      inntekt: newInntekt,
      namespace: namespace
    })

    if (valid) {
      let newInntekter = _.cloneDeep(inntekter)
      if (_.isNil(newInntekter)) {
        newInntekter = []
      }
      newInntekter.push(newInntekt)
      onInntekterChanged(newInntekter)
      resetForm()
    }
  }

  const getErrorFor = (index: number, el: string): string | undefined => {
    return index < 0
      ? _validation[namespace + '-' + el]?.feilmelding
      : validation[namespace + '[' + index + ']-' + el]?.feilmelding
  }

  const renderRow = (inntekt: Inntekt | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(inntekt)
    const idx = getIdx(index)
    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.1) + 's' }}
        >
          <Column>
            <Select
              closeMenuOnSelect
              data-test-id={namespace + '-type'}
              feil={validation[namespace + '-type']?.feilmelding}
              highContrast={highContrast}
              id={namespace + '-type'}
              key={namespace + '-type-' + (index < 0 ? _newInntektType : inntekt?.type ?? '')}
              label={t('label:type') + ' *'}
              menuPortalTarget={document.body}
              onChange={(e: any) => onInntektTypeChanged(e.value, index)}
              options={inntektTypeOptions}
              placeholder={t('el:placeholder-select-default')}
              value={_.find(inntektTypeOptions, b => b.value === (index < 0 ? _newInntektType : inntekt?.type ?? ''))}
              defaultValue={_.find(inntektTypeOptions, b => b.value === (index < 0 ? _newInntektType : inntekt?.type ?? ''))}
            />
          </Column>
          <Column>
            <Input
              feil={getErrorFor(index, 'beloep')}
              namespace={namespace}
              key={namespace + idx + '-beloep-' + (index < 0 ? _newBeløp : inntekt?.beloep ?? '')}
              id='beloep'
              label={t('label:beløp') + ' *'}
              onChanged={(beløp: string) => setBeløp(beløp, index)}
              value={index < 0 ? _newBeløp : inntekt?.beloep ?? ''}
            />
          </Column>
          <Column>
            <CountrySelect
              key={namespace + '-valuta-' + (index < 0 ? _newValuta : inntekt?.valuta ?? '')}
              closeMenuOnSelect
              ariaLabel={t('label:valuta')}
              data-test-id={namespace + '-valuta'}
              error={getErrorFor(index, 'valuta')}
              highContrast={highContrast}
              id={namespace + '-valuta'}
              label={t('label:valuta') + ' *'}
              locale='nb'
              menuPortalTarget={document.body}
              onOptionSelected={(valuta: Currency) => setValuta(valuta, index)}
              type='currency'
              values={index < 0 ? _newValuta : inntekt?.valuta ?? ''}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(inntekt)}
              onConfirmRemove={() => onRemoved(index)}
              onCancelRemove={() => removeFromDeletion(inntekt)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
        {(index < 0 ? _newInntektType : inntekt?.type ?? '') === 'annet_vederlag' && (
          <AlignStartRow
            className={classNames('slideInFromLeft')}
            style={{ animationDelay: index < 0 ? '0s' : (index * 0.1) + 's' }}
          >
            <Column>
              <Input
                ariaLabel={t('label:informasjon-om-vederlag')}
                feil={getErrorFor(index, 'informasjonOmVederlag')}
                key={namespace + idx + '-informasjonOmVederlag-' + (index < 0 ? _newInformasjonOmVederlag : inntekt?.typeAnnen ?? '')}
                id='informasjonOmVederlag'
                label={t('label:informasjon-om-vederlag')}
                namespace={namespace + idx}
                onChanged={(informasjonOmVederlag: string) => onInformasjonOmVederlagChanged(informasjonOmVederlag, index)}
                required
                value={index < 0 ? _newInformasjonOmVederlag : inntekt?.typeAnnen ?? ''}
              />
            </Column>
            <Column />
          </AlignStartRow>
        )}
      </RepeatableRow>
    )
  }

  return (
    <MyPaddedDiv>
      <Heading size='small'>
        {t('label:inntekter')}
      </Heading>
      <VerticalSeparatorDiv />
      {inntekter?.map(renderRow)}
      <VerticalSeparatorDiv />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <Row className='slideInFromLeft'>
            <Column>
              <Button
                variant='tertiary'
                size='small'
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:inntekt').toLowerCase() })}
              </Button>
            </Column>
          </Row>
          )}
    </MyPaddedDiv>
  )
}

export default Inntekter
