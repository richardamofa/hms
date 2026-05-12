import './DataTable.css'
import { FaPencil, FaDeleteLeft } from 'react-icons/fa6'

interface Column<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  emptyMessage?: string
}

const DataTable = <T extends { id: string }>({
  columns,
  data,
  onEdit,
  onDelete,
  emptyMessage = 'No data found',
}: DataTableProps<T>) => {
  if (data.length === 0) {
    return <div className="empty-state">{emptyMessage}</div>
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
            {(onEdit || onDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="actions">
                  {onEdit && (
                    <button
                      className="btn-edit"
                      onClick={() => onEdit(item)}
                      title="Edit"
                    >
                      <FaPencil style={{color: 'orange'}} />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="btn-delete"
                      onClick={() => onDelete(item)}
                      title="Delete"
                    >
                      <FaDeleteLeft style={{color: 'red'}} />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
