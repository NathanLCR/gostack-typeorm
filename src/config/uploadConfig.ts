import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const tmpFoder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tmpFoder,

  storage: multer.diskStorage({
    destination: tmpFoder,
    filename(request, file, cb) {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      return cb(null, fileName);
    },
  }),
};
