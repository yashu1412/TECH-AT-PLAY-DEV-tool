import React, { useState, useCallback, useEffect } from 'react';
import { CodeEditor } from '@/components/ui/code-editor';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Database, ArrowRightLeft, Upload, Download, Link, Globe } from 'lucide-react';

type EncodingMode = 'component' | 'full';
type OperationMode = 'encode' | 'decode';

export default function URLEncoder() {
  const [operationMode, setOperationMode] = useState<OperationMode>('encode');
  const [encodingMode, setEncodingMode] = useState<EncodingMode>('component');
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
      const endpoint = operationMode === 'encode'
        ? 'https://tech-at-play-dev-tool.onrender.com/api/url/encode'
        : 'https://tech-at-play-dev-tool.onrender.com/api/url/decode';

      const payload = {
        input: input,
        mode: encodingMode
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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
  }, [input, operationMode, encodingMode]);

  useEffect(() => {
    const timer = setTimeout(processInput, 300);
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
    a.download = `${operationMode}d-url.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const swapMode = () => {
    setOperationMode(operationMode === 'encode' ? 'decode' : 'encode');
    if (input && output && !error) {
      setInput(output);
      setOutput('');
    }
  };

  const isValidURL = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const loadExample = (type: 'simple' | 'complex' | 'special') => {
    const examples = {
      simple: operationMode === 'encode'
        ? 'Hello World! How are you?'
        : 'Hello%20World!%20How%20are%20you%3F',
      complex: operationMode === 'encode'
        ? 'https://example.com/search?q=hello world&filter=all'
        : 'https%3A//example.com/search%3Fq%3Dhello%20world%26filter%3Dall',
      special: operationMode === 'encode'
        ? 'user@domain.com?query=café & restaurant'
        : 'user%40domain.com%3Fquery%3Dcaf%C3%A9%20%26%20restaurant'
    };
    setInput(examples[type]);
  };

  return (
    <div className="ml-80 p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">URL Encoder/Decoder</h1>
              <p className="text-muted-foreground">Encode and decode URLs and URL components</p>
            </div>
          </div>

          {input && encodingMode === 'full' && (
            <Badge
              variant={isValidURL(input) ? "default" : "outline"}
              className={isValidURL(input) ? "success-glow" : ""}
            >
              {isValidURL(input) ? (
                <><Globe className="h-3 w-3 mr-1" /> Valid URL</>
              ) : (
                <><Link className="h-3 w-3 mr-1" /> Text Component</>
              )}
            </Badge>
          )}
        </div>

        {/* Modes */}
        <div className="mb-6 space-y-4">
          <Tabs value={operationMode} onValueChange={(value) => setOperationMode(value as OperationMode)}>
            <div className="flex items-center gap-4">
              <TabsList className="glass-effect">
                <TabsTrigger value="encode" className="data-[state=active]:gradient-primary">
                  Encode URL
                </TabsTrigger>
                <TabsTrigger value="decode" className="data-[state=active]:gradient-primary">
                  Decode URL
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

          <Tabs value={encodingMode} onValueChange={(value) => setEncodingMode(value as EncodingMode)}>
            <TabsList className="glass-effect">
              <TabsTrigger value="component" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                URL Component
              </TabsTrigger>
              <TabsTrigger value="full" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                Full URL
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input */}
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {operationMode === 'encode' ? 'Text/URL Input' : 'Encoded URL Input'}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <label htmlFor="file-upload-url" className="cursor-pointer">
                    <Button variant="ghost" size="sm" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-1" />
                        Upload
                      </span>
                    </Button>
                  </label>
                  <input
                    id="file-upload-url"
                    type="file"
                    accept=".txt,.url"
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
                  operationMode === 'encode'
                    ? (encodingMode === 'component'
                      ? 'Enter text or URL component to encode...'
                      : 'Enter full URL to encode...')
                    : 'Enter encoded URL to decode...'
                }
                language="text"
                error={error}
              />

              <div className="flex flex-wrap gap-2 mt-4">
                <div className="text-xs text-muted-foreground mr-2">Examples:</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => loadExample('simple')}
                  className="text-xs h-auto py-1"
                >
                  Simple Text
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => loadExample('complex')}
                  className="text-xs h-auto py-1"
                >
                  Complex URL
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => loadExample('special')}
                  className="text-xs h-auto py-1"
                >
                  Special Characters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output */}
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {operationMode === 'encode' ? 'Encoded Output' : 'Decoded Output'}
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
                  operationMode === 'encode'
                    ? 'URL encoded result will appear here...'
                    : 'Decoded URL will appear here...'
                }
                language="text"
                readOnly={true}
                className={output && !error ? "success-glow" : ""}
              />
            </CardContent>
          </Card>
        </div>

        <Card className="glass-effect border-border/50 mt-8">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground space-y-3">
              <p className="font-medium text-foreground mb-2">URL Encoding Types:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-green-400">URL Component Encoding:</p>
                  <p>Encodes individual parts of a URL (query parameters, path segments). Uses encodeURIComponent().</p>
                </div>
                <div>
                  <p className="font-medium text-green-400">Full URL Encoding:</p>
                  <p>Smart encoding that preserves URL structure while encoding special characters appropriately.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
