
exports.encodeURL = (req, res) => {
  const { input, mode } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'Input text is required' });
  }

  try {
    let output = '';

    if (mode === 'component') {
      output = encodeURIComponent(input);
    } else {
      try {
        const urlObj = new URL(input);

        // Encode pathname segments
        urlObj.pathname = urlObj.pathname
          .split('/')
          .map(segment => segment ? encodeURIComponent(segment) : segment)
          .join('/');

        output = urlObj.toString();
      } catch (err) {
        // Fallback: treat as plain text if not a valid URL
        output = encodeURIComponent(input);
      }
    }

    res.json({ output });
  } catch (err) {
    res.status(500).json({ error: 'Failed to encode', message: err.message });
  }
};

/**
 * POST /api/url/decode
 * Body: { input: "..." }
 * Response: { output: "..." }
 */
exports.decodeURL = (req, res) => {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'Input text is required' });
  }

  try {
    const output = decodeURIComponent(input);
    res.json({ output });
  } catch (err) {
    res.status(400).json({ error: 'Failed to decode', message: err.message });
  }
};
