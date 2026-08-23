import '@testing-library/jest-dom/vitest';
import { act, cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(async () => {
  await act(async () => {
    cleanup();
  });
});
