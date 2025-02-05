export class BadRequestError extends Error {
  constructor(message = "Bad Request") {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
  }
}

export class NotFoundError extends Error {
  constructor(message = "Not Found") {
    super(message);
  }
}

export class CardWithSameFingerprintError extends Error {
  constructor(message = "Card with same fingerprint already exists") {
    super(message);
  }
}

export class DeviceWithSameSerialIdError extends Error {
  constructor(message = "Device with same serial id already exists") {
    super(message);
  }
}

export class PublicKeyAlreadySetError extends Error {
  constructor(message = "Public key already set") {
    super(message);
  }
}
