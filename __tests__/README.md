# Firestore Security Rules Testing

This directory contains tests for the Firestore security rules using Firebase's Rules Unit Testing framework.

## Running Tests

There are two ways to run the Firestore security rules tests:

### Option 1: Using the Firebase Emulator (Recommended)

This method will automatically start the Firebase emulator for you, run the tests, and then stop the emulator:

```bash
npm run test:rules
```

### Option 2: Manual Testing

If you already have the Firebase emulator running in another terminal, you can run the tests directly:

1. First, start the Firebase emulator in a separate terminal:

   ```bash
   npm run emulate
   ```

2. Then run the tests:
   ```bash
   npm run test:rules:manual
   ```

## Test Coverage

The tests cover the following scenarios:

### Read Operations

- Unauthenticated users can read documents without permissions field
- Unauthenticated users cannot read documents with restricted permissions
- Authenticated users can read documents they have read access to
- Authenticated users cannot read documents they do not have access to

### Write Operations

- Unauthenticated users cannot create documents
- Authenticated users can create documents with themselves having admin permission
- Authenticated users can create documents with themselves having write permission
- Authenticated users cannot create documents without setting permissions
- Authenticated users cannot create documents giving others admin permission
- Users with admin permission can update any field
- Users with write permission cannot update permissions field
- Users with read permission cannot update documents

## Troubleshooting

If you encounter issues:

1. Make sure the Firebase emulator is running on the correct port (8080)
2. Check that the test environment is properly configured
3. If running tests manually, ensure the emulator is running before starting tests
