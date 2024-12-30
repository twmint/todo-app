'use client';
import { useRouter } from 'next/navigation';

export default function Pagination({totalPages, currentPage, perPage}: {totalPages: number, currentPage: number, perPage: number}) {
    const router = useRouter();
    const handlePageChange = (page: number) => {
        const url = new URL(window.location.href);
        const searchParams = url.searchParams;
        searchParams.set('_page', page.toString());
        searchParams.set('_per_page', perPage.toString());
        router.push(url.href);
    }

    return (
        <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button key={page} onClick={() => handlePageChange(page)} 
                className={`mx-1 px-3 py-1 border border-slate-300 rounded-md hover:bg-slate-700 focus-within:bg-slate-700 outline-none ${page === currentPage ? 'bg-slate-700' : ''}`}
                >
                    {page}
                </button>
            ))}
        </div>
    )
}