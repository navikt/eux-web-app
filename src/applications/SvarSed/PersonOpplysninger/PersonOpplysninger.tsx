import { Heading } from '@navikt/ds-react'
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
import DateInput from 'components/Forms/DateInput'
import Input from 'components/Forms/Input'
import NorskPin from 'components/NorskPin/NorskPin'
import UtenlandskPins from 'components/UtenlandskPins/UtenlandskPins'
import { State } from 'declarations/reducers'
import { Foedested, Kjoenn, PersonInfo, Pin } from 'declarations/sed.d'
import { Person } from 'declarations/types'
import useUnmount from 'hooks/useUnmount'
import performValidation from 'utils/performValidation'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const PersonOpplysninger: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target: string = `${personID}.personInfo`
  const personInfo: PersonInfo | undefined = _.get(replySed, target) // undefined for a brief time when switching to 'familie'
  const namespace: string = `${parentNamespace}-${personID}-personopplysninger`

  const norwegianPin: Pin | undefined = _.find(personInfo?.pin, p => p.land === 'NO')
  const utenlandskPins: Array<Pin> = _.filter(personInfo?.pin, p => p.land !== 'NO')

  useUnmount(() => {
    const [, newValidation] = performValidation<ValidationPersonopplysningerProps>(validation, namespace, validatePersonopplysninger, {
      personInfo,
      personName
    })
    dispatch(setValidation(newValidation))
  })

  const onFornavnChange = (newFornavn: string) => {
    dispatch(updateReplySed(`${target}.fornavn`, newFornavn.trim()))
    if (validation[namespace + '-fornavn']) {
      dispatch(resetValidation(namespace + '-fornavn'))
    }
  }

  const onEtternavnChange = (newEtternavn: string) => {
    dispatch(updateReplySed(`${target}.etternavn`, newEtternavn.trim()))
    if (validation[namespace + '-etternavn']) {
      dispatch(resetValidation(namespace + '-etternavn'))
    }
  }

  const onFodselsdatoChange = (dato: string) => {
    dispatch(updateReplySed(`${target}.foedselsdato`, dato.trim()))
    if (validation[namespace + '-foedselsdato']) {
      dispatch(resetValidation(namespace + '-foedselsdato'))
    }
  }

  const onKjoennChange = (newKjoenn: string) => {
    dispatch(updateReplySed(`${target}.kjoenn`, newKjoenn.trim()))
    if (validation[namespace + '-kjoenn']) {
      dispatch(resetValidation(namespace + '-kjoenn'))
    }
  }

  const onFillOutPerson = (searchedPerson: Person) => {
    const newPersonInfo = _.cloneDeep(personInfo)

    if (searchedPerson.fnr) {
      const index = _.findIndex(newPersonInfo?.pin, p => p.land === 'NO')
      if (index >= 0) {
        newPersonInfo!.pin[index].identifikator = searchedPerson.fnr
      }
    }
    if (searchedPerson.fdato) {
      newPersonInfo!.foedselsdato = searchedPerson.fdato
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
    dispatch(updateReplySed(target, newPersonInfo))
    if (validation[namespace + '-fornavn']) {
      dispatch(resetValidation(namespace + '-fornavn'))
    }
    if (validation[namespace + '-etternavn']) {
      dispatch(resetValidation(namespace + '-etternavn'))
    }
    if (validation[namespace + '-kjoenn']) {
      dispatch(resetValidation(namespace + '-kjoenn'))
    }
    if (validation[namespace + '-foedselsdato']) {
      dispatch(resetValidation(namespace + '-foedselsdato'))
    }
    if (validation[namespace + '-norskpin-nummer']) {
      dispatch(resetValidation(namespace + '-norskpin-nummer'))
    }
  }

  const onUtenlandskPinChange = (newPins: Array<Pin>, whatChanged: string | undefined) => {
    let pins: Array<Pin> = _.cloneDeep(newPins)
    if (_.isNil(pins)) {
      pins = []
    }
    const norwegianPin: Pin | undefined = _.find(personInfo!.pin, p => p.land === 'NO')
    if (!_.isEmpty(norwegianPin)) {
      pins.unshift(norwegianPin!)
    }
    dispatch(updateReplySed(`${target}.pin`, pins))
    if (whatChanged && validation[whatChanged]) {
      dispatch(resetValidation(whatChanged))
    }
  }

  const onFoedestedChange = (newFoedested: Foedested | undefined, whatChanged: string | undefined) => {
    let foedested: Foedested | undefined = _.cloneDeep(newFoedested)
    if (_.isNil(foedested)) {
      foedested = {} as Foedested
    }
    dispatch(updateReplySed(`${target}.pinMangler.foedested`, foedested))
    if (whatChanged && validation[namespace + '-foedested-' + whatChanged]) {
      dispatch(resetValidation(namespace + '-foedested-' + whatChanged))
    }
  }

  const onNorwegianPinSave = (newPin: string) => {
    let pins: Array<Pin> = _.cloneDeep(personInfo!.pin)
    if (_.isNil(pins)) {
      pins = []
    }
    const norwegianPinIndex = _.findIndex(pins, p => p.land === 'NO')
    if (norwegianPinIndex >= 0) {
      pins[norwegianPinIndex].identifikator = newPin!.trim()
    } else {
      pins.push({
        identifikator: newPin!.trim(),
        land: 'NO'
      })
    }
    dispatch(updateReplySed(`${target}.pin`, pins))
    if (validation[namespace + '-norskpin-nummer']) {
      dispatch(resetValidation(namespace + '-norskpin-nummer'))
    }
  }

  return (
    <>
      <PaddedDiv>
        <NorskPin
          norwegianPin={norwegianPin}
          validation={validation}
          namespace={namespace}
          onNorwegianPinSave={onNorwegianPinSave}
          onFillOutPerson={onFillOutPerson}
        />
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column>
            <Input
              error={validation[namespace + '-fornavn']?.feilmelding}
              id='fornavn'
              key={namespace + '-fornavn-' + (personInfo?.fornavn ?? '')}
              label={t('label:fornavn')}
              namespace={namespace}
              onChanged={onFornavnChange}
              required
              value={personInfo?.fornavn ?? ''}
            />
          </Column>
          <Column>
            <Input
              error={validation[namespace + '-etternavn']?.feilmelding}
              id='etternavn'
              key={namespace + '-fornavn-' + (personInfo?.etternavn ?? '')}
              label={t('label:etternavn')}
              namespace={namespace}
              onChanged={onEtternavnChange}
              required
              value={personInfo?.etternavn ?? ''}
            />
          </Column>
          <Column>
            <DateInput
              error={validation[namespace + '-foedselsdato']?.feilmelding}
              id='foedselsdato'
              key={namespace + '-foedselsdato-' + (personInfo?.foedselsdato ?? '')}
              label={t('label:fødselsdato')}
              namespace={namespace}
              onChanged={onFodselsdatoChange}
              required
              value={personInfo?.foedselsdato ?? ''}
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
              onChange={onKjoennChange}
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
        onPinsChanged={onUtenlandskPinChange}
        namespace={namespace + '-pin'}
        validation={validation}
        personName={personName}
      />
      <PaddedDiv>
        <VerticalSeparatorDiv />
        <Heading size='small'>
          {t('label:fødested')}
        </Heading>
      </PaddedDiv>
      <FoedestedFC
        loggingNamespace='svarsed.editor.fodested'
        foedested={personInfo?.pinMangler?.foedested}
        onFoedestedChanged={onFoedestedChange}
        namespace={namespace + '-foedested'}
        validation={validation}
      />
    </>
  )
}

export default PersonOpplysninger
