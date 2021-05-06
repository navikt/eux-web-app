import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import TextArea from 'components/Forms/TextArea'
import Period from 'components/Period/Period'
import { HorizontalLineSeparator, TextAreaDiv } from 'components/StyledComponents'
import { F002Sed, FormalMotregning, NavnOgBetegnelse, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import CountryData, { Currency } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { UndertekstBold, Undertittel } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column,
  HighContrastFlatknapp,
  HighContrastLink,
  HighContrastRadio,
  HighContrastRadioGroup,
  HorizontalSeparatorDiv,
  PaddedDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getIdx } from 'utils/namespace'
import { validateMotregningNavnOgBetegnelser, ValidationMotregningNavnOgBetegnelserProps } from './validation'

export interface MotregningProps {
  highContrast: boolean
  replySed: ReplySed
  resetValidation: (key?: string) => void
  seeKontoopplysninger: () => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const Motregning: React.FC<MotregningProps> = ({
  highContrast,
  replySed,
  resetValidation,
  seeKontoopplysninger,
  updateReplySed,
  validation
}: MotregningProps): JSX.Element => {
  const { t } = useTranslation()
  const target = 'formaalx.motregning'
  const motregning: FormalMotregning | undefined = (replySed as F002Sed).formaalx?.motregning
  const namespace = 'motregning'
  const _currencyData = CountryData.getCurrencyInstance('nb')

  const [_newNavn, _setNewNavn] = useState<string | undefined>(undefined)
  const [_newBetegnelse, _setNewBetegnelse] = useState<string | undefined>(undefined)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<NavnOgBetegnelse>((nob: NavnOgBetegnelse): string => {
    return nob.navn
  })
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationMotregningNavnOgBetegnelserProps>({}, validateMotregningNavnOgBetegnelser)

  const setAnmodningEllerSvar = (newAnmodning: string) => {
    updateReplySed(`${target}.anmodningEllerSvar`, newAnmodning.trim())
    if (validation[namespace + '-anmodningEllerSvar']) {
      resetValidation(namespace + '-anmodningEllerSvar')
    }
  }

  const setNavn = (newNavn: string, index: number) => {
    if (index < 0) {
      _setNewNavn(newNavn)
      _resetValidation(namespace + '-navnOgBetegnelser-navn')
    } else {
      updateReplySed(`${target}.navnOgBetegnelser[${index}].navn`, newNavn.trim())
      if (validation[namespace + '-navnOgBetegnelser' + getIdx(index) + '-navn']) {
        resetValidation(namespace + '-navnOgBetegnelser' + getIdx(index) + '-navn')
      }
    }
  }

  const setBetegnelse = (newBetegnelse: string, index: number) => {
    if (index < 0) {
      _setNewBetegnelse(newBetegnelse)
      _resetValidation(namespace + '-navnOgBetegnelser-betegnelse')
    } else {
      updateReplySed(`${target}.navnOgBetegnelser[${index}].betegnelse`, newBetegnelse.trim())
      if (validation[namespace + '-navnOgBetegnelser' + getIdx(index) + 'betegnelse']) {
        resetValidation(namespace + '-navnOgBetegnelser' + getIdx(index) + 'betegnelse')
      }
    }
  }

  const setBeløp = (newBeløp: string) => {
    updateReplySed(`${target}.beloep`, newBeløp.trim())
    if (validation[namespace + '-beloep']) {
      resetValidation(namespace + '-beloep')
    }
  }

  const setValuta = (newValuta: Currency) => {
    updateReplySed(`${target}.valuta`, newValuta?.currencyValue)
    if (validation[namespace + '-valuta']) {
      resetValidation(namespace + '-valuta')
    }
  }

  const setStartDato = (newDato: string) => {
    updateReplySed(`${target}.startdato`, newDato.trim())
    if (validation[namespace + '-startdato']) {
      resetValidation(namespace + '-startdato')
    }
  }

  const setSluttDato = (newDato: string) => {
    updateReplySed(`${target}.sluttdato`, newDato.trim())
    if (validation[namespace + '-sluttdato']) {
      resetValidation(namespace + '-sluttdato')
    }
  }

  const setAvgrensing = (newAvgrensing: string) => {
    updateReplySed(`${target}.avgrensing`, newAvgrensing.trim())
    if (validation[namespace + '-avgrensing']) {
      resetValidation(namespace + '-avgrensing')
    }
  }

  const setMottakersNavn = (newMottakersNavn: string) => {
    updateReplySed(`${target}.mottakersNavn`, newMottakersNavn.trim())
    if (validation[namespace + '-mottakersNavn']) {
      resetValidation(namespace + '-mottakersNavn')
    }
  }

  const setGrunnerTilAnmodning = (newGrunnerTilAnmodning: string) => {
    updateReplySed(`${target}.grunnerTilAnmodning`, newGrunnerTilAnmodning.trim())
    if (validation[namespace + '-grunnerTilAnmodning']) {
      resetValidation(namespace + '-grunnerTilAnmodning')
    }
  }

  const setYtterligereInfo = (newYtterligereInfo: string) => {
    updateReplySed(`${target}.ytterligereInfo`, newYtterligereInfo.trim())
    if (validation[namespace + '-ytterligereInfo']) {
      resetValidation(namespace + '-ytterligereInfo')
    }
  }

  const resetForm = () => {
    _setNewNavn('')
    _setNewBetegnelse('')
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (i: number) => {
    const newNavnOgBetegnelser = _.cloneDeep(motregning!.navnOgBetegnelser)
    const deletedNavnOgBetegnelser: Array<NavnOgBetegnelse> = newNavnOgBetegnelser.splice(i, 1)
    if (deletedNavnOgBetegnelser && deletedNavnOgBetegnelser.length > 0) {
      removeFromDeletion(deletedNavnOgBetegnelser[0])
    }
    updateReplySed(`${target}.navnOgBetegnelser`, newNavnOgBetegnelser)
  }

  const onAdd = () => {
    const newNavOgBetegnelse: NavnOgBetegnelse | any = {
      navn: _newNavn?.trim(),
      betegnelsePåYtelse: _newBetegnelse?.trim()
    }

    const valid: boolean = performValidation({
      navnOgBetegnelse: newNavOgBetegnelse,
      namespace: namespace
    })

    if (valid) {
      let newNavnOgBetegnelser: Array<NavnOgBetegnelse> | undefined = _.cloneDeep(motregning?.navnOgBetegnelser)
      if (_.isNil(newNavnOgBetegnelser)) {
        newNavnOgBetegnelser = []
      }
      newNavnOgBetegnelser.push(newNavOgBetegnelse)
      updateReplySed(`${target}.navnOgBetegnelser`, newNavnOgBetegnelser)
      resetForm()
    }
  }

  const renderRowOfNavnOgBetegnelse = (nob: NavnOgBetegnelse | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(nob)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-navnOgBetegnelser' + idx + '-' + el]?.feilmelding
        : validation[namespace + '-navnOgBetegnelser' + idx + '-' + el]?.feilmelding
    )
    return (
      <>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.1) + 's' }}
        >
          <Column>
            <Input
              feil={getErrorFor(index, 'navn')}
              namespace={namespace + '-navnOgBetegnelser' + idx}
              id='navn'
              label={t('label:barnets-navn') + ' *'}
              onChanged={(value: string) => setNavn(value, index)}
              value={index < 0 ? _newNavn : nob?.navn}
            />
          </Column>
          <Column>
            <Input
              feil={getErrorFor(index, 'betegnelsePåYtelse')}
              namespace={namespace + '-navnOgBetegnelser' + idx}
              id='betegnelsePåYtelse'
              label={t('label:betegnelse-på-ytelse') + ' *'}
              onChanged={(value: string) => setBetegnelse(value, index)}
              value={index < 0 ? _newBetegnelse : nob?.betegnelsePåYtelse}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(nob)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(nob)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </>
    )
  }

  return (
    <PaddedDiv>
      <Undertittel>
        {t('label:motregning')}
      </Undertittel>
      <VerticalSeparatorDiv size='2' />
      <HighContrastRadioGroup
        className={classNames('slideInFromLeft')}
        data-test-id={namespace + '-anmodningEllerSvar'}
        id={namespace + '-anmodningEllerSvar'}
        legend={t('label:anmodning-om-motregning')}
        feil={validation[namespace + '-anmodningEllerSvar']?.feilmelding}
      >
        <HighContrastRadio
          name={namespace + '-anmodningEllerSvar'}
          checked={motregning?.anmodningEllerSvar === '1'}
          label={t('label:anmodning-om-motregning-barn')}
          onClick={() => setAnmodningEllerSvar('1')}
        />
        <VerticalSeparatorDiv />
        <HighContrastRadio
          name={namespace + '-anmodningEllerSvar'}
          checked={motregning?.anmodningEllerSvar === '2'}
          label={t('label:anmodning-om-motregning-svar-barn')}
          onClick={() => setAnmodningEllerSvar('2')}
        />
      </HighContrastRadioGroup>
      <VerticalSeparatorDiv />
      {motregning?.navnOgBetegnelser?.map(renderRowOfNavnOgBetegnelse)}
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRowOfNavnOgBetegnelse(null, -1)
        : (
          <Row className='slideInFromLeft'>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:barn').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
      <VerticalSeparatorDiv size='2' />
      <UndertekstBold>
        {t('label:informasjon-om-familieytelser')}
      </UndertekstBold>
      <VerticalSeparatorDiv />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: '0.1s' }}
      >
        <Column>
          <Input
            feil={validation[namespace + '-beloep']?.feilmelding}
            namespace={namespace}
            id='beloep'
            label={t('label:beløp') + ' *'}
            onChanged={setBeløp}
            value={motregning?.beloep}
          />
        </Column>
        <Column>
          <CountrySelect
            ariaLabel={t('label:valuta')}
            data-test-id={namespace + '-valuta'}
            error={validation[namespace + '-valuta']?.feilmelding}
            highContrast={highContrast}
            id={namespace + '-valuta'}
            label={t('label:valuta') + ' *'}
            locale='nb'
            menuPortalTarget={document.body}
            onOptionSelected={setValuta}
            type='currency'
            values={_currencyData.findByValue(motregning?.valuta ?? '')}
          />
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: '0.2s' }}
      >
        <Period
          key={'' + motregning?.startdato + motregning?.sluttdato}
          namespace={namespace}
          errorStartDato={validation[namespace + '-startdato']?.feilmelding}
          errorSluttDato={validation[namespace + '-startdato']?.feilmelding}
          labelStartDato={t('label:startdato') + ' (' + t('label:innvilgelse').toLowerCase() + ')'}
          labelSluttDato={t('label:sluttdato') + ' (' + t('label:innvilgelse').toLowerCase() + ')'}
          setStartDato={setStartDato}
          setSluttDato={setSluttDato}
          valueStartDato={motregning?.startdato}
          valueSluttDato={motregning?.sluttdato}
        />
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: '0.3s' }}
      >
        <Column flex='2'>
          <Input
            feil={validation[namespace + '-avgrensing']?.feilmelding}
            namespace={namespace}
            id='avgrensing'
            label={t('label:periode-avgrensing') + ' *'}
            onChanged={setAvgrensing}
            value={motregning?.avgrensing}
          />
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: '0.4s' }}
      >
        <Column flex='2'>
          <Input
            feil={validation[namespace + '-mottakersNavn']?.feilmelding}
            namespace={namespace}
            id='mottakersNavn'
            label={t('label:mottakers-navn') + ' *'}
            onChanged={setMottakersNavn}
            value={motregning?.mottakersNavn}
          />
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: '0.5s' }}
      >
        <Column flex='2'>
          <TextAreaDiv>
            <TextArea
              feil={validation[namespace + '-grunnerTilAnmodning']?.feilmelding}
              namespace={namespace}
              id='grunnerTilAnmodning'
              label={t('label:anmodning-grunner')}
              onChanged={setGrunnerTilAnmodning}
              value={motregning?.grunnerTilAnmodning}
            />
          </TextAreaDiv>
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: '0.5s' }}
      >
        <Column flex='2'>
          <TextAreaDiv>
            <TextArea
              feil={validation[namespace + '-ytterligereInfo']?.feilmelding}
              namespace={namespace}
              id='ytterligereInfo'
              label={t('label:ytterligere-informasjon')}
              onChanged={setYtterligereInfo}
              value={motregning?.ytterligereInfo}
            />
          </TextAreaDiv>
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column>
          <HighContrastLink
            href='#' onClick={(e: any) => {
              e.preventDefault()
              seeKontoopplysninger()
              // have to wait 0.1 seconds so it comes to DOM first
              setTimeout(() => {
                const element = document.getElementById('kontoopplysning')
                element?.scrollIntoView({
                  behavior: 'smooth'
                })
              }, 100)
            }}
          >
            {t('label:oppgi-kontoopplysninger')}
          </HighContrastLink>
        </Column>
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default Motregning
