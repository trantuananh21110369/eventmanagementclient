import React from 'react'
import { useSearchParams } from 'react-router-dom';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchName = searchParams.get('name');


  return (
    <div>SearchPage</div>
  )
}

export default SearchPage