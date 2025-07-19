import React, { useState, useCallback } from 'react';
import { CodeEditor } from '@/components/ui/code-editor';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Sparkles, Download, Upload } from 'lucide-react';

export default function JSONFormatter() {
  const [input, setInput] = useState(`{
  "name": "Alice",
  "age": 28
}`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [minified, setMinified] = useState('');

  const formatJSON = useCallback(async () => {
    if (!input.trim()) {
      setError('Please enter JSON to format');
      setOutput('');
      setIsValid(false);
      return;
    }

    try {
const response = await fetch(
  'http://localhost:5000/api/json/format-json',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonString: input })
  }
);


      const data = await response.json();

      if (!response.ok) {
        setError(`Invalid JSON: ${data.message}`);
        setOutput('');
        setIsValid(false);
      } else {
        setOutput(data.pretty);
        setMinified(data.minified);
        setError('');
        setIsValid(true);
      }
    } catch (err) {
      setError(`Request failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setOutput('');
      setIsValid(false);
    }
  }, [input]);

  const minifyJSON = useCallback(() => {
    if (!minified) {
      setError('No valid JSON formatted yet.');
      return;
    }
    setOutput(minified);
    setError('');
  }, [minified]);

  const downloadJSON = () => {
    if (!output) return;

    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="ml-80 p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl gradient-primary">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">JSON Formatter</h1>
              <p className="text-muted-foreground">Validate, format, and beautify your JSON</p>
            </div>
          </div>

          {input && (
            <Badge
              variant={isValid ? 'default' : 'destructive'}
              className={isValid ? 'success-glow' : 'error-glow'}
            >
              {isValid ? '✓ Valid JSON' : '✗ Invalid JSON'}
            </Badge>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span>Input JSON</span>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="ghost" size="sm" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-1" />
                        Upload
                      </span>
                    </Button>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CodeEditor
                value={input}
                onChange={setInput}
                placeholder='{"name": "John", "age": 30}'
                language="json"
                error={error}
              />

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={formatJSON}
                  className="flex-1 gradient-primary hover-scale"
                  disabled={!input.trim()}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Format JSON
                </Button>
                <Button
                  onClick={minifyJSON}
                  variant="outline"
                  className="hover-scale"
                  disabled={!input.trim() || !isValid}
                >
                  Minify
                </Button>
              </div>
              {error && <p className="mt-2 text-red-500">{error}</p>}
            </CardContent>
          </Card>

          <Card className="glass-effect border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Formatted Output</CardTitle>
                {output && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={downloadJSON}
                    className="hover-scale"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CodeEditor
                value={output}
                onChange={() => {}}
                placeholder="Formatted JSON will appear here..."
                language="json"
                readOnly={true}
                className={isValid ? 'success-glow' : ''}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
