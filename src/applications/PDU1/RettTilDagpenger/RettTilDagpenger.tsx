import { Checkbox, Heading } from '@navikt/ds-react'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Input from 'components/Forms/Input'
import { IkkeRettTilDagpenger, ReplyPdu1, RettTilDagpenger } from 'declarations/pd'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { AlignStartRow, Column, FlexCenterDiv, PaddedDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

const mapState = (state: State): PersonManagerFormSelector => ({
  validation: state.validation.status
})

const RettTilDagpengerFC: React.FC<PersonManagerFormProps> = ({
   parentNamespace,
   personID,
   replySed,
   setReplySed,
   updateReplySed
}: PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {validation} = useSelector<State, PersonManagerFormSelector>(mapState)
  const dispatch = useDispatch()
  const rettTilDagpenger: RettTilDagpenger | undefined = _.get(replySed, 'rettTilDagpenger')
  const ikkeRettTilDagpenger: IkkeRettTilDagpenger | undefined = _.get(replySed, 'ikkeRettTilDagpenger')
  const namespace = `${parentNamespace}-${personID}-rettTilDagpenger`

  const [rettTilDagpengerCheckbox, setRettTilDagpengerCheckbox] = useState(() => !_.isEmpty(rettTilDagpenger))
  const [ikkeRettTilDagpengerCheckbox, setIkkeRettTilDagpengerCheckbox] = useState(() => !_.isEmpty(ikkeRettTilDagpenger))

  const onRettTilDagpengerCheckboxChange = (checked: boolean) => {
    if (!checked) {
      let newReplySed: ReplyPdu1 = _.cloneDeep(replySed) as ReplyPdu1
      delete newReplySed.rettTilDagpenger
      dispatch(setReplySed(newReplySed))
    }
    setRettTilDagpengerCheckbox(checked)
  }

  const onIkkeRettTilDagpengerCheckboxChange = (checked: boolean) => {
    if (!checked) {
      let newReplySed: ReplyPdu1 = _.cloneDeep(replySed) as ReplyPdu1
      delete newReplySed.ikkeRettTilDagpenger
      dispatch(setReplySed(newReplySed))
    }
    setIkkeRettTilDagpengerCheckbox(checked)
  }

  const onStartdatoChange = (newStartdato: string) => {
    dispatch(updateReplySed(`rettTilDagpenger.startdato`, newStartdato.trim()))
    if (validation[namespace + '-rettTilDagpenger-startdato']) {
      dispatch(resetValidation(namespace + '-rettTilDagpenger-startdato'))
    }
  }

  const onSluttdatoChange = (newSluttdato: string) => {
    dispatch(updateReplySed(`rettTilDagpenger.sluttdato`, newSluttdato.trim()))
    if (validation[namespace + '-rettTilDagpenger-sluttdato']) {
      dispatch(resetValidation(namespace + '-rettTilDagpenger-sluttdato'))
    }
  }

  const onIhhTilArtikkel64Change = (ihhTilArtikkel64: boolean) => {
    dispatch(updateReplySed(`rettTilDagpenger.ihhTilArtikkel64`, ihhTilArtikkel64 ? 'ja' : 'nei'))
    if (validation[namespace + '-rettTilDagpenger-ihhTilArtikkel64']) {
      dispatch(resetValidation(namespace + '-rettTilDagpenger-ihhTilArtikkel64'))
    }
  }

  const onIhhTilArtikkel65Change = (ihhTilArtikkel65: boolean) => {
    dispatch(updateReplySed(`rettTilDagpenger.ihhTilArtikkel65`, ihhTilArtikkel65 ? 'ja' : 'nei'))
    if (validation[namespace + '-rettTilDagpenger-ihhTilArtikkel65']) {
      dispatch(resetValidation(namespace + '-rettTilDagpenger-ihhTilArtikkel65'))
    }
  }

  // Ikke rett til dagpenger

  const onIhhTilLovgivningChange = (ihhTilLovgivning: boolean) => {
    dispatch(updateReplySed(`ikkeRettTilDagpenger.ihhTilLovgivning`, ihhTilLovgivning ? 'ja' : 'nei'))
    if (validation[namespace + '-rettTilDagpenger-ihhTilLovgivning']) {
      dispatch(resetValidation(namespace + '-rettTilDagpenger-ihhTilLovgivning'))
    }
  }

  const onIkkeSoektChange = (ikkeSoekt: boolean) => {
    dispatch(updateReplySed(`ikkeRettTilDagpenger.ikkeSoekt`, ikkeSoekt ? 'ja' : 'nei'))
    if (validation[namespace + '-rettTilDagpenger-ikkeSoekt']) {
      dispatch(resetValidation(namespace + '-rettTilDagpenger-ikkeSoekt'))
    }
  }

  return (
    <PaddedDiv key={namespace + '-div'}>
      <Heading size='medium'>
        {t('label:rett-til-dagpenger')}
      </Heading>
      <VerticalSeparatorDiv size='2'/>
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <Checkbox
            checked={rettTilDagpengerCheckbox}
            data-test-id={namespace + '-rettTilDagpengerCheckbox'}
            error={validation[namespace + '-rettTilDagpengerCheckbox']?.feilmelding}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onRettTilDagpengerCheckboxChange(e.target.checked)
            }}
          >
            {t('el:checkbox-pdu1-6.1')}
          </Checkbox>
        </Column>
      </AlignStartRow>
      <AlignStartRow className='slideInFromLeft'>
        <Column style={{maxWidth: '40px'}}/>
        <Column>
          <Checkbox
            checked={rettTilDagpenger?.ihhTilArtikkel64 === 'ja'}
            data-test-id={namespace + '-ihhTilArtikkel64'}
            error={validation[namespace + '-ihhTilArtikkel64']?.feilmelding}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onIhhTilArtikkel64Change(e.target.checked)
            }}
          >
            {t('el:checkbox-pdu1-6.1.1')}
          </Checkbox>
        </Column>
      </AlignStartRow>
      <AlignStartRow className='slideInFromLeft'>
        <Column style={{maxWidth: '40px'}}/>
        <Column>
          <Checkbox
            checked={rettTilDagpenger?.ihhTilArtikkel65 === 'ja'}
            data-test-id={namespace + '-ihhTilArtikkel65'}
            error={validation[namespace + '-ihhTilArtikkel65']?.feilmelding}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onIhhTilArtikkel65Change(e.target.checked)
            }}
          >
            {t('el:checkbox-pdu1-6.1.2')}
          </Checkbox>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv/>
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <FlexCenterDiv>
          <PaddedDiv size='0.5'>
            {t('label:for-perioden-fra')}
          </PaddedDiv>
          <Input
            ariaLabel={t('label:startdato')}
            error={validation[namespace + '-startdato']?.feilmelding}
            id='startdato'
            key={namespace + '-startdato-' + rettTilDagpenger?.startdato}
            label={t('label:startdato')}
            namespace={namespace}
            onChanged={onStartdatoChange}
            value={rettTilDagpenger?.startdato}
          />
            <PaddedDiv size='0.5'>{t('label:til').toLowerCase()}</PaddedDiv>
          <Input
            ariaLabel={t('label:sluttdato')}
            error={validation[namespace + '-sluttdato']?.feilmelding}
            id='sluttdato'
            key={namespace + '-sluttdato-' + rettTilDagpenger?.sluttdato}
            label={t('label:sluttdato')}
            namespace={namespace}
            onChanged={onSluttdatoChange}
            value={rettTilDagpenger?.sluttdato}
          />
          </FlexCenterDiv>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2'/>
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <Checkbox
            checked={ikkeRettTilDagpengerCheckbox}
            data-test-id={namespace + '-ikkeRettTilDagpengerCheckbox'}
            error={validation[namespace + '-ikkeRettTilDagpengerCheckbox']?.feilmelding}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onIkkeRettTilDagpengerCheckboxChange(e.target.checked)
            }}
          >
            {t('el:checkbox-pdu1-6.2')}
          </Checkbox>
        </Column>
      </AlignStartRow>
      <AlignStartRow className='slideInFromLeft'>
        <Column style={{maxWidth: '40px'}}/>
        <Column>
          <Checkbox
            checked={ikkeRettTilDagpenger?.ihhTilLovgivning === 'ja'}
            data-test-id={namespace + '-ihhTilLovgivning'}
            error={validation[namespace + '-ihhTilLovgivning']?.feilmelding}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onIhhTilLovgivningChange(e.target.checked)
            }}
          >
            {t('el:checkbox-pdu1-6.2.1')}
          </Checkbox>
        </Column>
      </AlignStartRow>
      <AlignStartRow className='slideInFromLeft'>
        <Column style={{maxWidth: '40px'}}/>
        <Column>
          <Checkbox
            checked={ikkeRettTilDagpenger?.ikkeSoekt === 'ja'}
            data-test-id={namespace + '-ikkeSoekt'}
            error={validation[namespace + '-ikkeSoekt']?.feilmelding}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onIkkeSoektChange(e.target.checked)
            }}
          >
            {t('el:checkbox-pdu1-6.2.2')}
          </Checkbox>
        </Column>
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default RettTilDagpengerFC

