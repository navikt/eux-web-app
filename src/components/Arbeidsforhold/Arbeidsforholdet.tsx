import Edit from 'assets/icons/Edit'
import Tilsette from 'assets/icons/Tilsette'
import Trashcan from 'assets/icons/Trashcan'
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper'
import { Checkbox } from 'nav-frontend-skjema'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HighContrastKnapp,
  HighContrastLink,
  HighContrastPanel,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import IkonArbeidsforhold from 'resources/images/ikon-arbeidsforhold'
import styled from 'styled-components'
import { formatterDatoTilNorsk } from 'utils/dato'
import { Arbeidsforholdet } from 'declarations/types.d'

const ArbeidsforholdPanel = styled(HighContrastPanel)`
  padding: 0rem !important;
`
const EditIcon = styled(Edit)`
  cursor: pointer;
`
const TrashcanIcon = styled(Trashcan)`
  width: 20px;
  cursor: pointer;
`
const FlexDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`
const PaddedLink = styled(HighContrastLink)`
  padding: 0rem 0.35rem;
`
const ArbeidsforholdItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`
const ArbeidsforholdDesc = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1rem;
`
export interface ArbeidsforholdetProps {
  arbeidsforholdet: Arbeidsforholdet
  editable?: boolean
  index: number
  personID: string
  selected?: boolean
  onArbeidsforholdClick: (a: Arbeidsforholdet, checked: boolean) => void
  onArbeidsforholdEdited?: (a: Arbeidsforholdet) => void
  onArbeidsforholdDelete?: (a: Arbeidsforholdet) => void
}

const ArbeidsforholdetFC: React.FC<ArbeidsforholdetProps> = ({
  arbeidsforholdet, editable, index, selected, personID,
  onArbeidsforholdClick, onArbeidsforholdDelete = () => {}, onArbeidsforholdEdited = () => {}
}: ArbeidsforholdetProps): JSX.Element => {
  const {
    arbeidsforholdIDnav,
    navn,
    orgnr,
    ansettelsesPeriode
  } = arbeidsforholdet
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [_currentArbeidsperiodeStartDato, setCurrentArbeidsperiodeStartDato] = useState<string>(arbeidsforholdet.ansettelsesPeriode?.fom || '')
  const [_currentArbeidsperiodeSluttDato, setCurrentArbeidsperiodeSluttDato] = useState<string>(arbeidsforholdet.ansettelsesPeriode?.tom || '')
  const [_currentArbeidsperiodeOrgnr, setCurrentArbeidsperiodeOrgnr] = useState<string>(arbeidsforholdet.orgnr || '')
  const [_currentArbeidsperiodeNavn, setCurrentArbeidsperiodeNavn] = useState<string>(arbeidsforholdet.navn || '')

  const hasError = true
  const { fom, tom } = ansettelsesPeriode!

  if (!navn || !orgnr) {
    return <div />
  }
  return (
    <div key={arbeidsforholdIDnav}>
      <VerticalSeparatorDiv data-size='0.5' />
      <ArbeidsforholdPanel key={index} border>
        <ArbeidsforholdItem>
          <ArbeidsforholdDesc>
            <IkonArbeidsforhold />
            <HorizontalSeparatorDiv />
            <div>
              {isEditing
                ? (
                  <Row>
                    <Column>
                      <HighContrastInput
                        data-test-id={'c-familymanager-' + personID + '-personensstatus-arbeidsperiode-' + index + '-navn-input'}
                        feil={undefined}
                        id={'c-familymanager-' + personID + '-personensstatus-arbeidsperiode-' + index + '-navn-input'}
                        onChange={(e: any) => setCurrentArbeidsperiodeNavn(e.target.value)}
                        value={_currentArbeidsperiodeNavn}
                        label={t('label:navn')}
                        placeholder={t('elements:placeholder-input-default')}
                      />
                    </Column>
                    <Column>
                      <HighContrastInput
                        data-test-id={'c-familymanager-' + personID + '-personensstatus-arbeidsperiode-' + index + '-orgnr-input'}
                        feil={undefined}
                        id={'c-familymanager-' + personID + '-personensstatus-arbeidsperiode-' + index + '-orgnr-input'}
                        onChange={(e: any) => setCurrentArbeidsperiodeOrgnr(e.target.value)}
                        value={_currentArbeidsperiodeOrgnr}
                        label={t('label:orgnr')}
                        placeholder={t('elements:placeholder-input-default')}
                      />
                    </Column>
                  </Row>
                  )
                : (
                  <>
                    <strong>{navn}</strong>
                    <br />
                    {t('label:orgnummer')}:&nbsp;{orgnr}
                    <br />
                  </>
                  )}
              {isEditing
                ? (
                  <>
                    <VerticalSeparatorDiv data-size='0.5' />
                    <Row>
                      <Column>
                        <HighContrastInput
                          data-test-id={'c-familymanager-' + personID + '-personensstatus-arbeidsperiode-' + index + '-startdato-input'}
                          feil={undefined}
                          id={'c-familymanager-' + personID + '-personensstatus-arbeidsperiode-' + index + '-startdato-input'}
                          onChange={(e: any) => setCurrentArbeidsperiodeStartDato(e.target.value)}
                          value={_currentArbeidsperiodeStartDato}
                          label={t('label:endDate')}
                          placeholder={t('elements:placeholder-date-default')}
                        />
                      </Column>
                      <Column>
                        <HighContrastInput
                          data-test-id={'c-familymanager-' + personID + '-personensstatus-arbeidsperiode-' + index + '-sluttdato-input'}
                          feil={undefined}
                          id={'c-familymanager-' + personID + '-personensstatus-arbeidsperiode-' + index + '-sluttdato-input'}
                          onChange={(e: any) => setCurrentArbeidsperiodeSluttDato(e.target.value)}
                          value={_currentArbeidsperiodeSluttDato}
                          label={t('label:endDate')}
                          placeholder={t('elements:placeholder-date-default')}
                        />
                      </Column>
                    </Row>
                  </>
                  )
                : (
                  <>
                    {t('label:startDate')}:&nbsp;
                    {formatterDatoTilNorsk(fom)}
                    <br />
                    {t('label:startDate')}:&nbsp;
                    {formatterDatoTilNorsk(tom)}
                    <br />
                  </>
                  )}
              {isEditing && (
                <>
                  <VerticalSeparatorDiv />
                  <HighContrastKnapp
                    mini
                    kompakt
                    onClick={() =>
                      onArbeidsforholdEdited({
                        navn: _currentArbeidsperiodeNavn,
                        orgnr: _currentArbeidsperiodeOrgnr,
                        ansettelsesPeriode: {
                          fom: _currentArbeidsperiodeStartDato,
                          tom: _currentArbeidsperiodeSluttDato
                        }
                      } as Arbeidsforholdet)}
                  >
                    <Tilsette />
                    <HorizontalSeparatorDiv data-size='0.5' />
                    {t('label:add')}
                  </HighContrastKnapp>
                  <HorizontalSeparatorDiv data-size='0.5' />
                  <HighContrastFlatknapp
                    mini
                    kompakt
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {t('label:cancel')}
                  </HighContrastFlatknapp>
                </>
              )}
            </div>
          </ArbeidsforholdDesc>
          <ArbeidsforholdDesc>
            {editable && !isEditing && !isDeleting && (
              <>
                <div>
                  <TrashcanIcon onClick={() => setIsDeleting(!isDeleting)} />
                  <HorizontalSeparatorDiv data-size='0.5' />
                </div>
                <div>
                  <EditIcon onClick={() => setIsEditing(!isEditing)} />
                  <HorizontalSeparatorDiv data-size='0.5' />
                </div>
              </>
            )}
            {!isEditing && !isDeleting && (
              <Checkbox
                checked={selected}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onArbeidsforholdClick(
                  arbeidsforholdet,
                  e.target.checked
                )}
                label={t('label:choose')}
              />
            )}
          </ArbeidsforholdDesc>
          {isDeleting && (
            <div>
              <strong>
                Are you sure?
              </strong>
              <VerticalSeparatorDiv />
              <HighContrastKnapp
                mini
                kompakt
                onClick={() =>
                  onArbeidsforholdDelete(arbeidsforholdet)}
              >
                <Trashcan />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('label:remove')}
              </HighContrastKnapp>
              <HorizontalSeparatorDiv data-size='0.5' />
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => setIsDeleting(!isDeleting)}
              >
                {t('label:cancel')}
              </HighContrastFlatknapp>
            </div>
          )}
        </ArbeidsforholdItem>
        {hasError && (
          <AlertStripeAdvarsel>
            <FlexDiv>
              {t('message:warning-conflict-aa-1')}
              <PaddedLink href='#'>{t('message:warning-conflict-aa-link-1')}</PaddedLink>
              {t('message:warning-conflict-aa-2')}
              <PaddedLink href='#'>{t('message:warning-conflict-aa-link-2')}</PaddedLink>
            </FlexDiv>
          </AlertStripeAdvarsel>
        )}
      </ArbeidsforholdPanel>
      <VerticalSeparatorDiv data-size='0.5' />
    </div>
  )
}

export default ArbeidsforholdetFC
