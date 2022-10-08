import { useQuery } from "react-query"
import { getTopicById } from "../topics"
import { Topic } from "../topics/types"

export const useAgoraTopic = (topicId?: number) => {
  const result = useQuery<Topic, Error>(["agoraTopic", topicId], () => getTopicById(topicId as number), {
    enabled: !!topicId,
    cacheTime: Infinity,
    refetchOnWindowFocus: false
  })

  return result
}
