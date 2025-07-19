
const crypto = require('crypto');
const fs = require('fs');

const SUPPORTED_ALGORITHMS = ['md5', 'sha1', 'sha256', 'sha384', 'sha512'];

function generateHash(data, algorithm) {
  return crypto.createHash(algorithm).update(data).digest('hex');
}


exports.generateTextHashes = (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text input is required.' });
  }

  const results = SUPPORTED_ALGORITHMS.map(alg => ({
    algorithm: alg.toUpperCase(),
    hash: generateHash(text, alg),
    length: crypto.createHash(alg).digest().length * 8
  }));

  res.json({ success: true, data: results });
};


exports.generateFileHashes = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const fileBuffer = fs.readFileSync(req.file.path);

  const results = SUPPORTED_ALGORITHMS.map(alg => ({
    algorithm: alg.toUpperCase(),
    hash: generateHash(fileBuffer, alg),
    length: crypto.createHash(alg).digest().length * 8
  }));

  fs.unlinkSync(req.file.path);

  res.json({ success: true, data: results });
};
