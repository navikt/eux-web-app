import {State} from "declarations/reducers";
import {MainFormProps, MainFormSelector} from "../MainForm";
import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "store";
import {UNSAFE_Combobox, Box, Checkbox, Heading, VStack} from "@navikt/ds-react";
import {PaddedDiv} from "@navikt/hoykontrast";
import useUnmount from "hooks/useUnmount";
import { useState } from 'react'
import _ from "lodash";
import {AnmodningOmMerInformasjon} from "declarations/sed";
import {ComboboxOption} from "@navikt/ds-react/cjs/form/combobox/types";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const EtterspurtInformasjon: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed,
  //personName
}: MainFormProps): JSX.Element => {
  //const {t} = useTranslation()
  const {validation}: MainFormSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const namespace = `${parentNamespace}-etterspurtinformasjon`
  const target = 'anmodningOmMerInformasjon'
  const anmodningOmMerInformasjon: AnmodningOmMerInformasjon | undefined = _.get(replySed, target)
  let initialSelectedOptions:ComboboxOption[] = []

  console.log(namespace, anmodningOmMerInformasjon)


  useEffect(() => {
    anmodningOmMerInformasjon?.adopsjon?.etterspurtInformasjonType?.typer?.forEach((type) => {
      // @ts-ignore
      const option: ComboboxOption = initialOptions?.find((o) => o.value === type)
      initialSelectedOptions.push(option)
    })
  }, [])

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    console.log(clonedValidation)
  })

  const setAnmodningOmMerInformasjon = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateReplySed(`${target}.${e.target.value}`, e.target.checked ? {} : undefined))
  }

  const [selectedOptions, setSelectedOptions] = useState<ComboboxOption[]>(initialSelectedOptions);
  const onToggleSelected = (option: string, isSelected: boolean) => {
    if (isSelected) {
      // @ts-ignore
      setSelectedOptions([...selectedOptions, initialOptions?.find((o) => o.value === option)]);
    } else {
      setSelectedOptions(selectedOptions.filter((o) => o?.value !== option));
    }
  };

  const initialOptions = [
    {label: "Dato da adoptivforeldrene fikk_omsorg for det adopterte barnet", value: 'dato_da_adoptivforeldrene_fikk_omsorg_for_det_adopterte_barnet'},
    {label: "Dato da adopsjonsbevillingen ble offentlig registrert", value: 'dato_da_adopsjonsbevillingen_ble_offentlig_registrert'},
    {label: "Dokument som stadfester at adopsjonen er lovlig", value: 'dokument_som_stadfester_at_adopsjonen_er_lovlig'}
  ]

  useEffect(() => {
    const etterspurtInformasjonTypeArray: Array<string> = []
    selectedOptions.forEach((o) => {
      etterspurtInformasjonTypeArray.push(o.value)
    })
    dispatch(updateReplySed(`${target}.adopsjon.etterspurtInformasjonType.typer`, etterspurtInformasjonTypeArray))
  }, [selectedOptions])

  return (
    <>
      <PaddedDiv>
        <Heading size='small'>
          {label}
        </Heading>
        <VStack gap="4">
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
            <Checkbox
              value="adopsjon"
              checked={!!anmodningOmMerInformasjon?.adopsjon}
              onChange={setAnmodningOmMerInformasjon}
            >
              Ved adopsjon
            </Checkbox>
            {!!anmodningOmMerInformasjon?.adopsjon &&
              <>
                <UNSAFE_Combobox
                  label="Etterspurt informasjon"
                  isMultiSelect
                  onToggleSelected={onToggleSelected}
                  selectedOptions={selectedOptions}
                  options={initialOptions}
                />
              </>
            }
          </Box>
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
            <Checkbox
              value="inntekt"
              checked={!!anmodningOmMerInformasjon?.inntekt}
              onChange={setAnmodningOmMerInformasjon}
            >
              Inntekt
            </Checkbox>
          </Box>
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
            <Checkbox
              value="ytelseTilForeldreLoese"
              checked={!!anmodningOmMerInformasjon?.ytelseTilForeldreLoese}
              onChange={setAnmodningOmMerInformasjon}
            >
              Ytelse til foreldreløse
            </Checkbox>
          </Box>
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
            <Checkbox
              value="annenInformasjonOmBarnet"
              checked={!!anmodningOmMerInformasjon?.annenInformasjonOmBarnet}
              onChange={setAnmodningOmMerInformasjon}
            >
              Annen informasjon angående barnet
            </Checkbox>
          </Box>
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
            <Checkbox
              value="utdanning"
              checked={!!anmodningOmMerInformasjon?.utdanning}
              onChange={setAnmodningOmMerInformasjon}
            >
              Fremmøte på skole/høyskole/opplæring/arbeidsledighet
            </Checkbox>
          </Box>
        </VStack>
      </PaddedDiv>
    </>
  )
}

export default EtterspurtInformasjon
