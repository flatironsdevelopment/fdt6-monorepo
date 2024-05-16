import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from 'react-query'
import { PaginationOptions } from '~types'

export const usePagination = (options?: PaginationOptions) => {
  const { current, limit } = options || { current: 1, limit: 10 }
  const [page, setPage] = useState(current)
  const [perPage, setPerPage] = useState(limit)

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage)
  }

  return {
    current: page,
    limit: perPage,
    setPage: handlePageChange,
    changeLimit: handlePerPageChange
  }
}

export const usePaginatedFeature = (options: {
  key: string
  featureState: any
  pagination: ReturnType<typeof usePagination>
  limit?: number
  current?: number
}) => {
  const queryClient = useQueryClient()

  const { current, limit, setPage, changeLimit } = options.pagination
  const { featureState } = options

  const pagination = useMemo(() => {
    const { data: state } = featureState
    return state?.pagination
  }, [featureState])

  const goToNextPage = () => {
    if (pagination?.next) {
      setPage(pagination.current + 1)
      queryClient.invalidateQueries({
        predicate(query) {
          return query.queryKey[0] === options.key
        }
      })
    }
  }

  const goToPreviousPage = () => {
    if (pagination?.previous) {
      setPage(pagination.current - 1)
      queryClient.invalidateQueries({
        predicate(query) {
          return query.queryKey[0] === options.key
        }
      })
    }
  }

  useEffect(() => {
    if (options && options.current !== undefined) {
      setPage(options.current!)
    }
    if (options && options.limit !== undefined) {
      changeLimit(options.limit!)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    current,
    limit,
    setPage,
    changeLimit,
    goToNextPage,
    goToPreviousPage
  }
}
