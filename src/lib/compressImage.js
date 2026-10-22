/**
 * Reduce una imagen en el navegador antes de subirla.
 *
 * El motivo es concreto: una foto de camara o de computadora pesa varios
 * megabytes, y subirla tal cual tarda tanto que quien la sube cree que el
 * panel se trabo. Desde el celular "funcionaba" porque esas fotos ya venian
 * comprimidas. Reducirla antes de subirla ataca la causa, no el sintoma.
 *
 * Ademas, esa misma imagen se sirve despues en el sitio publico: subir el
 * original de 6 MB hace lenta la pagina para cada visitante.
 *
 * Si algo falla, devuelve el archivo original en lugar de reventar. Subir
 * una imagen pesada siempre es mejor que no poder subir nada.
 */

const MAX_DIMENSION = 1600;
const QUALITY = 0.82;

// Formatos que no conviene recomprimir: SVG es vectorial y perderia su
// naturaleza al pasar por un canvas, y un GIF animado perderia la animacion.
const SKIP_TYPES = ['image/svg+xml', 'image/gif'];

/** Calcula el tamano final respetando la proporcion original. */
const fitWithin = (width, height, max) => {
  if (width <= max && height <= max) return { width, height };

  const ratio = width > height ? max / width : max / height;
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
};

export const compressImage = (file, options = {}) => {
  const maxDimension = options.maxDimension || MAX_DIMENSION;
  const quality = options.quality || QUALITY;

  return new Promise((resolve) => {
    if (!file || !file.type || file.type.indexOf('image/') !== 0) {
      resolve(file);
      return;
    }

    if (SKIP_TYPES.indexOf(file.type) !== -1) {
      resolve(file);
      return;
    }

    if (typeof window === 'undefined' || typeof document === 'undefined') {
      resolve(file);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    const done = (result) => {
      URL.revokeObjectURL(objectUrl);
      resolve(result);
    };

    image.onerror = () => done(file);

    image.onload = () => {
      try {
        const size = fitWithin(image.width, image.height, maxDimension);
        const canvas = document.createElement('canvas');
        canvas.width = size.width;
        canvas.height = size.height;

        const context = canvas.getContext('2d');
        if (!context || typeof canvas.toBlob !== 'function') {
          done(file);
          return;
        }

        context.drawImage(image, 0, 0, size.width, size.height);

        canvas.toBlob(
          (blob) => {
            // Si comprimir no gano nada, nos quedamos con el original: evita
            // degradar una imagen que ya estaba optimizada.
            if (!blob || blob.size >= file.size) {
              done(file);
              return;
            }

            const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
            done(new File([blob], name, { type: 'image/jpeg' }));
          },
          'image/jpeg',
          quality,
        );
      } catch (err) {
        done(file);
      }
    };

    image.src = objectUrl;
  });
};

export default compressImage;
