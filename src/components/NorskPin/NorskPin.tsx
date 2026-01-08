import {ArrowUndoIcon, PencilIcon, MagnifyingGlassIcon, CheckmarkIcon} from '@navikt/aksel-icons'
import {Alert, BodyLong, Box, Button, HStack, Label, Loader, Spacer, VStack} from '@navikt/ds-react'
import { resetPerson, searchPerson } from 'actions/person'
import ErrorLabel from 'components/Forms/ErrorLabel'
import Input from 'components/Forms/Input'
import { ShadowPanel } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Pin } from 'declarations/sed'
import {PersonInfoPDL} from 'declarations/types'
import _ from 'lodash'
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
    _setTempNorwegianPin(newPin.trim())
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
      dispatch(searchPerson(_tempNorwegianPin))
    }
  }

  useEffect(() => {
    fillOutPerson()
  }, [searchedPerson])

  const { t } = useTranslation()
  return (
    <Box>
      <HStack gap="4" align={!_seeNorskPinForm ? "start" : "end"}>
        {!_seeNorskPinForm
          ? (
            <>
              <VStack>
                <HStack gap="4">
                  <Label>
                    {t('label:fnr-eller-dnr')}
                  </Label>
                  <BodyLong id={namespace + '-norskpin'}>
                    {norwegianPin?.identifikator ?? t('message:warning-no-fnr')}
                  </BodyLong>
                </HStack>
                <ErrorLabel error={error} />
              </VStack>
              <Spacer/>
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
            </>
            )
          : (
            <>
              <Input
                error={error}
                id='norskpin'
                label={t('label:fnr-eller-dnr')}
                hideLabel={false}
                namespace={namespace}
                onChanged={setNorwegianPin}
                value={_tempNorwegianPin}
              />
              <Spacer/>
              <HStack gap="1" wrap={false} align="center">
                <Button
                  variant='secondary'
                  disabled={_.isEmpty(_tempNorwegianPin?.trim())}
                  onClick={saveNorwegianPin}
                  icon={<CheckmarkIcon/>}
                >
                  {t('el:button-save')}
                </Button>

                <Button
                  variant='secondary'
                  disabled={searchingPerson}
                  onClick={searchUser}
                  icon={<MagnifyingGlassIcon/>}
                >
                  {searchingPerson
                    ? t('message:loading-searching')
                    : t('el:button-search-for-x', { x: t('label:person').toLowerCase() })}
                  {searchingPerson && <Loader />}
                </Button>

                <Button
                  variant='tertiary'
                  onClick={cleanUp}
                  icon={<ArrowUndoIcon/>}
                >
                  {t('el:button-cancel')}
                </Button>
              </HStack>
            </>
          )}
      </HStack>
      {_searchFailure &&
        <div className='nolabel'><Alert variant={"error"}>{alertMessage}</Alert></div>
      }
      {searchedPerson
        ? (
          <ShadowPanel>
            <HStack align="center" gap="4">
              <BodyLong>
                {searchedPerson.fornavn + ' ' + searchedPerson.etternavn + ' (' + searchedPerson.kjoenn + ')'}
              </BodyLong>
              <Button
                variant='secondary'
                onClick={(e) => {
                  fillOutPerson()
                }}
              >
                {t('label:fill-in-person-data')}
              </Button>
            </HStack>
          </ShadowPanel>
          )
        : _.isEmpty(norwegianPin?.identifikator)
          ? (
            <BodyLong>
              {t('label:norsk-fnr-beskrivelse')}
            </BodyLong>
            )
          : <div />}
    </Box>
  )
}

export default NorskPin
