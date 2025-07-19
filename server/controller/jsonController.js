
const formattedJsons = [];


exports.formatJSON = (req, res) => {
  const { jsonString } = req.body;

  if (!jsonString) {
    return res.status(400).json({ error: 'No JSON provided' });
  }

  try {
    
    const parsed = JSON.parse(jsonString);

   
    const pretty = JSON.stringify(parsed, null, 2);

    const minified = JSON.stringify(parsed);


    formattedJsons.push({
      raw: jsonString,
      pretty,
      minified,
      timestamp: new Date()
    });

    res.status(200).json({
      pretty,
      minified,
      valid: true,
      message: 'JSON formatted and minified successfully'
    });
  } catch (err) {
    res.status(400).json({
      error: 'Invalid JSON',
      message: err.message,
      valid: false
    });
  }
};


exports.getAllFormatted = (req, res) => {
  res.status(200).json({ saved: formattedJsons });
};
