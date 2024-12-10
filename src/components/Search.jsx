import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useSearchStore from '../store/SearchStore';

function Search() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { setSearchTerm, clearSearch } = useSearchStore();

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (location.pathname !== '/') {
            navigate('/');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSearchOpen(false);
        if (location.pathname !== '/') {
            navigate('/');
        }
    };

    const handleClose = () => {
        setIsSearchOpen(false);
        clearSearch();
    };

    return (
        <div className="relative">
            {isSearchOpen ? (
                <form onSubmit={handleSubmit} className="flex items-center">
                    <input
                        type="text"
                        onChange={handleInputChange}
                        placeholder="포켓몬 이름을 입력하세요"
                        className="bg-white px-4 py-2 rounded-full text-red-500 focus:outline-none font-bold shadow-md"
                        autoFocus
                    />
                    <button
                        type="button"
                        className="ml-2 hover:text-yellow-200"
                        onClick={handleClose}
                    >
                        닫기
                    </button>
                </form>
            ) : (
                <span
                    className="hover:text-yellow-200 cursor-pointer"
                    onClick={() => setIsSearchOpen(true)}
                >
                    검색
                </span>
            )}
        </div>
    );
}

export default Search;