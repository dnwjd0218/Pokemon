import React from 'react';
import { Link } from 'react-router-dom';
import Search from './Search';

function Header({ onSearch }) {
    return (
        <header className="bg-red-600 text-white p-4">
            <h1 className="text-2xl font-bold mb-2 text-center">포켓몬도감</h1>
            <nav className="flex justify-around items-center">
                <Link to="/" className="hover:text-yellow-200">메인</Link>
                <span className="hover:text-yellow-200">찜하기</span>
                <Search onSearch={onSearch} />
            </nav>
        </header>
    );
}

export default Header;