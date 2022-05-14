import { API_URL } from ".."
import { Topic } from "./types"

export const getTopicById = async (topicId: number): Promise<Topic> => {
  if (topicId <= 0) {
    throw new Error("Failed to fetch Agora Topic from Discourse API")
  }

  const url = `${API_URL}/t/${topicId}.json`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch Agora Topic from Discourse API")
  }

  const result: Topic = await response.json()

  return result
}
