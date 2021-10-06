import { generateKeyPairSync, randomBytes } from 'crypto';
import fs from 'fs';

dotenv.config();

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: process.env.SECRET
    }
});

console.log(privateKey);
console.log(publicKey);

const KEY = fs.readFileSync(new URL('PATH-TO-KEY', import.meta.url)).toString('base64');
console.log(KEY)

const genSecret = () => {
    randomBytes(256, (err, buf) => {
        if (err) throw err;
        console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
    })
}