import React from 'react';
import { Link } from 'react-router-dom';
import Search from './Search';
import { supabase } from '../../supabase/supabaseClient';
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
        <header className="bg-red-600 text-white p-4">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold">포켓몬도감</h1>
                <nav className="flex items-center space-x-6">
                    <Link to="/" className="hover:text-yellow-200">메인</Link>
                    <Link to="/favorite" className="hover:text-yellow-200">찜하기</Link>
                    <Search />
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-sm">{user.user_metadata.full_name}</span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                            >
                                로그아웃
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleKakaoLogin}
                            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
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