import { SignInButton } from '../components/AuthButtons';

const SignIn: React.FC = () => {

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Smart Track</h1>
      <SignInButton />
    </div>
  );
};

export default SignIn;