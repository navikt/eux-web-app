import {Alert, Heading} from '@navikt/ds-react'
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
import DateField from 'components/DateField/DateField'
import Input from 'components/Forms/Input'
import NorskPin from 'components/NorskPin/NorskPin'
import { State } from 'declarations/reducers'
import { Kjoenn, PersonLight, Pin } from 'declarations/sed.d'
import { Person } from 'declarations/types'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, {useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validatePersonLight, ValidationPersonLightProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const PersonLightFC: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target: string = `${personID}`
  const personLight: PersonLight | undefined = _.get(replySed, target) // undefined for a brief time when switching to 'familie'
  const namespace: string = `${parentNamespace}-${personID}-personlight`

  const norwegianPin: Pin | undefined = _.find(personLight?.pin, p => p.land === 'NO')
  const [gradering, setGradering] = useState<string | null>(null)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationPersonLightProps>(clonedValidation, namespace, validatePersonLight, {
      personLight,
      personName
    })
    dispatch(setValidation(clonedValidation))
  })

  const setFornavn = (newFornavn: string) => {
    dispatch(updateReplySed(`${target}.fornavn`, newFornavn.trim()))
    if (validation[namespace + '-fornavn']) {
      dispatch(resetValidation(namespace + '-fornavn'))
    }
  }

  const setEtternavn = (newEtternavn: string) => {
    dispatch(updateReplySed(`${target}.etternavn`, newEtternavn.trim()))
    if (validation[namespace + '-etternavn']) {
      dispatch(resetValidation(namespace + '-etternavn'))
    }
  }

  const setFodselsdato = (dato: string) => {
    dispatch(updateReplySed(`${target}.foedselsdato`, dato.trim()))
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

  const fillOutPerson = (searchedPerson: Person) => {
    let newPersonLight: PersonLight | undefined = _.cloneDeep(personLight)
    setGradering(searchedPerson?.adressebeskyttelse ? searchedPerson.adressebeskyttelse : null)

    if (!newPersonLight) {
      newPersonLight = {} as PersonLight
    }
    if (searchedPerson.fnr) {
      const index = _.findIndex(newPersonLight?.pin, p => p.land === 'NO')
      if (index >= 0) {
        _.set(newPersonLight, `pin[${index}].identifikator`, searchedPerson.fnr)
      }
    }
    if (searchedPerson.fdato) {
      newPersonLight!.foedselsdato = searchedPerson.fdato
    }
    if (searchedPerson.fornavn) {
      newPersonLight!.fornavn = searchedPerson.fornavn
    }
    if (searchedPerson.etternavn) {
      newPersonLight!.etternavn = searchedPerson.etternavn
    }
    if (searchedPerson.kjoenn) {
      newPersonLight!.kjoenn = searchedPerson.kjoenn as Kjoenn
    }
    dispatch(updateReplySed(target, newPersonLight))
    dispatch(resetValidation([
      namespace + '-fornavn',
      namespace + '-etternavn',
      namespace + '-kjoenn',
      namespace + '-foedselsdato',
      namespace + '-norskpin'
    ]))
  }

  const saveNorwegianPin = (newPin: string) => {
    let pins: Array<Pin> | undefined = _.cloneDeep(personLight!.pin)
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
      {personLight?.adressebeskyttelse && !gradering &&
        <PaddedDiv>
          <Alert size="small" variant='warning'>
            {t('label:sensitivPerson', {gradering: personLight?.adressebeskyttelse})}
          </Alert>
        </PaddedDiv>
      }
      <PaddedDiv>
        <AlignStartRow>
          <Column>
            <Input
              error={validation[namespace + '-fornavn']?.feilmelding}
              id='fornavn'
              label={t('label:fornavn')}
              namespace={namespace}
              onChanged={setFornavn}
              required
              value={personLight?.fornavn ?? ''}
            />
          </Column>
          <Column>
            <Input
              error={validation[namespace + '-etternavn']?.feilmelding}
              id='etternavn'
              label={t('label:etternavn')}
              namespace={namespace}
              onChanged={setEtternavn}
              required
              value={personLight?.etternavn ?? ''}
            />
          </Column>
          <Column>
            <DateField
              error={validation[namespace + '-foedselsdato']?.feilmelding}
              id='foedselsdato'
              label={t('label:fødselsdato')}
              namespace={namespace}
              onChanged={setFodselsdato}
              required
              dateValue={personLight?.foedselsdato ?? ''}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv size='2' />
        <AlignStartRow>
          <Column>
            <RadioPanelGroup
              value={personLight?.kjoenn}
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
      </PaddedDiv>
    </>
  )
}

export default PersonLightFC
