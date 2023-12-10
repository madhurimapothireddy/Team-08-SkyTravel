import React from "react";

const CTable = ({ headings, rows }) => {
  return (
    <table className='cTable'>
      <thead>
        <tr className='cTable--headings'>
          {headings.map(hd => (
            <th key={hd}>{hd}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr>
            {row.map((col, index) => (
              <td key={`${col}_${index}`}>{col}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CTable;
