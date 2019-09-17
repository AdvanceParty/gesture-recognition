import { writable } from 'svelte/store';

// predictions
export const label = writable(null);
export const confidences = writable({});

// statuses
export const nnStatus = writable('');
export const webcamStatus = writable('');
