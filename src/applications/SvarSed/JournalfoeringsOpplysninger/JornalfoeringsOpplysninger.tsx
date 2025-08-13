import React, {useEffect, useState} from 'react'
import {Box, Button, Heading, HStack, Loader, Modal, Select, Spacer, TextField, VStack} from '@navikt/ds-react'
import { Dd, Dl, Dt, HorizontalLineSeparator } from 'components/StyledComponents'
import {Fagsak, Fagsaker, Kodemaps, Kodeverk, Sak, Tema} from 'declarations/types'
import { useTranslation } from 'react-i18next'
import {useAppDispatch, useAppSelector} from "../../../store";
import {State} from "../../../declarations/reducers";
import { useRef } from "react";
import _ from "lodash";
import * as sakActions from "../../../actions/sak";
import {getFagsaker} from "../../../actions/sak";
import Input from "../../../components/Forms/Input";


interface JournalfoeringsOpplysningerProps {
  sak: Sak
}

interface ChangeTemaFagsakModalSelector {
  kodemaps: Kodemaps | undefined
  tema: Tema | undefined
  gettingFagsaker: boolean
  fagsaker: Fagsaker | undefined | null
}

const mapState = (state: State): ChangeTemaFagsakModalSelector => ({
  kodemaps: state.app.kodemaps,
  tema: state.app.tema,
  gettingFagsaker: state.loading.gettingFagsaker,
  fagsaker: state.sak.fagsaker
})

const JournalfoeringsOpplysninger = ({ sak }: JournalfoeringsOpplysningerProps) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const ref = useRef<HTMLDialogElement>(null);
  const { kodemaps, tema, fagsaker, gettingFagsaker }: ChangeTemaFagsakModalSelector = useAppSelector(mapState)

  const [currentFagsak, setCurrentFagsak] = useState<any>(sak.fagsak)

  const namespace = 'changetemafagsak'
  const sektor = sak.sakType.split("_")[0]

  const currentYear = new Date().getFullYear()
  const [fagsakDagpengerYear, setFagsakDagpengerYear] = useState<any>(currentYear)

  const temaer: Array<Kodeverk> = !kodemaps ? [] : !sektor ? [] : !tema ? [] : tema[kodemaps.SEKTOR2FAGSAK[sektor] as keyof Tema]?.filter((k:Kodeverk) => {
    return k.kode !== "GEN"
  })

  const setFagsakProp = (prop: string, value: string): void => {
    const fagsak = {
      ...currentFagsak,
      [prop]: value
    }
    setCurrentFagsak(fagsak)
  }

  const onTemaChange = (value: string) => {
    setFagsakProp("tema", value);
    setFagsakProp("id", "");
    if (value && currentFagsak?.fnr) {
      dispatch(getFagsaker(currentFagsak?.fnr, sektor, value))
    }
  }

  useEffect(() => {
    dispatch(getFagsaker(currentFagsak?.fnr, sektor, currentFagsak?.tema))
  }, [])

  return (
    <>
      <Modal ref={ref} header={{ heading: t('label:endre-tema-fagsak') }} width="medium">
        <Modal.Body>
          <VStack gap="4" padding="4">
            <HStack gap="4" align="end">
              <TextField
                id={namespace + '-fnr'}
                label="FNR" value={currentFagsak?.fnr ?? ''}
                onChange={(e) => setFagsakProp("fnr", e.target.value)}
              />
            </HStack>
            <HStack gap="4" align="center">
              <Select
                id={namespace + '-tema'}
                label={t('label:velg-tema')}
                onChange={(e) => onTemaChange(e.target.value)}
                value={currentFagsak?.tema ?? ''}
              >
                <option value=''>
                  {t('label:velg')}
                </option>)
                {temaer && temaer.map((k: Kodeverk) => (
                  <option value={k.kode} key={k.kode}>
                    {k.term}
                  </option>
                ))}
              </Select>
              {gettingFagsaker && <Loader/>}
              {!gettingFagsaker &&
                <Select
                  id={namespace + '-nr'}
                  label={t('label:velg-fagsak')}
                  onChange={(e)=> setFagsakProp("id", e.target.value)}
                  value={currentFagsak?.id ?? ''}
                >
                  <option value=''>
                    {t('label:velg')}
                  </option>
                  {fagsaker &&
                    fagsaker.map((f: Fagsak) => (
                      <option value={f.id} key={f.id}>
                        {f.nr || f.id}
                      </option>
                    ))
                  }
                </Select>
              }

            </HStack>
          </VStack>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>

      <Box borderWidth="1" borderRadius="small" padding="4" background="surface-default">
        <VStack gap="4">
          <Heading size='small'>
            {t('label:journalfoering')}
          </Heading>
          <HorizontalLineSeparator />
        </VStack>
        <VStack gap="4">
          <Dl>
            <Dt>
              {t('label:tema')}:
            </Dt>
            <Dd>
              {sak.fagsak?.tema ? t('tema:' + sak.fagsak.tema) : ""}
            </Dd>
            <Dt>
              {t('label:fagsak')}:
            </Dt>
            <Dd>
              {sak.fagsak?.nr ? sak.fagsak?.nr : sak.fagsak?.id}
            </Dd>
            <Dt>
              {t('label:journalfoert-paa')}:
            </Dt>
            <Dd>
              {sak.fagsak?.fnr ? sak.fagsak?.fnr : ""}
            </Dd>
          </Dl>
          <Button
            variant='secondary'
            onClick={() => ref.current?.showModal()}
          >
            {t('el:button-change-tema-fagsak')}
          </Button>
        </VStack>
      </Box>
    </>
  )
}

export default JournalfoeringsOpplysninger
