import Add from 'assets/icons/Add'
import Trashcan from 'assets/icons/Trashcan'
import classNames from 'classnames'
import { AlignStartRow, FlexCenterDiv, PileDiv } from 'components/StyledComponents'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { Country } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HighContrastPanel,
  HighContrastRadio,
  HighContrastRadioGroup,
  HighContrastTextArea,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validateMotregning } from 'validation/motregning'

export interface MotregningProps {
  highContrast: boolean
  replySed: ReplySed
  validation: Validation
}

export interface NavnOgBetegnelse {
  navn: string
  betegnelsePåYtelse: string
}

const Motregning: React.FC<MotregningProps> = ({
  highContrast,
  //replySed,
  validation
}: MotregningProps): JSX.Element => {
  const { t } = useTranslation()
  const [_confirmDelete, _setConfirmDelete] = useState<Array<string>>([])
  const [_anmodning, _setAnmodning] = useState<string | undefined>(undefined)
  const [_navnOgBetegnelser, _setNavnOgBetegnelser] = useState<Array<NavnOgBetegnelse>>([])
  const [_amount, _setAmount] = useState<string>('')
  const [_currency, _setCurrency] = useState<Country | undefined>(undefined)
  const [_startDato, _setStartDato] = useState<string>('')
  const [_sluttDato, _setSluttDato] = useState<string>('')
  const [_frequency, _setFrequency] = useState<string | undefined>(undefined)
  const [_receiver, _setReceiver] = useState<string | undefined>(undefined)
  const [_grunner, _setGrunner] = useState<string | undefined>(undefined)
  const [_ytterligereInformasjon, _setYtterligereInformasjon] = useState<string | undefined>(undefined)

  const [_newNavn, _setNewNavn] = useState<string | undefined>(undefined)
  const [_newBetegnelse, _setNewBetegnelse] = useState<string | undefined>(undefined)
  const [_validation, _setValidation] = useState<Validation>({})
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)

  const namespace = 'motregning'

  const resetValidation = (key: string): void => {
    _setValidation({
      ..._validation,
      [key]: undefined
    })
  }

  const hasNoValidationErrors = (validation: Validation): boolean => _.find(validation, (it) => (it !== undefined)) === undefined

  const performValidation = (): boolean => {
    const newValidation: Validation = {}
    validateMotregning(
      newValidation,
      {
        navn: _newNavn,
        betegnelsePåYtelse: _newBetegnelse
      } as NavnOgBetegnelse,
      -1,
      t,
      namespace
    )
    _setValidation(newValidation)
    return hasNoValidationErrors(newValidation)
  }

  const onAddNewClicked = () => _setSeeNewForm(true)

  const addCandidateForDeletion = (key: string) => {
    _setConfirmDelete(_confirmDelete.concat(key))
  }

  const removeCandidateForDeletion = (key: string) => {
    _setConfirmDelete(_.filter(_confirmDelete, it => it !== key))
  }

  const setStartDato = (s: string) => {
    _setStartDato(s)
    resetValidation('motrening-startdato')
  }

  const setSluttDato = (s: string) => {
    _setSluttDato(s)
    resetValidation('motrening-sluttdato')
  }


  const setNavn = (s: string, i: number) => {
    if (i < 0) {
      _setNewNavn(s)
      resetValidation('motrening-navn')
    } else {
      const newNavnOgBetegnelser = _.cloneDeep(_navnOgBetegnelser)
      newNavnOgBetegnelser[i].navn = s
      _setNavnOgBetegnelser(newNavnOgBetegnelser)
    }
  }

  const setBetegnelse = (s: string, i: number) => {
    if (i < 0) {
      _setNewBetegnelse(s)
      resetValidation('motrening-betegnelse')
    } else {
      const newNavnOgBetegnelser = _.cloneDeep(_navnOgBetegnelser)
      newNavnOgBetegnelser[i].betegnelsePåYtelse = s
      _setNavnOgBetegnelser(newNavnOgBetegnelser)
    }
  }

  const resetForm = () => {
    _setNewNavn('')
    _setNewBetegnelse('')
    _setValidation({})
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const getKey = (nob: NavnOgBetegnelse): string => {
    return nob.navn
  }

  const onRemove = (i: number) => {
    const newNavnOgBetegnelser = _.cloneDeep(_navnOgBetegnelser)
    const deletedNavnOgBetegnelser: Array<NavnOgBetegnelse> = newNavnOgBetegnelser.splice(i, 1)
    if (deletedNavnOgBetegnelser && deletedNavnOgBetegnelser.length > 0) {
      removeCandidateForDeletion(getKey(deletedNavnOgBetegnelser[0]))
    }
    _setNavnOgBetegnelser(newNavnOgBetegnelser)
  }


  const onAdd = () => {
    if (performValidation()) {
      let newNavnOgBetegnelser = _.cloneDeep(_navnOgBetegnelser)
      if (_.isNil(newNavnOgBetegnelser)) {
        newNavnOgBetegnelser = []
      }
      newNavnOgBetegnelser.push({
        navn: _newNavn,
        betegnelsePåYtelse: _newBetegnelse
      }as NavnOgBetegnelse)
      resetForm()
      _setNavnOgBetegnelser(newNavnOgBetegnelser)
    }
  }
  const getErrorFor = (index: number, el: string): string | undefined => {
    return index < 0 ? _validation[namespace + '-navnogbetegnelse-' + el]?.feilmelding : validation[namespace + '-navnogbetegnelse[' + index + ']-' + el]?.feilmelding
  }

  const renderNavnOgBetegnelse = (nob: NavnOgBetegnelse | null, index: number) => {

    const key = nob ? getKey(nob) : 'new'
    const candidateForDeletion = index < 0 ? false : key && _confirmDelete.indexOf(key) >= 0

    return (
      <>
        <AlignStartRow className={classNames('slideInFromLeft')}>
          <Column>
            <HighContrastInput
              data-test-id={'c-' + namespace + '-navnogbetegnelse' + (index >= 0 ? '[' + index + ']' : '') + '-navn-text'}
              feil={getErrorFor(index, 'navn')}
              id={'c-' + namespace + '-navnogbetegnelse' + (index >= 0 ? '[' + index + ']' : '') + '-navn-text'}
              label={t('label:children-name')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNavn(e.target.value, index)}
              placeholder={t('el:placeholder-input-default')}
              value={index < 0 ? _newNavn : nob?.navn}
            />
          </Column>
          <Column>
            <HighContrastInput
              data-test-id={'c-' + namespace + '-navnogbetegnelse' + (index >= 0 ? '[' + index + ']' : '') + '-betegnelse-text'}
              feil={getErrorFor(index, 'betegnelse')}
              id={'c-' + namespace + '-navnogbetegnelse' + (index >= 0 ? '[' + index + ']' : '') + '-betegnelse-text'}
              label={t('label:benefit-cause')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBetegnelse(e.target.value, index)}
              placeholder={t('el:placeholder-input-default')}
              value={index < 0 ? _newBetegnelse : nob?.betegnelsePåYtelse}
            />
          </Column>
          <Column>
            {candidateForDeletion
              ? (
                <FlexCenterDiv className={classNames('slideInFromRight')}>
                  <Normaltekst>
                    {t('label:are-you-sure')}
                  </Normaltekst>
                  <HorizontalSeparatorDiv data-size='0.5'/>
                  <HighContrastFlatknapp
                    mini
                    kompakt
                    onClick={() => onRemove(index)}
                  >
                    {t('label:yes')}
                  </HighContrastFlatknapp>
                  <HorizontalSeparatorDiv data-size='0.5'/>
                  <HighContrastFlatknapp
                    mini
                    kompakt
                    onClick={() => removeCandidateForDeletion(key!)}
                  >
                    {t('label:no')}
                  </HighContrastFlatknapp>
                </FlexCenterDiv>
              )
              : (
                <div>
                  <HighContrastFlatknapp
                    mini
                    kompakt
                    onClick={() => index < 0 ? onAdd() : addCandidateForDeletion(key!)}
                  >
                    {index < 0 ? <Add/> : <Trashcan/>}
                    <HorizontalSeparatorDiv data-size='0.5'/>
                    {index < 0 ? t('el:button-add') : t('el:button-remove')}
                  </HighContrastFlatknapp>
                  {_seeNewForm && index < 0 && (
                    <>
                      <HorizontalSeparatorDiv/>
                      <HighContrastFlatknapp
                        mini
                        kompakt
                        onClick={onCancel}
                      >
                        {t('el:button-cancel')}
                      </HighContrastFlatknapp>
                    </>
                  )}
                </div>
              )}
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv data-size='0.5'/>
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
          legend={t('label:anmodning-om-motregning')}
          feil={_validation[namespace + '-anmodning']?.feilmelding}
        >
          <HighContrastRadio
            name={namespace + '-anmodning'}
            checked={_anmodning === '1'}
            label={t('label:anmodning-om-motregning-barn')}
            onClick={() => _setAnmodning('1')}
          />
          <VerticalSeparatorDiv />
          <HighContrastRadio
            name={namespace + '-anmodning'}
            checked={_anmodning === 'nei'}
            label={t('label:anmodning-om-motregning-svar-barn')}
            onClick={() => _setAnmodning('2')}
          />
        </HighContrastRadioGroup>
        <VerticalSeparatorDiv />
        {_navnOgBetegnelser.map(renderNavnOgBetegnelse)}
        <hr />
        <VerticalSeparatorDiv />
        {_seeNewForm
          ? renderNavnOgBetegnelse(null, -1)
          : (
            <Row className='slideInFromLeft'>
              <Column>
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={onAddNewClicked}
                >
                  <Add />
                  <HorizontalSeparatorDiv data-size='0.5' />
                  {t('el:button-add-new-x', { x: t('label:children').toLowerCase() })}
                </HighContrastFlatknapp>
              </Column>
            </Row>
          )}
        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{animationDelay: '0.1s'}}
        >
          <Column>
            <HighContrastInput
              data-test-id={'c-' + namespace + '-amount-number'}
              feil={_validation[+ namespace + '-amount']?.feilmelding}
              id={'c-' + namespace + '-amount-number'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setAmount(e.target.value)}
              value={_amount}
              label={t('label:amount')}
              placeholder={t('el:placeholder-input-default')}
            />
          </Column>
          <Column>
            <CountrySelect
              ariaLabel={t('label:currency')}
              data-test-id={'c-' + namespace + '-currency-text'}
              error={validation[namespace + '-currency']?.feilmelding}
              highContrast={highContrast}
              id={'c-' + namespace + '-currency-text'}
              label={t('label:currency')}
              locale='nb'
              menuPortalTarget={document.body}
              onOptionSelected={(country: Country) => _setCurrency(country)}
              type='currency'
              values={_currency}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{animationDelay: '0.2s'}}
        >
          <Column>
            <HighContrastInput
              data-test-id={'c-' + namespace + '-startdato-date'}
              id={'c-' + namespace + '-startdato-date'}
              feil={_validation[namespace + '-startdato']?.feilmelding}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDato(e.target.value)}
              value={_startDato}
              label={t('label:start-date') + ' (' + t('label:grant').toLowerCase() + ')'}
              placeholder={t('el:placeholder-date-default')}
            />
          </Column>
          <Column>
            <HighContrastInput
              data-test-id={'c-' + namespace + '-sluttdato-date'}
              id={'c-' + namespace + '-sluttdato-date'}
              feil={_validation[namespace + '-sluttdato']?.feilmelding}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSluttDato(e.target.value)}
              value={_sluttDato}
              label={t('label:end-date') + ' (' + t('label:grant').toLowerCase() + ')'}
              placeholder={t('el:placeholder-date-default')}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{animationDelay: '0.3s'}}
        >
          <Column>
            <HighContrastInput
              data-test-id={'c-' + namespace + '-frequency-text'}
              id={'c-' + namespace + '-frequency-text'}
              feil={_validation[namespace + '-frequency']?.feilmelding}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setFrequency(e.target.value)}
              value={_frequency}
              label={t('label:period-frequency')}
              placeholder={t('el:placeholder-input-default')}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{animationDelay: '0.4s'}}
        >
          <Column>
            <HighContrastInput
              data-test-id={'c-' + namespace + '-receiver-text'}
              id={'c-' + namespace + '-receiver-text'}
              feil={_validation[namespace + '-receiver']?.feilmelding}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setReceiver(e.target.value)}
              value={_receiver}
              label={t('label:receiver-name')}
              placeholder={t('el:placeholder-input-default')}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{animationDelay: '0.5s'}}
        >
          <Column>
            <HighContrastTextArea
              className={classNames({
                'skjemaelement__input--harFeil': validation[namespace + '-grunner']?.feilmelding
              })}
              data-test-id={'c-' + namespace + '-grunner-text'}
              feil={validation[namespace + '-grunner']?.feilmelding}
              id={'c-' + namespace + '-grunner-text'}
              label={t('label:anmodning-grunner')}
              placeholder={t('el:placeholder-grunner-default')}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => _setGrunner(e.target.value)}
              value={_grunner}
            />
          </Column>
          <Column/>
        </AlignStartRow>

        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{animationDelay: '0.5s'}}
        >
          <Column>
            <HighContrastTextArea
              className={classNames({
                'skjemaelement__input--harFeil': validation[namespace + '-ytterligereinformasjon']?.feilmelding
              })}
              data-test-id={'c-' + namespace + '-ytterligereinformasjon-text'}
              feil={validation[namespace + '-ytterligereinformasjon']?.feilmelding}
              id={'c-' + namespace + '-ytterligereinformasjon-text'}
              label={t('label:additional-information')}
              placeholder={t('el:placeholder-input-default')}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => _setYtterligereInformasjon(e.target.value)}
              value={_ytterligereInformasjon}
            />
          </Column>
          <Column/>
        </AlignStartRow>

      </HighContrastPanel>
    </PileDiv>
  )
}

export default Motregning
