export function useUploadApi() {
  const http = useHttp()
  return {
    // Content-Type is left undefined on purpose: the instance default is
    // application/json, and only the browser can add the multipart boundary.
    uploadImage: (file: File) => {
      const form = new FormData()
      form.append('file', file)
      return http.post('/uploads/image', form, {
        headers: { 'Content-Type': undefined },
      })
    },
  }
}
