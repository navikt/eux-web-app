import {VStack, Box, Heading} from '@navikt/ds-react'
import {PaddedDiv} from '@navikt/hoykontrast'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import React from 'react'
import { useAppSelector } from 'store'
import {F027Sed, SvarYtelseTilForeldreloese_V42, SvarYtelseTilForeldreloese_V43} from "../../../declarations/sed";
//import {useTranslation} from "react-i18next";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const IdentifiseringAvDenAvdoede: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  //updateReplySed,
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  //const { t } = useTranslation()
  //const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-ytelsetilforeldreloese`
  const target = `anmodningOmMerInformasjon.svar.ytelseTilForeldreloese`
  const svarYtelseTilForeldreloese: SvarYtelseTilForeldreloese_V42 | SvarYtelseTilForeldreloese_V43 | undefined = _.get(replySed, target)

/*
  const setYtelseTilForeldreloeseProperty = (property: string, value: string) => {
    dispatch(updateReplySed(`${target}.${property}`, value.trim()))
  }
*/

  console.log(validation)
  console.log(namespace)
  console.log(svarYtelseTilForeldreloese)


  //TODO: VALIDATION


  return (
    <PaddedDiv>
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        {(replySed as F027Sed)?.sedVersjon === "4.2" &&
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
            <Heading size="small">4.2</Heading>
          </Box>
        }
        {(replySed as F027Sed)?.sedVersjon === "4.3" &&
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
            <Heading size="small">4.3</Heading>
          </Box>
        }

      </VStack>
    </PaddedDiv>
  )
}

export default IdentifiseringAvDenAvdoede
