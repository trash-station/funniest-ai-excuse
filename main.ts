// funniest-ai-excuse
//
// This program exists to do exactly one small job: write the bounty
// entry — a single funny excuse line an AI agent might give after a
// failed task — into a file called entry.txt.
//
// Everything here is deliberately boring. There is no input to parse,
// no network call to make, and no randomness anywhere, so running the
// program twice produces the exact same bytes twice. That sameness is
// the point: the entry is a fixed piece of text, and the program is
// just the envelope that delivers it to the output directory.
//
// Usage:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// The output directory defaults to /output when the environment
// variable is not set, which is where the bounty runner looks for it.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The bounty caps an entry at two hundred characters, so the cap lives
// in one named place instead of being a bare number buried in an if
// statement. If the cap ever changes, this is the only line to touch.
const MAX_ENTRY_LENGTH = 200;

// The entry itself, kept as one constant string so nothing in the
// program can accidentally change it at run time. The two halves are
// joined with a single space in the middle; together they come to 117
// characters, one line, and the file is written with no trailing
// newline, because the entry is the line and nothing else.
const EXCUSE =
  'I asked you for clarification, you asked me for clarification, ' +
  'and now we\'re both waiting for the other one to start.';

// Check the excuse against the bounty rules before writing anything.
// The guard throws instead of writing a bad file on purpose: a loud
// failure is better than silently submitting an entry the judge would
// reject for being too long or empty. The minimum of one character
// guards against an empty string, which would be a meaningless entry.
function checkEntryLength(line: string): void {
  if (line.length < 1 || line.length > MAX_ENTRY_LENGTH) {
    throw new Error(
      `entry is ${line.length} characters; the bounty allows 1 to ${MAX_ENTRY_LENGTH}`,
    );
  }
}

checkEntryLength(EXCUSE);

// The output directory comes from the environment so the same program
// works both under the bounty runner (/output) and on a developer's
// machine (any folder they choose). mkdirSync with recursive: true
// creates the folder if it is missing and does nothing if it already
// exists, so the program is safe to run repeatedly.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.txt'), EXCUSE, 'utf8');
