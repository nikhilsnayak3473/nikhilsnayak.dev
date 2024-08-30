'use client';

import {
  Fragment,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import { generateId } from 'ai';
import { useActions, useAIState, useUIState } from 'ai/rsc';
import { LucideTrash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/spinner';

import { AI } from './actions';

export function UserMessage({ children }: PropsWithChildren) {
  return (
    <div className='max-w-full'>
      <p className='ml-auto max-w-max whitespace-pre-wrap rounded-md bg-gray-800 p-2 text-gray-100 dark:bg-gray-100 dark:text-gray-800'>
        {children}
      </p>
    </div>
  );
}

export function Chat() {
  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState<typeof AI>();
  const [messages, setMessages] = useAIState<typeof AI>();
  const { continueConversation } = useActions<typeof AI>();

  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    const messagesEnd = messagesEndRef.current;
    if (!scrollArea || !messagesEnd) return;
    const observer = new MutationObserver(() => {
      messagesEnd.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });

    observer.observe(scrollArea, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className='flex h-[55dvh] w-full flex-col gap-4'>
      <div className='flex-1 overflow-auto'>
        <ScrollArea
          className='h-full w-full rounded-md border'
          ref={scrollAreaRef}
        >
          <div className='p-4 text-sm'>
            <div className='grid gap-4'>
              {conversation.map((message) => (
                <Fragment key={message.id}>{message.display}</Fragment>
              ))}
              {isPending ? <Spinner variant='ellipsis' /> : null}
            </div>
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>
      <form
        className='flex items-center gap-3'
        onSubmit={async (e) => {
          e.preventDefault();

          const value = input.trim();
          setInput('');

          if (!value) return;

          setConversation((currentConversation) => [
            ...currentConversation,
            {
              id: generateId(),
              role: 'user',
              display: <UserMessage>{value}</UserMessage>,
            },
          ]);

          startTransition(async () => {
            const response = await continueConversation(value);
            if ('error' in response) {
              toast.error(response.error);
            } else {
              setConversation((currentConversation) => [
                ...currentConversation,
                response,
              ]);
            }
          });
        }}
      >
        <Input
          placeholder='Type your message...'
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          disabled={input.trim() === ''}
          size='sm'
          className='w-1/5 text-xs'
          type='submit'
        >
          Ask Zoro
        </Button>
        <Button
          size='icon'
          variant='outline'
          onClick={() => {
            setMessages([]);
            setConversation([]);
          }}
          type='reset'
          disabled={messages.length < 1 && conversation.length < 1}
        >
          <LucideTrash2 />
          <span className='sr-only'>clear chat</span>
        </Button>
      </form>
    </div>
  );
}
