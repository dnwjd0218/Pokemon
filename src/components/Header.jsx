import React from 'react';
import { Link } from 'react-router-dom';
import Search from './Search';
import { supabase } from '../supabase/supabaseClient';
import useAuthStore from '../store/AuthStore';

function Header() {
    const { user, setUser, clearUser } = useAuthStore();

    const handleKakaoLogin = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'kakao',
            });
            if (error) throw error;
            if (data?.user) {
                setUser(data.user);
            }
        } catch (error) {
            console.error('로그인 에러:', error.message);
        }
    };

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            clearUser();
        } catch (error) {
            console.error('로그아웃 에러:', error.message);
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-red-600 to-red-500 text-white p-4 z-50 shadow-lg backdrop-blur-sm bg-opacity-95">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold hover:text-yellow-300 transition-all transform ">
                    <Link to="/">포켓몬 도감</Link>
                </h1>
                <nav className="flex items-center space-x-8">
                    <Link to="/" className="hover:text-yellow-300 transition-all hover:scale-105">메인</Link>
                    <Link to="/favorite" className="hover:text-yellow-300 transition-all hover:scale-105">찜하기</Link>
                    <Search />
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-sm bg-yellow-200 text-red-600 px-4 py-2 rounded-full font-bold shadow-md">
                                {user.user_metadata.full_name} 님
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-white text-red-600 rounded-full font-bold hover:bg-yellow-300 transition-all hover:scale-105 shadow-md"
                            >
                                로그아웃
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleKakaoLogin}
                            className="px-4 py-2 bg-white text-red-600 rounded-full font-bold hover:bg-yellow-300 transition-all hover:scale-105 shadow-md"
                        >
                            카카오 로그인
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;