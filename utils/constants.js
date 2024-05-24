export const ROLES = Object.freeze({
  ADMIN: 'admin',
  STUDENT: 'student', // request initiator
  TEACHER: 'teacher',
});

export const STATUS_CODES = Object.freeze({
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
});

export const ACTIVITY_TYPES = Object.freeze({
  EVENT: 'event',
  TRAINING: 'training',
  CLINIC_FACILITATION: 'clinic_facilitation',
  OTHER: 'other'
});

export const ACTIVITY_STATUS = Object.freeze({
  SUBMITTED: 'submitted',
  INITIATED: 'initiated',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
});

export const ACTIVITY_PRIORITY = Object.freeze({
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
});