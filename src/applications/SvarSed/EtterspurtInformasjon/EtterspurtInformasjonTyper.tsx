import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../store";
// @ts-ignore
import {ComboboxOption} from "@navikt/ds-react/cjs/form/combobox/types";
import {EtterspurtInformasjon} from "declarations/sed";
import {ActionWithPayload} from "@navikt/fetch";
import {UpdateReplySedPayload} from "../../../declarations/types";
import {UNSAFE_Combobox} from "@navikt/ds-react";
import {State} from "../../../declarations/reducers";
import {MainFormSelector} from "../MainForm";
import {resetValidation} from "../../../actions/validation";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})


interface EtterspurtInformasjonTyperProps {
  target: string
  namespace: string
  error: string | undefined
  initialOptions: ComboboxOption[]
  etterspurtInformasjon: EtterspurtInformasjon
  updateReplySed: (needle: string, value: any) => ActionWithPayload<UpdateReplySedPayload>
}

const EtterspurtInformasjonTyper: React.FC<EtterspurtInformasjonTyperProps> = ({
  target,
  namespace,
  error,
  initialOptions,
  etterspurtInformasjon,
  updateReplySed
}: EtterspurtInformasjonTyperProps): JSX.Element => {
  const dispatch = useAppDispatch()
  const {validation}: MainFormSelector = useAppSelector(mapState)

  let initialSelectedOptions:ComboboxOption[] = []
  const [selectedOptions, setSelectedOptions] = useState<ComboboxOption[]>(initialSelectedOptions);

  useEffect(() => {
    etterspurtInformasjon?.etterspurtInformasjonType?.typer?.forEach((type) => {
      // @ts-ignore
      const option: ComboboxOption = initialOptions?.find((o) => o.value === type)
      initialSelectedOptions.push(option)
    })
  }, [])

  useEffect(() => {
    const etterspurtInformasjonTypeArray: Array<string> = []
    selectedOptions.forEach((o) => {
      etterspurtInformasjonTypeArray.push(o.value)
    })
    dispatch(updateReplySed(`${target}.etterspurtInformasjonType.typer`, etterspurtInformasjonTypeArray))
  }, [selectedOptions])


  const onToggleSelected = (option: string, isSelected: boolean) => {
    if (isSelected) {
      // @ts-ignore
      setSelectedOptions([...selectedOptions, initialOptions?.find((o) => o.value === option)]);
    } else {
      setSelectedOptions(selectedOptions.filter((o) => o?.value !== option));
    }
    if(validation[namespace + '-etterspurt-informasjon-typer']){
      dispatch(resetValidation(namespace + '-etterspurt-informasjon-typer'))
    }
  };

  return(
    <UNSAFE_Combobox
      label="Etterspurt informasjon"
      id={namespace + '-etterspurt-informasjon-typer'}
      error={error}
      isMultiSelect
      onToggleSelected={onToggleSelected}
      selectedOptions={selectedOptions}
      options={initialOptions}
    />
  )
}

export default EtterspurtInformasjonTyper
