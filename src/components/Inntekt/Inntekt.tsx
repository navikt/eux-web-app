import * as svarpasedActions from 'actions/svarpased'
import { Inntekt as IInntekt, Inntekter } from 'declarations/types'
import { Knapp } from 'nav-frontend-knapper'
import { Input, Select } from 'nav-frontend-skjema'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

interface InntektProps {
  fnr: string
  inntekter: Inntekter | undefined
  onInntektChange: () => void
}

const Inntekt: React.FC<InntektProps> = ({ fnr, inntekter, onInntektChange }: InntektProps) => {

  const { t } = useTranslation()
  const [validation, ] = useState<{ [k: string]: any }>({})
  const [fraDato, setFraDato] = useState<string>('')
  const [tilDato, setTilDato] = useState<string>('')
  const [tema, setTema] = useState<string>('')
  const dispatch = useDispatch()

  const fetchInntekt = () => {
    dispatch(svarpasedActions.fetchInntekt({
      fnr: fnr,
      fraDato: fraDato,
      tilDato: tilDato,
      tema: tema
    }))
  }

  return (
    <>
      <Input
        label={t("ui:label-fraDato")}
        feil={validation.fnr}
        value={fraDato}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setFraDato(e.target.value)
        }}
      />
      <Input
        label={t("ui:label-tilDato")}
        feil={validation.fnr}
        value={tilDato}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setTilDato(e.target.value)
        }}
      />
      <Select
        label={t('ui:label-tema')}
        value={tema}
        onChange={(e: any) => {
          setTema(e.target.value)
        }}
      >
        <option value=''>{t('ui:form-choose')}</option>
        <option value='BAR' key='BAR'>Barnetrygd</option>
        <option value='KON' key='KON'>Kontantstøtte</option>
      </Select>
      <Knapp onClick={fetchInntekt}>
        Søk
      </Knapp>

      {inntekter?.map((inntekt: IInntekt) => (
        <>
        {JSON.stringify(inntekt)}
        </>
        )
      )}
    </>
  )
}

export default Inntekt
