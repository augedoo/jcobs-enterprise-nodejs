# J-Cobs Enterprise

E-commerce web application build process.

### Todos:

- Fix use feedback delays in auth views
- Fix helmet middleware issues
- Fix paging in invoice data.

## Authentication

---

### Login

- Take user login credentials.
- Validate credentials:
  - check email
  - check password
- Give user a session.

### Signup

- Take credentials and validate user input (use encrypted passwords).
  - bcryptjs
  - express-validator
- Implement session.
  - express-session,
  - connect-mongodb-session,
  - connect-session-sequelize,
- Protect routes from unauthenticated access.
  - route protection middleware
- Implement CSRF protection.
  - csurf
- Provide use feedbacks (flash messages)
  - connect-flash
  - use validation logic
- Send emails to verify signup
  - nodemailer
  - nodemailer-sendgrid-transport
- Authorization

### Reset password

- add resetToken (generate token with crypto)
- add resetTokenExpiration

## Handle Errors

---

- Implement error handling middlewares
  - Fix 404
  - Fix 500
- Provide user feedbacks where neccessary

## File Upload and Download

---

- Upload product image
- Delete product image from server when product is deleted
- Generate order invoices on the fly for user reference

## Implement Pagination

---

- Apply this feature where necessary.

## Add Async Requests

---

- Apply this feature where necessary.
  - E.g. Deleting a product doesn't need to reload the page.

## Add Payment

---

- Add checkout flow.
- Add third party payment service provider.
