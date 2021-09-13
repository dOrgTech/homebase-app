import { useQuery } from "react-query";
import { getTopicById } from "../topics";
import { Topic } from "../topics/types";

export const useDiscourseTopic = (discourseUrl?: string, topicId?: number) => {
  console.log("HEY ", discourseUrl, topicId);
  const result = useQuery<Topic, Error>(
    ["agoraTopic", topicId, discourseUrl],
    () => getTopicById(discourseUrl as string, topicId as number),
    {
      enabled: !!discourseUrl && !!topicId,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
    }
  );

  return result;
};
