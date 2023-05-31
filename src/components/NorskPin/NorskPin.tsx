import { Cancel, Edit, Search, SuccessStroke } from '@navikt/ds-icons'
import {Alert, BodyLong, Button, Label, Loader} from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  FlexCenterDiv,
  FlexStartDiv,
  HorizontalSeparatorDiv,
  PileDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetPerson, searchPerson } from 'actions/person'
import ErrorLabel from 'components/Forms/ErrorLabel'
import Input from 'components/Forms/Input'
import { RepeatableRow, ShadowPanel } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Pin } from 'declarations/sed'
import { Person } from 'declarations/types'
import _ from 'lodash'
import {buttonLogger} from 'metrics/loggers'
import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import * as types from "../../constants/actionTypes";

export interface NorskPinProps {
  norwegianPin: Pin | undefined
  error: string | undefined
  namespace: string
  onNorwegianPinSave: (fnr: string) => void
  onFillOutPerson: (p: Person) => void
}

interface NorskPinSelector {
  searchingPerson: boolean
  searchedPerson: Person | null | undefined
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined
}

const mapState = (state: State): NorskPinSelector => ({
  searchedPerson: state.person.person,
  searchingPerson: state.loading.searchingPerson,
  alertMessage: state.alert.stripeMessage,
  alertType: state.alert.type
})

const NorskPin: React.FC<NorskPinProps> = ({
  norwegianPin,
  error,
  namespace,
  onNorwegianPinSave,
  onFillOutPerson
}: NorskPinProps) => {
  const dispatch = useAppDispatch()
  const { searchedPerson, searchingPerson, alertMessage, alertType } = useAppSelector(mapState)

  const [_seeNorskPinForm, _setSeeNorskPinForm] = useState<boolean>(false)
  const [_tempNorwegianPin, _setTempNorwegianPin] = useState<string| undefined>(undefined)
  const [_searchFailure, _setSearchFailure] = useState(false)


  useEffect(() => {
    if(alertMessage && alertType && [types.PERSON_SEARCH_FAILURE].indexOf(alertType) >= 0){
      _setSearchFailure(true)
      _setSeeNorskPinForm(true)
    } else {
      _setSearchFailure(false)
    }
  }, [alertMessage])

  const setNorwegianPin = (newPin: string) => {
    _setTempNorwegianPin(newPin)
  }

  const cleanUp = () => {
    if (searchedPerson) {
      dispatch(resetPerson())
    }
    _setSearchFailure(false)
    _setSeeNorskPinForm(false)
  }

  const saveNorwegianPin = () => {
    if (_tempNorwegianPin) {
      onNorwegianPinSave(_tempNorwegianPin)
    }
    _setSearchFailure(false)
    _setSeeNorskPinForm(false)
  }

  const fillOutPerson = () => {
    if (searchedPerson) {
      onFillOutPerson(searchedPerson)
      dispatch(resetPerson())
      _setSeeNorskPinForm(false)
    }
  }

  const searchUser = (e: any) => {
    if (_tempNorwegianPin) {
      buttonLogger(e)
      dispatch(searchPerson(_tempNorwegianPin))
    }
  }

  useEffect(() => {
    fillOutPerson()
  }, [searchedPerson])

  const { t } = useTranslation()
  return (
    <RepeatableRow>
      <AlignStartRow>
        {!_seeNorskPinForm
          ? (
            <>
              <Column style={{ minHeight: '3rem' }}>
                <PileDiv>
                  <VerticalSeparatorDiv />
                  <FlexCenterDiv>
                    <Label>
                      {t('label:fnr-eller-dnr')}
                    </Label>
                    <HorizontalSeparatorDiv />
                    <BodyLong id={namespace + '-norskpin'}>
                      {norwegianPin?.identifikator ?? t('message:warning-no-fnr')}
                    </BodyLong>
                  </FlexCenterDiv>
                  <ErrorLabel error={error} />
                </PileDiv>
              </Column>
              <AlignEndColumn className='control-buttons'>
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
              </AlignEndColumn>
            </>
            )
          : (
            <>
              <Column>
                <Input
                  error={error}
                  id='norskpin'
                  label={t('label:fnr-eller-dnr')}
                  hideLabel={false}
                  namespace={namespace}
                  onChanged={setNorwegianPin}
                  value={_tempNorwegianPin}
                />
              </Column>
              <AlignEndColumn className='control-buttons'>
                <FlexStartDiv className='nolabel'>
                  <Button
                    variant='secondary'
                    disabled={_.isEmpty(_tempNorwegianPin?.trim())}
                    data-amplitude='svarsed.editor.personopplysning.norskpin.save'
                    onClick={saveNorwegianPin}
                  >
                    <SuccessStroke />
                    {t('el:button-save')}
                  </Button>
                  <HorizontalSeparatorDiv size='0.35' />
                  <Button
                    variant='secondary'
                    disabled={searchingPerson}
                    data-amplitude='svarsed.editor.personopplysning.norskpin.search'
                    onClick={searchUser}
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
                    onClick={cleanUp}
                  >
                    <Cancel />
                    {t('el:button-cancel')}
                  </Button>
                </FlexStartDiv>
              </AlignEndColumn>
            </>
            )}
      </AlignStartRow>
      {_searchFailure &&
        <div className='nolabel'><Alert variant={"error"}>{alertMessage}</Alert></div>
      }
      <VerticalSeparatorDiv />
      {searchedPerson
        ? (
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
                  fillOutPerson()
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
          : <div />}
    </RepeatableRow>
  )
}

export default NorskPin
