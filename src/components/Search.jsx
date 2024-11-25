import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearchStore from '../store/SearchStore';

function Search() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navigate = useNavigate();
    const { setSearchTerm, clearSearch } = useSearchStore();

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value); 
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSearchOpen(false);
        navigate('/');
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
                        className="bg-red-500 px-4 py-1 rounded text-white focus:outline-none "
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
                    className="hover:text-green-700 cursor-pointer"
                    onClick={() => setIsSearchOpen(true)}
                >
                    검색
                </span>
            )}
        </div>
    );
}

export default Search;
