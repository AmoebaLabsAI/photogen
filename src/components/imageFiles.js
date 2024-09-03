import fs from 'fs';
import path from 'path';

const imageDirectory = path.join(process.cwd(), 'public/images');
const imageFiles = fs.readdirSync(imageDirectory)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .map(file => `/images/${file}`);

export default imageFiles;