// Authentication validation service

const DEMO_CREDENTIALS = {
  "aliko.dangote@dangotecement.com": {
    password: "password",
    name: "Aliko Dangote",
  },
  "zainab.hassan@dangotecement.com": {
    password: "password",
    name: "Zainab Hassan",
  },
  "seun.adebayo@dangotecement.com": {
    password: "password",
    name: "Oluwaseun Adebayo",
  },
};

export type ValidCredentials = keyof typeof DEMO_CREDENTIALS;

export const authValidation = {
  /**
   * Validate email and password against demo users
   */
  validateCredentials: (
    email: string,
    password: string
  ): { valid: boolean; message: string; user?: ValidCredentials } => {
    if (!email || !password) {
      return {
        valid: false,
        message: "Email and password are required",
      };
    }

    if (!email.includes("@")) {
      return {
        valid: false,
        message: "Please enter a valid email address",
      };
    }

    const validEmail = email as ValidCredentials;

    if (!(validEmail in DEMO_CREDENTIALS)) {
      return {
        valid: false,
        message: "Invalid email address. This user account does not exist.",
      };
    }

    const credentials = DEMO_CREDENTIALS[validEmail];

    if (password !== credentials.password) {
      return {
        valid: false,
        message: "Invalid password. Please try again.",
      };
    }

    return {
      valid: true,
      message: "Login successful",
      user: validEmail,
    };
  },

  /**
   * Get all valid demo user emails
   */
  getDemoUsers: () => {
    return Object.keys(DEMO_CREDENTIALS) as ValidCredentials[];
  },

  /**
   * Check if email exists
   */
  emailExists: (email: string): boolean => {
    return email in DEMO_CREDENTIALS;
  },

  /**
   * Get user info by email
   */
  getUserInfo: (email: string) => {
    if (email in DEMO_CREDENTIALS) {
      return DEMO_CREDENTIALS[email as ValidCredentials];
    }
    return null;
  },
};
