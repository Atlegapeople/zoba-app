import LoginForm from '@/components/auth/LoginForm';

export default function AuthPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-ghost-white dark:bg-space-cadet">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
