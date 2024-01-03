import { capitalize } from '@utils';
import { Formik, Form, Field } from 'formik';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AuthStateEnum,
  ILoginData,
  ILoginProps,
  IRegistrationData,
  IRegistrationProps,
} from './Authentication.types';
import './Authentication.scss';
import Input from '@base/Input';
import Button from '@base/Button';
import * as Yup from 'yup';
import { useAuthRepository } from '@repos';
// import StarsBackground from '@components/StarsBackground/StarsBackground';
import FieldErrorMessage from '@base/FieldErrorMessage/FieldErrorMessage';
import { useStore } from '@store';
import { useObservableState } from 'observable-hooks';
import Switcher from '@base/Switcher';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(5, 'Password is too short!')
    .max(50, 'Password is too long!')
    .required('Required')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
});

const RegistrationSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Username is too short!')
    .max(20, 'Username is too long!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(5, 'Password is too short!')
    .max(50, 'Password is too long!')
    .required('Required')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
});

const Login = (props: ILoginProps<ILoginData>) => {
  const initialData: ILoginData = {
    email: '',
    password: '',
  };

  const handleSubmitForm = (values: ILoginData) => {
    props.submitAction(values);
  };
  return (
    <div className="LoginBlock">
      <Formik
        initialValues={initialData}
        validationSchema={LoginSchema}
        onSubmit={handleSubmitForm}
      >
        {() => (
          <Form className="FormContainer">
            <div className="Section">
              <label htmlFor="email">Email:</label>
              <Field as={Input} name="email" placeholder="Enter your email" autoComplete="name email" />
              <FieldErrorMessage name="email" />
            </div>
            <div className="Section">
              <label htmlFor="password">Password:</label>
              <Field
                as={Input}
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="password"
              />
              <FieldErrorMessage name="password" />
            </div>
            <Button type="submit" className="SubmitButton">
              <span>Submit</span>
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const Registration = (props: IRegistrationProps<IRegistrationData>) => {
  const initialData: IRegistrationData = {
    username: '',
    email: '',
    password: '',
  };

  const handleSubmitForm = (values: IRegistrationData) => {
    props.submitAction(values);
  };

  return (
    <div className="RegistrationBlock">
      <Formik
        initialValues={initialData}
        validationSchema={RegistrationSchema}
        onSubmit={handleSubmitForm}
      >
        {() => (
          <Form className="FormContainer">
            <div className="Section">
              <label htmlFor="username">Username:</label>
              <Field
                as={Input}
                className="Section"
                name="username"
                placeholder="Enter your username"
                autoComplete="username"
              />
              <FieldErrorMessage name="username" />
            </div>
            <div className="Section">
              <label htmlFor="email">Email:</label>
              <Field
                as={Input}
                className="Section"
                name="email"
                placeholder="Enter your email"
                autoComplete="name email"
              />
              <FieldErrorMessage name="email" />
            </div>
            <div className="Section">
              <label htmlFor="password">Password:</label>
              <Field
                as={Input}
                className="Section"
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="password"
              />
              <FieldErrorMessage name="password" />
            </div>
            <Button type="submit" className="SubmitButton">
              <span>Submit</span>
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

function Authentication() {
  const { authState$ } = useStore();
  const authState = useObservableState(authState$);

  const { login, registration } = useAuthRepository();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const defaultOptionValue = pathname.replace('/', '') as AuthStateEnum;
  const [currentAuthMode, setAuthMode] =
    useState<AuthStateEnum>(defaultOptionValue);

  // TBF: navigate to root after token changed
  useEffect(() => {
    if (authState.token) navigate('/');
  }, [authState.token]);

  useEffect(() => {
    if (pathname.includes('/login') && currentAuthMode !== 'login')
      setAuthMode('login');
    if (
      pathname.includes('/registration') &&
      currentAuthMode !== 'registration'
    )
      setAuthMode('registration');
  }, [pathname]);

  const handleAuthModeSwitcher = (value: string) => {
    navigate(`/${value}`);
  };

  const renderAuthBlock = (currentAuthMode: AuthStateEnum) => {
    if (currentAuthMode === 'login') return <Login submitAction={login} />;
    if (currentAuthMode === 'registration')
      return <Registration submitAction={registration} />;
  };

  return (
    <div className="AuthView">
      <div className="filter"></div>
      {/* <RetroBackground /> */}
      {/* <StarsBackground /> */}
      <div className="AuthBlock">
        <div className="Wrapper">
          <div className="Content">
            <div className="Title">{capitalize(currentAuthMode)}</div>
            <Switcher
              value={currentAuthMode}
              options={[
                { value: 'login', label: 'Login' },
                { value: 'registration', label: 'Registration' },
              ]}
              onChange={handleAuthModeSwitcher}
            />
            {renderAuthBlock(currentAuthMode)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Authentication;
