import { createAI } from 'ai/rsc';

import { continueConversation } from './functions/mutations';
import type { AIState, UIState } from './types';

export const AI = createAI({
  initialAIState: [] as AIState,
  initialUIState: [] as UIState,
  actions: {
    continueConversation,
  },
});
