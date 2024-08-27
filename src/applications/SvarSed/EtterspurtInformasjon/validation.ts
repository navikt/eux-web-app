import { Validation } from 'declarations/types'
import {checkIfNotEmpty, checkLength} from 'utils/validation'
import {AnmodningOmMerInformasjon} from "../../../declarations/sed";


export interface ValidationEtterspurtInformasjonProps {
  anmodningOmMerInformasjon: AnmodningOmMerInformasjon
}

export const validateEtterspurtInformasjon = (
  v: Validation,
  namespace: string,
  {
    anmodningOmMerInformasjon
  }: ValidationEtterspurtInformasjonProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if(anmodningOmMerInformasjon && anmodningOmMerInformasjon.adopsjon){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: anmodningOmMerInformasjon?.adopsjon.etterspurtInformasjonType?.typer,
      id: namespace  + '-adopsjon-etterspurt-informasjon-typer',
      message: 'validation:noEtterspurtInformasjonType',
      extra: {
        type: "adopsjon"
      }
    }))
  }

  if(anmodningOmMerInformasjon && anmodningOmMerInformasjon.inntekt){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: anmodningOmMerInformasjon?.inntekt.etterspurtInformasjonType?.typer,
      id: namespace  + '-inntekt-etterspurt-informasjon-typer',
      message: 'validation:noEtterspurtInformasjonType',
      extra: {
        type: "inntekt"
      }
    }))
  }

  if(anmodningOmMerInformasjon && anmodningOmMerInformasjon.annenInformasjonOmBarnet){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: anmodningOmMerInformasjon?.annenInformasjonOmBarnet.etterspurtInformasjonType?.typer,
      id: namespace  + '-annenInformasjonOmBarnet-etterspurt-informasjon-typer',
      message: 'validation:noEtterspurtInformasjonType',
      extra: {
        type: "annen informasjon angående barnet"
      }
    }))
  }

  if(anmodningOmMerInformasjon && anmodningOmMerInformasjon.ytelseTilForeldreLoese){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: anmodningOmMerInformasjon?.ytelseTilForeldreLoese.etterspurtInformasjonType?.typer,
      id: namespace  + '-ytelseTilForeldreLoese-etterspurt-informasjon-typer',
      message: 'validation:noEtterspurtInformasjonType',
      extra: {
        type: "ytelse til foreldreløse"
      }
    }))
  }

  if(anmodningOmMerInformasjon && anmodningOmMerInformasjon.utdanning){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: anmodningOmMerInformasjon?.utdanning.type,
      id: namespace  + '-utdanning-type',
      message: 'validation:noUtdanningType',
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: anmodningOmMerInformasjon?.utdanning.typeDeltakelse,
      id: namespace  + '-utdanning-typedeltakelse',
      message: 'validation:noUtdanningTypeDeltakelse',
    }))
  }

  if(anmodningOmMerInformasjon && anmodningOmMerInformasjon.utdanning && anmodningOmMerInformasjon.utdanning.timerPr) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: anmodningOmMerInformasjon?.utdanning.timer,
      id: namespace + '-utdanning-timer',
      message: 'validation:noUtdanningTimer',
    }))

  }

    hasErrors.push(checkLength(v, {
    needle: anmodningOmMerInformasjon?.adopsjon?.ytterligereInformasjon,
    max: 255,
    id: namespace + '-adopsjon-ytterligereinformasjon',
    message: 'validation:textOverX',
  }))

  hasErrors.push(checkLength(v, {
    needle: anmodningOmMerInformasjon?.inntekt?.ytterligereInformasjon,
    max: 255,
    id: namespace + '-inntekt-ytterligereinformasjon',
    message: 'validation:textOverX',
  }))

  hasErrors.push(checkLength(v, {
    needle: anmodningOmMerInformasjon?.annenInformasjonOmBarnet?.ytterligereInformasjon,
    max: 255,
    id: namespace + '-annenInformasjonOmBarnet-ytterligereinformasjon',
    message: 'validation:textOverX',
  }))

  hasErrors.push(checkLength(v, {
    needle: anmodningOmMerInformasjon?.ytelseTilForeldreLoese?.ytterligereInformasjon,
    max: 255,
    id: namespace + '-ytelseTilForeldreLoese-ytterligereinformasjon',
    message: 'validation:textOverX',
  }))

  hasErrors.push(checkLength(v, {
    needle: anmodningOmMerInformasjon?.utdanning?.ytterligereInformasjon,
    max: 255,
    id: namespace + '-utdanning-ytterligereinformasjon',
    message: 'validation:textOverX',
  }))

  return hasErrors.find(value => value) !== undefined
}

