import React, { useState, useCallback, useEffect } from 'react';
import { CodeEditor } from '@/components/ui/code-editor';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, ArrowRightLeft, Upload, Download } from 'lucide-react';

export default function Base64Tools() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const processInput = useCallback(async () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      const endpoint =
        mode === 'encode'
          ? 'http://localhost:5000/api/base64/encode'
          : 'http://localhost:5000/api/base64/decode';

      const payload = { input }; // ✅ fixed

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Processing failed');
      }

      setOutput(data.output);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Processing failed');
      setOutput('');
    }
  }, [input, mode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      processInput();
    }, 300);
    return () => clearTimeout(timer);
  }, [processInput]);

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

  const downloadOutput = () => {
    if (!output) return;

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const swapMode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    if (input && output && !error) {
      setInput(output);
      setOutput('');
    }
  };

  return (
    <div className="ml-80 p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl gradient-accent">
              <Code className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Base64 Tools</h1>
              <p className="text-muted-foreground">Encode and decode Base64 strings</p>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mb-6">
          <Tabs value={mode} onValueChange={(value) => setMode(value as 'encode' | 'decode')}>
            <div className="flex items-center gap-4">
              <TabsList className="glass-effect">
                <TabsTrigger value="encode" className="data-[state=active]:gradient-primary">
                  Encode to Base64
                </TabsTrigger>
                <TabsTrigger value="decode" className="data-[state=active]:gradient-primary">
                  Decode from Base64
                </TabsTrigger>
              </TabsList>

              <Button
                variant="ghost"
                size="sm"
                onClick={swapMode}
                className="hover-scale"
                title="Swap input and output"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </div>
          </Tabs>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {mode === 'encode' ? 'Text Input' : 'Base64 Input'}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <label htmlFor="file-upload-base64" className="cursor-pointer">
                    <Button variant="ghost" size="sm" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-1" />
                        Upload
                      </span>
                    </Button>
                  </label>
                  <input
                    id="file-upload-base64"
                    type="file"
                    accept=".txt"
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
                placeholder={
                  mode === 'encode'
                    ? 'Enter text to encode...'
                    : 'Enter Base64 string to decode...'
                }
                language={mode === 'decode' ? 'base64' : 'text'}
                error={error}
              />
            </CardContent>
          </Card>

          {/* Output Panel */}
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
                </CardTitle>
                {output && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={downloadOutput}
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
                placeholder={
                  mode === 'encode'
                    ? 'Base64 encoded result will appear here...'
                    : 'Decoded text will appear here...'
                }
                language={mode === 'encode' ? 'base64' : 'text'}
                readOnly={true}
                className={output && !error ? 'success-glow' : ''}
              />
            </CardContent>
          </Card>
        </div>

        {/* Info Panel */}
        <Card className="glass-effect border-border/50 mt-8">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-medium">About Base64:</p>
              <p>
                Base64 is a binary-to-text encoding scheme that represents binary data in sequences
                of 24 bits that can be represented by four 6-bit Base64 digits.
              </p>
              <p>
                Common uses: Email attachments, data URLs, API tokens, and storing complex data in
                text-based formats.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
