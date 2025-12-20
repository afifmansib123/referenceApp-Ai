import { Amplify } from "aws-amplify";
import { signOut as amplifySignOut } from "aws-amplify/auth";

/**
 * Initialize AWS Amplify configuration
 */
export const initializeAmplify = () => {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
        userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
        loginWith: {
          oauth: {
            domain: process.env.NEXT_PUBLIC_AWS_COGNITO_DOMAIN!,
            scopes: ["openid", "email", "profile"],
            redirectSignIn: [
              process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000/",
            ],
            redirectSignOut: [
              process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000/",
            ],
            responseType: "code",
            providers: ["Google"],
          },
        },
      },
    },
  });

  console.log("Amplify initialized successfully");
};

/**
 * Sign out user
 */
export const signOutUser = async () => {
  try {
    await amplifySignOut();
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

/**
 * Get authentication token
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const { fetchAuthSession } = await import("aws-amplify/auth");
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() || null;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};
