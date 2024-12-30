'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDidMount } from '@src/utils/helper';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

const sortings = [
    { id: 0, type: 'type', name: 'ID', value: 'id' },
    { id: 1, type: 'type', name: 'Due Date', value: 'dueDate' },
    { id: 2, type: 'order', name: 'Ascending', value: 'asc' },
    { id: 3, type: 'order',name: 'Descending', value: 'desc' }
];

type Sorting = typeof sortings[number];

const SortTodo = ({ curSortBy, curSortOrder }: { curSortBy: string, curSortOrder: string }) => {
    const currentSortBy = sortings.find((sorting) => sorting.type === 'type' && sorting.value === curSortBy) || sortings[0];
    const currentSortOrder = sortings.find((sorting) => sorting.type === 'order' && sorting.value === curSortOrder) || sortings[2];

    const router = useRouter();
    const [selectedSort, setSelectedSort] = useState([currentSortBy, currentSortOrder]);
      
    const handleSortChange = (newSort: Sorting[]) => {
        const lastSelected = newSort[newSort.length - 1];
        if (!selectedSort.includes(lastSelected)) {
            newSort = newSort.filter((sort) => sort.type !== lastSelected.type || sort.id === lastSelected.id);
            setSelectedSort(newSort);
        };
    };

    const didMount = useDidMount()

    useEffect(() => {
        if (!didMount) return;
        const url = new URL(window.location.href);
        const queryParams = url.searchParams;
        const sortBy = selectedSort.find((sort) => sort.type === 'type')?.value;
        const sortOrder = selectedSort.find((sort) => sort.type === 'order')?.value;
        queryParams.set('_sort', `${sortOrder === 'desc' ? '-' : ''}${sortBy}`);
        queryParams.sort();
        router.push(url.href);
    }, [selectedSort]);

    return (  
        <div className="ml-2 relative block border border-slate-300 text-slate-300 pl-5 pr-8 py-1.5 rounded-lg hover:bg-slate-700 focus-within:bg-slate-700 outline-none cursor-pointer">
            <Listbox value={selectedSort} onChange={handleSortChange} multiple>
                <ListboxButton>
                    Sort
                    <ChevronDownIcon
                    className="group absolute top-2.5 right-2 size-4 fill-white/60"
                    aria-hidden="true"
                    />
                </ListboxButton>
                <ListboxOptions anchor="bottom" className="w-max relative rounded-lg border border-gray-600 bg-gray-700 text-white p-2 text-sm/5 [--anchor-gap:0.625em] focus:outline-none">
                    {sortings.map((sort, index) => (
                        <div key={sort.id}>
                            <ListboxOption value={sort} className="listboxOpt">
                                {({ selected }) => (
                                    <>
                                        <span className="block truncate">
                                            {sort.name}
                                        </span>
                                        {selected && (
                                        <span className="block absolute left-0 flex items-center pl-2">
                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                        )}
                                    </>
                                )}
                            </ListboxOption>
                            {(index === 1) && (<hr className="my-1"/>)}
                        </div>
                    ))}
                </ListboxOptions>
            </Listbox>
        </div>
    );
};

export default SortTodo;