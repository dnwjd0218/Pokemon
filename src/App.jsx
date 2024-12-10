import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Main from './pages/Main';
import Detail from './pages/Detail';
import Favorite from './pages/Favorite';
import { supabase } from './supabase/supabaseClient';
import useAuthStore from './store/AuthStore';

function App() {
    const setUser = useAuthStore(state => state.setUser);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [setUser]);

    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/detail/:id" element={<Detail />} />
                <Route path="/favorite" element={<Favorite />} />
            </Routes>
        </div>
    );
}

export default App;