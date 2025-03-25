import {ArrowUndoIcon, PencilIcon, MagnifyingGlassIcon, CheckmarkIcon} from '@navikt/aksel-icons'
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
import { RepRow, ShadowPanel } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Pin } from 'declarations/sed'
import {PersonInfoPDL} from 'declarations/types'
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
  onFillOutPerson: (p: PersonInfoPDL) => void
}

interface NorskPinSelector {
  searchingPerson: boolean
  searchedPerson: PersonInfoPDL | null | undefined
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
    <RepRow>
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
                  icon={<PencilIcon/>}
                >
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
                    icon={<CheckmarkIcon/>}
                  >
                    {t('el:button-save')}
                  </Button>
                  <HorizontalSeparatorDiv size='0.35' />
                  <Button
                    variant='secondary'
                    disabled={searchingPerson}
                    data-amplitude='svarsed.editor.personopplysning.norskpin.search'
                    onClick={searchUser}
                    icon={<MagnifyingGlassIcon/>}
                  >
                    {searchingPerson
                      ? t('message:loading-searching')
                      : t('el:button-search-for-x', { x: t('label:person').toLowerCase() })}
                    {searchingPerson && <Loader />}
                  </Button>
                  <HorizontalSeparatorDiv size='0.35' />
                  <Button
                    variant='tertiary'
                    onClick={cleanUp}
                    icon={<ArrowUndoIcon/>}
                  >
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
    </RepRow>
  )
}

export default NorskPin
