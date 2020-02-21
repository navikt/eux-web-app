import Ui from "eessi-pensjon-ui"
import * as Skjema from 'felles-komponenter/skjema'
import moment from 'moment'
import PT from 'prop-types'
import React from 'react'

const yyyMMdd = (dato: any) => moment(dato).format('YYYY-MM-DD');

const DokumentKort = ({ dokumenter }: any) => (
  <Ui.Nav.Panel className="dokumentsok__kort">
    <Skjema.Select id="id-rinadokument" feltNavn="rinadokumentID" label="Velg SED Type" bredde="xl">
      {dokumenter && dokumenter.map((element: any) => <option value={element.rinadokumentID} key={element.rinadokumentID}>{element.kode} =&gt; {yyyMMdd(element.opprettetdato)}</option>)}
    </Skjema.Select>
  </Ui.Nav.Panel>
);

DokumentKort.propTypes = {
  dokumenter: PT.array,
};
DokumentKort.defaultProps = {
  dokumenter: [],
};

export default DokumentKort
