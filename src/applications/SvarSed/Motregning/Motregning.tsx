import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import useAddRemove from 'components/AddRemovePanel/useAddRemove'
import Input from 'components/Forms/Input'
import TextArea from 'components/Forms/TextArea'
import Period from 'components/Period/Period'
import { AlignStartRow, PileDiv, TextAreaDiv } from 'components/StyledComponents'
import useValidation from 'components/Validation/useValidation'
import { F002Sed, FormalMotregning, NavnOgBetegnelse, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import CountryData, { Currency } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { UndertekstBold, Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastPanel,
  HighContrastRadio,
  HighContrastRadioGroup,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validateMotregningNavnOgBetegnelser, ValidationMotregningNavnOgBetegnelserProps } from './validation'

export interface MotregningProps {
  highContrast: boolean
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const Motregning: React.FC<MotregningProps> = ({
  highContrast,
  replySed,
  resetValidation,
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

  const [addCandidateForDeletion, removeCandidateForDeletion, hasKey] = useAddRemove()
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationMotregningNavnOgBetegnelserProps>({}, validateMotregningNavnOgBetegnelser)

  const setAnmodningEllerSvar = (newAnmodning: string) => {
    updateReplySed(`${target}.anmodningEllerSvar`, newAnmodning)
    if (validation[namespace + '-anmodningEllerSvar']) {
      resetValidation(namespace + '-anmodningEllerSvar')
    }
  }

  const setNavn = (newNavn: string, index: number) => {
    if (index < 0) {
      _setNewNavn(newNavn)
      _resetValidation(namespace + '-navnOgBetegnelser-navn')
    } else {
      let newNavnOgBetegnelser = _.cloneDeep(motregning?.navnOgBetegnelser)
      if (!newNavnOgBetegnelser) {
        newNavnOgBetegnelser = []
      }
      newNavnOgBetegnelser[index].navn = newNavn
      updateReplySed(`${target}.navnOgBetegnelser`, newNavnOgBetegnelser)
      if (validation[namespace + '-navnOgBetegnelser-navn']) {
        resetValidation(namespace + '-navnOgBetegnelser-navn')
      }
    }
  }

  const setBetegnelse = (newBetegnelse: string, index: number) => {
    if (index < 0) {
      _setNewBetegnelse(newBetegnelse)
      _resetValidation(namespace + '-navnOgBetegnelser-betegnelse')
    } else {
      let newNavnOgBetegnelser = _.cloneDeep(motregning?.navnOgBetegnelser)
      if (!newNavnOgBetegnelser) {
        newNavnOgBetegnelser = []
      }
      newNavnOgBetegnelser[index].betegnelsePåYtelse = newBetegnelse
      updateReplySed(`${target}.navnOgBetegnelser`, newNavnOgBetegnelser)
      if (validation[namespace + '-navnOgBetegnelser-betegnelse']) {
        resetValidation(namespace + '-navnOgBetegnelser-betegnelse')
      }
    }
  }

  const setBeløp = (newDato: string) => {
    updateReplySed(`${target}.beloep`, newDato)
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
    updateReplySed(`${target}.startdato`, newDato)
    if (validation[namespace + '-startdato']) {
      resetValidation(namespace + '-startdato')
    }
  }

  const setSluttDato = (newDato: string) => {
    updateReplySed(`${target}.sluttdato`, newDato)
    if (validation[namespace + '-sluttdato']) {
      resetValidation(namespace + '-sluttdato')
    }
  }

  const setAvgrensing = (newAvgrensing: string) => {
    updateReplySed(`${target}.avgrensing`, newAvgrensing)
    if (validation[namespace + '-avgrensing']) {
      resetValidation(namespace + '-avgrensing')
    }
  }

  const setMottakersNavn = (newMottakersNavn: string) => {
    updateReplySed(`${target}.mottakersNavn`, newMottakersNavn)
    if (validation[namespace + '-mottakersNavn']) {
      resetValidation(namespace + '-mottakersNavn')
    }
  }

  const setGrunnerTilAnmodning = (newGrunnerTilAnmodning: string) => {
    updateReplySed(`${target}.grunnerTilAnmodning`, newGrunnerTilAnmodning)
    if (validation[namespace + '-grunnerTilAnmodning']) {
      resetValidation(namespace + '-grunnerTilAnmodning')
    }
  }

  const setYtterligereInfo = (newYtterligereInfo: string) => {
    updateReplySed(`${target}.ytterligereInfo`, newYtterligereInfo)
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

  const getKey = (nob: NavnOgBetegnelse): string => {
    return nob.navn
  }

  const onRemove = (i: number) => {
    const newNavnOgBetegnelser = _.cloneDeep(motregning!.navnOgBetegnelser)
    const deletedNavnOgBetegnelser: Array<NavnOgBetegnelse> = newNavnOgBetegnelser.splice(i, 1)
    if (deletedNavnOgBetegnelser && deletedNavnOgBetegnelser.length > 0) {
      removeCandidateForDeletion(getKey(deletedNavnOgBetegnelser[0]))
    }
    updateReplySed(`${target}.navnOgBetegnelser`, newNavnOgBetegnelser)
  }

  const onAdd = () => {
    const newNavOgBetegnelse: NavnOgBetegnelse |any = {
      navn: _newNavn,
      betegnelsePåYtelse: _newBetegnelse
    }

    const valid: boolean = performValidation({
      navnOgBetegnelse: newNavOgBetegnelse,
      index: -1,
      namespace: namespace
    })

    if (valid) {
      let newNavnOgBetegnelser: Array<NavnOgBetegnelse> | undefined = _.cloneDeep(motregning?.navnOgBetegnelser)
      if (_.isNil(newNavnOgBetegnelser)) {
        newNavnOgBetegnelser = []
      }
      newNavnOgBetegnelser.push(newNavOgBetegnelse)
      resetForm()
      updateReplySed(`${target}.navnOgBetegnelser`, newNavnOgBetegnelser)
    }
  }

  const getErrorFor = (index: number, el: string): string | undefined => {
    return index < 0
      ? _validation[namespace + '-navnogbetegnelse-' + el]?.feilmelding
      : validation[namespace + '-navnogbetegnelse[' + index + ']-' + el]?.feilmelding
  }

  const renderRowOfNavnOgBetegnelse = (nob: NavnOgBetegnelse | null, index: number) => {
    const key = nob ? getKey(nob) : 'new'
    const candidateForDeletion = index < 0 ? false : !!key && hasKey(key)
    const idx = (index >= 0 ? '[' + index + ']' : '')
    return (
      <>
        <AlignStartRow className={classNames('slideInFromLeft')}>
          <Column>
            <Input
              feil={getErrorFor(index, 'navn')}
              namespace={namespace + '-navnogbetegnelse' + idx}
              id='navn-text'
              label={t('label:barnets-navn') + ' *'}
              onChanged={(value: string) => setNavn(value, index)}
              value={index < 0 ? _newNavn : nob?.navn}
            />
          </Column>
          <Column>
            <Input
              feil={getErrorFor(index, 'betegnelsepåytelse')}
              namespace={namespace + '-navnogbetegnelse' + idx}
              id='betegnelse-text'
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
              onBeginRemove={() => addCandidateForDeletion(key!)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeCandidateForDeletion(key!)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv data-size='0.5' />
      </>
    )
  }

  return (
    <PileDiv>
      <Undertittel>
        {t('el:title-motregning')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <HighContrastPanel>
        <HighContrastRadioGroup
          className={classNames('slideInFromLeft')}
          data-test-id={'c-' + namespace + '-anmodningEllerSvar-text'}
          id={'c-' + namespace + '-anmodningEllerSvar-text'}
          legend={t('label:anmodning-om-motregning')}
          feil={validation[namespace + '-anmodningEllerSvar']?.feilmelding}
        >
          <HighContrastRadio
            name={'c-' + namespace + '-anmodningEllerSvar-text'}
            checked={motregning?.anmodningEllerSvar === '1'}
            label={t('label:anmodning-om-motregning-barn')}
            onClick={() => setAnmodningEllerSvar('1')}
          />
          <VerticalSeparatorDiv />
          <HighContrastRadio
            name={'c-' + namespace + '-anmodningEllerSvar-text'}
            checked={motregning?.anmodningEllerSvar === '2'}
            label={t('label:anmodning-om-motregning-svar-barn')}
            onClick={() => setAnmodningEllerSvar('2')}
          />
        </HighContrastRadioGroup>
        <VerticalSeparatorDiv />
        {motregning?.navnOgBetegnelser.map(renderRowOfNavnOgBetegnelse)}
        <hr />
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
                  <HorizontalSeparatorDiv data-size='0.5' />
                  {t('el:button-add-new-x', { x: t('label:barn').toLowerCase() })}
                </HighContrastFlatknapp>
              </Column>
            </Row>
            )}
        <VerticalSeparatorDiv data-size='2' />
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
              feil={validation[+namespace + '-beloep']?.feilmelding}
              namespace={namespace}
              id='beloep-number'
              label={t('label:betegnelse-på-ytelse') + ' *'}
              onChanged={setBeløp}
              value={motregning?.beloep}
            />
          </Column>
          <Column>
            <CountrySelect
              ariaLabel={t('label:valuta')}
              data-test-id={'c-' + namespace + '-valuta-text'}
              error={validation[namespace + '-valuta']?.feilmelding}
              highContrast={highContrast}
              id={'c-' + namespace + '-valuta-text'}
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
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: '0.3s' }}
        >
          <Column data-flex='2'>
            <Input
              feil={validation[+namespace + '-avgrensing']?.feilmelding}
              namespace={namespace}
              id='avgrensing-text'
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
          <Column data-flex='2'>
            <Input
              feil={validation[+namespace + '-mottakersNavn']?.feilmelding}
              namespace={namespace}
              id='mottakersNavn-text'
              label={t('label:periode-mottakersNavn') + ' *'}
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
          <Column data-flex='2'>
            <TextAreaDiv>
              <TextArea
                className={classNames({
                  'skjemaelement__input--harFeil': validation[namespace + '-grunnerTilAnmodning']?.feilmelding
                })}
                feil={validation[+namespace + '-grunnerTilAnmodning']?.feilmelding}
                namespace={namespace}
                id='grunnerTilAnmodning-text'
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
          <Column data-flex='2'>
            <TextAreaDiv>
              <TextArea
                className={classNames({
                  'skjemaelement__input--harFeil': validation[namespace + '-ytterligereInfo']?.feilmelding
                })}
                feil={validation[+namespace + '-ytterligereInfo']?.feilmelding}
                namespace={namespace}
                id='ytterligereInfo-text'
                label={t('label:ytterligere-informasjon')}
                onChanged={setYtterligereInfo}
                value={motregning?.ytterligereInfo}
              />
            </TextAreaDiv>
          </Column>
          <Column />
        </AlignStartRow>
      </HighContrastPanel>
    </PileDiv>
  )
}

export default Motregning
