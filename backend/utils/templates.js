// REVIEW ADMIN
export const reviewAdminTemplate = (review) => `
  <h2>New Review</h2>
  <p>Name: ${review.name}</p>
  <p>Email: ${review.email}</p>
  <p>Message: ${review.message}</p>
`;

// REVIEW USER PENDING
export const reviewUserPendingTemplate = (name) => `
  <h2>Thanks ${name}</h2>
  <p>Your review is under approval.</p>
`;

// REVIEW APPROVED
export const reviewApprovedTemplate = (name) => `
  <h2>🎉 Approved!</h2>
  <p>Your review is live now.</p>
`;

// CONTACT ADMIN
export const contactAdminTemplate = (data) => `
  <h2>Contact Query</h2>
  <p>Name: ${data.name}</p>
  <p>Email: ${data.email}</p>
  <p>Message: ${data.message}</p>
`;

// CONTACT USER
export const contactUserTemplate = (name) => `
  <h2>Message Received</h2>
  <p>Hi ${name}, we’ll reply soon.</p>
`;