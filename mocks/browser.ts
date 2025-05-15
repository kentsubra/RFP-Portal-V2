import { setupWorker } from 'msw/browser';
import { handlers } from '../test/msw/opportunityHandlers';

export const worker = setupWorker(...handlers); 