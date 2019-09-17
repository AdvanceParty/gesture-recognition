import { writable } from 'svelte/store';

export const STATUS_MONITORS = {
  WEBCAM: 'webcam',
  KERAS: 'kerasModule',
};

// predictions
export const label = writable(null);
export const confidences = writable({});
export const prediction = writable({
  label: '--',
  confidences: {},
});

// statuses
export const status = writable({
  kerasModule: '',
  webcam: '',
  messages: [],
});

export const messages = writable([]);
