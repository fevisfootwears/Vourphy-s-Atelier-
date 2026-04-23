# Vourphy's Atelier Security Specification

## 1. Data Invariants
- **Product Management**: Only authenticated users with the `admin` role can Create, Update, or Delete products.
- **Identity Invariant**: A user cannot modify their own `role` or elevate their own permissions.
- **Relational Integrity**: Orders must be linked to a valid `customerId` that matches the authenticated user.
- **Terminal State**: Once an order is marked as `shipped` or `delivered`, it cannot be `cancelled` by the customer.

## 2. The Dirty Dozen (Threat Payloads)

| Payload ID | Description | Targeted Vulnerability | Expected Result |
|------------|-------------|-------------------------|-----------------|
| P1 | Create product as an unauthenticated user | Missing Auth Check | 403 Forbidden |
| P2 | Create product as a standard customer | Insufficient Role Check | 403 Forbidden |
| P3 | Update product price to $0 as non-admin | Privilege Escalation | 403 Forbidden |
| P4 | Delete a product from the catalog as non-admin | Unauthorized Write | 403 Forbidden |
| P5 | Create order for another user's ID | Identity Spoofing | 403 Forbidden |
| P6 | Update order status to 'delivered' as customer | Identity Logic Tier Leak | 403 Forbidden |
| P7 | Inject a 2MB string into product name | Denial of Wallet (Size Exploit) | 403 Forbidden |
| P8 | Set `role: 'admin'` during user registration | Shadow Field Injection | 403 Forbidden |
| P9 | Update user profile with illegal characters in ID | ID Poisoning | 403 Forbidden |
| P10 | Read other users' private profile data | PII Leak | 403 Forbidden |
| P11 | Cancel an order that is already 'shipped' | State Machine Bypass | 403 Forbidden |
| P12 | Re-assign high-value order to own UID | Ownership Theft | 403 Forbidden |

## 3. Implementation Blueprint
- **Master Gate**: `isAdmin()` helper requiring `exists()` check and `email_verified`.
- **Validation**: `isValidProduct()` and `isValidOrder()` functions enforcing strict types and sizes.
- **Action-Based Updates**: Using `affectedKeys().hasOnly()` to restrict what can be changed in each operation.
