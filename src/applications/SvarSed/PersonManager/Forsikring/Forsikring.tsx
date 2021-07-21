import Arbeidsforhold from 'applications/SvarSed/PersonManager/Arbeidsforhold/Arbeidsforhold'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import ExpandingPanel from 'components/ExpandingPanel/ExpandingPanel'
import Stack from 'components/Stack/Stack'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

interface ForsikringSelector extends PersonManagerFormSelector {
  highContrast: boolean
}

const mapState = (state: State): ForsikringSelector => ({
  highContrast: state.ui.highContrast,
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const Forsikring: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  personName
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    highContrast
  } = useSelector<State, ForsikringSelector>(mapState)
  // TODO add target
  // const target = 'xxxforsikring'
  // const xxx: any = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-forsikring`

  const [_periodeType, setPeriodeType] = useState<Array<string>>([])

  const periodeOptions: Options = [
    { label: t('el:option-forsikring-1'), value: 'forsikring-1' },
    { label: t('el:option-forsikring-2'), value: 'forsikring-2' },
    { label: t('el:option-forsikring-3'), value: 'forsikring-3' },
    { label: t('el:option-forsikring-4'), value: 'forsikring-4' },
    { label: t('el:option-forsikring-5'), value: 'forsikring-5' },
    { label: t('el:option-forsikring-6'), value: 'forsikring-6' },
    { label: t('el:option-forsikring-7'), value: 'forsikring-7' },
    { label: t('el:option-forsikring-8'), value: 'forsikring-8' },
    { label: t('el:option-forsikring-9'), value: 'forsikring-9' },
    { label: t('el:option-forsikring-10'), value: 'forsikring-10' }
  ]

  /* "option-forsikring-1" : "Ansettelsesforhold som utgjør forsikringsperiode",
  "option-forsikring-2" : "Selvstendig næringsvirksomhet som utgjør forsikringsperiode",
  "option-forsikring-3" : "Ansettelsesforhold som ikke utgjør forsikringsperiode",
  "option-forsikring-4" : "Selvstendig næringsvirksomhet som ikke utgjør forsikringsperiode",
  "option-forsikring-5" : "Sykdomsperiode som utgjør eller behandøes som forsikringsperiode",
  "option-forsikring-6" : "Svangerskapsperiode eller omsorg for barn som utgjør forsikringsperiode eller behandles som forsikringsperiode",
  "option-forsikring-7" : "Frihetsberøvelse som utgjør eller behandles som forsikringsperiode",
  "option-forsikring-8" : "Utdanningsperiode som utgjør eller behandles som forsikringsperiode",
  "option-forsikring-9" : "Militærtjeneste eller alternativ tjeneste som utgjør forsikringsperiode eller behandles som forsikringsperiode",
  "option-forsikring-10" : "Annen periode som utgjør eller behandles som forsikringsperiode",

  protected static final String ANSATTPERIODE_FORSIKRET = "ansettelsesforhold_som_utgjør_forsikringsperiode";
  protected static final String SELVSTENDIG_FORSIKRET = "selvstendig_næringsvirksomhet_som_utgjør_forsikringsperiode";
  protected static final String ANSATTPERIODE_UFORSIKRET = "ansettelsesforhold_som_ikke_utgjør_forsikringsperiode";
  protected static final String SELVSTENDIG_UFORSIKRET = "selvstendig_næringsvirksomhet_som_ikke_utgjør_forsikringsperiode";
  protected static final String SYKDOMSPERIODE = "sykdomsperiode_som_utgjør_eller_behandles_som_forsikringsperiode";
  protected static final String SVANGERSKAP_OMSORGSPERIODE = "svangerskapsperiode_eller_omsorg_for_barn_som_utgjør_forsikringsperiode_eller_behandles_som_forsikringsperiode";
  protected static final String FRIHETSBEROEVETPERIODE = "frihetsberøvelse_som_utgjør_eller_behandles_som_forsikringsperiode";
  protected static final String UTDANNINGSPERIODE = "utdanningsperiode_som_utgjør_eller_behandles_som_forsikringsperiode";
  protected static final String MILITAERTJENESTE = "militærtjeneste_eller_alternativ_tjeneste_som_utgjør_forsikringsperiode_eller_behandles_som_forsikringsperiode";
  protected static final String ANNENPERIODE = "annen_periode_som_utgjør_eller_behandles_som_forsikringsperiode";
  */

  return (
    <PaddedDiv>
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <Undertittel>
            {t('label:forsikring')}
          </Undertittel>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column>
          <Stack
            feil={undefined}
            highContrast={highContrast}
            initialValues={_periodeType}
            itemLabel={t('label:periode')}
            namespace='formål'
            options={periodeOptions}
            onChange={setPeriodeType}
            selectLabel={t('label:type-periode')}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      {_periodeType.sort((a, b) => {
        return t('el:option-' + a).localeCompare(t('el:option-' + b))
      }).map(type => (
        <div key={type}>
          <ExpandingPanel
            open
            renderContentWhenClosed
            heading={(
              <Undertittel>
                {_.find(periodeOptions, p => p.value === type)?.label}
              </Undertittel>
          )}
          >
            <Arbeidsforhold
              parentNamespace={namespace}
              personID={personID}
              personName={personName}
            />
          </ExpandingPanel>
          <VerticalSeparatorDiv size='2' />
        </div>
      ))}
    </PaddedDiv>
  )
}

export default Forsikring
