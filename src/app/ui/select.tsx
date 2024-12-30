'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDidMount } from '@src/utils/helper';
import { Select } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const ItemsPerPageSelector = ({ taskPerPage }: { taskPerPage?: number }) => {
  const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(taskPerPage ? taskPerPage : 10);
  const router = useRouter();
  const handleItemsPerPageChange = (e: { target: { value: string; }; }) => {
    setSelectedItemsPerPage(parseInt(e.target.value));
  };

  const didMount = useDidMount()

  useEffect(() => {
    if (!didMount) return;
    const url = new URL(window.location.href);
    const queryParams = url.searchParams;

    queryParams.set('_per_page', selectedItemsPerPage.toString());
    router.push(url.href);
  }, [selectedItemsPerPage]);

  return (
    <div className="absolute right-0 flex items-center my-4">
      <label className="text-sm text-slate-300 mr-2">Tasks per page:</label>
      <Select
        value={taskPerPage ? taskPerPage : selectedItemsPerPage}
        onChange={handleItemsPerPageChange}
        className="appearance-none border border-slate-300 text-slate-300 pl-2 pr-5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 focus-within:bg-slate-700 outline-none cursor-pointer"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
      </Select>
      <ChevronDownIcon
            className="group pointer-events-none absolute top-2.5 right-1 size-4 fill-white/60"
            aria-hidden="true"
      />
    </div>
  );
};

export default ItemsPerPageSelector;