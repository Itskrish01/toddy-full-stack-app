import { QueryClient, QueryClientProvider } from '@tanstack/react-query';



interface Props { children: JSX.Element | JSX.Element[] }
export const Layout = ({ children }: Props) => {
    const queryClient = new QueryClient()
    return (
        <QueryClientProvider client={queryClient}>
            <div className='bg-[#eeeef4]'>
                <div className='container mx-auto max-w-7xl w-full pt-20 px-4'>
                    {children}
                </div>
            </div>
        </QueryClientProvider>
    )
}