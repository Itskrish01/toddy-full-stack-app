import React from 'react'
import { useNavigate } from "react-router-dom";
import { Divider, Input, Button, Link, Image } from '@nextui-org/react'
import { EyeSlashFilledIcon } from '../icons/EyeLashIcon'
import { EyeFilledIcon } from '../icons/EyeFilledIcon'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';

const schema = yup.object({
    username: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required()
});

interface userData {
    username: string,
    email: string,
    password: string
}

const createUser = async (data: userData) => {
    const { data: response } = await axios.post('https://plum-jittery-bull.cyclic.cloud/register', data);
    return response.data;
};

const RegisterPage = () => {
    const navigate = useNavigate()
    const [isVisible, setIsVisible] = React.useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<userData>({
        resolver: yupResolver(schema)
    });

    const { mutate, isLoading } = useMutation(createUser, {
        onSuccess: data => {
            console.log(data);
            toast.success("Successfully registered user 🎉",)
            navigate('/login')
        },
        onError: (error) => {
            if (error instanceof Error) {
                // @ts-expect-error it is working fine even with error
                toast.error(error?.response.data.error)
            } else {
                console.log('Unexpected error', error);
            }
        },

    });

    const onSubmit = (data: userData) => {
        const user = {
            ...data
        };
        mutate(user);
    };



    const toggleVisibility = () => setIsVisible(!isVisible);
    return (
        <div className='container mx-auto max-w-2xl w-full pt-20 px-4'>
            <div className='flex items-center flex-col'>
                <Image src='/logo.png' height={100} width={100} />
                <h2 className='sm:text-[36px] text-[24px] text-center font-[700] text-primaryDark mt-2'>
                    Register To Toddy
                </h2>
            </div>
            <Divider className="my-4" />
            <form className='mt-10 space-y-5' onSubmit={handleSubmit(onSubmit)}>
                <Input
                    type="text"
                    label="Username"
                    variant="bordered"
                    defaultValue=""
                    className="w-full"
                    errorMessage={errors.username && errors.username.message}
                    validationState={errors.username ? 'invalid' : 'valid'}
                    {...register('username')}
                />
                <Input
                    type="email"
                    label="Email"
                    variant="bordered"
                    defaultValue=""
                    className="w-full"
                    errorMessage={errors.email && errors.email.message}
                    validationState={errors.email ? 'invalid' : 'valid'}
                    {...register('email')}
                />
                <Input
                    label="Password"
                    variant="bordered"
                    placeholder="Enter your password"
                    endContent={
                        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                            {isVisible ? (
                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                        </button>
                    }
                    type={isVisible ? "text" : "password"}
                    className="w-full"
                    errorMessage={errors.password && errors.password.message}
                    validationState={errors.password ? 'invalid' : 'valid'}
                    {...register('password')}
                />
                <Button color="secondary" className='w-full' type='submit' isLoading={isLoading} spinner={
                    <svg
                        className="animate-spin h-5 w-5 text-current"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            fill="currentColor"
                        />
                    </svg>
                }>
                    Sign up
                </Button>
            </form>
            <div className="flex items-center mt-5">
                <div className="flex-1 border-t border-default"></div>
                <div className="px-2 text-default text-sm">OR</div>
                <div className="flex-1 border-t border-default"></div>
            </div>
            <div className='flex justify-center mt-4'>
                <Link href="/login" underline="hover" className='text-center'>Login</Link>
            </div>
        </div>
    )
}

export default RegisterPage