import fs from 'fs'
import multer from 'multer';

const generateFilename = (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '.' + file.originalname.split('.').pop());
}

const filterImageOrDocsOrPDF = (req, file, cb) => {
    if (!file.mimetype.match(/image\/(jpg|JPG|webp|jpeg|JPEG|png|PNG|gif|GIF|jfif|JFIF|svg|SVG|bmp|BMP|ico|ICO|tiff|TIFF|psd|PSD|pdf|PDF|doc|DOC|docx|DOCX|xls|XLS|xlsx|XLSX|ppt|PPT|pptx|PPTX)/)) {
        req.fileValidationError = 'Only image, docs and pdf files are allowed!';
        return cb(null, false);
    }
    cb(null, true);
}

export const upload = (folderName) => {
    return multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                const path = `/tmp/${folderName}/`;
                if (!fs.existsSync(path)) {
                    fs.mkdirSync(path, { recursive: true });
                }
                cb(null, path);
            },

            // By default, multer removes file extensions so let's add them back
            filename: generateFilename
        }),
        limits: { fileSize: 10 * 1024 * 1024 },  // max 10MB //
        fileFilter: filterImageOrDocsOrPDF
    })
}