import {Alert, BodyLong, Heading} from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  FlexRadioPanels,
  PaddedDiv,
  RadioPanel,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { setReplySed } from 'actions/svarsed'
import { resetValidation, setValidation } from 'actions/validation'
import { validatePerson, ValidationPersonProps } from 'applications/PDU1/Person/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Input from 'components/Forms/Input'
import UtenlandskPins from 'components/UtenlandskPins/UtenlandskPins'
import { Pdu1Person } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { Pin, ReplySed } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import Adresse from './Adresse/Adresse'
import StatsborgerskapFC from './Statsborgerskap/Statsborgerskap'
import DateField from "../../../components/DateField/DateField";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Person: React.FC<MainFormProps> = ({
  parentNamespace,
  replySed,
  personName,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target: string = 'bruker'
  const pdu1Person: Pdu1Person | undefined = _.get(replySed, target!) // undefined for a brief time when switching to 'familie'
  const namespace: string = `${parentNamespace}-person`

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationPersonProps>(
      clonedvalidation, namespace, validatePerson, {
        person: pdu1Person
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const onFnrChange = (newFnr: string) => {
    dispatch(updateReplySed(`${target}.fnr`, newFnr.trim()))
    if (validation[namespace + '-fnr']) {
      dispatch(resetValidation(namespace + '-fnr'))
    }
  }

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

  const onUtenlandskPinChange = (newUtenlandskPins: Array<Pin>) => {
    dispatch(updateReplySed(`${target}.utenlandskePin`, newUtenlandskPins.map((pin: Pin) => pin.landkode + ' ' + pin.identifikator)))
    dispatch(resetValidation(namespace + '-utenlandskePin'))
  }

  return (
    <div>
      <PaddedDiv>
        <Heading size='medium'>
          {t('label:personopplysninger')}
        </Heading>
        <VerticalSeparatorDiv size='2' />
        <AlignStartRow>
          <Column>
            <Input
              error={validation[namespace + '-fornavn']?.feilmelding}
              id='fornavn'
              label={t('label:fornavn')}
              namespace={namespace}
              onChanged={onFornavnChange}
              required
              value={pdu1Person?.fornavn ?? ''}
            />
          </Column>
          <Column>
            <Input
              error={validation[namespace + '-etternavn']?.feilmelding}
              id='etternavn'
              label={t('label:etternavn')}
              namespace={namespace}
              onChanged={onEtternavnChange}
              required
              value={pdu1Person?.etternavn ?? ''}
            />
          </Column>
          <Column>
            <DateField
              uiFormat='DD.MM.YYYY'
              finalFormat='DD.MM.YYYY'
              id='foedselsdato'
              namespace={namespace}
              error={validation[namespace + '-foedselsdato']?.feilmelding}
              label={t('label:fødselsdato')}
              onChanged={onFodselsdatoChange}
              dateValue={pdu1Person?.foedselsdato ?? ''}
              required
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv size='2' />
        <AlignStartRow>
          <Column flex='2'>
            <RadioPanelGroup
              value={pdu1Person?.kjoenn}
              data-no-border
              data-testid={namespace + '-kjoenn'}
              error={validation[namespace + '-kjoenn']?.feilmelding}
              id={namespace + '-kjoenn'}
              legend={t('label:kjønn') + ' *'}
              name={namespace + '-kjoenn'}
              onChange={onKjoennChange}
            >
              <FlexRadioPanels>
                <RadioPanel value='K'>
                  {t('label:kvinne')}
                </RadioPanel>
                <RadioPanel value='M'>
                  {t('label:mann')}
                </RadioPanel>
              </FlexRadioPanels>
            </RadioPanelGroup>
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv size='2' />
        <Heading size='small'>{t('label:statsborgerskap')}</Heading>
      </PaddedDiv>
      <StatsborgerskapFC
        replySed={replySed}
        parentNamespace={namespace}
        personName={personName}
        setReplySed={setReplySed}
        updateReplySed={updateReplySed}
      />
      <VerticalSeparatorDiv size='2' />
      <PaddedDiv>
        <Heading size='small'>{t('label:adresse')}</Heading>
        <Adresse
          replySed={replySed}
          parentNamespace={namespace}
          personName={personName}
          setReplySed={setReplySed}
          updateReplySed={updateReplySed}
        />
        <VerticalSeparatorDiv size='2' />
        <Heading size='small'>{t('label:pins')}</Heading>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column>
            <Input
              error={validation[namespace + '-fnr']?.feilmelding}
              id='fnr'
              label={t('label:norsk-fnr')}
              namespace={namespace}
              disabled
              onChanged={onFnrChange}
              value={pdu1Person?.fnr}
            />
            {pdu1Person?.adressebeskyttelse &&
              <>
                <VerticalSeparatorDiv/>
                <Alert size="small" variant='warning'>
                  {t('label:sensitivPerson', {gradering: pdu1Person?.adressebeskyttelse})}
                </Alert>
              </>
            }
          </Column>
          <Column />
        </AlignStartRow>
      </PaddedDiv>
      {(replySed as ReplySed).sedType === 'H001' && (
        <PaddedDiv>
          <BodyLong>{t('message:warning-max-1-utenlandsk-pin')}</BodyLong>
          <VerticalSeparatorDiv />
        </PaddedDiv>
      )}
      <UtenlandskPins
        limit={1}
        loggingNamespace='pdu1.editor.person'
        pins={pdu1Person?.utenlandskePin?.map((pin: string) => {
          const els = pin.split(/\s+/)
          return {
            landkode: els[0],
            identifikator: els[1]
          } as Pin
        })}
        onPinsChanged={onUtenlandskPinChange}
        namespace={namespace + '-utenlandskePin'}
        validation={validation}
        personName={personName}
      />
    </div>
  )
}

export default Person
