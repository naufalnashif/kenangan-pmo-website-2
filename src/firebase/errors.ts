// A custom error class for Firestore permission errors to provide richer context.
// This helps in debugging security rules by providing detailed information about the failed request.
export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

// This class constructs a detailed, user-friendly error message for Firestore permission issues.
// It formats the context into a JSON object that is easy to read and helps pinpoint the exact cause of a security rule denial.
export class FirestorePermissionError extends Error {
  constructor(context: SecurityRuleContext) {
    const errorMessage = `
FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:
${JSON.stringify({ ...context }, null, 2)}
`;
    super(errorMessage);
    this.name = 'FirestorePermissionError';
  }
}
