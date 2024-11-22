import React from 'react';
import { useSearchParams } from 'react-router-dom';

interface PaginationProps {
  totalRecords: number;
}

function PagingBar({ totalRecords }: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageNumber = parseInt(searchParams.get('pageNumber') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10'); // Get pageSize from search params

  const totalPages = Math.ceil(totalRecords / pageSize);

  const getPageDetail = () => {
    const startRecord = (pageNumber - 1) * pageSize + 1;
    const endRecord = Math.min(pageNumber * pageSize, totalRecords);
    return `${startRecord}–${endRecord} of ${totalRecords}`;
  };

  const handlePageChange = (direction: 'prev' | 'next') => {
    const newPageNumber = direction === 'prev' ? pageNumber - 1 : pageNumber + 1;
    setSearchParams({
      pageNumber: newPageNumber.toString(),
      pageSize: pageSize.toString(),
    });
  };

  const handlePageSizeChange = (size: number) => {
    setSearchParams({
      pageNumber: '1',  // Reset to page 1 when page size changes
      pageSize: size.toString(),
    });
  };

  return (
    <div className="flex p-4 justify-end items-center gap-2 mx-5">
      <div>Rows per page:</div>
      <select
        className="form-select mx-2"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handlePageSizeChange(Number(e.target.value))}
        value={pageSize}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </select>

      <div className="mx-2">{getPageDetail()}</div>

      <button
        className="p-2 bg-blue-300 rounded-full"
        disabled={pageNumber === 1}
        onClick={() => handlePageChange('prev')}
      >
        Prev
      </button>
      <p className="m-3"> {pageNumber} / {totalPages} </p>
      <button
        className="p-2 bg-blue-300 rounded-full"
        disabled={pageNumber * pageSize >= totalRecords}
        onClick={() => handlePageChange('next')}
      >
        Next
      </button>
    </div>
  );
}

export default PagingBar;
