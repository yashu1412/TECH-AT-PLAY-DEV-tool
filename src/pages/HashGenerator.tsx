import React, { useState, useCallback, useEffect } from 'react';
import { CodeEditor } from '@/components/ui/code-editor';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cpu, Upload, Download, Copy, Check, FileText, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512' | 'MD5';
type InputMode = 'text' | 'file';

type HashResult = {
  algorithm: HashAlgorithm;
  hash: string;
  length: number;
};

export default function HashGenerator() {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hashResults, setHashResults] = useState<HashResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string>('');

  const algorithms: HashAlgorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

  const md5 = useCallback((str: string): string => {
    function rotateLeft(lValue: number, iShiftBits: number) {
      return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    function addUnsigned(lX: number, lY: number) {
      const lX8 = lX & 0x80000000;
      const lY8 = lY & 0x80000000;
      const lX4 = lX & 0x40000000;
      const lY4 = lY & 0x40000000;
      const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
      if (lX4 & lY4) {
        return lResult ^ 0x80000000 ^ lX8 ^ lY8;
      }
      if (lX4 | lY4) {
        if (lResult & 0x40000000) {
          return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
        } else {
          return lResult ^ 0x40000000 ^ lX8 ^ lY8;
        }
      } else {
        return lResult ^ lX8 ^ lY8;
      }
    }

    function f(x: number, y: number, z: number) {
      return (x & y) | (~x & z);
    }
    function g(x: number, y: number, z: number) {
      return (x & z) | (y & ~z);
    }
    function h(x: number, y: number, z: number) {
      return x ^ y ^ z;
    }
    function i(x: number, y: number, z: number) {
      return y ^ (x | ~z);
    }

    function ff(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
      a = addUnsigned(a, addUnsigned(addUnsigned(f(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }
    function gg(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
      a = addUnsigned(a, addUnsigned(addUnsigned(g(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }
    function hh(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
      a = addUnsigned(a, addUnsigned(addUnsigned(h(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }
    function ii(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
      a = addUnsigned(a, addUnsigned(addUnsigned(i(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }

    function convertToWordArray(str: string) {
      let lWordCount;
      const lMessageLength = str.length;
      const lNumberOfWordsTemp1 = lMessageLength + 8;
      const lNumberOfWordsTemp2 = (lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64;
      const lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16;
      const lWordArray = new Array(lNumberOfWords - 1);
      let lBytePosition = 0;
      let lByteCount = 0;
      while (lByteCount < lMessageLength) {
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lWordArray[lWordCount] = lWordArray[lWordCount] || 0;
        lWordArray[lWordCount] |= str.charCodeAt(lByteCount) << ((lByteCount % 4) * 8);
        lByteCount++;
      }
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lWordArray[lWordCount] = lWordArray[lWordCount] || 0;
      lWordArray[lWordCount] |= 0x80 << ((lByteCount % 4) * 8);
      lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
      lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
      return lWordArray;
    }

    function wordToHex(lValue: number) {
      let wordToHexValue = '', wordToHexValueTemp = '', lByte, lCount;
      for (lCount = 0; lCount <= 3; lCount++) {
        lByte = (lValue >>> (lCount * 8)) & 255;
        wordToHexValueTemp = '0' + lByte.toString(16);
        wordToHexValue += wordToHexValueTemp.substr(wordToHexValueTemp.length - 2, 2);
      }
      return wordToHexValue;
    }

    let x = [], k, AA, BB, CC, DD, a, b, c, d;
    let S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    let S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    let S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    let S41 = 6, S42 = 10, S43 = 15, S44 = 21;

    x = convertToWordArray(str);
    a = 0x67452301;
    b = 0xefcdab89;
    c = 0x98badcfe;
    d = 0x10325476;

    for (k = 0; k < x.length; k += 16) {
      AA = a;
      BB = b;
      CC = c;
      DD = d;
      a = ff(a, b, c, d, x[k + 0], S11, 0xd76aa478);
      d = ff(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
      c = ff(c, d, a, b, x[k + 2], S13, 0x242070db);
      b = ff(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
      a = ff(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
      d = ff(d, a, b, c, x[k + 5], S12, 0x4787c62a);
      c = ff(c, d, a, b, x[k + 6], S13, 0xa8304613);
      b = ff(b, c, d, a, x[k + 7], S14, 0xfd469501);
      a = ff(a, b, c, d, x[k + 8], S11, 0x698098d8);
      d = ff(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
      c = ff(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
      b = ff(b, c, d, a, x[k + 11], S14, 0x895cd7be);
      a = ff(a, b, c, d, x[k + 12], S11, 0x6b901122);
      d = ff(d, a, b, c, x[k + 13], S12, 0xfd987193);
      c = ff(c, d, a, b, x[k + 14], S13, 0xa679438e);
      b = ff(b, c, d, a, x[k + 15], S14, 0x49b40821);
      a = gg(a, b, c, d, x[k + 1], S21, 0xf61e2562);
      d = gg(d, a, b, c, x[k + 6], S22, 0xc040b340);
      c = gg(c, d, a, b, x[k + 11], S23, 0x265e5a51);
      b = gg(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
      a = gg(a, b, c, d, x[k + 5], S21, 0xd62f105d);
      d = gg(d, a, b, c, x[k + 10], S22, 0x02441453);
      c = gg(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
      b = gg(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
      a = gg(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
      d = gg(d, a, b, c, x[k + 14], S22, 0xc33707d6);
      c = gg(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
      b = gg(b, c, d, a, x[k + 8], S24, 0x455a14ed);
      a = gg(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
      d = gg(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
      c = gg(c, d, a, b, x[k + 7], S23, 0x676f02d9);
      b = gg(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
      a = hh(a, b, c, d, x[k + 5], S31, 0xfffa3942);
      d = hh(d, a, b, c, x[k + 8], S32, 0x8771f681);
      c = hh(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
      b = hh(b, c, d, a, x[k + 14], S34, 0xfde5380c);
      a = hh(a, b, c, d, x[k + 1], S31, 0xa4beea44);
      d = hh(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
      c = hh(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
      b = hh(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
      a = hh(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
      d = hh(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
      c = hh(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
      b = hh(b, c, d, a, x[k + 6], S34, 0x04881d05);
      a = hh(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
      d = hh(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
      c = hh(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
      b = hh(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
      a = ii(a, b, c, d, x[k + 0], S41, 0xf4292244);
      d = ii(d, a, b, c, x[k + 7], S42, 0x432aff97);
      c = ii(c, d, a, b, x[k + 14], S43, 0xab9423a7);
      b = ii(b, c, d, a, x[k + 5], S44, 0xfc93a039);
      a = ii(a, b, c, d, x[k + 12], S41, 0x655b59c3);
      d = ii(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
      c = ii(c, d, a, b, x[k + 10], S43, 0xffeff47d);
      b = ii(b, c, d, a, x[k + 1], S44, 0x85845dd1);
      a = ii(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
      d = ii(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
      c = ii(c, d, a, b, x[k + 6], S43, 0xa3014314);
      b = ii(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
      a = ii(a, b, c, d, x[k + 4], S41, 0xf7537e82);
      d = ii(d, a, b, c, x[k + 11], S42, 0xbd3af235);
      c = ii(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
      b = ii(b, c, d, a, x[k + 9], S44, 0xeb86d391);
      a = addUnsigned(a, AA);
      b = addUnsigned(b, BB);
      c = addUnsigned(c, CC);
      d = addUnsigned(d, DD);
    }
    return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
  }, []);

  // Generate hash using Web Crypto API
  const generateCryptoHash = useCallback(async (algorithm: string, data: ArrayBuffer): Promise<string> => {
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }, []);

  // Generate all hashes
  const generateHashes = useCallback(async (input: string | ArrayBuffer) => {
    setIsLoading(true);
    const results: HashResult[] = [];

    try {
      let dataBuffer: ArrayBuffer;
      let textForMD5: string;

      if (typeof input === 'string') {
        textForMD5 = input;
        dataBuffer = new TextEncoder().encode(input);
      } else {
        textForMD5 = new TextDecoder().decode(input);
        dataBuffer = input;
      }

      // Generate MD5 (using custom implementation)
      const md5Hash = md5(textForMD5);
      results.push({
        algorithm: 'MD5',
        hash: md5Hash,
        length: md5Hash.length * 4 // bits
      });

      // Generate other hashes using Web Crypto API
      for (const algorithm of algorithms.filter(a => a !== 'MD5')) {
        try {
          const hash = await generateCryptoHash(algorithm, dataBuffer);
          results.push({
            algorithm,
            hash,
            length: hash.length * 4 // bits
          });
        } catch (error) {
          console.error(`Error generating ${algorithm}:`, error);
        }
      }

      setHashResults(results);
    } catch (error) {
      console.error('Error generating hashes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [algorithms, md5, generateCryptoHash]);

  // Handle text input change
  useEffect(() => {
    if (inputMode === 'text' && textInput) {
      const timer = setTimeout(() => {
        generateHashes(textInput);
      }, 500);
      return () => clearTimeout(timer);
    } else if (inputMode === 'text' && !textInput) {
      setHashResults([]);
    }
  }, [textInput, inputMode, generateHashes]);

  // Handle file input
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setHashResults([]);
      return;
    }

    setSelectedFile(file);
    const arrayBuffer = await file.arrayBuffer();
    generateHashes(arrayBuffer);
  };

  // Copy hash to clipboard
  const copyHash = async (hash: string, algorithm: string) => {
    await navigator.clipboard.writeText(hash);
    setCopiedHash(`${algorithm}-${hash}`);
    setTimeout(() => setCopiedHash(''), 2000);
  };

  // Download all hashes
  const downloadHashes = () => {
    if (hashResults.length === 0) return;

    const content = hashResults.map(result => 
      `${result.algorithm}: ${result.hash}`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hashes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Load example text
  const loadExample = () => {
    setInputMode('text');
    setTextInput('Hello, World! This is a sample text for hash generation.');
  };

  return (
    <div className="ml-80 p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Hash Generator</h1>
              <p className="text-muted-foreground">Generate cryptographic hashes for text and files</p>
            </div>
          </div>
        </div>

        {/* Input Mode Selector */}
        <div className="mb-6">
          <Tabs value={inputMode} onValueChange={(value) => setInputMode(value as InputMode)}>
            <TabsList className="glass-effect">
              <TabsTrigger value="text" className="data-[state=active]:gradient-primary">
                <FileText className="h-4 w-4 mr-2" />
                Text Input
              </TabsTrigger>
              <TabsTrigger value="file" className="data-[state=active]:gradient-primary">
                <Upload className="h-4 w-4 mr-2" />
                File Input
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {inputMode === 'text' ? 'Text Input' : 'File Input'}
                </CardTitle>
                {inputMode === 'text' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={loadExample}
                    className="hover-scale"
                  >
                    Load Example
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {inputMode === 'text' ? (
                <CodeEditor
                  value={textInput}
                  onChange={setTextInput}
                  placeholder="Enter text to generate hashes..."
                  language="text"
                />
              ) : (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-input"
                    />
                    <label htmlFor="file-input" className="cursor-pointer">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">Choose a file</p>
                      <p className="text-sm text-muted-foreground">
                        Upload any file to generate its hashes
                      </p>
                    </label>
                  </div>
                  
                  {selectedFile && (
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Hash Results
                </CardTitle>
                {hashResults.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={downloadHashes}
                    className="hover-scale"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {algorithms.map((algorithm) => (
                    <div key={algorithm} className="animate-pulse">
                      <div className="h-4 bg-muted/30 rounded w-20 mb-2"></div>
                      <div className="h-10 bg-muted/30 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : hashResults.length > 0 ? (
                <div className="space-y-4">
                  {hashResults.map((result) => (
                    <div key={result.algorithm} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{result.algorithm}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {result.length} bits
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyHash(result.hash, result.algorithm)}
                          className="h-auto py-1"
                        >
                          {copiedHash === `${result.algorithm}-${result.hash}` ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <div className="code-block p-3 text-xs break-all font-mono bg-code-bg border rounded">
                        {result.hash}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Cpu className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter text or upload a file to generate hashes</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Panel */}
        <Card className="glass-effect border-border/50 mt-8">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground space-y-3">
              <div>
                <p className="font-medium text-foreground mb-2">Supported Hash Algorithms:</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="font-medium text-purple-400">MD5 (128-bit):</p>
                    <p>Fast but cryptographically broken. Use only for checksums.</p>
                  </div>
                  <div>
                    <p className="font-medium text-purple-400">SHA-1 (160-bit):</p>
                    <p>Deprecated for security. Legacy support only.</p>
                  </div>
                  <div>
                    <p className="font-medium text-purple-400">SHA-256 (256-bit):</p>
                    <p>Secure and widely used. Recommended for most applications.</p>
                  </div>
                  <div>
                    <p className="font-medium text-purple-400">SHA-384 (384-bit):</p>
                    <p>Higher security variant of SHA-2 family.</p>
                  </div>
                  <div>
                    <p className="font-medium text-purple-400">SHA-512 (512-bit):</p>
                    <p>Maximum security SHA-2 variant. Best for sensitive data.</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="font-medium text-foreground">Common Use Cases:</p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>File integrity verification</li>
                  <li>Password storage (with salting)</li>
                  <li>Digital signatures and certificates</li>
                  <li>Blockchain and cryptocurrency</li>
                  <li>Data deduplication</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}