---
title: viewACL
description: View Access Control List permissions
---

## Overview

The `viewACL` method retrieves the Access Control List (ACL) information for a handle, showing who has permissions to access the encrypted data.

## Syntax

```typescript
viewACL(
  handle: string
): Promise<HandleACL>
```

## Parameters

```typescript
// No additional imports needed - handle is a string
```

### handle

**Type:** `string`

The handle to query ACL information for.

```typescript
const acl = await handlesClient.viewACL(handle);
```

## Returns

```typescript
type HandleACL = {
  handle: string;              // The handle identifier
  owner: string;               // Address of the handle owner
  solidityType: string;         // Solidity type encoded in the handle
  allowedAddresses: string[];   // List of addresses with admin permissions
  viewers: string[];            // List of addresses with viewer permissions
  publiclyDecryptable: boolean; // Whether the handle is publicly decryptable
};
```

## Example

::: code-group

```typescript [Basic Usage]
import { createEthersHandleClient } from "@iexec/handles";

const handlesClient = createEthersHandleClient(signer);

// Get ACL information
const acl = await handlesClient.viewACL(handle);

console.log("Owner:", acl.owner);
console.log("Admins:", acl.allowedAddresses);
console.log("Viewers:", acl.viewers);
console.log("Publicly decryptable:", acl.publiclyDecryptable);
```

```typescript [Check Permissions]
const acl = await handlesClient.viewACL(handle);
const userAddress = await signer.getAddress();

// Check if user is owner
const isOwner = acl.owner.toLowerCase() === userAddress.toLowerCase();

// Check if user has admin permissions
const isAdmin = acl.allowedAddresses.some(
  addr => addr.toLowerCase() === userAddress.toLowerCase()
);

// Check if user has viewer permissions
const isViewer = acl.viewers.some(
  addr => addr.toLowerCase() === userAddress.toLowerCase()
);

if (isOwner || isAdmin) {
  console.log("User can compute with this handle");
}

if (isOwner || isAdmin || isViewer) {
  console.log("User can decrypt this handle");
}
```

```typescript [Permission Management UI]
async function displayPermissions(handle: string) {
  const acl = await handlesClient.viewACL(handle);
  
  console.log("=== Handle Permissions ===");
  console.log(`Handle: ${handle}`);
  console.log(`Type: ${acl.solidityType}`);
  console.log(`Owner: ${acl.owner}`);
  
  if (acl.allowedAddresses.length > 0) {
    console.log("\nAdmins:");
    acl.allowedAddresses.forEach(addr => console.log(`  - ${addr}`));
  }
  
  if (acl.viewers.length > 0) {
    console.log("\nViewers:");
    acl.viewers.forEach(addr => console.log(`  - ${addr}`));
  }
  
  if (acl.publiclyDecryptable) {
    console.log("\n⚠️  This handle is publicly decryptable");
  }
}
```

:::

## Description

`viewACL` queries the on-chain ACL smart contract to retrieve permission information for a handle. This allows you to:

- Check who owns a handle
- See which addresses have admin permissions
- See which addresses have viewer (decrypt-only) permissions
- Determine if a handle is publicly decryptable

## Permission Types

### Owner

The owner is the address that created the handle (set during encryption). Owners have:
- Full admin permissions
- Ability to grant/revoke permissions
- Ability to decrypt

### Admin

Addresses with admin permissions can:
- Use the handle in computations
- Grant permissions to other addresses
- Add viewers
- Decrypt the handle

### Viewer

Addresses with viewer permissions can:
- Decrypt the handle
- Cannot use in computations
- Cannot grant permissions

### Publicly Decryptable

If `publiclyDecryptable` is `true`, anyone can decrypt the handle without explicit permissions. This is typically used for computation results that should be publicly accessible.

## Use Cases

### Permission Audit

```typescript
// Audit who has access to a handle
const acl = await handlesClient.viewACL(handle);

console.log(`Total addresses with access: ${
  acl.allowedAddresses.length + acl.viewers.length + 1
}`); // +1 for owner
```

### Access Verification

```typescript
async function canUserDecrypt(handle: string, userAddress: string): Promise<boolean> {
  const acl = await handlesClient.viewACL(handle);
  
  // Check if publicly decryptable
  if (acl.publiclyDecryptable) {
    return true;
  }
  
  // Check if owner
  if (acl.owner.toLowerCase() === userAddress.toLowerCase()) {
    return true;
  }
  
  // Check if admin or viewer
  const allAllowed = [...acl.allowedAddresses, ...acl.viewers];
  return allAllowed.some(
    addr => addr.toLowerCase() === userAddress.toLowerCase()
  );
}
```

### Permission Dashboard

```typescript
async function buildPermissionDashboard(handles: string[]) {
  const dashboard = await Promise.all(
    handles.map(async (handle) => {
      const acl = await handlesClient.viewACL(handle);
      return {
        handle,
        owner: acl.owner,
        adminCount: acl.allowedAddresses.length,
        viewerCount: acl.viewers.length,
        isPublic: acl.publiclyDecryptable,
      };
    })
  );
  
  return dashboard;
}
```

## Error Handling

```typescript
try {
  const acl = await handlesClient.viewACL(handle);
} catch (error) {
  if (error.message.includes("handle not found")) {
    console.error("Handle does not exist");
  } else if (error.message.includes("ACL contract")) {
    console.error("Failed to query ACL contract");
  } else {
    console.error("Failed to retrieve ACL:", error);
  }
}
```

## Related

- [encryptInput](/references/js-sdk/methods/encryptInput) - Create handles (sets owner)
- [decrypt](/references/js-sdk/methods/decrypt) - Decrypt handles (requires permissions)
- [ACL Manager](/protocol/nox-smart-contracts#acl-manager) - On-chain ACL contract documentation
