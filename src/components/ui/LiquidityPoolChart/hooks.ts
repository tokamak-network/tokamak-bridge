import { Currency } from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
import { TickProcessed, usePoolActiveLiquidity } from 'hooks/pool/'
import { useCallback, useMemo, useEffect, useRef} from 'react'

import { ChartEntry } from './types'

export function useDensityChartData({
  currencyA,
  currencyB,
  feeAmount,
}: {
  currencyA?: Currency
  currencyB?: Currency
  feeAmount?: FeeAmount
}) {
  const { isLoading, error, data } = usePoolActiveLiquidity(currencyA, currencyB, feeAmount)

  const formatData = useCallback(() => {
    if (!data?.length) {
      return undefined
    }

    const newData: ChartEntry[] = []

    for (let i = 0; i < data.length; i++) {
      const t: TickProcessed = data[i]

      const chartEntry = {
        activeLiquidity: parseFloat(t.liquidityActive.toString()),
        price0: parseFloat(t.price0),
      }

      if (chartEntry.activeLiquidity > 0) {
        newData.push(chartEntry)
      }
    }

    return newData
  }, [data])

  return useMemo(() => {
    return {
      isLoading,
      error,
      formattedData: !isLoading ? formatData() : undefined,
    }
  }, [isLoading, error, formatData])
}

// modified from https://usehooks.com/usePrevious/
export default function usePrevious<T>(value: T) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef<T>()

  // Store current value in ref
  useEffect(() => {
    ref.current = value
  }, [value]) // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current
}
