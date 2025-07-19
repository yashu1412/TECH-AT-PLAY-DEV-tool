
const base64Conversions = [];

exports.encode = (req, res) => {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'No input text provided.' });
  }

  try {
    const output = Buffer.from(input, 'utf-8').toString('base64');

    // Save in memory
    base64Conversions.push({
      input,
      output,
      mode: 'encode',
      timestamp: new Date()
    });

    res.status(200).json({
      input,
      output,
      mode: 'encode',
      message: 'Text encoded to Base64 successfully.'
    });
  } catch (err) {
    res.status(500).json({
      error: 'Encoding failed.',
      message: err.message
    });
  }
};

exports.decode = (req, res) => {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'No Base64 input provided.' });
  }

  try {
    const output = Buffer.from(input, 'base64').toString('utf-8');

    // Save in memory
    base64Conversions.push({
      input,
      output,
      mode: 'decode',
      timestamp: new Date()
    });

    res.status(200).json({
      input,
      output,
      mode: 'decode',
      message: 'Base64 decoded to text successfully.'
    });
  } catch (err) {
    res.status(500).json({
      error: 'Decoding failed.',
      message: err.message
    });
  }
};

exports.getHistory = (req, res) => {
  res.status(200).json({ conversions: base64Conversions });
};
