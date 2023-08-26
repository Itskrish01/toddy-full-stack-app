import { useEffect } from "react";
import axios from "axios";
import AddTodoInputBox from "../components/AddTodoInputBox";
import Todo from "../components/Todo";
import { useToken } from "../hooks/useToken";
import { useQuery } from "@tanstack/react-query";
import { Button, Spinner } from "@nextui-org/react";
import LogOutIcon from "../icons/LogOutIcon";
import { Outlet, useNavigate } from "react-router-dom";


interface todoData {
    _id: string;
    todoTitle: string;
    description: string;
    dueDate: Date;
    completed: boolean;
}

const TodoApp = () => {
    const { logout, userAuthenticated, token, user } = useToken();
    const navigate = useNavigate()

    const { isLoading, data } = useQuery({
        queryKey: ["todos"],
        queryFn: () =>
            axios.get("https://todd-backend.onrender.com/todos", {
                headers: {
                    Authorization: `${token}`,
                },
            }),
        onSuccess: () => { },
    });

    const todos = data?.data

    const handleLogout = () => {
        logout();
    };

    useEffect(() => {
        if (!userAuthenticated) {
            navigate('/login');
        }
    }, [userAuthenticated]);

    return (
        <>
            <div className="bg-[#eeeef4] pb-20">
                <div className="absolute top-4 right-4">
                    <Button color="default" aria-label="logout" className="font-bold" onClick={() => handleLogout()}>
                        <LogOutIcon />
                        Logout
                    </Button>
                </div>
                <div className="container mx-auto max-w-4xl px-4 pt-20">
                    <div className="">
                        <div className="my-10 ">
                            {todos && user && (
                                <>
                                    <h1 className="sm:text-3xl text-lg font-semibold text-black/90">Welcome back, {user?.username}</h1>
                                    <p className="mt-2 text-slate-700">{todos && todos?.length === 0 ? "No work to do 🎉" : `You've got ${todos?.filter((todo: todoData) => todo?.completed !== true).length} tasks coming up in the next days.`}</p>
                                </>
                            )}

                        </div>
                        <ul className=" py-4 items-center  justify-between space-y-4 h-96 overflow-y-auto todo-list">
                            {isLoading ?
                                <div className="flex items-center justify-center pt-20 m-0">
                                    <Spinner color="secondary" size="lg" />
                                </div>
                                : todos?.length === 0 ? (
                                    <span className="text-center flex items-center justify-center mt-10 text-lg font-semibold text-gray-400">No todos are here, Add some todos.</span>
                                ) : (
                                    todos?.map((todo: todoData, index: number) => (
                                        <Todo
                                            key={todo._id}
                                            _id={todo._id}
                                            className={`${index !== todos.length - 1 ? "border-b border-[#ebebf0]" : ""}`}
                                            todoTitle={todo.todoTitle}
                                            description={todo.description}
                                            dueDate={todo.dueDate}
                                            completed={todo.completed}
                                        />
                                    ))
                                )}
                        </ul>
                    </div>
                    <div className="mt-8">
                        <AddTodoInputBox />
                    </div>
                </div>
            </div>
            <Outlet />
        </>
    );
};

export default TodoApp;
