import { useQuery } from '@tanstack/react-query'
import { fetchYields } from '.'

export function useYields() {
  return useQuery({
    queryKey: ['yields'],
    queryFn: fetchYields,
  })
}
