import { clientClear } from 'actions/alert'
import * as appActions from 'actions/app'
import { setSpørreSed } from 'actions/svarpased'
import * as svarpasedActions from 'actions/svarpased'
import Tilsette from 'assets/icons/Tilsette'
import Trashcan from 'assets/icons/Trashcan'
import classNames from 'classnames'
import Alert from 'components/Alert/Alert'
import Arbeidsforhold from 'components/Arbeidsforhold/Arbeidsforhold'
import Family from 'components/Family/Family'
import Inntekt from 'components/Inntekt/Inntekt'
import PersonCard from 'components/PersonCard/PersonCard'
import SEDPanel from 'components/SEDPanel/SEDPanel'
import {
  AlignCenterColumn,
  AlignedRow,
  Column,
  Container,
  Content,
  HiddenFormContainer, HighContrastFlatknapp,
  HighContrastHovedknapp,
  HighContrastInput,
  HighContrastKnapp,
  HighContrastPanel,
  HorizontalSeparatorDiv,
  LineSeparator,
  Margin,
  RadioEl,
  RadioGroup,
  Row,
  VerticalSeparatorDiv
} from 'components/StyledComponents'
import TopContainer from 'components/TopContainer/TopContainer'
import * as types from 'constants/actionTypes'
import { AlertStatus } from 'declarations/components'
import { State } from 'declarations/reducers'
import {
  Arbeidsforholdet,
  FamilieRelasjon,
  Inntekt as IInntekt,
  Inntekter,
  Periode,
  Person,
  SedOversikt,
  SvarSed,
  Validation
} from 'declarations/types'
import _ from 'lodash'
import AlertStripe from 'nav-frontend-alertstriper'
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel'
import { Knapp } from 'nav-frontend-knapper'
import { Feiloppsummering, FeiloppsummeringFeil, Input, Select } from 'nav-frontend-skjema'
import { Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { SvarpasedState } from 'reducers/svarpased'
import styled from 'styled-components'
import { Item } from 'tabell'

const SaksnummerOrFnrInput = styled(HighContrastInput)`
  margin-right: 1rem;
`
const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const AlertstripeDiv = styled.div`
  margin: 0.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  width: 50%;
`
const mapState = (state: State): any => ({
  alertStatus: state.alert.clientErrorStatus,
  alertMessage: state.alert.clientErrorMessage,
  alertType: state.alert.type,

  familierelasjonKodeverk: state.app.familierelasjoner,

  gettingPerson: state.loading.gettingPerson,
  queryingSaksnummerOrFnr: state.loading.queryingSaksnummerOrFnr,
  queryingSvarSed: state.loading.queryingSvarSed,
  sendingSvarPaSed: state.loading.sendingSvarPaSed,

  arbeidsforholdList: state.svarpased.arbeidsforholdList,
  inntekter: state.svarpased.inntekter,
  person: state.svarpased.person,
  personRelatert: state.svarpased.personRelatert,
  previousSpørreSed: state.svarpased.previousSpørreSed,
  spørreSed: state.svarpased.spørreSed,
  svarSed: state.svarpased.svarSed,
  svarPaSedOversikt: state.svarpased.svarPaSedOversikt,
  svarPasedData: state.svarpased.svarPasedData,
  valgteFamilieRelasjoner: state.svarpased.familierelasjoner,
  valgteArbeidsforhold: state.svarpased.valgteArbeidsforhold,
  valgtSvarSed: state.svarpased.valgtSvarSed,

  highContrast: state.ui.highContrast
})

export interface SvarPaSedProps {
  location: any
}

const SvarPaSed: React.FC<SvarPaSedProps> = ({
  location
}: SvarPaSedProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [, setIsFnrValid] = useState<boolean>(false)
  const [_addFormal, setAddFormal] = useState<boolean>(false)
  const [_newFormal, setNewFormal] = useState<string>('')
  const [_formal, setFormal] = useState<Array<string>>([])
  const [_mounted, setMounted] = useState<boolean>(false)
  const [_saksnummerOrFnr, setSaksnummerOrFnr] = useState<string | undefined>(undefined)
  const [_validation, setValidation] = useState<Validation>({})
  const {
    alertStatus,
    alertMessage,
    alertType,

    familierelasjonKodeverk,

    gettingPerson,
    queryingSaksnummerOrFnr,
    queryingSvarSed,
    sendingSvarPaSed,

    arbeidsforholdList,
    inntekter,
    person,
    personRelatert,
    previousSpørreSed,
    spørreSed,
    svarSed,
    svarPaSedOversikt,
    svarPasedData,
    valgteArbeidsforhold,
    valgteFamilieRelasjoner,
    valgtSvarSed,

    highContrast
  }: any = useSelector<State, SvarpasedState>(mapState)

/*  const onSaksnummerClick = () => {
    dispatch(svarpasedActions.getSvarSedOversikt(_saksnummerOrFnr))
  }
*/
  const onSaksnummerOrFnrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(appActions.cleanData())
    setSaksnummerOrFnr(e.target.value)
    setIsFnrValid(false)
    resetValidation('saksnummerOrFnr')
  }

  const onSaksnummerOrFnrClick = () => {
    if (!_saksnummerOrFnr) {
      setValidation({
        ..._validation,
        saksnummerOrFnr: {
          feilmelding: t('ui:validation-noSaksnummerOrFnr'),
          skjemaelementId: 'svarpased__saksnummerOrFnr-input'
        } as FeiloppsummeringFeil
      })
    } else {
      dispatch(svarpasedActions.querySaksnummerOrFnr(_saksnummerOrFnr))
    }
  }

  const validate = (): Validation => {
    const validation: Validation = {
      saksnummerOrFnr: !_saksnummerOrFnr
        ? {
          feilmelding: t('ui:validation-noSaksnummerOrFnr'),
          skjemaelementId: 'svarpased__saksnummerOrFnr-input'
        } as FeiloppsummeringFeil
        : undefined,
      svarSed: !valgtSvarSed
        ? {
          feilmelding: t('ui:validation-noSedtype'),
          skjemaelementId: 'svarpased__svarsed-select'
        } as FeiloppsummeringFeil
        : undefined
    }
    setValidation(validation)
    return validation
  }

  const resetValidation = (key?: Array<string> | string): void => {
    const newValidation = _.cloneDeep(_validation)
    if (!key) {
      setValidation({})
    }
    if (_.isString(key)) {
      newValidation[key] = undefined
    }
    if (_.isArray(key)) {
      key.forEach((k) => {
        newValidation[k] = undefined
      })
    }
    setValidation(newValidation)
  }

  const isValid = (_validation: Validation): boolean => {
    return _.find(_.values(_validation), (e) => e !== undefined) === undefined
  }

  const sendData = (): void => {
    if (isValid(validate())) {
      dispatch(svarpasedActions.sendSvarPaSedData(_saksnummerOrFnr, valgtSvarSed.querySedDocumentId, valgtSvarSed.replySedType, data))
    }
  }

  const onSpørreSedChange = (e: any) => {
    const selectedSed: string | undefined = e.target.value
    if (selectedSed) {
      dispatch(svarpasedActions.setSpørreSed(selectedSed))
    }
  }

  const onSvarSedClick = (sedOversikt: SedOversikt) => {
    resetValidation('svarSed')
    setSpørreSed()
    dispatch(svarpasedActions.querySvarSed(_saksnummerOrFnr, sedOversikt))
  }

  const addTpsRelation = (relation: FamilieRelasjon): void => {
    /* Person fra TPS har alltid norsk nasjonalitet. Derfor default til denne. */
    dispatch(
      svarpasedActions.addFamilierelasjoner({
        ...relation,
        nasjonalitet: 'NO'
      })
    )
  }

  const showArbeidsforhold = (): boolean => valgtSvarSed?.replySedType === 'U002' || valgtSvarSed?.replySedType === 'U017'

  const showInntekt = (): boolean => valgtSvarSed?.replySedType === 'U004'

  const onSelectedInntekt = (items: Array<Item>) => {
    const inntekter: Inntekter = items.map(
      (item) =>
        ({
          beloep: item.beloep,
          fraDato: item.fraDato,
          tilDato: item.tilDato,
          type: item.type
        } as IInntekt)
    )
    if (items) {
      dispatch(svarpasedActions.sendSeletedInntekt(inntekter))
    }
  }

  useEffect(() => {
    if (!_mounted) {
      const params: URLSearchParams = new URLSearchParams(location.search)
      const rinasaksnummerParam: string | null = params.get('rinasaksnummer')
      if (rinasaksnummerParam) {
        dispatch(svarpasedActions.querySaksnummerOrFnr(rinasaksnummerParam))
      }
      setMounted(true)
    }
  }, [dispatch, _mounted, location.search])

  // when I have fnr:
  //
  useEffect(() => {
    if (person === undefined && !gettingPerson && !_.isNil(svarSed)) {
      const pin = _.find(svarSed.bruker.personInfo.pin, p => p.land === 'NO')
      if (pin) {
        const fnr = pin.identifikator
        dispatch(svarpasedActions.getPerson(fnr))
        dispatch(svarpasedActions.getArbeidsforholdList(fnr))
      }
    }
  }, [person, _person, gettingPerson, svarSed])

  useEffect(() => {
    if (!_.isNil(person) && _person === undefined) {
      setPerson(person)
      setFnr(person.fnr)
    }
  }, [person, person, _fnr])

  return (
    <TopContainer>
      <Container>
        <Margin />
        <Content>
          <Systemtittel>
            {t('ui:title-svarpased')}
          </Systemtittel>
          <VerticalSeparatorDiv data-size='2'/>
          <AlignedRow className={classNames({ feil: _validation.saksnummerOrFnr })}>
            <Column>
              <SaksnummerOrFnrInput
                bredde='L'
                data-test-id='svarpased__saksnummerOrFnr-input'
                feil={_validation.saksnummerOrFnr ? _validation.saksnummerOrFnr.feilmelding : undefined}
                id='svarpased__saksnummerOrFnr-input'
                label={t('ui:label-saksnummerOrFnr')}
                onChange={onSaksnummerOrFnrChange}
                placeholder={t('ui:placeholder-saksnummerOrFnr')}
                value={_saksnummerOrFnr}
              />
            </Column>
            <AlignCenterColumn>
              <HighContrastKnapp
                disabled={queryingSaksnummerOrFnr}
                spinner={queryingSaksnummerOrFnr}
                onClick={onSaksnummerOrFnrClick}
              >
                {queryingSaksnummerOrFnr ? t('ui:form-searching') : t('ui:form-search')}
              </HighContrastKnapp>
            </AlignCenterColumn>
            <Column/>
          </AlignedRow>
          <VerticalSeparatorDiv />
          {svarPaSedOversikt && (
            <>
              <Row>
                <Column>
                  <RadioGroup
                    legend={t('ui:label-searchResultsForSaksnummerOrFnr', {
                      antall: Object.keys(svarPaSedOversikt).length,
                      saksnummerOrFnr: _saksnummerOrFnr
                    })}
                    feil={undefined}
                  >
                    {Object.keys(svarPaSedOversikt)?.map((sed: string) => (
                      <>
                        <RadioEl
                          name={'svarpased__saksnummerOrFnr-results'}
                          value={sed}
                          checked={spørreSed === sed}
                          label={sed}
                          className='slideAnimate'
                          onChange={onSpørreSedChange}
                        />
                        {svarPaSedOversikt[sed].map((sedoversikt: SedOversikt) => (
                          <HiddenFormContainer className={classNames({
                            slideOpen: previousSpørreSed !== sed && spørreSed === sed,
                            slideClose: previousSpørreSed === sed && spørreSed !== sed,
                            closed: !( (previousSpørreSed !== sed && spørreSed === sed) || (previousSpørreSed === sed && spørreSed !== sed))
                          })}>
                            <HighContrastPanel>
                              <FlexDiv>
                                <div>
                                  <Normaltekst>
                                    {sedoversikt.replySedType} {sedoversikt.replyDisplay}
                                  </Normaltekst>
                                  <Normaltekst>
                                    {sedoversikt.queryDocumentId}
                                  </Normaltekst>
                                </div>
                                <HorizontalSeparatorDiv/>
                                <HighContrastHovedknapp
                                  disabled={queryingSvarSed}
                                  spinner={queryingSvarSed}
                                  mini
                                  kompakt
                                  onClick={() => onSvarSedClick(sedoversikt)}
                                  >
                                  {queryingSvarSed ? t('ui:label-replying') : t('ui:label-reply')}
                                </HighContrastHovedknapp>
                              </FlexDiv>
                            </HighContrastPanel>
                            <VerticalSeparatorDiv/>
                          </HiddenFormContainer>
                        ))}
                      </>
                    ))}

                  </RadioGroup>
                </Column>
                <Column/>
              </Row>
            </>
          )}
          <VerticalSeparatorDiv data-size='2'/>
          {svarSed && (
            <Row>
              <Column style={{flex: 2}}>
                <Systemtittel>
                  {svarSed.replySedType} - {svarSed.replyDisplay}
                </Systemtittel>
                <VerticalSeparatorDiv/>
                <Undertittel>
                  {t('ui:label-choosePurpose')}
                </Undertittel>
                <VerticalSeparatorDiv/>
                {_formal && _formal.map(f => (
                  <FlexDiv>
                    <Normaltekst>
                      {f}
                    </Normaltekst>
                    <HighContrastFlatknapp
                      mini
                      kompakt
                      onClick={() => setFormal(_.filter(_formal, _f => _f !== f))}
                    >
                      <Trashcan/>
                      <HorizontalSeparatorDiv data-size='0.5'/>
                      {t('ui:form-remove')}
                    </HighContrastFlatknapp>
                  </FlexDiv>
                ))}
              {!_addFormal ? (
                <>
                  <HighContrastFlatknapp
                    onClick={() => setAddFormal(!_addFormal)}
                  >
                    <Tilsette/>
                    <HorizontalSeparatorDiv data-size='0.5'/>
                    {t('ui:form-addPurpose')}
                  </HighContrastFlatknapp>
                </>
              ) : (
                <FlexDiv>
                  <HighContrastInput
                    bredde='XXL'
                    style={{flex: 2}}
                    value={_newFormal}
                    onChange={(e) => setNewFormal(e.target.value)}
                  >
                  </HighContrastInput>
                  <HorizontalSeparatorDiv data-size='0.5'/>
                  <FlexDiv>
                    <HighContrastKnapp
                      mini
                      kompakt
                      onClick={() => {
                        setFormal(_formal.concat(_newFormal))
                        setNewFormal('')
                      }}
                    >
                      <Tilsette/>
                      <HorizontalSeparatorDiv data-size='0.5'/>
                      {t('ui:form-add')}
                    </HighContrastKnapp>
                    <HorizontalSeparatorDiv data-size='0.5'/>
                    <HighContrastFlatknapp
                      mini
                      kompakt
                      onClick={() => setAddFormal(!_addFormal)}
                    >
                      {t('ui:form-cancel')}
                    </HighContrastFlatknapp>
                  </FlexDiv>
                </FlexDiv>
              )}
              </Column>
              <VerticalSeparatorDiv />
              <LineSeparator>&nbsp;</LineSeparator>
              <VerticalSeparatorDiv />
              <Column>
                <SEDPanel svarSed={svarSed}/>
              </Column>
            </Row>
          )}
          <VerticalSeparatorDiv />


          {!_.isNil(person) && (
            <>
              {valgtSvarSed?.replySedType.startsWith('F') && (
                <>
                  <Ekspanderbartpanel tittel={t('ui:label-familyRelationships')}>
                    <Family
                      alertStatus={alertStatus}
                      alertMessage={alertMessage}
                      alertType={alertType}
                      abroadPersonFormAlertTypesWatched={[types.SVARPASED_ABROADPERSON_ADD_FAILURE]}
                      TPSPersonFormAlertTypesWatched={[
                        types.SVARPASED_PERSON_RELATERT_GET_FAILURE,
                        types.SVARPASED_TPSPERSON_ADD_FAILURE
                      ]}
                      familierelasjonKodeverk={familierelasjonKodeverk}
                      personRelatert={personRelatert}
                      person={_person}
                      valgteFamilieRelasjoner={valgteFamilieRelasjoner}
                      onAbroadPersonAddedFailure={() => dispatch({ type: types.SVARPASED_ABROADPERSON_ADD_FAILURE })}
                      onAbroadPersonAddedSuccess={(_relation) => {
                        dispatch(svarpasedActions.addFamilierelasjoner(_relation))
                        dispatch({ type: types.SVARPASED_ABROADPERSON_ADD_SUCCESS })
                      }}
                      onRelationAdded={(relation: FamilieRelasjon) => addTpsRelation(relation)}
                      onRelationRemoved={(relation: FamilieRelasjon) => dispatch(svarpasedActions.removeFamilierelasjoner(relation))}
                      onRelationReset={() => dispatch(svarpasedActions.resetPersonRelatert())}
                      onTPSPersonAddedFailure={() => dispatch({ type: types.SVARPASED_TPSPERSON_ADD_FAILURE })}
                      onTPSPersonAddedSuccess={(e: any) => {
                        dispatch(svarpasedActions.addFamilierelasjoner(e))
                        dispatch({ type: types.SVARPASED_TPSPERSON_ADD_SUCCESS })
                      }}
                      onAlertClose={() => dispatch(clientClear())}
                      onSearchFnr={(sok) => {
                        dispatch(svarpasedActions.resetPersonRelatert())
                        dispatch(svarpasedActions.getPersonRelated(sok))
                      }}
                    />
                  </Ekspanderbartpanel>
                  <VerticalSeparatorDiv />
                </>
              )}
              {showArbeidsforhold() && (
                <>
                  <Ekspanderbartpanel tittel={t('ui:label-arbeidsforhold')}>
                    <Arbeidsforhold
                      getArbeidsforholdList={() => dispatch(svarpasedActions.getArbeidsforholdList(_person?.fnr))}
                      valgteArbeidsforhold={valgteArbeidsforhold}
                      arbeidsforholdList={arbeidsforholdList}
                      onArbeidsforholdClick={(item: any, checked: boolean) => dispatch(
                        checked
                          ? svarpasedActions.addArbeidsforhold(item)
                          : svarpasedActions.removeArbeidsforhold(item)
                      )}
                    />
                  </Ekspanderbartpanel>
                  <VerticalSeparatorDiv />
                </>
              )}
              {showInntekt() && _person && _person!.fnr && (
                <Ekspanderbartpanel tittel={t('ui:label-inntekt')}>
                  <Inntekt
                    fnr={person.fnr}
                    highContrast={highContrast}
                    inntekter={inntekter}
                    onSelectedInntekt={onSelectedInntekt}
                  />
                </Ekspanderbartpanel>
              )}
              <VerticalSeparatorDiv />
              <Knapp
                onClick={sendData}
                disabled={sendingSvarPaSed}
                spinner={sendingSvarPaSed}
              >
                {sendingSvarPaSed ? t('ui:label-sendingSvarSed') : t('ui:label-sendSvarSed')}
              </Knapp>
              {!isValid(_validation) && (
                <>
                  <VerticalSeparatorDiv data-size='2' />
                  <Row>
                    <Column>
                      <Feiloppsummering
                        data-test-id='opprettsak__feiloppsummering'
                        tittel={t('ui:validation-feiloppsummering')}
                        feil={Object.values(_validation).filter(v => v !== undefined) as Array<FeiloppsummeringFeil>}
                      />
                    </Column>
                    <HorizontalSeparatorDiv data-size='2' />
                    <Column />
                  </Row>
                </>
              )}
              {alertMessage && alertType && [types.SVARPASED_SENDSVARPASEDDATA_POST_FAILURE].indexOf(alertType) >= 0 && (
                <AlertstripeDiv>
                  <Alert
                    type='client'
                    fixed={false}
                    message={t(alertMessage)}
                    status={alertStatus as AlertStatus}
                    onClose={() => dispatch(clientClear())}
                  />
                </AlertstripeDiv>
              )}
              {!_.isNil(svarPasedData) && (
                <AlertStripe type='suksess'>
                  <FlexDiv>
                    <span>
                      {t('ui:form-sedId') + ': ' + svarPasedData.sedId}
                    </span>
                    <HorizontalSeparatorDiv data-size='0.25' />
                    <span>
                      {t('ui:label-is-created')}.
                    </span>
                    <HorizontalSeparatorDiv data-size='0.25' />
                  </FlexDiv>
                </AlertStripe>
              )}
            </>
          )}
        </Content>
        <Margin />
      </Container>
    </TopContainer>
  )
}

export default SvarPaSed
