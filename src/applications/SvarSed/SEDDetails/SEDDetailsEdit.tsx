import { AddCircle } from '@navikt/ds-icons'
import { Button, Detail } from '@navikt/ds-react'
import { ActionWithPayload } from '@navikt/fetch'
import { AlignStartRow, Column, HorizontalSeparatorDiv, Row, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { Country, CountryFilter } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import { resetValidation } from 'actions/validation'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import { F002Sed, LokaleSakId, Periode, ReplySed, USed } from 'declarations/sed'
import { UpdateReplySedPayload, Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'store'
import { getIdx } from 'utils/namespace'
import { isF002Sed, isHSed, isUSed } from 'utils/sed'
import { validateSakseier, ValidationSakseierProps } from './validation'

export interface SEDDetailsEditProps {
  replySed: ReplySed,
  updateReplySed: (needle: string, value: any) => ActionWithPayload<UpdateReplySedPayload>
}

const SEDDetailsEdit: React.FC<SEDDetailsEditProps> = ({
  replySed,
  updateReplySed
}: SEDDetailsEditProps): JSX.Element => {
  const { t } = useTranslation()
  const validation: Validation = {}
  const dispatch = useAppDispatch()

  const [_newSakseierSaksnummer, _setNewSakseierSaksnummer] = useState<string>('')
  const [_newSakseierInstitusjonsnavn, _setNewSakseierInstitusjonsnavn] = useState<string>('')
  const [_newSakseierInstitusjonsid, _setNewSakseierInstitusjonsid] = useState<string>('')
  const [_newSakseierLand, _setNewSakseierLand] = useState<string>('')

  const [sakseierAddToDeletion, sakseierRemoveFromDeletion, sakseierIsInDeletion] = useAddRemove<LokaleSakId>((id: LokaleSakId): string => id.institusjonsid)
  const [_sakseierSeeNewForm, _setSakseierSeeNewForm] = useState<boolean>(false)
  const [_sakseierValidation, _sakseierResetValidation, sakseierPerformValidation] = useValidation<ValidationSakseierProps>({}, validateSakseier)

  const namespace = 'seddetails'

  const setSakseierLand = (land: string, index: number) => {
    if (index < 0) {
      _setNewSakseierLand(land.trim())
      //      _resetValidation(namespace + '-lokaleSakIder-land')
    } else {
      dispatch(updateReplySed(`lokaleSakIder[${index}].land`, land.trim()))
      if (validation[namespace + '-lokaleSakIder' + getIdx(index) + '-land']) {
        dispatch(resetValidation(namespace + '-lokaleSakIder' + getIdx(index) + '-land'))
      }
    }
  }

  const setSakseierInstitusjonsid = (institusjonsid: string, index: number) => {
    if (index < 0) {
      _setNewSakseierInstitusjonsid(institusjonsid.trim())
      //    _resetValidation(namespace + '-lokaleSakIder-institusjonsid')
    } else {
      dispatch(updateReplySed(`lokaleSakIder[${index}].institusjonsid`, institusjonsid.trim()))
      if (validation[namespace + '-lokaleSakIder' + getIdx(index) + '-institusjonsid']) {
        dispatch(resetValidation(namespace + '-lokaleSakIder' + getIdx(index) + '-institusjonsid'))
      }
    }
  }

  const setSakseierInstitusjonsnavn = (institusjonsnavn: string, index: number) => {
    if (index < 0) {
      _setNewSakseierInstitusjonsnavn(institusjonsnavn.trim())
    //  _resetValidation(namespace + '-lokaleSakIder-institusjonsnavn')
    } else {
      dispatch(updateReplySed(`lokaleSakIder[${index}].institusjonsnavn`, institusjonsnavn.trim()))
      if (validation[namespace + '-lokaleSakIder' + getIdx(index) + '-institusjonsnavn']) {
        dispatch(resetValidation(namespace + '-lokaleSakIder' + getIdx(index) + '-institusjonsnavn'))
      }
    }
  }

  const setSakseierSaksnummer = (saksnummer: string, index: number) => {
    if (index < 0) {
      _setNewSakseierSaksnummer(saksnummer.trim())
      //   _resetValidation(namespace + '-lokaleSakIder-saksnummer')
    } else {
      dispatch(updateReplySed(`lokaleSakIder[${index}].saksnummer`, saksnummer.trim()))
      if (validation[namespace + '-lokaleSakIder' + getIdx(index) + '-saksnummer']) {
        dispatch(resetValidation(namespace + '-lokaleSakIder' + getIdx(index) + '-saksnummer'))
      }
    }
  }

  const setBrukerFornavn = (fornavn: string) => {
    dispatch(updateReplySed('bruker.personInfo.fornavn', fornavn.trim()))
    if (validation[namespace + '-søker-fornavn']) {
      dispatch(resetValidation(namespace + '-søker-fornavn'))
    }
  }

  const setBrukerEtternavn = (etternavn: string) => {
    dispatch(updateReplySed('bruker.personInfo.etternavn', etternavn.trim()))
    if (validation[namespace + '-søker-etternavn']) {
      dispatch(resetValidation(namespace + '-søker-etternavn'))
    }
  }

  const setEktefelleFornavn = (fornavn: string) => {
    dispatch(updateReplySed('ektefelle.personInfo.fornavn', fornavn.trim()))
    if (validation[namespace + '-ektefelle-fornavn']) {
      dispatch(resetValidation(namespace + '-ektefelle-fornavn'))
    }
  }

  const setEktefelleEtternavn = (etternavn: string) => {
    dispatch(updateReplySed('ektefelle.personInfo.etternavn', etternavn.trim()))
    if (validation[namespace + '-ektefelle-etternavn']) {
      dispatch(resetValidation(namespace + '-ektefelle-etternavn'))
    }
  }

  const setAnmodningsperiode = (periode: Periode) => {
    dispatch(updateReplySed('anmodningsperiode', periode))
    if (validation[namespace + '-anmodningsperiode-stardato']) {
      dispatch(resetValidation(namespace + '-anmodningsperiode-stardato'))
    }
    if (validation[namespace + '-anmodningsperiode-sluttdato']) {
      dispatch(resetValidation(namespace + '-anmodningsperiode-sluttdato'))
    }
  }

  const sakseierResetForm = () => {
    _setNewSakseierInstitusjonsid('')
    _setNewSakseierInstitusjonsnavn('')
    _setNewSakseierLand('')
    _setNewSakseierSaksnummer('')
    _sakseierResetValidation()
  }

  const onSakeierCancel = () => {
    _setSakseierSeeNewForm(false)
    sakseierResetForm()
  }

  const onSakeierRemove = (index: number) => {
    const newLokaleSaksIds: Array<LokaleSakId> = _.cloneDeep((replySed as USed).lokaleSakIder)
    const deletedLokaleSaksIds: Array<LokaleSakId> = newLokaleSaksIds.splice(index, 1)
    if (deletedLokaleSaksIds && deletedLokaleSaksIds.length > 0) {
      sakseierRemoveFromDeletion(deletedLokaleSaksIds[0])
    }
    dispatch(updateReplySed('lokaleSakIder', newLokaleSaksIds))
  }

  const onSakseierAdd = () => {
    const newLokaleSaksId: LokaleSakId = {
      saksnummer: _newSakseierSaksnummer.trim(),
      institusjonsid: _newSakseierInstitusjonsid.trim(),
      institusjonsnavn: _newSakseierInstitusjonsnavn.trim(),
      land: _newSakseierLand
    }

    const valid: boolean = sakseierPerformValidation({
      lokaleSakId: newLokaleSaksId,
      namespace
    })
    if (valid) {
      let newLokaleSaksIder: Array<LokaleSakId> = _.cloneDeep((replySed as USed).lokaleSakIder)
      if (_.isNil(newLokaleSaksIder)) {
        newLokaleSaksIder = []
      }
      newLokaleSaksIder = newLokaleSaksIder.concat(newLokaleSaksId)
      dispatch(updateReplySed('lokaleSakIder', newLokaleSaksIder))
      sakseierResetForm()
    }
  }

  const renderLokaleSakId = (lokaleSakId: LokaleSakId | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : sakseierIsInDeletion(lokaleSakId)
    const idx = (index >= 0 ? '[' + index + ']' : '')
    const getErrorFor = (index: number, el: string): string | undefined => {
      return index < 0
        ? _sakseierValidation[namespace + '-lokaleSakIder' + idx + '-' + el]?.feilmelding
        : validation[namespace + '-lokaleSakIder' + idx + '-' + el]?.feilmelding
    }

    return (
      <>
        <AlignStartRow>
          <Column>
            <Input
              error={getErrorFor(index, 'saksnummer')}
              namespace={namespace}
              key={namespace + '-lokaleSakIder-saksnummer' + (index < 0 ? _newSakseierSaksnummer : lokaleSakId?.saksnummer)}
              id='-saksnummer'
              label={t('label:saksnummer')}
              onChanged={(saksnummer: string) => setSakseierSaksnummer(saksnummer, index)}
              required
              value={(index < 0 ? _newSakseierSaksnummer : lokaleSakId?.saksnummer) ?? ''}
            />
          </Column>
          <Column>
            <CountrySelect
              ariaLabel={t('label:land')}
              closeMenuOnSelect
              data-testid={namespace + '-lokaleSakIder' + idx + '-land'}
              error={getErrorFor(index, 'land')}
              flagWave
              key={namespace + '-lokaleSakIder' + idx + '-land' + (index < 0 ? _newSakseierLand : lokaleSakId?.land)}
              id={namespace + '-lokaleSakIder' + idx + '-land'}
              label={t('label:land')}
              includeList={CountryFilter.STANDARD({})}
              menuPortalTarget={document.body}
              onOptionSelected={(e: Country) => setSakseierLand(e.value, index)}
              required
              values={(index < 0 ? _newSakseierLand : lokaleSakId?.land)}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column>
            <Input
              error={getErrorFor(index, 'institusjonsid')}
              namespace={namespace}
              key={namespace + '-lokaleSakIder-institusjonsid' + lokaleSakId?.institusjonsid}
              id='-institusjonsid'
              label={t('label:institusjonens-id')}
              onChanged={(institusjonsid: string) => setSakseierInstitusjonsid(institusjonsid, index)}
              required
              value={lokaleSakId?.institusjonsid ?? ''}
            />
          </Column>
          <Column>
            <Input
              error={getErrorFor(index, 'institusjonsnavn')}
              namespace={namespace}
              key={namespace + '-lokaleSakIder-institusjonsnavn' + lokaleSakId?.institusjonsnavn}
              id='-institusjonsnavn'
              label={t('label:institusjonens-navn')}
              onChanged={(institusjonsnavn: string) => setSakseierInstitusjonsnavn(institusjonsnavn, index)}
              required
              value={lokaleSakId?.institusjonsnavn ?? ''}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column />
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => sakseierAddToDeletion(lokaleSakId)}
              onConfirmRemove={() => onSakeierRemove(index)}
              onCancelRemove={() => sakseierRemoveFromDeletion(lokaleSakId)}
              onAddNew={onSakseierAdd}
              onCancelNew={onSakeierCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </>
    )
  }

  return (
    <div style={{ maxWidth: '23.5rem' }}>
      {!isHSed(replySed) && (
        <>
          <Detail>
            {t('label:periode')}
          </Detail>
          <VerticalSeparatorDiv size='0.5' />
          {isUSed(replySed) && (
            <>
              <AlignStartRow>
                <PeriodeInput
                  namespace={namespace + '-anmodningsperiode'}
                  error={{
                    startdato: validation[namespace + '-anmodningsperiode-startdato']?.feilmelding,
                    sluttdato: validation[namespace + '-anmodningsperiode-sluttdato']?.feilmelding
                  }}
                  setPeriode={setAnmodningsperiode}
                  breakInTwo
                  value={(replySed as USed).anmodningsperiode}
                />
              </AlignStartRow>
              <VerticalSeparatorDiv size='0.5' />
            </>
          )}

          <VerticalSeparatorDiv />
        </>
      )}
      <Detail>
        {t('label:søker')}
      </Detail>
      <VerticalSeparatorDiv size='0.5' />
      <AlignStartRow>
        <Column>
          <Input
            error={validation[namespace + '-søker-fornavn']?.feilmelding}
            namespace={namespace}
            key={namespace + '-søker-fornavn' + replySed.bruker.personInfo.fornavn}
            id='-søker-fornavn'
            label={t('label:fornavn')}
            onChanged={setBrukerFornavn}
            required
            value={replySed.bruker.personInfo.fornavn ?? ''}
          />
        </Column>
        <HorizontalSeparatorDiv size='0.35' />
        <Column>
          <Input
            error={validation[namespace + '-søker-etternavn']?.feilmelding}
            namespace={namespace}
            key={namespace + '-søker-etternavn' + replySed.bruker.personInfo.etternavn}
            id='-søker-etternavn'
            label={t('label:etternavn')}
            onChanged={setBrukerEtternavn}
            required
            value={replySed.bruker.personInfo.etternavn ?? ''}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      {isUSed(replySed) && (
        <>
          <Detail>
            {t('label:motpart-sakseier')}
          </Detail>
          <VerticalSeparatorDiv size='0.5' />
          {(replySed as USed)?.lokaleSakIder?.map(renderLokaleSakId)}
          <VerticalSeparatorDiv />
          <HorizontalLineSeparator />
          <VerticalSeparatorDiv />
          {_sakseierSeeNewForm
            ? renderLokaleSakId(null, -1)
            : (
              <Row>
                <Column>
                  <Button
                    variant='tertiary'
                    onClick={() => _setSakseierSeeNewForm(true)}
                  >
                    <AddCircle />
                    {t('el:button-add-new-x', { x: t('label:motpart-sakseier').toLowerCase() })}
                  </Button>
                </Column>
              </Row>
              )}
          <VerticalSeparatorDiv />
        </>
      )}
      {isF002Sed(replySed) && (
        <>
          <Detail>
            {t('label:partner')}
          </Detail>
          <VerticalSeparatorDiv size='0.5' />
          <AlignStartRow>
            <Column>
              <Input
                error={validation[namespace + '-ektefelle-fornavn']?.feilmelding}
                namespace={namespace}
                key={namespace + '-ektefelle-fornavn' + (replySed as F002Sed).ektefelle?.personInfo?.fornavn ?? ''}
                id='-ektefelle-fornavn'
                label={t('label:fornavn')}
                onChanged={setEktefelleFornavn}
                required
                value={(replySed as F002Sed).ektefelle?.personInfo?.fornavn ?? ''}
              />
            </Column>
            <HorizontalSeparatorDiv size='0.35' />
            <Column>
              <Input
                error={validation[namespace + '-ektefelle-etternavn']?.feilmelding}
                namespace={namespace}
                key={namespace + '-ektefelle-etternavn' + (replySed as F002Sed).ektefelle?.personInfo?.etternavn ?? ''}
                id='-ektefelle-etternavn'
                label={t('label:etternavn')}
                onChanged={setEktefelleEtternavn}
                required
                value={(replySed as F002Sed).ektefelle?.personInfo?.etternavn ?? ''}
              />
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
        </>
      )}
    </div>
  )
}

export default SEDDetailsEdit
