export const comma = (num: string | number | null) => {
  if (!num) return num
  num = num.toString()
  return num
    .replace(/(\.[0-9]*?)0+/g, '')
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export const timeDuration = (seconds: number | null) => {
  if (!seconds) return seconds
  const format = new Date(seconds * 1000).toISOString()
  const hours = format.slice(11, 13)
  // ✅ get hh:mm:ss string
  const result = new Date(seconds * 1000)
    .toISOString()
    .slice(11, 19)
  // ✅ if seconds are less than 1 hour and you only need mm:ss
  const result2 = new Date(seconds * 1000)
    .toISOString()
    .slice(14, 19)
  if (parseInt(hours) > 0) {
    return result
  }
  return result2
}

export const phone = (num: string | number | null) => {
  if (!num) return num
  num = num.toString()
  return num.replace(/-/g, '')
}
