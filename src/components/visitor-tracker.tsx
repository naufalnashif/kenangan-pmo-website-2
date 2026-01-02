'use client';

import { useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function VisitorTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Ensure this only runs in the browser
        if (typeof window !== 'undefined') {
          const visitsCollection = collection(db, 'visits');
          await addDoc(visitsCollection, {
            timestamp: serverTimestamp(),
            userAgent: navigator.userAgent,
            pathname: window.location.pathname,
          });
        }
      } catch (error) {
        console.error("Error tracking visit: ", error);
        // Note: For this to work, you need to set up Firestore and have security rules
        // that allow writing to the 'visits' collection.
        // e.g., in Firestore Rules: 
        // rules_version = '2';
        // service cloud.firestore {
        //   match /databases/{database}/documents {
        //     match /visits/{visitId} {
        //       allow create: if true;
        //       allow read, write, delete: if false; // For security
        //     }
        //   }
        // }
      }
    };

    trackVisit();
  }, []);

  return null; // This component does not render anything
}
