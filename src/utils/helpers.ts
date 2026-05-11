export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatDateInput = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toISOString().slice(0, 16)
}
