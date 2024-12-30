'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDidMount } from '@src/utils/helper';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';

type Filter = typeof filters[number];

const filters = [
    { id: 0, category: null, status: 'All' },
    { id: 1, category: null, status: 'Complete' },
    { id: 2, category: null, status: 'Incomplete' },
    { id: 3, category: 'Personal', status:null },
    { id: 4, category: 'Work', status:null },
    { id: 5, category: 'Urgent', status:null },
]

const statuses = [0, 1, 2];

export default function Filter() {
  type Filter = typeof filters[number];
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Filter[]>([filters[0]]);

  const handleFilterChange = (newFilters: Filter[]) => {
    const toggledFilter = newFilters.find((filter) => !selectedFilters.includes(filter)) 
      || selectedFilters.find((filter) => !newFilters.includes(filter));
  
    if (!toggledFilter) return;
    
    let updatedFilters;
    if (toggledFilter.id === 0) {
      setSelectedFilters([filters[0]]);
      return;
    } else {
      updatedFilters = selectedFilters.filter((filter) => filter.id !== 0);
    }
  
    if (statuses.includes(toggledFilter.id)) {
      updatedFilters = selectedFilters.filter((filter) => !statuses.includes(filter.id));
      setSelectedFilters([...updatedFilters, toggledFilter]);
    } else {
      const categoryExists = selectedFilters.some((filter) => filter.category === toggledFilter.category);
      if (categoryExists) {
        setSelectedFilters(updatedFilters.filter((filter) => filter.category !== toggledFilter.category));
      } else {
        setSelectedFilters([...updatedFilters, toggledFilter]);
      }
    }
  };
  
  const didMount = useDidMount()

  useEffect(() => {
    if (!didMount) return;
    const url = new URL(window.location.href);
    const queryParams = url.searchParams;
    queryParams.delete('status');
    queryParams.delete('category');
    queryParams.set('_page', '1');
    if (selectedFilters.length === 1 && selectedFilters[0].id === 0) {
      router.push(url.href);
      return;
    }

    selectedFilters.map((filter => {
      const key = filter.status ? 'status' : 'category';
      const value = filter.status || filter.category!;
      const values = queryParams.getAll(key); 
      !values.includes(value) ? queryParams.append(key, value) : null;
    }))

    queryParams.sort();
    router.push(url.href);
  }, [selectedFilters]);

  return (
    <div role="button" onClick={() => setIsOpen(!isOpen)} className="ml-2 relative block border border-slate-300 text-slate-300 pl-5 pr-8 py-1.5 rounded-lg hover:bg-slate-700 focus-within:bg-slate-700 outline-none cursor-pointer" >
      <Listbox value={selectedFilters} onChange={handleFilterChange} multiple>
          <ListboxButton id="listbox-button" onBlur={() => setIsOpen(false)}>
            Filters
            <ChevronDownIcon
            className="group absolute top-2.5 right-2 size-4 fill-white/60"
            aria-hidden="true"
            />
          </ListboxButton>
          
          <ListboxOptions anchor="bottom" className="relative w-max rounded-lg border border-gray-600 bg-gray-700 text-white p-2 text-sm/5 text-center [--anchor-gap:0.625em] focus:outline-none">
            {filters.map((filter, index) => (
              <div key={filter.id}>
                <ListboxOption value={filter} className="listboxOpt">
                  {({ selected }) => (
                    <>
                      <span className="block truncate">
                        {filter.status || filter.category}
                      </span>
                      {selected && (
                      <span className="block absolute left-0 flex items-center pl-2">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      )}
                    </>
                  )}
                </ListboxOption>
                {(index === 0 || index === 2) && (<hr className="my-1"/>)}
              </div>
            ))}
          </ListboxOptions>
      </Listbox>
    </div>
  );
}