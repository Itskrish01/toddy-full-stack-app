import { QueryClient, QueryClientProvider } from '@tanstack/react-query';



interface Props { children: JSX.Element | JSX.Element[] }
export const Layout = ({ children }: Props) => {
    const queryClient = new QueryClient()
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}