export const debounce = <T extends (...args: any[]) => any>(callback: T, waitFor: number) => {
  let timeout = 0
  return (...args: Parameters<T>): ReturnType<T> => {
    let result: any
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      result = callback(...args)
    }, waitFor) as unknown as number
    return result
  }
}
