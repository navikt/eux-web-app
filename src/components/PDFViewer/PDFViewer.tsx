import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import React, {useState} from "react";
import type { PDFDocumentProxy } from 'pdfjs-dist';
import _ from "lodash";
import bytes from 'bytes'

export interface PreviewPDFProps {
  file?: string
  name?: string
  size?: number
  width?: string | number
  height?: string | number
}

const PDFViewer: React.FC<PreviewPDFProps> = ({
  file, name, size, width, height
}: PreviewPDFProps) => {
  const [numPages, setNumPages] = useState<number>();

  if (!file?.startsWith('data:application/pdf;base64,')) {
    file = 'data:application/pdf;base64,' + file
  }

  const onDocumentLoadSuccess = ({ numPages: nextNumPages }: PDFDocumentProxy): void => {
    setNumPages(nextNumPages);
  }

  const renderBytes = (_bytes: number): string | null  => {
    return !_bytes ? '-' : bytes(_bytes)
  }

  const pages = _.range(1, (numPages! + 1))
  const _size: string | null = size ? renderBytes(size) : '-'

  let _width = (_.isString(width) && (width as string).match(/^\d+$/) ? parseInt(width, 10) : width) as number
  let _height = (_.isString(height) && (height as string).match(/^\d+$/) ? parseInt(height, 10) : height) as number
  if(!_width){
    _width = 100
    _height = 140
  }

  return(
    <div title={'' + name + '\n Sider: ' + (numPages || '0') + '\n Størrelse: ' + _size}>
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        {pages.map(currentPage => (
          <Page
            key={'page-' + currentPage}
            pageNumber={currentPage ?? 1}
            width={_width}
            height={_height}
          />)
        )}
      </Document>
    </div>
  )
}

export default PDFViewer
