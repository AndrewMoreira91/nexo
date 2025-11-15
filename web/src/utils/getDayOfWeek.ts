export const daysOfWeek = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
] as const

export const getDayOfWeek = (index: number | Date | string): string => {
  if (typeof index === 'number') {
    return daysOfWeek[index]
  }

  const indexDate = new Date(index).getDay()

  return daysOfWeek[indexDate + 1]
}
