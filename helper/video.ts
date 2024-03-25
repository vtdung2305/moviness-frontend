/* eslint-disable no-useless-escape */
export const isVideoFromYoutube = (valueInput: string) => {
  const regex =
    /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
  return !!regex.test(valueInput)
}

export const checkYouTubeUrl = (url: string) => {
  const p =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
  if (url.match(p)) {
    return true
  }
  return false
}
