import Ui from 'eessi-pensjon-ui'
import moment from 'moment'
import PT from 'prop-types'
import React from 'react'

const yyyMMdd = (dato: any) => moment(dato).format('YYYY-MM-DD');

const DokumentKort = ({ dokumenter, value, onChange }: any) => (
  <Ui.Nav.Panel className="dokumentsok__kort">
    <Ui.Nav.Select
      id="id-rinadokument"
      name="rinadokumentID"
      label="Velg SED Type" bredde="xl"
      onChange={onChange}
      value={value}
    >
      {dokumenter && dokumenter.map((element: any) => <option value={element.rinadokumentID} key={element.rinadokumentID}>{element.kode} =&gt; {yyyMMdd(element.opprettetdato)}</option>)}
    </Ui.Nav.Select>
  </Ui.Nav.Panel>
);

DokumentKort.propTypes = {
  dokumenter: PT.array,
};
DokumentKort.defaultProps = {
  dokumenter: [],
};

export default DokumentKort
