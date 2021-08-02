import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import ExpandingPanel from 'components/ExpandingPanel/ExpandingPanel'
import Stack from 'components/Stack/Stack'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ArbeidsforholdMedForsikring from '../Arbeidsforhold/ArbeidsforholdMedForsikring'
import ArbeidsforholdOther from '../Arbeidsforhold/ArbeidsforholdOther'
import ArbeidsforholdSvangerskap from '../Arbeidsforhold/ArbeidsforholdSvangerskap'
import ArbeidsforholdUtdanning from '../Arbeidsforhold/ArbeidsforholdUtdanning'
import ArbeidsforholdUtenForsikring from '../Arbeidsforhold/ArbeidsforholdUtenForsikring'

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
  personID
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    highContrast,
    replySed
  } = useSelector<State, ForsikringSelector>(mapState)
  const namespace = `${parentNamespace}-${personID}-forsikring`

  const periodeTypeHash: {[k in string]: string} = {
    perioderAnsattMedForsikring: 'ansettelsesforhold_som_utgjør_forsikringsperiode',
    perioderAnsattUtenForsikring: 'ansettelsesforhold_som_ikke_utgjør_forsikringsperiode',
    perioderSelvstendigMedForsikring: 'selvstendig_næringsvirksomhet_som_utgjør_forsikringsperiode',
    perioderSelvstendigUtenForsikring: 'selvstendig_næringsvirksomhet_som_ikke_utgjør_forsikringsperiode',
    perioderFrihetsberoevet: 'frihetsberøvelse_som_utgjør_eller_behandles_som_forsikringsperiode',
    perioderSyk: 'sykdomsperiode_som_utgjør_eller_behandles_som_forsikringsperiode',
    perioderSvangerskapBarn: 'svangerskapsperiode_eller_omsorg_for_barn_som_utgjør_forsikringsperiode_eller_behandles_som_forsikringsperiode',
    perioderUtdanning: 'utdanningsperiode_som_utgjør_eller_behandles_som_forsikringsperiode',
    perioderMilitaertjeneste: 'militærtjeneste_eller_alternativ_tjeneste_som_utgjør_forsikringsperiode_eller_behandles_som_forsikringsperiode',
    perioderAnnenForsikring: 'annen_periode_som_utgjør_eller_behandles_som_forsikringsperiode'
  }

  const initialPeriodeType: Array<string> = []
  const periodeTypes = ['perioderAnsattMedForsikring', 'perioderAnsattUtenForsikring', 'perioderSelvstendigMedForsikring',
    'perioderSelvstendigUtenForsikring', 'perioderFrihetsberoevet', 'perioderSyk', 'perioderSvangerskapBarn',
    'perioderUtdanning', 'perioderMilitaertjeneste', 'perioderAnnenForsikring']

  periodeTypes.forEach((type: string) => {
    if (!_.isEmpty(_.get(replySed, type))) {
      initialPeriodeType.push(periodeTypeHash[type])
    }
  })

  const [_periodeType, setPeriodeType] = useState<Array<string>>(initialPeriodeType)

  const periodeOptions: Options = [
    { label: t('el:option-forsikring-ANSATTPERIODE_FORSIKRET'), value: 'ansettelsesforhold_som_utgjør_forsikringsperiode' },
    { label: t('el:option-forsikring-SELVSTENDIG_FORSIKRET'), value: 'selvstendig_næringsvirksomhet_som_utgjør_forsikringsperiode' },
    { label: t('el:option-forsikring-ANSATTPERIODE_UFORSIKRET'), value: 'ansettelsesforhold_som_ikke_utgjør_forsikringsperiode' },
    { label: t('el:option-forsikring-SELVSTENDIG_UFORSIKRET'), value: 'selvstendig_næringsvirksomhet_som_ikke_utgjør_forsikringsperiode' },
    { label: t('el:option-forsikring-SYKDOMSPERIODE'), value: 'sykdomsperiode_som_utgjør_eller_behandles_som_forsikringsperiode' },
    { label: t('el:option-forsikring-SVANGERSKAP_OMSORGSPERIODE'), value: 'svangerskapsperiode_eller_omsorg_for_barn_som_utgjør_forsikringsperiode_eller_behandles_som_forsikringsperiode' },
    { label: t('el:option-forsikring-FRIHETSBEROEVETPERIODE'), value: 'frihetsberøvelse_som_utgjør_eller_behandles_som_forsikringsperiode' },
    { label: t('el:option-forsikring-UTDANNINGSPERIODE'), value: 'utdanningsperiode_som_utgjør_eller_behandles_som_forsikringsperiode' },
    { label: t('el:option-forsikring-MILITAERTJENESTE'), value: 'militærtjeneste_eller_alternativ_tjeneste_som_utgjør_forsikringsperiode_eller_behandles_som_forsikringsperiode' },
    { label: t('el:option-forsikring-ANNENPERIODE'), value: 'annen_periode_som_utgjør_eller_behandles_som_forsikringsperiode' }
  ]

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
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv size='2' />
      {_periodeType.sort((a, b) => {
        return t('el:option-' + a).localeCompare(t('el:option-' + b))
      }).map(type => {
        const target = Object.keys(periodeTypeHash).find(k => periodeTypeHash[k] === type)!
        return (
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
              <>
                {(type === periodeTypeHash.perioderAnsattMedForsikring || type === periodeTypeHash.perioderSelvstendigMedForsikring) && (
                  <ArbeidsforholdMedForsikring
                    parentNamespace={namespace}
                    target={target}
                    typeTrygdeforhold={periodeTypeHash[type]}
                  />
                )}
                {(type === periodeTypeHash.perioderAnsattUtenForsikring || type === periodeTypeHash.perioderSelvstendigUtenForsikring) && (
                  <ArbeidsforholdUtenForsikring
                    parentNamespace={namespace}
                    target={target}
                    typeTrygdeforhold={periodeTypeHash[type]}
                  />
                )}
                {type === periodeTypeHash.perioderFrihetsberoevet && (
                  <ArbeidsforholdMedForsikring
                    parentNamespace={namespace}
                    target={target}
                    typeTrygdeforhold={periodeTypeHash[type]}
                  />
                )}
                {(type === periodeTypeHash.perioderSyk || type === periodeTypeHash.perioderSvangerskapBarn) && (
                  <ArbeidsforholdSvangerskap
                    parentNamespace={namespace}
                    target={target}
                    typeTrygdeforhold={periodeTypeHash[type]}
                  />
                )}
                {(type === periodeTypeHash.perioderUtdanning || type === periodeTypeHash.perioderMilitaertjeneste) && (
                  <ArbeidsforholdUtdanning
                    parentNamespace={namespace}
                    target={target}
                    typeTrygdeforhold={periodeTypeHash[type]}
                  />
                )}
                {type === periodeTypeHash.perioderAnnenForsikring && (
                  <ArbeidsforholdOther
                    parentNamespace={namespace}
                    target={target}
                    typeTrygdeforhold={periodeTypeHash[type]}
                  />
                )}
              </>
            </ExpandingPanel>
            <VerticalSeparatorDiv size='2' />
          </div>
        )
      }
      )}
    </PaddedDiv>
  )
}

export default Forsikring
