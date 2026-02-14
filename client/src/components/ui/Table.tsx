import React from 'react';

export interface TableProps {
  headers: string[];
  data: any[];
  renderRow: (item: any, index: number) => React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, data, renderRow }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            {headers.map((header, i) => (
              <th key={i} className="p-3 text-left text-sm font-medium text-gray-700">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i} className="border-t border-gray-200 hover:bg-gray-50">
              {renderRow(item, i)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};