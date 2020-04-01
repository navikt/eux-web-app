import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { stageSelector } from 'setupTests'
import AbroadPersonForm, { AbroadPersonFormProps, AbroadPersonFormSelector } from './AbroadPersonForm'
import { kjoenn } from 'eessi-kodeverk/lib/kjoenn'
import { landkoder } from 'eessi-kodeverk/lib/landkoder'
import { familierelasjoner } from 'eessi-kodeverk/lib/familierelasjoner'

jest.mock('react-router-dom', () => ({
  Link: () => (<div className='mock-link' />)
}))

describe('components/Family/AbroadPersonForm', () => {
  let wrapper: ReactWrapper
  const initialMockProps: AbroadPersonFormProps = {
    rolleList: familierelasjoner
  }

  const defaultSelector: AbroadPersonFormSelector = {
    kjoenn: kjoenn,
    landkoder: landkoder
  }

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

  beforeEach(() => {
    wrapper = mount(<AbroadPersonForm {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })


  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('HTML structure', () => {
    expect(wrapper.exists('.c-abroadPersonForm')).toBeTruthy()
  })
})
