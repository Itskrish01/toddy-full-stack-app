import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useToken } from "../hooks/useToken";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "./lib/utils";
import { Calendar } from "./ui/calendar";
import { toast } from './ui/use-toast';

interface TodoData {
    todoTitle: string | undefined;
    description: string | undefined;
    dueDate: Date | "";
    completed: boolean | undefined;
}

export default function EditModal() {
    const navigate = useNavigate()
    const { token } = useToken()
    const params = useParams()
    const queryClient = useQueryClient()
    const [todoTitle, setTodoTitle] = useState<string | undefined>("");
    const [description, setDescription] = useState<string | undefined>("");
    const [dueDate, setDueDate] = useState<Date | "">("");

    const deleteTodo = async (id: string) => {
        try {
            const { data: response } = await axios.delete(`https://plum-jittery-bull.cyclic.cloud/todos/${id}`, {
                headers: {
                    'Authorization': `${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting todo:', error);
            throw error;
        }
    };

    const newEditedTodo = async (data: TodoData) => {
        try {
            const { data: response } = await axios.put(`https://plum-jittery-bull.cyclic.cloud/todos/${params.id}`, data, {
                headers: {
                    'Authorization': `${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error editing todo:', error);
            throw error;
        }
    };

    const { data: singleTodo, isSuccess } = useQuery({
        queryKey: ["todos", params.id],
        queryFn: () =>
            axios.get(`https://plum-jittery-bull.cyclic.cloud/todos/${params.id}`, {
                headers: {
                    Authorization: `${token}`,
                },
            }),
    });

    const { mutate, isLoading } = useMutation(deleteTodo, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] })
            toast({
                title: "Successfully deleted the todo",
            })
            navigate('/')
        },
        onError: (error) => {
            // @ts-expect-error it is working fine even with error
            toast.error(error.response?.data.error);
            navigate('/')
        }
    });

    const editTodoMutation = useMutation(newEditedTodo, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] })
            toast({
                title: "Successfully updated the todo",
            })
            navigate('/')
        },
        onError: (error) => {
            // @ts-expect-error it is working fine even with error
            toast.error(error.response?.data.error);
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data: TodoData = {
            todoTitle,
            description,
            dueDate,
            completed: undefined, // Update with appropriate value
        };
        console.log(data);
        editTodoMutation.mutate(data);
    };

    useEffect(() => {
        if (singleTodo && isSuccess) {
            setTodoTitle(singleTodo?.data.todoTitle);
            setDescription(singleTodo.data.description);
            setDueDate(singleTodo?.data.dueDate);
        }
    }, [singleTodo, isSuccess]);

    return (
        <Modal
            isOpen={true}
            placement="center"
            backdrop='blur'
            onClose={() => navigate('/')}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Edit Task</ModalHeader>
                <ModalBody>
                    <Input
                        label="Title"
                        placeholder="Add Title"
                        variant="bordered"
                        value={todoTitle}
                        onChange={(e) => setTodoTitle(e.target.value)}
                    />
                    <Textarea
                        label="Description"
                        placeholder="AddDescription"
                        variant="bordered"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Popover>
                        <PopoverTrigger>
                            <Button
                                variant={"bordered"}
                                className={cn(
                                    "w-[140px] pl-3 text-left font-normal text-gray-500",
                                )}
                            >
                                <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                                {dueDate ? (
                                    format(new Date(dueDate), "PP")
                                ) : (
                                    <span>Due date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" >
                            <Calendar
                                mode="single"
                                selected={new Date(dueDate)}
                                // @ts-expect-error it is working fine even with error
                                onSelect={(date) => setDueDate(date)}
                                disabled={(date) => {
                                    console.log(date)
                                    return (
                                        date < new Date("1900-01-01")
                                    )
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </ModalBody>

                <ModalFooter className="flex justify-between">
                    <Button
                        color="danger"
                        isLoading={isLoading}
                        variant="flat"
                        // @ts-expect-error it is working fine even with error
                        onPress={() => mutate(params.id)}>
                        Delete
                    </Button>
                    <div className="space-x-2">
                        <Button variant="bordered" onPress={() => navigate('/')}>
                            Close
                        </Button>
                        <Button
                            isLoading={editTodoMutation.isLoading}
                            color='secondary'
                            // @ts-expect-error it is working fine even with error
                            onClick={handleSubmit}
                        >
                            Save changes
                        </Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
