import { useState, useEffect, useCallback } from "react"

// Define a generic type for the worker message and result
type WorkerMessage<T = any> = T
type WorkerResult<T = any> = T

const useWebWorker = <TMessage, TResult>(workerScript: string) => {
  const [worker, setWorker] = useState<Worker | null>(null)
  const [result, setResult] = useState<WorkerResult<TResult> | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const newWorker = new Worker(new URL(workerScript, import.meta.url))
    setWorker(newWorker)

    return () => newWorker.terminate()
  }, [workerScript])

  const sendMessage = useCallback(
    (message: WorkerMessage<TMessage>) => {
      if (worker) {
        setIsLoading(true)
        setError(null)
        worker.postMessage(message)
      }
    },
    [worker]
  )

  useEffect(() => {
    if (!worker) return

    const onMessage = (event: MessageEvent<WorkerResult<TResult>>) => {
      setResult(event.data)
      setIsLoading(false)
    }

    const onError = (error: ErrorEvent) => {
      setError(new Error(error.message))
      setIsLoading(false)
    }

    worker.addEventListener("message", onMessage)
    worker.addEventListener("error", onError)

    return () => {
      worker.removeEventListener("message", onMessage)
      worker.removeEventListener("error", onError)
    }
  }, [worker])

  return { sendMessage, result, error, isLoading }
}

export default useWebWorker
