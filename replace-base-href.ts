import * as fs from 'fs';
import * as path from 'path';

const isProd = process.env.NODE_ENV === 'production';
const baseHref = isProd ? '/plantation-erp/' : '/';

const indexPath = path.resolve(__dirname, 'dist/plantation-erp/index.html');

fs.readFile(indexPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Gagal baca file index.html:', err);
    process.exit(1);
  }

  const result = data.replace(/<base href=".*">/, `<base href="${baseHref}">`);

  fs.writeFile(indexPath, result, 'utf8', (err) => {
    if (err) {
      console.error('Gagal tulis file index.html:', err);
      process.exit(1);
    }
    console.log(`Berhasil mengganti base href menjadi '${baseHref}' di index.html`);
  });
});
