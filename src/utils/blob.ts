export const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
  const byteCharacters = window.atob(b64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, { type: contentType })
  return blob
}
export const blobToBase64 = (blob: Blob) => {
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  return new Promise(resolve => {
    reader.onloadend = () => {
      resolve(reader.result)
    }
  })
}
