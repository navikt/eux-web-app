import PersonCard from 'applications/OpprettSak/PersonCard/PersonCard'
import { State } from 'declarations/reducers'
import { Person } from 'declarations/types'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'

interface SakSidebarSelector {
  person: Person |null |undefined
}

const mapState = (state: State):SakSidebarSelector => ({
  person: state.person.person
})

const SakSidebar = () => {
  const { person }: SakSidebarSelector = useSelector<State, SakSidebarSelector>(mapState)
  const isPersonValid = useCallback((person: Person) =>
    person?.fornavn?.length !== undefined && person?.fnr !== undefined,
  []
  )

  if (person && isPersonValid(person)) {
    return (
      <PersonCard
        className='neutral'
        person={person}
      />
    )
  }

  return <div />
}

export default SakSidebar