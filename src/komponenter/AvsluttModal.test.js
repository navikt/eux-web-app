/* eslint-disable no-undef */
import React from 'react';

import AvsluttModal from './AvsluttModal';
import * as Nav from '../utils/navFrontend';

let wrapper;

describe(('DokumentKort Test Suite'), () => {
  const closeModal = jest.fn();
  beforeEach(() => {
    wrapper = shallow(<AvsluttModal closeModal={closeModal} visModal={false} />);
  });
  afterEach(() => {
    closeModal.mockClear();
  });
  describe('Presentasjon', () => {
    it('somketest', () => {
      expect(wrapper).toHaveLength(1);
    });
    it('mounter Modal med korrekte props', () => {
      const component = wrapper.find(Nav.Modal);
      expect(component).toHaveLength(1);
      expect(component.props().isOpen).toEqual(false);
      expect(typeof (component.props().onRequestClose)).toEqual('function');
      expect(component.props()).toHaveProperty('contentLabel', 'Bekreft navigasjon tilbake til forsiden');
    });
    it('viser Undertittel med props', () => {
      const component = wrapper.find(Nav.Undertittel);
      expect(component).toHaveLength(1);
      expect(component.children().text()).toEqual('Er du sikker på at du vil avbryte?');
    });
    it('viser Normaltekst med props', () => {
      const component = wrapper.find(Nav.Normaltekst);
      expect(component).toHaveLength(1);
      expect(component.children().text()).toEqual('Informasjonen du har fyllt inn hittil vil ikke bli lagret.');
    });
    it('viser Hovedknapper med props', () => {
      const component = wrapper.find(Nav.Hovedknapp);
      expect(component).toHaveLength(2);
      expect(component.at(0).children().text()).toEqual('JA, AVBRYT');
      expect(component.at(1).children().text()).toEqual('NEI, FORTSETT');
      expect(component.at(1).props().onClick).toEqual(closeModal);
    });
    it('avslutt Hovedknapp lukker modal ved klikk', () => {
      const component = wrapper.find(Nav.Hovedknapp);
      component.at(1).props().onClick();
      expect(closeModal).toHaveBeenCalledTimes(1);
    });
  });
});
