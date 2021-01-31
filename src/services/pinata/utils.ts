export const getAuthHeader = (): {
  Authorization: string;
} => {
  if (!process.env.REACT_APP_JWT) {
    throw new Error(
      `REACT_APP_JWT env variable not set in .env file. Required for pinata fetcher`
    );
  }

  return {
    Authorization: `Bearer ${process.env.REACT_APP_JWT}`,
  };
};
