
import { Input, Select } from 'nav-frontend-skjema'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const Inntekt = () => {

  const { t } = useTranslation()
  const [validation, ] = useState<{ [k: string]: any }>({})
  const [fraDato, setFraDato] = useState<string>('')
  const [tilDato, setTilDato] = useState<string>('')
  const [tema, setTema] = useState<string>('')
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

    </>
  )
}

export default Inntekt
