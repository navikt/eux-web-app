import { Heading } from '@navikt/ds-react'
import { PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import DekkedePerioder from 'applications/SvarSed/Trygdeordning/DekkedePerioder'
import FamilieYtelser from 'applications/SvarSed/Trygdeordning/FamilieYtelser'
import { validateTrygdeordninger, ValidateTrygdeordningerProps } from 'applications/SvarSed/Trygdeordning/validation'
import { State } from 'declarations/reducers'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { ReplySed } from 'declarations/sed'
import {isF001Sed, isF002Sed, isF026Sed} from 'utils/sed'
import RettTilYtelserFSED from '../RettTilYtelserFSED/RettTilYtelserFSED'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Trygdeordning: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed,
  setReplySed
}: MainFormProps): JSX.Element => {
  const namespace = `${parentNamespace}-${personID}-trygdeordning`
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidateTrygdeordningerProps>(
      clonedValidation, namespace, validateTrygdeordninger, {
        // clone it, or we can have some state inconsistences between dispatches
        replySed: _.cloneDeep(replySed as ReplySed),
        personID: personID!,
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  return (
    <>
      <PaddedDiv>
        <Heading size='small'>
          {t('label:periode-trygdeordning-avsenderlandet')}
        </Heading>
      </PaddedDiv>
      <DekkedePerioder
        parentNamespace={namespace}
        personID={personID}
        personName={personName}
        replySed={replySed}
        updateReplySed={updateReplySed}
        setReplySed={setReplySed}
        validation={validation}
      />
      {/*TODO: REMOVE THIS BLOCK OF CODE WHEN AKTIVITETOGTRYGDEPERIODER IS DONE*/}
      {(isF001Sed(replySed) || isF002Sed(replySed)) &&
        <>
          <PaddedDiv>
            <Heading size='small'>
              {t('label:trygdeordningen-familieYtelse')}
            </Heading>
          </PaddedDiv>
          <VerticalSeparatorDiv/>
          <FamilieYtelser
            parentNamespace={namespace}
            personID={personID}
            personName={personName}
            replySed={replySed}
            updateReplySed={updateReplySed}
            setReplySed={setReplySed}
            validation={validation}
          />
        </>
      }

      {isF026Sed(replySed) &&
        <RettTilYtelserFSED
          parentNamespace={namespace}
          personID={personID}
          personName={personName}
          replySed={replySed}
          updateReplySed={updateReplySed}
          setReplySed={setReplySed}
        />
      }
    </>
  )
}

export default Trygdeordning
