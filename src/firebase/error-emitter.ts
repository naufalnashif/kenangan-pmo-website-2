import { EventEmitter } from 'events';

// A simple event emitter to decouple error reporting from the components/logic that generate them.
// This allows a central listener to handle all Firestore permission errors in a consistent way.
export const errorEmitter = new EventEmitter();
