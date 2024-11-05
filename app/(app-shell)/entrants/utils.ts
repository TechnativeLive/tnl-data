export function headshotDest(
  entrant?: Pick<Tables<'entrants'>, 'id' | 'first_name' | 'last_name'>,
): string | undefined {
  return entrant ? `${entrant.id}-${entrant.first_name}-${entrant.last_name}` : undefined
}

export function headshotAbsoluteUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}/headshots/${path}`
}

export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      resolve(fileReader.result as string)
    }
    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}
