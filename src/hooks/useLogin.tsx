import api from '@/api/axios-config';
import { Response, User } from '@/types/types';
import { useState } from 'react';

export default function useLogin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const errorMessages: string[] = [];
  let user: User | null;

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);

    try {
      const { data }: Response = await api.post('/users/create', {
        name,
        email,
        password,
      });

      if (data.status == 'error' && data.error !== null) {
        data.error.details.map((err: string) => {
          errorMessages.push(err);
        });
        return;
      }

      if (data.data !== null) user = data.data.user;

      setLoading(false);
      return user;
    } catch (err: any) {
      errorMessages.push(err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data }: Response = await api.post('users/login', {
        email,
        password,
      });

      if (data.status == 'error' && data.error !== null) {
        data.error.details.map((err: string) => {
          errorMessages.push(err);
        });
        return;
      }

      if (data.token && data.data?.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data.data.user.id);
      }

      if (data.data) user = data.data.user;
      console.log('UseLogin:', user);

      setIsLoggedIn(true);

      return user;
    } catch (err: any) {
      errorMessages.push(err);
    } finally {
      setLoading(false);
    }
  };

  return { isLoggedIn, error: errorMessages, loading, register, login };
}
