import React from "react";
import Table, {Context} from "@navikt/tabell";
import {Attachment, AttachmentTableItem} from "../../../declarations/types";

export interface AttachmentsFromRinaTableProps {
  attachmentsFromRina: Array<Attachment> | undefined
  showHeader?: boolean
}
const AttachmentsFromRinaTable: React.FC<AttachmentsFromRinaTableProps> = ({
  attachmentsFromRina,
  showHeader
}: AttachmentsFromRinaTableProps): JSX.Element => {

  const convertFilenameToTitle = (navn: string): string => {
    return navn.replaceAll("_", " ").split(".")[0]
  }

  return (
    <Table
      <AttachmentTableItem, Context>
      searchable={false}
      selectable={false}
      sortable={false}
      summary={false}
      showHeader={showHeader ? showHeader : false}
      striped={false}
      items={attachmentsFromRina ? attachmentsFromRina.map((a)=>{
        return {
          ...a,
          navn: convertFilenameToTitle(a.navn),
          key: a.id,
        }
      }) : []}
      columns={[{id: 'navn', label: 'Tittel', type: 'string'}]}
    />
  )
}

export default AttachmentsFromRinaTable
