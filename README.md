# J-Cobs Enterprise

E-commerce web application build process.

## Authentication

---

### Todos:

- Fix use feedback delays in auth views
- Fix helmet middleware issues

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
- Reset password
  - add resetToken (generate token with crypto)
  - add resetTokenExpiration
- Authorization
