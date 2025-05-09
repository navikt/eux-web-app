import {Alert, Heading, TextField} from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  FlexRadioPanels,
  PaddedDiv,
  RadioPanel,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import {
  validatePersonopplysninger,
  ValidationPersonopplysningerProps
} from 'applications/SvarSed/PersonOpplysninger/validation'
import FoedestedFC from 'components/Foedested/Foedested'
import NorskPin from 'components/NorskPin/NorskPin'
import UtenlandskPins from 'components/UtenlandskPins/UtenlandskPins'
import { State } from 'declarations/reducers'
import { Foedested, Kjoenn, PersonInfo, Pin } from 'declarations/sed.d'
import {PersonInfoPDL} from 'declarations/types'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, {useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import DateField from 'components/DateField/DateField'


const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const PersonOpplysninger: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed,
  options
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target: string = `${personID}.personInfo`
  const personInfo: PersonInfo | undefined = _.get(replySed, target) // undefined for a brief time when switching to 'familie'
  const namespace: string = `${parentNamespace}-${personID}-personopplysninger`

  const norwegianPin: Pin | undefined = _.find(personInfo?.pin, p => p.landkode === 'NOR')
  const utenlandskPins: Array<Pin> = _.filter(personInfo?.pin, p => p.landkode !== 'NOR')

  const [gradering, setGradering] = useState<string | null>(null)

  const showFoedested = options && options.hasOwnProperty("showFoedested") ? options["showFoedested"] : true
  const validateOnUnmount = options && options.hasOwnProperty("validateOnUnmount") ? options["validateOnUnmount"] : true

  useUnmount(() => {
    if(validateOnUnmount){
      const clonedValidation = _.cloneDeep(validation)
      performValidation<ValidationPersonopplysningerProps>(clonedValidation, namespace, validatePersonopplysninger, {
        personInfo,
        personName
      }, true)
      dispatch(setValidation(clonedValidation))
    }
  })

  const setFornavn = (newFornavn: string) => {
    if(newFornavn === ""){
      dispatch(updateReplySed(`${target}.fornavn`, undefined))
    } else {
      dispatch(updateReplySed(`${target}.fornavn`, newFornavn))
    }
    if (validation[namespace + '-fornavn']) {
      dispatch(resetValidation(namespace + '-fornavn'))
    }
  }

  const setEtternavn = (newEtternavn: string) => {
    if(newEtternavn === ""){
      dispatch(updateReplySed(`${target}.etternavn`, undefined))
    } else {
      dispatch(updateReplySed(`${target}.etternavn`, newEtternavn.trim()))
    }
    if (validation[namespace + '-etternavn']) {
      dispatch(resetValidation(namespace + '-etternavn'))
    }
  }

  const setFodselsdato = (dato: string) => {
    if(dato === ""){
      dispatch(updateReplySed(`${target}.foedselsdato`, undefined))
    } else {
      dispatch(updateReplySed(`${target}.foedselsdato`, dato.trim()))
    }
    if (validation[namespace + '-foedselsdato']) {
      dispatch(resetValidation(namespace + '-foedselsdato'))
    }
  }

  const setKjoenn = (newKjoenn: string) => {
    dispatch(updateReplySed(`${target}.kjoenn`, newKjoenn.trim()))
    if (validation[namespace + '-kjoenn']) {
      dispatch(resetValidation(namespace + '-kjoenn'))
    }
  }

  const fillOutPerson = (searchedPerson: PersonInfoPDL) => {
    let newPersonInfo = _.cloneDeep(personInfo)
    if(!newPersonInfo){
      newPersonInfo = {fornavn: "", etternavn: ""}
    }


    setGradering(searchedPerson?.adressebeskyttelse && searchedPerson?.adressebeskyttelse !== "UGRADERT" ? searchedPerson.adressebeskyttelse : null)

    if (searchedPerson.fnr) {
      const index = _.findIndex(newPersonInfo?.pin, p => p.landkode === 'NOR')
      if (index >= 0) {
        newPersonInfo!.pin![index].identifikator = searchedPerson.fnr
      } else if (newPersonInfo!.pin){
        newPersonInfo!.pin.push({
          identifikator: searchedPerson.fnr,
          landkode: 'NOR'
        })
      } else {
        newPersonInfo!.pin = [{
          identifikator: searchedPerson.fnr,
          landkode: 'NOR'
        }]
      }
    }
    if (searchedPerson.foedselsdato) {
      newPersonInfo!.foedselsdato = searchedPerson.foedselsdato
    }
    if (searchedPerson.fornavn) {
      newPersonInfo!.fornavn = searchedPerson.fornavn
    }
    if (searchedPerson.etternavn) {
      newPersonInfo!.etternavn = searchedPerson.etternavn
    }
    if (searchedPerson.kjoenn) {
      newPersonInfo!.kjoenn = searchedPerson.kjoenn as Kjoenn
    }
    if (searchedPerson.statsborgerskap) {
      newPersonInfo!.statsborgerskap = searchedPerson.statsborgerskap
    }

    dispatch(updateReplySed(target, newPersonInfo))
    dispatch(resetValidation([
      namespace + '-fornavn',
      namespace + '-etternavn',
      namespace + '-kjoenn',
      namespace + '-foedselsdato',
      namespace + '-norskpin'
    ]))
  }

  const setUtenlandskPin = (newPins: Array<Pin>) => {
    let pins: Array<Pin> | undefined = _.cloneDeep(newPins)
    if (_.isNil(pins)) {
      pins = []
    }
    const norwegianPin: Pin | undefined = _.find(personInfo!.pin, p => p.landkode === 'NOR')
    if (!_.isEmpty(norwegianPin)) {
      pins.unshift(norwegianPin!)
    }
    dispatch(updateReplySed(`${target}.pin`, pins))
    dispatch(resetValidation(namespace + '-pin'))
  }

  const setFoedsted = (newFoedested: Foedested) => {
    dispatch(updateReplySed(`${target}.pinMangler.foedested`, newFoedested))
  }

  const saveNorwegianPin = (newPin: string) => {
    let pins: Array<Pin> | undefined = _.cloneDeep(personInfo!.pin)
    if (_.isNil(pins)) {
      pins = []
    }
    const norwegianPinIndex = _.findIndex(pins, p => p.landkode === 'NOR')
    if (norwegianPinIndex >= 0) {
      pins[norwegianPinIndex].identifikator = newPin!.trim()
    } else {
      pins.push({
        identifikator: newPin!.trim(),
        landkode: 'NOR'
      })
    }
    dispatch(updateReplySed(`${target}.pin`, pins))
    if (validation[namespace + '-norskpin']) {
      dispatch(resetValidation(namespace + '-norskpin'))
    }
  }

  return (
    <>
      <PaddedDiv>
        <Heading size='small'>
          {label}
        </Heading>
      </PaddedDiv>
      <NorskPin
        norwegianPin={norwegianPin}
        error={validation[namespace + '-norskpin']?.feilmelding}
        namespace={namespace}
        onNorwegianPinSave={saveNorwegianPin}
        onFillOutPerson={fillOutPerson}
      />
      <VerticalSeparatorDiv />
      {gradering &&
        <PaddedDiv>
          <Alert size="small" variant='warning'>
            {t('label:sensitivPerson', {gradering: gradering})}
          </Alert>
        </PaddedDiv>
      }
      {personInfo?.adressebeskyttelse && personInfo?.adressebeskyttelse !== "UGRADERT" && !gradering &&
        <PaddedDiv>
          <Alert size="small" variant='warning'>
            {t('label:sensitivPerson', {gradering: personInfo?.adressebeskyttelse})}
          </Alert>
        </PaddedDiv>
      }
      <PaddedDiv>
        <AlignStartRow>
          <Column>
            <TextField
              error={validation[namespace + '-fornavn']?.feilmelding}
              id={namespace + '-' + "fornavn"}
              label={t('label:fornavn') + ' *'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFornavn(e.target.value)
              }}
              value={personInfo?.fornavn ?? ''}
            />
          </Column>
          <Column>
            <TextField
              error={validation[namespace + '-etternavn']?.feilmelding}
              id={namespace + '-' + 'etternavn'}
              label={t('label:etternavn') + ' *'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEtternavn(e.target.value)
              }}
              value={personInfo?.etternavn ?? ''}
            />
          </Column>
          <Column>
            <DateField
              error={validation[namespace + '-foedselsdato']?.feilmelding}
              id='foedselsdato'
              namespace={namespace}
              label={t('label:fødselsdato')}
              onChanged={setFodselsdato}
              dateValue={personInfo?.foedselsdato}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv size='2' />
        <AlignStartRow>
          <Column>
            <RadioPanelGroup
              value={personInfo?.kjoenn}
              data-no-border
              data-testid={namespace + '-kjoenn'}
              error={validation[namespace + '-kjoenn']?.feilmelding}
              id={namespace + '-kjoenn'}
              legend={t('label:kjønn') + ' *'}
              name={namespace + '-kjoenn'}
              onChange={setKjoenn}
            >
              <FlexRadioPanels>
                <RadioPanel value='M'>
                  {t(personID?.startsWith('barn') ? 'label:gutt' : 'label:mann')}
                </RadioPanel>
                <RadioPanel value='K'>
                  {t(personID?.startsWith('barn') ? 'label:jente' : 'label:kvinne')}
                </RadioPanel>
                <RadioPanel value='U'>
                  {t('label:ukjent')}
                </RadioPanel>
              </FlexRadioPanels>
            </RadioPanelGroup>
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <Heading size='small'>
          {t('label:utenlandske-pin')}
        </Heading>
      </PaddedDiv>
      <UtenlandskPins
        limit={99}
        loggingNamespace='svarsed.editor.personopplysning'
        pins={utenlandskPins}
        onPinsChanged={setUtenlandskPin}
        namespace={namespace + '-pin'}
        validation={validation}
        personName={personName}
      />
      {showFoedested &&
        <>
          <PaddedDiv>
            <VerticalSeparatorDiv />
            <Heading size='small'>
              {t('label:fødested')}
            </Heading>
          </PaddedDiv>
          <FoedestedFC
            loggingNamespace='svarsed.editor.fodested'
            foedested={personInfo?.pinMangler?.foedested}
            onFoedestedChanged={setFoedsted}
            namespace={namespace + '-foedested'}
            personName={personName}
            validation={validation}
          />
        </>
      }
    </>
  )
}

export default PersonOpplysninger
