import { Topic } from "./types";

export const getTopicById = async (
  discourseUrl: string,
  topicId: number
): Promise<Topic> => {
  if (topicId <= 0) {
    throw new Error("Failed to fetch Agora Topic from Discourse API");
  }

  const url = `${process.env.REACT_APP_CORS_PROXY_URL}/${discourseUrl}t/${topicId}.json`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Agora Topic from Discourse API");
  }

  const result: Topic = await response.json();

  return result;
};
