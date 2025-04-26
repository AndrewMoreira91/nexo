import { api } from '../libs/api'
import type { DataProgressType, DataStatisticsType } from '../types'

type QueryOptions = {
  daysPrevious?: number
}

export const getDataProgress = async ({ daysPrevious = 0 }: QueryOptions) => {
  const response = await api.get<DataProgressType[]>(
    `/get-data-progress?daysPrevious=${daysPrevious}`
  )
  if (response.data.length === 0) {
    return null
  }
  return response.data
}

export const getDataStatistics = async ({ daysPrevious = 0 }: QueryOptions) => {
  const response = await api.get<DataStatisticsType>(
    `/get-data-statistic?daysPrevious=${daysPrevious}`
  )
  return response.data
}
