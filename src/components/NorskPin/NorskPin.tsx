import { Cancel, Edit, Search, SuccessStroke } from '@navikt/ds-icons'
import { BodyLong, Button, Label, Loader } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  FlexCenterDiv,
  FlexStartDiv,
  HorizontalSeparatorDiv,
  PileDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetPerson, searchPerson } from 'actions/person'
import Input from 'components/Forms/Input'
import { ShadowPanel } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Pin } from 'declarations/sed'
import { Person, Validation } from 'declarations/types'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'

export interface NorskPinProps {
  norwegianPin: Pin | undefined
  validation: Validation
  namespace: string
  onNorwegianPinSave: (fnr: string) => void
  onFillOutPerson: (p: Person) => void
}

interface NorskPinSelector {
  searchingPerson: boolean
  searchedPerson: Person | null | undefined
}

const mapState = (state: State): NorskPinSelector => ({
  searchedPerson: state.person.person,
  searchingPerson: state.loading.searchingPerson,
})

const NorskPin: React.FC<NorskPinProps> = ({
  norwegianPin,
  validation,
  namespace,
  onNorwegianPinSave,
  onFillOutPerson
}: NorskPinProps) => {

  const dispatch = useAppDispatch()

  const [_seeNorskPinForm, _setSeeNorskPinForm] = useState<boolean>(false)
  const [_tempNorwegianPin, _setTempNorwegianPin] = useState<string| undefined>(undefined)

  const { searchedPerson, searchingPerson } = useAppSelector(mapState)

  const onNorwegianPinChange = (newPin: string) => {
    _setTempNorwegianPin(newPin)
  }

  const _onNorwegianPinSave = () => {
    if (_tempNorwegianPin) {
      onNorwegianPinSave(_tempNorwegianPin)
    }
    _setSeeNorskPinForm(false)
  }

  const _onFillOutPerson = () => {
     if (searchedPerson) {
       onFillOutPerson(searchedPerson)
       dispatch(resetPerson())
     }
    _setSeeNorskPinForm(false)
  }

  const onSearchUser = (e: any) => {
    if (norwegianPin && norwegianPin.identifikator) {
      buttonLogger(e)
      dispatch(searchPerson(norwegianPin.identifikator))
    }
  }


  const { t } = useTranslation()
  return (
    <>
      <AlignStartRow>
    {!_seeNorskPinForm
      ? (
        <>
          <Column>
            <PileDiv>
              <VerticalSeparatorDiv/>
              <FlexCenterDiv>
                <Label>
                  {t('label:fnr-eller-dnr')}
                </Label>
                <HorizontalSeparatorDiv />
                <BodyLong>
                  {norwegianPin?.identifikator ?? t('message:warning-no-fnr')}
                </BodyLong>
              </FlexCenterDiv>
              {validation[namespace + '-norskpin-nummer']?.feilmelding && (
                <div role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium navds-label'>
                  {validation[namespace + '-norskpin-nummer']?.feilmelding}
                </div>
              )}
            </PileDiv>
          </Column>
          <Column>
            <Button
              variant='secondary'
              onClick={() => {
                _setTempNorwegianPin(norwegianPin?.identifikator)
                _setSeeNorskPinForm(true)
              }}
            >
              <Edit />
              {t('label:endre')}
            </Button>
          </Column>
          <Column />
        </>
      )
      : (
        <>
          <Column>
            <Input
              error={validation[namespace + '-norskpin-nummer']?.feilmelding}
              id='norskpin-nummer'
              key={namespace + '-norskpin-nummer-' + _tempNorwegianPin}
              label={t('label:fnr-eller-dnr')}
              hideLabel={false}
              namespace={namespace}
              onChanged={onNorwegianPinChange}
              value={_tempNorwegianPin}
            />
          </Column>
          <Column>
            <FlexStartDiv className='nolabel'>
              <Button
                variant='secondary'
                disabled={_.isEmpty(_tempNorwegianPin?.trim())}
                data-amplitude='svarsed.editor.personopplysning.norskpin.save'
                onClick={_onNorwegianPinSave}
              >
                <SuccessStroke />
                {t('el:button-save')}
              </Button>
              <HorizontalSeparatorDiv size='0.35' />
              <Button
                variant='secondary'
                disabled={searchingPerson}
                data-amplitude='svarsed.editor.personopplysning.norskpin.search'
                onClick={onSearchUser}
              >
                <Search />
                {searchingPerson
                  ? t('message:loading-searching')
                  : t('el:button-search-for-x', { x: t('label:person').toLowerCase() })}
                {searchingPerson && <Loader />}
              </Button>
              <HorizontalSeparatorDiv size='0.35' />
              <Button
                variant='tertiary'
                onClick={() => _setSeeNorskPinForm(false)}
              >
                <Cancel />
                {t('el:button-cancel')}
              </Button>
            </FlexStartDiv>
          </Column>
        </>
      )}
      </AlignStartRow>
      <VerticalSeparatorDiv />
      {searchedPerson ? (
        <ShadowPanel>
          <FlexCenterDiv>
          <BodyLong>
            {searchedPerson.fornavn + ' ' + searchedPerson.etternavn + ' (' + searchedPerson.kjoenn + ')'}
          </BodyLong>
          <HorizontalSeparatorDiv />
          <Button
            variant='secondary'
            data-amplitude='svarsed.editor.personopplysning.norskpin.fill'
            onClick={(e) => {
              buttonLogger(e)
              _onFillOutPerson()
            }}
          >
            {t('label:fill-in-person-data')}
          </Button>
        </FlexCenterDiv>
        </ShadowPanel>
      )
      : _.isEmpty(norwegianPin?.identifikator)
        ? (
          <BodyLong>
            {t('label:norsk-fnr-beskrivelse')}
          </BodyLong>
        )
        : <div />
      }
      </>
  )
}

export default NorskPin
