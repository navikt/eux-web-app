import Ui from 'eessi-pensjon-ui'
import moment from 'moment'
import PT from 'prop-types'
import React from 'react'

const yyyMMdd = (dato: any) => moment(dato).format('YYYY-MM-DD');

export interface DocumentCardProps {

}

const DocumentCard = ({ dokumenter, value, onChange }: any) => (
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

DocumentCard.propTypes = {
  dokumenter: PT.array,
};
DocumentCard.defaultProps = {
  dokumenter: [],
};

export default DocumentCard
