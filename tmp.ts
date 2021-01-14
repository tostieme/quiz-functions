export const uploadImage = functions.https.onRequest(async (request, response) => {
    const busboy = new Busboy({
      headers: request.headers,
      limits: {
        fileSize: 2 * 1024 * 1024, // max image size to 1 MB
        files: 1 // Limit to one file upload
      }
    });
  
    let filepath: string = "";
    const _tmpdir = tmpdir();
  
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      filepath = join(_tmpdir, filename);
      const writeStream = createWriteStream(filepath);
      file.pipe(writeStream);
    });
  
    busboy.on('finish', async () => {
      const fileType = await FileType.fromFile(filepath);
      console.log(fileType);
      if(!fileType || !(fileType.mime === "image/jpeg" || fileType.mime === "image/png")) {
        unlinkSync(filepath);
        response.status(500).send({
          'error': 'Invalid file',
          'code': 'invalid_upload_file'
        });
        return;
      }
  
    await admin.storage().bucket().upload(filepath, {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      metadata: {
        // Enable long-lived HTTP caching headers
        // Use only if the contents of the file will never change
        // (If the contents will change, use cacheControl: 'no-cache')
        cacheControl: 'public, max-age=31536000',
      },
    });
  
      response.send({
        'status': 'Upload successful'
      });
    busboy.end(request.rawBody);
  });