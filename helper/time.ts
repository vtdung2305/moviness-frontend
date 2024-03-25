export const converSencondToMinuteSecond = (
  secondInput: string | number
) => {
  const time = Number(secondInput)
  const minutes = Math.floor(time / 60)
  const second = Math.floor(time % 60)
  return `${minutes < 10 ? '0' + minutes : minutes}:${
    second < 10 ? '0' + second : second
  } `
}
