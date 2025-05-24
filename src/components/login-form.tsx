import { Card, CardContent } from '@/components/ui/card';
import useLogin from '@/hooks/useLogin';
import { cn } from '@/lib/utils';
import { FormLogin, FormSingUp } from '@/templates/forms-login';
import Notifications from '@/templates/notifications';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import Loader from './loader';

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [isFliped, setIsFliped] = useState<boolean>(true);

  const toggleForm = () => {
    setIsFliped(!isFliped);
  };

  const [errorsValue, setErrorsValue] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);

  const { error, loading, register, login } = useLogin();

  const navigate = useNavigate({ from: '/' });

  // function logs() {
  //   console.log('Results:', result);
  //   console.log('Usuário:', user);
  //   console.log('Erros do formulário:', errorsValue);
  //   console.log('Erro de requisição:', error);
  // }

  const validBody = async (formData: FormData) => {
    let body: any = {};

    formData.forEach((value, key) => {
      if (key === 'confirmPassword') return;
      if (value === '') {
        setErrorsValue((prevKeys) => [...prevKeys, `${key} is required`]);
        return;
      }
      body = { ...body, [key]: value };
    });

    return body;
  };

  const handleLogin = async (formData: FormData) => {
    setErrorsValue([]);

    const body = await validBody(formData);

    if (errorsValue.length > 0) return;

    if (error.length > 0) {
      setErrorsValue((prevKeys) => [...prevKeys, ...error]);
      return;
    }

    const user = await login(body.email, body.password);

    if (!user) {
      setNotifications(error);
      return;
    }
    setNotifications(['Login realizado com sucesso!']);
    setTimeout(() => {
      navigate({ to: '/planilhas/arquivos' });
    }, 1000);
  };

  const handleRegister = async (formData: FormData) => {
    setErrorsValue([]);

    const body = await validBody(formData);

    if (errorsValue.length > 0) {
      return;
    }
    if (error.length > 0) {
      setErrorsValue((prevKeys) => [...prevKeys, ...error]);
      return;
    }

    const user = await register(body.name, body.email, body.password);

    if (user == null) {
      setNotifications(error);
      return;
    }
    setNotifications(['Cadastro realizado com sucesso!']);
    setIsFliped(!isFliped);
  };

  // Remove error messages after 5 seconds
  setTimeout(() => {
    if (notifications.length > 0) {
      setNotifications([]);
    }
  }, 3000);

  return (
    <>
      {loading && <Loader />}
      {notifications.length > 0 && <Notifications messages={notifications} />}

      <div
        className={cn(
          'flex flex-col gap-6 items-center justify-center perspective-1000',
          className,
        )}
        {...props}
      >
        <div className="relative w-[800px] h-[568px] preserve-3d transition-transform duration-800">
          {/* Cartão de Login */}
          <Card
            className={cn(
              'absolute w-full h-full overflow-hidden p-0 border-none shadow-2xl backface-hidden transition-transform duration-800',
              !isFliped && 'rotate-y-180',
            )}
          >
            <CardContent className="grid p-0 md:grid-cols-2 h-full justify-center">
              <div>
                <FormLogin toggleForm={toggleForm} login={handleLogin} />
              </div>
              <div className="bg-amber-800 hidden md:block">
                <img src="" alt="" className="w-full h-full object-cover" />
              </div>
            </CardContent>
          </Card>

          {/* Cartão de Cadastro */}
          <Card
            className={cn(
              'absolute w-full h-full overflow-hidden p-0 border-none shadow-2xl backface-hidden rotate-y-180 transition-transform duration-800',
              !isFliped && 'rotate-y-0',
            )}
          >
            <CardContent className="grid p-0 md:grid-cols-2 h-full justify-center">
              <div className="bg-amber-800 hidden md:block">
                <img src="" alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <FormSingUp toggleForm={toggleForm} register={handleRegister} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
