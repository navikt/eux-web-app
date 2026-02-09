import { TrashIcon } from '@navikt/aksel-icons';
import {Alert, Button, Loader, Select, Box, HGrid, VStack, HStack} from '@navikt/ds-react'
import { Country } from '@navikt/land-verktoy'
import { addMottakere, resetMottakere } from 'actions/svarsed'
import * as types from 'constants/actionTypes'
import { ErrorElement } from 'declarations/app'
import { State } from 'declarations/reducers'
import { Institusjon, Validation } from 'declarations/types'
import _ from 'lodash'
import React, {useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import {getInstitusjoner} from "actions/sak";
import CountryDropdown from "../../../components/CountryDropdown/CountryDropdown";
import styles from "./AddMottakereModal.module.css"

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
  institusjoner: state.sak.institusjonList,
  gettingInstitusjoner: state.loading.gettingInstitusjoner,
  addingMottakere: state.loading.addingMottakere
})

const AddMottakereModal = ({
  bucType,
  rinaSakId,
  sakshandlinger,
  onClose
}: AddDeltakereModalProps): JSX.Element => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { alertMessage, alertType, gettingInstitusjoner, institusjoner, addingMottakere, mottakere } = useAppSelector(mapState)
  const [landkode, setLandkode] = useState<string | undefined>(undefined)
  const [newMottakere, setNewMottakere] = useState<Array<{id: string, name: string}>>([])
  const [_validation, setValidation] = useState<Validation>({})
  const namespace = 'addmottakere'

  const type = sakshandlinger?.includes("multipleParticipants") ? "multiple" : "single"

  const hasNoValidationErrors = (validation: Validation): boolean => _.find(validation, (it) => (it !== undefined)) === undefined

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
    setLandkode(country.value)
    dispatch(getInstitusjoner(bucType!, country.value!))
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
    <Box className={styles.minimalModal}>
      {alertMessage && alertType && [types.SVARSED_MOTTAKERE_ADD_FAILURE].indexOf(alertType) >= 0 && (
        <VStack gap="4" align="center">
          <Box>
            <Alert variant='error'>{alertMessage}</Alert>
          </Box>
          <HStack gap="4" justify="center">
            <Button
              variant='secondary'
              onClick={onClose}
            >
              {t('label:damn-really')}
            </Button>
          </HStack>
        </VStack>
      )}
      {_.isEmpty(mottakere)
        ? (
            <VStack gap="4">
              <HGrid columns={2} gap="4" align="start">
                <Box>
                  <CountryDropdown
                    closeMenuOnSelect
                    data-testid={namespace + '-landkode'}
                    error={_validation[namespace + '-landkode']?.feilmelding}
                    id={namespace + '-landkode'}
                    countryCodeListName="euEftaLand"
                    label={t('label:land')}
                    onOptionSelected={onLandkodeChange}
                    flagWave
                    values={landkode ?? null}
                    menuPortalTarget={null}
                  />
                </Box>
                <HStack gap="2" align="end">
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
                  {gettingInstitusjoner && <Loader />}
                </HStack>
              </HGrid>
              <VStack gap="1">
                {newMottakere.map(mottakere => (
                  <HStack gap="2" align="center" key={mottakere.id} className='slideInFromLeft'>
                    {mottakere.name}
                    <Button onClick={() => deleteMottakere(mottakere.id)} icon={<TrashIcon/>}/>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          )
        : (
          <Box padding="4">
            <Alert variant='success'>
              {t('message:success-mottakere-saved')}
            </Alert>
          </Box>
          )}
      <HStack justify="center">
        <Box padding="4">
          {_.isEmpty(mottakere)
            ? (
              <HStack gap="4">
                <Button
                  variant='primary'
                  disabled={addingMottakere}
                  onClick={onSave}
                >
                  {addingMottakere && <Loader />}
                  {addingMottakere ? t('message:loading-saving') : t('el:button-save')}
                </Button>
                <Button
                  variant='tertiary'
                  disabled={addingMottakere}
                  onClick={onClose}
                >
                  {t('el:button-cancel')}
                </Button>
              </HStack>
              )
            : (
              <Button
                variant='primary'
                onClick={onSaved}
              >
                {t('el:button-close')}
              </Button>
              )}
        </Box>
      </HStack>
    </Box>
  )
}

export default AddMottakereModal
