import { readFile } from 'fs/promises';
import path from 'path';

export async function RSCPayload() {
  const rscPayload = await readFile(
    path.join(
      process.cwd(),
      'content',
      'a-comprehensive-breakdown-of-full-stack-react',
      'rsc-payload.txt'
    ),
    'utf-8'
  );

  return <pre>{rscPayload}</pre>;
}
