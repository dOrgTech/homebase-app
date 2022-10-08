import { useEffect, useState } from "react"

const FILE_NAME = "faq.md"
const QUESTION_DELIMITER = "<question>"
const ANSWER_DELIMITER = "<answer>"

export const useGenerateFAQ = () => {
  const [faqFile, setFaqFile] = useState<string>("")
  const [questionsToRender, setQuestionToRender] = useState<string[]>([])
  const [answersToRender, setAnswerToRender] = useState<string[]>([])
  const [faqList, setFaqList] = useState<{ question: string; answer: string }[]>([])

  useEffect(() => {
    import(`../utils/${FILE_NAME}`)
      .then(res => {
        fetch(res.default)
          .then(res => res.text())
          .then(res => setFaqFile(res))
      })
      .catch(error => console.log(error))
  })

  useEffect(() => {
    const questionsList = faqFile.split(QUESTION_DELIMITER)
    const answerList = faqFile.split(ANSWER_DELIMITER)
    if (questionsList.length > 0) {
      const questions: string[] = []
      questionsList.forEach(word => {
        if (word !== "" && !word.includes("\n") && !word.includes(ANSWER_DELIMITER)) {
          questions.push(word)
        }
      })
      setQuestionToRender(questions)
    }
    if (answerList.length > 0) {
      const answers: string[] = []
      answerList.forEach(word => {
        if (word !== "" && !word.includes(QUESTION_DELIMITER)) {
          answers.push(word)
        }
      })
      setAnswerToRender(answers.filter(a => a !== "\n"))
    }
  }, [faqFile])

  useEffect(() => {
    if (questionsToRender.length === answersToRender.length) {
      const list = questionsToRender.map((question, index) => {
        return {
          question,
          answer: answersToRender[index]
        }
      })
      setFaqList(list)
    }
  }, [questionsToRender, answersToRender])

  return faqList
}
