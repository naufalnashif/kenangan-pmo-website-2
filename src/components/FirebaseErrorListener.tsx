'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

// This component listens for custom 'permission-error' events and throws them as uncaught exceptions.
// In Next.js development mode, this will display the rich, contextual error in the development overlay,
// making it much easier to debug Firestore Security Rules.
export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: Error) => {
      // Throwing the error here will cause it to be caught by Next.js's error overlay
      // in development, providing a much better debugging experience than a simple console.log.
      throw error;
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  return null; // This component does not render anything.
}
