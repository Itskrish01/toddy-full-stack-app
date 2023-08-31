import { useEffect, useState } from "react";
import axios from "axios";
import AddTodoInputBox from "../components/AddTodoInputBox";
import Todo from "../components/Todo";
import { useToken } from "../hooks/useToken";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, CardBody, Chip, Image, Spinner } from "@nextui-org/react";
import LogOutIcon from "../icons/LogOutIcon";
import { Outlet, useNavigate } from "react-router-dom";
import _ from "lodash";


interface todoData {
    _id: string;
    todoTitle: string;
    description: string;
    dueDate: Date;
    completed: boolean;
}

const TodoApp = () => {
    const { logout, userAuthenticated, token, user } = useToken();
    const [flashBorder, setFlashBorder] = useState<boolean>(false)
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false)
    const navigate = useNavigate()


    const { isLoading, data } = useQuery({
        queryKey: ["todos"],
        queryFn: () =>
            axios.get("https://plum-jittery-bull.cyclic.cloud/todos", {
                headers: {
                    Authorization: `${token}`,
                },
            }),
        onSuccess: () => { },
    });


    const todos = data?.data

    const handleLogout = () => {
        setIsLoggingOut(true)
        setTimeout(() => {
            logout();
            setIsLoggingOut(false)
        }, 2000)
    };

    function focusInput() {
        const todoAddInput = document.getElementById('title_border_input')
        todoAddInput?.focus()
        setFlashBorder(true)
    }

    useEffect(() => {
        const todoAddInput = document.getElementById('title_border_input');
        if (flashBorder) {
            todoAddInput?.scrollIntoView({ behavior: 'smooth' });

            setTimeout(() => {
                setFlashBorder(false);
            }, 3000);
        }
    }, [flashBorder]);



    useEffect(() => {
        if (!userAuthenticated) {
            navigate('/login');
        }
    }, [userAuthenticated]);

    const pending_todos = _.filter(
        todos, function (o) {
            return !o.completed;
        }
    );

    const completed_todos = _.filter(
        todos, function (o) {
            return o.completed;
        }
    );


    return (
        <>
            <div className="pb-20">
                <div className="absolute top-4 right-4">
                    <Button isLoading={isLoggingOut} color="default" aria-label="logout" className="font-bold" onClick={() => handleLogout()}>
                        {!isLoggingOut && <LogOutIcon />}
                        Logout
                    </Button>
                </div>
                <div>
                    <div className="">
                        <div className="my-10 ">
                            {todos && user && (
                                <>
                                    <h1 className="sm:text-3xl text-lg font-semibold text-black/90">Welcome back, {user?.username}</h1>
                                    <div className="flex items-center mt-6 gap-2 flex-wrap">
                                        <Card shadow="sm" className="w-full lg:w-80">
                                            <CardBody className="flex justify-between flex-row items-center">
                                                <div className="flex items-center gap-6">
                                                    <img src="check.png" alt="check" height={30} width={30} />
                                                    <h6 className="font-semibold text-gray-600">Completed</h6>
                                                </div>
                                                <Chip color="secondary" className="font-semibold">{completed_todos?.length}</Chip>
                                            </CardBody>
                                        </Card>
                                        <Card shadow="sm" className="w-full lg:w-80">
                                            <CardBody className="flex justify-between flex-row items-center">
                                                <div className="flex items-center gap-6">
                                                    <img src="wall-clock.png" alt="pending" height={30} width={30} />
                                                    <h6 className="font-semibold text-gray-600">Pending</h6>
                                                </div>
                                                <Chip color="secondary" className="font-semibold">{pending_todos?.length}</Chip>
                                            </CardBody>
                                        </Card>
                                    </div>
                                </>
                            )}
                        </div>
                        <ul className="py-4 h-96 overflow-y-auto todo-list">
                            {isLoading ?
                                <div className="flex items-center justify-center pt-20 m-0">
                                    <Spinner color="secondary" size="lg" />
                                </div>
                                : todos?.length === 0 ? (
                                    <div className="flex items-center flex-col px-2 justify-center text-center bg-white rounded-lg shadow-md py-8">
                                        <Image src="successful.png" height={100} width={100} />
                                        <span className="text-center flex items-center justify-center mt-6 text-lg font-semibold text-primaryDark">You have no tasks to do! Enjoy your day or</span>
                                        <Button color="secondary" onClick={focusInput} type="button" className="mt-2" variant="light">
                                            Add new Todo
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2">
                                        {todos?.map((todo: todoData, index: number) => (
                                            <Todo
                                                key={todo._id}
                                                _id={todo._id}
                                                className={`${index !== todos.length - 1 ? "border-b border-[#ebebf0]" : ""}`}
                                                todoTitle={todo.todoTitle}
                                                description={todo.description}
                                                dueDate={todo.dueDate}
                                                completed={todo.completed}
                                            />
                                        ))}
                                    </div>
                                )}
                        </ul>
                    </div>
                    <div className="mt-8">
                        <AddTodoInputBox flashBorder={flashBorder} />
                    </div>
                </div>
            </div>
            <Outlet />
        </>
    );
};

export default TodoApp;
