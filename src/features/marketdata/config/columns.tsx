import { type ColDef } from 'ag-grid-community'
import { type CoinPrice } from '../api/marketApi'
import { NameCell, PriceCell, ChangeCell } from './cells'

export interface CoinRow extends CoinPrice {
  rank: number
  displayPrice: number
  isLive: boolean
}

function formatLarge(n: number): string {
  if (!n) return '—'
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(2)}M`
  return `$${n.toLocaleString('en-US')}`
}

export const defaultColDef: ColDef<CoinRow> = { resizable: true, sortable: true }

export const pageSizeSelector = [25, 50, 100, 250]

export const colDefs: ColDef<CoinRow>[] = [
  {
    field: 'rank',
    headerName: '#',
    width: 58,
    sortable: false,
    suppressMovable: true,
    filter: false,
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 2,
    minWidth: 180,
    cellRenderer: NameCell,
    filter: 'agTextColumnFilter',
    filterParams: { filterOptions: ['contains', 'startsWith'], maxNumConditions: 1 },
  },
  {
    field: 'displayPrice',
    headerName: 'Price',
    flex: 1.5,
    minWidth: 140,
    cellRenderer: PriceCell,
    enableCellChangeFlash: true,
    type: 'rightAligned',
    filter: 'agNumberColumnFilter',
    filterParams: { filterOptions: ['greaterThan', 'lessThan', 'inRange'], maxNumConditions: 1 },
  },
  {
    field: 'priceChangePercent24h',
    headerName: '24h %',
    flex: 1,
    minWidth: 90,
    cellRenderer: ChangeCell,
    type: 'rightAligned',
    filter: 'agNumberColumnFilter',
    filterParams: { filterOptions: ['greaterThan', 'lessThan', 'inRange'], maxNumConditions: 1 },
  },
  {
    field: 'marketCapUsd',
    headerName: 'Market Cap',
    flex: 1.5,
    minWidth: 120,
    valueFormatter: p => formatLarge(p.value),
    type: 'rightAligned',
    cellStyle: () => ({ color: '#9ca3af', fontSize: '13px', fontFamily: 'monospace' }),
    filter: 'agNumberColumnFilter',
    filterParams: { filterOptions: ['greaterThan', 'lessThan', 'inRange'], maxNumConditions: 1 },
  },
  {
    field: 'volume24h',
    headerName: 'Volume 24h',
    flex: 1.5,
    minWidth: 120,
    valueFormatter: p => formatLarge(p.value),
    type: 'rightAligned',
    cellStyle: () => ({ color: '#9ca3af', fontSize: '13px', fontFamily: 'monospace' }),
    filter: 'agNumberColumnFilter',
    filterParams: { filterOptions: ['greaterThan', 'lessThan', 'inRange'], maxNumConditions: 1 },
  },
]