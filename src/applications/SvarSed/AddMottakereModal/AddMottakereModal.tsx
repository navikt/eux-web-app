import { TrashIcon } from '@navikt/aksel-icons';
import { Alert, Button, Loader, Select } from '@navikt/ds-react'
import {
  Column,
  FlexCenterDiv, FlexCenterSpacedDiv,
  HorizontalSeparatorDiv,
  PileCenterDiv,
  PileDiv,
  Row,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { Country } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import { addMottakere, resetMottakere } from 'actions/svarsed'
import { AlertstripeDiv } from 'components/StyledComponents'
import * as types from 'constants/actionTypes'
import { ErrorElement } from 'declarations/app'
import { State } from 'declarations/reducers'
import { Institusjon, Validation } from 'declarations/types'
import _ from 'lodash'
import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'
import {setInstitusjonerAndLandkoderByBucType, setInstitusjonerByLandkode} from "actions/sak";

const MinimalModalDiv = styled.div`
  min-height: 250px;
  min-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
`
const SectionDiv = styled.div`
  flex: 1;
  align-items: stretch;
  flex-direction: row;
  display: flex;
  justify-content: center;
`

interface AddDeltakereModalProps {
  bucType: string
  rinaSakId: string
  sakshandlinger: Array<string> | undefined
  onClose: () => void
}

interface AddDeltakereModalSelector {
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined
  landkoder: Array<string> | undefined
  institusjoner: Array<Institusjon> | undefined
  mottakere: any | undefined
  gettingInstitusjoner: boolean
  addingMottakere: boolean
}

const mapState = (state: State): AddDeltakereModalSelector => ({
  alertMessage: state.alert.stripeMessage,
  alertType: state.alert.type,
  landkoder: state.sak.landkoder,
  mottakere: state.svarsed.mottakere,
  institusjoner: state.sak.institusjonListByLandkode,
  gettingInstitusjoner: state.loading.gettingInstitusjoner,
  addingMottakere: state.loading.addingMottakere
})

const AddMottakereModal = ({
  rinaSakId,
  sakshandlinger,
  onClose,
  bucType
}: AddDeltakereModalProps): JSX.Element => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { alertMessage, alertType, gettingInstitusjoner, institusjoner, landkoder, addingMottakere, mottakere } = useAppSelector(mapState)
  const [landkode, setLandkode] = useState<string | undefined>(undefined)
  const [newMottakere, setNewMottakere] = useState<Array<{id: string, name: string}>>([])
  const [_validation, setValidation] = useState<Validation>({})
  const namespace = 'addmottakere'

  const type = sakshandlinger?.includes("multipleParticipants") ? "multiple" : "single"

  const hasNoValidationErrors = (validation: Validation): boolean => _.find(validation, (it) => (it !== undefined)) === undefined

  useEffect(() => {
    dispatch(setInstitusjonerAndLandkoderByBucType(bucType))
  }, [])

  const performValidation = (): boolean => {
    const validation: Validation = {}
    if (_.isEmpty(newMottakere)) {
      validation[namespace + '-mottakere'] = {
        skjemaelementId: namespace + '-mottakere',
        feilmelding: t('validation:noMottakere')
      } as ErrorElement
    }
    setValidation(validation)
    return hasNoValidationErrors(validation)
  }

  const onSaved = () => {
    dispatch(resetMottakere())
    onClose()
  }

  const onSave = () => {
    if (performValidation()) {
      dispatch(addMottakere(rinaSakId, newMottakere))
    }
  }

  const onLandkodeChange = (country: Country): void => {
    const landKode = country.value
    setLandkode(landKode)
    dispatch(setInstitusjonerByLandkode(landKode))
    setValidation({
      ..._validation,
      [namespace + '-landkode']: undefined,
      [namespace + '-institusjon']: undefined
    })
  }

  const onInstitusjonChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedIndex = event.target.selectedIndex;
    const name =  event.target.options[selectedIndex].text

    if(type === "single" && newMottakere.length > 0){
      setValidation({
        ..._validation,
        [namespace + '-institusjon']: {
          skjemaelementId: namespace + '-mottakere',
          feilmelding: t('validation:onlySingleParticipant')
        }
      })
    } else {
      setNewMottakere(newMottakere.concat({id: event.target.value, name: name}))
      setValidation({
        ..._validation,
        [namespace + '-institusjon']: undefined
      })

    }
  }

  const deleteMottakere = (deletedMottaker: string) => {
    const _newMottakere = _.filter(newMottakere, (mottaker) => mottaker.id !== deletedMottaker)
    setNewMottakere(_newMottakere)
  }

  return (
    <MinimalModalDiv>
      {alertMessage && alertType && [types.SVARSED_MOTTAKERE_ADD_FAILURE].indexOf(alertType) >= 0 && (
        <PileCenterDiv>
          <AlertstripeDiv>
            <Alert variant='error'>{alertMessage}</Alert>
          </AlertstripeDiv>
          <VerticalSeparatorDiv />
          <FlexCenterSpacedDiv>
            <div />
            <Button
              variant='secondary'
              onClick={onClose}
            >
              {t('label:damn-really')}
            </Button>
            <div />
          </FlexCenterSpacedDiv>
        </PileCenterDiv>
      )}
      {_.isEmpty(mottakere)
        ? (
          <SectionDiv>
            <PileDiv style={{ width: '100%', lignItems: 'flex-start' }}>
              <Row>
                <Column>
                  <CountrySelect
                    closeMenuOnSelect
                    data-testid={namespace + '-landkode'}
                    error={_validation[namespace + '-landkode']?.feilmelding}
                    id={namespace + '-landkode'}
                    includeList={landkoder ? landkoder : []}
                    label={t('label:land')}
                    lang='nb'
                    onOptionSelected={onLandkodeChange}
                    flagWave
                    value={landkode ?? null}
                  />
                  <VerticalSeparatorDiv />
                </Column>
                <Column>
                  <FlexCenterDiv>
                    <Select
                      data-testid={namespace + '-institusjon'}
                      disabled={!!_.isEmpty(landkode) || gettingInstitusjoner}
                      error={_validation[namespace + '-institusjon']?.feilmelding}
                      id={namespace + '-institusjon'}
                      label={t('label:mottaker-institusjon')}
                      onChange={onInstitusjonChange}
                      value=''
                    >
                      <option value=''>
                        {t('label:velg')}
                      </option>)
                      {institusjoner &&
                        _.orderBy(institusjoner, 'term')
                          .filter((i: Institusjon) =>
                            _.find(newMottakere, nm => nm.id === i.institusjonsID) === undefined
                          )
                          .map((i: Institusjon) => (
                            <option
                              value={i.institusjonsID}
                              key={i.institusjonsID}
                            >
                              {i.navn}
                            </option>
                          ))}
                    </Select>
                    <HorizontalSeparatorDiv size='0.5' />
                    {gettingInstitusjoner && <Loader />}
                  </FlexCenterDiv>
                  <VerticalSeparatorDiv />
                </Column>
              </Row>
              <VerticalSeparatorDiv size='1' />
              {newMottakere.map(mottakere => (
                <div key={mottakere.id} className='slideInFromLeft'>
                  <FlexCenterDiv>
                    {mottakere.name}
                    <HorizontalSeparatorDiv />
                    <Button onClick={() => deleteMottakere(mottakere.id)} icon={<TrashIcon/>}/>
                  </FlexCenterDiv>
                  <VerticalSeparatorDiv size='0.3' />
                </div>
              ))}
              <VerticalSeparatorDiv size='1' />
            </PileDiv>
          </SectionDiv>
          )
        : (
          <>
            <Alert variant='success'>
              {t('message:success-mottakere-saved')}
            </Alert>
            <VerticalSeparatorDiv />
          </>
          )}
      <SectionDiv>
        <VerticalSeparatorDiv />
        {_.isEmpty(mottakere)
          ? (
            <div>
              <Button
                variant='primary'
                disabled={addingMottakere}
                onClick={onSave}
              >
                {addingMottakere && <Loader />}
                {addingMottakere ? t('message:loading-saving') : t('el:button-save')}
              </Button>
              <HorizontalSeparatorDiv />
              <Button
                variant='tertiary'
                disabled={addingMottakere}
                onClick={onClose}
              >
                {t('el:button-cancel')}
              </Button>
            </div>
            )
          : (
            <div>
              <Button
                variant='primary'
                onClick={onSaved}
              >
                {t('el:button-close')}
              </Button>
            </div>
            )}
      </SectionDiv>
    </MinimalModalDiv>
  )
}

export default AddMottakereModal
