import { useQuery } from "@tanstack/react-query"
import { getTopicById } from "../topics"
import { Topic } from "../topics/types"

export const useAgoraTopic = (topicId?: number) => {
  const result = useQuery<Topic, Error>({
    queryKey: ["agoraTopic", topicId],
    queryFn: () => getTopicById(topicId as number),
    enabled: !!topicId,
    gcTime: Infinity,
    refetchOnWindowFocus: false
  })

  return result
}
