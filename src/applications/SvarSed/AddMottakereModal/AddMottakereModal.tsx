import { Delete } from '@navikt/ds-icons'
import { Alert, Button, Heading, Loader, Select } from '@navikt/ds-react'
import { Column, FlexCenterDiv, HorizontalSeparatorDiv, PileDiv, Row, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { Country } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import { addMottakere, getInstitusjoner, resetMottakere } from 'actions/svarsed'
import { ErrorElement } from 'declarations/app'
import { State } from 'declarations/reducers'
import { Institusjon, Kodeverk, Validation } from 'declarations/types'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'

const MinimalModalDiv = styled.div`
  min-height: 200px;
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
  existingMottakere: Array<string>
  bucType: string
  rinaSakId: string
  onClose: () => void
}

interface AddDeltakereModalSelector {
  landkoder: Array<Kodeverk> | undefined
  institusjoner: Array<Institusjon> | undefined
  mottakere: any | undefined
  gettingInstitusjoner: boolean
  addingMottakere: boolean
}

const mapState = (state: State): AddDeltakereModalSelector => ({
  landkoder: state.app.landkoder,
  mottakere: state.svarsed.mottakere,
  institusjoner: state.svarsed.institusjoner,
  gettingInstitusjoner: state.loading.gettingInstitusjoner,
  addingMottakere: state.loading.addingMottakere
})

const AddMottakereModal = ({
  existingMottakere,
  bucType,
  rinaSakId,
  onClose
}: AddDeltakereModalProps): JSX.Element => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { gettingInstitusjoner, institusjoner, landkoder, addingMottakere, mottakere } = useAppSelector(mapState)
  const [landkode, setLandkode] = useState<string | undefined>(undefined)
  const [newMottakere, setNewMottakere] = useState<Array<string>>([])
  const [_validation, setValidation] = useState<Validation>({})
  const namespace = 'addmottakere'

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
    const landKode = country.value
    setLandkode(landKode)
    dispatch(getInstitusjoner(bucType, landKode))
    setValidation({
      ..._validation,
      [namespace + '-landkode']: undefined,
      [namespace + '-institusjon']: undefined
    })
  }

  const onInstitusjonChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setNewMottakere(newMottakere.concat(event.target.value))
    setValidation({
      ..._validation,
      [namespace + '-institusjon']: undefined
    })
  }

  const deleteMottakere = (deletedMottaker: string) => {
    const _newMottakere = _.filter(newMottakere, (mottaker) => mottaker !== deletedMottaker)
    setNewMottakere(_newMottakere)
  }

  return (
    <MinimalModalDiv>
      <Heading size='small'>
        {t('label:add-deltakere-modal')}
      </Heading>
      <VerticalSeparatorDiv />

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
                    includeList={landkoder ? _.orderBy(landkoder, 'term').map((k: Kodeverk) => k.kode) : []}
                    label={t('label:land')}
                    lang='nb'
                    menuPortalTarget={document.body}
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
                            _.find(existingMottakere, e => e === i.institusjonsID) === undefined &&
                            _.find(newMottakere, nm => nm === i.institusjonsID) === undefined
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
                <div key={mottakere} className='slideInFromLeft'>
                  <FlexCenterDiv>
                    {mottakere}
                    <HorizontalSeparatorDiv />
                    <Button onClick={() => deleteMottakere(mottakere)}>
                      <Delete />
                    </Button>
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
