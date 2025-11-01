import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const alphabet = [
  "bl",
  "d",
  "f",
  "fh",
  "fl",
  "k",
  "m",
  "mg",
  "n",
  "ng",
  "nh",
  "nl",
  "ph",
  "pl",
  "r",
  "rl",
  "s",
  "sh",
  "sl",
  "t",
  "th",
  "tl",
  "v",
  "w",
  "wl",
  "y",
];

const alphabet_map = alphabet.reduce(
  (acc, letter, index) => {
    acc[letter] = index + 1;
    return acc;
  },
  {} as Record<string, number>,
);

const english_alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const english_alphabet_map = english_alphabet.reduce(
  (acc, letter, index) => {
    acc[letter] = index + 1;
    return acc;
  },
  {} as Record<string, number>,
);

const cleanMessage = (text: string) => {
  const names = [
    "Chedburn",
    "Bogie",
    "CloudJumper",
    "PrincessJulie",
    "Jairyll",
  ];
  const vowels = "aeiou";
  const chars = ["'", " ", "-"];

  names.forEach((name) => (text = text.replaceAll(name, "")));
  vowels.split("").forEach((vowel) => (text = text.replaceAll(vowel, "")));
  chars.forEach((char) => (text = text.replaceAll(char, "")));
  return text;
};

const tokenize = (text: string) => {
  const tokens: string[] = [];
  for (let i = 0; i < text.length; ) {
    let found = false;

    for (let l = text.length - i; l > 0; l--) {
      const sub = text.substring(i, i + l);
      if (alphabet.includes(sub)) {
        tokens.push(sub);
        i += l;
        found = true;
        break;
      }
    }

    if (!found) i += 1;
  }
  return tokens;
};

const mod = (a: number, n: number) => {
  return ((a % n) + n) % n;
};

const decode = (text: string, key: string) => {
  const cleaned = cleanMessage(text);
  const decoded: string[] = [];
  const tokens = tokenize(cleaned);
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!alphabet_map[token]) throw new Error("Invalid token: " + token);

    const n = alphabet_map[token];
    const l = key[mod(i, key.length)];
    const k = english_alphabet_map[l];

    const s = n - k;
    const t = english_alphabet[mod(s, alphabet.length)];

    decoded.push(t);
  }

  return decoded.join("");
};

export default function Decrypt() {
  const [message, setMessage] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleDecrypt = () => {
    const decrypted = message
      .split("\n")
      .map((msg) => decode(msg, key.substring(0, 4)))
      .join("\n");
    setResult(decrypted);
    setShowResult(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg lg:max-w-[60%] shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            M'aol Decrypt
          </CardTitle>
          <CardDescription>
            Enter one or more encrypted messages (one per line) and your key to
            decrypt them.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Encrypted Message
            </label>
            <Textarea
              id="message"
              placeholder="Enter M'aol messages here (one per line)..."
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none"
            />
          </div>
          <div>
            <label htmlFor="key" className="block text-sm font-medium mb-2">
              Key or Username
            </label>
            <Input
              type="text"
              id="key"
              placeholder="Enter key..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>
          <Button onClick={handleDecrypt} className="w-full">
            Decrypt Messages
          </Button>
          {showResult && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                Decrypted Messages:
              </h3>
              <pre className="text-md font-mono bg-background p-2 rounded border whitespace-pre-wrap">
                {result || "No valid messages to decrypt."}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
