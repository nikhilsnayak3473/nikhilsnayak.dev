import { readFile } from 'fs/promises';
import path from 'path';
import { CircleAlert } from 'lucide-react';

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

  return (
    <section>
      <pre className='text-foreground'>{rscPayload}</pre>
      <p className='text-center text-xs text-yellow-600'>
        <CircleAlert className='mr-2 inline-block size-4 align-text-bottom' />
        Note: This is the development version of the RSC payload. Production
        version is minified and is hard to understand.
      </p>
    </section>
  );
}
