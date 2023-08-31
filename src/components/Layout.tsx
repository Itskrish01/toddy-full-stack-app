interface Props { children: JSX.Element | JSX.Element[] }
export const Layout = ({ children }: Props) => {

    return (
        <div className='bg-[#eeeef4]'>
            <div className='container mx-auto max-w-7xl w-full pt-20 px-4'>
                {children}
            </div>
        </div>
    )
}