'use client';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function Search({ placeholder }: { placeholder: string }) {
    const router = useRouter();
    const [query, setQuery] = useState('');
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const url = new URL(window.location.href);
        if (e.key === 'Enter') {
            url.searchParams.set('_page', '1');
            if (query.trim()) {
                url.searchParams.set('query', query.trim());
                router.push(url.href);
            } else {
                url.searchParams.delete('query');
                router.push(url.href);
            }
        }
    };

    return (
        <div className="relative flex flex-1 flex-shrink-0">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 peer-focus:text-gray-900" />
            <input className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm text-black outline-2 placeholder:text-gray-500"
                placeholder={placeholder}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
            />
        </div>
    );
}